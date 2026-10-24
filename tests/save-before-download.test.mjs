import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../public/editor/app.js',import.meta.url),'utf8');
const slice=(a,b)=>source.slice(source.indexOf(a),source.indexOf(b,source.indexOf(a)));
const button=()=>({hidden:false,disabled:false,setAttribute(){},removeAttribute(){}});
function setup() {
  const state={current:{clientId:'client',templateId:'costcousa',invoiceNumber:'100',items:[{qty:2,unit:10}]},invoices:[],clients:[{id:'client',name:'Customer'}],bulkInvoiceGroups:[]};
  const els={saveInvoice:button(),saveEditorInvoice:button(),downloadInvoice:button(),downloadInvoice5mb:button(),downloadInvoiceJpg:button(),bulkDownloadAll:button(),bulkDownload5mb:button(),bulkClientSelect:{value:'client'},bulkTemplateSelect:{value:'costcousa'},bulkInvoiceForms:{querySelectorAll:()=>[]}};
  const messages=[];
  const context=vm.createContext({state,els,invoiceSaveInProgress:false,invoiceExportInProgress:false,document:{getElementById:()=>null},crypto:{randomUUID:()=> '00000000-0000-4000-8000-000000000001'},window:{},console:{error(){}},localStorage:{setItem(){}},storageKey:'test',cloneInvoice:v=>JSON.parse(JSON.stringify(v)),syncInvoiceFromForm(){},persist:()=>Promise.resolve(),assertInvoiceSavedLocally(){},renderSavedInvoices(){},renderClients(){},renderBulkInvoiceForms(){},updateMetrics(){},showView(){},showBulkValidationIssues(){},showInvoiceSaveNotice:message=>messages.push(message)});
  vm.runInContext(slice('function invoiceDownloadSignature(','function assertInvoiceSavedLocally('),context);
  return {state,els,context,messages};
}

test('unsaved invoices and edits have no download buttons; cloud-confirmed saves unlock them',async()=>{
  const {state,els,context}=setup();
  context.updateInvoiceDownloadAvailability();
  assert.equal(els.downloadInvoice.hidden,true);
  let finish;
  context.persist=()=>new Promise(resolve=>finish=resolve);
  const saving=context.saveCurrentInvoice();
  assert.equal(context.isInvoiceSavedForDownload(state.current),false);
  finish();await saving;
  assert.equal(context.isInvoiceSavedForDownload(state.current),true);
  assert.equal(els.downloadInvoice.hidden,false);
  state.current.items[0].qty=3;
  context.updateInvoiceDownloadAvailability();
  assert.equal(els.downloadInvoice.hidden,true);
  assert.equal(context.requireInvoiceSavedForDownload(state.current),false);
});

test('failed cloud saves roll back and do not unlock any invoice download',async()=>{
  const {state,els,context}=setup();
  context.persist=()=>Promise.reject(new Error('Network unavailable'));
  await context.saveCurrentInvoice();
  assert.equal(state.invoices.length,0);
  assert.equal(els.downloadInvoice.hidden,true);
  assert.equal(context.invoiceSaveInProgress,false);
});

test('a failed save preserves edits made while the request was pending',async()=>{
  const {state,context}=setup();let reject;
  context.persist=()=>new Promise((_resolve,fail)=>reject=fail);
  const pending=context.saveCurrentInvoice();
  state.current.invoiceNumber='edited-during-save';
  reject(new Error('Network failed'));await pending;
  assert.equal(state.current.invoiceNumber,'edited-during-save');
  assert.equal(state.current.id,undefined);
});

test('download signatures ignore save metadata and key order, but not invoice content',()=>{
  const {state,context}=setup();
  const current=state.current;
  assert.equal(context.invoiceDownloadSignature({...current,savedAt:'a',status:'saved'}),context.invoiceDownloadSignature({...current,status:'draft',savedAt:'b'}));
  assert.notEqual(context.invoiceDownloadSignature(current),context.invoiceDownloadSignature({...current,clientId:'another-customer'}));
  assert.notEqual(context.invoiceDownloadSignature(current),context.invoiceDownloadSignature({...current,items:[{qty:3,unit:10}]}));
});

