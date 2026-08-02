import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Qogita UK is an editable A4 invoice matching the supplied reference", async () => {
  const [editorSource, styles] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"qogitauk",\s*name:\s*"Qogita UK"/);
  assert.match(editorSource, /template\.id === "qogitauk"/);
  assert.match(editorSource, /function renderQogitaUkPreview/);
  assert.match(editorSource, /class="invoice-doc qogita-uk-invoice"/);
  assert.match(editorSource, /Qogita UK LTD/);
  assert.match(editorSource, /1 Poultry Wework, 4th Floor/);
  assert.match(editorSource, /Domestic For Resale/);
  assert.match(editorSource, /SELLER ID/);
  assert.match(editorSource, /GTIN/);
  assert.match(editorSource, /Payment Status:/);
  assert.match(editorSource, /formatQogitaDate/);
  assert.match(editorSource, /state\.current\.cardExpiry\s*=\s*"03\/30"/);
  assert.match(editorSource, /qogitauk:\s*\{\s*headers:/);

  assert.match(styles, /\.qogita-uk-invoice\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
  assert.match(styles, /\.qogita-wordmark\s*\{/);
  assert.match(styles, /\.qogita-mondu-badge\s*\{/);
  assert.match(styles, /font-family:\s*Roboto, Arial, Helvetica, sans-serif/);
  assert.match(styles, /qogita-reference-page\.png/);
  assert.match(styles, /font-size:\s*12px/);
  assert.match(styles, /\.qogita-products\s*\{/);
  assert.match(styles, /\.qogita-products-section\s*\{\s*min-height:\s*292px/);
  assert.match(styles, /\.qogita-transaction\s*\{/);
  assert.match(editorSource, /© \$\{invoiceYear\} Qogita\. All rights reserved\./);
  assert.match(styles, /\.items-table\.is-qogita-items/);
});
