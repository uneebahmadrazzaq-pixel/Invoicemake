import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("invoice builder exposes the Add Client action in its header", async () => {
  const html = await readFile(new URL("public/editor/index.html", root), "utf8");

  assert.match(html, /id="invoiceAddClient"/);
  assert.match(html, /class="invoice-client-list" id="invoiceClientCards"/);
  assert.match(html, /id="invoiceClientSelect" aria-label="Selected client"/);
});

test("invoice builder renders selectable client identity cards", async () => {
  const script = await readFile(new URL("public/editor/app.js", root), "utf8");

  assert.match(script, /function renderInvoiceClientCards\(\)/);
  assert.match(script, /client\.name \|\| "Unnamed Client"/);
  assert.match(script, /`Case \$\{client\.caseNumber\}`/);
  assert.match(script, /client\.email \|\| "No email saved"/);
  assert.match(script, /data-invoice-client=/);
  assert.match(script, /handleBuilderClientSelect\(button\.dataset\.invoiceClient, "single"\)/);
});

test("invoice client cards have full-width responsive styling", async () => {
  const css = await readFile(new URL("public/editor/dashboard-light.css", root), "utf8");

  assert.match(css, /\.invoice-client-choice\s*\{[\s\S]*?width:\s*100%/);
  assert.match(css, /\.invoice-client-details/);
  assert.match(css, /@media \(max-width: 720px\)/);
});
