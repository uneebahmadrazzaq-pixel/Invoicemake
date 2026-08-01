import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("product table places Add Title below the rows and Clear All beside CSV controls", async () => {
  const [editorHtml, editorSource, styles] = await Promise.all([
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/dashboard-light.css", import.meta.url), "utf8")
  ]);

  assert.match(
    editorHtml,
    /items-table-wrap[\s\S]*?class="single-items-footer"[\s\S]*?data-add-item[\s\S]*?Add Title/
  );
  assert.match(editorHtml, /id="clearAllItems"[\s\S]*?Clear All/);
  assert.equal((editorHtml.match(/data-add-item/g) || []).length, 1);
  assert.doesNotMatch(editorHtml, /id="addItem"/);
  assert.match(editorSource, /querySelectorAll\("\[data-add-item\]"\)/);
  assert.match(editorSource, /button\.dataset\.focusField/);
  assert.match(editorSource, /querySelector\(`\[data-field="\$\{focusField\}"\]`\)/);
  assert.match(styles, /\.single-add-item-button\s*\{/);
  assert.match(styles, /\.single-items-footer\s*\{/);
});
