import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";

const source = fs.readFileSync(path.resolve("public/editor/auto-data-cleaner-core.js"), "utf8");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(source, context, { filename: "auto-data-cleaner-core.js" });
const core = context.window.AutoDataCleanerCore;

test("preserves exact titles and calculates QTY", () => {
  const title = "USB-C Cable – 2m (Black)";
  const result = core.processRows([
    ["Title", "Variation details", "Available quantity", "Start price", "Sold quantity", "Start date", "Domain"],
    [title, "Colour: Black", 4, "£10.50", 3, "01/02/2026", "UK"]
  ]);
  assert.equal(result.rows[0].title, title);
  assert.equal(result.rows[0].variation, "Colour: Black");
  assert.equal(result.rows[0].qty, 7);
  assert.equal(result.rows[0].unitPrice, 10.5);
  assert.equal(result.rows[0].supplier, "Sunsky");
});

test("uses sold quantity when available quantity is missing", () => {
  const result = core.processRows([
    ["Title", "Start price", "Sold quantity", "Start date"],
    ["Jellycat Bashful Bunny", "22.00", 6, "2026-03-01"]
  ]);
  assert.equal(result.rows[0].qty, 6);
  assert.equal(result.rows[0].variation, "–");
  assert.equal(result.rows[0].supplier, "Jellycat");
});

test("keeps ambiguous beauty products unconfirmed", () => {
  const result = core.processRows([
    ["Title", "Start price", "Sold quantity", "Start date"],
    ["Retinol Face Serum 30ml", "8.99", 2, "2026-01-01"]
  ]);
  assert.equal(result.rows[0].confidence, "Unconfirmed");
});
