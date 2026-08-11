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
const dashboardStyles = await readFile(
  new URL("../public/editor/dashboard-light.css", import.meta.url),
  "utf8",
);

test("VetUK remains available in the template library", () => {
  assert.match(editorSource, /id:\s*"vetuk"/);
  assert.match(editorSource, /state\.current\.templateId\s*=\s*"vetuk"/);
  assert.match(editorSource, /renderVetUkPreview\(invoice, totals/);
  assert.match(editorStyles, /\.vetuk-invoice \{[\s\S]*font-family: Arial, Helvetica, sans-serif;/);
  assert.match(dashboardStyles, /body\.dashboard-light \.view \.vetuk-invoice,[\s\S]*font-family: Arial, Helvetica, sans-serif !important;/);
  assert.match(dashboardStyles, /\.vetuk-table th \{[\s\S]*color: #ffffff !important;[\s\S]*background: #123f73 !important;/);
});
