import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("TW Wholesale is selectable and renders a dedicated editable VAT invoice", async () => {
  const [editorSource, styles] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"tw",\s*name:\s*"T W Wholesale & Superstore"/);
  assert.match(editorSource, /template\.id === "tw"/);
  assert.match(editorSource, /function renderTwWholesalePreview/);
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
  assert.match(editorSource, /const paymentLines = \[/);
  assert.match(editorSource, /\$\{shipping \? `<div><dt>Shipping:/);
  assert.doesNotMatch(editorSource, /tw-payment[\s\S]{0,180}invoice\.paymentDetails/);

  assert.match(styles, /\.tw-invoice\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
  assert.match(styles, /--tw-blue:\s*#173b6d/);
  assert.match(styles, /font-family:\s*"TW Source Roboto"/);
  assert.match(styles, /vetuk-roboto-regular\.ttf/);
  assert.match(styles, /vetuk-roboto-bold\.ttf/);
  assert.match(styles, /--tw-charcoal:\s*#343a40/);
  assert.match(styles, /\.tw-invoice \*\s*\{[\s\S]*color:\s*var\(--tw-charcoal\);[\s\S]*font-family:\s*"TW Source Roboto"/);
  assert.match(styles, /\.tw-invoice\s*>\s*\.tw-header\s*\{\s*position:\s*absolute/);
  assert.match(styles, /\.tw-invoice\s*>\s*\.tw-company-line\s*\{\s*position:\s*absolute/);
  assert.match(styles, /\.tw-invoice\s*>\s*\.tw-products\s*\{\s*position:\s*absolute/);
  assert.match(styles, /\.tw-products\s*\{/);
  assert.match(styles, /\.tw-grand-total\s*\{/);
  assert.match(styles, /\.tw-totals\s*\{\s*position:\s*absolute;\s*top:\s*773px/);
});
