create index if not exists audit_logs_actor_user_id_idx
  on public.audit_logs (actor_user_id);

create index if not exists audit_logs_target_user_id_idx
  on public.audit_logs (target_user_id);
