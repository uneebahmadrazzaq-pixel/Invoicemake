import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

test("Dallas Wholesale Group is selectable and matches the supplied editable invoice", async () => {
  const [editorSource, editorHtml, editorCss, pageSource] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"dallaswholesale",\s*name:\s*"Dallas Wholesale Group"/);
  assert.match(editorSource, /function renderDallasWholesalePreview/);
  assert.match(editorSource, /assets\/dallas-wholesale-logo\.png/);
  assert.match(editorSource, /DWG - DALLAS WHOLESALE GROUP/);
  assert.match(editorSource, /PRODUCT<\/th><th>QTY<\/th><th>SKU\/ASIN<\/th><th>DESCRIPTION<\/th><th>PRICE<\/th><th>AMOUNT/);
  assert.match(editorSource, /BALANCE DUE/);
  assert.match(editorSource, /Due on receipt/);
  assert.match(editorHtml, /id="dallasFields"/);
  assert.match(editorHtml, /id="dallasCompanyName"/);
  assert.match(editorHtml, /id="dallasDueDate"/);
  assert.match(editorCss, /\.dallas-wholesale-invoice/);
  assert.match(editorCss, /@page dallas-wholesale-letter/);
  assert.match(pageSource, /20260815-final-consolidated-invoice-tools/);
  await access(new URL("../public/assets/dallas-wholesale-logo.png", import.meta.url));
});
