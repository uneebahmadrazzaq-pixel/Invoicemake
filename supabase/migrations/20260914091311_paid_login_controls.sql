alter table public.profiles
  add column if not exists login_policy text not null default 'single_browser_ip'
    check (login_policy in ('single_browser_ip', 'unrestricted')),
  add column if not exists locked_browser_id uuid,
  add column if not exists locked_ip inet,
  add column if not exists active_session_id uuid,
  add column if not exists last_login_at timestamptz;

-- Administrators must be able to recover customer access even when moving devices.
update public.profiles
set login_policy = 'unrestricted',
    locked_browser_id = null,
    locked_ip = null,
    active_session_id = null
where role = 'admin';

create index if not exists profiles_active_session_id_idx
  on public.profiles (active_session_id)
  where active_session_id is not null;

create or replace function private.current_session_allowed()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and (
        p.login_policy = 'unrestricted'
        or (
          p.locked_browser_id is not null
          and p.active_session_id is not null
          and p.active_session_id = nullif((select auth.jwt()) ->> 'session_id', '')::uuid
        )
      )
  );
$$;

create or replace function private.is_active_user()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.current_session_allowed() and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.status = 'active'
      and (p.access_starts_at is null or p.access_starts_at <= now())
      and (p.access_ends_at is null or p.access_ends_at >= now())
  );
$$;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.current_session_allowed() and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'
      and p.status = 'active'
      and (p.access_starts_at is null or p.access_starts_at <= now())
      and (p.access_ends_at is null or p.access_ends_at >= now())
  );
$$;

drop function if exists public.admin_update_user_access(uuid,text,text,text,text[],text[],timestamptz,timestamptz);

