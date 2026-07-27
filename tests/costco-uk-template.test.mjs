import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("Costco Wholesale UK is editable and matches the supplied VAT-inclusive invoice structure", async () => {
  const [editorSource, styles, editorHtml] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"costcouk",\s*name:\s*"Costco Wholesale UK"/);
  assert.match(editorSource, /template\.id === "costcouk"/);
  assert.match(editorSource, /function renderCostcoUkPreview/);
  assert.match(editorSource, /class="invoice-doc costco-uk-invoice"/);
  assert.match(editorSource, /Costco Online UK Limited Hartspring Lane/);
  assert.match(editorSource, /MEMBERSHIP NO:/);
  assert.match(editorSource, /ORDER SUB TOTAL\(INC VAT:-\)/);
  assert.match(editorSource, /VAT BREAKDOWN/);
  assert.match(editorSource, /Math\.round\(\(grossTotal \/ \(1 \+ vatRate \/ 100\)\) \* 100\) \/ 100/);
  assert.match(editorSource, /costcoMembershipNumber/);
  assert.match(editorSource, /costcoCardExpiry/);
  assert.match(editorSource, /paymentBrand === "visa"/);
  assert.match(editorSource, /paymentBrand === "mastercard"/);
  assert.match(editorSource, /AMERICAN/);
  assert.match(editorSource, /EXPRESS/);

  assert.match(editorHtml, /id="costcoUkFields"/);
  assert.match(editorHtml, /id="costcoMembershipNumber"/);
  assert.match(editorHtml, /id="costcoCardExpiry"/);

  assert.match(styles, /\.costco-uk-invoice\s*\{/);
  assert.match(styles, /font-family:\s*"Source Sans 3",\s*"Myriad Pro",\s*Arial/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
  assert.match(styles, /color:\s*#73b8ed/);
  assert.match(styles, /\.costco-products\s*\{/);
  assert.match(styles, /\.costco-card-mark--visa/);
  assert.match(styles, /\.costco-card-mark--amex/);
  assert.match(styles, /\.costco-invoice-meta\s*\{[^}]*left:\s*556px/s);
  assert.match(styles, /grid-template-columns:\s*225px 226px 1fr/);
  assert.match(styles, /\.costco-products th:nth-child\(2\)\s*\{\s*width:\s*349px/);
  assert.match(styles, /\.costco-products th:nth-child\(6\)\s*\{\s*width:\s*80px/);
  assert.match(styles, /\.costco-vat-grid\s*\{/);
  assert.match(styles, /grid-template-columns:\s*100px 76px 84px 108px 83px/);

  await access(new URL("../public/assets/costco-uk-logo.png", import.meta.url));
});
