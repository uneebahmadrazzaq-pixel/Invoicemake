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
  assert.match(editorSource, /TW Wholesale Ltd/);
  assert.match(editorSource, /VAT INVOICE/);
  assert.match(editorSource, /Invoice To/);
  assert.match(editorSource, /Deliver To/);
  assert.match(editorSource, /Invoice Total/);
  assert.match(editorSource, /Company No: 02522049/);

  assert.match(styles, /\.tw-invoice\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
  assert.match(styles, /\.tw-products\s*\{/);
  assert.match(styles, /\.tw-grand-total\s*\{/);
});
