const templates = [
  { id: "pound", name: "Pound Wholesale UK", team: "Pound Wholesale Team", region: "UK", color: "#29345f", initials: "PW" },
  { id: "zoro", name: "Zoro USA", team: "Zoro Team", region: "USA", color: "#1f1f1f", initials: "ZU" },
  { id: "gosupps", name: "GO SUPPS.COM", team: "Go Supps Team", region: "USA/EU", color: "#c31421", initials: "GS" },
  { id: "supplements", name: "Supplements UK USA EU", team: "Go Supps Team", region: "Multi-region", color: "#a4111b", initials: "SU" },
  { id: "electronics", name: "Electronics Supplier", team: "Wholesale Central Team", region: "Global", color: "#111111", initials: "EL" },
  { id: "tw", name: "T W Wholesale & Superstore", team: "Pound Wholesale Team", region: "UK", color: "#d51f2a", initials: "TW" },
  { id: "autodoc", name: "Auto Doc Operations UK", team: "Auto Doc UK Team", region: "UK", color: "#111111", initials: "AD" },
  { id: "cashcarry", name: "Wholesale Cash & Carry", team: "Pound Wholesale Team", region: "UK", color: "#b30e19", initials: "WC" },
  { id: "central", name: "Wholesale Central USA", team: "Wholesale Central Team", region: "USA", color: "#151515", initials: "CU" }
];

const sampleItems = [
  { sku: "SUP-1001", description: "Vitamin C 1000mg - 120 tablets", qty: 4, unit: 11.95 },
  { sku: "SUP-2210", description: "Omega 3 softgels - 90 count", qty: 2, unit: 16.5 },
  { sku: "SUP-4407", description: "Magnesium complex", qty: 3, unit: 9.75 }
];

const storageKey = "mc011-invoice-editor-v1";
const state = loadState();

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  bindElements();
  normalizeState();
  seedDefaultInvoice();
  renderTemplateOptions();
  renderTemplateCards();
  renderItems();
  renderPreview();
  renderTemplateAssetPreview();
  renderClients();
  renderSavedInvoices();
  renderBulkRows();
  updateMetrics();
  bindEvents();
});

function bindElements() {
  [
    "teamAccess",
    "saveInvoice",
    "resetDemo",
    "openAutoDoc",
    "templateSelect",
    "currencySelect",
    "invoiceNumber",
    "orderDate",
    "deliveryDate",
    "poNumber",
    "billTo",
    "shipTo",
    "paymentDetails",
    "paymentMethod",
    "trackingId",
    "orderId",
    "cardType",
    "cardEnding",
    "taxRate",
    "shippingAmount",
    "singleCsvUpload",
    "singleCsvFileName",
    "testMode",
    "itemsBody",
    "invoicePreview",
    "previewTemplateName",
    "addItem",
    "printInvoice",
    "duplicateInvoice",
    "csvUpload",
    "csvFileName",
    "downloadSampleCsv",
    "bulkRows",
    "generateBulk",
    "saveClient",
    "clientName",
    "clientEmail",
    "clientTeam",
    "clientCardType",
    "clientCardEnding",
    "clientCurrency",
    "clientBillTo",
    "clientShipTo",
    "clientList",
    "savedGrid",
    "exportInvoices",
    "dashboardTemplates",
    "recentInvoices",
    "templateGrid",
    "assetTemplateSelect",
    "templateAssetUpload",
    "templateAssetName",
    "templateAssetPreview",
    "templateCount",
    "clientCount",
    "invoiceCount",
    "bulkCount"
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function bindEvents() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.view));
  });

  document.querySelectorAll("[data-jump]").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.jump));
  });

  [
    "teamAccess",
    "templateSelect",
    "currencySelect",
    "invoiceNumber",
    "orderDate",
    "deliveryDate",
    "poNumber",
    "billTo",
    "shipTo",
    "paymentDetails",
    "paymentMethod",
    "trackingId",
    "orderId",
    "cardType",
    "cardEnding",
    "taxRate",
    "shippingAmount"
  ].forEach((id) => {
    els[id].addEventListener("input", syncInvoiceFromForm);
    els[id].addEventListener("change", syncInvoiceFromForm);
  });
  els.testMode.addEventListener("change", syncInvoiceFromForm);

  els.addItem.addEventListener("click", () => {
    state.current.items.push({ sku: "", description: "", qty: 1, unit: 0 });
    renderItems();
    renderPreview();
    persist();
  });

  els.itemsBody.addEventListener("input", (event) => {
    const input = event.target.closest("input");
    if (!input) return;
    const row = input.closest("tr");
    const index = Number(row.dataset.index);
    const field = input.dataset.field;
    const value = field === "qty" || field === "unit" ? Number(input.value || 0) : input.value;
    state.current.items[index][field] = value;
    updateRowTotal(row, state.current.items[index]);
    renderPreview();
    persist();
  });

  els.itemsBody.addEventListener("click", (event) => {
    if (!event.target.matches("[data-remove-row]")) return;
    const index = Number(event.target.closest("tr").dataset.index);
    state.current.items.splice(index, 1);
    if (!state.current.items.length) state.current.items.push({ sku: "", description: "", qty: 1, unit: 0 });
    renderItems();
    renderPreview();
    persist();
  });

  els.saveInvoice.addEventListener("click", saveCurrentInvoice);
  els.openAutoDoc.addEventListener("click", openAutoDocForm);
  els.duplicateInvoice.addEventListener("click", duplicateCurrentInvoice);
  els.printInvoice.addEventListener("click", () => window.print());
  els.resetDemo.addEventListener("click", resetDemo);
  els.csvUpload.addEventListener("change", handleCsvUpload);
  els.singleCsvUpload.addEventListener("change", handleSingleCsvUpload);
  els.downloadSampleCsv.addEventListener("click", downloadSampleCsv);
  els.generateBulk.addEventListener("click", generateBulkInvoices);
  els.saveClient.addEventListener("click", saveClient);
  els.exportInvoices.addEventListener("click", exportInvoices);
  els.assetTemplateSelect.addEventListener("change", () => {
    state.current.templateId = els.assetTemplateSelect.value;
    applyCurrentToForm();
    renderPreview();
    renderTemplateAssetPreview();
    persist();
  });
  els.templateAssetUpload.addEventListener("change", handleTemplateAssetUpload);
}

