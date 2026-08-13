import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../public/editor/index.html", import.meta.url), "utf8");
const cloudSource = await readFile(new URL("../cloud/client.ts", import.meta.url), "utf8");

test("workspace identity shows one private profile control and no backend status", () => {
  assert.match(html, /id="studioProfileButton"/);
  assert.match(html, /data-user-first-name/);
  assert.match(html, /data-user-role/);
  assert.match(html, />Log out<\/button>/);
  assert.doesNotMatch(html, /id="cloudConnectionStatus"/);
  assert.doesNotMatch(html, /id="clerkUserButton"/);
  assert.doesNotMatch(html, /studio-language/);
});

test("identity uses first name, profile photo, and Clerk profile editing", () => {
  assert.match(cloudSource, /clerk\?\.user\?\.firstName/);
  assert.match(cloudSource, /data-user-avatar/);
  assert.match(cloudSource, /openUserProfile\(\)/);
  assert.match(cloudSource, /imageUrl/);
});
