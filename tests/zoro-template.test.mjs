import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("Zoro USA is selectable and renders the supplied editable letter invoice", async () => {
  const [editorSource, styles, editorHtml] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"zoro",\s*name:\s*"Zoro USA"/);
  assert.match(editorSource, /template\.id === "zoro"/);
  assert.match(editorSource, /function renderZoroPreview/);
  assert.match(editorSource, /class="invoice-doc zoro-invoice" style="--zoro-copy: #050505; color: #050505;/);
  assert.match(editorSource, /class="zoro-upper-sheet"/);
  assert.match(editorSource, /SUMMARY TERMS AND CONDITIONS/);
  assert.match(editorSource, /ZORO TOOLS, INC\. LIMITED WARRANTY/);
  assert.match(editorSource, /Shipping Cost/);
  assert.match(editorSource, /Amount Due/);
  assert.match(editorSource, /state\.current\.templateId === "zoro" \? "letter" : "a4"/);

  for (const fieldId of [
    "zoroFields",
    "zoroCustomerNumber",
    "zoroTerms",
    "zoroDueDate",
    "zoroMailingAddress",
    "zoroRemitTo",
    "zoroShippingMethod",
    "zoroAmountDue"
  ]) {
    assert.match(editorHtml, new RegExp(`id="${fieldId}"`));
    assert.match(editorSource, new RegExp(fieldId));
  }

  assert.match(styles, /\.zoro-invoice\s*\{/);
  assert.match(styles, /min-height:\s*1028px/);
  assert.match(styles, /padding:\s*50px 28px 24px 40px/);
  assert.match(styles, /--zoro-copy:\s*#050505/);
  assert.match(styles, /\.zoro-invoice \*\s*\{[\s\S]*?font-family:\s*Arial, Helvetica, sans-serif !important/);
  assert.match(styles, /grid-template-columns:\s*219px 230px 1fr/);
  assert.match(styles, /\.zoro-brand-column\s*\{[\s\S]*?position:\s*absolute/);
  assert.match(styles, /\.zoro-mailing p\s*\{[\s\S]*?left:\s*90px/);
  assert.match(styles, /\.zoro-primary-meta\s*\{[\s\S]*?left:\s*256px/);
  assert.match(styles, /\.zoro-title-meta\s*\{[\s\S]*?left:\s*502px/);
  assert.match(styles, /\.zoro-upper-sheet\s*\{[\s\S]*?transform:\s*none/);
  assert.match(styles, /\.zoro-addresses p\s*\{[\s\S]*?font-size:\s*11px/);
  assert.match(styles, /\.zoro-mailing\s*\{[\s\S]*?left:\s*-5px/);
  assert.match(styles, /-webkit-text-fill-color:\s*var\(--zoro-copy\) !important/);
  assert.match(styles, /\.zoro-products\s*\{/);
  assert.match(styles, /@page zoro-letter/);

  await access(new URL("../public/assets/zoro-logo.png", import.meta.url));
});
