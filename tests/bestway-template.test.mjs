import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("Bestway Wholesale is selectable and renders the supplied editable VAT invoice", async () => {
  const [editorSource, styles, editorHtml] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8")
  ]);
  assert.match(editorSource, /id:\s*"bestway",\s*name:\s*"Bestway Wholesale"/);
  assert.match(editorSource, /template\.id === "bestway"/);
  assert.match(editorSource, /function renderBestwayPreview/);
  assert.match(editorSource, /class="invoice-doc bestway-invoice"/);
  assert.match(editorSource, /Bestway Wholesale Ltd/);
  assert.match(editorSource, /Delivery\/Collection Date:/);
  assert.match(editorSource, /VAT Specification:/);
  assert.match(editorSource, /Invoice Total:/);
  assert.match(editorSource, /Payment Details:/);
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
  assert.match(styles, /\.bestway-products\s*\{/);
  assert.match(styles, /\.bestway-vat-head\s*\{/);
  assert.match(styles, /\.bestway-footer\s*\{/);
  await access(new URL("../public/assets/bestway-logo.png", import.meta.url));
});
