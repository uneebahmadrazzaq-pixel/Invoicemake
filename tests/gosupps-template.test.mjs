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
  assert.match(styles, /\.invoice-doc\.gosupps-invoice \.gosupps-from h4,[\s\S]*?\.invoice-doc\.gosupps-invoice \.gosupps-addresses h4\s*\{[^}]*font-size:\s*18\.667px !important;[^}]*font-weight:\s*700 !important;[^}]*text-transform:\s*none !important;/s);
  assert.match(styles, /\.gosupps-meta\s*\{[^}]*font-family:\s*"Courier New"/s);
  assert.match(styles, /\.gosupps-invoice\s*\{[^}]*color:\s*#000 !important;[^}]*-webkit-text-fill-color:\s*#000 !important;[^}]*font-weight:\s*400;/s);
  assert.match(styles, /\.gosupps-meta span\s*\{[^}]*font:\s*700 18\.667px\/1 "Courier New", Courier, monospace !important;/s);
  assert.match(styles, /\.gosupps-table th\s*\{[^}]*"Courier New"/s);
  assert.match(styles, /\.gosupps-table th\s*\{[^}]*font:\s*700 18\.667px\/1 "Courier New"/s);
  assert.match(styles, /\.gosupps-table\s*\{[^}]*border:\s*2px solid #000;/s);
  assert.match(styles, /\.gosupps-table th\s*\{[^}]*border-bottom:\s*2px solid #000;/s);
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
  assert.match(styles, /\.gosupps-total-label\s*\{[^}]*font:\s*800 16px\/1\.3 "Courier New"[^}]*text-align:\s*right;[^}]*white-space:\s*nowrap;/s);
  assert.doesNotMatch(styles, /\.gosupps-total-label\s*\{[^}]*text-stroke/s);
  assert.match(styles, /\.gosupps-totals strong\s*\{[^}]*font:\s*700 13\.333px/);
  assert.match(styles, /\.gosupps-totals div:last-child strong\s*\{[^}]*"GoSupps Template Arial"[^}]*!important[^}]*font-size:\s*13\.333px;[^}]*font-weight:\s*700;/s);
  assert.doesNotMatch(styles, /\.gosupps-totals div:last-child[^}]*34\.667px/);
  assert.match(styles, /\.gosupps-intro\s*\{[^}]*margin-top:\s*36px;/s);
  assert.match(styles, /\.gosupps-addresses\s*\{[^}]*margin-top:\s*28px;/s);
  assert.match(styles, /\.gosupps-table\s*\{[^}]*margin-top:\s*22px;/s);
  assert.match(styles, /\.gosupps-table th\s*\{[^}]*padding:\s*8px 5px;/s);
  assert.match(styles, /\.gosupps-table td\s*\{[^}]*padding:\s*8\.67px 10px;/s);
  assert.match(styles, /\.gosupps-invoice \.gosupps-footer\s*\{[^}]*position:\s*static !important;[^}]*margin:\s*49px 0 0;/s);
  assert.match(styles, /\.invoice-doc\.gosupps-invoice \.gosupps-footer h4\s*\{[^}]*margin:\s*0 0 12px;[^}]*font-weight:\s*400 !important;/s);
  assert.match(uiFont, /body \*:not\(\.invoice-doc\):not\(\.invoice-doc \*\)/);
});

test("GO SUPPS locks its template fonts into PDF and JPG export clones", async () => {
  const script = await readFile(new URL("public/editor/app.js", root), "utf8");

  assert.match(script, /const goSuppsInvoice = clonedDocument\.querySelector\("\.gosupps-invoice"\)/);
  assert.match(script, /forceGoSuppsFont\([\s\S]*?"Courier New", Courier, monospace/);
  assert.match(script, /forceGoSuppsFont\([\s\S]*?"GoSupps Template Arial", Arial, Helvetica, sans-serif/);
  assert.match(script, /goSuppsInvoice\.querySelectorAll\([\s\S]*?style\.setProperty\("color", "#000000", "important"\)/);
  assert.match(script, /<span class="gosupps-total-label">SUBTOTAL:<\/span>/);
  assert.match(script, /<span class="gosupps-total-label">SHIPPING &amp; HANDLING:<\/span>/);
  assert.match(script, /<span class="gosupps-total-label">TAX:<\/span>/);
  assert.match(script, /<span class="gosupps-total-label">GRAND TOTAL:<\/span>/);
  assert.match(script, /goSuppsInvoice\.querySelectorAll\("\.gosupps-total-label"\)[\s\S]*?"font-weight", "800"/);
  assert.match(script, /goSuppsInvoice\.querySelectorAll\("\.gosupps-footer h4, \.gosupps-footer p"\)[\s\S]*?"font-weight", "400"/);
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
  assert.match(script, /name \? `Name: \$\{name\}`/);
  assert.match(script, /clientEmail \? `E-Mail: \$\{clientEmail\}`/);
  assert.match(script, /fields\.phone \? `Phone: \$\{fields\.phone\}`/);
  assert.match(script, /fields\.street \? `Address: \$\{fields\.street\}`/);
  assert.match(script, /fields\.country \? `Country: \$\{fields\.country\}`/);
  assert.match(script, /function formatClientCardPayment\(cardType, cardEnding\)/);
  assert.match(script, /return `\$\{type\} Ending in \$\{ending\}`/);
  assert.match(script, /if \(state\.current\.templateId === "gosupps"\)\s*\{\s*state\.current\.paymentMethod = formatClientCardPayment\(client\.cardType, client\.cardEnding\);/s);
  assert.match(script, /const payment = formatClientCardPayment\(invoice\.cardType, invoice\.cardEnding\) \|\| String\(invoice\.paymentMethod \|\| ""\);/);
});
