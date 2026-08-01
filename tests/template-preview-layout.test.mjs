import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("invoice preview shows only the template without dark side gutters", async () => {
  const [themeStyles, editorHtml, page] = await Promise.all([
    readFile(new URL("../public/editor/dashboard-light.css", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8")
  ]);

  assert.match(themeStyles, /body\.dashboard-light \.view \.invoice-preview\s*\{/);
  assert.match(themeStyles, /width:\s*max-content/);
  assert.match(themeStyles, /max-width:\s*100%/);
  assert.match(themeStyles, /background:\s*transparent !important/);
  assert.match(themeStyles, /body\.dashboard-light \.view \.invoice-preview > \.invoice-doc\s*\{/);
  assert.match(editorHtml, /dashboard-light\.css\?v=20260801-template-fields-v29/);
  assert.match(page, /editor\/index\.html\?v=20260801-paperstone-font-v31/);
  assert.doesNotMatch(editorHtml, /id="previewTemplateName"/);
  assert.doesNotMatch(editorHtml, /id="duplicateInvoice"/);
});