function openAutoDocForm() {
  state.current.templateId = "autodoc";
  applyTemplateDefaults("autodoc");
  applyCurrentToForm();
  renderItems();
  renderPreview();
  renderTemplateAssetPreview();
  persist();
  showView("single");
}

function loadState() {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) return JSON.parse(stored);
  } catch (error) {
    console.warn("Could not load saved invoice state", error);
  }

  return {
    current: null,
    clients: [],
    invoices: [],
    bulkRows: [],
    templateAssets: {}
  };
}

function normalizeState() {
  state.clients = state.clients || [];
  state.invoices = state.invoices || [];
  state.bulkRows = state.bulkRows || [];
  state.templateAssets = state.templateAssets || {};
  if (state.current?.templateId === "gosupps") {
    state.current.testMode = false;
    if (state.gosuppsLayoutVersion !== 2) state.current = null;
  }
  state.gosuppsLayoutVersion = 2;
  if (state.autoDocDesignVersion !== 1) state.current = null;
  state.autoDocDesignVersion = 1;
}

function persist() {
  const storedState = cloneInvoice(state);
  Object.values(storedState.templateAssets || {}).forEach((asset) => {
    delete asset.dataUrl;
  });
  localStorage.setItem(storageKey, JSON.stringify(storedState));
  updateMetrics();
}

function seedDefaultInvoice(force = false) {
  if (state.current && !force) {
    applyCurrentToForm();
    return;
  }

  const today = new Date();
  const delivery = new Date(today);
  delivery.setDate(today.getDate() + 3);

  state.current = {
    templateId: "autodoc",
    currency: "GBP",
    invoiceNumber: "194579",
    orderDate: "2025-12-05",
    deliveryDate: formatDate(delivery),
    poNumber: "137794",
    billTo: "SELLIXA LTD\n85 Great Portland Street\nLondon, Westminster W1W 7LT\nUnited Kingdom",
    shipTo: "ALI HAMAZA\nFlat 1 26 Manley Road\nManchester, Greater Manchester\nM16 8HN\nUnited Kingdom",
    paymentDetails: "",
    paymentMethod: "",
    trackingId: "",
    orderId: "",
    cardType: "Visa",
    cardEnding: "4217",
    taxRate: 20,
    shippingAmount: 0,
    testMode: false,
    items: autoDocSampleItems()
  };

  applyCurrentToForm();
  persist();
}

function applyCurrentToForm() {
  const invoice = state.current;
  els.teamAccess.value = getTemplate(invoice.templateId).team;
  els.templateSelect.value = invoice.templateId;
  els.assetTemplateSelect.value = invoice.templateId;
  els.currencySelect.value = invoice.currency;
  els.invoiceNumber.value = invoice.invoiceNumber;
  els.orderDate.value = invoice.orderDate;
  els.deliveryDate.value = invoice.deliveryDate;
  els.poNumber.value = invoice.poNumber;
  els.billTo.value = invoice.billTo;
  els.shipTo.value = invoice.shipTo;
  els.paymentDetails.value = invoice.paymentDetails || "";
  els.paymentMethod.value = invoice.paymentMethod || "";
  els.trackingId.value = invoice.trackingId || "";
  els.orderId.value = invoice.orderId || "";
  els.cardType.value = invoice.cardType;
  els.cardEnding.value = invoice.cardEnding;
  els.taxRate.value = invoice.taxRate;
  els.shippingAmount.value = invoice.shippingAmount;
  els.testMode.checked = invoice.testMode !== false;
}

function syncInvoiceFromForm() {
  state.current.templateId = els.templateSelect.value;
  state.current.currency = els.currencySelect.value;
  state.current.invoiceNumber = els.invoiceNumber.value;
  state.current.orderDate = els.orderDate.value;
  state.current.deliveryDate = els.deliveryDate.value;
  state.current.poNumber = els.poNumber.value;
  state.current.billTo = els.billTo.value;
  state.current.shipTo = els.shipTo.value;
  state.current.paymentDetails = els.paymentDetails.value;
  state.current.paymentMethod = els.paymentMethod.value;
  state.current.trackingId = els.trackingId.value;
  state.current.orderId = els.orderId.value;
  state.current.cardType = els.cardType.value;
  state.current.cardEnding = els.cardEnding.value.replace(/\D/g, "").slice(0, 4);
  state.current.taxRate = Number(els.taxRate.value || 0);
  state.current.shippingAmount = Number(els.shippingAmount.value || 0);
  state.current.testMode = els.testMode.checked;

  els.cardEnding.value = state.current.cardEnding;
  els.teamAccess.value = getTemplate(state.current.templateId).team;
  els.assetTemplateSelect.value = state.current.templateId;
  renderPreview();
  renderTemplateAssetPreview();
  persist();
}

