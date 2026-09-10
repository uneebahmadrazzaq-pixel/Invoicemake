import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("Zoro USA is selectable and renders the supplied editable letter invoice", async () => {
  const [editorSource, styles, editorHtml] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"zoro",\s*name:\s*"Zoro USA"/);
  assert.match(editorSource, /template\.id === "zoro"/);
  assert.match(editorSource, /function renderZoroPreview/);
  assert.match(editorSource, /\[zoroMailingFirstLine = "", \.\.\.zoroMailingRemainingLines\]/);
  assert.match(editorSource, /<strong>Mailing Address<\/strong>\$\{zoroMailingFirstLine/);
  assert.match(editorHtml, /styles\.css\?v=20260910-zoro-meta-position-v2/);
  assert.match(editorHtml, /app\.js\?v=20260910-zoro-meta-position-v2/);
  assert.match(editorSource, /class="invoice-doc zoro-invoice" style="--zoro-copy: #050505; color: #050505;/);
  assert.match(editorSource, /class="zoro-upper-sheet"/);
  assert.match(editorSource, /class="zoro-lower-sheet"/);
  assert.match(editorSource, /SUMMARY TERMS AND CONDITIONS/);
  assert.match(editorSource, /Prices listed are wholesale/);
  assert.match(editorSource, /Anticipation and cash discounts are not allowed/);
  assert.match(editorSource, /15% restocking \(processing\) fee/);
  assert.match(editorSource, /Product Substitution/);
  assert.match(editorSource, /ZORO TOOLS, INC\. LIMITED WARRANTY/);
  assert.match(editorSource, /expressly disclaims any liability/);
  assert.match(editorSource, /Manufacturer's Warranty/);
  assert.match(editorSource, /class="zoro-regular-label">Prices\./);
  assert.doesNotMatch(editorSource, /ZORO TOOLS, INC\. WARRANTS ANY PRODUCT/);
  assert.match(editorSource, /Shipping Cost/);
  assert.match(editorSource, /<th>Customer<\/th><th>Invoice #<\/th><th>Amount Due<\/th>/);
  assert.match(editorSource, /<p><strong>Payment Method : \$\{escapeHtml\(paymentLabel\)\}<\/strong><\/p>/);
  assert.match(editorSource, /<div><strong>Subtotal<\/strong><span>/);
  assert.match(editorSource, /<div><strong>Shipping Cost/);
  assert.match(editorSource, /<div><strong>Total Tax<\/strong><span>/);
  assert.match(editorSource, /state\.current\.templateId === "zoro" \? "letter" : "a4"/);

  for (const fieldId of [
    "zoroFields",
    "zoroCustomerNumber",
    "zoroTerms",
    "zoroDueDate",
    "zoroMailingAddress",
    "zoroRemitTo",
    "zoroShippingMethod",
    "zoroAmountDue"
  ]) {
    assert.match(editorHtml, new RegExp(`id="${fieldId}"`));
    assert.match(editorSource, new RegExp(fieldId));
  }

  assert.match(styles, /\.zoro-invoice\s*\{/);
  assert.match(styles, /min-height:\s*1028px/);
  assert.match(styles, /padding:\s*50px 28px 24px 40px/);
  assert.match(styles, /--zoro-copy:\s*#050505/);
  assert.match(styles, /\.zoro-invoice \*\s*\{[\s\S]*?font-family:\s*Arial, Helvetica, sans-serif !important/);
  assert.match(styles, /grid-template-columns:\s*219px 230px 1fr/);
  assert.match(styles, /\.zoro-brand-column\s*\{[\s\S]*?position:\s*absolute/);
  assert.match(styles, /\.zoro-mailing p\s*\{[\s\S]*?width:\s*235px/);
  assert.doesNotMatch(styles, /\.zoro-mailing p\s*\{[\s\S]*?left:\s*90px/);
  assert.match(styles, /\.zoro-mailing strong\s*\{[\s\S]*?font-weight:\s*700 !important/);
  assert.match(styles, /\.zoro-primary-meta\s*\{[\s\S]*?left:\s*276px/);
  assert.match(styles, /\.zoro-title-meta\s*\{[\s\S]*?left:\s*502px/);
  assert.match(styles, /\.zoro-upper-sheet\s*\{[\s\S]*?transform:\s*none/);
  assert.match(styles, /\.zoro-addresses p\s*\{[\s\S]*?font-size:\s*11px/);
  assert.match(styles, /\.zoro-logo\s*\{[\s\S]*?margin-bottom:\s*28px/);
  assert.match(styles, /\.zoro-mailing\s*\{[\s\S]*?left:\s*2px/);
  assert.match(styles, /-webkit-text-fill-color:\s*var\(--zoro-copy\) !important/);
  assert.match(styles, /\.zoro-products\s*\{/);
  assert.match(styles, /\.zoro-products th\s*\{[\s\S]*?color:\s*#fff/);
  assert.match(styles, /\.zoro-products th\s*\{[\s\S]*?border:\s*1\.5px solid #777/);
  assert.match(styles, /\.zoro-products td\s*\{[\s\S]*?border:\s*1\.5px solid #777/);
  assert.match(styles, /\.zoro-products td\s*\{[\s\S]*?font-size:\s*11px/);
  assert.match(styles, /\.zoro-lower-sheet[\s\S]*?-webkit-text-fill-color:\s*#050505 !important/);
  assert.match(styles, /\.zoro-payment th\s*\{[\s\S]*?background:\s*#050505/);
  assert.match(styles, /\.zoro-payment > h2\s*\{[\s\S]*?font-size:\s*12px/);
  assert.match(styles, /\.zoro-payment > p\s*\{[\s\S]*?margin-top:\s*15px/);
  assert.match(styles, /\.zoro-lower-sheet\s*\{[\s\S]*?flex:\s*1/);
  assert.match(styles, /\.zoro-footer\s*\{[\s\S]*?position:\s*static/);
  assert.match(styles, /\.zoro-footer\s*\{[\s\S]*?margin:\s*auto 0 0/);
  assert.match(styles, /\.zoro-footer\s*\{[\s\S]*?font-size:\s*10\.5px/);
  assert.match(styles, /\.zoro-footer\s*\{[\s\S]*?white-space:\s*nowrap/);
  assert.match(styles, /\.zoro-legal\s*\{[\s\S]*?font-family:\s*Arial, Helvetica, sans-serif !important/);
  assert.match(styles, /\.zoro-legal\s*\{[\s\S]*?font-size:\s*7\.8px/);
  assert.match(styles, /\.zoro-regular-label\s*\{[\s\S]*?font-weight:\s*400/);
  assert.match(styles, /@page zoro-letter/);

  await access(new URL("../public/assets/zoro-logo.png", import.meta.url));
});
