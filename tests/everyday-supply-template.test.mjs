import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Everyday Supply Co. is available as an editable two-page proforma invoice", async () => {
  const [editorSource, editorHtml, styles, pageSource] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"everydaysupply",\s*name:\s*"Everyday Supply Co\. Proforma Invoice"/);
  assert.match(editorSource, /function renderEverydaySupplyPreview/);
  assert.match(editorSource, /class="invoice-doc everyday-invoice"/);
  assert.match(editorSource, /class="invoice-page everyday-page everyday-page-one"/);
  assert.match(editorSource, /class="invoice-page everyday-page everyday-page-two"/);
  assert.match(editorSource, /PROFORMA INVOICE/);
  assert.match(editorSource, /BARCODE:/);
  assert.match(editorSource, /everydayTerms/);
  assert.match(editorHtml, /id="everydayFields"/);
  assert.match(editorHtml, /id="everydayCompanyName"/);
  assert.match(editorHtml, /id="everydaySupportEmail"/);
  assert.match(styles, /\.everyday-invoice\s*\{/);
  assert.match(styles, /@page everyday-a4/);
  assert.match(pageSource, /20260926-everyday-supply/);
});
