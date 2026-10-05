import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

test("Sunsky has left-aligned company copy, larger text and single-edge table borders", async () => {
  const styles = await readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8");
  const source = await readFile(new URL("../public/editor/app.js", import.meta.url), "utf8");
  const section = styles.slice(styles.indexOf(".sunsky-invoice {"), styles.indexOf(".items-table.is-sunsky-items {"));
  assert.match(section, /\.sunsky-company \{\s*text-align: left/);
  assert.match(section, /font-size: 11\.5px !important/);
  assert.match(section, /border-collapse: separate/);
  assert.match(section, /border-spacing: 0/);
  assert.match(section, /border-right: 1px solid #111;\s*border-bottom: 1px solid #111/);
  assert.match(source, /const isHighResolutionExport = state\.current\.templateId === "sunsky"/);
});

test("Sunsky uses labelled client details, independent payment status and correct brands", async () => {
  const source = await readFile(new URL("../public/editor/app.js", import.meta.url), "utf8");
  const start = source.indexOf("function getSunskyPaymentStatus(");
  const end = source.indexOf("function renderQogita", start);
  const context = vm.createContext({escapeHtml: value => String(value), assetPath: value => value, formatSunskyDate: () => "", money: value => String(value), rowTotal: () => 0, parseInvoiceAddress: () => ({})});
  vm.runInContext(source.slice(start, end), context);
  const fields = {name:"Customer",company:"Company",street:"1 Main Road",city:"London",postal:"W1 1AA",country:"UK",phone:"123"};
  const address = context.formatSunskyAddress(fields, "");
  assert.match(address, /Name: Customer\nCompany\nAddress: 1 Main Road/);
  assert.match(address, /Postal Code: W1 1AA\nCountry: UK\nTelephone: 123/);
  assert.equal(context.formatSunskyAddress({}, "Name: Customer\nAddress: Main Road"), "Name: Customer\nAddress: Main Road");
  const invoice = {items:[],billToFields:fields,shipToFields:fields,paymentDetails:"Visa ending in 1234",sunskyPaymentStatus:"Pending",cardType:"Visa",cardEnding:"1234",cardExpiry:"12/30"};
  const totals = {subtotal:0,total:0,shipping:0};
  const visa = context.renderSunskyPreview(invoice,totals);
  assert.match(visa, /yiwu-visa\.svg/);
  assert.match(visa, /Payment Status: Pending/);
  assert.doesNotMatch(visa, /Payment Status: Visa/);
  const mastercard = context.renderSunskyPreview({...invoice,cardType:"Mastercard"},totals);
  assert.match(mastercard, /aria-label="Mastercard"/);
  const paypal = context.renderSunskyPreview({...invoice,cardType:"PayPal"},totals);
  assert.match(paypal, /yiwu-paypal\.svg/);
  assert.doesNotMatch(paypal, /ending in|Exp:/);
});

test("Sunsky is selectable and renders the supplied editable commercial invoice", async () => {
  const [editorSource, styles, editorHtml] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"sunsky",\s*name:\s*"Sunsky Commercial Invoice"/);
  assert.match(editorSource, /template\.id === "sunsky"/);
  assert.match(editorSource, /function renderSunskyPreview/);
  assert.match(editorSource, /class="invoice-doc sunsky-invoice"/);
  assert.match(editorSource, /Shenzhen SUNSKY Technology Limited/);
  assert.match(editorSource, /Commercial INVOICE/);
  assert.match(editorSource, /To Bill:/);
  assert.match(editorSource, /To Ship:/);
  assert.match(editorSource, /Payment Status:/);
  assert.match(editorSource, /HS Code/);
  assert.match(editorSource, /Total Amount:/);
  assert.match(editorSource, /sunskySalesperson/);
  assert.match(editorSource, /sunskyRemarks/);
  assert.match(editorHtml, /id="sunskyFields"/);
  assert.match(editorHtml, /id="sunskySalesperson"/);
  assert.match(editorHtml, /id="sunskyRemarks"/);
  assert.match(styles, /\.sunsky-invoice\s*\{/);
  assert.match(styles, /width:\s*794px/);
  assert.match(styles, /min-height:\s*1123px/);
  assert.match(styles, /\.sunsky-products\s*\{/);
  assert.match(styles, /grid-template-columns:\s*1fr 1fr 0\.84fr/);

  await access(new URL("../public/assets/sunsky-logo.png", import.meta.url));
});