create function public.admin_update_user_access(
  p_user_id uuid,
  p_role text,
  p_status text,
  p_template_access text,
  p_allowed_template_ids text[],
  p_feature_access text[],
  p_access_starts_at timestamptz default null,
  p_access_ends_at timestamptz default null,
  p_login_policy text default 'single_browser_ip',
  p_authorized_ip text default null,
  p_reset_login_lock boolean default false
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  parsed_ip inet;
  existing_policy text;
  existing_ip inet;
begin
  if not private.is_admin() then raise exception 'Administrator access is required.'; end if;
  if p_role not in ('admin','user')
    or p_status not in ('pending','active','suspended')
    or p_template_access not in ('all','custom')
    or p_login_policy not in ('single_browser_ip','unrestricted') then
    raise exception 'Invalid access settings.';
  end if;
  if p_access_starts_at is not null and p_access_ends_at is not null and p_access_ends_at < p_access_starts_at then
    raise exception 'The access end date cannot be before the start date.';
  end if;
  if p_user_id = uid and (p_role <> 'admin' or p_status <> 'active' or p_login_policy <> 'unrestricted'
    or (p_access_starts_at is not null and p_access_starts_at > now())
    or (p_access_ends_at is not null and p_access_ends_at < now())) then
    raise exception 'You cannot restrict, remove, suspend, schedule, or expire your own administrator access.';
  end if;

  if nullif(trim(coalesce(p_authorized_ip, '')), '') is not null then
    begin
      parsed_ip := trim(p_authorized_ip)::inet;
    exception when invalid_text_representation then
      raise exception 'Enter a valid IPv4 or IPv6 address.';
    end;
  end if;

  select login_policy, locked_ip
  into existing_policy, existing_ip
  from public.profiles
  where id = p_user_id;
  if not found then raise exception 'User not found.'; end if;

  update public.profiles set
    role = p_role,
    status = p_status,
    template_access = p_template_access,
    allowed_template_ids = coalesce((select array_agg(distinct value) from unnest(coalesce(p_allowed_template_ids, '{}'::text[])) value), '{}'::text[]),
    feature_access = coalesce((select array_agg(distinct value) from unnest(coalesce(p_feature_access, '{}'::text[])) value), '{}'::text[]),
    access_starts_at = p_access_starts_at,
    access_ends_at = p_access_ends_at,
    login_policy = p_login_policy,
    locked_ip = case when p_login_policy = 'unrestricted' then null else parsed_ip end,
    locked_browser_id = case
      when p_login_policy = 'unrestricted' or p_reset_login_lock or existing_policy <> p_login_policy or existing_ip is distinct from parsed_ip then null
      else locked_browser_id
    end,
    active_session_id = case
      when p_login_policy = 'unrestricted' or p_reset_login_lock or existing_policy <> p_login_policy or existing_ip is distinct from parsed_ip then null
      else active_session_id
    end,
    updated_at = now()
  where id = p_user_id;

  insert into public.audit_logs(actor_user_id, target_user_id, action, details)
  values (uid, p_user_id, 'user_access_updated', jsonb_build_object(
    'role', p_role, 'status', p_status, 'templateAccess', p_template_access,
    'allowedTemplateIds', p_allowed_template_ids, 'featureAccess', p_feature_access,
    'accessStartsAt', p_access_starts_at, 'accessEndsAt', p_access_ends_at,
    'loginPolicy', p_login_policy, 'authorizedIp', parsed_ip::text,
    'loginLockReset', p_reset_login_lock
  ));
  return true;
end;
$$;

create or replace function public.claim_login_access(
  p_user_id uuid,
  p_browser_id uuid,
  p_ip inet,
  p_session_id uuid
)
returns table (
  allowed boolean,
  reason text,
  login_policy text,
  authorized_ip text,
  browser_locked boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  profile_row public.profiles%rowtype;
begin
  select * into profile_row from public.profiles where id = p_user_id for update;
  if not found then
    return query select false, 'Your account profile is unavailable.', null::text, null::text, false;
    return;
  end if;

  if profile_row.login_policy = 'unrestricted' then
    update public.profiles set last_login_at = now(), updated_at = now() where id = p_user_id;
    return query select true, 'Access allowed from any browser.', profile_row.login_policy, null::text, false;
    return;
  end if;

  if profile_row.locked_ip is not null and profile_row.locked_ip <> p_ip then
    return query select false, 'This account is authorized for a different IP address. Ask the administrator to update or reset the login lock.', profile_row.login_policy, profile_row.locked_ip::text, profile_row.locked_browser_id is not null;
    return;
  end if;
  if profile_row.locked_browser_id is not null and profile_row.locked_browser_id <> p_browser_id then
    return query select false, 'This account is already linked to another browser. Ask the administrator to reset the browser/IP lock.', profile_row.login_policy, profile_row.locked_ip::text, true;
    return;
  end if;

  update public.profiles set
    locked_ip = coalesce(locked_ip, p_ip),
    locked_browser_id = coalesce(locked_browser_id, p_browser_id),
    active_session_id = p_session_id,
    last_login_at = now(),
    updated_at = now()
  where id = p_user_id;

  return query select true, 'Browser and IP access verified.', profile_row.login_policy,
    coalesce(profile_row.locked_ip, p_ip)::text, true;
end;
$$;

drop policy if exists presence_delete on public.presence;
create policy presence_delete on public.presence for delete to authenticated
using (user_id = (select auth.uid()) and private.current_session_allowed());

drop policy if exists avatar_insert_own on storage.objects;
create policy avatar_insert_own on storage.objects for insert to authenticated
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text and private.current_session_allowed());
drop policy if exists avatar_update_own on storage.objects;
create policy avatar_update_own on storage.objects for update to authenticated
using (bucket_id = 'avatars' and owner_id = (select auth.uid())::text and private.current_session_allowed())
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text and private.current_session_allowed());
drop policy if exists avatar_delete_own on storage.objects;
create policy avatar_delete_own on storage.objects for delete to authenticated
using (bucket_id = 'avatars' and owner_id = (select auth.uid())::text and private.current_session_allowed());

revoke all on function private.current_session_allowed() from public, anon;
grant execute on function private.current_session_allowed() to authenticated, service_role;
revoke all on function public.admin_update_user_access(uuid,text,text,text,text[],text[],timestamptz,timestamptz,text,text,boolean) from public, anon;
grant execute on function public.admin_update_user_access(uuid,text,text,text,text[],text[],timestamptz,timestamptz,text,text,boolean) to authenticated;
revoke all on function public.claim_login_access(uuid,uuid,inet,uuid) from public, anon, authenticated;
grant execute on function public.claim_login_access(uuid,uuid,inet,uuid) to service_role;
