import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
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
  assert.match(editorSource, /paperstone-upper-template\.png/);
  assert.match(editorSource, /paperstone-lower-template\.png/);
  assert.match(editorSource, /paperstone-mask-receipt/);
  assert.match(editorSource, /paperstone-upper-invoice-address/);
  assert.match(editorSource, /VAT Receipt/);
  assert.match(editorSource, /paperstone-summary-value/);
  assert.match(editorSource, /paperstone-total-values/);
  assert.match(editorSource, /paperstone-registration-values/);
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

  for (const labelId of ["invoiceNumberLabel", "orderDateLabel", "poNumberLabel", "billToLabel", "shipToLabel"]) {
    assert.match(editorHtml, new RegExp(`id="${labelId}"`));
    assert.match(editorSource, new RegExp(labelId));
  }

  assert.match(editorSource, /isPaperstone \? "Invoice Address" : "Bill To"/);
  assert.match(editorSource, /isPaperstone \? "Delivery Address" : "Ship To"/);
  assert.match(editorSource, /isPaperstone \? "Your Order No" : "PO Number"/);
  assert.match(editorSource, /state\.current\.clientName = "The Ultimate Outlet Ltd"/);
  assert.match(editorSource, /templateId === "paperstone"[\s\S]*state\.current\.clientId = clientFields\.clientId/);

  assert.match(styles, /\.paperstone-invoice\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
  assert.match(styles, /\.paperstone-lower\s*\{/);
  assert.match(styles, /\.paperstone-lower-items\s*\{/);
  assert.match(editorSource, /hasReferenceItems/);
  assert.match(editorSource, /hasReferenceReceipt/);
  assert.match(editorSource, /hasReferenceInvoiceAddress/);
  assert.match(editorSource, /hasReferenceSummary/);
  assert.doesNotMatch(editorSource, /paperstone-(?:upper-)?hd-rules/);
  assert.doesNotMatch(editorSource, /paperstone-(?:column|horizontal)-repairs/);
  assert.doesNotMatch(editorSource, /paperstone-two-column-rule-fix/);
  assert.doesNotMatch(styles, /paperstone-two-column-rule-fix/);
  assert.doesNotMatch(styles, /paperstone-(?:upper-)?hd-rules/);
  assert.match(styles, /\.paperstone-total-values\s*\{/);
  assert.match(styles, /\.paperstone-registration-values\s*\{/);

  await access(new URL("../public/assets/paperstone-upper-template.png", import.meta.url));
  await access(new URL("../public/assets/paperstone-lower-template.png", import.meta.url));
});
