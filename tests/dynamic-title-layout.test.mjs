import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const app = await readFile(new URL("../public/editor/app.js", import.meta.url), "utf8");
const css = await readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8");

test("all invoice previews receive the shared dynamic title layout", () => {
  assert.match(app, /initializeDynamicTitleLayout\(\)/);
  assert.match(app, /invoice\.classList\.add\("dynamic-title-layout"\)/);
  assert.match(app, /invoice-title-cell/);
  assert.match(css, /\.dynamic-title-layout table tbody td\.invoice-title-cell/);
  assert.match(css, /overflow-wrap:\s*anywhere/);
  assert.match(css, /white-space:\s*normal\s*!important/);
});

test("fixed source templates move downstream sections by measured title height", () => {
  assert.match(app, /--invoice-title-flow-offset/);
  assert.match(app, /--paperstone-title-flow-offset/);
  assert.match(css, /perfume-unlimited-billing[\s\S]*translateY\(var\(--invoice-title-flow-offset/);
  assert.match(css, /porton-totals[\s\S]*translateY\(calc\(var\(--invoice-title-flow-offset[\s\S]*var\(--porton-row-flow-offset/);
  assert.match(app, /const portonRowFlowOffset = Math\.max\(0, invoice\.items\.length - 1\) \* 27\.98;/);
  assert.match(app, /style="--porton-row-flow-offset: \$\{portonRowFlowOffset\}px"/);
  assert.match(app, /footer\.classList\.contains\("porton-footer"\)/);
  assert.match(css, /dynamic-title-layout\.porton-invoice \{[\s\S]*width: 794px;[\s\S]*height: 1123px;[\s\S]*min-height: 1123px;/);
  assert.match(css, /paperstone-total-box[\s\S]*translateY\(var\(--paperstone-title-flow-offset/);
});

test("downloads capture the expanded invoice height", () => {
  assert.doesNotMatch(app, /const captureHeight = isFixedA4Export \? 1123 : target\.scrollHeight/);
  assert.match(app, /const captureHeight = target\.scrollHeight/);
  assert.match(app, /const captureHeight = doc\.scrollHeight/);
});
