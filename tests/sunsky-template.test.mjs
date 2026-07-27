import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("Sunsky is selectable and renders the supplied editable commercial invoice", async () => {
  const [editorSource, styles, editorHtml] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"sunsky",\s*name:\s*"Sunsky Commercial Invoice"/);
  assert.match(editorSource, /template\.id === "sunsky"/);
  assert.match(editorSource, /function renderSunskyPreview/);
  assert.match(editorSource, /class="invoice-doc sunsky-invoice"/);
  assert.match(editorSource, /Shenzhen SUNSKY Technology Limited/);
  assert.match(editorSource, /Commercial INVOICE/);
  assert.match(editorSource, /To Bill:/);
  assert.match(editorSource, /To Ship:/);
  assert.match(editorSource, /Payment Status:/);
  assert.match(editorSource, /HS Code/);
  assert.match(editorSource, /Total Amount:/);
  assert.match(editorSource, /sunskySalesperson/);
  assert.match(editorSource, /sunskyRemarks/);
  assert.match(editorHtml, /id="sunskyFields"/);
  assert.match(editorHtml, /id="sunskySalesperson"/);
  assert.match(editorHtml, /id="sunskyRemarks"/);
  assert.match(styles, /\.sunsky-invoice\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
  assert.match(styles, /\.sunsky-products\s*\{/);
  assert.match(styles, /grid-template-columns:\s*1fr 1fr 0\.84fr/);

  await access(new URL("../public/assets/sunsky-logo.png", import.meta.url));
});
