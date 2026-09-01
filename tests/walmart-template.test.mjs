import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("Walmart is selectable, editable, and rendered at the source template size", async () => {
  const [script, html, styles, sourceStyles, regularFont, boldFont, sourceRegularFont, sourceBoldFont, logo, deliveryMark, barcode] = await Promise.all([
    readFile(new URL("public/editor/app.js", root), "utf8"),
    readFile(new URL("public/editor/index.html", root), "utf8"),
    readFile(new URL("public/editor/styles.css", root), "utf8"),
    readFile(new URL("public/editor/walmart-source.css", root), "utf8"),
    stat(new URL("public/assets/fonts/walmart-everyday-sans-regular.woff2", root)),
    stat(new URL("public/assets/fonts/walmart-everyday-sans-bold.woff2", root)),
    stat(new URL("public/assets/fonts/walmart-source-regular.ttf", root)),
    stat(new URL("public/assets/fonts/walmart-source-bold.ttf", root)),
    stat(new URL("public/assets/walmart-logo.png", root)),
    stat(new URL("public/assets/walmart-delivery-mark.png", root)),
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
  assert.match(script, /assets\/walmart-delivery-mark\.png/);
  assert.match(script, /class="walmart-print-footer"/);
  assert.match(script, /groupId=1fe5aa3b2b7829461e6c5da79b25db1f/);
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
  assert.match(html, /walmart-source-regular\.ttf/);
  assert.match(html, /walmart-source-bold\.ttf/);
  assert.match(html, /20260901-walmart-exact-source/);
  assert.match(html, /walmart-source\.css\?v=20260901-walmart-exact-source/);

  assert.ok(regularFont.size > 0);
  assert.ok(boldFont.size > 0);
  assert.ok(sourceRegularFont.size > 0);
  assert.ok(sourceBoldFont.size > 0);
  assert.ok(logo.size > 0);
  assert.ok(deliveryMark.size > 0);
  assert.ok(barcode.size > 0);
  assert.match(styles, /font-family:\s*"Walmart Source Sans"/);
  assert.match(styles, /walmart-source-regular\.ttf/);
  assert.match(styles, /walmart-source-bold\.ttf/);
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
  assert.match(styles, /\.walmart-summary\s*\{[^}]*color:\s*#2e2f32\s*!important[^}]*font-size:\s*14px/s);
  assert.match(styles, /\.walmart-delivery span\s*\{[^}]*color:\s*#0053e2\s*!important[^}]*font-size:\s*14px/s);
  assert.match(styles, /\.walmart-barcode-block > span\s*\{[^}]*color:\s*#2e2f32\s*!important[^}]*font-size:\s*14px/s);
  assert.match(styles, /\.walmart-barcode\s*\{/);
  assert.match(styles, /\.walmart-wordmark\s*\{[^}]*width:\s*174px/s);
  assert.match(styles, /\.walmart-buyer p > span\s*\{[^}]*color:\s*#2e2f32\s*!important[^}]*font-size:\s*16px[^}]*font-weight:\s*400\s*!important[^}]*line-height:\s*24px/s);
  assert.match(styles, /\.walmart-print-header\s*\{[^}]*top:\s*21\.6px/s);
  assert.match(styles, /\.walmart-print-footer\s*\{[^}]*bottom:\s*19\.2px[^}]*font-size:\s*10\.65px/s);
  assert.match(styles, /\.walmart-delivery-mark\s*\{[^}]*width:\s*20px[^}]*height:\s*17px/s);
  assert.match(styles, /\.walmart-purchase-card\s*\{[^}]*min-height:\s*553px/s);
  assert.match(styles, /\.walmart-tax\s*\{[^}]*border-top:\s*0/s);
  assert.match(sourceStyles, /\.invoice-doc\.walmart-invoice \.walmart-summary\.walmart-delivery > span\s*\{[^}]*#0053e2/s);
  assert.match(sourceStyles, /\.invoice-doc\.walmart-invoice \.walmart-subtotal\s*\{[^}]*min-height:\s*57px[^}]*font-size:\s*18px/s);
  assert.match(sourceStyles, /\.invoice-doc\.walmart-invoice \.walmart-total\s*\{[^}]*min-height:\s*70px[^}]*font-size:\s*24px/s);

  assert.match(script, /forceWalmartStyle\("\*"/);
  assert.match(script, /const isWalmartExport = state\.current\.templateId === "walmart"/);
  assert.match(script, /isWalmartExport \|\| isFixedA4Export/);
  assert.match(script, /forceWalmartStyle\("\.walmart-delivery span"[\s\S]*"#0053e2"/);
  assert.match(script, /400 16px "Walmart Source Sans"/);
  assert.match(script, /700 16px "Walmart Source Sans"/);
});
