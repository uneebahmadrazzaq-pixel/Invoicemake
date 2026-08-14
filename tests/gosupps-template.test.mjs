import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("GO SUPPS keeps the source PDF typography isolated from the website font", async () => {
  const [html, styles, uiFont] = await Promise.all([
    readFile(new URL("public/editor/index.html", root), "utf8"),
    readFile(new URL("public/editor/styles.css", root), "utf8"),
    readFile(new URL("public/editor/ui-font-inter.css", root), "utf8"),
  ]);

  assert.match(html, /family=PT\+Mono/);
  assert.match(styles, /\.gosupps-invoice\s*\{[^}]*font-family:\s*"Arial Unicode MS", Arial, Helvetica, sans-serif;/s);
  assert.match(styles, /\.gosupps-invoice h4\s*\{[^}]*"PT Mono"/s);
  assert.match(styles, /\.gosupps-meta\s*\{[^}]*font-family:\s*"PT Mono"/s);
  assert.match(styles, /\.gosupps-table th\s*\{[^}]*"PT Mono"/s);
  assert.match(styles, /\.gosupps-table td\s*\{[^}]*font-family:\s*"Arial Unicode MS"/s);
  assert.match(styles, /\.gosupps-totals\s*\{[^}]*"PT Mono"/s);
  assert.match(styles, /\.gosupps-totals div:last-child strong\s*\{[^}]*"Liberation Sans Narrow"/s);
  assert.match(uiFont, /body \*:not\(\.invoice-doc\):not\(\.invoice-doc \*\)/);
});
