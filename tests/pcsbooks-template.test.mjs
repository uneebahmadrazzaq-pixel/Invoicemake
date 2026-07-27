import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("PCS Books template is selectable and has its own A4 invoice renderer", async () => {
  const [editorSource, styles] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"pcsbooks",\s*name:\s*"PCS Books"/);
  assert.match(editorSource, /template\.id === "pcsbooks"/);
  assert.match(editorSource, /function renderPcsBooksPreview/);
  assert.match(editorSource, /class="invoice-doc pcsbooks-invoice"/);
  assert.match(editorSource, /Trading as <strong>Books4People<\/strong>/);
  assert.match(editorSource, /VAT Breakdown - Net Amount/);
  assert.match(editorSource, /Commodity Code:/);
  assert.match(styles, /\.pcsbooks-invoice\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
});
