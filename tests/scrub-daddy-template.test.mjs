import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("Scrub Daddy is selectable, editable, and matches the supplied VAT-inclusive invoice", async () => {
  const [editorSource, styles, editorHtml] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"scrubdaddy",\s*name:\s*"Scrub Daddy Invoice"/);
  assert.match(editorSource, /function renderScrubDaddyPreview/);
  assert.match(editorSource, /class="invoice-doc scrub-daddy-invoice"/);
  assert.match(editorSource, /1 Ormidale Square/);
  assert.match(editorSource, /Invoice Number:/);
  assert.match(editorSource, /Order Number:/);
  assert.match(editorSource, /includes \$\{money\(totals\.tax/);
  assert.match(editorSource, /state\.current\.scrubDaddyVatNumber/);
  assert.match(editorSource, /state\.current\.scrubDaddyShippingService/);
  assert.match(editorSource, /invoice\.templateId === "jellycat" \|\| invoice\.templateId === "scrubdaddy"/);

  assert.match(editorHtml, /id="scrubDaddyFields"/);
  assert.match(editorHtml, /id="scrubDaddyVatNumber"/);
  assert.match(editorHtml, /id="scrubDaddyShippingService"/);

  assert.match(styles, /\.scrub-daddy-invoice\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
  assert.match(styles, /\.scrub-daddy-products\s*\{/);
  assert.match(styles, /\.scrub-daddy-summary\s*\{/);

  await access(new URL("../public/assets/scrub-daddy-logo.png", import.meta.url));
});
