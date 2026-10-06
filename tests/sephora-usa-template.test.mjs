import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

test("Sephora addresses keep readable row spacing and clearance before products", async () => {
  const styles = await readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8");
  assert.match(styles, /\.invoice-doc\.sephora-usa-invoice \.sephora-usa-addresses p \{ line-height: 14px; \}/);
  assert.match(styles, /\.invoice-doc\.sephora-usa-invoice \.sephora-usa-addresses > div \{ min-width: 0; padding-right: 12px; \}/);
  assert.match(styles, /\.invoice-doc\.sephora-usa-invoice \.sephora-usa-overview \{[^}]*padding-bottom: 18px/);
  assert.match(styles, /\.sephora-usa-addresses p::first-line \{[^}]*line-height: 22px/);
});

test("Sephora footer follows totals and bulk exposes customer and discount controls", async () => {
  const styles = await readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8");
  const source = await readFile(new URL("../public/editor/app.js", import.meta.url), "utf8");
  assert.match(styles,/\.sephora-usa-invoice \{[^}]*display: flex;[^}]*flex-direction: column/);
  assert.match(styles,/\.sephora-usa-overview \{[^}]*grid-template-columns: minmax\(0, 1fr\) 322px/);
  assert.match(styles,/\.sephora-usa-addresses p \{[^}]*overflow-wrap: anywhere/);
  assert.match(styles,/\.sephora-usa-meta \{[^}]*box-sizing: border-box;[^}]*width: 100%/);
  const footer=styles.match(/\.sephora-usa-footer \{([^}]*)\}/)[1];
  assert.match(footer,/position: static/);
  assert.match(footer,/margin-top: 0/);
  assert.doesNotMatch(footer,/margin-top: auto/);
  assert.doesNotMatch(footer,/position: absolute|\n\s*bottom:/);
  const context=vm.createContext({templateOptionalFields:{deliveryDateField:new Set(),orderIdField:new Set(),poNumberField:new Set(),shippingAmountField:new Set()}});
  vm.runInContext(source.slice(source.indexOf("function getBulkInvoiceFieldDefinitions("),source.indexOf("function createBulkInvoiceMeta(")),context);
  const fields=context.getBulkInvoiceFieldDefinitions("sephorausa");
  assert.equal(fields.find(field=>field.key==="sephoraUsaCustomerCount").min,"1");
  assert.equal(fields.find(field=>field.key==="sephoraUsaDiscount").type,"number");
});

test("Sephora preserves both addresses and includes email without duplicated contacts", async () => {
  const source = await readFile(new URL("../public/editor/app.js", import.meta.url), "utf8");
  const context = vm.createContext({clientAddress:invoice=>invoice.clientName||"",formatStructuredAddress:fields=>fields?.name||""});
  vm.runInContext(source.slice(source.indexOf("function formatSephoraUsaAddress("),source.indexOf("function renderSephoraUsaPreview(")),context);
  const invoice={billTo:"Buyer\nCompany\n1 Main Street\nUK",shipTo:"Recipient\n2 Other Street\nUK",clientEmail:"buyer@example.test",billToFields:{phone:"123"},shipToFields:{phone:"456",email:"recipient@example.test"}};
  assert.equal(context.formatSephoraUsaAddress(invoice,"billTo"),"Buyer\nCompany\n1 Main Street\nUK\nbuyer@example.test\n123");
  assert.equal(context.formatSephoraUsaAddress(invoice,"shipTo"),"Recipient\n2 Other Street\nUK\nrecipient@example.test\n456");
  invoice.billTo += "\nPhone: 123\nEmail: saved@example.test";
  assert.equal(context.formatSephoraUsaAddress(invoice,"billTo"),invoice.billTo.replace(/^(Phone|Email): /gm,""));
  invoice.shipTo="";invoice.shipToFields={};
  assert.equal(context.formatSephoraUsaAddress(invoice,"shipTo"),invoice.billTo.replace(/^(Phone|Email): /gm,""));
});

test("Sephora invoice styles override dashboard font and colour in preview and export", async () => {
  const styles = await readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8");
  const source = await readFile(new URL("../public/editor/app.js", import.meta.url), "utf8");
  assert.match(styles,/body\.dashboard-light \.view \.invoice-doc\.sephora-usa-invoice \* \{[\s\S]*?font-family: var\(--sephora-font, "Sephora Arimo"\)[^;]*!important;[\s\S]*?-webkit-text-fill-color: #000 !important/);
  assert.match(source,/clonedDocument\.fonts\.load\('400 16px "Sephora Arimo"'\)/);
  assert.match(source,/clonedDocument\.fonts\.load\('700 16px "Sephora Proxima"'\)/);
  for (const name of ["sephora-arimo.ttf","sephora-proxima-regular.ttf","sephora-proxima-bold.ttf","sephora-liberation-regular.ttf","sephora-liberation-bold.ttf"]) await access(new URL(`../public/assets/fonts/${name}`,import.meta.url));
});

test("Sephora USA is selectable, editable, and renders the supplied invoice layout", async () => {
  const [editorSource, styles, editorHtml] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/index.html", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"sephorausa",\s*name:\s*"Sephora USA"/);
  assert.match(editorSource, /template\.id === "sephorausa"/);
  assert.match(editorSource, /function renderSephoraUsaPreview/);
  assert.match(editorSource, /class="invoice-doc sephora-usa-invoice"/);
  assert.match(editorSource, /Sephora USA Inc\./);
  assert.match(editorSource, /Sephora&gt;MyAccount&gt;AccountBalance/);
  assert.match(editorSource, /CAMP\./);
  assert.match(editorSource, /Tax is based on Customer price/);
  assert.match(editorSource, /Sephora Customer Service/);
  assert.match(editorSource, /sephoraUsaCustomerCount/);
  assert.match(editorSource, /sephoraUsaDiscount/);
  assert.match(editorSource, /state\.current\.templateId === "sephorausa" \? \[842, 1190\]/);
  assert.match(editorSource, /if \(templateId === "sephorausa"\) return \[842, 1190\]/);

  assert.match(editorHtml, /id="sephoraUsaFields"/);
  assert.match(editorHtml, /id="sephoraUsaCustomerCount"/);
  assert.match(editorHtml, /id="sephoraUsaDiscount"/);

  assert.match(styles, /\.sephora-usa-invoice\s*\{/);
  assert.match(styles, /width:\s*816px/);
  assert.match(styles, /min-height:\s*1056px/);
  assert.match(styles, /\.sephora-usa-products\s*\{/);
  assert.match(styles, /\.sephora-usa-summary\s*\{/);
  assert.match(styles, /\.sephora-usa-footer\s*\{/);
});
