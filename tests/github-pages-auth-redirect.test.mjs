import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [source, editorHtml] = await Promise.all([
  readFile(new URL("../cloud/client.ts", import.meta.url), "utf8"),
  readFile(new URL("../public/editor/index.html", import.meta.url), "utf8"),
]);

test("authentication preserves the GitHub Pages project path", () => {
  assert.match(source, /document\.currentScript as HTMLScriptElement/);
  assert.match(source, /editorEntryUrl = new URL\("\.\.\/index\.html", cloudClientScriptUrl\)\.toString\(\)/);
  assert.match(source, /const returnLocation = new URL\(editorEntryUrl\)/);
  assert.match(source, /returnLocation\.search = ""/);
  assert.match(source, /allowedRedirectOrigins: \[new URL\(editorEntryUrl\)\.origin\]/);
  assert.doesNotMatch(source, /githubPagesProjectName/);
  assert.match(source, /returnLocation\.searchParams\.set\("auth", "workspace"\)/);
  assert.match(source, /returnLocation\.hash = "tool"/);
  assert.match(editorHtml, /cloud\/client\.js\?v=20260911-canonical-auth-return-v21/);
});
