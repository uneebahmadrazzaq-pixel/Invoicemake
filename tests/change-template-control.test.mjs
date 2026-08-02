import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("single invoice header changes templates instead of adding items", async () => {
  const [editorHtml, editorSource, page] = await Promise.all([
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8")
  ]);

  assert.match(
    editorHtml,
    /<button class="btn ghost" id="changeTemplate" type="button">Change Template<\/button>/
  );
  assert.doesNotMatch(editorHtml, /id="addItem"/);
  assert.match(editorSource, /els\.changeTemplate\.addEventListener\("click"/);
  assert.match(editorSource, /setBuilderStage\("single", "template"\)/);
  assert.match(editorSource, /singleTemplateStage\.scrollIntoView/);
  assert.match(editorHtml, /app\.js\?v=20260802-qogita-upper-fidelity-v43/);
  assert.match(page, /editor\/index\.html\?v=20260802-qogita-upper-fidelity-v43/);
});