function renderTemplateOptions() {
  const options = templates
    .map((template) => `<option value="${template.id}">${escapeHtml(template.name)}</option>`)
    .join("");
  els.templateSelect.innerHTML = options;
  els.assetTemplateSelect.innerHTML = options;
  els.templateSelect.value = state.current.templateId;
  els.assetTemplateSelect.value = state.current.templateId;
}

function renderTemplateCards() {
  els.dashboardTemplates.innerHTML = templates
    .slice(0, 6)
    .map(
      (template) => `
        <div class="template-pill">
          <div>
            <strong>${escapeHtml(template.name)}</strong>
            <span>${escapeHtml(template.team)}</span>
          </div>
          <span>${escapeHtml(template.region)}</span>
        </div>
      `
    )
    .join("");

  els.templateGrid.innerHTML = templates
    .map(
      (template) => `
        <article class="template-card" style="--card-color: ${template.color}">
          <strong>${escapeHtml(template.name)}</strong>
          <span>${escapeHtml(template.region)} / ${escapeHtml(template.team)}</span>
          <p class="panel-copy">${state.templateAssets[template.id] ? "Official reference uploaded for this slot." : "Authorized editable invoice layout slot with matching data fields, currency and bulk upload support."}</p>
          <button class="btn ghost" data-template-id="${template.id}" type="button">Open template</button>
        </article>
      `
    )
    .join("");

  els.templateGrid.querySelectorAll("[data-template-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.current.templateId = button.dataset.templateId;
      applyTemplateDefaults(button.dataset.templateId);
      applyCurrentToForm();
      renderPreview();
      renderTemplateAssetPreview();
      persist();
      showView("single");
    });
  });
}

function applyTemplateDefaults(templateId) {
  if (templateId === "gosupps") {
    const today = new Date();
    const due = new Date(today);
    due.setDate(today.getDate() + 2);
    state.current.currency = "$";
    state.current.invoiceNumber = `GS-${today.getFullYear()}-${String(Date.now()).slice(-6)}`;
    state.current.orderDate = formatDate(today);
    state.current.deliveryDate = formatDate(due);
    state.current.poNumber = "PO-1001";
    state.current.billTo = "";
    state.current.shipTo = "";
    state.current.paymentDetails = "";
    state.current.paymentMethod = "";
    state.current.trackingId = "";
    state.current.orderId = "";
    state.current.cardType = "Visa";
    state.current.cardEnding = "";
    state.current.taxRate = 0;
    state.current.shippingAmount = 0;
    state.current.testMode = false;
    state.current.items = [{ sku: "", description: "", qty: 1, unit: 0 }];
    return;
  }
  if (templateId !== "autodoc") return;
  state.current.currency = "GBP";
  state.current.invoiceNumber = "194579";
  state.current.orderDate = "2025-12-05";
  state.current.deliveryDate = "2025-12-05";
  state.current.poNumber = "137794";
  state.current.billTo = "SELLIXA LTD\n85 Great Portland Street\nLondon, Westminster W1W 7LT\nUnited Kingdom";
  state.current.shipTo = "ALI HAMAZA\nFlat 1 26 Manley Road\nManchester, Greater Manchester\nM16 8HN\nUnited Kingdom";
  state.current.cardType = "Visa";
  state.current.cardEnding = "4217";
  state.current.taxRate = 20;
  state.current.shippingAmount = 0;
  state.current.testMode = false;
  state.current.items = autoDocSampleItems();
}

function autoDocSampleItems() {
  return [
    { sku: "1", description: "Briggs & Stratton SAE 30 4-Stroke Engine Oil (100008E) - 0.6L", qty: 15, unit: 5.5 },
    { sku: "2", description: "Briggs & Stratton SAE 30 4-Stroke Engine Oil (100008E) - 0.5L", qty: 15, unit: 4.85 },
    { sku: "3", description: "Briggs & Stratton SAE 30 4-Stroke Engine Oil (100008E) - 1L", qty: 15, unit: 6.9 },
    { sku: "4", description: "Briggs & Stratton SAE 30 4-Stroke Engine Oil (100008E) - 1.4L", qty: 15, unit: 8.2 },
    { sku: "5", description: "Briggs & Stratton SAE 30 4-Stroke Engine Oil (100008E) - 2L", qty: 15, unit: 9.35 }
  ];
}

function renderItems() {
  els.itemsBody.innerHTML = "";
  state.current.items.forEach((item, index) => {
    const template = document.getElementById("itemRowTemplate");
    const row = template.content.firstElementChild.cloneNode(true);
    row.dataset.index = index;
    row.querySelector('[data-field="sku"]').value = item.sku;
    row.querySelector('[data-field="description"]').value = item.description;
    row.querySelector('[data-field="qty"]').value = item.qty;
    row.querySelector('[data-field="unit"]').value = item.unit;
    updateRowTotal(row, item);
    els.itemsBody.appendChild(row);
  });
}

function handleTemplateAssetUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const templateId = els.assetTemplateSelect.value;
  const reader = new FileReader();
  reader.onload = () => {
    state.templateAssets[templateId] = {
      name: file.name,
      type: file.type || "application/octet-stream",
      dataUrl: String(reader.result || ""),
      uploadedAt: new Date().toISOString()
    };
    state.current.templateId = templateId;
    els.templateAssetName.textContent = file.name;
    applyCurrentToForm();
    renderTemplateAssetPreview();
    renderTemplateCards();
    renderPreview();
    persist();
  };
  reader.readAsDataURL(file);
}

