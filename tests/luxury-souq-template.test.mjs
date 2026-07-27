import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const editorSource = await readFile(
  new URL("../public/editor/app.js", import.meta.url),
  "utf8",
);
const editorStyles = await readFile(
  new URL("../public/editor/styles.css", import.meta.url),
  "utf8",
);

test("Luxury Souq watches is available as an editable invoice template", () => {
  assert.match(editorSource, /id:\s*"luxurysouq"/);
  assert.match(editorSource, /name:\s*"Luxury Souq \(Watches\)"/);
  assert.match(editorSource, /renderLuxurySouqPreview\(invoice, totals\)/);
  assert.match(editorSource, /state\.current\.cardExpiry/);
  assert.match(editorStyles, /\.luxury-souq-invoice/);
});
