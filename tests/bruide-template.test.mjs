import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("Bruide Tools is selectable and renders the owner-supplied editable A4 invoice", async () => {
  const [editorSource, editorHtml, styles] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"bruide",\s*name:\s*"Bruide Tools Invoice"/);
  assert.match(editorSource, /template\.id === "bruide"/);
  assert.match(editorSource, /function renderBruidePreview/);
  assert.match(editorSource, /class="invoice-doc bruide-invoice"/);
  assert.match(editorSource, /assets\/bruide-logo\.png/);
  assert.match(editorSource, /Your Reliable Auto Tools Supplier/);
  assert.match(editorSource, /Products Names/);
  assert.match(editorSource, /FedEx Express/);
  assert.match(editorSource, /WENZHOU BRUIDE PRECISION METAL CO\., LTD\./);
  assert.match(editorSource, /invoiceNumber = "309593610"/);
  assert.match(editorSource, /orderId = "95876325"/);
  assert.match(editorSource, /shippingAmount = 150\.2/);
  assert.match(editorSource, /H7K2L9Q/);
  assert.match(editorSource, /Z6H1X8G/);

  assert.match(editorHtml, /id="trackingIdLabel"/);
  assert.match(editorHtml, /id="orderIdLabel"/);
  assert.match(editorHtml, /20260815-final-consolidated-invoice-tools/);

  assert.match(styles, /\.invoice-doc\.bruide-invoice\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
  assert.match(styles, /@page bruide-a4/);
  assert.match(styles, /\.bruide-products\s*\{/);
  assert.match(styles, /\.bruide-order-details\s*\{/);

  await access(new URL("../public/assets/bruide-logo.png", import.meta.url));
});
