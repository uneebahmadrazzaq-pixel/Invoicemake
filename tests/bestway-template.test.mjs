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
  assert.match(editorSource, /© Inter IKEA Systems B\.V\. 2020/);
  assert.match(editorSource, /bestwayVatNumber/);
  assert.match(editorSource, /bestwayInvoiceDate/);
  assert.match(editorSource, /bestwayPaymentStatus/);

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
  assert.match(styles, /\.bestway-footer\s*\{[^}]*bottom:\s*8px/);
  assert.match(styles, /\.bestway-copyright\s*\{[^}]*margin-bottom:\s*16px/);
  assert.match(editorSource, /footer\.classList\.contains\("bestway-footer"\)/);
  assert.match(editorSource, /const bestwayInvoice = clonedDocument\.querySelector\("\.bestway-invoice"\)/);
  assert.match(editorSource, /document\.fonts\.load\('400 16px "Bestway Arial Reference"'\)/);
  assert.match(editorSource, /const isBestwayExport = state\.current\.templateId === "bestway"/);
  assert.match(editorSource, /isHighResolutionExport[^;]*\|\| isBestwayExport/);
  assert.match(themeStyles, /body\.dashboard-light \.view \.bestway-invoice,[\s\S]*?"Bestway Arial Reference"/);
  assert.match(editorHtml, /bestway-logo\.png" as="image"/);
  assert.match(editorHtml, /styles\.css\?v=20260912-bestway-fidelity-v16/);
  assert.match(editorHtml, /dashboard-light\.css\?v=20260912-bestway-fidelity-v12/);
  assert.match(editorHtml, /app\.js\?v=20260912-bestway-fidelity-v16/);

  await access(new URL("../public/assets/bestway-logo.png", import.meta.url));
  await access(new URL("../public/assets/fonts/perfume-arial.woff2", import.meta.url));
  await access(new URL("../public/assets/fonts/perfume-arial-bold.woff2", import.meta.url));
});
