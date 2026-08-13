import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("renders saved invoices as a client-based directory", async () => {
  const [html, script, styles] = await Promise.all([
    readFile(new URL("public/editor/index.html", projectRoot), "utf8"),
    readFile(new URL("public/editor/app.js", projectRoot), "utf8"),
    readFile(new URL("public/editor/dashboard-light.css", projectRoot), "utf8"),
  ]);

  assert.match(html, /class="view saved-invoices-view" id="saved"/);
  assert.match(html, /Find every invoice by client/);
  assert.doesNotMatch(html, /Export invoice data/);
  assert.match(html, /class="saved-directory" id="savedGrid"/);

  assert.match(script, /const groupedInvoices = new Map\(\)/);
  assert.match(script, /Invoices saved by client/);
  assert.match(script, /data-saved-filter="generated"/);
  assert.match(script, /data-saved-filter="drafts"/);
  assert.match(script, /data-download-saved=/);
  assert.match(script, /data-load-invoice=/);
  assert.match(script, /savedSource = "bulk-generator"/);
  assert.match(script, /Bulk Invoice Generator/);
  assert.match(script, /Edit invoice/);
  assert.match(script, /data-delete-invoice=/);
  assert.match(script, /deleteSavedInvoice/);
  assert.match(script, /immediateCloud: true/);
  assert.match(script, /syncInvoiceFromForm\(\);/);
  assert.match(script, /async function generateBulkInvoices/);

  assert.match(styles, /#saved \.saved-client-directory/);
  assert.match(styles, /#saved \.saved-invoice-table/);
  assert.match(styles, /#saved \.saved-heading-signal/);
  assert.match(styles, /#saved \.saved-source-pill/);
  assert.match(styles, /#saved \.saved-row-actions button\.is-danger/);
});
