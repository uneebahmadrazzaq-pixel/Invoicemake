import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("TW Wholesale is selectable and renders a dedicated editable VAT invoice", async () => {
  const [editorSource, styles, editorHtml] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"tw",\s*name:\s*"T W Wholesale & Superstore"/);
  assert.match(editorSource, /template\.id === "tw"/);
  assert.match(editorSource, /function renderTwWholesalePreview/);
  assert.match(editorSource, /function formatTwWholesalePartyAddress/);
  assert.match(editorSource, /formatTwWholesalePartyAddress\(invoice\.billTo/);
  assert.match(editorSource, /phone\|telephone\|tel\|mobile/);
  assert.match(editorSource, /class="invoice-doc tw-invoice"/);
  assert.match(editorSource, /assets\/tw-wholesale-logo\.png/);
  assert.match(editorSource, /T W Wholesale Limited\./);
  assert.match(editorSource, />INVOICE</);
  assert.match(editorSource, /Bill To/);
  assert.match(editorSource, /Ship To/);
  assert.match(editorSource, /Item Total:/);
  assert.match(editorSource, /Company Number: 02522049/);
  assert.match(editorSource, /Vat Number: GB 111 164 035/);
  assert.match(editorSource, /Terms &amp; Conditions/);
  assert.match(editorSource, /tw:\s*\{\s*headers:\s*\["description",\s*"qty",\s*"unit"\]/);
  assert.match(editorSource, /isTwWholesale\s*=\s*state\.current\.templateId\s*===\s*"tw"/);
  assert.match(editorSource, /<th>Item Description<\/th><th>QTY<\/th><th>Rate<\/th>/);
  assert.match(editorSource, /tw-wholesale-item-editor-row/);
  assert.match(editorSource, /const paymentLines = paymentReference/);
  assert.doesNotMatch(editorSource, /const paymentLines = \[[\s\S]{0,140}invoice\.cardExpiry/);
  assert.match(editorSource, /\$1\\u00a0\$2/);
  assert.match(editorSource, /\$\{shipping \? `<div><dt>Shipping:/);
  assert.doesNotMatch(editorSource, /tw-payment[\s\S]{0,180}invoice\.paymentDetails/);

  assert.match(styles, /\.tw-invoice\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
  assert.match(styles, /--tw-blue:\s*#173b6d/);
  assert.match(styles, /font-family:\s*"TW Arial"/);
  assert.match(styles, /perfume-arial\.woff2/);
  assert.match(styles, /perfume-arial-bold\.woff2/);
  assert.match(styles, /font-family:\s*"TW Arial"[^;]*!important/);
  assert.match(styles, /font-synthesis:\s*none/);
  assert.match(editorSource, /document\.fonts\.load\('400 16px "TW Arial"'\)/);
  assert.match(editorSource, /document\.fonts\.load\('700 16px "TW Arial"'\)/);
  assert.match(editorHtml, /rel="preload" href="\.\.\/assets\/fonts\/perfume-arial\.woff2"/);
  assert.match(editorHtml, /rel="preload" href="\.\.\/assets\/fonts\/perfume-arial-bold\.woff2"/);
  assert.match(styles, /--tw-charcoal:\s*#343a40/);
  assert.match(styles, /--tw-ink:\s*#343a40/);
  assert.match(styles, /--tw-muted:\s*#495057/);
  assert.match(styles, /\.tw-invoice \*\s*\{[\s\S]*color:\s*var\(--tw-charcoal\);[\s\S]*font-family:\s*"TW Arial"/);
  assert.match(styles, /\.tw-invoice\s*>\s*\.tw-header\s*\{\s*position:\s*absolute/);
  assert.match(styles, /\.tw-invoice\s*>\s*\.tw-company-line\s*\{\s*position:\s*absolute/);
  assert.match(styles, /\.tw-invoice\s*>\s*\.tw-products\s*\{\s*position:\s*absolute/);
  assert.match(styles, /\.tw-products\s*\{/);
  assert.match(styles, /border-collapse:\s*separate/);
  assert.match(styles, /\.tw-products tbody tr\s*\{[^}]*height:\s*43px/);
  assert.match(styles, /\.tw-products td\s*\{[^}]*border-bottom:\s*3px double #c6c9cc/);
  assert.match(styles, /\.tw-parties p\s*\{[^}]*font-weight:\s*400 !important/);
  assert.match(styles, /\.items-table\.is-tw-wholesale-items/);
  assert.match(styles, /\.tw-parties p\s*\{[^}]*color:\s*var\(--tw-charcoal\) !important;[^}]*-webkit-text-fill-color:\s*var\(--tw-charcoal\) !important;[^}]*font-size:\s*13px/);
  assert.match(styles, /\.tw-payment h2\s*\{[^}]*color:\s*var\(--tw-muted\) !important;[^}]*font-size:\s*15\.5px/);
  assert.match(styles, /\.tw-payment p\s*\{[^}]*color:\s*#000 !important;[^}]*-webkit-text-fill-color:\s*#000 !important;[^}]*font-size:\s*13px/);
  assert.match(styles, /\.tw-terms h2\s*\{[^}]*color:\s*var\(--tw-muted\) !important;[^}]*font-size:\s*15\.5px/);
  assert.match(styles, /\.tw-terms p\s*\{[^}]*color:\s*var\(--tw-charcoal\) !important;[^}]*-webkit-text-fill-color:\s*var\(--tw-charcoal\) !important;[^}]*font-size:\s*13px/);
  assert.match(styles, /\.tw-products td, \.tw-totals dt, \.tw-totals dd\)\s*\{\s*color:\s*#000 !important;\s*-webkit-text-fill-color:\s*#000 !important/);
  assert.match(editorSource, /genericPaymentMethods\.has\(requestedPaymentMethod\.toLowerCase\(\)\)[\s\S]{0,140}invoice\.cardType/);
  assert.match(styles, /\.tw-payment h2\s*\{[^}]*font-size:\s*15\.5px;[^}]*font-weight:\s*700/);
  assert.match(styles, /\.tw-terms p\s*\{[^}]*font-size:\s*13px;[^}]*font-weight:\s*400/);
  assert.match(styles, /\.tw-grand-total\s*\{/);
  assert.match(styles, /\.tw-totals\s*\{\s*position:\s*absolute;\s*top:\s*773px/);
});
