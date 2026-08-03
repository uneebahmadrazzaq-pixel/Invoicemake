import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Qogita UK is an editable A4 invoice matching the supplied reference", async () => {
  const [editorSource, styles, dashboardStyles] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/dashboard-light.css", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"qogitauk",\s*name:\s*"Qogita UK"/);
  assert.match(editorSource, /template\.id === "qogitauk"/);
  assert.match(editorSource, /function renderQogitaUkPreview/);
  assert.match(editorSource, /class="invoice-doc qogita-uk-invoice"/);
  assert.match(editorSource, /class="qogita-mondu-badge" role="img" aria-label="Mondú pay later"><\/div>/);
  assert.doesNotMatch(editorSource, /<small>30 days payment terms<\/small>/);
  assert.match(editorSource, /Qogita UK LTD/);
  assert.match(editorSource, /1 Poultry Wework, 4th Floor/);
  assert.match(editorSource, /Domestic For Resale/);
  assert.match(editorSource, /SELLER ID/);
  assert.match(editorSource, /GTIN/);
  assert.match(editorSource, /Payment Status:/);
  assert.match(editorSource, /const paymentStatus = "Paid in Full"/);
  assert.match(editorSource, /formatQogitaDate/);
  assert.match(editorSource, /state\.current\.cardExpiry\s*=\s*"03\/30"/);
  assert.match(editorSource, /qogitauk:\s*\{\s*headers:/);

  assert.match(styles, /\.qogita-uk-invoice\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
  assert.match(styles, /\.qogita-wordmark\s*\{/);
  assert.match(styles, /\.qogita-mondu-badge\s*\{/);
  assert.match(styles, /font-family:\s*"Roboto", sans-serif/);
  assert.match(styles, /qogita-reference-page\.png/);
  assert.match(styles, /qogita-mondu-transparent\.png/);
  assert.match(styles, /background:\s*transparent url\("\.\/assets\/qogita-mondu-transparent\.png"\)/);
  assert.match(styles, /\.qogita-uk-invoice,\s*\.qogita-uk-invoice \*\s*\{[\s\S]*font-family:\s*"Roboto", sans-serif !important/);
  assert.match(styles, /\.qogita-uk-invoice,\s*\.qogita-uk-invoice \*\s*\{[\s\S]*font-synthesis:\s*none !important/);
  assert.match(styles, /\.qogita-uk-invoice,\s*\.qogita-uk-invoice \*\s*\{[\s\S]*letter-spacing:\s*0 !important/);
  assert.match(styles, /\.qogita-meta > div \{ display:\s*flex; justify-content:\s*flex-end; gap:\s*5px; white-space:\s*nowrap; \}/);
  assert.doesNotMatch(styles, /\.qogita-meta dd \{[^}]*min-width/);
  assert.match(styles, /\.qogita-header \{ position: relative; min-height: 166px; \}/);
  assert.match(styles, /\.qogita-meta \{[\s\S]*top:\s*6px/);
  assert.match(styles, /\.qogita-address-grid \{ min-height: 149px; \}/);
  assert.match(styles, /\.qogita-company-grid h2,[\s\S]*color:\s*#687181 !important/);
  assert.match(styles, /\.qogita-address-grid p \{ color:\s*#000 !important/);
  assert.match(styles, /font-size:\s*12px/);
  assert.match(styles, /\.qogita-products\s*\{/);
  assert.match(styles, /\.qogita-products-section\s*\{\s*min-height:\s*110px/);
  assert.match(styles, /border-bottom:\s*1px solid #c7c7c7/);
  assert.match(styles, /\.qogita-totals \{ margin-top:\s*2px/);
  assert.match(styles, /\.qogita-transaction\s*\{/);
  assert.match(editorSource, /&copy; 2025 Qogita\. All rights reserved\./);
  const qogitaRenderer = editorSource.slice(editorSource.indexOf("function renderQogitaUkPreview"), editorSource.indexOf("function renderCostcoUkPreview"));
  assert.doesNotMatch(qogitaRenderer, /Page 1 of 1/);
  assert.match(editorSource, /async function waitForInvoiceAssets/);
  assert.match(editorSource, /document\.fonts\?\.ready/);
  assert.match(styles, /\.qogita-totals dd \{ color:\s*#000; font-weight:\s*400; \}/);
  assert.match(styles, /\.qogita-transaction strong,[\s\S]*font-weight:\s*400/);
  assert.match(styles, /\.items-table\.is-qogita-items/);
  assert.match(dashboardStyles, /body\.dashboard-light \.view \.qogita-uk-invoice/);
  assert.match(dashboardStyles, /body\.dashboard-light \.view \.qogita-uk-invoice \*[\s\S]*font-family:\s*"Roboto", sans-serif !important/);
  assert.match(styles, /\.qogita-address-grid h2 \{ position:\s*relative; top:\s*2px; \}/);
  assert.match(styles, /\.qogita-address-grid p \{ font-size:\s*12\.5px !important; \}/);
  assert.match(styles, /\.qogita-transaction \{[^}]*margin-top:\s*72px[^}]*color:\s*#5f6776 !important/);
  assert.match(styles, /\.qogita-transaction b \{ font-size:\s*13\.75px; \}/);
  assert.match(dashboardStyles, /\.qogita-transaction :is\(strong, span, b\)[\s\S]*color:\s*#5f6776 !important/);
  assert.match(dashboardStyles, /\.qogita-company-grid h2,[\s\S]*color:\s*#687181 !important/);
  assert.match(dashboardStyles, /\.qogita-company-grid p,[\s\S]*color:\s*#000 !important/);
});
