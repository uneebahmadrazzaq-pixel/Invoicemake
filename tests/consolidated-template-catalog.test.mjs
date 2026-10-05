import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [editor, html, styles, cloud] = await Promise.all([
  readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/editor/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
  readFile(new URL("../cloud/client.ts", import.meta.url), "utf8"),
]);

const updatedTemplates = [
  ["everydaysupply", "Everyday Supply Co. Proforma Invoice"],
  ["auxmir", "Auxmir Invoice"],
  ["blowout", "Blowout Cards"],
  ["drugstoreproducts", "Drugstore Products Discount Wholesale"],
  ["greatlakes", "Great Lakes Wholesale Group"],
  ["mvessentials", "MV Essentials Ltd Invoice"],
  ["sanareva", "Sanareva.co.uk"],
  ["tropicana", "Tropicana Wholesale Invoice"],
  ["yiwuoudiya", "Yiwu Oudiya Paid Invoice"],
];

test("all consolidated templates are selectable and assignable from the admin panel", () => {
  for (const [id, name] of updatedTemplates) {
    assert.match(editor, new RegExp(`id: "${id}", name: "${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
    assert.match(cloud, new RegExp(`\\["${id}", "${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"\\]`));
  }
});

test("consolidated template assets and editing sections remain wired", () => {
  assert.match(html, /styles\.css\?v=20261005-sunsky-compact-v44/);
  assert.match(html, /app\.js\?v=20261005-sunsky-csv-v38/);
  for (const section of ["everydayFields", "auxmirFields", "blowoutFields", "drugstoreFields", "greatLakesFields", "sanarevaFields"]) {
    assert.match(html, new RegExp(`id="${section}"`));
  }
  for (const selector of ["everyday-invoice", "auxmir-invoice", "blowout-invoice", "drugstore-invoice", "great-lakes-invoice", "mv-essentials-invoice", "sanareva-invoice", "tropicana-invoice", "yiwu-oudiya-invoice"]) {
    assert.match(styles, new RegExp(`\\.${selector}\\s*\\{`));
  }
});
