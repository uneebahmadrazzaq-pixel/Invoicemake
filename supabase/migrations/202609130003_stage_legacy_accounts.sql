create table if not exists private.legacy_accounts (
  email text primary key,
  profile jsonb not null,
  user_data jsonb not null default '[]'::jsonb,
  imported_at timestamptz not null default now()
);

revoke all on private.legacy_accounts from public, anon, authenticated;

create or replace function private.provision_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  bootstrap_admin boolean;
  legacy private.legacy_accounts%rowtype;
  first_name_value text;
  last_name_value text;
  full_name_value text;
begin
  select * into legacy
  from private.legacy_accounts
  where email = lower(coalesce(new.email, ''))
  for update;

  select not exists (select 1 from public.profiles)
    and not exists (select 1 from private.legacy_accounts)
    into bootstrap_admin;

  first_name_value := coalesce(
    nullif(trim(legacy.profile ->> 'firstName'), ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'first_name', '')), '')
  );
  last_name_value := coalesce(
    nullif(trim(legacy.profile ->> 'lastName'), ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'last_name', '')), '')
  );
  full_name_value := coalesce(
    nullif(trim(legacy.profile ->> 'name'), ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), '')
  );

  insert into public.profiles (
    id, email, name, first_name, last_name, phone_number, image_url,
    role, status, template_access, allowed_template_ids, feature_access,
    access_starts_at, access_ends_at
  ) values (
    new.id,
    lower(coalesce(new.email, '')),
    coalesce(full_name_value, nullif(split_part(coalesce(new.email, ''), '@', 1), ''), 'Invoice user'),
    first_name_value,
    last_name_value,
    coalesce(nullif(trim(legacy.profile ->> 'phoneNumber'), ''), nullif(trim(coalesce(new.raw_user_meta_data ->> 'phone_number', '')), '')),
    coalesce(nullif(trim(legacy.profile ->> 'imageUrl'), ''), nullif(trim(coalesce(new.raw_user_meta_data ->> 'avatar_url', '')), '')),
    case when legacy.email is not null and legacy.profile ->> 'role' = 'admin' then 'admin' when bootstrap_admin then 'admin' else 'user' end,
    case when legacy.email is not null and legacy.profile ->> 'status' in ('pending','active','suspended') then legacy.profile ->> 'status' when bootstrap_admin then 'active' else 'pending' end,
    case when legacy.email is not null and legacy.profile ->> 'templateAccess' = 'all' then 'all' when bootstrap_admin then 'all' else 'custom' end,
    coalesce((select array_agg(value) from jsonb_array_elements_text(coalesce(legacy.profile -> 'allowedTemplateIds', '[]'::jsonb)) value), '{}'::text[]),
    case when bootstrap_admin then array['bulkInvoiceGenerator','dataCleaning','manualDataCleaning','metadataRemover','pdfCompressor']::text[]
      else coalesce((select array_agg(value) from jsonb_array_elements_text(coalesce(legacy.profile -> 'featureAccess', '[]'::jsonb)) value), '{}'::text[]) end,
    case when nullif(legacy.profile ->> 'accessStartsAt', '') is not null then to_timestamp((legacy.profile ->> 'accessStartsAt')::double precision / 1000.0) end,
    case when nullif(legacy.profile ->> 'accessEndsAt', '') is not null then to_timestamp((legacy.profile ->> 'accessEndsAt')::double precision / 1000.0) end
  ) on conflict (id) do nothing;

  if legacy.email is not null then
    insert into public.user_data (user_id, storage_key, payload, byte_length, active_template_id, created_at, updated_at)
    select
      new.id,
      item ->> 'storageKey',
      item -> 'payload',
      greatest(coalesce((item ->> 'byteLength')::integer, 0), 0),
      nullif(item ->> 'activeTemplateId', ''),
      now(),
      now()
    from jsonb_array_elements(legacy.user_data) item
    where item ->> 'storageKey' in (
      'mc011-invoice-editor-v1',
      'mc011-data-splitter-projects-v1',
      'mc011-supplier-profile-overrides-v1'
    )
    on conflict (user_id, storage_key) do update set
      payload = excluded.payload,
      byte_length = excluded.byte_length,
      active_template_id = excluded.active_template_id,
      updated_at = now();

    delete from private.legacy_accounts where email = legacy.email;
  end if;

  return new;
end;
$$;