function renderTemplateAssetPreview() {
  const asset = state.templateAssets[state.current.templateId];
  if (!asset) {
    els.templateAssetPreview.classList.remove("is-visible");
    els.templateAssetPreview.innerHTML = "";
    els.templateAssetName.textContent = "No reference file selected";
    return;
  }

  els.templateAssetName.textContent = asset.name;
  els.templateAssetPreview.classList.add("is-visible");
  if (!asset.dataUrl) {
    els.templateAssetPreview.innerHTML = `
      <strong>Locked official reference: ${escapeHtml(asset.name)}</strong>
      <div class="empty-state">Reference file name is saved. Reupload the PDF or image in this browser session to preview it here.</div>
    `;
    return;
  }
  const isImage = asset.type.startsWith("image/");
  els.templateAssetPreview.innerHTML = `
    <strong>Locked official reference: ${escapeHtml(asset.name)}</strong>
    ${
      isImage
        ? `<img class="template-asset-image" alt="Official template reference" src="${asset.dataUrl}" />`
        : `<iframe class="template-asset-frame" title="Official template reference" src="${asset.dataUrl}"></iframe>`
    }
  `;
}

function updateRowTotal(row, item) {
  row.querySelector(".row-total").textContent = money(rowTotal(item), state.current.currency);
}

