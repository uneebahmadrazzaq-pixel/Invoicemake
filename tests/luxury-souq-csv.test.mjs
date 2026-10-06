import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../public/editor/app.js',import.meta.url),'utf8');
const headers=['Item Description','SKU','Unit Price','QTY'];

test('Luxury Souq single and bulk sample CSV use exactly the requested headers',()=>{
  let csv;
  const context=vm.createContext({getTemplate:()=>({id:'luxurysouq'}),downloadText:(_name,value)=>csv=value});
  vm.runInContext(source.slice(source.indexOf('const defaultTemplateCsvSchema'),source.indexOf('const templateOptionalFields')),context);
  vm.runInContext(source.slice(source.indexOf('function getTemplateCsvSchema('),source.indexOf('function updateSingleCsvHelp(')),context);
  vm.runInContext(source.slice(source.indexOf('function csvCell('),source.indexOf('function parseCsv(')),context);
  for(const bulk of [false,true]){
    context.downloadTemplateSampleCsv('luxurysouq',bulk);
    assert.equal(csv.split('\n')[0],headers.join(','));
    assert.ok(!csv.split('\n')[0].includes('product'));
    assert.ok(!csv.split('\n')[0].includes('Total'));
  }
});

test('Luxury Souq CSV imports SKU identifiers, prices, quantities and quoted descriptions',()=>{
  const context=vm.createContext({});
  vm.runInContext(source.slice(source.indexOf('function parseCsv('),source.indexOf('function downloadText(',source.indexOf('function parseCsv('))),context);
  const csv='Item Description,SKU,Unit Price,QTY\n"Watch, Gold Blue",001234,6.30,18\n\nWatch B,SKU2,7.25,4';
  const groups=context.parseCsvInvoiceGroups(csv);
  assert.equal(groups.length,2);
  assert.equal(groups[0][0].description,'Watch, Gold Blue');
  assert.equal(groups[0][0].sku,'001234');
  assert.equal(groups[0][0].unit,'6.30');
  assert.equal(groups[0][0].qty,'18');
  assert.equal(context.readCsvRowValue({description:'Legacy',sku:'001234',unit:'6.30',qty:'18'},'SKU'),'001234');
});

test('editing a bulk product updates only the correct invoice row and its generated total',()=>{
  let saves=0;
  const rows=[{qty:'1',unit:'2',__groupIndex:0},{qty:'3',unit:'4',__groupIndex:1},{qty:'5',unit:'6.30',__groupIndex:1}];
  const state={current:{templateId:'luxurysouq'},bulkRows:rows,bulkInvoiceGroups:[{rows:[{...rows[0]}]},{rows:[{...rows[1]},{...rows[2]}]}]};
  const context=vm.createContext({state,els:{bulkTemplateSelect:{value:'luxurysouq'}},persist:()=>saves++});
  vm.runInContext(source.slice(source.indexOf('function normalizeCsvHeader('),source.indexOf('function createCsvRow(')),context);
  vm.runInContext(source.slice(source.indexOf('function luxurySouqCsvField('),source.indexOf('function renderBulkRows(')),context);
  vm.runInContext(source.slice(source.indexOf('function bulkRowToItem('),source.indexOf('function buildBulkInvoices(')),context);
  const input={dataset:{bulkProductRow:'2',bulkProductHeader:'QTY'},value:'10'};
  context.handleLuxurySouqBulkProductInput({target:{closest:()=>input}});
  assert.equal(state.bulkInvoiceGroups[1].rows[1].qty,'10');
  assert.equal(state.bulkInvoiceGroups[1].rows[0].qty,'3');
  assert.equal(state.bulkInvoiceGroups[0].rows[0].qty,'1');
  const item=context.bulkRowToItem(state.bulkInvoiceGroups[1].rows[1]);
  assert.equal(item.qty*item.unit,63);
  assert.equal(saves,1);
});
