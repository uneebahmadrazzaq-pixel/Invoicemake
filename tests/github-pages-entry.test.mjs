import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("GitHub Pages entry points route to the current editor", async () => {
  const [index, fallback] = await Promise.all([
    readFile(new URL("public/index.html", root), "utf8"),
    readFile(new URL("public/404.html", root), "utf8")
  ]);

  assert.match(index, /<base href="\.\/editor\/"/);
  assert.match(index, /class="site-shell"/);
  assert.doesNotMatch(index, /Opening|http-equiv="refresh"/);
  const editor = await readFile(new URL("public/editor/index.html", root), "utf8");
  assert.equal(index, editor.replace("<head>", '<head>\n    <base href="./editor/" />'));
  for (const entry of ["https://invoicemakertool.online/", "https://example.github.io/Invoicemake/"]) {
    const base = new URL("./editor/", entry);
    assert.equal(new URL("./cloud/client.js", base).pathname, `${new URL(entry).pathname}editor/cloud/client.js`);
    assert.equal(new URL("../assets/sunsky-logo.png", base).pathname, `${new URL(entry).pathname}assets/sunsky-logo.png`);
  }
  assert.match(fallback, /location\.hostname\.endsWith\("\.github\.io"\)/);
  assert.match(fallback, /isGitHubPages \? "\/Invoicemake" : ""/);
  assert.doesNotMatch(fallback, /segments\[0\]/);
  assert.match(fallback, /target\.searchParams\.set\("v", "20260910-stable-sign-in-redirect"\)/);
  assert.match(fallback, /target\.searchParams\.set\("auth", "signIn"\)/);
  assert.match(fallback, /target\.searchParams\.set\("auth", "signUp"\)/);
  assert.match(fallback, /location\.replace\(target\.toString\(\)\)/);
});
