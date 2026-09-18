import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("Jellycat is selectable, editable, and renders the supplied VAT-inclusive order invoice", async () => {
  const [editorSource, styles, editorHtml] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"jellycat",\s*name:\s*"Jellycat Order Invoice"/);
  assert.match(editorSource, /function renderJellycatPreview/);
  assert.match(editorSource, /function formatJellycatParty/);
  assert.match(editorSource, /selectedClient\?\.email \|\| invoice\.clientEmail/);
  assert.match(editorSource, /class="jellycat-party-contact"/);
  assert.match(editorSource, /class="jellycat-meta-pair jellycat-meta-payment"/);
  assert.match(editorSource, /class="jellycat-meta-pair jellycat-meta-shipping"/);
  assert.match(editorSource, /document\.fonts\.load\('400 16px "Jellycat Arial Reference"'\)/);
  assert.match(editorSource, /class="invoice-doc jellycat-invoice"/);
  assert.match(editorSource, /Jellycat Invoice for Order/);
  assert.match(editorSource, /Westworks Building/);
  assert.match(editorSource, /VAT Included in Total/);
  assert.match(editorSource, /state\.current\.jellycatShippingMethod/);
  assert.match(editorSource, /state\.current\.jellycatComments/);
  assert.match(editorSource, /invoice\.templateId === "jellycat"/);
  assert.match(editorSource, /jellycat:\s*\{ headers: \["QTY", "Code\/SKU", "Product Name", "Size", "Price"\]/);
  assert.match(editorSource, /isJellycat \? "Order ID \/ Invoice Number"/);
  assert.match(editorSource, /else if \(state\.current\.templateId === "jellycat"\)/);
  assert.match(editorSource, /type\.toLowerCase\(\) === "paypal"\) return "PayPal"/);
  assert.match(editorSource, /function formatJellycatPaymentMethod/);
  assert.match(editorSource, /<dt>Payment Method:<\/dt><dd>\$\{escapeHtml\(paymentMethod\)\}<\/dd>/);
  assert.match(editorSource, /templateId === "jellycat"\)[\s\S]*?label: "Order ID \/ Invoice Number"[\s\S]*?label: "Shipping Method"/);
  assert.match(editorSource, /vatInclusive \? taxBase \* \(taxRate \/ \(100 \+ taxRate \|\| 1\)\)/);

  assert.match(editorHtml, /id="jellycatFields"/);
  assert.match(editorHtml, /id="jellycatShippingMethod"/);
  assert.match(editorHtml, /id="jellycatComments"/);
  assert.match(editorHtml, /id="clientCardType"[\s\S]*?<option>PayPal<\/option>/);
  assert.match(editorHtml, /id="bulkCardType"[\s\S]*?<option>PayPal<\/option>/);

  assert.match(styles, /\.jellycat-invoice\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
  assert.match(styles, /\.jellycat-order-meta\s*\{/);
  assert.match(styles, /\.jellycat-summary\s*\{/);
  assert.match(styles, /font-family: "Jellycat Arial Reference"/);
  assert.match(styles, /Jellycat Arial Reference[\s\S]*?perfume-arial\.woff2/);
  assert.match(styles, /Jellycat Arial Reference[\s\S]*?perfume-arial-bold\.woff2/);
  assert.match(styles, /\.jellycat-header img[\s\S]*?width: 250px[\s\S]*?height: 100px/);
  assert.match(styles, /\.jellycat-invoice > h2[\s\S]*?color: #ababab !important[\s\S]*?font-size: 16px[\s\S]*?font-weight: 400/);
  assert.match(styles, /\.jellycat-invoice :is\(address, h3, p, dt, dd, th, td, span, strong, b, small\)[^}]*color: #000 !important/);
  assert.match(styles, /\.jellycat-addresses h3,[\s\S]*?font-size: 14px/);
  assert.match(styles, /\.jellycat-party \{[\s\S]*?color: #000 !important[\s\S]*?font-size: 12px[\s\S]*?font-weight: 400/);
  assert.match(styles, /\.jellycat-party-name \{ font-weight: 700; \}/);
  assert.match(styles, /\.jellycat-party-contact \{ margin-top: 14px; \}/);
  assert.match(styles, /\.jellycat-items table \{[\s\S]*?font-size: 12px/);
  assert.match(styles, /\.jellycat-summary \{[\s\S]*?font-size: 12px/);
  assert.match(styles, /\.jellycat-order-meta \{[\s\S]*?grid-template-areas:[\s\S]*?"order date"[\s\S]*?"payment shipping"[\s\S]*?row-gap: 8px[\s\S]*?align-items: start/);
  assert.match(styles, /\.jellycat-meta-pair \{[\s\S]*?grid-template-columns: 124px minmax\(0, 1fr\)[\s\S]*?column-gap: 14px/);
  assert.match(styles, /\.jellycat-meta-shipping dd[\s\S]*?white-space: normal/);
  assert.match(editorHtml, /styles\.css\?v=20260918-bulk-buy-layout-v33/);
  assert.match(editorHtml, /app\.js\?v=20260918-bulk-buy-layout-v27/);

  await access(new URL("../public/assets/jellycat-logo.png", import.meta.url));
});
