import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source = await readFile(new URL('../public/editor/app.js', import.meta.url), 'utf8');
function currencyContext(extra = {}) {
  const context = vm.createContext(extra);
  vm.runInContext(source.slice(source.indexOf('function money('), source.indexOf('function sephoraUsd(')), context);
  vm.runInContext(source.slice(source.indexOf('function currencySymbol('), source.indexOf('function getTemplate(', source.indexOf('function currencySymbol('))), context);
  return context;
}
test('all four Zoro summary amounts include currency, including zero tax', () => {
  const context = currencyContext({assetPath: p => p, escapeHtml: v => String(v || ''), clientAddress: () => '', formatUsDate: () => '', rowTotal: i => i.qty * i.unit});
  vm.runInContext(source.slice(source.indexOf('function renderZoroPreview('), source.indexOf('function renderMastertradePreview(')), context);
  for (const [currency, symbol] of [['GBP', '£'], ['gbp', '£'], ['£', '£'], ['USD', '$'], ['EUR', '€'], ['€', '€']]) {
    const html = context.renderZoroPreview({items: [], currency, zoroShippingMethod: 'Standard Ground'}, {subtotal: 1458.5, shipping: 46, tax: 0, total: 1504.5});
    const summary = html.split('<section class="zoro-summary">')[1].split('</section>')[0];
    for (const value of ['1458.50', '46.00', '0.00', '1504.50']) assert.ok(summary.includes(`${symbol}${value}`));
  }
});
test('Zoro CSV samples use template column labels in single and bulk modes', () => {
  let csv;
  const context = vm.createContext({getTemplate: () => ({id: 'zoro'}), downloadText: (_name, value) => csv = value});
  vm.runInContext(source.slice(source.indexOf('const defaultTemplateCsvSchema'), source.indexOf('const templateOptionalFields')), context);
  vm.runInContext(source.slice(source.indexOf('function getTemplateCsvSchema('), source.indexOf('function updateSingleCsvHelp(')), context);
  vm.runInContext(source.slice(source.indexOf('function csvCell('), source.indexOf('function parseCsv(')), context);
  for (const bulk of [false, true]) {
    context.downloadTemplateSampleCsv('zoro', bulk);
    assert.equal(csv.split('\n')[0], 'Z Number,Item,Qty,Price');
  }
});
test('Zoro imports both new and legacy CSV headers without losing identifiers or quantities', () => {
  const context = vm.createContext({});
  vm.runInContext(source.slice(source.indexOf('function parseCsv('), source.indexOf('function downloadText(', source.indexOf('function parseCsv('))), context);
  vm.runInContext(source.slice(source.indexOf('function bulkRowToItem('), source.indexOf('function buildBulkInvoices(')), context);
  for (const headers of ['Z Number,Item,Qty,Price', 'Z Number,Description,QTY,Price']) {
    const row = context.parseCsv(`${headers}\n00123,"Item, quoted",3,12.50`)[0];
    const item = context.bulkRowToItem(row);
    assert.equal(item.sku, '00123');
    assert.equal(item.description, 'Item, quoted');
    assert.equal(item.qty * item.unit, 37.5);
    assert.equal(context.readCsvRowValue(row, 'Item'), 'Item, quoted');
    assert.equal(context.readCsvRowValue({sku: '00123'}, 'Z Number'), '00123');
  }
});
test('Zoro bulk controls seed independent per-invoice currency and shipping metadata', () => {
  const state = {current: {templateId: 'zoro', currency: 'GBP', invoiceNumber: 'Z1', zoroShippingMethod: 'Express', zoroAmountDue: 10, zoroSalesOrderNumber: 'SO1', taxRate: 5, shippingAmount: 46, orderDate: '2026-10-21'}};
  const context = vm.createContext({state, els: {bulkTemplateSelect: {value: 'zoro'}}, getTemplate: () => ({id: 'zoro'}), formatDate: () => '2026-10-21', formatWalmartPrintDate: () => ''});
  vm.runInContext(source.slice(source.indexOf('function getBulkInvoiceFieldDefinitions('), source.indexOf('function clearBulkInvoiceGroups(')), context);
  const keys = context.getBulkInvoiceFieldDefinitions('zoro').map(field => field.key);
  for (const key of ['currency', 'zoroDueDate', 'zoroShipDate', 'zoroCustomerNumber', 'zoroSalesOrderNumber', 'zoroPurchaseOrderNumber', 'zoroShippingMethod', 'shippingAmount', 'taxRate', 'zoroAmountDue']) assert.ok(keys.includes(key));
  const first = context.createBulkInvoiceMeta(0);
  const second = context.createBulkInvoiceMeta(1);
  assert.equal(first.currency, 'GBP');
  assert.equal(first.zoroShippingMethod, 'Express');
  assert.equal(first.zoroAmountDue, 10);
  assert.equal(first.zoroSalesOrderNumber, 'SO1');
  assert.equal(second.zoroSalesOrderNumber, '');
  second.currency = 'EUR';
  assert.equal(first.currency, 'GBP');
});
test('Zoro bulk product edits update the correct invoice used for generation', () => {
  const rows = [{sku: 'A', description: 'First', qty: '1', unit: '2', __groupIndex: 0}, {sku: 'B', description: 'Second', qty: '3', unit: '4', __groupIndex: 1}];
  const state = {current: {templateId: 'zoro'}, bulkRows: rows, bulkInvoiceGroups: rows.map(row => ({rows: [{...row}]}))};
  const context = vm.createContext({state, els: {bulkTemplateSelect: {value: 'zoro'}}, persist() {}});
  vm.runInContext(source.slice(source.indexOf('function normalizeCsvHeader('), source.indexOf('function createCsvRow(')), context);
  vm.runInContext(source.slice(source.indexOf('function luxurySouqCsvField('), source.indexOf('function renderBulkRows(')), context);
  const input = {dataset: {bulkProductRow: '1', bulkProductHeader: 'Price'}, value: '12.50'};
  context.handleLuxurySouqBulkProductInput({target: {closest: () => input}});
  assert.equal(state.bulkInvoiceGroups[1].rows[0].unit, '12.50');
  assert.equal(state.bulkInvoiceGroups[0].rows[0].unit, '2');
});
test('generated Zoro bulk invoices retain their own currencies, shipping and product values', () => {
  const state = {current: {templateId: 'zoro', currency: 'USD'}, clients: [{id: 'client'}], bulkInvoiceGroups: [
    {meta: {currency: 'GBP', shippingAmount: 46, taxRate: 0, zoroShippingMethod: 'Ground'}, rows: [{sku: 'A', description: 'Item A', qty: '2', unit: '12.5'}]},
    {meta: {currency: 'EUR', shippingAmount: 9, taxRate: 20, zoroShippingMethod: 'Express'}, rows: [{sku: 'B', description: 'Item B', qty: '3', unit: '4'}]}
  ]};
  const context = vm.createContext({state, els: {bulkClientSelect: {value: 'client'}, bulkTemplateSelect: {value: 'zoro'}}, validateBulkInvoiceGroups: () => true, syncBulkDetailsToCurrent() {}, applyClientToCurrent: () => state.current.currency = 'USD', cloneInvoice: value => JSON.parse(JSON.stringify(value))});
  vm.runInContext(source.slice(source.indexOf('function bulkRowToItem('), source.indexOf('function handleCsvUpload(')), context);
  const invoices = context.buildBulkInvoices();
  assert.equal(invoices[0].currency, 'GBP');
  assert.equal(invoices[1].currency, 'EUR');
  assert.equal(invoices[0].shippingAmount, 46);
  assert.equal(invoices[1].shippingAmount, 9);
  assert.equal(invoices[1].zoroShippingMethod, 'Express');
  assert.equal(invoices[0].items[0].qty * invoices[0].items[0].unit, 25);
  assert.equal(invoices[1].items[0].qty * invoices[1].items[0].unit, 12);
});
