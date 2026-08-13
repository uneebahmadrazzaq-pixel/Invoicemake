import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("removes Business Analytics from the website and editor", async () => {
  const [website, editor] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("public/editor/index.html", root), "utf8")
  ]);

  for (const html of [website, editor]) {
    assert.doesNotMatch(html, /Business Analytics/);
    assert.doesNotMatch(html, /data-view="analytics"/);
    assert.doesNotMatch(html, /data-jump="analytics"/);
    assert.doesNotMatch(html, /id="analytics"/);
  }
});
