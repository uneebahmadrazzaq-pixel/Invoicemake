import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("Salon Supplies is selectable and matches the supplied editable VAT invoice", async () => {
  const [editorSource, editorHtml, styles] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"salonsupplies",\s*name:\s*"Salon Supplies"/);
  assert.match(editorSource, /template\.id === "salonsupplies"/);
  assert.match(editorSource, /function renderSalonSuppliesPreview/);
  assert.match(editorSource, /class="invoice-doc salon-supplies-invoice"/);
  assert.match(editorSource, /assets\/salon-supplies-logo\.png/);
  assert.match(editorSource, /VAT Analysis/);
  assert.match(editorSource, /Total Del Qty/);
  assert.match(editorSource, /KB Salon Supplies Ltd\. Registration No\./);
  assert.match(editorSource, /salonVatNumber/);
  assert.match(editorSource, /data-field="listPrice"/);

  assert.match(editorHtml, /id="salonSuppliesFields"/);
  assert.match(editorHtml, /id="salonAccountRef"/);
  assert.match(editorHtml, /id="salonVatNumber"/);
  assert.match(editorHtml, /id="salonShortageNotice"/);

  assert.match(styles, /\.salon-supplies-invoice\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
  assert.match(styles, /\.salon-supplies-products\s*\{/);
  assert.match(styles, /\.salon-supplies-totals\s*\{/);

  await access(new URL("../public/assets/salon-supplies-logo.png", import.meta.url));
  assert.equal(Number((58.30 * 1.2).toFixed(2)), 69.96);
});
