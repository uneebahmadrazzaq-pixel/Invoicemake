import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Justmae Limited is selectable, editable, and renders the supplied A4 sales invoice", async () => {
  const [editorSource, styles, editorHtml] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"justmae",\s*name:\s*"Justmae Limited"/);
  assert.match(editorSource, /function renderJustmaePreview/);
  assert.match(editorSource, /class="invoice-doc justmae-invoice"/);
  assert.match(editorSource, /JUSTMAE LIMITED/);
  assert.match(editorSource, /SALES INVOICE/);
  assert.match(editorSource, /First Floor Unit 3 Cromwell Road/);
  assert.match(editorSource, /TERMS &amp; CONDITIONS/);
  assert.match(editorSource, /state\.current\.justmaeVatNumber/);
  assert.match(editorSource, /state\.current\.justmaePaypalFee/);
  assert.match(editorSource, /invoice\.templateId === "justmae" \? netAmount \+ shipping/);
  assert.match(editorHtml, /id="justmaeFields"/);
  assert.match(editorHtml, /id="justmaeVatNumber"/);
  assert.match(editorHtml, /id="justmaePaypalFee"/);
  assert.match(styles, /\.justmae-invoice\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
  assert.match(styles, /color:\s*#07844c/);
  assert.match(styles, /\.justmae-summary\s*\{/);
  assert.match(styles, /\.justmae-footer\s*\{/);
});
