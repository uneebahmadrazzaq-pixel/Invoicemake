import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const base = new URL("../public/", import.meta.url);
const read = (path) => readFile(new URL(path, base), "utf8");
const scope = vm.createContext({ module: { exports: {} }, atob, btoa, TextEncoder, TextDecoder });
vm.runInContext(await read("editor/bank-statement.js"), scope);
const { readRows, writeReport, statementRows, reviewDates } = scope.module.exports;

test("PDF Editor tab sits between Clients and Invoice Builder", async () => {
  const html = await read("editor/index.html");
  assert.match(html, /data-view="clients"[\s\S]*?<\/button>\s*<button[^>]+data-view="bank-statement"[\s\S]*?<\/button>\s*<button[^>]+data-view="single"/);
  assert.match(html, /class="view utility-tool-view" id="bank-statement"/);
  assert.match(html, /<iframe id="bankStatementOriginalPreview"/);
  assert.match(html, /id="bankStatementOriginalDownload" download/);
  assert.match(await read("editor/app.js"), /"bank-statement": "PDF Editor"/);
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
  assert.equal((document.match(/Separate from the original PDF/g) || []).length, 3);
  assert.match(document, /Transaction 60/);
});

test("statement comparison flags gaps and ambiguity without editing either source", () => {
  const lines = [
    "01 Jun Opening balance 500.00",
    "02 Jun eBay payout 12.00 512.00",
    "02 Jun Other transaction 3.00 515.00",
    "07 Jun Other transaction 8.00 523.00"
  ];
  const statement = statementRows(lines);
  assert.equal(statement.length, 3);
  assert.equal(statement[0].protected, true);
  const incoming = [["02/06/2026"], ["2026-06-07"], ["2026-04-21"], ["31/06/2026"]];
  assert.equal(reviewDates(incoming, statement, "").unresolved, 3);
  assert.equal(reviewDates(incoming, statement, "").labels[0], "Pending PDF date check");
  assert.deepEqual(Array.from(reviewDates(incoming, statement, "2026").labels), [
    "2026-06-02 - competing rows, review", "2026-06-07 - exact date, verify",
    "2026-06-02 - competing rows, review", "Check spreadsheet date"
  ]);
  assert.equal(statement[0].date, "02 Jun");
  assert.equal(incoming[0][0], "02/06/2026");
});

test("date suggestions keep the PDF date and choose the next later row, not the closest earlier row", () => {
  const source = statementRows([
    "1-july-2026 First 5.00 105.00",
    "10-july 2026 Middle 4.00 109.00",
    "15 july 2026 eBay payout 3.00 112.00"
  ]);
  assert.equal(source.length, 3);
  assert.deepEqual(Array.from(reviewDates([["9-july-2026"], ["2026-07-14"], ["2026-07-16"]], source, "").labels), [
    "2026-07-10 - next later date, verify",
    "2026-07-15 - eBay row protected",
    "No exact or later PDF date - review"
  ]);
});
