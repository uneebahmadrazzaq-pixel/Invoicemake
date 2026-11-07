import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const base = new URL("../public/", import.meta.url);
const read = (path) => readFile(new URL(path, base), "utf8");
const scope = vm.createContext({ module: { exports: {} }, atob, btoa, TextEncoder, TextDecoder });
vm.runInContext(await read("editor/bank-statement.js"), scope);
const { readRows, writeReport } = scope.module.exports;

test("bank statement tab sits between Clients and Invoice Builder", async () => {
  const html = await read("editor/index.html");
  assert.match(html, /data-view="clients"[\s\S]*?<\/button>\s*<button[^>]+data-view="bank-statement"[\s\S]*?<\/button>\s*<button[^>]+data-view="single"/);
  assert.match(html, /class="view utility-tool-view" id="bank-statement"/);
  assert.match(await read("editor/app.js"), /"bank-statement": "Bank Statement Editor"/);
});

test("import preserves row order, negative amounts, zero and quoted CSV text", async () => {
  const xlsxContext = vm.createContext({});
  vm.runInContext(await read("vendor/xlsx.full.min.js"), xlsxContext);
  const { XLSX } = xlsxContext;
  const csv = 'Description,Date,Amount\n"Coffee, large",2026-11-01,-4.50\nRefund,2026-11-02,0';
  const book = XLSX.read(csv, { type: "string", raw: true });
  const matrix = XLSX.utils.sheet_to_json(book.Sheets[book.SheetNames[0]], { header: 1, raw: false });
  assert.deepEqual(JSON.parse(JSON.stringify(readRows(matrix))), [
    ["2026-11-01", "-4.50", "Coffee, large"], ["2026-11-02", "0", "Refund"]
  ]);
  assert.throws(() => readRows([["Date", "Amount", "Amount"]]), /first row/);
  assert.throws(() => readRows([["Date", "Amount", "Description"]]), /No transactions/);
});

test("report PDF repeats headers and identifies user-provided data on each page", async () => {
  const pdfContext = vm.createContext({ atob, btoa, TextEncoder, TextDecoder });
  vm.runInContext(await read("vendor/jspdf.umd.min.js"), pdfContext);
  const pdf = new pdfContext.jspdf.jsPDF({ unit: "pt", format: "a4" });
  writeReport(pdf, Array.from({ length: 60 }, (_, i) => ["2026-11-01", "-4.50", "Transaction " + (i + 1)]));
  assert.equal(pdf.getNumberOfPages(), 3);
  const document = pdf.output();
  assert.equal((document.match(/Not a bank-issued statement/g) || []).length, 3);
  assert.match(document, /Transaction 60/);
});
