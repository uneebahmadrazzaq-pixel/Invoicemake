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
  assert.match(html, /Review every invoice saved against a client/);
  assert.match(html, /class="saved-directory" id="savedGrid"/);

  assert.match(script, /const groupedInvoices = new Map\(\)/);
  assert.match(script, /Invoices saved by client/);
  assert.match(script, /data-saved-filter="generated"/);
  assert.match(script, /data-saved-filter="drafts"/);
  assert.match(script, /data-download-saved=/);
  assert.match(script, /data-load-invoice=/);

  assert.match(styles, /#saved \.saved-client-directory/);
  assert.match(styles, /#saved \.saved-invoice-table/);
  assert.match(styles, /#saved \.saved-overview/);
});
