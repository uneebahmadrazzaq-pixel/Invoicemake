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
  assert.match(client, /data-admin-save-status/);
  assert.doesNotMatch(client, /alert\(messageFrom\(error\)\)/);
  assert.match(auth, /Administrator renewal is required/);
  assert.match(users, /accessEndsAt: args\.accessEndsAt \?\? undefined/);
  assert.match(users, /Choose today or a future date before activating this user/);
});

test("admin header keeps comfortable spacing and a themed refresh action", async () => {
  const [html, styles] = await Promise.all([
    readFile(new URL("public/editor/index.html", root), "utf8"),
    readFile(new URL("public/editor/cloud/cloud.css", root), "utf8"),
  ]);

  assert.match(html, /cloud\/cloud\.css\?v=20260908-admin-header-v14/);
  assert.match(styles, /#admin \.cloud-admin-intro[\s\S]*?padding: 26px 28px !important/);
  assert.match(styles, /#admin \.cloud-admin-intro \.btn[\s\S]*?background: linear-gradient\(135deg,#7137e8,#8647ef\) !important/);
  assert.match(styles, /cloud-admin-refresh-in/);
  assert.match(styles, /@media \(max-width: 620px\)[\s\S]*?#admin \.cloud-admin-intro/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?#admin \.cloud-admin-intro/);
});
