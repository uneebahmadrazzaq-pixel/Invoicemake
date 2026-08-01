import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Mastertrade Supplies is selectable and renders the supplied editable two-page sales invoice", async () => {
  const [editorSource, styles, editorHtml] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"mastertrade",\s*name:\s*"Mastertrade Supplies"/);
  assert.match(editorSource, /template\.id === "mastertrade"/);
  assert.match(editorSource, /function renderMastertradePreview/);
  assert.match(editorSource, /class="invoice-doc mastertrade-invoice"/);
  assert.match(editorSource, /Mastertrade Supplies Ltd/);
  assert.match(editorSource, /SALES INVOICE/);
  assert.match(editorSource, /Subtotal Without Taxes/);
  assert.match(editorSource, /Mastertrade Supplies Ltd - Terms &amp; Conditions of Sale/);
  assert.match(editorSource, /Page 1 of 2/);
  assert.match(editorSource, /Page 2 of 2/);
  assert.match(editorSource, /mastertradeDiscountRate/);
  assert.match(editorSource, /captureTargets/);

  assert.match(editorHtml, /id="mastertradeFields"/);
  assert.match(editorHtml, /id="mastertradeShipDate"/);
  assert.match(editorHtml, /id="mastertradeDiscountRate"/);
  assert.match(editorHtml, /id="mastertradeCardholder"/);
  assert.match(editorHtml, /id="mastertradePaymentStatus"/);

  assert.match(styles, /\.mastertrade-invoice\s*\{/);
  assert.match(styles, /\.mastertrade-page\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
  assert.match(styles, /\.mastertrade-products\s*\{/);
  assert.match(styles, /\.mastertrade-terms-page\s*\{/);
});
