import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const editorSource = await readFile(new URL("../app.js", import.meta.url), "utf8");
const editorStyles = await readFile(new URL("../styles.css", import.meta.url), "utf8");

test("Porton Garden Aquatic & Pets is available as an editable UK invoice template", () => {
  assert.match(editorSource, /id: "portongarden", name: "Porton Garden Aquatic & Pets"/);
  assert.match(editorSource, /function renderPortonGardenPreview\(invoice, totals\)/);
  assert.match(editorSource, /porton-garden-logo\.png/);
  assert.match(editorSource, /Pet Shop Licence LN\/000015406/);
  assert.match(editorSource, /state\.current\.currency = "GBP"/);
  assert.match(editorSource, /state\.current\.taxRate = 20/);
  assert.match(editorStyles, /\.porton-garden-invoice \{/);
  assert.match(editorStyles, /@page porton-garden-a4 \{ size: A4; margin: 0; \}/);
});
