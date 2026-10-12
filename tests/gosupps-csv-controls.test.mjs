import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source = await readFile(new URL('../public/editor/app.js', import.meta.url), 'utf8');

test('GO SUPPS single and bulk CSV samples have only the three requested columns', () => {
  let csv;
  const context = vm.createContext({getTemplate: () => ({id: 'gosupps'}), downloadText: (_name, value) => csv = value});
  vm.runInContext(source.slice(source.indexOf('const defaultTemplateCsvSchema'), source.indexOf('const templateOptionalFields')), context);
  vm.runInContext(source.slice(source.indexOf('function getTemplateCsvSchema('), source.indexOf('function updateSingleCsvHelp(')), context);
  vm.runInContext(source.slice(source.indexOf('function csvCell('), source.indexOf('function parseCsv(')), context);
  for (const bulk of [false, true]) {
    context.downloadTemplateSampleCsv('gosupps', bulk);
    assert.equal(csv.split('\n')[0], 'QTY,DESCRIPTION,UNIT PRICE');
  }
});

test('GO SUPPS headers import quoted descriptions and calculate amounts in each bulk group', () => {
  const context = vm.createContext({});
  vm.runInContext(source.slice(source.indexOf('function parseCsv('), source.indexOf('function downloadText(', source.indexOf('function parseCsv('))), context);
  vm.runInContext(source.slice(source.indexOf('function bulkRowToItem('), source.indexOf('function buildBulkInvoices(')), context);
  const groups = context.parseCsvInvoiceGroups('QTY,DESCRIPTION,UNIT PRICE\n3,"Face lotion, day & night",12.50\n\n2,Body lotion,6.25');
  assert.equal(groups.length, 2);
  const first = context.bulkRowToItem(groups[0][0]);
  const second = context.bulkRowToItem(groups[1][0]);
  assert.equal(first.description, 'Face lotion, day & night');
  assert.equal(first.qty * first.unit, 37.5);
  assert.equal(second.qty * second.unit, 12.5);
  assert.equal(context.readCsvRowValue(groups[0][0], 'UNIT PRICE'), '12.50');
  assert.equal(context.readCsvRowValue({qty: '3', description: 'Legacy', unit: '12.50'}, 'DESCRIPTION'), 'Legacy');
});

test('GO SUPPS product editor exposes only quantity, description and unit price in order', () => {
  const rows = [];
  const element = () => ({innerHTML: '', dataset: {}, classList: {toggle() {}}, appendChild(row) {rows.push(row);}});
  const els = new Proxy({}, {get(target, key) {return target[key] ||= element();}});
  const context = vm.createContext({els, document: {createElement: element}, state: {current: {templateId: 'gosupps', currency: '£', items: [{qty: 3, description: 'Face lotion', unit: 12.5}]}}, escapeHtml: s => s, itemLine: item => item.description, rowTotal: item => item.qty * item.unit, money: (amount, currency) => `${currency}${amount.toFixed(2)}`});
  vm.runInContext(source.slice(source.indexOf('function renderItems('), source.indexOf('function handleTemplateAssetUpload(')), context);
  context.renderItems();
  assert.equal(els.itemsHeader.innerHTML, '<tr><th>QTY</th><th>DESCRIPTION</th><th>UNIT PRICE</th><th>AMOUNT</th></tr>');
  assert.deepEqual([...rows[0].innerHTML.matchAll(/data-field="([^"]+)"/g)].map(match => match[1]), ['qty', 'description', 'unit']);
  assert.match(rows[0].innerHTML, /£37\.50/);
  assert.match(rows[0].innerHTML, /data-remove-row/);
  assert.doesNotMatch(rows[0].innerHTML, /data-field="(?:sku|product)"/);
});

test('editing GO SUPPS inputs updates totals and replaces legacy product descriptions', () => {
  let listener;
  let amount;
  const item = {product: 'Old prefix', description: 'Old details', qty: 1, unit: 2};
  const context = vm.createContext({state: {current: {templateId: 'gosupps', items: [item]}}, els: {itemsBody: {addEventListener: (_type, callback) => listener = callback}}, updateRowTotal: (_row, updated) => amount = updated.qty * updated.unit, renderPreview() {}, persist() {}});
  vm.runInContext(source.slice(source.indexOf('  els.itemsBody.addEventListener("input"'), source.indexOf('  els.itemsBody.addEventListener("click"')), context);
  const edit = (field, value) => listener({target: {closest: () => ({dataset: {field}, value, closest: () => ({dataset: {index: '0'}})})}});
  edit('description', 'New lotion');
  assert.equal(item.product, '');
  assert.equal(item.description, 'New lotion');
  edit('qty', '3');
  edit('unit', '12.50');
  assert.equal(amount, 37.5);
});
