import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Costco Wholesale USA is editable and matches the supplied invoice structure", async () => {
  const [editorSource, styles, editorHtml, cloudClient] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/cloud/client.js", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"costcousa",\s*name:\s*"Costco Wholesale USA"/);
  assert.match(editorSource, /template\.id === "costcousa"/);
  assert.match(editorSource, /function renderCostcoUsaPreview/);
  assert.match(editorSource, /class="invoice-doc costco-usa-invoice"/);
  assert.match(editorSource, /150 Lawrence Station Rd, Sunnyvale/);
  assert.match(editorSource, /MEMBERSHIP NO:/);
  assert.match(editorSource, /ORDER SUB TOTAL/);
  assert.match(editorSource, /THANK YOU/);
  assert.match(editorSource, /costcoUsaMembershipNumber/);
  assert.match(editorSource, /costcoUsaCompanyAddress/);
  assert.match(editorSource, /costcoUsaTerms/);

  assert.match(editorHtml, /id="costcoUsaFields"/);
  assert.match(editorHtml, /id="costcoUsaMembershipNumber"/);
  assert.match(editorHtml, /id="costcoUsaCompanyAddress"/);
  assert.match(editorHtml, /id="costcoUsaTerms"/);
  assert.match(editorHtml, /styles\.css\?v=20261024-ideal-trading-address-v68/);
  assert.match(editorHtml, /dashboard-light\.css\?v=20261021-costco-usa-full-update-v21/);
  assert.match(editorHtml, /app\.js\?v=20261024-ideal-trading-export-v58/);
  assert.match(cloudClient, /\["costcousa","Costco Wholesale USA"\]/);

  assert.match(styles, /\.costco-usa-invoice\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
  assert.match(styles, /\.costco-usa-products\s*\{/);
  assert.match(styles, /\.costco-usa-summary\s*\{/);
});
