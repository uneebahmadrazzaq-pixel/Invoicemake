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
  assert.match(script, /const metadataFileLimit = 500/);
  assert.match(script, /supportedFiles\.slice\(0, metadataFileLimit\)/);
  assert.match(script, /jszip@3\.10\.1\/dist\/jszip\.min\.js/);
  assert.match(script, /zip\.generateAsync\(\{ type: "blob", compression: "STORE", streamFiles: true \}\)/);
  assert.match(script, /function renderMetadataArchiveResult\(/);
  assert.match(script, /Download ZIP/);
  assert.match(script, /\["Metadata", "PieceInfo", "LastModified"\]/);
  assert.match(styles, /\.utility-tool-layout/);
  assert.match(styles, /\.utility-drop-zone/);
  assert.match(styles, /\.utility-results-panel/);
  assert.match(styles, /#meta-remover \.utility-file-list[\s\S]*?max-height: 330px/);
  assert.match(styles, /@keyframes metadataUploadFloat/);
  assert.match(styles, /@keyframes metadataHeaderCopyIn/);
  assert.match(styles, /@keyframes metadataHeaderLineIn/);
  assert.match(styles, /@keyframes metadataBadgeIn/);
  assert.match(styles, /#meta-remover \.utility-page-heading p:not\(\.eyebrow\)[\s\S]*?font-family: "Inter"/);
  assert.match(styles, /#meta-remover \.utility-privacy-badge[\s\S]*?align-self: center[\s\S]*?margin-bottom: 8px/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?#meta-remover/);
  assert.match(html, /up to 500 files/);
  assert.match(html, /Remove metadata &amp; create ZIP/);
});

test("utility navigation opens every registered workspace view independently", async () => {
  const html = await readFile(new URL("../public/editor/index.html", import.meta.url), "utf8");
  const script = await readFile(new URL("../public/editor/app.js", import.meta.url), "utf8");
  const utilityViews = ["auto-data-cleaning", "data-cleaning", "meta-remover", "pdf-compressor"];

  utilityViews.forEach((view) => {
    assert.match(html, new RegExp(`data-view="${view}"`));
    assert.match(html, new RegExp(`id="${view}"`));
  });
  assert.match(script, /DOMContentLoaded[\s\S]*?bindWorkspaceNavigation\(\)[\s\S]*?initializeInvoiceStudio\(\)/);
  assert.match(script, /navigation\.addEventListener\("click"[\s\S]*?event\.target\.closest\("\[data-view\]"\)/);
  assert.doesNotMatch(script, /if \(!requestedView \|\| requestedView\.hidden\) return/);
  assert.match(script, /requestedView\.hidden = false/);
  assert.match(script, /button\.setAttribute\("aria-current", "page"\)/);
});

test("data cleaning header keeps its badge clear and uses matching motion", async () => {
  const [html, styles] = await Promise.all([
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/auto-data-cleaner.css", import.meta.url), "utf8"),
  ]);

  assert.match(html, /auto-data-cleaner\.css\?v=20260908-data-cleaning-header-v13/);
  assert.match(styles, /#auto-data-cleaning \.auto-cleaner-heading[\s\S]*?align-items: center/);
  assert.match(styles, /#auto-data-cleaning \.auto-cleaner-heading p:last-child[\s\S]*?font-family: "Inter"/);
  assert.match(styles, /#auto-data-cleaning \.auto-cleaner-heading \.utility-privacy-badge[\s\S]*?margin-bottom: 8px/);
  assert.match(styles, /#auto-data-cleaning \.auto-cleaner-overview[\s\S]*?animation: metadataPanelIn/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
});
