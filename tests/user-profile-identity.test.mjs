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

test("identity uses the full name, profile photo, and Supabase profile editing", () => {
  assert.match(cloudSource, /authUser\?\.user_metadata\?\.first_name/);
  assert.match(cloudSource, /authUser\?\.user_metadata\?\.full_name/);
  assert.match(cloudSource, /Welcome back, \$\{fullName\}/);
  assert.match(cloudSource, /data-user-avatar/);
  assert.match(cloudSource, /openProfileEditor/);
  assert.match(cloudSource, /storage\.from\("avatars"\)\.upload/);
  assert.match(cloudSource, /supabase\.auth\.updateUser/);
  assert.match(cloudSource, /imageUrl/);
  assert.match(cloudSource, /setProperty\("background-image"[\s\S]*?"important"\)/);
  assert.doesNotMatch(html, /Welcome back, Uneeb Ahmad/);
});
