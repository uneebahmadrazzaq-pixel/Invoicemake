import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("Great Lakes Wholesale Group is available as an editable US invoice template", async () => {
  const [editorSource, editorHtml, styles] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"greatlakes",\s*name:\s*"Great Lakes Wholesale Group"/);
  assert.match(editorSource, /template\.id === "greatlakes"/);
  assert.match(editorSource, /function renderGreatLakesPreview/);
  assert.match(editorSource, /class="invoice-doc great-lakes-invoice"/);
  assert.match(editorSource, /assets\/great-lakes-wholesale-logo\.png/);
  assert.match(editorSource, /Customer ID/);
  assert.match(editorSource, /Cash In Advance/);
  assert.match(editorSource, /Make all checks payable to Great Lakes Wholesale/);

  assert.match(editorHtml, /id="greatLakesFields"/);
  assert.match(editorHtml, /id="greatLakesCustomerId"/);
  assert.match(editorHtml, /id="greatLakesSalesperson"/);
  assert.match(editorHtml, /id="greatLakesSubtotalAdjustment"/);

  assert.match(styles, /\.great-lakes-invoice\s*\{/);
  assert.match(styles, /width:\s*816px/);
  assert.match(styles, /height:\s*1056px/);
  assert.match(styles, /@page great-lakes-letter/);

  await access(new URL("../public/assets/great-lakes-wholesale-logo.png", import.meta.url));
});
