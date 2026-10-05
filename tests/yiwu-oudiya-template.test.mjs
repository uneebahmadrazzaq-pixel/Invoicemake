import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

test("Yiwu downloads use native Helvetica text and single half-point grid lines", async () => {
  const source = await readFile(new URL("../public/editor/app.js", import.meta.url), "utf8");
  const start = source.indexOf("async function renderYiwuNativePdf(");
  const end = source.indexOf("async function prepareInvoiceExportClone(", start);
  const calls = [];
  const pdf = new Proxy({}, { get: (_, name) => name === "splitTextToSize" ? value => [value] : (...args) => calls.push([name, ...args]) });
  const context = vm.createContext({ formatYiwuDate: () => "03 Mar 2026", yiwuMoney: n => `£${Number(n).toFixed(2)}`, rowTotal: item => item.qty * item.unit });
  vm.runInContext(source.slice(start, end), context);
  await context.renderYiwuNativePdf(pdf, { items: [{description:"Product", unit:3.23, qty:19}], paymentMethod:"Mastercard", currency:"GBP", yiwuTerms:"Terms" }, {subtotal:61.37,tax:0,shipping:5,total:66.37}, {querySelector: () => null});
  assert.ok(calls.some(c => c[0] === "setFont" && c[1] === "helvetica" && c[2] === "bold"));
  assert.ok(calls.some(c => c[0] === "setLineWidth" && c[1] === 0.5));
  assert.ok(calls.some(c => c[0] === "text" && c[1] === "Unit Price"));
  assert.ok(calls.some(c => c[0] === "text" && c[1] === "£3.23"));
  assert.ok(calls.some(c => c[0] === "text" && c[1] === "Grand Total:"));
  assert.match(source, /await renderYiwuNativePdf\(pdf, state\.current/);
  assert.match(source, /await renderYiwuNativePdf\(pdf, invoice, calculateTotals\(invoice\), doc\)/);
  const before = calls.length;
  await context.renderYiwuNativePdf(pdf, {items:Array.from({length:35}, () => ({description:"Product",unit:1,qty:1})), yiwuTerms:"Terms"}, {subtotal:35,tax:0,shipping:0,total:35}, {querySelector: () => null});
  assert.ok(calls.slice(before).some(c => c[0] === "addPage"), "long invoices paginate instead of shrinking");
});

test("Yiwu export loads regular and bold fonts in the capture document", async () => {
  const source = await readFile(new URL("../public/editor/app.js", import.meta.url), "utf8");
  const start = source.indexOf("async function prepareInvoiceExportClone(");
  const end = source.indexOf("\nfunction ", start + 1);
  const renderer = source.slice(start, end);
  const loaded = [];
  const styled = [];
  const invoice = { querySelectorAll: (selector) => [{ style: { setProperty: (property, value) => styled.push({ selector, property, value }) } }] };
  const context = vm.createContext({});
  vm.runInContext(renderer, context);
  await context.prepareInvoiceExportClone({
    querySelector: (selector) => selector === ".yiwu-oudiya-invoice" ? invoice : null,
    fonts: { load: async (font) => loaded.push(font), ready: Promise.resolve() }
  });
  assert.deepEqual(loaded, ['400 16px "Yiwu Helvetica"', '700 16px "Yiwu Helvetica"']);
  assert.ok(styled.some(s => s.selector === ".yiwu-items th" && s.property === "white-space" && s.value === "nowrap"));
  assert.ok(styled.some(s => s.selector.includes("td") && s.property === "font-weight" && s.value === "700"));
});

test("Yiwu uses bundled reference fonts and a path-based Visa mark", async () => {
  const styles = await readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8");
  const source = await readFile(new URL("../public/editor/app.js", import.meta.url), "utf8");
  const logo = await readFile(new URL("../public/assets/yiwu-visa.svg", import.meta.url), "utf8");
  const rules = styles.slice(styles.indexOf("/* Yiwu Oudiya Trading Co."), styles.indexOf("/* Blowout Cards invoice */"));
  assert.match(rules, /perfume-arial\.woff2/);
  assert.match(rules, /perfume-arial-bold\.woff2/);
  assert.match(rules, /font-synthesis: none/);
  assert.match(source, /document\.fonts\.load\('700 16px "Yiwu Helvetica"'\)/);
  assert.match(logo, /<path/);
  assert.doesNotMatch(logo, /<text/);
});

test("Yiwu switches payment logos and excludes card information for PayPal", async () => {
  const source = await readFile(new URL("../public/editor/app.js", import.meta.url), "utf8");
  const renderer = source.slice(source.indexOf("function renderYiwuOudiyaPreview("), source.indexOf("function yiwuMoney("));
  const context = vm.createContext({
    escapeHtml: (value) => String(value), assetPath: (value) => value,
    formatYiwuDate: () => "", yiwuMoney: () => "0.00", rowTotal: () => 0
  });
  vm.runInContext(renderer, context);
  const totals = { subtotal: 0, tax: 0, shipping: 0, total: 0 };
  const invoice = { items: [], cardEnding: "5552", cardExpiry: "12/09", yiwuTerms: "" };
  const visa = context.renderYiwuOudiyaPreview({ ...invoice, paymentMethod: "Visa" }, totals);
  assert.match(visa, /yiwu-visa\.svg/);
  assert.match(visa, /Visa ending in 5552/);
  const paypal = context.renderYiwuOudiyaPreview({ ...invoice, paymentMethod: "PayPal" }, totals);
  assert.match(paypal, /yiwu-paypal\.svg/);
  assert.doesNotMatch(paypal, /ending in|Expiry:/);
  const mastercard = context.renderYiwuOudiyaPreview({ ...invoice, paymentMethod: "Mastercard" }, totals);
  assert.match(mastercard, /aria-label="Mastercard"/);
  assert.doesNotMatch(mastercard, /yiwu-visa\.svg|yiwu-paypal\.svg/);
});

test("Yiwu Oudiya is selectable and renders the supplied paid invoice layout", async () => {
  const [editorSource, styles] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"yiwuoudiya",\s*name:\s*"Yiwu Oudiya Paid Invoice"/);
  assert.match(editorSource, /template\.id === "yiwuoudiya"/);
  assert.match(editorSource, /function renderYiwuOudiyaPreview/);
  assert.match(editorSource, /class="invoice-doc yiwu-oudiya-invoice"/);
  assert.match(editorSource, /assets\/yiwu-oudiya-logo\.png/);
  assert.match(editorSource, /PAID INVOICE/);
  assert.match(editorSource, /Yiwu Oudiya Trading Co, Ltd\./);
  assert.match(editorSource, /BILL TO/);
  assert.match(editorSource, /SHIP TO/);
  assert.match(editorSource, /PAYMENT METHOD/);
  assert.match(editorSource, /Product Details/);
  assert.match(editorSource, /Grand Total:/);
  assert.match(editorSource, /Terms and conditions:/);
  assert.match(editorSource, /invoiceNumber = "392841"/);
  assert.match(editorSource, /orderDate = "2026-03-03"/);
  assert.match(editorSource, /clientName = "KZ HUB LIMITED"/);
  assert.match(editorSource, /shipTo = "ZIA ANWAR/);
  assert.match(editorSource, /cardEnding = "7509"/);
  assert.match(editorSource, /cardExpiry = "02\/31"/);
  assert.match(editorSource, /shippingAmount = 72\.64/);
  assert.match(editorSource, /Mens Neon Mushroom Hawaiian Summer Shirt Red UK XXS Tag S/);
  assert.match(editorSource, /Mens Neon Mushroom Hawaiian Summer Shirt Blue UK M Tag XL/);

  assert.match(styles, /\.yiwu-oudiya-invoice\s*\{/);
  assert.match(styles, /width:\s*210mm/);
  assert.match(styles, /min-height:\s*297mm/);
  assert.match(styles, /\.yiwu-items\s*\{/);
  assert.match(styles, /\.yiwu-totals\s*\{/);
});
