import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const editorSource = await readFile(new URL("../public/editor/app.js", import.meta.url), "utf8");
const editorHtml = await readFile(new URL("../public/editor/index.html", import.meta.url), "utf8");
const editorStyles = await readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8");

test("Perfume Limited is available as an editable tax invoice template", () => {
  assert.match(editorSource, /id: "perfumeunlimited", name: "Perfume Limited Tax Invoice"/);
  assert.match(editorSource, /function renderPerfumeUnlimitedPreview\(invoice, totals\)/);
  assert.match(editorSource, /state\.current\.taxRate = 5/);
  assert.match(editorSource, /Giorgio Armani Stronger with You Absolutely Eau de Perfume 100ml/);
  assert.match(editorHtml, /id="perfumeUnlimitedFields"/);
  assert.match(editorHtml, /id="perfumeTrn"/);
  assert.match(editorStyles, /\.perfume-unlimited-invoice \{/);
  assert.match(editorStyles, /font-family: "Perfume Arial Narrow Bold"/);
  assert.match(editorStyles, /background: #00b0f0/);
  assert.match(editorStyles, /@page perfume-unlimited-letter \{ size: letter; margin: 0; \}/);
});

test("Perfume Limited exports with the source Letter page size", () => {
  assert.match(
    editorSource,
    /state\.current\.templateId === "perfumeunlimited" \? "letter" : pdfFormat/
  );
});
