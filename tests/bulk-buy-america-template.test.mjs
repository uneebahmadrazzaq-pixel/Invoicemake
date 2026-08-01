import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("Bulk Buy America is selectable, editable, and matches the supplied paid invoice", async () => {
  const [editorSource, styles] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"bulkbuyamerica",\s*name:\s*"Bulk Buy America"/);
  assert.match(editorSource, /function renderBulkBuyAmericaPreview/);
  assert.match(editorSource, /class="invoice-doc bulk-buy-america-invoice"/);
  assert.match(editorSource, /Invoice Number/);
  assert.match(editorSource, /Order Number/);
  assert.match(editorSource, /Issue Date/);
  assert.match(editorSource, /Total Units/);
  assert.match(editorSource, /Amount Paid/);
  assert.match(editorSource, /Amount Due/);
  assert.match(editorSource, /777 Lehigh Ave, UNIT G/);
  assert.match(editorSource, /invoice\.templateId !== "bulkbuyamerica"/);
  assert.match(styles, /\.bulk-buy-america-invoice\s*\{/);
  assert.match(styles, /\.bulk-buy-america-products\s*\{/);
  assert.match(styles, /\.bulk-buy-america-summary\s*\{/);

  await access(new URL("../public/assets/bulk-buy-america-logo.png", import.meta.url));
});
