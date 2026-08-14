import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("RYZE Coffee is selectable and renders the editable two-page paid invoice", async () => {
  const [source, html, styles] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8")
  ]);

  assert.match(source, /id:\s*"ryze",\s*name:\s*"RYZE Coffee Paid Invoice"/);
  assert.match(source, /function renderRyzePreview/);
  assert.match(source, /class="invoice-doc ryze-invoice"/);
  assert.match(source, /class="ryze-page ryze-page-one invoice-page"/);
  assert.match(source, /class="ryze-page ryze-page-two invoice-page"/);
  assert.match(source, /assets\/ryze-coffee-product\.png/);
  assert.match(source, /RSF-526990474/);
  assert.match(source, /RYZE Mushroom Coffee USDA Organic/);
  assert.match(source, /Amount Paid/);
  assert.match(source, /Return Policy/);
  assert.match(source, /Mastercard/);

  assert.match(html, /id="ryzeFields"/);
  assert.match(html, /id="ryzeSellerAddress"/);
  assert.match(html, /id="ryzeReduction"/);
  assert.match(html, /id="ryzeTerms"/);
  assert.match(html, /id="ryzeReturnPolicy"/);
  assert.match(html, /id="ryzeContactEmail"/);

  assert.match(styles, /\.ryze-invoice\s*\{/);
  assert.match(styles, /--ryze-purple:\s*#6b38c7/);
  assert.match(styles, /\.ryze-products\s*\{/);
  assert.match(styles, /\.ryze-paid-stamp\s*\{/);
  assert.match(styles, /min-height:\s*2246px/);
});
