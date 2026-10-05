import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

test("Vet UK CSV supports template columns in single and bulk workflows", async () => {
  const source = await readFile(new URL("../public/editor/app.js", import.meta.url), "utf8");
  assert.match(source, /vetuk: \{ headers: \["Item Description", "Qty", "Rate"\]/);
  const context = vm.createContext({});
  vm.runInContext(source.slice(source.indexOf("function normalizeCsvHeader("), source.indexOf("function splitCsvLine(")), context);
  const row = context.createCsvRow(["Item Description", "Qty", "Rate"], ["Pet food", "2", "5.99"]);
  assert.equal(row.description, "Pet food");
  assert.equal(row.qty, "2");
  assert.equal(row.unit, "5.99");
  assert.equal(context.readCsvRowValue({description:"Legacy",unit:"3"}, "Item Description"), "Legacy");
  assert.equal(context.readCsvRowValue({unit:"3"}, "Rate"), "3");
});

test("Vet UK table header text stays white in export clones", async () => {
  const source = await readFile(new URL("../public/editor/app.js", import.meta.url), "utf8");
  const start = source.indexOf('  if (vetUkInvoice) {');
  const end = source.indexOf('  const twInvoice', start);
  const properties = {};
  const context = vm.createContext({vetUkInvoice: {dataset:{},querySelectorAll: () => [{style:{setProperty:(key,value,priority) => properties[key]=[value,priority]}}]}});
  vm.runInContext(source.slice(start,end), context);
  assert.deepEqual(properties.color, ["#fff", "important"]);
  assert.deepEqual(properties["-webkit-text-fill-color"], ["#fff", "important"]);
});
