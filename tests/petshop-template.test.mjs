import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../public/editor/app.js", import.meta.url), "utf8");
const styles = await readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8");

test("Petshop.co.uk is available as an editable sales-order template", () => {
  assert.match(source, /id: "petshop", name: "Petshop\.co\.uk Sales Order"/);
  assert.match(source, /function renderPetshopPreview\(invoice, totals\)/);
  assert.match(source, /petshop-logo\.jpg/);
  assert.match(source, /Tax Code Summary/);
  assert.match(source, /templateId === "petshop"/);
  assert.match(styles, /\.petshop-invoice \{/);
  assert.match(styles, /@page petshop-letter \{ size: letter; margin: 0; \}/);
});

test("reference buyer personal details are not embedded", () => {
  assert.doesNotMatch(source, /CHOUDRY SARAH|ASGHAR ALI|23 Laindon Road/i);
});
