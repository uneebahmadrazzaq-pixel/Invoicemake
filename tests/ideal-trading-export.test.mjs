import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../public/editor/app.js',import.meta.url),'utf8');
const scope=vm.createContext({});
vm.runInContext(source.slice(source.indexOf('function getInvoicePdfFormat('),source.indexOf('async function createCombinedBulkPdf(')),scope);
vm.runInContext(source.slice(source.indexOf('function idealTradingPdfSlices('),source.indexOf('async function prepareInvoiceExportClone(')),scope);

test('Ideal Trading PDF preserves the original 709 x 1001 point page',()=>{
 assert.deepEqual(Array.from(scope.getInvoicePdfFormat('idealtrading')),[709,1001]);
 assert.equal(scope.getInvoicePdfFormat('sunsky'),'a4');
});
test('Ideal Trading keeps a short invoice on one page without shrinking its fonts',()=>{
 const ranges=scope.idealTradingPdfSlices(1122,794*1001/709,[]);
 assert.equal(ranges.length,1);
 assert.equal(ranges[0].start,0);
});
test('Long Ideal Trading invoices break at row boundaries instead of scaling the whole invoice',()=>{
 const ranges=scope.idealTradingPdfSlices(2400,1121,[400,900,1100,1500,2000,2350,2400]);
 assert.equal(ranges.length,3);
 assert.equal(ranges[0].end,1100);
 assert.equal(ranges[1].start,1100);
 assert.equal(ranges[1].end,2000);
 assert.equal(ranges[2].end,2400);
});
test('Single and bulk exports use the same fixed-width lossless reference renderer',()=>{
 const single=source.slice(source.indexOf('async function downloadCurrentInvoicePdf('),source.indexOf('async function downloadCurrentInvoicePdfUnder5Mb('));
 const bulk=source.slice(source.indexOf('async function createCombinedBulkPdf('),source.indexOf('function mountInvoiceExportStage('));
 assert.match(single,/await renderIdealTradingPdf\(pdf, doc\)/);
 assert.match(bulk,/await renderIdealTradingPdf\(pdf, doc, targetBytes \? settings.scale : 4\)/);
 const render=source.slice(source.indexOf('async function renderIdealTradingPdf('),source.indexOf('function idealTradingPdfSlices('));
 assert.match(render,/const width = 794/);
 assert.doesNotMatch(render,/doc.scrollWidth|Math.min\([^;]*canvas.width/);
 assert.match(render,/"image\/png"/);
 assert.match(render,/stage.remove\(\)/);
});
