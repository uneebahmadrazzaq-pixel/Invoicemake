import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Abena is selectable and renders the supplied editable A4 prepaid invoice", async () => {
  const [editorSource, styles, editorHtml] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"abena",\s*name:\s*"Abena Prepaid Invoice"/);
  assert.match(editorSource, /template\.id === "abena"/);
  assert.match(editorSource, /function renderAbenaPreview/);
  assert.match(editorSource, /class="invoice-doc abena-invoice"/);
  assert.match(editorSource, /Invoice Account No\.:/);
  assert.match(editorSource, /Order Account No\.:/);
  assert.match(editorSource, /Prepaid Invoice/);
  assert.match(editorSource, /Material description/);
  assert.match(editorSource, /Total net weight/);
  assert.match(editorSource, /Abena UK Ltd/);
  assert.match(editorSource, /invoice\.templateId === "justmae" \|\| invoice\.templateId === "abena"/);

  assert.match(editorHtml, /id="abenaFields"/);
  assert.match(editorHtml, /id="abenaInvoiceAccount"/);
  assert.match(editorHtml, /id="abenaSalesOrder"/);
  assert.match(editorHtml, /id="abenaPackingDetails"/);

  assert.match(styles, /\.invoice-doc\.abena-invoice\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
  assert.match(styles, /@page abena-a4/);
  assert.match(styles, /\.abena-products\s*\{/);
  assert.match(styles, /\.abena-totals\s*\{/);
});
