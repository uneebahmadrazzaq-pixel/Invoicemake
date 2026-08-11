import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const editorSource = await readFile(new URL("../public/editor/app.js", import.meta.url), "utf8");
const editorHtml = await readFile(new URL("../public/editor/index.html", import.meta.url), "utf8");
const editorStyles = await readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8");
const dashboardStyles = await readFile(new URL("../public/editor/dashboard-light.css", import.meta.url), "utf8");

test("Perfume Limited is available as an editable tax invoice template", () => {
  assert.match(editorSource, /id: "perfumeunlimited", name: "Perfume Limited Tax Invoice"/);
  assert.match(editorSource, /function renderPerfumeUnlimitedPreview\(invoice, totals\)/);
  assert.match(editorSource, /state\.current\.taxRate = 5/);
  assert.match(editorSource, /Giorgio Armani Stronger with You Absolutely Eau de Perfume 100ml/);
  assert.match(editorHtml, /id="perfumeUnlimitedFields"/);
  assert.match(editorHtml, /id="perfumeTrn"/);
  assert.match(editorStyles, /\.perfume-unlimited-invoice \{/);
  assert.match(editorStyles, /font-family: "Perfume Arial Narrow Bold"/);
  assert.match(editorStyles, /perfume-arial-narrow-bold\.woff2/);
  assert.match(editorStyles, /background: #00b0f0/);
  assert.match(editorSource, /const cardBrand = normalizedCardType\.includes\("american"\)/);
  assert.match(editorSource, /perfume-card-mark perfume-card-mark--\$\{cardBrand\}/);
  assert.match(editorStyles, /\.perfume-card-mark--visa/);
  assert.match(editorStyles, /\.perfume-card-mark--amex/);
  assert.match(editorSource, /<col class="perfume-unit-price-col">/);
  assert.match(editorStyles, /\.perfume-unit-price-col \{ width: 101\.96px; \}/);
  assert.match(editorStyles, /td:nth-child\(4\) \{[^}]*text-align: center !important;/);
  assert.match(dashboardStyles, /source-PDF product columns centered/);
  assert.doesNotMatch(editorSource, /<section class="perfume-unlimited-transaction"/);
  assert.match(editorSource, /class="perfume-unlimited-card"/);
  assert.match(editorSource, /shippingAmountField: new Set\(\[[^\]]*"perfumeunlimited"/);
  assert.match(editorSource, /state\.current\.templateId === "qogitauk" \|\| state\.current\.templateId === "perfumeunlimited"/);
  assert.match(editorStyles, /grid-template-columns: 256\.92px 71\.29px/);
  assert.match(editorStyles, /\.perfume-unlimited-thanks img \{[^}]*top: -13\.39px;[^}]*left: 155\.08px;/);
  assert.match(dashboardStyles, /Preserve the exact embedded typography and black ink from TAX INVOICE\.pdf/);
  assert.match(dashboardStyles, /\.perfume-unlimited-invoice[\s\S]*color: #000 !important/);
  assert.match(dashboardStyles, /font-family: "Perfume Arial Bold", Arial, sans-serif !important/);
  assert.match(editorStyles, /@page perfume-unlimited-letter \{ size: letter; margin: 0; \}/);
});

test("Perfume Limited exports with the source Letter page size", () => {
  assert.match(
    editorSource,
    /state\.current\.templateId === "perfumeunlimited" \? "letter" : pdfFormat/
  );
});