function renderPreview() {
  const invoice = state.current;
  const template = getTemplate(invoice.templateId);
  const totals = calculateTotals(invoice);
  const isPound = template.id === "pound";
  const isAutoDoc = template.id === "autodoc";
  const isGoSupps = template.id === "gosupps";
  const testMode = invoice.testMode !== false;
  els.previewTemplateName.textContent = template.name;
  els.invoicePreview.style.setProperty("--preview-color", template.color);

  if (isAutoDoc) {
    els.invoicePreview.innerHTML = renderAutoDocPreview(invoice, totals);
    return;
  }

  if (isGoSupps) {
    els.invoicePreview.innerHTML = renderGoSuppsPreview(invoice, totals);
    return;
  }

  if (isPound) {
    els.invoicePreview.innerHTML = renderPoundPreview(invoice, totals, testMode);
    return;
  }

  els.invoicePreview.innerHTML = `
    <div class="invoice-doc ${isPound ? "pound-invoice" : ""} ${testMode ? "test-template-doc" : ""}">
      ${testMode ? `<div class="test-watermark">TEST TEMPLATE</div>` : ""}
      <header class="invoice-doc-header">
        <div>
          <div class="invoice-logo">${escapeHtml(template.initials)}</div>
          <h3>${escapeHtml(template.name)}</h3>
          <p>${isPound ? "Official portal-generated invoice form" : "Authorized client invoice"}</p>
          ${isPound ? `<small>Pound Wholesale team editable invoice website${testMode ? " - testing only" : ""}</small>` : ""}
        </div>
        <div class="invoice-meta">
          <div><strong>Invoice</strong><span>${escapeHtml(invoice.invoiceNumber)}</span></div>
          <div><strong>Order</strong><span>${escapeHtml(invoice.orderDate)}</span></div>
          <div><strong>Delivery</strong><span>${escapeHtml(invoice.deliveryDate)}</span></div>
          <div><strong>PO</strong><span>${escapeHtml(invoice.poNumber)}</span></div>
        </div>
      </header>

      ${
        isPound
          ? `<div class="portal-stamp">${testMode ? "Test template - not a tax invoice" : "Generated from MC011 Pound Wholesale Website"}</div>
             <section class="supplier-strip">
               <div>
                 <strong>Supplier</strong>
                 <span>Pound Wholesale UK</span>
               </div>
               <div>
                 <strong>Department</strong>
                 <span>Trade invoice desk</span>
               </div>
               <div>
                 <strong>Currency</strong>
                 <span>${escapeHtml(invoice.currency === "GBP" ? "GBP" : invoice.currency)}</span>
               </div>
             </section>`
          : ""
      }

      <section class="invoice-addresses">
        <div class="invoice-box">
          <h4>Bill To</h4>
          <p>${escapeHtml(invoice.billTo)}</p>
        </div>
        <div class="invoice-box">
          <h4>Ship To</h4>
          <p>${escapeHtml(invoice.shipTo)}</p>
        </div>
      </section>

      <table class="doc-table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items
            .map(
              (item) => `
                <tr>
                  <td>${escapeHtml(item.sku)}</td>
                  <td>${escapeHtml(item.description)}</td>
                  <td>${Number(item.qty || 0)}</td>
                  <td>${money(Number(item.unit || 0), invoice.currency)}</td>
                  <td>${money(rowTotal(item), invoice.currency)}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>

      <section class="invoice-totals">
        <div><span>Subtotal</span><strong>${money(totals.subtotal, invoice.currency)}</strong></div>
        <div><span>Tax / VAT (${Number(invoice.taxRate || 0)}%)</span><strong>${money(totals.tax, invoice.currency)}</strong></div>
        <div><span>Shipping</span><strong>${money(totals.shipping, invoice.currency)}</strong></div>
        <div class="grand"><span>Total</span><strong>${money(totals.total, invoice.currency)}</strong></div>
      </section>

      <p class="payment-note">
        Paid by ${escapeHtml(invoice.cardType)} ending ${escapeHtml(invoice.cardEnding || "0000")}.
        ${testMode ? "Testing template only. Not a tax invoice, receipt, or proof of purchase." : isPound ? "This is an editable website-generated invoice form for internal/client portal use." : "Generated in MC011 Invoice Website for authorized client use."}
      </p>
    </div>
  `;
}

function renderGoSuppsPreview(invoice, totals) {
  const payment = String(invoice.paymentMethod || "");
  const tracking = String(invoice.trackingId || "");
  const order = String(invoice.orderId || "");
  const auditId = `GS-${String(invoice.invoiceNumber || "DRAFT").replace(/[^A-Za-z0-9-]/g, "").slice(0, 30)}`;

  return `
    <div class="invoice-doc gosupps-invoice">
      <header class="gosupps-header">
        <img src="/assets/gosupps-invoice-header.png" alt="Invoice - Go Supps" />
      </header>

      <section class="gosupps-intro">
        <div class="gosupps-from">
          <h4>FROM</h4>
          <p>Website: gosupps.com<br>Sales ID: 1063<br>E-mail: Hi@GoSupps.com<br>Contact: (248) 502-5628<br>Address: 755 Rainbow Rd, Windsor, CT 06095, United States</p>
        </div>
        <div class="gosupps-meta">
          <div><span>INVOICE #</span><strong>${escapeHtml(invoice.invoiceNumber)}</strong></div>
          <div><span>INVOICE DATE</span><strong>${formatDisplayDate(invoice.orderDate)}</strong></div>
          <div><span>P.O.#</span><strong>${escapeHtml(invoice.poNumber)}</strong></div>
          <div><span>DUE DATE</span><strong>${formatDisplayDate(invoice.deliveryDate)}</strong></div>
        </div>
      </section>

      <section class="gosupps-addresses">
        <div><h4>BILL TO</h4><p>${escapeHtml(invoice.billTo) || "&nbsp;"}</p></div>
        <div><h4>SHIP TO</h4><p>${escapeHtml(invoice.shipTo) || "&nbsp;"}</p></div>
      </section>

      <table class="gosupps-table">
        <thead><tr><th>QTY</th><th>DESCRIPTION</th><th>UNIT PRICE</th><th>AMOUNT</th></tr></thead>
        <tbody>${invoice.items.map((item) => `<tr><td>${Number(item.qty || 0)}</td><td>${escapeHtml(item.description)}</td><td>${money(Number(item.unit || 0), invoice.currency)}</td><td>${money(rowTotal(item), invoice.currency)}</td></tr>`).join("")}</tbody>
      </table>

      <section class="gosupps-totals">
        <div><span>SUBTOTAL:</span><strong>${money(totals.subtotal, invoice.currency)}</strong></div>
        <div><span>SHIPPING &amp; HANDLING:</span><strong>${money(totals.shipping, invoice.currency)}</strong></div>
        <div><span>TAX:</span><strong>${money(totals.tax, invoice.currency)}</strong></div>
        <div><span>GRAND TOTAL:</span><strong>${money(totals.total, invoice.currency)}</strong></div>
      </section>

      <footer class="gosupps-footer">
        <h4>THANKS FOR THE PURCHASE !</h4>
        <p>Payment Methods : ${escapeHtml(payment)}<br>Tracking ID : ${escapeHtml(tracking)}<br>Order ID : ${escapeHtml(order)}</p>
        <small>System generated invoice - Document ID ${escapeHtml(auditId)}</small>
      </footer>
    </div>`;
}

function renderPoundPreview(invoice, totals, testMode) {
  const shippingText = Number(invoice.shippingAmount || 0) === 0
    ? "Up to 72 Hours Delivery Mon-Fri - Economy Shipping"
    : "Standard tracked trade delivery";

  return `
    <div class="invoice-doc pound-sales-order">
      <header class="pound-header">
        <div class="pound-brand">
          <img class="pound-logo-image" src="/assets/pound-wholesale-logo.png" alt="Pound Wholesale - Importers, Exporters, Distributors" />
        </div>
        <div class="pound-company">
          <p>www.poundwholesale.co.uk</p>
          <p>Unit 10, Suite 2<br>Whalley Range Business Park<br>Blackburn, Lancashire<br>BB1 6DG</p>
          <p>Tel: 01254 790233<br>info@poundwholesale.co.uk</p>
          <p>Pound Plus Distribution Ltd<br>Company No: 07599756<br>VAT Number: GB 156 8515 84<br>EORI Number: GB156851584000</p>
          <h2>Sales Order</h2>
        </div>
      </header>

      <section class="pound-order-strip">
        <div>Account ID # <strong>${escapeHtml(invoice.poNumber || "285184")}</strong></div>
        <div>Order Date: <strong>${escapeHtml(invoice.orderDate)}</strong></div>
        <div>Sales Order # <strong>${escapeHtml(invoice.invoiceNumber)}</strong></div>
      </section>

      <section class="pound-two-column pound-address-block">
        <div><h4>Bill to:</h4><p>${escapeHtml(invoice.billTo)}</p></div>
        <div><h4>Ship to:</h4><p>${escapeHtml(invoice.shipTo)}</p></div>
      </section>

      <section class="pound-two-column pound-service-block">
        <div>
          <h4>Payment Details:</h4>
          <p>${escapeHtml(invoice.paymentDetails || `Credit / Debit Card\nCredit Card Type: ${invoice.cardType}\nCredit Card Number: xxxx-${invoice.cardEnding || "0000"}`)}</p>
        </div>
        <div>
          <h4>Shipping Method:</h4>
          <p>${shippingText}<br><br>(Total Shipping Charges ${money(totals.shipping, invoice.currency)})</p>
        </div>
      </section>

      <table class="pound-products">
        <thead><tr><th>SKU</th><th>Products</th><th>Qty</th><th>Price</th><th>Tax</th><th>Subtotal</th></tr></thead>
        <tbody>
          ${invoice.items.map((item) => {
            const subtotal = rowTotal(item);
            const tax = subtotal * (Number(invoice.taxRate || 0) / 100);
            return `<tr>
              <td>${escapeHtml(item.sku)}</td><td>${escapeHtml(item.description)}</td>
              <td>${Number(item.qty || 0)}</td><td>${money(Number(item.unit || 0), invoice.currency)}</td>
              <td>${money(tax, invoice.currency)}</td><td>${money(subtotal, invoice.currency)}</td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>

      <section class="pound-totals">
        <div><span>SUBTOTAL:</span><strong>${money(totals.subtotal, invoice.currency)}</strong></div>
        <div><span>SHIPPING &amp; HANDLING:</span><strong>${money(totals.shipping, invoice.currency)}</strong></div>
        <div><span>TAX:</span><strong>${money(totals.tax, invoice.currency)}</strong></div>
        <div><span>GRAND TOTAL:</span><strong>${money(totals.total, invoice.currency)}</strong></div>
      </section>
    </div>`;
}

function renderAutoDocPreview(invoice, totals) {
  const autoMoney = (value) => money(value, invoice.currency);
  return `
    <div class="invoice-doc autodoc-invoice">
      <header class="autodoc-header">
        <div class="autodoc-logo" aria-label="Auto Doc"><span class="autodoc-plus"><i></i><b></b></span><strong>AUTODOC</strong></div>
        <address class="autodoc-company"><b>Autodoc Operations UK<br>Limited</b>Tel:+44 203 885 3401<br>Suite 1, 7th Floor, 50 Broadway<br>London, SW1H 0DB<br>United Kingdom</address>
        <h2>INVOICE</h2>
      </header>
      <section class="autodoc-meta">
        <div><span>Invoice#</span><strong>: ${escapeHtml(invoice.invoiceNumber)}</strong></div>
        <div><span>Invoice Date</span><strong>: ${formatAutoDocDate(invoice.orderDate)}</strong></div>
        <div><span>Order No.</span><strong>: ${escapeHtml(invoice.poNumber)}</strong></div>
      </section>
      <section class="autodoc-addresses">
        <div><h4>Bill To:</h4><p>${escapeHtml(invoice.billTo)}</p></div>
        <div><h4>Ship To:</h4><p>${escapeHtml(invoice.shipTo)}</p></div>
      </section>
      <table class="autodoc-table">
        <thead><tr><th>#</th><th>Item Description</th><th>Qty</th><th>Price</th><th>VAT</th><th>Amount</th></tr></thead>
        <tbody>${invoice.items.map((item, index) => {
          const amount = rowTotal(item);
          const vat = amount * (Number(invoice.taxRate || 0) / 100);
          return `<tr><td>${escapeHtml(item.sku || index + 1)}</td><td>${escapeHtml(item.description)}</td><td>${Number(item.qty || 0)}</td><td>${Number(item.unit || 0).toFixed(2)}</td><td>${vat.toFixed(2)}</td><td>${amount.toFixed(2)}</td></tr>`;
        }).join("")}</tbody>
      </table>
      <section class="autodoc-footer-grid">
        <div class="autodoc-notes"><h4>Bank Information</h4><p>${escapeHtml(invoice.cardType)} card ending in ${escapeHtml(invoice.cardEnding || "0000")}</p><h4>Terms &amp; Conditions</h4><p>The seller acknowledges and permits the buyer to resell the purchased goods in any manner deemed suitable by the buyer.</p></div>
        <div class="autodoc-totals"><div><span>Sub Total</span><strong>${autoMoney(totals.subtotal)}</strong></div><div><span>VAT (${Number(invoice.taxRate || 0)}%)</span><strong>${autoMoney(totals.tax)}</strong></div><div class="autodoc-grand"><span>TOTAL PAID</span><strong>${autoMoney(totals.total)}</strong></div></div>
      </section>
    </div>`;
}

function formatAutoDocDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return escapeHtml(value);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, "-");
}

function renderVetUkPreview(invoice, totals, testMode) {
  const vetMoney = (value) => money(value, invoice.currency).replace(/^£/, "£ ");
  return `
    <div class="invoice-doc vetuk-invoice">
      <div class="vetuk-top-rule"></div>
      <header class="vetuk-header">
        <div class="vetuk-brand-block">
          <div class="vetuk-logo">
            <img src="/assets/vetuk-logo-reference.png" alt="VetUK - Pet Care Delivered" />
          </div>
          <address>
            <b>VetUK Ltd</b>
            Spitfire House, Aviator<br />
            Court York<br />
            YO30 4UZ<br />
            United Kingdom<br />
            Phone: +44 01845 591 040
          </address>
        </div>
        <div class="vetuk-meta">
          <h3>INVOICE</h3>
          <div><span>Invoice#:</span><strong>${escapeHtml(invoice.invoiceNumber)}</strong></div>
          <div><span>Order Date:</span><strong>${formatDisplayDate(invoice.orderDate)}</strong></div>
          <div><span>Ship Date:</span><strong>${formatDisplayDate(invoice.deliveryDate)}</strong></div>
          <div><span>Order No:</span><strong>${escapeHtml(invoice.poNumber)}</strong></div>
        </div>
      </header>

      <section class="vetuk-billto">
        <h4>Bill To</h4>
        <p>${escapeHtml(invoice.billTo)}</p>
      </section>

      <table class="vetuk-table">
        <thead>
          <tr>
            <th>Item Description</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>VAT</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items
            .map(
              (item) => `
                <tr>
                  <td>${escapeHtml(item.description)}</td>
                  <td>${Number(item.qty || 0)}</td>
                  <td>${money(Number(item.unit || 0), invoice.currency)}</td>
                  <td>${Number(invoice.taxRate || 0)}%</td>
                  <td>${money(rowTotal(item), invoice.currency)}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>

      <section class="vetuk-lower">
        <div class="vetuk-notes">
          <h4>Notes</h4>
          <p>Bank Details</p>
          <p>${escapeHtml(invoice.cardType)} card ending in ${escapeHtml(invoice.cardEnding || "0000")}</p>
        </div>
        <div class="vetuk-totals">
          <div><span>Item Total:</span><strong>${vetMoney(totals.total)}</strong></div>
          <div><span>Shipping charges:</span><strong>${vetMoney(totals.shipping)}</strong></div>
          <div><span>VAT:</span><strong>${vetMoney(totals.tax)}</strong></div>
          <div class="vetuk-grand"><span>Total:</span><strong>${vetMoney(totals.total)}</strong></div>
        </div>
      </section>

      <section class="vetuk-terms">
        <h4>Terms & Conditions</h4>
        <p>The Reseller is authorized to market and sell the Company's products but shall not represent themselves as the Company's legal partner agent or employee.</p>
      </section>

    </div>
  `;
}

function saveCurrentInvoice() {
  const invoice = cloneInvoice(state.current);
  invoice.id = invoice.id || `inv-${Date.now()}`;
  invoice.savedAt = new Date().toISOString();
  const existingIndex = state.invoices.findIndex((item) => item.invoiceNumber === invoice.invoiceNumber);
  if (existingIndex >= 0) {
    state.invoices[existingIndex] = invoice;
  } else {
    state.invoices.unshift(invoice);
  }
  persist();
  renderSavedInvoices();
  showView("saved");
}

function duplicateCurrentInvoice() {
  const copy = cloneInvoice(state.current);
  copy.invoiceNumber = `${copy.invoiceNumber}-COPY`;
  state.current = copy;
  applyCurrentToForm();
  renderItems();
  renderPreview();
  renderTemplateAssetPreview();
  persist();
}

function resetDemo() {
  state.clients = [];
  state.invoices = [];
  state.bulkRows = [];
  state.templateAssets = {};
  seedDefaultInvoice(true);
  renderItems();
  renderPreview();
  renderTemplateAssetPreview();
  renderClients();
  renderSavedInvoices();
  renderBulkRows();
  renderTemplateCards();
  persist();
}

function saveClient() {
  const client = {
    id: `client-${Date.now()}`,
    name: els.clientName.value || "Unnamed Client",
    email: els.clientEmail.value,
    team: els.clientTeam.value,
    cardType: els.clientCardType.value,
    cardEnding: els.clientCardEnding.value.replace(/\D/g, "").slice(0, 4),
    currency: els.clientCurrency.value,
    billTo: els.clientBillTo.value,
    shipTo: els.clientShipTo.value
  };

  state.clients.unshift(client);
  clearClientForm();
  renderClients();
  persist();
}

function clearClientForm() {
  ["clientName", "clientEmail", "clientCardEnding", "clientBillTo", "clientShipTo"].forEach((id) => {
    els[id].value = "";
  });
}

function renderClients() {
  if (!state.clients.length) {
    els.clientList.innerHTML = `<div class="empty-state">No saved clients yet. Add bill-to, ship-to and card ending details here.</div>`;
    return;
  }

  els.clientList.innerHTML = state.clients
    .map(
      (client) => `
        <article class="client-card">
          <strong>${escapeHtml(client.name)}</strong>
          <span>${escapeHtml(client.team)} / ${escapeHtml(client.email || "No email")}</span>
          <p class="panel-copy">${escapeHtml(client.cardType)} ending ${escapeHtml(client.cardEnding || "0000")}</p>
          <button class="btn ghost" data-load-client="${client.id}" type="button">Use in editor</button>
        </article>
      `
    )
    .join("");

  els.clientList.querySelectorAll("[data-load-client]").forEach((button) => {
    button.addEventListener("click", () => {
      const client = state.clients.find((item) => item.id === button.dataset.loadClient);
      if (!client) return;
      state.current.billTo = client.billTo;
      state.current.shipTo = client.shipTo;
      state.current.cardType = client.cardType;
      state.current.cardEnding = client.cardEnding;
      state.current.currency = client.currency;
      applyCurrentToForm();
      renderPreview();
      renderTemplateAssetPreview();
      persist();
      showView("single");
    });
  });
}

function renderSavedInvoices() {
  const recent = state.invoices.slice(0, 4);
  els.recentInvoices.innerHTML = recent.length
    ? recent
        .map(
          (invoice) => `
            <div class="recent-item">
              <strong>${escapeHtml(invoice.invoiceNumber)}</strong>
              <span>${escapeHtml(getTemplate(invoice.templateId).name)} / ${money(calculateTotals(invoice).total, invoice.currency)}</span>
            </div>
          `
        )
        .join("")
    : `<div class="empty-state">Saved invoices will appear here after you create one.</div>`;

  els.savedGrid.innerHTML = state.invoices.length
    ? state.invoices
        .map(
          (invoice) => `
            <article class="saved-card">
              <strong>${escapeHtml(invoice.invoiceNumber)}</strong>
              <span>${escapeHtml(getTemplate(invoice.templateId).name)}</span>
              <p class="panel-copy">${money(calculateTotals(invoice).total, invoice.currency)} saved ${formatDateTime(invoice.savedAt)}</p>
              <button class="btn ghost" data-load-invoice="${invoice.id}" type="button">Open</button>
            </article>
          `
        )
        .join("")
    : `<div class="empty-state">No saved invoices yet. Use the editor and press Save Invoice.</div>`;

  els.savedGrid.querySelectorAll("[data-load-invoice]").forEach((button) => {
    button.addEventListener("click", () => {
      const invoice = state.invoices.find((item) => item.id === button.dataset.loadInvoice);
      if (!invoice) return;
      state.current = cloneInvoice(invoice);
      applyCurrentToForm();
      renderItems();
      renderPreview();
      renderTemplateAssetPreview();
      persist();
      showView("single");
    });
  });
}

function handleCsvUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  els.csvFileName.textContent = file.name;
  const reader = new FileReader();
  reader.onload = () => {
    state.bulkRows = parseCsv(String(reader.result || ""));
    renderBulkRows();
    persist();
  };
  reader.readAsText(file);
}

function handleSingleCsvUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  els.singleCsvFileName.textContent = file.name;
  const reader = new FileReader();
  reader.onload = () => {
    const rows = parseCsv(String(reader.result || ""));
    if (!rows.length) {
      els.singleCsvFileName.textContent = "CSV has no product rows";
      return;
    }
    state.current.items = rows.map((row) => ({
      sku: row.sku || row.SKU || "",
      description: row.description || row.product || row.products || row.Description || "",
      qty: Number(row.qty || row.quantity || row.Qty || 1),
      unit: Number(row.unit || row.price || row.Price || 0)
    }));
    renderItems();
    renderPreview();
    persist();
    els.singleCsvFileName.textContent = `${file.name} - ${rows.length} products loaded`;
  };
  reader.readAsText(file);
}

function renderBulkRows() {
  if (!state.bulkRows.length) {
    els.bulkRows.innerHTML = `<tr><td colspan="5">Upload a CSV file to preview product rows.</td></tr>`;
    updateMetrics();
    return;
  }

  els.bulkRows.innerHTML = state.bulkRows
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.sku || "")}</td>
          <td>${escapeHtml(row.description || "")}</td>
          <td>${escapeHtml(row.qty || "")}</td>
          <td>${escapeHtml(row.unit || "")}</td>
          <td>${escapeHtml(row.client || "")}</td>
        </tr>
      `
    )
    .join("");
  updateMetrics();
}

