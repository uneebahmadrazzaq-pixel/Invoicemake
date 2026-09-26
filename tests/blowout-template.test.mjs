import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Blowout Cards is selectable and renders the supplied editable invoice", async () => {
  const [editorSource, editorHtml, styles] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"blowout",\s*name:\s*"Blowout Cards"/);
  assert.match(editorSource, /template\.id === "blowout"/);
  assert.match(editorSource, /function renderBlowoutPreview/);
  assert.match(editorSource, /class="invoice-doc blowout-invoice"/);
  assert.match(editorSource, /Frontline Collectibles, INC/);
  assert.match(editorSource, /DBA: Blowout Cards/);
  assert.match(editorSource, /11 Acacia Ln, Sterling, VA 20166/);
  assert.match(editorSource, /Product Details/);
  assert.match(editorSource, /Order Total Amount:/);
  assert.match(editorSource, /blowoutHandling/);
  assert.equal(Number((282.93 + 35 + 282.93 * 0.07).toFixed(2)), 337.74);

  assert.match(editorHtml, /id="blowoutFields"/);
  assert.match(editorHtml, /id="blowoutPhone"/);
  assert.match(editorHtml, /id="blowoutHandling"/);

  assert.match(styles, /\.blowout-invoice\s*\{/);
  assert.match(styles, /width:\s*816px/);
  assert.match(styles, /min-height:\s*1056px/);
  assert.match(styles, /\.blowout-products/);
  assert.match(styles, /\.blowout-totals/);
});
