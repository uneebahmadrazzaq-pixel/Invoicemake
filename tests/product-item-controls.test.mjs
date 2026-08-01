import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("product table keeps an add-title button beside the CSV controls", async () => {
  const [editorHtml, editorSource, styles] = await Promise.all([
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8")
  ]);

  assert.match(
    editorHtml,
    /class="btn primary single-add-item-button" data-add-item data-focus-field="product" type="button">Add Title<\/button>/
  );
  assert.equal((editorHtml.match(/data-add-item/g) || []).length, 1);
  assert.doesNotMatch(editorHtml, /id="addItem"/);
  assert.match(editorSource, /querySelectorAll\("\[data-add-item\]"\)/);
  assert.match(editorSource, /button\.dataset\.focusField/);
  assert.match(editorSource, /querySelector\(`\[data-field="\$\{focusField\}"\]`\)/);
  assert.match(styles, /\.single-add-item-button\s*\{/);
});
