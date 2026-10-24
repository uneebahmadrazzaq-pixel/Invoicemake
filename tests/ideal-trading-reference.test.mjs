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
 for(const asset of ['reference-bold-labels','reference-bold-amounts']) {
  const bytes=await readFile(new URL(`../public/assets/ideal-trading/${asset}.ttf`,import.meta.url));
  assert.equal(bytes.readUInt32BE(0),0x00010000);
  assert.match(styles,new RegExp(`${asset}\\.ttf[^}]*unicode-range:`));
 }
});
test('Ideal Trading download rendering waits for both reference font weights',async()=>{
 const fonts=[],glyphs=[];
 const document={querySelector:selector=>selector==='.ideal-trading-invoice'?{}:null,fonts:{load:async (value,text)=>{fonts.push(value);glyphs.push(text)},ready:Promise.resolve()}};
 const scope=vm.createContext({});
 vm.runInContext(source.slice(source.indexOf('async function prepareInvoiceExportClone('),source.indexOf('function waitForImages(')),scope);
 await scope.prepareInvoiceExportClone(document);
 assert.deepEqual(fonts,['400 16px "Ideal Trading Roboto"','700 16px "Ideal Trading Roboto"']);
 assert.match(glyphs[1],/Payment Method.*0123456789\$£€/);
});

test('Ideal Trading repairs legacy card blocks in terms but preserves custom terms',()=>{
 const old={paymentDetails:'Credit / Debit Card\nCredit Card Type: Mastercard\nCredit Card Number: xxxx-5552\nExpiry: 12/09'};
 assert.match(context.idealTradingTerms(old),/^Please Check All Products Before Signing Delivery Sheet/);
 assert.equal(context.idealTradingTerms({paymentDetails:'Custom invoice conditions'}),'Custom invoice conditions');
 assert.equal(context.idealTradingTerms({paymentDetails:''}),'');
 const html=context.renderIdealTradingPreview({...old,items:[],cardType:'Mastercard',cardEnding:'5552',paymentMethod:'Paid In Advance Via Visa Credit Card'},{});
 assert.match(html,/Paid In Advance Via Mastercard Credit Card/);
 assert.doesNotMatch(html,/Credit Card Type:|Expiry:|Via Visa/);
 assert.match(html,/Please Check All Products/);
});
test('Ideal Trading customer selection preserves terms and updates payment method to the actual card',()=>{
 const scope=vm.createContext({state:{current:{templateId:'idealtrading',paymentDetails:'Invoice-specific terms'}},formatStructuredAddress:f=>f.street||'',formatClientPaymentDetails:()=>{throw Error('Client payment metadata must not replace invoice terms');}});
 vm.runInContext(source.slice(source.indexOf('function idealTradingMoney('),source.indexOf('function abwAmount(')),scope);
 vm.runInContext(source.slice(source.indexOf('function applyClientToCurrent('),source.indexOf('function handleBuilderClientSelect(')),scope);
 scope.applyClientToCurrent({id:'c1',name:'Customer',cardType:'Mastercard',cardEnding:'5552',billToFields:{street:'Street'},shipToFields:{street:'Street'}});
 assert.equal(scope.state.current.paymentDetails,'Invoice-specific terms');
 assert.equal(scope.state.current.paymentMethod,'Paid In Advance Via Mastercard Credit Card');
 assert.equal(context.idealTradingPaymentMethod({cardType:'PayPal',paymentMethod:'Visa'}),'Paid In Advance Via PayPal');
 assert.equal(context.idealTradingPaymentMethod({paymentMethod:'Bank transfer',cardType:'Visa'}),'Bank transfer');
});
test('Ideal Trading isolates payment, notes and footer typography from the full website theme',()=>{
 assert.match(styles,/body\.dashboard-light \.view \.invoice-doc\.ideal-trading-invoice :is\(\.ideal-payment-box p, \.ideal-notes\) \{[^}]*font-size: 13\.44px !important;[^}]*color: #000 !important/);
 assert.match(styles,/body\.dashboard-light \.view \.invoice-doc\.ideal-trading-invoice \.ideal-footer > strong \{[^}]*color: #a8a8a8 !important/);
 assert.match(styles,/body\.dashboard-light \.view \.invoice-doc\.ideal-trading-invoice :is\(\.ideal-products th,[^}]*color: #fff !important/);
});
