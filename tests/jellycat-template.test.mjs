import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("Jellycat is selectable, editable, and renders the supplied VAT-inclusive order invoice", async () => {
  const [editorSource, styles, editorHtml] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"jellycat",\s*name:\s*"Jellycat Order Invoice"/);
  assert.match(editorSource, /function renderJellycatPreview/);
  assert.match(editorSource, /function formatJellycatParty/);
  assert.match(editorSource, /selectedClient\?\.email \|\| invoice\.clientEmail/);
  assert.match(editorSource, /class="jellycat-party-contact"/);
  assert.match(editorSource, /document\.fonts\.load\('400 16px "Jellycat Arial Reference"'\)/);
  assert.match(editorSource, /class="invoice-doc jellycat-invoice"/);
  assert.match(editorSource, /Jellycat Invoice for Order/);
  assert.match(editorSource, /Westworks Building/);
  assert.match(editorSource, /VAT Included in Total/);
  assert.match(editorSource, /state\.current\.jellycatShippingMethod/);
  assert.match(editorSource, /state\.current\.jellycatComments/);
  assert.match(editorSource, /invoice\.templateId === "jellycat"/);
  assert.match(editorSource, /vatInclusive \? taxBase \* \(taxRate \/ \(100 \+ taxRate \|\| 1\)\)/);

  assert.match(editorHtml, /id="jellycatFields"/);
  assert.match(editorHtml, /id="jellycatShippingMethod"/);
  assert.match(editorHtml, /id="jellycatComments"/);

  assert.match(styles, /\.jellycat-invoice\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
  assert.match(styles, /\.jellycat-order-meta\s*\{/);
  assert.match(styles, /\.jellycat-summary\s*\{/);
  assert.match(styles, /font-family: "Jellycat Arial Reference"/);
  assert.match(styles, /Jellycat Arial Reference[\s\S]*?perfume-arial\.woff2/);
  assert.match(styles, /Jellycat Arial Reference[\s\S]*?perfume-arial-bold\.woff2/);
  assert.match(styles, /\.jellycat-header img[\s\S]*?width: 250px[\s\S]*?height: 100px/);
  assert.match(styles, /\.jellycat-invoice > h2[\s\S]*?color: #ababab !important[\s\S]*?font-size: 18px/);
  assert.match(styles, /\.jellycat-invoice :is\(address, h3, p, dt, dd, th, td, span, strong, b, small\)[^}]*color: #000 !important/);
  assert.match(styles, /\.jellycat-addresses h3,[\s\S]*?font-size: 14px/);
  assert.match(styles, /\.jellycat-party \{[\s\S]*?color: #000 !important[\s\S]*?font-size: 12px/);
  assert.match(styles, /\.jellycat-party-name \{ font-weight: 700; \}/);
  assert.match(styles, /\.jellycat-party-contact \{ margin-top: 14px; \}/);
  assert.match(styles, /\.jellycat-items table \{[\s\S]*?font-size: 12px/);
  assert.match(styles, /\.jellycat-summary \{[\s\S]*?font-size: 12px/);
  assert.match(styles, /\.jellycat-order-meta dl > div[\s\S]*?grid-template-columns: 124px minmax\(0, 1fr\)/);
  assert.match(styles, /\.jellycat-order-meta dl:last-child > div:nth-child\(2\) dd[\s\S]*?white-space: normal/);
  assert.match(editorHtml, /styles\.css\?v=20260917-jellycat-reference-v25/);
  assert.match(editorHtml, /app\.js\?v=20260917-jellycat-reference-v22/);

  await access(new URL("../public/assets/jellycat-logo.png", import.meta.url));
});
