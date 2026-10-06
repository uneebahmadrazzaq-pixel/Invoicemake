import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

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
  assert.equal(context.formatSephoraUsaAddress(invoice,"billTo"),"Buyer\nCompany\n1 Main Street\nUK\nPhone: 123\nEmail: buyer@example.test");
  assert.equal(context.formatSephoraUsaAddress(invoice,"shipTo"),"Recipient\n2 Other Street\nUK\nPhone: 456\nEmail: recipient@example.test");
  invoice.billTo += "\nPhone: 123\nEmail: saved@example.test";
  assert.equal(context.formatSephoraUsaAddress(invoice,"billTo"),invoice.billTo);
  invoice.shipTo="";invoice.shipToFields={};
  assert.equal(context.formatSephoraUsaAddress(invoice,"shipTo"),invoice.billTo);
});

test("Sephora invoice styles override dashboard font and colour in preview and export", async () => {
  const styles = await readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8");
  const source = await readFile(new URL("../public/editor/app.js", import.meta.url), "utf8");
  assert.match(styles,/body\.dashboard-light \.view \.invoice-doc\.sephora-usa-invoice \* \{[\s\S]*?font-family: "Sephora Arial"[^;]*!important;[\s\S]*?-webkit-text-fill-color: #080808 !important/);
  assert.match(source,/clonedDocument\.fonts\.load\('400 16px "Sephora Arial"'\)/);
  assert.match(source,/clonedDocument\.fonts\.load\('700 16px "Sephora Arial"'\)/);
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
  assert.match(editorSource, /state\.current\.templateId === "sephorausa" \? "letter"/);

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
