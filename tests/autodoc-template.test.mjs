import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("Auto Doc is selectable and renders the supplied editable Letter invoice", async () => {
  const [editorSource, editorHtml, styles] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"autodoc",\s*name:\s*"Auto Doc Invoice"/);
  assert.match(editorSource, /template\.id === "autodoc"/);
  assert.match(editorSource, /function renderAutodocPreview/);
  assert.match(editorSource, /class="invoice-doc autodoc-invoice"/);
  assert.match(editorSource, /Autodoc Operations UK Limited/);
  assert.match(editorSource, /TOTAL PAID/);
  assert.match(editorSource, /autodocBankInformation/);
  assert.match(editorSource, /autodocTerms/);
  assert.match(editorSource, /autodoc-source-reference\.jpg/);
  assert.match(editorSource, /<td>VAT \$\{vatRate\.toFixed\(0\)\}%<\/td>/);
  assert.match(editorSource, /state\.current\.templateId === "autodoc" \? "letter"/);

  assert.match(editorHtml, /id="autodocFields"/);
  assert.match(editorHtml, /id="autodocCompanyName"/);
  assert.match(editorHtml, /id="autodocOrderReference"/);
  assert.match(editorHtml, /id="autodocBankInformation"/);
  assert.match(editorHtml, /id="autodocTerms"/);

  assert.match(styles, /\.autodoc-invoice\s*\{/);
  assert.match(styles, /width:\s*816px/);
  assert.match(styles, /height:\s*1056px/);
  assert.match(styles, /@page autodoc-letter/);

  await access(new URL("../public/assets/autodoc-source-reference.jpg", import.meta.url));
});
