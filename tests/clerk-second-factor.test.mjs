import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../cloud/client.ts", import.meta.url), "utf8");

test("password sign-in opens the additional verification step", () => {
  assert.match(source, /result\.status === "needs_second_factor"/);
  assert.match(source, /beginSecondFactor\(result\.supportedSecondFactors \|\| \[\]\)/);
  assert.match(source, /prepareSecondFactor/);
  assert.match(source, /attemptSecondFactor/);
});

test("verification screen supports Clerk second-factor methods", () => {
  for (const strategy of ["email_code", "phone_code", "totp", "backup_code"]) {
    assert.match(source, new RegExp(`strategy: "${strategy}"`));
  }
  assert.match(source, /Verify it&rsquo;s you/);
  assert.match(source, /autocomplete="one-time-code"/);
  assert.doesNotMatch(source, /throw new Error\("Additional verification is required for this account\."\)/);
});
