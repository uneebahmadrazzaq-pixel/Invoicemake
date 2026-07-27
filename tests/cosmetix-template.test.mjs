import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("Cosmetix Club is selectable and renders the supplied A4 invoice design", async () => {
  const [editorSource, styles] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8")
  ]);
  const editorHtml = await readFile(new URL("../public/editor/index.html", import.meta.url), "utf8");

  assert.match(editorSource, /id:\s*"cosmetix",\s*name:\s*"Cosmetix Club"/);
  assert.match(editorSource, /template\.id === "cosmetix"/);
  assert.match(editorSource, /function renderCosmetixPreview/);
  assert.match(editorSource, /class="invoice-doc cosmetix-invoice"/);
  assert.match(editorSource, /465 S\. DEAN STREET/);
  assert.match(editorSource, /AMOUNT PAID:/);
  assert.match(editorSource, /state\.current\.amountPaid/);
  assert.match(editorHtml, /id="amountPaid"/);
  assert.match(editorSource, /PAYMENT METHOD/);
  assert.match(editorSource, /cosmetix-club-logo\.png/);
  assert.match(styles, /\.cosmetix-invoice\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);

  await access(new URL("../public/assets/cosmetix-club-logo.png", import.meta.url));
});
