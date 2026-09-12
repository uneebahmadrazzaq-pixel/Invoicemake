import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("Justmae Limited is selectable, editable, and renders the supplied A4 sales invoice", async () => {
  const [editorSource, styles, themeStyles, editorHtml] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/dashboard-light.css", import.meta.url), "utf8"),
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
  assert.match(editorSource, /invoice\.templateId === "justmae" \|\| invoice\.templateId === "abena"[^?]*\? netAmount \+ shipping/);
  assert.match(editorHtml, /id="justmaeFields"/);
  assert.match(editorHtml, /id="justmaeVatNumber"/);
  assert.match(editorHtml, /id="justmaePaypalFee"/);
  assert.match(styles, /\.justmae-invoice\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
  assert.match(styles, /color:\s*#07844c/);
  assert.match(styles, /font-family:\s*"Justmae Times Reference"/);
  assert.match(styles, /font-family:\s*"Justmae Arial Reference"/);
  assert.match(styles, /font-family:\s*"Justmae Brush Reference"/);
  assert.match(styles, /\.justmae-company h2\s*\{[^}]*font-size:\s*36px/);
  assert.match(styles, /\.justmae-company p\s*\{[^}]*letter-spacing:\s*\.55px/);
  assert.match(styles, /\.justmae-meta h3\s*\{[^}]*letter-spacing:\s*1\.35px/);
  assert.doesNotMatch(styles, /\.justmae-invoice\s*\{[^}]*font-family:\s*"Courier New"/);
  assert.match(styles, /\.justmae-invoice,\s*\.justmae-invoice \*\s*\{[^}]*font-synthesis:\s*none/);
  assert.match(themeStyles, /body\.dashboard-light \.view \.justmae-invoice,[\s\S]*?font-synthesis:\s*none\s*!important/);
  assert.match(themeStyles, /font-family:\s*"Justmae Times Reference"[^;]*!important/);
  assert.match(themeStyles, /font-family:\s*"Justmae Arial Reference"[^;]*!important/);
  assert.match(themeStyles, /font-family:\s*"Justmae Brush Reference"[^;]*!important/);
  assert.match(editorSource, /document\.fonts\.load\('400 16px "Justmae Times Reference"'\)/);
  assert.match(editorSource, /document\.fonts\.load\('italic 400 16px "Justmae Brush Reference"'\)/);
  assert.match(editorSource, /const isJustmaeExport = state\.current\.templateId === "justmae"/);
  assert.match(editorSource, /usesLosslessImage[^;]*\|\| isJustmaeExport/);
  assert.match(editorSource, /const justmaeInvoice = clonedDocument\.querySelector\("\.justmae-invoice"\)/);
  assert.match(editorSource, /forceJustmaeStyle\("\.justmae-company h2"[^}]*"font-size":\s*"36px"/);
  assert.match(editorHtml, /justmae-times-new-roman\.ttf" as="font"/);
  assert.match(editorHtml, /justmae-brush-script-mt\.ttf" as="font"/);
  assert.match(editorHtml, /styles\.css\?v=20260912-justmae-font-lock-v21/);
  assert.match(editorHtml, /dashboard-light\.css\?v=20260912-justmae-font-lock-v17/);
  assert.match(editorHtml, /app\.js\?v=20260912-justmae-font-lock-v21/);
  assert.match(styles, /\.justmae-summary\s*\{/);
  assert.match(styles, /\.justmae-footer\s*\{/);

  await access(new URL("../public/assets/fonts/justmae-times-new-roman.ttf", import.meta.url));
  await access(new URL("../public/assets/fonts/justmae-brush-script-mt.ttf", import.meta.url));
});
