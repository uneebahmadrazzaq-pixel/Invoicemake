import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const appSource = await readFile(new URL("../public/editor/app.js", import.meta.url), "utf8");
const cssSource = await readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8");

test("Tropicana Wholesale is registered with reference invoice defaults", () => {
  assert.match(appSource, /id: "tropicana", name: "Tropicana Wholesale Invoice"/);
  assert.match(appSource, /state\.current\.invoiceNumber = "1971609"/);
  assert.match(appSource, /state\.current\.trackingId = "D11686072"/);
  assert.match(appSource, /state\.current\.orderId = "954017"/);
});

test("Tropicana renders two editable landscape pages with calculated VAT", () => {
  assert.match(appSource, /function renderTropicanaPreview\(invoice, totals\)/);
  assert.equal((appSource.match(/invoice-page tropicana-page/g) || []).length, 2);
  assert.match(appSource, /lineVat = net \* taxRate \/ 100/);
  assert.match(appSource, /pdfOrientation = state\.current\.templateId === "tropicana" \? "landscape"/);
  assert.match(cssSource, /@page tropicana-landscape \{ size: A4 landscape; margin: 0; \}/);
});

test("Tropicana item editor exposes invoice-specific product columns", () => {
  for (const field of ["origin", "commodityDesc", "netKg"]) {
    assert.match(appSource, new RegExp(`data-field="${field}"`));
  }
  assert.match(cssSource, /\.items-table\.is-tropicana-items/);
});
