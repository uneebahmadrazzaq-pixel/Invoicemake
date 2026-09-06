import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("GitHub Pages entry points route to the current editor", async () => {
  const [index, fallback] = await Promise.all([
    readFile(new URL("public/index.html", root), "utf8"),
    readFile(new URL("public/404.html", root), "utf8")
  ]);

  assert.match(index, /editor\/index\.html\?v=20260907-single-pdf-under-5mb/);
  assert.match(fallback, /location\.hostname\.endsWith\("\.github\.io"\)/);
  assert.match(fallback, /`\/\$\{segments\[0\]\}`/);
  assert.match(fallback, /location\.replace\(`\$\{projectRoot\}\/editor\/index\.html\?v=20260907-single-pdf-under-5mb`\)/);
});