function generateBulkInvoices() {
  if (!state.bulkRows.length) return;
  const groups = new Map();
  state.bulkRows.forEach((row, index) => {
    const key = row.invoiceNumber || row.invoice || `BULK-${index + 1}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  });

  groups.forEach((rows, invoiceNumber) => {
    const invoice = cloneInvoice(state.current);
    invoice.id = `bulk-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    invoice.invoiceNumber = invoiceNumber;
    invoice.billTo = rows[0].client || invoice.billTo;
    invoice.items = rows.map((row) => ({
      sku: row.sku || "",
      description: row.description || "",
      qty: Number(row.qty || 1),
      unit: Number(row.unit || 0)
    }));
    invoice.savedAt = new Date().toISOString();
    state.invoices.unshift(invoice);
  });

  renderSavedInvoices();
  persist();
  showView("saved");
}

function downloadSampleCsv() {
  const csv = [
    "sku,description,qty,unit,client,invoiceNumber",
    "SUP-1001,Vitamin C 1000mg,4,11.95,Health Buyer UK,MC011-BULK-001",
    "SUP-2210,Omega 3 softgels,2,16.50,Health Buyer UK,MC011-BULK-001",
    "EL-8840,Wireless keyboard,3,21.99,Electronics Client,MC011-BULK-002"
  ].join("\n");
  downloadText("mc011-sample-products.csv", csv, "text/csv");
}

