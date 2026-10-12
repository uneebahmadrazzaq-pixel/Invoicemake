import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source = await readFile(new URL('../public/editor/app.js', import.meta.url), 'utf8');
const styles = await readFile(new URL('../public/editor/styles.css', import.meta.url), 'utf8');
test('Blowout uses the extracted source logo and stable bundled fonts', async () => {
  assert.match(source, /<img src="\.\.\/assets\/blowout-logo-source\.png" alt="Blowout Cards"/);
  assert.ok((await readFile(new URL('../public/assets/blowout-logo-source.png', import.meta.url))).length > 1000);
  assert.match(styles, /font-family: "Blowout Times"; src: url\("\.\.\/assets\/fonts\/justmae-times-new-roman\.ttf"\)/);
  assert.match(styles, /font-family: "Blowout Sans"; src: url\("\.\.\/assets\/fonts\/perfume-arial-bold\.ttf"\)/);
  assert.match(styles, /font-family: "Blowout Sans Fallback"; src: url\("\.\.\/assets\/fonts\/sephora-liberation-bold\.ttf"\)/);
  assert.match(styles, /\.blowout-invoice \* \{ color: #1f1f1f !important; -webkit-text-fill-color: #1f1f1f !important/);
  assert.match(source, /clonedDocument\.fonts\.load\('400 16px "Blowout Times"'\)/);
  assert.match(source, /document\.fonts\.load\('700 16px "Blowout Sans"'\)/);
});
test('Sold to and Shipped to follow the source three-line postal layout without phone or email', () => {
  const context = vm.createContext({});
  vm.runInContext(source.slice(source.indexOf('function formatBlowoutAddress('), source.indexOf('function formatBlowoutDate(')), context);
  const fields = {name: 'Muhammad Amin', company: 'Alamin Spiritual Centre', street: '78 Brantwood Drive', city: 'Bradford', state: 'West Yorkshire', postal: 'BD9 6QS', country: 'United Kingdom', phone: '+44 7770 183110', email: 'test@example.com'};
  const invoice = {billToFields: fields, shipToFields: {...fields, company: 'Shipping company', street: 'Delivery street'}};
  assert.equal(context.formatBlowoutAddress(invoice, 'billTo'), 'Alamin Spiritual Centre\n78 Brantwood Drive, Bradford, West Yorkshire\nBD9 6QS, United Kingdom');
  assert.match(context.formatBlowoutAddress(invoice, 'shipTo'), /^Shipping company\nDelivery street/);
  assert.equal(context.formatBlowoutAddress({billTo: 'Source line 1\nSource line 2\nSource line 3'}, 'billTo'), 'Source line 1\nSource line 2\nSource line 3');
  assert.equal(context.formatBlowoutAddress({billToFields: {name: 'Recipient', street: 'Street'}}, 'billTo'), 'Recipient\nStreet');
});
test('Blowout headers stay on one line and table rows flow beneath long descriptions', () => {
  assert.match(styles, /\.blowout-products th \{[^}]*white-space: nowrap/s);
  assert.match(styles, /\.blowout-addresses p \{[^}]*overflow-wrap: anywhere/s);
  assert.match(styles, /\.blowout-totals \{ display: flex/);
});
test('Blowout has a wider larger quantity column and stronger table lines', () => {
  assert.match(styles, /\.blowout-products th:nth-child\(3\) \{ width: 7%; font-size: 12px;/);
  assert.match(styles, /\.blowout-products td:nth-child\(3\) \{ font-size: 11\.5px;/);
  assert.match(styles, /\.blowout-products td \{[^}]*border: 2\.5px solid #161616/s);
  assert.match(styles, /\.blowout-order-meta td \{[^}]*border: 1\.8px solid #222/s);
});
