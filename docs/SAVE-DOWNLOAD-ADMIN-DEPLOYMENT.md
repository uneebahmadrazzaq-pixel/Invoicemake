# Save-first invoices and administrator activity

## Deployment status

Implemented and verified locally. Do **not** publish the frontend until the migration and Edge Function below have been deployed to the same Supabase project as `login-access`. Publishing only the static website would block all invoice downloads, because accounting intentionally fails closed.

No Supabase deployment credentials or signed-in CLI were available during implementation. No production users were deleted, no production database was changed, and this release was not pushed to GitHub/Netlify/Pages.

## Rollout order

1. With an authenticated Supabase deployment session, review and apply `supabase/migrations/202610240001_invoice_download_activity.sql`. Back up the database first using the normal project procedure. This adds customer/download tables, an owner-bound download RPC, an administrator report RPC, and protected deletion preflight. Existing customer IDs are backfilled; old downloads cannot be reconstructed.
2. Deploy `supabase/functions/admin-delete-user/index.ts` to the existing project. It uses the same server-provided `SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` conventions as `login-access`. Never place the service-role key in browser code or Git.
3. Verify RPCs through a test account: a normal user must not read admin reports or authorize deletion; unsaved, edited, wrong-owner and disallowed-template snapshots must be rejected. Deletion must reject self/admin targets and a mismatched confirmation email. Do not delete a real account as a smoke test without a specifically authorized target.
4. Run `pnpm netlify:build`, `pnpm exec tsc --noEmit`, and the relevant tests. Publish the validated commit to `origin/main`, safely synchronized with remote work, then refresh the actual site's full static `public` output and wait for deployment success. Do not use `codex-hosting` for this workflow.

## Behaviour

- Single PDF, compressed PDF and JPG actions are hidden until an explicit save succeeds in the cloud. Editing invoice content hides them again. Failed saves roll back the local saved-record change and do not unlock downloads.
- Bulk invoices have stable IDs. Saving again updates the same saved records rather than duplicating them. Individual and combined bulk downloads use saved snapshots only; changes to rows, metadata, customer or defaults require resaving.
- Concurrent exports are blocked. Download accounting runs only after rendering and before the file is released. The server validates the actual saved snapshot, owner, customer and current template permission. Retries with the same request ID do not duplicate events. A bulk request counts each invoice once.
- The report shows customers added/recorded, distinct downloaded invoices and download starts per customer for each user. Browser file completion or cancellation cannot be observed, so it does not claim completed downloads. Removed customers remain in the count after tracking starts; already-removed historical customers cannot be recovered.
- A user-deletion button appears only for other non-administrator accounts. Typed email confirmation clearly warns that account, invoices, customers, history and avatar are permanently removed. The server rechecks the caller and target, records the request, removes the target's avatar through the Storage API, and uses `auth.admin.deleteUser`. Auth deletion cascades application records. Administrator accounts are protected; the operator cannot delete themselves.
- Storage uploads are serialized by storage key so an older autosave cannot overtake an explicit Save operation.

## Verification

`tests/save-before-download.test.mjs` covers save/failed-save/edit/bulk/download gates. `tests/invoice-activity-database.test.mjs` applies the real migration in an in-memory PostgreSQL engine and tests authorization, backfill, snapshot matching, RLS and idempotency. `tests/admin-user-deletion.test.mjs` tests server deletion ordering and rejections with mocks; it never deletes a real user. Local browser QA uses synthetic data and stubbed network calls; it is not proof of production deployment.

The broader pre-existing static test suite has 18 failures (stale cache/version/string expectations and an incomplete GO SUPPS fixture). The same failures were reproduced against an untouched archive of the previous `HEAD`; no unrelated supplier tests were rewritten to conceal them. The relevant focused checks, production static build and TypeScript validation pass. This is an additional reason not to describe this work as an entirely green full-suite production release.
