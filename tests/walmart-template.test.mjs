import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("Walmart is selectable, editable, and rendered at the source template size", async () => {
  const [script, html, styles, regularFont, boldFont, logo, barcode] = await Promise.all([
    readFile(new URL("public/editor/app.js", root), "utf8"),
    readFile(new URL("public/editor/index.html", root), "utf8"),
    readFile(new URL("public/editor/styles.css", root), "utf8"),
    stat(new URL("public/assets/fonts/walmart-everyday-sans-regular.woff2", root)),
    stat(new URL("public/assets/fonts/walmart-everyday-sans-bold.woff2", root)),
    stat(new URL("public/assets/walmart-logo.png", root)),
    stat(new URL("public/assets/walmart-order-barcode.png", root))
  ]);

  assert.match(script, /id:\s*"walmart",\s*name:\s*"Walmart Order Invoice"/);
  assert.match(script, /if \(templateId === "walmart"\)/);
  assert.match(script, /function renderWalmartPreview/);
  assert.match(script, /class="invoice-doc walmart-invoice"/);
  assert.match(script, /walmartDriverTip/);
  assert.match(script, /walmartDeliveryListPrice/);
  assert.match(script, /Order# \$\{escapeHtml\(orderNumber\)\}/);
  assert.match(script, /templateId === "walmart" \? \[935\.04, 1210\.08\]/);
  assert.match(script, /class="walmart-sheet-border"/);
  assert.match(script, /class="walmart-print-header"/);
  assert.match(script, /assets\/walmart-logo\.png/);
  assert.match(script, /assets\/walmart-order-barcode\.png/);
  assert.match(script, /function formatWalmartBuyer/);
  assert.match(script, /class="walmart-buyer-name"/);
  assert.match(script, /class="walmart-buyer-address"/);
  assert.doesNotMatch(script, /walmart-buyer">[\s\S]{0,180}invoice\.billTo \|\| clientAddress/);
  assert.doesNotMatch(script, /class="walmart-spark"/);

  assert.match(html, /id="walmartFields"/);
  assert.match(html, /id="walmartDeliveryLabel"/);
  assert.match(html, /id="walmartDeliveryListPrice"/);
  assert.match(html, /id="walmartDriverTip"/);
  assert.match(html, /walmart-everyday-sans-regular\.woff2/);
  assert.match(html, /walmart-everyday-sans-bold\.woff2/);
  assert.match(html, /20260901-walmart-buyer-source/);

  assert.ok(regularFont.size > 0);
  assert.ok(boldFont.size > 0);
  assert.ok(logo.size > 0);
  assert.ok(barcode.size > 0);
  assert.match(styles, /font-family:\s*"Walmart Everyday Sans"/);
  assert.match(styles, /walmart-everyday-sans-regular\.woff2/);
  assert.match(styles, /walmart-everyday-sans-bold\.woff2/);
  assert.match(styles, /\.walmart-invoice\s*\{/);
  assert.match(styles, /width:\s*1246\.72px/);
  assert.match(styles, /min-height:\s*1613\.44px/);
  assert.match(styles, /font-size:\s*14px/);
  assert.match(styles, /font-synthesis:\s*none/);
  assert.match(styles, /\.walmart-document-title\s*\{[^}]*font-size:\s*16px/s);
  assert.match(styles, /\.walmart-items td\s*\{[^}]*font-size:\s*14px/s);
  assert.match(styles, /\.walmart-subtotal\s*\{[^}]*font-size:\s*18px/s);
  assert.match(styles, /\.walmart-total\s*\{[^}]*font-size:\s*24px/s);
  assert.match(styles, /\.walmart-barcode\s*\{/);
  assert.match(styles, /\.walmart-wordmark\s*\{[^}]*width:\s*174px/s);
  assert.match(styles, /\.walmart-buyer p > span\s*\{[^}]*color:\s*#2e2f32\s*!important[^}]*font-size:\s*16px[^}]*font-weight:\s*400\s*!important[^}]*line-height:\s*24px/s);
  assert.match(styles, /\.walmart-print-header\s*\{[^}]*top:\s*21\.6px/s);
  assert.match(styles, /\.walmart-purchase-card\s*\{[^}]*min-height:\s*553px/s);
  assert.match(styles, /\.walmart-tax\s*\{[^}]*border-top:\s*0/s);

  assert.match(script, /forceWalmartStyle\("\*"/);
  assert.match(script, /400 16px "Walmart Everyday Sans"/);
  assert.match(script, /700 16px "Walmart Everyday Sans"/);
});
