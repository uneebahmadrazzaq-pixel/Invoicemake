import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("invoice editor exposes the requested workspace actions", async () => {
  const html = await readFile(new URL("public/editor/index.html", root), "utf8");

  assert.doesNotMatch(html, /id="invoiceAddClient"/);
  assert.doesNotMatch(html, /id="printInvoice"/);
  assert.match(html, /id="invoiceSavedInvoices"[\s\S]*?Saved Invoices/);
  assert.match(html, /id="downloadInvoiceJpg"[\s\S]*?Download JPG/);
  assert.match(html, /id="clearAllItems"[\s\S]*?Clear All/);
});

test("invoice editor uses structured Bill To and Ship To address panels", async () => {
  const [html, script, styles] = await Promise.all([
    readFile(new URL("public/editor/index.html", root), "utf8"),
    readFile(new URL("public/editor/app.js", root), "utf8"),
    readFile(new URL("public/editor/dashboard-light.css", root), "utf8")
  ]);

  for (const id of [
    "invoiceBillToName",
    "invoiceBillToStreet",
    "invoiceBillToCity",
    "invoiceBillToPostal",
    "invoiceBillToCountry",
    "invoiceShipToName",
    "invoiceShipToStreet",
    "invoiceShipToCity",
    "invoiceShipToPostal",
    "invoiceShipToCountry"
  ]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /data-clear-invoice-address="billTo"/);
  assert.match(html, /data-clear-invoice-address="shipTo"/);
  assert.match(script, /function readInvoiceStructuredAddress\(type\)/);
  assert.match(script, /function populateInvoiceStructuredAddress\(type, fields, fallbackValue, isPaperstone = false\)/);
  assert.match(html, /data-paperstone-address-name-label/);
  assert.match(html, /data-paperstone-address-extra/);
  assert.match(script, /function downloadCurrentInvoiceJpg\(\)/);
  assert.match(styles, /\.invoice-address-grid\s*\{/);
  assert.match(styles, /\.invoice-address-card\s*\{/);
});
