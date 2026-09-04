import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("workspace navigation preserves the current invoice builder stage", async () => {
  const source = await readFile(new URL("../public/editor/app.js", import.meta.url), "utf8");
  const showView = source.match(/function showView\(id\) \{[\s\S]*?\n\}/)?.[0] || "";

  assert.match(showView, /if \(id === "single" \|\| id === "bulk"\) \{\s*renderBuilderStage\(id\);/);
  assert.doesNotMatch(showView, /setBuilderStage\(id, "client"\)/);
});
