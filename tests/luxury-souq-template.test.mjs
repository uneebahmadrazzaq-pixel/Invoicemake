import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const editorSource = await readFile(
  new URL("../public/editor/app.js", import.meta.url),
  "utf8",
);
const editorStyles = await readFile(
  new URL("../public/editor/styles.css", import.meta.url),
  "utf8",
);

test("Luxury Souq watches is available as an editable invoice template", () => {
  assert.match(editorSource, /id:\s*"luxurysouq"/);
  assert.match(editorSource, /name:\s*"Luxury Souq \(Watches\)"/);
  assert.match(editorSource, /renderLuxurySouqPreview\(invoice, totals\)/);
  assert.match(editorSource, /state\.current\.cardExpiry/);
  assert.match(editorStyles, /\.luxury-souq-invoice/);
});

test("Luxury Souq addresses preserve separate recipients and contact details", () => {
  const context=vm.createContext({clientAddress:i=>i.clientName,formatStructuredAddress:f=>f.name||""});
  vm.runInContext(editorSource.slice(editorSource.indexOf("function formatLuxurySouqAddress("),editorSource.indexOf("function renderLuxurySouqPreview(")),context);
  const invoice={billTo:"Buyer\n1 Main Street",shipTo:"Recipient\n2 Other Street",clientEmail:"buyer@example.test",billToFields:{phone:"123"},shipToFields:{email:"recipient@example.test",phone:"456"}};
  assert.equal(context.formatLuxurySouqAddress(invoice,"billTo"),"Buyer\n1 Main Street\nPhone: 123");
  assert.equal(context.formatLuxurySouqAddress(invoice,"shipTo"),"Recipient\n2 Other Street\nPhone: 456");
  invoice.billTo += "\nPhone: 123\nEmail: buyer@example.test";
  assert.equal(context.formatLuxurySouqAddress(invoice,"billTo"),"Buyer\n1 Main Street\nPhone: 123");
  invoice.shipTo += "\nrecipient@example.test";
  assert.equal(context.formatLuxurySouqAddress(invoice,"shipTo").includes("@"),false);
});

test("Luxury Souq uses proportional source artwork, protected typography and matching export aspect", () => {
  assert.match(editorStyles, /font-family: "Luxury Souq Arial"; src: url\("\.\.\/assets\/fonts\/sephora-liberation-regular.ttf"\)/);
  assert.match(editorStyles, /font-family: "Luxury Souq Arial"; src: url\("\.\.\/assets\/fonts\/sephora-liberation-bold.ttf"\)/);
  assert.match(editorSource,/luxury-souq-logo-source\.png/);
  assert.match(editorSource,/luxury-souq-qr-sharp\.svg/);
  assert.match(editorStyles,/body\.dashboard-light \.view \.invoice-doc\.luxury-souq-invoice \* \{[^}]*Luxury Souq Arial[^}]*#111 !important/);
  assert.match(editorStyles,/\.luxury-souq-brand img \{[^}]*height: auto;[^}]*object-fit: contain/);
  assert.match(editorStyles,/\.luxury-souq-footer img \{[^}]*height: auto;[^}]*object-fit: contain/);
  assert.match(editorSource,/clonedDocument.fonts.load\('700 16px "Luxury Souq Arial"'\)/);
  assert.match(editorSource,/if \(templateId === "luxurysouq"\) return \[595.5, 794\]/);
  assert.match(editorSource,/state.current.templateId === "luxurysouq" \? \[595.5, 794\]/);
});

test("Luxury Souq single and bulk PDF capture use high-resolution lossless images", () => {
  assert.match(editorSource,/const isHighResolutionExport = state.current.templateId === "luxurysouq"/);
  assert.match(editorSource,/const isLuxurySouqExport = invoice.templateId === "luxurysouq"/);
  assert.match(editorSource,/scale: \(isLuxurySouqExport[^\n]*Math.max\(4, settings.scale\)/);
  assert.match(editorSource,/const usesLosslessImage = isLuxurySouqExport/);
});

test("Luxury Souq payment artwork follows Visa, Mastercard and PayPal selections", () => {
  const context=vm.createContext({escapeHtml:v=>String(v||""),assetPath:v=>v,clientAddress:i=>i.clientName,formatStructuredAddress:()=>"",formatDisplayDate:()=>"",money:()=>"",itemLine:()=>"",rowTotal:()=>0});
  vm.runInContext(editorSource.slice(editorSource.indexOf("function formatLuxurySouqAddress("),editorSource.indexOf("function renderGoSuppsPreview(")),context);
  const invoice={items:[],cardEnding:"1234",cardExpiry:"12/30"};
  invoice.cardType="Visa";
  const visa=context.renderLuxurySouqPreview(invoice,{});
  assert.match(visa,/yiwu-visa.svg/);
  assert.doesNotMatch(visa,/luxury-souq-mastercard/);
  invoice.cardType="Mastercard";
  assert.match(context.renderLuxurySouqPreview(invoice,{}),/luxury-souq-mastercard/);
  invoice.cardType="PayPal";
  const paypal=context.renderLuxurySouqPreview(invoice,{});
  assert.match(paypal,/yiwu-paypal.svg/);
  assert.doesNotMatch(paypal,/ending <strong>|Expiry :/);
});
