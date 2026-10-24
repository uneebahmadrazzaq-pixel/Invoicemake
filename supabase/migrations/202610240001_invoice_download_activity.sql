-- Trusted customer/download reporting. Never grant users direct event writes.
create table public.customer_activity (
  user_id uuid not null references public.profiles(id) on delete cascade,
  customer_id text not null,
  customer_name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (user_id, customer_id)
);
create table public.invoice_download_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  customer_id text not null,
  customer_name text not null,
  invoice_id text not null,
  invoice_number text not null,
  template_id text not null,
  format text not null,
  request_id uuid not null,
  created_at timestamptz not null default now(),
  unique(user_id, request_id, invoice_id)
);
create index invoice_download_events_customer_idx on public.invoice_download_events(user_id,customer_id,created_at desc);
alter table public.customer_activity enable row level security;
alter table public.invoice_download_events enable row level security;
revoke all on public.customer_activity, public.invoice_download_events from anon, authenticated;
grant select on public.customer_activity, public.invoice_download_events to authenticated;
create policy customer_activity_admin_read on public.customer_activity for select to authenticated using (private.is_admin());
create policy invoice_download_admin_read on public.invoice_download_events for select to authenticated using (private.is_admin());

create function private.sync_customer_activity() returns trigger
language plpgsql security definer set search_path = '' as $$
declare customer jsonb;
begin
  if new.storage_key <> 'mc011-invoice-editor-v1' then return new; end if;
  if jsonb_typeof(new.payload->'clients') is distinct from 'array' then return new; end if;
  update public.customer_activity set active=false where user_id=new.user_id;
  for customer in select value from jsonb_array_elements(new.payload->'clients') loop
    if coalesce(customer->>'id','') = '' then continue; end if;
    insert into public.customer_activity(user_id,customer_id,customer_name)
      values(new.user_id,customer->>'id',coalesce(nullif(customer->>'name',''),nullif(customer->>'company',''),'Unnamed customer'))
      on conflict(user_id,customer_id) do update set customer_name=excluded.customer_name,active=true;
  end loop;
  return new;
end;
$$;
create trigger sync_customer_activity after insert or update of payload on public.user_data
  for each row execute function private.sync_customer_activity();
insert into public.customer_activity(user_id,customer_id,customer_name)
select d.user_id,c->>'id',coalesce(nullif(c->>'name',''),nullif(c->>'company',''),'Unnamed customer')
from public.user_data d cross join lateral jsonb_array_elements(case when jsonb_typeof(d.payload->'clients')='array' then d.payload->'clients' else '[]'::jsonb end) c
where d.storage_key='mc011-invoice-editor-v1' and coalesce(c->>'id','')<>''
on conflict do nothing;

create function public.record_invoice_download(p_request_id uuid,p_invoices jsonb,p_format text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare uid uuid:=auth.uid(); payload_value jsonb; requested jsonb; saved jsonb; customer public.customer_activity;
begin
  if not private.is_active_user() then raise exception 'Active account required.'; end if;
  if p_request_id is null or p_format not in ('pdf','compressed_pdf','jpg','bulk_pdf','bulk_compressed_pdf') then raise exception 'Invalid download request.'; end if;
  if jsonb_typeof(p_invoices) is distinct from 'array' or jsonb_array_length(p_invoices) not between 1 and 5000 then raise exception 'Invalid invoice list.'; end if;
  select payload into payload_value from public.user_data
    where user_id=uid and storage_key='mc011-invoice-editor-v1' for share;
  for requested in select value from jsonb_array_elements(p_invoices) loop
    saved:=null;
    select value into saved from jsonb_array_elements(coalesce(payload_value->'invoices','[]'::jsonb))
      where value->>'id'=requested->>'id' limit 1;
    if saved is null or coalesce(saved->>'clientId','')='' then raise exception 'Save this invoice for a customer before downloading.'; end if;
    if (saved - array['savedAt','status','savedSource']) is distinct from (requested - array['savedAt','status','savedSource']) then
      raise exception 'This invoice has changed. Save it again before downloading.';
    end if;
    if not private.can_use_template(saved->>'templateId') then raise exception 'Template access denied.'; end if;
    select * into customer from public.customer_activity where user_id=uid and customer_id=saved->>'clientId';
    if not found then raise exception 'Save the customer before downloading.'; end if;
    insert into public.invoice_download_events(user_id,customer_id,customer_name,invoice_id,invoice_number,template_id,format,request_id)
      values(uid,customer.customer_id,customer.customer_name,saved->>'id',coalesce(saved->>'invoiceNumber',''),saved->>'templateId',p_format,p_request_id)
      on conflict(user_id,request_id,invoice_id) do nothing;
  end loop;
  return true;
end;
$$;

create function public.admin_user_activity() returns jsonb
language plpgsql security definer set search_path = '' as $$
declare result jsonb;
begin
  if not private.is_admin() then raise exception 'Administrator access required.'; end if;
  select coalesce(jsonb_agg(stats),'[]'::jsonb) into result from (
    select p.id as user_id,
      (select count(*) from public.customer_activity c where c.user_id=p.id) as customer_count,
      (select count(*) from public.invoice_download_events e where e.user_id=p.id) as download_count,
      (select coalesce(jsonb_agg(customers order by customers.customer_name),'[]'::jsonb) from (
        select c.customer_id,c.customer_name,c.active,c.created_at,
          count(e.id) as downloads,max(e.created_at) as last_download_at,
          count(distinct e.invoice_id) as distinct_invoices
        from public.customer_activity c left join public.invoice_download_events e
          on e.user_id=c.user_id and e.customer_id=c.customer_id
        where c.user_id=p.id group by c.user_id,c.customer_id,c.customer_name,c.active,c.created_at
      ) customers) as customers
    from public.profiles p
  ) stats;
  return result;
end;
$$;

-- Called with the caller's JWT, never with a browser-supplied actor ID.
create function public.admin_delete_user_preflight(p_user_id uuid,p_confirmation_email text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare target public.profiles;
begin
  if not private.is_admin() then raise exception 'Administrator access required.'; end if;
  if p_user_id=auth.uid() then raise exception 'You cannot delete your own account.'; end if;
  select * into target from public.profiles where id=p_user_id;
  if not found then raise exception 'User not found.'; end if;
  if target.role='admin' then raise exception 'Administrator accounts are protected from deletion.'; end if;
  if lower(trim(p_confirmation_email)) is distinct from lower(target.email) then raise exception 'Confirmation email does not match.'; end if;
  return jsonb_build_object('id',target.id,'email',target.email);
end;
$$;
revoke all on function private.sync_customer_activity() from public,anon,authenticated;
revoke all on function public.record_invoice_download(uuid,jsonb,text) from public,anon;
revoke all on function public.admin_user_activity() from public,anon;
revoke all on function public.admin_delete_user_preflight(uuid,text) from public,anon;
grant execute on function public.record_invoice_download(uuid,jsonb,text),public.admin_user_activity(),public.admin_delete_user_preflight(uuid,text) to authenticated;
notify pgrst, 'reload schema';
