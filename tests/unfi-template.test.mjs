import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("UNFI is selectable and renders the supplied editable US Letter invoice", async () => {
  const [editorSource, styles, editorHtml] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"unfi",\s*name:\s*"UNFI Invoice"/);
  assert.match(editorSource, /template\.id === "unfi"/);
  assert.match(editorSource, /function renderUnfiPreview/);
  assert.match(editorSource, /class="invoice-doc unfi-invoice"/);
  assert.match(editorSource, /DELIVERY NO\./);
  assert.match(editorSource, /BILL OF LADING/);
  assert.match(editorSource, /CUSTOMER PURCHASE ORDER NO\./);
  assert.match(editorSource, /PRODUCT DESCRIPTION/);
  assert.match(editorSource, /Remit in USD Only/);
  assert.match(editorSource, /unfiDeliveryNumber/);
  assert.match(editorSource, /unfiSalesOrderNumber/);
  assert.match(editorSource, /unfiDiscount/);
  assert.match(editorSource, /templateId === "unfi"\s*\?\s*Number\(invoice\.unfiDiscount/);
  assert.match(editorSource, /templateId === "unfi"\s*\?\s*"letter"/);

  assert.match(editorHtml, /id="unfiFields"/);
  assert.match(editorHtml, /id="unfiDeliveryNumber"/);
  assert.match(editorHtml, /id="unfiSalesOrderNumber"/);
  assert.match(editorHtml, /id="unfiShipToCode"/);
  assert.match(editorHtml, /id="unfiBillToCode"/);
  assert.match(editorHtml, /id="unfiDiscount"/);

  assert.match(styles, /\.unfi-invoice\s*\{/);
  assert.match(styles, /width:\s*816px/);
  assert.match(styles, /min-height:\s*1056px/);
  assert.match(styles, /@page unfi-letter/);
  assert.match(styles, /\.unfi-products-wrap\s*\{/);
  assert.match(styles, /\.unfi-summary\s*\{/);

  await access(new URL("../public/assets/unfi-logo.jpg", import.meta.url));
});
