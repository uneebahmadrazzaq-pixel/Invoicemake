import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("Bestway Wholesale is selectable and renders the supplied editable VAT invoice", async () => {
  const [editorSource, styles, themeStyles, editorHtml] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/dashboard-light.css", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"bestway",\s*name:\s*"Bestway Wholesale"/);
  assert.match(editorSource, /template\.id === "bestway"/);
  assert.match(editorSource, /function renderBestwayPreview/);
  assert.match(editorSource, /class="invoice-doc bestway-invoice"/);
  assert.match(editorSource, /Bestway Wholesale Ltd/);
  assert.match(editorSource, /Delivery Address:/);
  assert.match(editorSource, /Delivery\/Collection Date:/);
  assert.match(editorSource, /VAT Specification:/);
  assert.match(editorSource, /Invoice Total:/);
  assert.match(editorSource, /Payment Details:/);
  assert.doesNotMatch(editorSource, /© Inter IKEA Systems B\.V\. 2020/);
  assert.match(editorSource, /Email @ exportteam@bestway\.co\.uk\./);
  assert.match(editorSource, /bestwayVatNumber/);
  assert.match(editorSource, /bestwayInvoiceDate/);
  assert.match(editorSource, /bestwayPaymentStatus/);
  assert.match(editorSource, /const selectedCardType = String\(invoice\.cardType \|\| "Visa"\)\.trim\(\)/);
  assert.match(editorSource, /\^visa\$\/i\.test\(selectedCardType\)/);
  assert.match(editorSource, /const cardNumber = invoice\.cardEnding/);
  assert.doesNotMatch(editorSource, /paymentMethodField: new Set\(\[[^\]]*"bestway"/);

  assert.match(editorHtml, /id="bestwayFields"/);
  assert.match(editorHtml, /id="bestwayVatNumber"/);
  assert.match(editorHtml, /id="bestwayInvoiceDate"/);
  assert.match(editorHtml, /id="bestwayPaymentStatus"/);

  assert.match(styles, /\.bestway-invoice\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
  assert.match(styles, /height:\s*1123px/);
  assert.match(styles, /font-family:\s*"Bestway Arial Reference"/);
  assert.match(styles, /\.bestway-invoice,\s*\.bestway-invoice \*[\s\S]*?font-synthesis:\s*none/);
  assert.match(styles, /\.bestway-products\s*\{/);
  assert.match(styles, /\.bestway-vat-head\s*\{/);
  assert.match(styles, /\.bestway-vat-head span\s*\{[^}]*font-weight:\s*700/);
  assert.match(styles, /\.bestway-products \.bestway-shipping-row\s*\{[^}]*height:\s*44px/);
  assert.match(styles, /\.bestway-products \.bestway-shipping-row td\s*\{[^}]*padding:\s*8px 12px[^}]*vertical-align:\s*middle/);
  assert.match(styles, /\.invoice-doc\.bestway-invoice > \.bestway-footer\s*\{[^}]*position:\s*absolute\s*!important[^}]*bottom:\s*25px/);
  assert.match(styles, /\.invoice-doc\.bestway-invoice > \.bestway-footer\s*\{[^}]*font-size:\s*11px\s*!important[^}]*font-weight:\s*400\s*!important[^}]*text-align:\s*left\s*!important/);
  assert.match(editorSource, /footer\.style\.setProperty\("font-size", "11px", "important"\)/);
  assert.match(editorSource, /footer\.classList\.contains\("bestway-footer"\)/);
  assert.match(editorSource, /const bestwayInvoice = clonedDocument\.querySelector\("\.bestway-invoice"\)/);
  assert.match(editorSource, /document\.fonts\.load\('400 16px "Bestway Arial Reference"'\)/);
  assert.match(editorSource, /const isBestwayExport = state\.current\.templateId === "bestway"/);
  assert.match(editorSource, /isHighResolutionExport[^;]*\|\| isBestwayExport/);
  assert.match(themeStyles, /body\.dashboard-light \.view \.bestway-invoice,[\s\S]*?"Bestway Arial Reference"/);
  assert.match(editorHtml, /bestway-logo\.png" as="image"/);
  assert.match(editorHtml, /styles\.css\?v=20260912-justmae-font-lock-v21/);
  assert.match(editorHtml, /dashboard-light\.css\?v=20260912-justmae-font-lock-v17/);
  assert.match(editorHtml, /app\.js\?v=20260912-justmae-font-lock-v21/);

  await access(new URL("../public/assets/bestway-logo.png", import.meta.url));
  await access(new URL("../public/assets/fonts/perfume-arial.woff2", import.meta.url));
  await access(new URL("../public/assets/fonts/perfume-arial-bold.woff2", import.meta.url));
});
