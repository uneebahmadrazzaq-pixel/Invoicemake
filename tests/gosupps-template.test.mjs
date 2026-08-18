import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("GO SUPPS keeps the source PDF typography, columns, and flowing footer", async () => {
  const [html, styles, uiFont] = await Promise.all([
    readFile(new URL("public/editor/index.html", root), "utf8"),
    readFile(new URL("public/editor/styles.css", root), "utf8"),
    readFile(new URL("public/editor/ui-font-inter.css", root), "utf8"),
  ]);

  assert.match(html, /family=PT\+Mono/);
  assert.match(styles, /font-family:\s*"GoSupps Arial";[^}]*perfume-arial\.woff2/s);
  assert.match(styles, /\.gosupps-invoice\s*\{[^}]*font-family:\s*"GoSupps Arial", Arial, Helvetica, sans-serif;[^}]*font-synthesis:\s*none;/s);
  assert.match(styles, /\.gosupps-invoice h4\s*\{[^}]*"PT Mono"/s);
  assert.match(styles, /\.invoice-doc\.gosupps-invoice h4\s*\{[^}]*font-size:\s*18\.667px;[^}]*text-transform:\s*none;/s);
  assert.match(styles, /\.gosupps-meta\s*\{[^}]*font-family:\s*"PT Mono"/s);
  assert.match(styles, /\.gosupps-table th\s*\{[^}]*"PT Mono"/s);
  assert.match(styles, /\.gosupps-table td\s*\{[^}]*font-family:\s*"GoSupps Arial"/s);
  assert.match(styles, /\.gosupps-totals\s*\{[^}]*width:\s*67%;[^}]*"PT Mono"/s);
  assert.match(styles, /\.gosupps-totals div:last-child\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\) auto;/s);
  assert.match(styles, /\.gosupps-totals span\s*\{[^}]*white-space:\s*nowrap;/s);
  assert.match(styles, /\.gosupps-totals div:last-child strong\s*\{[^}]*"Liberation Sans Narrow"/s);
  assert.match(styles, /\.gosupps-invoice \.gosupps-footer\s*\{[^}]*position:\s*static !important;[^}]*margin:\s*64px 0 0;/s);
  assert.match(uiFont, /body \*:not\(\.invoice-doc\):not\(\.invoice-doc \*\)/);
});

test("GO SUPPS uses only quantity, description, and unit price in its table and sample CSV", async () => {
  const script = await readFile(new URL("public/editor/app.js", root), "utf8");

  assert.match(script, /gosupps:\s*\{\s*headers:\s*\["qty", "description", "unit"\]/);
  assert.match(script, /<thead><tr><th>QTY<\/th><th>DESCRIPTION<\/th><th>UNIT PRICE<\/th><\/tr><\/thead>/);
  assert.doesNotMatch(script, /<th>UNIT PRICE<\/th><th>AMOUNT<\/th>/);
});
