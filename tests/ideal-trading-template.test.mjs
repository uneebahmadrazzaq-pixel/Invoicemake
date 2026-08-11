import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Ideal Trading USA Toy Wholesale is selectable and renders the supplied editable invoice", async () => {
  const [editorSource, styles, editorHtml] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"idealtrading",\s*name:\s*"Ideal Trading USA - Toy Wholesale"/);
  assert.match(editorSource, /template\.id === "idealtrading"/);
  assert.match(editorSource, /function renderIdealTradingPreview/);
  assert.match(editorSource, /class="invoice-doc ideal-trading-invoice"/);
  assert.match(editorSource, /Ideal Trading USA Inc -/);
  assert.match(editorSource, /Toy Wholesale/);
  assert.match(editorSource, /Invoice To/);
  assert.match(editorSource, /Ship To/);
  assert.match(editorSource, /Terms &amp; Conditions\/Notes:/);
  assert.match(editorSource, /www\.idealtradingusa\.com/);
  assert.match(editorSource, /5000 Grand Ave, Maspeth, NY/);

  assert.match(styles, /\.ideal-trading-invoice\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
  assert.match(styles, /\.ideal-products\s*\{/);
  assert.match(styles, /\.ideal-totals\s*\{/);
  assert.match(styles, /\.ideal-bottom-motif\s*\{/);

  assert.match(editorHtml, /styles\.css\?v=20260811-porton-pdf-font-v91/);
  assert.doesNotMatch(editorHtml, /id="previewTemplateName"/);
  assert.doesNotMatch(editorHtml, /id="duplicateInvoice"/);
});
