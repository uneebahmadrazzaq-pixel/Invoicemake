import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const editorSource = await readFile(
  new URL("../public/editor/app.js", import.meta.url),
  "utf8",
);

test("VetUK remains available in the template library", () => {
  assert.match(editorSource, /id:\s*"vetuk"/);
  assert.match(editorSource, /state\.current\.templateId\s*=\s*"vetuk"/);
  assert.match(editorSource, /renderVetUkPreview\(invoice, totals/);
});
