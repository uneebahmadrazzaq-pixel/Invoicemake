import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("Walmart is selectable, editable, and rendered as a Letter order invoice", async () => {
  const [script, html, styles] = await Promise.all([
    readFile(new URL("public/editor/app.js", root), "utf8"),
    readFile(new URL("public/editor/index.html", root), "utf8"),
    readFile(new URL("public/editor/styles.css", root), "utf8")
  ]);

  assert.match(script, /id:\s*"walmart",\s*name:\s*"Walmart Order Invoice"/);
  assert.match(script, /if \(templateId === "walmart"\)/);
  assert.match(script, /function renderWalmartPreview/);
  assert.match(script, /class="invoice-doc walmart-invoice"/);
  assert.match(script, /walmartDriverTip/);
  assert.match(script, /walmartDeliveryListPrice/);
  assert.match(script, /Order# \$\{escapeHtml\(orderNumber\)\}/);
  assert.match(script, /templateId === "zoro" \|\| state\.current\.templateId === "walmart" \? "letter"/);

  assert.match(html, /id="walmartFields"/);
  assert.match(html, /id="walmartDeliveryLabel"/);
  assert.match(html, /id="walmartDeliveryListPrice"/);
  assert.match(html, /id="walmartDriverTip"/);

  assert.match(styles, /\.walmart-invoice\s*\{/);
  assert.match(styles, /width:\s*816px/);
  assert.match(styles, /min-height:\s*1056px/);
  assert.match(styles, /\.walmart-barcode\s*\{/);
});

