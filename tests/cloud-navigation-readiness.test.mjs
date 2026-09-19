import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../cloud/client.ts", import.meta.url), "utf8");

test("workspace readiness waits for authentication and data hydration", () => {
  const initializeBody = source.slice(source.indexOf("async function initialize()"), source.indexOf("function showPublicLanding()"));
  const hydrateIndex = initializeBody.indexOf("await hydrateUserData(user)");
  const adminIndex = initializeBody.indexOf("await initializeAdminPanel()");
  const openIndex = initializeBody.indexOf("openAuthorizedWorkspace()");

  assert.ok(hydrateIndex > 0, "cloud data should hydrate before opening the workspace");
  assert.ok(adminIndex > hydrateIndex, "admin controls should initialize after hydration");
  assert.ok(openIndex > adminIndex, "the workspace should open only after admin controls are ready");
  assert.match(initializeBody, /async function initialize\(\) \{\s+if \(!config\.supabaseUrl \|\| !config\.supabaseAnonKey/);
});

test("cloud hydration does not force a page reload", () => {
  const initializeBody = source.slice(source.indexOf("async function initialize()"), source.indexOf("function showPublicLanding()"));
  assert.doesNotMatch(initializeBody, /location\.reload\(\)/);
});

test("refresh-time Supabase failures retry and do not expose object placeholders", () => {
  assert.match(source, /async function retryCloudResult/);
  assert.match(source, /await retryCloudResult\(\(\) => supabase!\.auth\.getSession\(\)\)/);
  assert.match(source, /Workspace opened with local data while Supabase synchronization recovers/);
  assert.match(source, /message !== "\[object Object\]"/);
  assert.match(source, /The cloud service could not complete the request/);
});
