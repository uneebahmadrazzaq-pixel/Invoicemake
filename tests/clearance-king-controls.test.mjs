import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source = await readFile(new URL('../public/editor/app.js', import.meta.url), 'utf8');
const imageCode = source.slice(source.indexOf('function clearanceKingImageSource('), source.indexOf('function renderTemplateAssetPreview('));
const data = 'data:image/webp;base64,AA==';
function contextFor(state) {
  const context = vm.createContext({state, els: {bulkTemplateSelect: {value: 'clearanceking'}}, assetPath: p => p, escapeHtml: value => String(value), renderItems() {}, renderPreview() {}, renderBulkRows() {}, persist() {}, window: {alert: message => assert.fail(message)}});
  vm.runInContext(imageCode, context);
  return context;
}
test('Clearance King exposes per-product image upload and remove controls without unrelated sample photos', () => {
  const context = contextFor({});
  assert.equal(context.clearanceKingImageSource({sku: 'CUSTOM'}), '');
  assert.equal(context.clearanceKingImageSource({imageDataUrl: 'javascript:alert(1)'}), '');
  assert.equal(context.clearanceKingImageSource({sku: '75537', product: '6990314575537', imageRemoved: true}), '');
  for (const scope of ['single', 'bulk']) {
    const html = context.clearanceKingImageControl({imageDataUrl: data}, 2, scope);
    assert.match(html, /type="file"/);
    assert.match(html, /data-clearance-image="2"/);
    assert.match(html, /data-clearance-image-remove="2"/);
    assert.ok(html.includes(`data-image-scope="${scope}"`));
  }
});
test('single image uploads persist in the item and can be removed', async () => {
  const state = {current: {templateId: 'clearanceking', items: [{}]}};
  const context = contextFor(state);
  context.readClearanceKingImage = async () => data;
  const input = {dataset: {clearanceImage: '0', imageScope: 'single'}, files: [{}], value: 'file'};
  await context.handleClearanceKingImageUpload({target: {closest: () => input}});
  assert.equal(state.current.items[0].imageDataUrl, data);
  const restored = JSON.parse(JSON.stringify(state.current));
  assert.equal(context.clearanceKingImageSource(restored.items[0]), data);
  context.handleClearanceKingImageRemove({target: {closest: () => ({dataset: {clearanceImageRemove: '0', imageScope: 'single'}})}});
  assert.equal(state.current.items[0].imageRemoved, true);
  assert.equal(context.clearanceKingImageSource(state.current.items[0]), '');
});
test('bulk image upload changes only its own invoice row and is retained during invoice generation', async () => {
  const rows = [{sku: 'A', __groupIndex: 0}, {sku: 'B', __groupIndex: 1}];
  const state = {current: {templateId: 'clearanceking'}, bulkRows: rows, bulkInvoiceGroups: rows.map(row => ({rows: [{...row}]}))};
  const context = contextFor(state);
  context.readClearanceKingImage = async () => data;
  await context.handleClearanceKingImageUpload({target: {closest: () => ({dataset: {clearanceImage: '1', imageScope: 'bulk'}, files: [{}]})}});
  assert.equal(state.bulkInvoiceGroups[1].rows[0].imageDataUrl, data);
  assert.equal(state.bulkInvoiceGroups[0].rows[0].imageDataUrl, undefined);
  vm.runInContext(source.slice(source.indexOf('function bulkRowToItem('), source.indexOf('function buildBulkInvoices(')), context);
  assert.equal(context.bulkRowToItem(state.bulkInvoiceGroups[1].rows[0]).imageDataUrl, data);
});
test('changing invoices during an upload cannot overwrite the next invoice', async () => {
  const original = {templateId: 'clearanceking', items: [{}]};
  const state = {current: original};
  const context = contextFor(state);
  let complete;
  context.readClearanceKingImage = () => new Promise(resolve => complete = resolve);
  const pending = context.handleClearanceKingImageUpload({target: {closest: () => ({dataset: {clearanceImage: '0', imageScope: 'single'}, files: [{}]})}});
  state.current = {templateId: 'clearanceking', items: [{}]};
  complete(data);
  await pending;
  assert.equal(state.current.items[0].imageDataUrl, undefined);
  assert.equal(original.items[0].imageDataUrl, undefined);
});
test('image validation rejects non-raster and oversized files, then resizes valid uploads', async () => {
  let canvas;
  const context = vm.createContext({FileReader: class {readAsDataURL() {this.result = data; this.onload();}}, Image: class {naturalWidth = 2048; naturalHeight = 1024; set src(_value) {this.onload();}}, document: {createElement: () => (canvas = {getContext: () => ({drawImage() {}}), toDataURL: () => data})}});
  vm.runInContext(imageCode, context);
  await assert.rejects(context.readClearanceKingImage({type: 'image/svg+xml', size: 10}), /PNG, JPG or WebP/);
  await assert.rejects(context.readClearanceKingImage({type: 'image/png', size: 6 * 1024 * 1024}), /5 MB/);
  assert.equal(await context.readClearanceKingImage({type: 'image/png', size: 1000}), data);
  assert.equal(canvas.width, 512);
  assert.equal(canvas.height, 256);
});
test('Clearance King uses its own invoice typography and template-style telephone label', async () => {
  const context = vm.createContext({});
  vm.runInContext(source.slice(source.indexOf('function formatClearanceKingAddress('), source.indexOf('function renderClearanceKingPreview(')), context);
  const fields = {name: 'Recipient', company: 'Company', street: 'Street', city: 'London', postal: 'RM7 0TL', country: 'United Kingdom', phone: '0123456789'};
  assert.equal(context.formatClearanceKingAddress({billToFields: fields}, 'billTo'), 'Recipient\nCompany\nStreet\nLondon, RM7 0TL\nUnited Kingdom\nT: 0123456789');
  assert.equal(context.formatClearanceKingAddress({shipTo: 'Original address'}, 'shipTo'), 'Original address');
  const styles = await readFile(new URL('../public/editor/styles.css', import.meta.url), 'utf8');
  assert.match(styles, /\.clearance-king-invoice, \.clearance-king-invoice \* \{ font-family: "Clearance King DejaVu", sans-serif !important/);
  assert.match(styles, /\.clearance-king-addresses p \{ color: #000 !important/);
  assert.match(styles, /clearance-king-dejavu-sans-condensed-bold\.ttf/);
  assert.match(source, /clonedDocument\.fonts\.load\('400 16px "Clearance King DejaVu"'\)/);
  context.escapeHtml = value => String(value).replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  assert.match(context.renderClearanceKingAddress({billToFields: fields}, 'billTo'), /T: <a href="tel:0123456789">0123456789<\/a>/);
});
test('Clearance King quantity/price edits refresh VAT and tax-inclusive subtotal separately', () => {
  const amounts = [{}, {}];
  const context = vm.createContext({state: {current: {templateId: 'clearanceking', taxRate: 20, currency: 'GBP'}}, rowTotal: item => item.qty * item.unit, money: value => `£${value.toFixed(2)}`});
  vm.runInContext(source.slice(source.indexOf('function updateRowTotal('), source.indexOf('function itemLine(')), context);
  context.updateRowTotal({querySelectorAll: () => amounts}, {qty: 4, unit: 2.49});
  assert.equal(amounts[0].textContent, '£1.99');
  assert.equal(amounts[1].textContent, '£11.95');
});
