import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("manual cleaning uses its shortened workspace name", async () => {
  const html = await readFile(new URL("public/editor/index.html", root), "utf8");
  const app = await readFile(new URL("public/editor/app.js", root), "utf8");
  assert.match(html, /> Manual Data Cleaning\s*</);
  assert.doesNotMatch(html, /Manual Data Cleaning and Invoice Splitter/);
  assert.match(app, /"data-cleaning": "Manual Data Cleaning"/);
});

test("admin directory includes dated feature and template access controls", async () => {
  const client = await readFile(new URL("cloud/client.ts", root), "utf8");
  const schema = await readFile(new URL("convex/schema.ts", root), "utf8");
  const users = await readFile(new URL("convex/users.ts", root), "utf8");
  const auth = await readFile(new URL("convex/lib/auth.ts", root), "utf8");
  for (const feature of ["bulkInvoiceGenerator", "dataCleaning", "manualDataCleaning", "metadataRemover", "pdfCompressor"]) {
    assert.match(client, new RegExp(feature));
    assert.match(schema, new RegExp(feature));
  }
  assert.match(client, /name="accessStartDate"/);
  assert.match(client, /name="accessEndDate"/);
  assert.match(client, /class="cloud-template-grid"/);
  assert.match(auth, /Administrator renewal is required/);
  assert.match(users, /accessEndsAt: args\.accessEndsAt \?\? undefined/);
});
