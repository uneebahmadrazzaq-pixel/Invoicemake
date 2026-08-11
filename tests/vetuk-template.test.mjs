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

test("VetUK remains available and preserves source PDF typography", () => {
  assert.match(editorSource, /id:\s*"vetuk"/);
  assert.match(editorSource, /state\.current\.templateId\s*=\s*"vetuk"/);
  assert.match(editorSource, /renderVetUkPreview\(invoice, totals/);
  assert.match(editorStyles, /\.vetuk-invoice \{[\s\S]*font-family: "Roboto", Arial, sans-serif;[\s\S]*font-weight: 400;/);
  assert.match(editorStyles, /\.vetuk-billto h4 \{[\s\S]*font-weight: 400;/);
  assert.match(editorStyles, /\.vetuk-billto-address strong \{[\s\S]*font-size: 16px;[\s\S]*font-weight: 700;/);
  assert.match(editorStyles, /\.vetuk-notes p \{[\s\S]*font-size: 12px;[\s\S]*font-weight: 400;/);
  assert.match(editorStyles, /\.vetuk-terms p \{[\s\S]*font-size: 12px;[\s\S]*font-weight: 400;/);
  assert.match(editorSource, /class="vetuk-billto-address"[\s\S]*escapeHtml\(vetUkBillToName\)/);
  assert.match(editorSource, /const isVetUkExport = state\.current\.templateId === "vetuk";/);
  assert.match(editorSource, /const isFixedA4Export = isPortonExport \|\| isVetUkExport;/);
  assert.match(dashboardStyles, /body\.dashboard-light \.view \.vetuk-invoice,[\s\S]*font-family: "Roboto", Arial, sans-serif !important;/);
  assert.match(dashboardStyles, /\.vetuk-table th \{[\s\S]*color: #ffffff !important;[\s\S]*background: #093970 !important;/);
});
