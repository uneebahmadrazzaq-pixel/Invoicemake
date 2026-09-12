import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("Pound Wholesale keeps reference typography, colours, footer and download fidelity", async () => {
  const [editorSource, styles, themeStyles, editorHtml] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/dashboard-light.css", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /function renderPoundPreview/);
  assert.match(editorSource, /class="pound-incoterms">INCOTERMS - DAP<\/p>/);
  assert.match(editorSource, /<h2>Sales Invoice<\/h2>/);
  assert.doesNotMatch(editorSource, /<h2><span>INCOTERMS - DAP/);
  assert.match(editorSource, /class="pound-two-column pound-address-block"/);
  assert.match(editorSource, /class="pound-discrepancy"/);
  assert.match(editorSource, /class="pound-totals"/);
  assert.match(editorSource, /SHIPPING &amp; HANDLING:/);
  assert.match(editorSource, /const firstPageCapacity = 6/);
  assert.match(editorSource, /const continuationPageCapacity = 22/);
  assert.match(editorSource, /class="pound-page invoice-page/);
  assert.match(editorSource, /\$\{footer\}/);

  assert.match(styles, /url\("\.\.\/assets\/trebuchet-ms-reference\.ttf"\)/);
  assert.match(styles, /url\("\.\.\/assets\/trebuchet-ms-bold-reference\.ttf"\)/);
  assert.doesNotMatch(styles, /url\("\/assets\/trebuchet-ms-(?:bold-)?reference\.ttf"\)/);
  assert.match(styles, /\.pound-sales-order,\s*\.pound-sales-order \*[\s\S]*?font-family:\s*"Pound Trebuchet Reference"[\s\S]*?font-synthesis:\s*none/);
  assert.match(styles, /\.pound-two-column p\s*\{[^}]*font-weight:\s*400/);
  assert.match(styles, /\.pound-page\s*\{[^}]*height:\s*1123px/);
  assert.match(styles, /\.pound-logo-image\s*\{[^}]*width:\s*305px/);
  assert.match(styles, /\.pound-incoterms\s*\{[^}]*font-size:\s*18px/);
  assert.match(styles, /\.pound-order-strip\s*\{[^}]*grid-template-columns:\s*22\.4% 25\.6% 25\.9% 26\.1%/);
  assert.match(styles, /\.pound-order-strip div\s*\{[^}]*border-right:\s*3px solid #fff/);
  assert.match(styles, /\.pound-products\s*\{[^}]*border:\s*1\.5px solid var\(--pound-navy\)/);
  assert.match(styles, /\.pound-products td\s*\{[^}]*border-right:\s*0\.75px solid var\(--pound-navy\)/);
  assert.match(styles, /\.pound-totals\s*\{[^}]*gap:\s*4px/);
  assert.match(styles, /\.pound-totals div\s*\{[^}]*min-height:\s*32px/);
  assert.match(styles, /\.pound-discrepancy\s*\{[^}]*position:\s*absolute !important[^}]*bottom:\s*17px/);

  assert.match(themeStyles, /body\.dashboard-light \.view \.pound-sales-order,/);
  assert.match(themeStyles, /\.pound-two-column h4,[\s\S]*?\.pound-products th[\s\S]*?color:\s*#ffffff !important/);
  assert.match(editorSource, /const poundInvoice = clonedDocument\.querySelector\("\.pound-sales-order"\)/);
  assert.match(editorSource, /document\.fonts\.load\('400 16px "Pound Trebuchet Reference"'\)/);
  assert.match(editorSource, /const isPoundExport = state\.current\.templateId === "pound"/);
  assert.match(editorSource, /isHighResolutionExport[^;]*\|\| isPoundExport/);
  assert.match(editorSource, /const usesLosslessImage = isZoroExport \|\| isPoundExport/);

  assert.match(editorHtml, /trebuchet-ms-reference\.ttf" as="font"/);
  assert.match(editorHtml, /trebuchet-ms-bold-reference\.ttf" as="font"/);
  assert.match(editorHtml, /styles\.css\?v=20260912-bestway-details-v18/);
  assert.match(editorHtml, /dashboard-light\.css\?v=20260912-bestway-details-v14/);
  assert.match(editorHtml, /app\.js\?v=20260912-bestway-details-v18/);

  await Promise.all([
    access(new URL("../public/assets/pound-wholesale-logo.png", import.meta.url)),
    access(new URL("../public/assets/trebuchet-ms-reference.ttf", import.meta.url)),
    access(new URL("../public/assets/trebuchet-ms-bold-reference.ttf", import.meta.url))
  ]);
});
