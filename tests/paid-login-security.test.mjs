import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const [client, migration, edge, styles] = await Promise.all([
  readFile(new URL("cloud/client.ts", root), "utf8"),
  readFile(new URL("supabase/migrations/20260914091311_paid_login_controls.sql", root), "utf8"),
  readFile(new URL("supabase/functions/login-access/index.ts", root), "utf8"),
  readFile(new URL("public/editor/cloud/cloud.css", root), "utf8"),
]);

test("password recovery is available without an email-change control", () => {
  assert.match(client, /Forgot password\?/);
  assert.match(client, /resetPasswordForEmail/);
  assert.match(client, /PASSWORD RESET/);
  assert.match(client, /supabase\.auth\.updateUser\(\{ password \}\)/);
  assert.doesNotMatch(client, /change email|change-email/i);
});

test("paid accounts are checked by a server-side browser and IP gate", () => {
  assert.match(client, /supabase\.functions\.invoke\("login-access"/);
  assert.match(client, /crypto\.randomUUID\(\)/);
  assert.match(client, /One browser \+ one IP/);
  assert.match(client, /Any browser \/ IP/);
  assert.match(client, /Reset browser\/IP lock/);
  assert.match(styles, /cloud-login-security-grid/);
  assert.match(edge, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(edge, /authClient\.auth\.getUser\(token\)/);
  assert.match(edge, /x-forwarded-for/);
});

test("database access is bound to the claimed Supabase session", () => {
  assert.match(migration, /login_policy text not null default 'single_browser_ip'/);
  assert.match(migration, /private\.current_session_allowed\(\)/);
  assert.match(migration, /auth\.jwt\(\)[\s\S]*?session_id/);
  assert.match(migration, /claim_login_access/);
  assert.match(migration, /grant execute on function public\.claim_login_access[\s\S]*?to service_role/);
  assert.match(migration, /revoke all on function public\.claim_login_access[\s\S]*?authenticated/);
  assert.match(migration, /where role = 'admin'/);
});
