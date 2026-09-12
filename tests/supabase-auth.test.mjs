import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../cloud/client.ts", import.meta.url), "utf8");

test("Supabase password and Google sign-in preserve the existing account UI", () => {
  assert.match(source, /supabase\.auth\.signInWithPassword/);
  assert.match(source, /supabase\.auth\.signInWithOAuth\(\{ provider: "google"/);
  assert.match(source, /supabase\.auth\.signUp/);
  assert.match(source, /emailRedirectTo: getWorkspaceRedirectUrl\(\)/);
});

test("Supabase signup confirmation supports the existing verification screen", () => {
  assert.match(source, /supabase\.auth\.verifyOtp/);
  assert.match(source, /type: "signup"/);
  assert.match(source, /Check your email/);
  assert.match(source, /autocomplete="one-time-code"/);
  assert.doesNotMatch(source, /Clerk|clerk|Convex|convex/);
});
