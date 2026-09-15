import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../cloud/client.ts", import.meta.url), "utf8");
const buildScript = await readFile(new URL("../scripts/build-cloud-client.mjs", import.meta.url), "utf8");
const authStyles = await readFile(new URL("../public/editor/cloud/cloud.css", import.meta.url), "utf8");
const brandStyles = await readFile(new URL("../public/editor/invoice-studio-brand.css", import.meta.url), "utf8");

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

test("account modal uses the coloured logo and improved account typography", () => {
  assert.match(brandStyles, /invoice-auth-brand \.invoice-auth-logo\s*\{[\s\S]*?filter: none/);
  assert.match(authStyles, /invoice-auth-shell[\s\S]*?font-family: "Outfit", "Inter"/);
  assert.match(authStyles, /invoice-auth-panel > \.invoice-auth-eyebrow[\s\S]*?font-size: 16px/);
  assert.match(authStyles, /invoice-auth-panel > h1[\s\S]*?clamp\(36px, 3\.6vw, 50px\)/);
  assert.match(authStyles, /invoice-verification-note[\s\S]*?font: 500 17px\/1\.55 "Outfit"/);
});

test("account modal uses the website purple palette without changing invoice templates", () => {
  assert.match(authStyles, /--invoice-auth-ink:\s*#2b1d55/);
  assert.match(authStyles, /--invoice-auth-copy:\s*#624f82/);
  assert.match(authStyles, /\.invoice-auth-panel > h1[\s\S]*?color:\s*var\(--invoice-auth-ink\)/);
  assert.match(authStyles, /\.invoice-auth-intro[\s\S]*?color:\s*var\(--invoice-auth-copy\)/);
  assert.match(authStyles, /\.invoice-auth-divider[\s\S]*?color:\s*var\(--invoice-auth-muted\)/);
  assert.match(authStyles, /\.invoice-auth-switch[\s\S]*?color:\s*var\(--invoice-auth-copy\)/);
});

test("hCaptcha protects password sign-in, signup, and password reset", () => {
  assert.match(buildScript, /hcaptchaSiteKey/);
  assert.match(buildScript, /c04c6d90-8124-444c-af1c-39deb6d413d0/);
  assert.match(source, /https:\/\/js\.hcaptcha\.com\/1\/api\.js\?render=explicit/);
  assert.match(source, /sitekey: config\.hcaptchaSiteKey/);
  assert.match(source, /auth\.signUp\([\s\S]*?captchaToken/);
  assert.match(source, /auth\.signInWithPassword\([\s\S]*?options: \{ captchaToken \}/);
  assert.match(source, /resetPasswordForEmail\([\s\S]*?captchaToken/);
});
