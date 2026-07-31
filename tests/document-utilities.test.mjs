import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("adds metadata removal and PDF compression workspace tools", async () => {
  const [html, script, styles] = await Promise.all([
    readFile(new URL("public/editor/index.html", projectRoot), "utf8"),
    readFile(new URL("public/editor/app.js", projectRoot), "utf8"),
    readFile(new URL("public/editor/dashboard-light.css", projectRoot), "utf8"),
  ]);

  for (const view of ["meta-remover", "pdf-compressor"]) {
    assert.match(html, new RegExp(`data-view="${view}"`));
    assert.match(html, new RegExp(`id="${view}"`));
  }
  for (const control of [
    "metadataInput",
    "metadataProcess",
    "metadataResults",
    "pdfCompressorInput",
    "pdfCompressorProcess",
    "pdfCompressorResults",
  ]) {
    assert.match(html, new RegExp(`id="${control}"`));
  }

  assert.match(script, /async function processMetadataFiles\(\)/);
  assert.match(script, /async function processPdfCompression\(\)/);
  assert.match(script, /async function stripImageMetadata\(file\)/);
  assert.match(script, /async function stripPdfMetadata\(file\)/);
  assert.match(script, /pdf-lib@1\.17\.1/);
  assert.match(styles, /\.utility-tool-layout/);
  assert.match(styles, /\.utility-drop-zone/);
  assert.match(styles, /\.utility-results-panel/);
});
