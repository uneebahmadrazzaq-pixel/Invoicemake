import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Paperstone is selectable and renders the supplied editable A4 VAT receipt", async () => {
  const [editorSource, styles, editorHtml] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"paperstone",\s*name:\s*"Paperstone VAT Receipt"/);
  assert.match(editorSource, /template\.id === "paperstone"/);
  assert.match(editorSource, /function renderPaperstonePreview/);
  assert.match(editorSource, /class="invoice-doc paperstone-invoice"/);
  assert.match(editorSource, /VAT Receipt/);
  assert.match(editorSource, /INVOICE ADDRESS:/);
  assert.match(editorSource, /DELIVERY ADDRESS:/);
  assert.match(editorSource, /VAT SUMMARY:/);
  assert.match(editorSource, /Total inc VAT \(PAID\):/);
  assert.match(editorSource, /Page 1 of 1/);
  assert.match(editorSource, /data-field="pack"/);
  assert.match(editorSource, /data-field="vatCode"/);

  for (const fieldId of [
    "paperstoneFields",
    "paperstoneReceiptNumber",
    "paperstoneAccountNumber",
    "paperstoneVatNumber",
    "paperstoneCompanyNumber",
    "paperstonePaymentNote"
  ]) {
    assert.match(editorHtml, new RegExp(`id="${fieldId}"`));
    assert.match(editorSource, new RegExp(fieldId));
  }

  assert.match(styles, /\.paperstone-invoice\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
  assert.match(styles, /\.paperstone-products\s*\{/);
  assert.match(styles, /\.paperstone-summary\s*\{/);
  assert.match(styles, /\.paperstone-footer\s*\{/);
});
