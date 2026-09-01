import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("Walmart is selectable, editable, and rendered as a Letter order invoice", async () => {
  const [script, html, styles, regularFont, boldFont] = await Promise.all([
    readFile(new URL("public/editor/app.js", root), "utf8"),
    readFile(new URL("public/editor/index.html", root), "utf8"),
    readFile(new URL("public/editor/styles.css", root), "utf8"),
    stat(new URL("public/assets/fonts/walmart-everyday-sans-regular.woff2", root)),
    stat(new URL("public/assets/fonts/walmart-everyday-sans-bold.woff2", root))
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
  assert.match(html, /walmart-everyday-sans-regular\.woff2/);
  assert.match(html, /walmart-everyday-sans-bold\.woff2/);
  assert.match(html, /20260901-walmart-source-font/);

  assert.ok(regularFont.size > 0);
  assert.ok(boldFont.size > 0);
  assert.match(styles, /font-family:\s*"Walmart Everyday Sans"/);
  assert.match(styles, /walmart-everyday-sans-regular\.woff2/);
  assert.match(styles, /walmart-everyday-sans-bold\.woff2/);
  assert.match(styles, /\.walmart-invoice\s*\{/);
  assert.match(styles, /width:\s*816px/);
  assert.match(styles, /min-height:\s*1056px/);
  assert.match(styles, /font-size:\s*14px/);
  assert.match(styles, /font-synthesis:\s*none/);
  assert.match(styles, /\.walmart-document-title\s*\{\s*font-size:\s*16px/);
  assert.match(styles, /\.walmart-items td\s*\{[^}]*font-size:\s*14px/s);
  assert.match(styles, /\.walmart-subtotal\s*\{[^}]*font-size:\s*18px/s);
  assert.match(styles, /\.walmart-total\s*\{[^}]*font-size:\s*24px/s);
  assert.match(styles, /\.walmart-barcode\s*\{/);

  assert.match(script, /forceWalmartStyle\("\*"/);
  assert.match(script, /400 16px "Walmart Everyday Sans"/);
  assert.match(script, /700 16px "Walmart Everyday Sans"/);
});
