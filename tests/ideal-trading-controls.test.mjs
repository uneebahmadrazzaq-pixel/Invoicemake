import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../public/editor/app.js',import.meta.url),'utf8');
const html=await readFile(new URL('../public/editor/index.html',import.meta.url),'utf8');
const helpers=source.slice(source.indexOf('function idealTradingMoney('),source.indexOf('function abwAmount('));
const parse=source.slice(source.indexOf('function parseCsv('),source.indexOf('function downloadText(',source.indexOf('function parseCsv(')));
const make=(extras={})=>vm.createContext({escapeHtml:v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;'),money:(v,c='$')=>`${c}${Number(v||0).toFixed(2)}`,rowTotal:r=>r.qty*r.unit,itemLine:r=>r.description||r.product||'',formatUsDate:()=> '03/19/2020',...extras});

test('Ideal Trading single and bulk CSV have only Description, Quantity and Unit Price, with calculated totals',()=>{
 let csv;
 const scope=make({getTemplate:()=>({id:'idealtrading'}),downloadText:(_n,text)=>csv=text});
 vm.runInContext(source.slice(source.indexOf('const defaultTemplateCsvSchema'),source.indexOf('const templateOptionalFields')),scope);
 vm.runInContext(source.slice(source.indexOf('function getTemplateCsvSchema('),source.indexOf('function updateSingleCsvHelp(')),scope);
 vm.runInContext(source.slice(source.indexOf('function csvCell('),source.indexOf('function parseCsv(')),scope);
 vm.runInContext(parse,scope);
 scope.getTemplate=()=>({id:'idealtrading'});
 for(const bulk of [false,true]) {
  scope.downloadTemplateSampleCsv('idealtrading',bulk);
  assert.equal(csv.split('\n')[0],'Description,Quantity,Unit Price');
  const groups=scope.parseCsvInvoiceGroups(csv);
  assert.equal(groups.length,bulk?2:1);
  assert.equal(groups[0][0].qty,'12');assert.equal(groups[0][0].unit,'39.82');
 }
 const groups=scope.parseCsvInvoiceGroups('Description,Quantity,Unit Price\n"Toy, blue",2,3.50\n\nToy B,4,5');
 assert.equal(groups[0][0].description,'Toy, blue');assert.equal(Number(groups[1][0].qty)*Number(groups[1][0].unit),20);
 assert.equal(scope.readCsvRowValue({qty:0},'Quantity'),0);
});

test('Ideal Trading addresses flow continuously and independently edited fields preserve blank optional contacts',()=>{
 const scope=make();vm.runInContext(helpers,scope);
 const invoice={clientName:'I A MIAN',clientEmail:'old@example.test',billToFields:{name:'I A MIAN',street:'13/2 Calder Gardens',city:'Edinburgh',postal:'EH11 4JB',country:'United Kingdom',phone:'+44 5558988357'},idealShipToName:'Other Recipient',idealShipToAddress:'Edited street\nOther city\nOther country',idealShipToPhone:'',idealShipToEmail:''};
 const bill=scope.idealTradingPartyData(invoice,'billTo'),ship=scope.idealTradingPartyData(invoice,'shipTo');
 assert.equal(bill.address,'13/2 Calder Gardens Edinburgh EH11 4JB United Kingdom');
 assert.equal(ship.address,'Edited street Other city Other country');assert.equal(ship.name,'Other Recipient');
 assert.equal(ship.email,'');assert.equal(ship.phone,'');assert.equal(bill.email,'old@example.test');
 assert.doesNotMatch(scope.idealTradingParty(invoice,'billTo'),/Gardens\n|Edinburgh\n/);
 assert.match(scope.idealTradingParty(invoice,'billTo'),/EH11\u00a04JB/);
});

test('Ideal Trading single product controls match the template with no irrelevant SKU/product inputs',()=>{
 const rows=[];const classes={toggle(){}};
 const els={itemsBody:{innerHTML:'',appendChild:r=>rows.push(r)},itemsTableWrap:{classList:classes},itemsTable:{classList:classes},itemsHeader:{}};
 const scope=make({els,state:{current:{templateId:'idealtrading',currency:'$',items:[{description:'Toy',qty:2,unit:3.5}]}},document:{createElement:()=>({dataset:{}})}});
 vm.runInContext(source.slice(source.indexOf('function renderItems('),source.indexOf('function handleTemplateAssetUpload(')),scope);
 scope.renderItems();
 assert.match(els.itemsHeader.innerHTML,/<th>Description<\/th><th>Quantity<\/th><th>Unit Price<\/th><th>Line Total<\/th>/);
 assert.equal(rows.length,1);assert.match(rows[0].innerHTML,/data-field="description"/);assert.match(rows[0].innerHTML,/\$7\.00/);
 assert.doesNotMatch(rows[0].innerHTML,/data-field="sku"|data-field="product"/);
 for(const key of ['BillTo','ShipTo']) for(const field of ['Name','Address','Phone','Email']) assert.ok(html.includes(`id="ideal${key}${field}"`));
});

test('Ideal Trading bulk metadata offers independent reference address, payment and notes controls',()=>{
 const state={current:{templateId:'idealtrading',clientName:'Sample',clientEmail:'sample@example.test',billTo:'Street\nCity',shipTo:'Sample\nStreet\nCity',invoiceNumber:'INV',orderDate:'2026-10-24',cardType:'Visa',cardEnding:'1234',taxRate:10,shippingAmount:5}};
 const scope=make({state,els:{bulkTemplateSelect:{value:'idealtrading'}},getTemplate:()=>({id:'idealtrading',initials:'IT'}),formatDate:()=> '2026-10-24',formatWalmartPrintDate:()=> ''});
 vm.runInContext(helpers,scope);
 vm.runInContext(source.slice(source.indexOf('function getBulkInvoiceFieldDefinitions('),source.indexOf('function clearBulkInvoiceGroups(')),scope);
 const defs=scope.getBulkInvoiceFieldDefinitions('idealtrading');
 const keys=Array.from(defs,d=>d.key);
 for(const key of ['idealBillToAddress','idealShipToAddress','idealBillToEmail','idealShipToEmail','currency','taxRate','shippingAmount','paymentDetails','cardType','cardEnding','paymentMethod']) assert.ok(keys.includes(key));
 assert.ok(!keys.includes('poNumber')&&!keys.includes('deliveryDate')&&!keys.includes('orderId'));
 const a=scope.createBulkInvoiceMeta(0),b=scope.createBulkInvoiceMeta(1);
 assert.equal(a.idealBillToAddress,'Street City');assert.equal(a.idealShipToEmail,'sample@example.test');
 b.idealShipToAddress='Independent address';assert.equal(a.idealShipToAddress,'Street City');
 assert.equal(b.invoiceNumber,'INV-2');
});

test('Ideal Trading bulk product edits update the correct grouped invoice',()=>{
 const rows=[{Description:'A',Quantity:'1','Unit Price':'2',description:'A',qty:'1',unit:'2',__groupIndex:0},{Description:'B',Quantity:'3','Unit Price':'4',description:'B',qty:'3',unit:'4',__groupIndex:1}];
 const state={current:{templateId:'idealtrading'},bulkRows:rows,bulkInvoiceGroups:[{rows:[{...rows[0]}]},{rows:[{...rows[1]}]}]};
 const scope=make({state,els:{bulkTemplateSelect:{value:'idealtrading'}},persist(){}});
 vm.runInContext(parse,scope);
 vm.runInContext(source.slice(source.indexOf('function luxurySouqCsvField('),source.indexOf('function renderBulkRows(')),scope);
 const input={dataset:{bulkProductRow:'1',bulkProductHeader:'Quantity'},value:'8'};
 scope.handleLuxurySouqBulkProductInput({target:{closest:()=>input}});
 assert.equal(state.bulkInvoiceGroups[1].rows[0].qty,'8');assert.equal(state.bulkInvoiceGroups[0].rows[0].qty,'1');
 assert.equal(state.bulkRows[1].Quantity,'8');
 scope.els.bulkRowsHead={};scope.els.bulkRows={};scope.els.generateBulk={};scope.updateMetrics=()=>{};
 scope.getTemplateCsvSchema=()=>({headers:['Description','Quantity','Unit Price']});
 vm.runInContext(source.slice(source.indexOf('function bulkRowToItem('),source.indexOf('function buildBulkInvoices(')),scope);
 vm.runInContext(source.slice(source.indexOf('function renderBulkRows('),source.indexOf('async function generateBulkInvoices(')),scope);
 scope.renderBulkRows();
 assert.match(scope.els.bulkRowsHead.innerHTML,/<th>Line Total<\/th>/);
 assert.match(scope.els.bulkRows.innerHTML,/data-ideal-bulk-total>\$32\.00/);
});

test('Ideal Trading generated bulk invoices retain each invoice address, payment and notes overrides',()=>{
 const state={current:{templateId:'idealtrading',clientId:'c',clientName:'Customer'},clients:[{id:'c'}],bulkInvoiceGroups:[{rows:[{description:'A',qty:'2',unit:'3.5'}],meta:{idealBillToAddress:'Billing One',idealShipToAddress:'Shipping One',idealShipToEmail:'one@example.test',paymentDetails:'Terms One'}},{rows:[{description:'B',qty:'4',unit:'5'}],meta:{idealBillToAddress:'Billing Two',idealShipToAddress:'Shipping Two',idealShipToEmail:'two@example.test',paymentDetails:'Terms Two'}}]};
 const scope=make({state,els:{bulkClientSelect:{value:'c'},bulkTemplateSelect:{value:'idealtrading'}},validateBulkInvoiceGroups:()=>true,syncBulkDetailsToCurrent(){},applyClientToCurrent(){},cloneInvoice:v=>structuredClone(v)});
 vm.runInContext(source.slice(source.indexOf('function bulkRowToItem('),source.indexOf('function handleCsvUpload(')),scope);
 const invoices=scope.buildBulkInvoices();
 assert.equal(invoices[0].idealShipToAddress,'Shipping One');assert.equal(invoices[1].idealShipToAddress,'Shipping Two');
 assert.equal(invoices[0].paymentDetails,'Terms One');assert.equal(invoices[1].paymentDetails,'Terms Two');
 assert.equal(invoices[1].items[0].qty*invoices[1].items[0].unit,20);
});

test('Ideal Trading bulk-wide card changes update group metadata without replacing per-invoice addresses',()=>{
 const state={current:{templateId:'idealtrading'},clients:[],bulkInvoiceGroups:[{meta:{idealShipToAddress:'One'}},{meta:{idealShipToAddress:'Two'}}]};
 const els={bulkTemplateSelect:{value:'idealtrading'},bulkCardType:{value:'Mastercard'},bulkCardLast4:{value:'5552'},bulkCardExpiry:{value:'',closest:()=>({})}};
 const scope=make({state,els,getTemplate:()=>({id:'idealtrading'}),renderBulkInvoiceForms(){},persist(){}});
 vm.runInContext(helpers,scope);
 vm.runInContext(source.slice(source.indexOf('function syncBulkDetailsFromCurrent('),source.indexOf('function setBuilderStage(')),scope);
 scope.syncBulkDetailsToCurrent({target:{id:'bulkCardType'}});
 assert.equal(state.bulkInvoiceGroups[0].meta.idealShipToAddress,'One');assert.equal(state.bulkInvoiceGroups[1].meta.idealShipToAddress,'Two');
 for(const group of state.bulkInvoiceGroups) assert.equal(group.meta.paymentMethod,'Paid In Advance Via Mastercard Credit Card');
});
