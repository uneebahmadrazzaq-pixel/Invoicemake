import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("ABW Asian Beauty Wholesale is selectable and renders the editable reference invoice", async () => {
  const [editorSource, editorHtml, styles] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"abw",\s*name:\s*"ABW Asian Beauty Wholesale"/);
  assert.match(editorSource, /template\.id === "abw"/);
  assert.match(editorSource, /function renderAbwPreview/);
  assert.match(editorSource, /class="invoice-doc abw-invoice"/);
  assert.match(editorSource, /assets\/abw-logo\.png/);
  assert.match(editorSource, /AsianBeautyWholesale \(Hong Kong\) Limited/);
  assert.match(editorSource, />ORDER INVOICE</);
  assert.match(editorSource, /Customer ID/);
  assert.match(editorSource, /Per Shipment Handling Fee/);
  assert.match(editorSource, /Credit Card Handling Fee/);
  assert.match(editorSource, /invoiceNumber = "20818584"/);
  assert.match(editorSource, /abwCustomerId = "20818584"/);
  assert.match(editorSource, /brand: "BANILA CO"/);

  for (const fieldId of [
    "abwFields",
    "abwCustomerId",
    "abwBillingEmail",
    "abwShippingEmail",
    "abwShippingMethod",
    "abwCoupon",
    "abwShipmentHandlingFee",
    "abwProductLabellingFee",
    "abwFreeProductHandlingFee",
    "abwCreditCardHandlingFee"
  ]) {
    assert.match(editorHtml, new RegExp(`id="${fieldId}"`));
  }

  assert.match(styles, /\.abw-invoice\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
  assert.match(styles, /\.abw-products\s*\{/);
  assert.match(styles, /\.abw-totals\s*\{/);

  await access(new URL("../public/assets/abw-logo.png", import.meta.url));
});
