import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Yiwu Oudiya is selectable and renders the supplied paid invoice layout", async () => {
  const [editorSource, styles] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"yiwuoudiya",\s*name:\s*"Yiwu Oudiya Paid Invoice"/);
  assert.match(editorSource, /template\.id === "yiwuoudiya"/);
  assert.match(editorSource, /function renderYiwuOudiyaPreview/);
  assert.match(editorSource, /class="invoice-doc yiwu-oudiya-invoice"/);
  assert.match(editorSource, /assets\/yiwu-oudiya-logo\.png/);
  assert.match(editorSource, /PAID INVOICE/);
  assert.match(editorSource, /Yiwu Oudiya Trading Co, Ltd\./);
  assert.match(editorSource, /BILL TO/);
  assert.match(editorSource, /SHIP TO/);
  assert.match(editorSource, /PAYMENT METHOD/);
  assert.match(editorSource, /Product Details/);
  assert.match(editorSource, /Grand Total:/);
  assert.match(editorSource, /Terms and conditions:/);

  assert.match(styles, /\.yiwu-oudiya-invoice\s*\{/);
  assert.match(styles, /width:\s*210mm/);
  assert.match(styles, /min-height:\s*297mm/);
  assert.match(styles, /\.yiwu-items\s*\{/);
  assert.match(styles, /\.yiwu-totals\s*\{/);
});
