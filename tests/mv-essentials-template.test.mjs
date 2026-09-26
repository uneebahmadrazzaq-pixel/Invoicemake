import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("MV Essentials is selectable and renders the supplied six-page invoice", async () => {
  const [editorSource, styles] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"mvessentials",\s*name:\s*"MV Essentials Ltd Invoice"/);
  assert.match(editorSource, /templateId === "mvessentials"/);
  assert.match(editorSource, /function renderMvEssentialsPreview/);
  assert.match(editorSource, /class="invoice-doc mv-essentials-invoice"/);
  assert.match(editorSource, /assets\/mv-essentials-logo\.png/);
  assert.match(editorSource, /MV Essentials LTD TERMS AND CONDITIONS OF SALE/);
  assert.match(editorSource, /Invoice No\./);
  assert.match(editorSource, /Customer info:/);
  assert.match(editorSource, /Billing Address:/);
  assert.match(editorSource, /Shipping Address:/);
  assert.match(editorSource, /MVE-277104/);
  assert.match(editorSource, /HI TRADING Ltd/);
  assert.match(editorSource, /Gucci - Rush 30 ml\./);
  assert.match(editorSource, /GB337207119/);
  assert.match(editorSource, /11\. General/);
  assert.equal((editorSource.match(/class="invoice-page mv-page/g) || []).length, 6);

  assert.match(styles, /\.mv-essentials-invoice\s*\{/);
  assert.match(styles, /\.mv-page\s*\{/);
  assert.match(styles, /width:\s*210mm/);
  assert.match(styles, /min-height:\s*297mm/);
  assert.match(styles, /\.mv-products\s*\{/);
  assert.match(styles, /\.mv-legal-box\s*\{/);
});