function exportInvoices() {
  downloadText("mc011-saved-invoices.json", JSON.stringify(state.invoices, null, 2), "application/json");
}

function parseCsv(text) {
  const rows = [];
  const lines = text.replace(/\r/g, "").split("\n").filter(Boolean);
  if (!lines.length) return rows;
  const headers = splitCsvLine(lines.shift()).map((header) => header.trim());

  lines.forEach((line) => {
    const values = splitCsvLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ? values[index].trim() : "";
    });
    rows.push(row);
  });

  return rows;
}

function splitCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];
    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function updateMetrics() {
  if (!els.templateCount) return;
  els.templateCount.textContent = String(templates.length);
  els.clientCount.textContent = String(state.clients.length);
  els.invoiceCount.textContent = String(state.invoices.length);
  els.bulkCount.textContent = String(state.bulkRows.length);
}

function showView(id) {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("is-visible", view.id === id);
  });
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === id);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function calculateTotals(invoice) {
  const subtotal = invoice.items.reduce((sum, item) => sum + rowTotal(item), 0);
  const tax = subtotal * (Number(invoice.taxRate || 0) / 100);
  const shipping = Number(invoice.shippingAmount || 0);
  return {
    subtotal,
    tax,
    shipping,
    total: subtotal + tax + shipping
  };
}

function rowTotal(item) {
  return Number(item.qty || 0) * Number(item.unit || 0);
}

function money(value, currency) {
  const symbol = currencySymbol(currency);
  return `${symbol}${Number(value || 0).toFixed(2)}`;
}

function currencySymbol(currency) {
  if (currency === "GBP") return "\u00a3";
  if (currency === "EUR") return "\u20ac";
  return "$";
}

function getTemplate(id) {
  return templates.find((template) => template.id === id) || templates[0];
}

function cloneInvoice(invoice) {
  return JSON.parse(JSON.stringify(invoice));
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function formatDateTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function formatDisplayDate(value) {
  if (!value) return "";
  const [year, month, day] = String(value).split("-");
  if (!year || !month || !day) return escapeHtml(value);
  return `${day}/${month}/${year}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function downloadText(filename, text, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
