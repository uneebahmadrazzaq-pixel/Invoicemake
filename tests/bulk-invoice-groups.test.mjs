import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const script = fs.readFileSync(path.join(root, "public", "editor", "app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "public", "editor", "index.html"), "utf8");

function extractFunction(name) {
  const start = script.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} must exist`);
  const bodyStart = script.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < script.length; index += 1) {
    if (script[index] === "{") depth += 1;
    if (script[index] === "}") depth -= 1;
    if (depth === 0) return script.slice(start, index + 1);
  }
  throw new Error(`Could not extract ${name}`);
}

test("bulk CSV blank rows create sequential invoice blocks", () => {
  const context = {};
  vm.createContext(context);
  vm.runInContext([
    extractFunction("splitCsvLine"),
    extractFunction("normalizeCsvHeader"),
    extractFunction("createCsvRow"),
    extractFunction("parseCsvInvoiceGroups")
  ].join("\n"), context);

  const csv = [
    "Description,Qty,Unit Price",
    "Invoice one product A,40,12.00",
    "Invoice one product B,35,9.45",
    "", "", "", "",
    "Invoice two product A,60,18.00",
    "Invoice two product B,45,10.80"
  ].join("\n");
  const groups = context.parseCsvInvoiceGroups(csv);

  assert.equal(groups.length, 2);
  assert.equal(Array.from(groups, (group) => group.length).join(","), "2,2");
  assert.equal(groups[0][0].description, "Invoice one product A");
  assert.equal(groups[1][0].qty, "60");
  assert.equal(groups[1][1].unit, "10.80");
});

test("bulk workflow exposes per-invoice fields and all PDF actions", () => {
  assert.match(script, /label: "Invoice Date & Time"/);
  assert.match(script, /label: "Order Date"/);
  assert.match(script, /label: "Order Number"/);
  assert.match(script, /label: "Tax \(%\)"/);
  assert.match(script, /label: "Driver Tip"/);
  assert.match(script, /createCombinedBulkPdf\(invoices, targetFiveMb \? 5 \* 1024 \* 1024 : 0\)/);
  assert.match(html, /id="bulkInvoiceForms"/);
  assert.match(html, /id="bulkDownloadAll"/);
  assert.match(html, /id="bulkDownload5mb"/);
  assert.match(html, /Download All \(Under 5 MB\)/);
  assert.match(html, /20260902-bulk-invoice-blocks/);
});
