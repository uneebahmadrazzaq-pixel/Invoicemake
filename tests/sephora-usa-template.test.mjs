import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Sephora USA is selectable, editable, and renders the supplied invoice layout", async () => {
  const [editorSource, styles, editorHtml] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"sephorausa",\s*name:\s*"Sephora USA"/);
  assert.match(editorSource, /template\.id === "sephorausa"/);
  assert.match(editorSource, /function renderSephoraUsaPreview/);
  assert.match(editorSource, /class="invoice-doc sephora-usa-invoice"/);
  assert.match(editorSource, /Sephora USA Inc\./);
  assert.match(editorSource, /Sephora&gt;MyAccount&gt;AccountBalance/);
  assert.match(editorSource, /CAMP\./);
  assert.match(editorSource, /Tax is based on Customer price/);
  assert.match(editorSource, /Sephora Customer Service/);
  assert.match(editorSource, /sephoraUsaCustomerCount/);
  assert.match(editorSource, /sephoraUsaDiscount/);
  assert.match(editorSource, /state\.current\.templateId === "sephorausa" \? "letter"/);

  assert.match(editorHtml, /id="sephoraUsaFields"/);
  assert.match(editorHtml, /id="sephoraUsaCustomerCount"/);
  assert.match(editorHtml, /id="sephoraUsaDiscount"/);

  assert.match(styles, /\.sephora-usa-invoice\s*\{/);
  assert.match(styles, /width:\s*816px/);
  assert.match(styles, /min-height:\s*1056px/);
  assert.match(styles, /\.sephora-usa-products\s*\{/);
  assert.match(styles, /\.sephora-usa-summary\s*\{/);
  assert.match(styles, /\.sephora-usa-footer\s*\{/);
});
