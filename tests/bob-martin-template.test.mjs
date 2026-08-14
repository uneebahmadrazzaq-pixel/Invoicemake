import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Bob Martin is selectable and renders the editable owner-supplied invoice", async () => {
  const [editorSource, editorHtml, styles] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"bobmartin",\s*name:\s*"Bob Martin Invoice"/);
  assert.match(editorSource, /template\.id === "bobmartin"/);
  assert.match(editorSource, /function renderBobMartinPreview/);
  assert.match(editorSource, /class="invoice-doc bob-martin-invoice"/);
  assert.match(editorSource, /assets\/bob-martin-logo\.png/);
  assert.match(editorSource, /Wemberham Lane/);
  assert.match(editorSource, /Billing Address/);
  assert.match(editorSource, /Shipping Address/);
  assert.match(editorSource, /Shipping Tax/);
  assert.match(editorSource, /Bob Martin is a trademark of Pets Choice Ltd\./);
  assert.match(editorSource, /invoiceNumber = "539"/);
  assert.match(editorSource, /orderId = "BM50170"/);
  assert.match(editorSource, /bobMartinShippingTax = 0\.5/);

  assert.match(editorHtml, /id="bobMartinFields"/);
  assert.match(editorHtml, /id="bobMartinBillingEmail"/);
  assert.match(editorHtml, /id="bobMartinShippingMethod"/);
  assert.match(editorHtml, /id="bobMartinDiscount"/);
  assert.match(editorHtml, /id="bobMartinShippingTax"/);
  assert.match(editorHtml, /id="bobMartinFee"/);

  assert.match(styles, /\.bob-martin-invoice\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
  assert.match(styles, /--bob-blue:\s*#1697d5/);
  assert.match(styles, /\.bob-martin-products\s*\{/);
  assert.match(styles, /\.bob-martin-totals\s*\{/);
});