test('bulk downloads use saved snapshots, invalidate after edits and resave without duplicate invoice records',async()=>{
  const {state,els,context}=setup();
  const group={rows:[{qty:2,unit:10}],meta:{invoiceNumber:'100'},invoiceId:'bulk-1'};
  state.bulkInvoiceGroups=[group];
  context.buildBulkInvoices=()=>[{...JSON.parse(JSON.stringify(state.current)),id:group.invoiceId}];
  vm.runInContext(slice('async function generateBulkInvoices(','function downloadSampleCsv('),context);
  assert.equal(context.savedBulkDownloadInvoices().length,0);
  await context.generateBulkInvoices();
  assert.equal(els.bulkDownloadAll.hidden,false);
  assert.equal(context.savedBulkDownloadInvoices().length,1);
  group.meta.invoiceNumber='101';
  context.updateInvoiceDownloadAvailability();
  assert.equal(els.bulkDownloadAll.hidden,true);
  await context.generateBulkInvoices();
  assert.equal(state.invoices.length,1);
});

test('accounting must succeed before a saved invoice can be released',async()=>{
  const {state,context}=setup();
  await context.saveCurrentInvoice();
  await assert.rejects(context.recordInvoiceDownloadRelease([state.current],'pdf'),/tracking is unavailable/);
  let recorded;
  context.window.InvoiceCloud={recordInvoiceDownloads:async(invoices,format,id)=>{recorded={invoices,format,id};}};
  await context.recordInvoiceDownloadRelease([state.current],'pdf');
  assert.equal(recorded.format,'pdf');
  assert.equal(recorded.invoices[0].clientId,'client');
  state.current.invoiceNumber='unsaved edit';
  await assert.rejects(context.recordInvoiceDownloadRelease([state.current],'pdf'),/Save the invoices/);
});

test('bulk edits during a pending save do not unlock downloads for the wrong snapshot',async()=>{
  const {state,els,context}=setup();let finish;
  const group={rows:[{qty:1,unit:10}],meta:{invoiceNumber:'100'},invoiceId:'bulk-1'};
  state.bulkInvoiceGroups=[group];
  context.buildBulkInvoices=()=>[{...JSON.parse(JSON.stringify(state.current)),id:group.invoiceId}];
  let first=true;context.persist=()=>{if(first){first=false;return new Promise(resolve=>finish=resolve);}return Promise.resolve();};
  vm.runInContext(slice('async function generateBulkInvoices(','function downloadSampleCsv('),context);
  const pending=context.generateBulkInvoices();
  group.meta.invoiceNumber='changed-during-save';
  finish();await pending;
  assert.equal(group.meta.invoiceNumber,'changed-during-save');
  assert.equal(els.bulkDownloadAll.hidden,true);
  assert.equal(context.savedBulkDownloadInvoices().length,0);
});

test('all invoice download entry points require saved records, including compressed, JPG and bulk exports',()=>{
  for(const name of ['downloadCurrentInvoicePdf','downloadCurrentInvoicePdfUnder5Mb','downloadCurrentInvoiceJpg']) {
    assert.match(source.slice(source.indexOf(`async function ${name}()`),source.indexOf(`async function ${name}()`)+160),/requireInvoiceSavedForDownload/);
  }
  assert.match(slice('async function downloadBulkInvoices(','function getInvoicePdfFormat('),/savedBulkDownloadInvoices\(\)/);
  assert.match(slice('async function downloadSingleBulkInvoice(','async function downloadBulkInvoices('),/savedBulkDownloadInvoices\(\[groupIndex\]\)/);
});

test('download request IDs also work on the existing HTTP site without crypto.randomUUID',()=>{
  const {context}=setup();
  context.crypto={getRandomValues:bytes=>bytes.fill(12)};
  assert.match(context.invoiceDownloadRequestId(),/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/);
});
