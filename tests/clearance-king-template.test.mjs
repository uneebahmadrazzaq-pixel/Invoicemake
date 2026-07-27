import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("Clearance King is selectable, editable, and renders the supplied A4 invoice", async () => {
  const [editorSource, editorHtml, styles, dashboardStyles] = await Promise.all([
    readFile(new URL("public/editor/app.js", root), "utf8"),
    readFile(new URL("public/editor/index.html", root), "utf8"),
    readFile(new URL("public/editor/styles.css", root), "utf8"),
    readFile(new URL("public/editor/dashboard-light.css", root), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"clearanceking",\s*name:\s*"Clearance King Ltd"/);
  assert.match(editorSource, /templateId === "clearanceking"/);
  assert.match(editorSource, /renderClearanceKingPreview\(invoice, totals\)/);
  assert.match(editorSource, /class="invoice-doc clearance-king-invoice"/);
  assert.match(editorSource, /Shipping &amp; Handling/);
  assert.match(editorSource, /invoice\.templateId === "clearanceking"[\s\S]*netAmount \+ shipping/);
  assert.match(editorHtml, /id="clearanceKingVatNumber"/);
  assert.match(styles, /\.clearance-king-invoice\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
  assert.match(dashboardStyles, /body\.dashboard-light \.view \.clearance-king-invoice/);
});
