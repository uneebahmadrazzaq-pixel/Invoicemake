import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import {readFile,stat} from 'node:fs/promises';
const source=await readFile(new URL('../public/editor/app.js',import.meta.url),'utf8');
const styles=await readFile(new URL('../public/editor/styles.css',import.meta.url),'utf8');
const context=vm.createContext({escapeHtml:value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'),money:(v,c)=>`${c}${Number(v||0).toFixed(2)}`,rowTotal:item=>item.qty*item.unit,formatUsDate:()=> '03/19/2020'});
vm.runInContext(source.slice(source.indexOf('function idealTradingMoney('),source.indexOf('function abwAmount(')),context);

test('Ideal Trading restores reference address labels, separates contacts and avoids duplicated names',()=>{
 const invoice={clientName:'Customer Name',billTo:'Customer Name\n123 Example Street\nP. +1 555 123 4567\nE. customer@example.test',shipTo:'Shipping Person\n456 Other Street\nPhone: +1 555 987 6543\nEmail: shipping@example.test'};
 const bill=context.idealTradingParty(invoice,'billTo'),ship=context.idealTradingParty(invoice,'shipTo');
 assert.equal(bill.split('Customer Name').length-1,1);
 for(const label of ['A.','P.','E.']) assert.ok(bill.includes(`<dt>${label}</dt>`));
 assert.match(bill,/<dd>123 Example Street<\/dd>/);
 assert.match(bill,/<dd>customer@example.test<\/dd>/);
 assert.match(ship,/<h3>Shipping Person<\/h3>/);
 assert.match(ship,/<dd>shipping@example.test<\/dd>/);
 assert.doesNotMatch(ship,/Email:|Phone:/);
});
test('Ideal Trading uses editable structured customer details and email fallback without inventing missing data',()=>{
 const bill=context.idealTradingParty({clientName:'Old Name',clientEmail:'customer@example.test',billTo:'Old address',billToFields:{name:'Edited Name',company:'Example Ltd',street:'Edited Street',city:'Sample City',state:'CA',postal:'12345',country:'USA',phone:'123456'}},'billTo');
 assert.match(bill,/Edited Name/); assert.match(bill,/Example Ltd\nEdited Street\nSample City CA 12345\nUSA/);
 assert.match(bill,/customer@example.test/);assert.doesNotMatch(bill,/Old Name|Old address/);
 const blank=context.idealTradingParty({clientName:'Only Name'},'billTo');
 assert.doesNotMatch(blank,/<dt>P\.<\/dt>|<dt>E\.<\/dt>/);
});
test('Ideal Trading never truncates products and blank rows use the selected currency',()=>{
 const invoice={clientName:'Test',currency:'£',items:Array.from({length:20},(_,i)=>({description:`Product ${i+1}`,qty:2,unit:5}))};
 const html=context.renderIdealTradingPreview(invoice,{subtotal:200,shipping:0,tax:0,total:200});
 assert.match(html,/Product 20/);assert.equal((html.match(/Product \d+/g)||[]).length,20);
 assert.match(html,/£ 200\.00/);
 const blank=context.renderIdealTradingPreview({...invoice,items:[]},{subtotal:0,shipping:0,tax:0,total:0});
 assert.equal((blank.match(/class="ideal-empty-row"/g)||[]).length,8);assert.doesNotMatch(blank,/\$0\.00/);
});
test('Ideal Trading uses bundled Roboto, reference artwork and a flowing footer',async()=>{
 assert.match(styles,/font-family: "Ideal Trading Roboto";[^}]*vetuk-roboto-regular\.ttf/);
 assert.match(styles,/font-family: "Ideal Trading Roboto";[^}]*vetuk-roboto-bold\.ttf/);
 assert.match(styles,/\.ideal-party-details dd \{[^}]*font-size: 13\.44px;[^}]*font-weight: 400;[^}]*color: #000/);
 assert.match(styles,/\.ideal-footer \{\s*position: relative;/);
 for(const asset of ['watermark','top-motif','bottom-motif','phone-icon','web-icon','address-icon']) assert.ok((await stat(new URL(`../public/assets/ideal-trading/${asset}.png`,import.meta.url))).size>100);
});
test('Ideal Trading download rendering waits for both reference font weights',async()=>{
 const fonts=[];
 const document={querySelector:selector=>selector==='.ideal-trading-invoice'?{}:null,fonts:{load:async value=>fonts.push(value),ready:Promise.resolve()}};
 const scope=vm.createContext({});
 vm.runInContext(source.slice(source.indexOf('async function prepareInvoiceExportClone('),source.indexOf('function waitForImages(')),scope);
 await scope.prepareInvoiceExportClone(document);
 assert.deepEqual(fonts,['400 16px "Ideal Trading Roboto"','700 16px "Ideal Trading Roboto"']);
});
