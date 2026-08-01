import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("invoice builder locks internal client fields and hides unused template fields", async () => {
  const [html, script, css] = await Promise.all([
    readFile(new URL("public/editor/index.html", root), "utf8"),
    readFile(new URL("public/editor/app.js", root), "utf8"),
    readFile(new URL("public/editor/dashboard-light.css", root), "utf8")
  ]);

  assert.match(html, /id="caseNumber"[^>]*readonly[^>]*aria-readonly="true"/);
  assert.match(html, /Profile Label <small>Internal<\/small>/);
  assert.match(html, /id="invoiceClientName"[^>]*readonly[^>]*aria-readonly="true"/);
  assert.match(html, /id="paymentDetailsField"/);
  assert.match(html, /id="paymentMethodField"/);
  assert.match(script, /const templateOptionalFields =/);
  assert.match(script, /function applyTemplateFieldVisibility\(templateId\)/);
  assert.match(script, /els\[fieldId\]\.hidden = !templatesUsingField\.has\(templateId\)/);
  assert.doesNotMatch(script, /paymentDetailsField: new Set\([^\n]*"paperstone"/);
  assert.match(css, /\.editor-form \[hidden\][\s\S]*display:\s*none !important/);
});

test("invoice builder downloads a sample CSV matching the selected template", async () => {
  const [html, script] = await Promise.all([
    readFile(new URL("public/editor/index.html", root), "utf8"),
    readFile(new URL("public/editor/app.js", root), "utf8")
  ]);

  assert.match(html, /id="downloadSingleSampleCsv"/);
  assert.match(html, /id="singleCsvColumns"/);
  assert.match(script, /paperstone:\s*\{\s*headers:\s*\["sku", "description", "qty", "pack", "vatCode", "unit"\]/);
  assert.match(script, /pcsbooks:\s*\{\s*headers:\s*\["sku", "qty", "description", "unit"\]/);
  assert.match(script, /function downloadTemplateSampleCsv\(templateId, includeBulkColumns\)/);
  assert.match(script, /downloadText\(`\$\{template\.id\}-sample-products\.csv`/);
  assert.match(script, /pack:\s*Math\.max\(1, Number\(row\.pack/);
  assert.match(script, /vatCode:\s*row\.vatCode \|\| row\.vat/);
});
