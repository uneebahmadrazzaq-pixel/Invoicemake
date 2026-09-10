import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../cloud/client.ts", import.meta.url), "utf8");

test("authentication preserves the GitHub Pages project path", () => {
  assert.match(source, /returnLocation\.hostname\.endsWith\("\.github\.io"\)/);
  assert.match(source, /githubPagesProjectName = "Invoicemake"/);
  assert.match(source, /returnLocation\.pathname = `\/\$\{githubPagesProjectName\}\/editor\/index\.html`/);
  assert.doesNotMatch(source, /returnLocation\.pathname\.split\("\/"\)/);
  assert.match(source, /returnLocation\.searchParams\.set\("auth", "workspace"\)/);
  assert.match(source, /returnLocation\.hash = "tool"/);
});
