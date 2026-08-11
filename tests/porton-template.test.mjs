import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const editorSource = await readFile(new URL("../public/editor/app.js", import.meta.url), "utf8");
const editorHtml = await readFile(new URL("../public/editor/index.html", import.meta.url), "utf8");
const editorStyles = await readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8");
const dashboardStyles = await readFile(new URL("../public/editor/dashboard-light.css", import.meta.url), "utf8");

test("Porton is available as an editable source-matched invoice template", () => {
  assert.match(editorSource, /id: "porton", name: "Porton Garden Aquatic & Pets"/);
  assert.match(editorSource, /function renderPortonPreview\(invoice, totals\)/);
  assert.match(editorSource, /state\.current\.invoiceNumber = "1149702"/);
  assert.match(editorSource, /state\.current\.shippingAmount = 7\.99/);
  assert.match(editorSource, /Marina 7\.5cm Nylon Net 20cm Vinyl Coated Handle/);
  assert.match(editorSource, /invoice\.templateId === "porton"/);
  assert.match(editorHtml, /id="portonFields"/);
  assert.match(editorHtml, /id="portonVatNumber"/);
  assert.match(editorStyles, /font-family: "Porton Open Sans"/);
  assert.match(editorStyles, /porton-source-open-sans-regular\.ttf/);
  assert.match(editorStyles, /porton-source-open-sans-bold\.ttf/);
  assert.match(editorStyles, /\.porton-logo \{[^}]*width: 203\.1px;[^}]*height: 37\.79px;/);
  assert.match(editorStyles, /\.porton-invoice > \.porton-order-meta \{[^}]*position: absolute;[^}]*top: 167\.72px;/);
  assert.match(editorStyles, /\.porton-invoice > \.porton-products \{[^}]*position: absolute;[^}]*top: 271\.53px;[^}]*left: 75\.59px;[^}]*width: 642\.52px;/);
  assert.match(editorStyles, /\.porton-invoice > \.porton-totals \{[^}]*position: absolute;[^}]*top: 357\.81px;/);
  assert.match(editorStyles, /\.porton-invoice > \.porton-footer \{[^}]*position: absolute;[^}]*top: 1001\.38px;/);
  assert.match(editorSource, /invoice\.portonVatNumber \|\| "750456633"/);
  assert.match(dashboardStyles, /body\.dashboard-light \.view \.porton-invoice/);
  assert.match(dashboardStyles, /\.porton-products th \{[\s\S]*color: #fff !important;[\s\S]*background: #000 !important;/);
});

test("Porton uses inclusive UK VAT and A4 export", () => {
  assert.match(editorSource, /vatInclusive[\s\S]*invoice\.templateId === "porton"/);
  assert.match(editorStyles, /width: 794px;[\s\S]*min-height: 1123px;/);
});
