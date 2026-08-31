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

  assert.doesNotMatch(html, /PT\+Mono/);
  assert.match(styles, /font-family:\s*"GoSupps Template Arial";[^}]*perfume-arial\.woff2/s);
  assert.match(styles, /\.gosupps-invoice\s*\{[^}]*font-family:\s*"GoSupps Template Arial", Arial, Helvetica, sans-serif;[^}]*font-synthesis:\s*none;/s);
  assert.match(styles, /\.gosupps-from h4,[\s\S]*?\.gosupps-addresses h4\s*\{[^}]*"Courier New", Courier, monospace/s);
  assert.match(styles, /\.invoice-doc\.gosupps-invoice \.gosupps-from h4,[\s\S]*?\.invoice-doc\.gosupps-invoice \.gosupps-addresses h4\s*\{[^}]*font-size:\s*18\.667px;[^}]*text-transform:\s*none;/s);
  assert.match(styles, /\.gosupps-meta\s*\{[^}]*font-family:\s*"Courier New"/s);
  assert.match(styles, /\.gosupps-table th\s*\{[^}]*"Courier New"/s);
  assert.match(styles, /\.gosupps-table td\s*\{[^}]*font-family:\s*"GoSupps Template Arial"[^}]*!important/s);
  assert.match(styles, /\.gosupps-invoice\s*\{[^}]*padding:\s*39px 58px 35px;/s);
  assert.match(styles, /\.gosupps-header img\s*\{[^}]*width:\s*704px;[^}]*transform:\s*translateX\(-21px\);/s);
  assert.match(styles, /\.gosupps-addresses\s*\{[^}]*grid-template-columns:\s*41\.4% 58\.6%;[^}]*gap:\s*0;/s);
  assert.match(styles, /\.gosupps-table th:first-child\s*\{[^}]*width:\s*10%;/s);
  assert.match(styles, /\.gosupps-table th:nth-child\(2\)\s*\{[^}]*width:\s*52%;/s);
  assert.match(styles, /\.gosupps-table th:nth-child\(3\)\s*\{[^}]*width:\s*19%;/s);
  assert.match(styles, /\.gosupps-table th:nth-child\(4\)\s*\{[^}]*width:\s*19%;/s);
  assert.match(styles, /\.gosupps-totals\s*\{[^}]*width:\s*67%;[^}]*"Courier New"/s);
  assert.match(styles, /\.gosupps-totals div:last-child\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\) 108px;[^}]*font-size:\s*16px;/s);
  assert.match(styles, /\.gosupps-totals span\s*\{[^}]*white-space:\s*nowrap;/s);
  assert.match(styles, /\.gosupps-totals strong\s*\{[^}]*font:\s*700 13\.333px/);
  assert.match(styles, /\.gosupps-totals div:last-child strong\s*\{[^}]*"GoSupps Template Arial"[^}]*!important[^}]*font-size:\s*13\.333px;[^}]*font-weight:\s*700;/s);
  assert.doesNotMatch(styles, /\.gosupps-totals div:last-child[^}]*34\.667px/);
  assert.match(styles, /\.gosupps-intro\s*\{[^}]*margin-top:\s*36px;/s);
  assert.match(styles, /\.gosupps-addresses\s*\{[^}]*margin-top:\s*28px;/s);
  assert.match(styles, /\.gosupps-table\s*\{[^}]*margin-top:\s*22px;/s);
  assert.match(styles, /\.gosupps-table th\s*\{[^}]*padding:\s*8px 5px;/s);
  assert.match(styles, /\.gosupps-table td\s*\{[^}]*padding:\s*8\.67px 10px;/s);
  assert.match(styles, /\.gosupps-invoice \.gosupps-footer\s*\{[^}]*position:\s*static !important;[^}]*margin:\s*49px 0 0;/s);
  assert.match(uiFont, /body \*:not\(\.invoice-doc\):not\(\.invoice-doc \*\)/);
});

test("GO SUPPS locks its template fonts into PDF and JPG export clones", async () => {
  const script = await readFile(new URL("public/editor/app.js", root), "utf8");

  assert.match(script, /const goSuppsInvoice = clonedDocument\.querySelector\("\.gosupps-invoice"\)/);
  assert.match(script, /forceGoSuppsFont\([\s\S]*?"Courier New", Courier, monospace/);
  assert.match(script, /forceGoSuppsFont\([\s\S]*?"GoSupps Template Arial", Arial, Helvetica, sans-serif/);
  assert.match(script, /document\.fonts\.load\('400 16px "GoSupps Template Arial"'\)/);
  assert.match(script, /document\.fonts\.load\('700 16px "GoSupps Template Arial"'\)/);
});

test("GO SUPPS uses source input columns and calculates the UK amount column", async () => {
  const script = await readFile(new URL("public/editor/app.js", root), "utf8");

  assert.match(script, /gosupps:\s*\{\s*headers:\s*\["qty", "description", "unit"\]/);
  assert.match(script, /<thead><tr><th>QTY<\/th><th>DESCRIPTION<\/th><th>UNIT PRICE<\/th><th>AMOUNT<\/th><\/tr><\/thead>/);
  assert.match(script, /money\(rowTotal\(item\), invoice\.currency\)/);
  assert.match(script, /templateId:\s*"gosupps",\s*currency:\s*"£"/);
  assert.match(script, /if \(templateId === "gosupps"\)[\s\S]*?state\.current\.currency = "£";/);
});
