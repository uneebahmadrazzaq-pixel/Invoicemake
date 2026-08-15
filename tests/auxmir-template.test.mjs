import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Auxmir is selectable and renders the supplied editable VAT invoice", async () => {
  const [editorSource, editorHtml, styles] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"auxmir",\s*name:\s*"Auxmir Invoice"/);
  assert.match(editorSource, /template\.id === "auxmir"/);
  assert.match(editorSource, /function renderAuxmirPreview/);
  assert.match(editorSource, /class="invoice-doc auxmir-invoice"/);
  assert.match(editorSource, /HomeCore Commerce Co\., Limited/);
  assert.match(editorSource, /GB508618776/);
  assert.match(editorSource, /PROMOTION TOTAL/);
  assert.match(editorSource, /GIFT-WRAP TOTAL/);
  assert.match(editorSource, /GRAND TOTAL/);
  assert.match(editorHtml, /id="auxmirFields"/);
  assert.match(editorHtml, /id="auxmirSellerAddress"/);
  assert.match(styles, /\.auxmir-invoice\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
  assert.match(styles, /background:\s*#2db0c6/);
});
