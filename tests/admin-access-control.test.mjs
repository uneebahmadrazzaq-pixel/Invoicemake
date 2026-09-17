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
  const migration = await readFile(new URL("supabase/migrations/202609130001_invoice_tool_supabase.sql", root), "utf8");
  for (const feature of ["bulkInvoiceGenerator", "dataCleaning", "manualDataCleaning", "metadataRemover", "pdfCompressor"]) {
    assert.match(client, new RegExp(feature));
    assert.match(migration, new RegExp(feature));
  }
  assert.match(client, /name="accessStartDate"/);
  assert.match(client, /name="accessEndDate"/);
  assert.match(client, /class="cloud-template-grid"/);
  assert.match(client, /class="cloud-feature-choice"[\s\S]*?data-lucide="check"/);
  assert.match(client, /User access details/);
  assert.match(client, /invoice-tool-logo\.png/);
  assert.doesNotMatch(client, /invoice-studio-logo\.svg/);
  assert.match(client, /data-admin-save-status/);
  assert.match(client, /function filterAdminDirectory\(\)/);
  assert.match(client, /data-admin-search/);
  assert.match(client, /adminLinkedCount/);
  assert.doesNotMatch(client, /alert\(messageFrom\(error\)\)/);
  assert.match(migration, /private\.is_admin\(\)/);
  assert.match(migration, /admin_update_user_access/);
  assert.match(migration, /You cannot remove, suspend, schedule, or expire your own administrator access/);
  assert.match(migration, /alter table public\.profiles enable row level security/);
});

test("automated data cleaning uses the refined website theme", async () => {
  const [html, styles] = await Promise.all([
    readFile(new URL("public/editor/index.html", root), "utf8"),
    readFile(new URL("public/editor/auto-data-cleaner.css", root), "utf8"),
  ]);
  assert.match(html, /auto-data-cleaner\.css\?v=20260916-data-cleaning-redesign-v14/);
  assert.match(styles, /#auto-data-cleaning[\s\S]*?--cleaner-ink: #26184d/);
  assert.match(styles, /auto-cleaner-rules-panel[\s\S]*?background: linear-gradient\(155deg,#fbf9ff 0%,#f1ebff 100%\)/);
  assert.match(styles, /auto-cleaner-table-wrap th \{ color: #fff; background: #35205f; \}/);
});

test("admin header keeps comfortable spacing and a themed refresh action", async () => {
  const [html, styles] = await Promise.all([
    readFile(new URL("public/editor/index.html", root), "utf8"),
    readFile(new URL("public/editor/cloud/cloud.css", root), "utf8"),
  ]);

  assert.match(html, /cloud\/cloud\.css\?v=20260917-compact-admin-directory-v23/);
  assert.match(html, /Access Control Dashboard/);
  assert.match(html, /id="adminUserSearch"/);
  assert.match(html, /id="adminStatusFilter"/);
  assert.match(html, /id="adminLinkedCount"/);
  assert.match(styles, /#admin \.cloud-admin-intro[\s\S]*?padding: 30px 32px !important/);
  assert.match(styles, /#admin \.cloud-admin-intro \.btn[\s\S]*?background: #fff !important/);
  assert.match(styles, /cloud-admin-refresh-in/);
  assert.match(styles, /cloud-admin-directory/);
  assert.match(styles, /cloud-admin-metric/);
  assert.match(styles, /cloud-user-directory-row > summary \{[^}]*grid-template-columns: 40px[^}]*min-height: 66px[^}]*padding: 9px 14px/);
  assert.match(styles, /cloud-avatar \{ width: 40px; height: 40px; font-size: 15px; \}/);
  assert.match(styles, /cloud-status \{[^}]*min-width: 74px[^}]*font-size: 10\.5px/);
  assert.match(styles, /cloud-admin-intro h2[\s\S]*?color: #fff !important/);
  assert.match(styles, /cloud-security-verification/);
  assert.match(styles, /cloud-feature-check[\s\S]*?grid-template-columns: 28px minmax\(0,1fr\) 20px/);
  assert.match(styles, /cloud-feature-choice[\s\S]*?background: #7540e8/);
  assert.match(styles, /cloud-access-reveal/);
  assert.match(styles, /@media \(max-width: 620px\)[\s\S]*?#admin \.cloud-admin-intro/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?#admin \.cloud-admin-intro/);
});
