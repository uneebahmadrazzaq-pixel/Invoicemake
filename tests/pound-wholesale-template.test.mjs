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
  assert.match(editorSource, /<h2><span>INCOTERMS - DAP<\/span>Sales Invoice<\/h2>/);
  assert.match(editorSource, /class="pound-two-column pound-address-block"/);
  assert.match(editorSource, /class="pound-lower"/);
  assert.match(editorSource, /class="pound-discrepancy"/);
  assert.match(editorSource, /class="pound-totals"/);
  assert.match(editorSource, /SHIPPING &amp; HANDLING:/);

  assert.match(styles, /url\("\.\.\/assets\/trebuchet-ms-reference\.ttf"\)/);
  assert.match(styles, /url\("\.\.\/assets\/trebuchet-ms-bold-reference\.ttf"\)/);
  assert.doesNotMatch(styles, /url\("\/assets\/trebuchet-ms-(?:bold-)?reference\.ttf"\)/);
  assert.match(styles, /\.pound-sales-order,\s*\.pound-sales-order \*[\s\S]*?font-family:\s*"Pound Trebuchet Reference"[\s\S]*?font-synthesis:\s*none/);
  assert.match(styles, /\.pound-two-column p\s*\{[^}]*font-weight:\s*400/);
  assert.match(styles, /\.pound-lower\s*\{[^}]*display:\s*grid/);
  assert.match(styles, /\.pound-discrepancy\s*\{[^}]*position:\s*static !important/);

  assert.match(themeStyles, /body\.dashboard-light \.view \.pound-sales-order,/);
  assert.match(themeStyles, /\.pound-two-column h4,[\s\S]*?\.pound-products th[\s\S]*?color:\s*#ffffff !important/);
  assert.match(editorSource, /const poundInvoice = clonedDocument\.querySelector\("\.pound-sales-order"\)/);
  assert.match(editorSource, /document\.fonts\.load\('400 16px "Pound Trebuchet Reference"'\)/);
  assert.match(editorSource, /const isPoundExport = state\.current\.templateId === "pound"/);
  assert.match(editorSource, /isHighResolutionExport[^;]*\|\| isPoundExport/);
  assert.match(editorSource, /const usesLosslessImage = isZoroExport \|\| isPoundExport/);

  assert.match(editorHtml, /styles\.css\?v=20260912-pound-fidelity-v12/);
  assert.match(editorHtml, /dashboard-light\.css\?v=20260912-pound-fidelity-v10/);
  assert.match(editorHtml, /app\.js\?v=20260912-pound-fidelity-v12/);

  await Promise.all([
    access(new URL("../public/assets/pound-wholesale-logo.png", import.meta.url)),
    access(new URL("../public/assets/trebuchet-ms-reference.ttf", import.meta.url)),
    access(new URL("../public/assets/trebuchet-ms-bold-reference.ttf", import.meta.url))
  ]);
});
