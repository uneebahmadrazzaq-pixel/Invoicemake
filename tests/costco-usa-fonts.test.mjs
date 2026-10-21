import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source = await readFile(new URL('../public/editor/app.js', import.meta.url), 'utf8');
const styles = await readFile(new URL('../public/editor/styles.css', import.meta.url), 'utf8');

test('Costco USA typography is isolated from website themes with a complete bundled fallback', () => {
  assert.match(styles, /font-family: "Costco Reference Sans";[\s\S]*?sephora-arimo\.ttf[\s\S]*?font-weight: 400 700/);
  assert.match(styles, /body\.dashboard-light \.view \.invoice-doc\.costco-usa-invoice \* \{[\s\S]*?font-family: Arial, "Costco Reference Sans", sans-serif !important/);
  assert.match(styles, /\.costco-usa-invoice :is\(p, td, dd, span\) \{ font-weight: 400 !important/);
  assert.match(styles, /\.costco-usa-invoice \.costco-usa-invoice-meta h2 \{\s*color: #73b8ed !important/);
  assert.match(styles, /\.costco-usa-invoice \.costco-usa-terms \{\s*color: #919191 !important/);
});

test('Costco USA exports preserve the same font and reference colours and await both weights', async () => {
  const makeElement = () => ({values:{},style:{setProperty(key,value){this.owner.values[key]=value;}}});
  const body = makeElement(), heading = makeElement(), terms = makeElement();
  for (const element of [body,heading,terms]) element.style.owner = element;
  const invoice = {querySelectorAll:()=>[body,heading,terms],querySelector: selector=>selector.includes('meta')?heading:terms};
  const fonts=[];
  const document={querySelector:selector=>selector==='.costco-usa-invoice'?invoice:null,fonts:{load: async value=>fonts.push(value),ready:Promise.resolve()}};
  const context=vm.createContext({});
  vm.runInContext(source.slice(source.indexOf('async function prepareInvoiceExportClone('),source.indexOf('function waitForImages(')),context);
  await context.prepareInvoiceExportClone(document);
  assert.equal(body.values['font-family'],'Arial, "Costco Reference Sans", sans-serif');
  assert.equal(body.values.color,'#000');
  assert.equal(heading.values.color,'#73b8ed');
  assert.equal(terms.values.color,'#919191');
  assert.deepEqual(fonts,['400 16px "Costco Reference Sans"','700 16px "Costco Reference Sans"']);
});

test('Costco USA reference metadata is compact, right-positioned, and uses inline label/value pairs', () => {
  assert.match(styles, /\.costco-usa-invoice-meta \{ position: absolute; top: 48px; right: -20px; width: 128px;/);
  assert.match(styles, /\.costco-usa-invoice-meta h2 \{ margin-bottom: 22px;/);
  assert.match(styles, /\.costco-usa-invoice-meta dl \{ display: block; font-size: 9\.3px; font-weight: 700; line-height: 1\.3;/);
  assert.match(styles, /\.costco-usa-invoice-meta :is\(dt, dd\) \{ display: inline; white-space: nowrap;/);
  assert.match(styles, /\.costco-usa-invoice-meta dd::after \{ content: ""; display: block;/);
  assert.match(styles, /\.costco-usa-membership \{[^}]*justify-self: end;/);
});
