import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the invoice editor shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Invoice Studio — Business Dashboard<\/title>/i);
  assert.match(
    html,
    /<iframe(?=[^>]*\btitle="Invoice Studio Workspace")(?=[^>]*\bsrc="\/editor\/index\.html\?v=[^"]+")(?=[^>]*\bclass="editor-frame")[^>]*>/i,
  );
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("keeps the editor shell and metadata wired to application assets", async () => {
  const [page, layout, editor] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8"),
  ]);

  assert.match(page, /export const metadata:\s*Metadata/);
  assert.match(page, /<iframe/);
  assert.match(page, /src="\/editor\/index\.html\?v=/);
  assert.match(layout, /openGraph:\s*\{/);
  assert.match(layout, /twitter:\s*\{/);
  assert.match(editor, /id="toolPage"/);
  assert.match(editor, /src="\.\/app\.js\?v=/);
  assert.match(editor, /href="\.\/pulse\.css\?v=/);
  assert.match(editor, /href="\.\/aether\.css\?v=/);
  assert.match(editor, /href="\.\/nexusai\.css\?v=/);
  assert.match(editor, /href="\.\/dashdark\.css\?v=/);
  assert.match(editor, /href="\.\/nexus-sections\.css\?v=/);
  assert.match(editor, /href="\.\/bulk-modern\.css\?v=/);
  for (const landingId of ["home", "problem", "features", "workflow", "integrations", "pricing", "testimonials", "faq"]) {
    assert.match(editor, new RegExp(`id="${landingId}"`));
  }
  assert.doesNotMatch(editor, /src="\/editor\/pulse-bg\.js\?v=/);
  assert.doesNotMatch(editor, /id="(?:pulseAtmosphere|heroWave)"/);
  for (const sectionId of ["dashboard", "clients", "single", "bulk", "analytics", "saved", "data-cleaning"]) {
    assert.match(editor, new RegExp(`id="${sectionId}"`));
  }
  for (const bulkControlId of [
    "bulkWorkflowTitle",
    "bulkCaseList",
    "bulkTemplateSelect",
    "bulkClientSelect",
    "bulkDestination",
    "bulkInvoiceDate",
    "bulkInvoiceNumberMode",
    "bulkCardType",
    "bulkCardLast4",
    "bulkCardExpiry",
    "bulkFreightAmount",
    "csvUpload",
    "generateBulk",
  ]) {
    assert.match(editor, new RegExp(`id="${bulkControlId}"`));
  }

  await assert.rejects(
    access(new URL("app/_sites-preview", templateRoot)),
  );
});
