import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("Drugstore Products is selectable and renders the editable letter invoice", async () => {
  const [editorSource, editorHtml, styles] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"drugstoreproducts",\s*name:\s*"Drugstore Products Discount Wholesale"/);
  assert.match(editorSource, /template\.id === "drugstoreproducts"/);
  assert.match(editorSource, /function renderDrugstorePreview/);
  assert.match(editorSource, /class="invoice-doc drugstore-invoice"/);
  assert.match(editorSource, /Balance Due:/);
  assert.match(editorSource, /drugstoreAmountPaid/);
  assert.match(editorSource, /drugstore-products-logo\.png/);

  assert.match(editorHtml, /id="drugstoreFields"/);
  assert.match(editorHtml, /id="drugstoreCompanyName"/);
  assert.match(editorHtml, /id="drugstoreNotes"/);
  assert.match(editorHtml, /id="drugstoreTerms"/);
  assert.match(editorHtml, /styles\.css\?v=20260926-/);

  assert.match(styles, /\.drugstore-invoice\s*\{/);
  assert.match(styles, /width:\s*816px/);
  assert.match(styles, /height:\s*1056px/);
  assert.match(styles, /@page drugstore-letter/);

  await access(new URL("../public/assets/drugstore-products-logo.png", import.meta.url));
});
