const templates = [
  { id: "pound", name: "Pound Wholesale UK", team: "Pound Wholesale Team", region: "UK", color: "#29345f", initials: "PW" },
  { id: "zoro", name: "Zoro USA", team: "Zoro Team", region: "USA", color: "#1f1f1f", initials: "ZU" },
  { id: "gosupps", name: "GO SUPPS.COM", team: "Go Supps Team", region: "USA/EU", color: "#c31421", initials: "GS" },
  { id: "supplements", name: "Supplements UK USA EU", team: "Go Supps Team", region: "Multi-region", color: "#a4111b", initials: "SU" },
  { id: "electronics", name: "Electronics Supplier", team: "Wholesale Central Team", region: "Global", color: "#111111", initials: "EL" },
  { id: "tw", name: "T W Wholesale & Superstore", team: "Pound Wholesale Team", region: "UK", color: "#d51f2a", initials: "TW" },
  { id: "vetuk", name: "VET UK Petcare", team: "Vet UK Team", region: "UK", color: "#111111", initials: "VU" },
  { id: "cashcarry", name: "Wholesale Cash & Carry", team: "Pound Wholesale Team", region: "UK", color: "#b30e19", initials: "WC" },
  { id: "central", name: "Wholesale Central USA", team: "Wholesale Central Team", region: "USA", color: "#151515", initials: "CU" }
];

const sampleItems = [
  { sku: "SUP-1001", product: "Vitamin C", description: "Vitamin C 1000mg - 120 tablets", qty: 4, unit: 11.95 },
  { sku: "SUP-2210", product: "Omega 3", description: "Omega 3 softgels - 90 count", qty: 2, unit: 16.5 },
  { sku: "SUP-4407", product: "Magnesium", description: "Magnesium complex", qty: 3, unit: 9.75 }
];

const storageKey = "mc011-invoice-editor-v1";
const state = loadState();

const els = {};
const staticPrefix = location.hostname === "127.0.0.1" || location.hostname === "localhost" ? "/public" : "";
const builderStages = { single: "client", bulk: "client" };

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
    "openVetUk",
    "backToWebsite",
    "workspaceTitle",
    "singleClientStage",
    "singleTemplateStage",
    "invoiceClientSelect",
    "singleTemplateGrid",
    "templateSelect",
    "currencySelect",
    "invoiceNumber",
    "orderDate",
    "deliveryDate",
    "poNumber",
    "caseNumber",
    "invoiceClientName",
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
    "downloadInvoice",
    "printInvoice",
    "duplicateInvoice",
    "csvUpload",
    "csvFileName",
    "downloadSampleCsv",
    "bulkClientStage",
    "bulkClientSelect",
    "bulkTemplateSelect",
    "bulkTemplateStage",
    "bulkTemplateGrid",
    "bulkRows",
    "generateBulk",
    "newClient",
    "clientForm",
    "clientSavedPanel",
    "cancelClient",
    "saveClient",
    "clientName",
    "clientEmail",
    "clientCaseNumber",
    "clientTeam",
    "clientCardType",
    "clientCardEnding",
    "clientCardExpiry",
    "clientCurrency",
    "billToName",
    "billToCompany",
    "billToStreet",
    "billToCity",
    "billToState",
    "billToPostal",
    "billToCountry",
    "billToPhone",
    "shipToName",
    "shipToCompany",
    "shipToStreet",
    "shipToCity",
    "shipToState",
    "shipToPostal",
    "shipToCountry",
    "shipToPhone",
    "clientList",
    "savedGrid",
    "exportInvoices",
    "dashboardTemplates",
    "dashboardClientRows",
    "dashboardClientSearch",
    "dashboardAddClient",
    "recentInvoices",
    "templateGrid",
    "assetTemplateSelect",
    "templateAssetUpload",
    "templateAssetName",
    "templateAssetPreview",
    "templateCount",
    "clientCount",
    "invoiceCount",
    "bulkCount",
    "analyticsClientCount",
    "analyticsInvoiceCount",
    "analyticsInvoiceGenerated",
    "analyticsBulkCount",
    "analyticsTemplateCount",
    "analyticsRevenueTotal",
    "analyticsRevenueTrend",
    "analyticsTemplatePie",
    "analyticsTemplateLegend"
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function bindEvents() {
  document.querySelectorAll("[data-open-tool]").forEach((button) => {
    button.addEventListener("click", () => openToolPage("dashboard"));
  });

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.view));
  });

  document.querySelectorAll("[data-jump]").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.jump));
  });

  els.dashboardClientSearch?.addEventListener("input", () => renderDashboardClients());
  els.dashboardAddClient?.addEventListener("click", () => {
    showView("clients");
    showClientForm(true);
  });

  [
    "teamAccess",
    "templateSelect",
    "currencySelect",
    "invoiceNumber",
    "orderDate",
    "deliveryDate",
    "poNumber",
    "caseNumber",
    "invoiceClientName",
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
  els.invoiceClientSelect.addEventListener("change", () => {
    handleBuilderClientSelect(els.invoiceClientSelect.value, "single");
  });
  els.bulkClientSelect.addEventListener("change", () => {
    handleBuilderClientSelect(els.bulkClientSelect.value, "bulk");
  });
  els.bulkTemplateSelect.addEventListener("change", () => {
    chooseBuilderTemplate("bulk", els.bulkTemplateSelect.value);
  });

  els.singleTemplateGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-single-template-id]");
    if (!button) return;
    chooseBuilderTemplate("single", button.dataset.singleTemplateId);
  });

  els.bulkTemplateGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-bulk-template-id]");
    if (!button) return;
    chooseBuilderTemplate("bulk", button.dataset.bulkTemplateId);
  });

  els.addItem.addEventListener("click", () => {
    state.current.items.push({ sku: "", product: "", description: "", qty: 1, unit: 0 });
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
    if (!state.current.items.length) state.current.items.push({ sku: "", product: "", description: "", qty: 1, unit: 0 });
    renderItems();
    renderPreview();
    persist();
  });

  els.saveInvoice.addEventListener("click", saveCurrentInvoice);
  els.backToWebsite.addEventListener("click", closeToolPage);
  els.openVetUk.addEventListener("click", openVetUkForm);
  els.duplicateInvoice.addEventListener("click", duplicateCurrentInvoice);
  els.downloadInvoice.addEventListener("click", downloadCurrentInvoicePdf);
  els.printInvoice.addEventListener("click", () => window.print());
  els.resetDemo.addEventListener("click", resetDemo);
  els.csvUpload.addEventListener("change", handleCsvUpload);
  els.singleCsvUpload.addEventListener("change", handleSingleCsvUpload);
  els.downloadSampleCsv.addEventListener("click", downloadSampleCsv);
  els.generateBulk.addEventListener("click", generateBulkInvoices);
  els.newClient.addEventListener("click", () => showClientForm(true));
  els.cancelClient.addEventListener("click", () => {
    clearClientForm();
    showClientForm(false);
  });
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

  if (location.hash === "#tool") {
    openToolPage("dashboard");
  }
}

function openToolPage(viewId = "dashboard") {
  document.body.classList.add("tool-open");
  document.getElementById("landingPage").classList.add("is-hidden");
  document.getElementById("toolPage").classList.remove("is-hidden");
  if (viewId) showView(viewId);
  history.replaceState(null, "", "#tool");
}

function closeToolPage() {
  document.body.classList.remove("tool-open");
  document.getElementById("toolPage").classList.add("is-hidden");
  document.getElementById("landingPage").classList.remove("is-hidden");
  history.replaceState(null, "", location.pathname + location.search);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openVetUkForm() {
  openToolPage("single");
  state.current.templateId = "vetuk";
  applyCurrentToForm();
  renderItems();
  renderPreview();
  renderTemplateAssetPreview();
  setBuilderStage("single", state.current.clientId ? "template" : "client");
  persist();
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
  if (state.current) {
    state.current.clientId = state.current.clientId || "";
    state.current.clientName = state.current.clientName || "";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.paymentDetails = state.current.paymentDetails || "";
    state.current.testMode = false;
    state.current.items = (state.current.items || []).map((item) => ({
      sku: item.sku || "",
      product: item.product || "",
      description: item.description || "",
      qty: Number(item.qty || 1),
      unit: Number(item.unit || 0)
    }));
  }
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
    templateId: "gosupps",
    currency: "$",
    invoiceNumber: `GS-${today.getFullYear()}-${String(Date.now()).slice(-6)}`,
    orderDate: formatDate(today),
    deliveryDate: formatDate(delivery),
    poNumber: "",
    caseNumber: "",
    clientId: "",
    clientName: "",
    billTo: "",
    shipTo: "",
    paymentDetails: "",
    paymentMethod: "",
    trackingId: "",
    orderId: "",
    cardType: "Visa",
    cardEnding: "",
    taxRate: 0,
    shippingAmount: 0,
    testMode: false,
    items: [{ sku: "", product: "", description: "", qty: 1, unit: 0 }]
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
  els.caseNumber.value = invoice.caseNumber || "";
  els.invoiceClientName.value = invoice.clientName || "";
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
  els.testMode.checked = invoice.testMode === true;
  renderClientWorkflowSelectors();
  updateBuilderTemplateLocks();
}

function syncInvoiceFromForm() {
  state.current.templateId = els.templateSelect.value;
  state.current.currency = els.currencySelect.value;
  state.current.invoiceNumber = els.invoiceNumber.value;
  state.current.orderDate = els.orderDate.value;
  state.current.deliveryDate = els.deliveryDate.value;
  state.current.poNumber = els.poNumber.value;
  state.current.caseNumber = els.caseNumber.value;
  state.current.clientName = els.invoiceClientName.value;
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
  if (els.bulkTemplateSelect) els.bulkTemplateSelect.value = state.current.templateId;
  updateBuilderTemplateLocks();
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
  els.bulkTemplateSelect.innerHTML = options;
  els.templateSelect.value = state.current.templateId;
  els.assetTemplateSelect.value = state.current.templateId;
  els.bulkTemplateSelect.value = state.current.templateId;
  renderBuilderTemplateChoices();
}

function renderBuilderTemplateChoices() {
  if (!els.singleTemplateGrid || !els.bulkTemplateGrid) return;

  const cardMarkup = (target) =>
    templates
      .map(
        (template) => `
          <button class="builder-template-choice" data-${target}-template-id="${template.id}" type="button" style="--template-color: ${template.color}">
            <span>${escapeHtml(template.initials)}</span>
            <strong>${escapeHtml(template.name)}</strong>
            <small>${escapeHtml(template.region)}</small>
          </button>
        `
      )
      .join("");

  els.singleTemplateGrid.innerHTML = cardMarkup("single");
  els.bulkTemplateGrid.innerHTML = cardMarkup("bulk");
  markSelectedBuilderTemplate();
}

function markSelectedBuilderTemplate() {
  document.querySelectorAll("[data-single-template-id], [data-bulk-template-id]").forEach((button) => {
    const templateId = button.dataset.singleTemplateId || button.dataset.bulkTemplateId;
    button.classList.toggle("is-selected", templateId === state.current.templateId);
  });
}

function renderTemplateCards() {
  if (els.dashboardTemplates) {
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
  }

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
      renderClientWorkflowSelectors();
      setBuilderStage("single", "template");
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
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = state.current.clientName || "";
    state.current.billTo = state.current.billTo || "";
    state.current.shipTo = state.current.shipTo || "";
    state.current.paymentDetails = state.current.paymentDetails || "";
    state.current.paymentMethod = "";
    state.current.trackingId = "";
    state.current.orderId = "";
    state.current.cardType = "Visa";
    state.current.cardEnding = "";
    state.current.taxRate = 0;
    state.current.shippingAmount = 0;
    state.current.testMode = false;
    state.current.items = [{ sku: "", product: "", description: "", qty: 1, unit: 0 }];
    return;
  }
  if (templateId !== "vetuk") return;
  state.current.currency = "GBP";
  state.current.invoiceNumber = "299176";
  state.current.orderDate = "2025-12-14";
  state.current.deliveryDate = "2025-12-15";
  state.current.poNumber = "24238";
  state.current.caseNumber = state.current.caseNumber || "";
  state.current.clientName = state.current.clientName || "Sellixa LTD";
  state.current.billTo = state.current.billTo || "Sellixa LTD\n85 Great Portland Street\nLondon, Westminster\nW1W 7LT\nUnited Kingdom";
  state.current.shipTo = state.current.shipTo || "Sellixa LTD\n85 Great Portland Street\nLondon, Westminster\nW1W 7LT\nUnited Kingdom";
  state.current.cardType = "Visa";
  state.current.cardEnding = "4217";
  state.current.taxRate = 20;
  state.current.shippingAmount = 0;
  state.current.testMode = false;
  state.current.items = [
    {
      sku: "",
      product: "Whiskas",
      description: "Whiskas 1+ Adult Cat Wet Food Pouches in Jelly (Fish Favourites)",
      qty: 15,
      unit: 4.5
    }
  ];
}

function renderItems() {
  els.itemsBody.innerHTML = "";
  state.current.items.forEach((item, index) => {
    const template = document.getElementById("itemRowTemplate");
    const row = template.content.firstElementChild.cloneNode(true);
    row.dataset.index = index;
    row.querySelector('[data-field="sku"]').value = item.sku;
    row.querySelector('[data-field="product"]').value = item.product || "";
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

function itemLine(item) {
  const product = String(item.product || "").trim();
  const description = String(item.description || "").trim();
  if (product && description && product.toLowerCase() !== description.toLowerCase()) {
    return `${product} - ${description}`;
  }
  return product || description;
}

function assetPath(path) {
  return `${staticPrefix}${path}`;
}

function clientAddress(invoice) {
  const name = String(invoice.clientName || "").trim();
  const address = String(invoice.billTo || "").trim();
  if (!name) return address;
  if (!address) return name;
  if (address.toLowerCase().startsWith(name.toLowerCase())) return address;
  return `${name}\n${address}`;
}

function renderPreview() {
  const invoice = state.current;
  const template = getTemplate(invoice.templateId);
  const totals = calculateTotals(invoice);
  const isPound = template.id === "pound";
  const isVet = template.id === "vetuk";
  const isGoSupps = template.id === "gosupps";
  const testMode = invoice.testMode === true;
  els.previewTemplateName.textContent = template.name;
  els.invoicePreview.style.setProperty("--preview-color", template.color);

  if (isVet) {
    els.invoicePreview.innerHTML = renderVetUkPreview(invoice, totals, testMode);
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
          <p>${escapeHtml(clientAddress(invoice))}</p>
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
            <th>Product</th>
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
                  <td>${escapeHtml(item.product || "")}</td>
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
        ${testMode ? "Testing template only. Not a tax invoice, receipt, or proof of purchase." : isPound ? "This is an editable website-generated invoice form for internal/client portal use." : ""}
      </p>
    </div>
  `;
}

function renderGoSuppsPreview(invoice, totals) {
  const payment = String(invoice.paymentMethod || "");
  const tracking = String(invoice.trackingId || "");
  const order = String(invoice.orderId || "");

  return `
    <div class="invoice-doc gosupps-invoice">
      <header class="gosupps-header">
        <img src="${assetPath("/assets/gosupps-invoice-header.png")}" alt="Invoice - Go Supps" />
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
        <div><h4>BILL TO</h4><p>${escapeHtml(clientAddress(invoice)) || "&nbsp;"}</p></div>
        <div><h4>SHIP TO</h4><p>${escapeHtml(invoice.shipTo) || "&nbsp;"}</p></div>
      </section>

      <table class="gosupps-table">
        <thead><tr><th>QTY</th><th>DESCRIPTION</th><th>UNIT PRICE</th><th>AMOUNT</th></tr></thead>
        <tbody>${invoice.items.map((item) => `<tr><td>${Number(item.qty || 0)}</td><td>${escapeHtml(itemLine(item))}</td><td>${money(Number(item.unit || 0), invoice.currency)}</td><td>${money(rowTotal(item), invoice.currency)}</td></tr>`).join("")}</tbody>
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
      </footer>
    </div>`;
}

function renderPoundPreview(invoice, totals, testMode) {
  const shippingText = Number(invoice.shippingAmount || 0) === 0
    ? "9am-6pm Mon-Fri - Standard Delivery - No Booking Required - Shipping"
    : "Standard tracked trade delivery";

  return `
    <div class="invoice-doc pound-sales-order">
      <header class="pound-header">
        <div class="pound-brand">
          <img class="pound-logo-image" src="${assetPath("/assets/pound-wholesale-logo.png")}" alt="Pound Wholesale - Importers, Exporters, Distributors" />
        </div>
        <div class="pound-company">
          <p>www.poundwholesale.co.uk</p>
          <p>Unit 10, Suite 2<br>Whalley Range Business Park<br>Blackburn, Lancashire<br>BB1 6DG</p>
          <p>Tel: 01254 790233<br>info@poundwholesale.co.uk</p>
          <p>Pound Plus Distribution Ltd<br>Company No: 07599756<br>VAT Number: GB 156 8515 84<br>EORI Number: GB156851584000</p>
          <h2>Sales Invoice</h2>
        </div>
      </header>

      <section class="pound-order-strip">
        <div>Account ID # <strong>${escapeHtml(invoice.poNumber || "285184")}</strong></div>
        <div>Order # <strong>${escapeHtml(invoice.orderId || invoice.invoiceNumber)}</strong></div>
        <div>Order Date: <strong>${formatDisplayDate(invoice.orderDate)}</strong></div>
        <div>Invoice # <strong>${escapeHtml(invoice.invoiceNumber)}</strong></div>
      </section>

      <section class="pound-two-column pound-address-block">
        <div><h4>Sold to:</h4><p>${escapeHtml(clientAddress(invoice))}</p></div>
        <div><h4>Ship to:</h4><p>${escapeHtml(invoice.shipTo)}</p></div>
      </section>

      <section class="pound-two-column pound-service-block">
        <div>
          <h4>Payment Method:</h4>
          <p>${escapeHtml(invoice.paymentDetails || `Credit / Debit Card\nCredit Card Type: ${invoice.cardType}\nCredit Card Number: xxxx-${invoice.cardEnding || "0000"}`)}</p>
        </div>
        <div>
          <h4>Shipping Method:</h4>
          <p>${shippingText}<br><br>(Total Shipping Charges ${money(totals.shipping, invoice.currency)})</p>
        </div>
      </section>

      <table class="pound-products">
        <thead><tr><th>SKU</th><th>Products</th><th>Total Pack<br>Quantity</th><th>Pack Qty<br>Refunded</th><th>Unit<br>Price</th><th>Net Price</th></tr></thead>
        <tbody>
          ${invoice.items.map((item) => {
            const subtotal = rowTotal(item);
            return `<tr>
              <td>${escapeHtml(item.sku)}</td><td>${escapeHtml(itemLine(item))}</td>
              <td>${Number(item.qty || 0)}</td><td>0</td>
              <td>${money(Number(item.unit || 0), invoice.currency)}</td><td>${money(subtotal, invoice.currency)}</td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>

      <footer class="pound-discrepancy">Discrepancies must be reported to Pound Wholesale in writing within three working days of delivery.</footer>
    </div>`;
}

function renderVetUkPreview(invoice, totals, testMode) {
  const vetUkItemTotal = totals.subtotal + totals.tax;
  const vetUkGrandTotal = vetUkItemTotal + totals.shipping;

  return `
    <div class="invoice-doc vetuk-invoice ${testMode ? "test-template-doc" : ""}">
      ${testMode ? `<div class="test-watermark">TEST TEMPLATE</div>` : ""}
      <div class="vetuk-top-rule"></div>
      <header class="vetuk-header">
        <div class="vetuk-brand-block">
          <img class="vetuk-logo-image" src="${assetPath("/assets/vetuk-logo-reference.png")}" alt="VetUK" />
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
        <p>${escapeHtml(clientAddress(invoice))}</p>
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
                  <td>${escapeHtml(itemLine(item))}</td>
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
          <div><span>Item Total:</span><strong>${money(vetUkItemTotal, invoice.currency)}</strong></div>
          <div><span>Shipping charges:</span><strong>${money(totals.shipping, invoice.currency)}</strong></div>
          <div><span>VAT:</span><strong>${money(totals.tax, invoice.currency)}</strong></div>
          <div class="vetuk-grand"><span>Total:</span><strong>${money(vetUkGrandTotal, invoice.currency)}</strong></div>
        </div>
      </section>

      <section class="vetuk-terms">
        <h4>Terms & Conditions</h4>
        <p>The Reseller is authorized to market and sell the Company's products but shall not represent themselves as the Company's legal partner agent or employee.</p>
      </section>

      ${testMode ? `<p class="payment-note vetuk-test-note">Testing template only. Not a tax invoice, receipt, or proof of purchase.</p>` : ""}
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

async function downloadCurrentInvoicePdf() {
  const doc = els.invoicePreview.querySelector(".invoice-doc");
  if (!doc) {
    renderPreview();
    return;
  }

  const button = els.downloadInvoice;
  const originalText = button.textContent;
  button.textContent = "Preparing...";
  button.disabled = true;
  button.dataset.exportStatus = "loading";

  try {
    await ensurePdfLibraries();
    button.dataset.exportStatus = "capturing";
    await waitForImages(doc);
    const canvas = await window.html2canvas(doc, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: doc.scrollWidth,
      height: doc.scrollHeight,
      windowWidth: Math.max(doc.scrollWidth, doc.offsetWidth),
      windowHeight: Math.max(doc.scrollHeight, doc.offsetHeight)
    });
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 0;
    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;
    const ratio = Math.min(maxWidth / canvas.width, maxHeight / canvas.height);
    const width = canvas.width * ratio;
    const height = canvas.height * ratio;
    const x = (pageWidth - width) / 2;
    const y = margin;
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.98), "JPEG", x, y, width, height);
    pdf.save(`${state.current.invoiceNumber || "invoice"}.pdf`);
    button.dataset.exportStatus = "saved";
  } catch (error) {
    button.dataset.exportStatus = "failed";
    console.error("PDF download failed", error);
    window.alert("PDF download could not be prepared. Please refresh the page and try again.");
  } finally {
    button.textContent = originalText;
    button.disabled = false;
  }
}

function waitForImages(root) {
  const images = Array.from(root.querySelectorAll("img"));
  return Promise.all(
    images.map(
      (image) =>
        image.complete && image.naturalWidth > 0
          ? Promise.resolve()
          : new Promise((resolve) => {
              image.addEventListener("load", resolve, { once: true });
              image.addEventListener("error", resolve, { once: true });
            })
    )
  );
}

async function ensurePdfLibraries() {
  await loadScriptOnce(assetPath("/vendor/html2canvas.min.js"), () => typeof window.html2canvas === "function");
  await loadScriptOnce(assetPath("/vendor/jspdf.umd.min.js"), () => Boolean(window.jspdf?.jsPDF));
}

function loadScriptOnce(src, isReady) {
  if (isReady()) return Promise.resolve();

  const absoluteSrc = new URL(src, window.location.origin).href;
  Array.from(document.scripts)
    .filter((script) => script.src.split("?")[0] === absoluteSrc)
    .forEach((script) => {
      if (!isReady()) script.remove();
    });

  if (isReady()) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.onload = () => {
      if (isReady()) {
        script.dataset.loaded = "true";
        resolve();
      } else {
        reject(new Error(`Loaded ${src}, but the library did not initialize.`));
      }
    };
    script.onerror = () => reject(new Error(`Could not load ${src}.`));
    script.async = false;
    script.src = `${absoluteSrc}?v=20260713-download`;
    document.head.appendChild(script);
  });
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

const clientAddressFields = [
  "Name",
  "Company",
  "Street",
  "City",
  "State",
  "Postal",
  "Country",
  "Phone"
];

function readStructuredAddress(prefix) {
  return clientAddressFields.reduce((address, field) => {
    const id = `${prefix}${field}`;
    address[field.toLowerCase()] = els[id]?.value.trim() || "";
    return address;
  }, {});
}

function formatStructuredAddress(address) {
  if (!address) return "";
  const cityLine = [address.city, address.state, address.postal].filter(Boolean).join(", ");
  return [
    address.name,
    address.company,
    address.street,
    cityLine,
    address.country,
    address.phone ? `Phone: ${address.phone}` : ""
  ]
    .filter(Boolean)
    .join("\n");
}

function formatClientPaymentDetails(client) {
  return [
    "Credit / Debit Card",
    `Credit Card Type: ${client.cardType || "Visa"}`,
    `Credit Card Number: xxxx-${client.cardEnding || "0000"}`,
    client.cardExpiry ? `Expiry: ${client.cardExpiry}` : ""
  ]
    .filter(Boolean)
    .join("\n");
}

function showClientForm(visible) {
  if (!els.clientForm || !els.newClient) return;
  els.clientForm.classList.toggle("is-hidden-stage", !visible);
  els.newClient.classList.toggle("is-hidden-stage", visible);
  els.clientSavedPanel?.classList.toggle("is-hidden-stage", visible);
  els.clientForm.closest(".clients-grid")?.classList.toggle("is-form-open", visible);
}

function saveClient() {
  const billToFields = readStructuredAddress("billTo");
  const shipToFields = readStructuredAddress("shipTo");
  const cardEnding = els.clientCardEnding.value.replace(/\D/g, "").slice(0, 4);
  const name = els.clientName.value || billToFields.name || shipToFields.name || "Unnamed Client";
  const client = {
    id: `client-${Date.now()}`,
    name,
    email: els.clientEmail.value,
    caseNumber: els.clientCaseNumber.value,
    team: els.clientTeam.value,
    cardType: els.clientCardType.value,
    cardEnding,
    cardExpiry: els.clientCardExpiry.value,
    currency: els.clientCurrency.value,
    billToFields,
    shipToFields,
    billTo: formatStructuredAddress(billToFields),
    shipTo: formatStructuredAddress(shipToFields)
  };
  client.paymentDetails = formatClientPaymentDetails(client);

  state.clients.unshift(client);
  clearClientForm();
  showClientForm(false);
  renderClients();
  persist();
}

function renderClientWorkflowSelectors() {
  if (!els.invoiceClientSelect || !els.bulkClientSelect) return;

  const currentClientId = state.current.clientId || "";
  const hasSavedClient = state.clients.some((client) => client.id === currentClientId);
  const savedOptions = state.clients
    .map((client) => `<option value="${escapeHtml(client.id)}">${escapeHtml(client.name)}${client.email ? ` - ${escapeHtml(client.email)}` : ""}</option>`)
    .join("");
  const emptyLabel = state.clients.length ? "Select saved client" : "Save a client first";
  const options = `<option value="">${emptyLabel}</option>${savedOptions}`;

  [els.invoiceClientSelect, els.bulkClientSelect].forEach((select) => {
    const previous = select.value;
    select.innerHTML = options;
    if (hasSavedClient) {
      select.value = currentClientId;
    } else if (previous && state.clients.some((client) => client.id === previous)) {
      select.value = previous;
    } else {
      select.value = "";
    }
  });

  updateBuilderTemplateLocks();
}

function updateBuilderTemplateLocks() {
  if (!els.invoiceClientSelect || !els.bulkClientSelect) return;
  const singleReady = Boolean(els.invoiceClientSelect.value);
  const bulkReady = Boolean(els.bulkClientSelect.value);

  els.templateSelect.disabled = !singleReady;
  els.bulkTemplateSelect.disabled = !bulkReady;
  renderBuilderStage("single");
  renderBuilderStage("bulk");
}

function applyClientToCurrent(client) {
  state.current.clientId = client.id;
  state.current.caseNumber = client.caseNumber || "";
  state.current.billTo = client.billTo || formatStructuredAddress(client.billToFields);
  state.current.shipTo = client.shipTo || formatStructuredAddress(client.shipToFields);
  state.current.cardType = client.cardType;
  state.current.cardEnding = client.cardEnding;
  state.current.currency = client.currency;
  state.current.clientName = client.name;
  state.current.paymentDetails = client.paymentDetails || formatClientPaymentDetails(client);
}

function handleBuilderClientSelect(clientId, targetView) {
  if (!clientId) {
    state.current.clientId = "";
    renderClientWorkflowSelectors();
    setBuilderStage(targetView, "client");
    persist();
    return;
  }

  const client = state.clients.find((item) => item.id === clientId);
  if (!client) return;
  applyClientToCurrent(client);

  applyCurrentToForm();
  renderItems();
  setBuilderStage(targetView, "template");
  markSelectedBuilderTemplate();
  persist();
  if (targetView === "bulk") {
    els.bulkClientSelect.value = clientId;
  } else {
    els.invoiceClientSelect.value = clientId;
  }
  updateBuilderTemplateLocks();
}

function chooseBuilderTemplate(targetView, templateId) {
  if (!state.current.clientId) {
    setBuilderStage(targetView, "client");
    return;
  }

  state.current.templateId = templateId;
  els.templateSelect.value = templateId;
  els.bulkTemplateSelect.value = templateId;
  els.teamAccess.value = getTemplate(templateId).team;
  els.assetTemplateSelect.value = templateId;
  markSelectedBuilderTemplate();
  renderItems();
  renderPreview();
  renderTemplateAssetPreview();
  setBuilderStage(targetView, "editor");
  persist();
}

function setBuilderStage(targetView, stage) {
  builderStages[targetView] = stage;
  if (stage === "client") {
    const select = targetView === "single" ? els.invoiceClientSelect : els.bulkClientSelect;
    if (select) select.value = "";
  }
  renderBuilderStage(targetView);
}

function renderBuilderStage(targetView) {
  const stage = builderStages[targetView] || "client";
  const isSingle = targetView === "single";
  const clientStage = isSingle ? els.singleClientStage : els.bulkClientStage;
  const templateStage = isSingle ? els.singleTemplateStage : els.bulkTemplateStage;
  const workPanels = isSingle
    ? [document.querySelector("#single .editor-grid")]
    : Array.from(document.querySelectorAll(".bulk-work-panel"));
  const actions = isSingle ? document.querySelector("#single .builder-editor-actions") : els.generateBulk;
  const clientSelect = isSingle ? els.invoiceClientSelect : els.bulkClientSelect;
  const hasClient = Boolean(clientSelect && clientSelect.value);

  if (!hasClient && stage !== "client") builderStages[targetView] = "client";

  const currentStage = builderStages[targetView] || "client";
  clientStage.classList.toggle("is-hidden-stage", currentStage !== "client");
  templateStage.classList.toggle("is-hidden-stage", currentStage !== "template");
  workPanels.forEach((panel) => panel.classList.toggle("is-hidden-stage", currentStage !== "editor"));
  if (actions) actions.classList.toggle("is-hidden-stage", currentStage !== "editor");
}

function clearClientForm() {
  [
    "clientName",
    "clientEmail",
    "clientCaseNumber",
    "clientCardEnding",
    "clientCardExpiry",
    "billToName",
    "billToCompany",
    "billToStreet",
    "billToCity",
    "billToState",
    "billToPostal",
    "billToCountry",
    "billToPhone",
    "shipToName",
    "shipToCompany",
    "shipToStreet",
    "shipToCity",
    "shipToState",
    "shipToPostal",
    "shipToCountry",
    "shipToPhone"
  ].forEach((id) => {
    if (els[id]) els[id].value = "";
  });
  els.clientTeam.value = "Client";
  els.clientCardType.value = "Visa";
  els.clientCurrency.value = "$";
}

function renderClients() {
  renderClientWorkflowSelectors();
  renderDashboardClients();

  if (!state.clients.length) {
    els.clientList.innerHTML = `<div class="empty-state">No saved clients yet. Click New Client to add bill-to, ship-to and card details.</div>`;
    return;
  }

  els.clientList.innerHTML = state.clients
    .map(
      (client, index) => {
        const initials = String(client.name || "Client")
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part[0] || "")
          .join("")
          .toUpperCase();
        return `
        <article class="client-card" style="--delay: ${index * 80}ms">
          <div class="client-avatar" aria-hidden="true">${escapeHtml(initials || "CL")}</div>
          <div class="client-card-main">
            <div class="client-card-title">
              <strong>${escapeHtml(client.name)}</strong>
              <span>${escapeHtml(client.team || "Client")}</span>
            </div>
            <p>${escapeHtml(client.email || "No email")}</p>
            <div class="client-card-tags">
              ${client.caseNumber ? `<span>Case ${escapeHtml(client.caseNumber)}</span>` : ""}
              <span>${escapeHtml(client.cardType)} ending ${escapeHtml(client.cardEnding || "0000")}</span>
            </div>
          </div>
          <button class="client-use-button" data-load-client="${client.id}" type="button" aria-label="Use ${escapeHtml(client.name)} in editor">
            <span>Use in editor</span>
            <b aria-hidden="true">-></b>
          </button>
        </article>
      `;
      }
    )
    .join("");

  els.clientList.querySelectorAll("[data-load-client]").forEach((button) => {
    button.addEventListener("click", () => {
      const client = state.clients.find((item) => item.id === button.dataset.loadClient);
      if (!client) return;
      applyClientToCurrent(client);
      applyCurrentToForm();
      renderPreview();
      renderTemplateAssetPreview();
      persist();
      showView("single");
      renderClientWorkflowSelectors();
      setBuilderStage("single", "template");
    });
  });
}

function renderDashboardClients() {
  if (!els.dashboardClientRows) return;

  const query = String(els.dashboardClientSearch?.value || "").trim().toLowerCase();
  const filteredClients = state.clients.filter((client) =>
    [
      client.name,
      client.email,
      client.billToFields?.country,
      client.shipToFields?.country,
      client.caseNumber
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  );

  if (!filteredClients.length) {
    els.dashboardClientRows.innerHTML = `
      <tr class="dashboard-client-empty">
        <td colspan="7">${query ? "No clients match your search." : "No clients saved yet. Select Add client to create the first profile."}</td>
      </tr>
    `;
    return;
  }

  els.dashboardClientRows.innerHTML = filteredClients
    .map((client) => {
      const invoices = state.invoices.filter((invoice) => invoice.clientId === client.id);
      const total = invoices.reduce((sum, invoice) => sum + calculateTotals(invoice).total, 0);
      const country = client.billToFields?.country || client.shipToFields?.country || "Not set";
      const currency = invoices[0]?.currency || client.currency || "$";
      const statusClass = invoices.length ? "is-active" : "is-pending";
      const statusLabel = invoices.length ? "Active" : "Pending";

      return `
        <tr>
          <td>
            <div class="dashboard-client-name">
              <span aria-hidden="true">${escapeHtml(String(client.name || "C").trim().charAt(0).toUpperCase())}</span>
              <div>
                <strong>${escapeHtml(client.name || "Unnamed Client")}</strong>
                <small>${escapeHtml(client.caseNumber ? `Case ${client.caseNumber}` : "Client profile")}</small>
              </div>
            </div>
          </td>
          <td>${escapeHtml(client.email || "No email")}</td>
          <td>${escapeHtml(country)}</td>
          <td>${invoices.length}</td>
          <td><span class="dashboard-client-status ${statusClass}">• ${statusLabel}</span></td>
          <td><strong>${money(total, currency)}</strong></td>
          <td><button class="dashboard-client-open" data-dashboard-client="${escapeHtml(client.id)}" type="button">Open</button></td>
        </tr>
      `;
    })
    .join("");

  els.dashboardClientRows.querySelectorAll("[data-dashboard-client]").forEach((button) => {
    button.addEventListener("click", () => {
      const client = state.clients.find((item) => item.id === button.dataset.dashboardClient);
      if (!client) return;
      applyClientToCurrent(client);
      applyCurrentToForm();
      renderPreview();
      renderTemplateAssetPreview();
      persist();
      showView("single");
      renderClientWorkflowSelectors();
      setBuilderStage("single", "template");
    });
  });
}

function renderSavedInvoices() {
  const recent = state.invoices.slice(0, 4);
  if (els.recentInvoices) {
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
  }

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
      renderClientWorkflowSelectors();
      setBuilderStage("single", "editor");
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
      product: row.product || row.products || row.Product || row.Products || "",
      description: row.description || row.Description || "",
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
    els.bulkRows.innerHTML = `<tr><td colspan="6">Upload a CSV file to preview product rows.</td></tr>`;
    updateMetrics();
    return;
  }

  els.bulkRows.innerHTML = state.bulkRows
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.sku || "")}</td>
          <td>${escapeHtml(row.product || row.products || "")}</td>
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
  if (!els.bulkClientSelect.value) {
    window.alert("Select a saved client before generating bulk invoices.");
    showView("bulk");
    return;
  }

  const client = state.clients.find((item) => item.id === els.bulkClientSelect.value);
  if (client) applyClientToCurrent(client);
  state.current.templateId = els.bulkTemplateSelect.value;
  els.templateSelect.value = els.bulkTemplateSelect.value;
  els.teamAccess.value = getTemplate(state.current.templateId).team;

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
      product: row.product || row.products || "",
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
    "sku,product,description,qty,unit,client,invoiceNumber",
    "SUP-1001,Vitamin C,Vitamin C 1000mg,4,11.95,Health Buyer UK,MC011-BULK-001",
    "SUP-2210,Omega 3,Omega 3 softgels,2,16.50,Health Buyer UK,MC011-BULK-001",
    "EL-8840,Wireless Keyboard,Compact wireless keyboard,3,21.99,Electronics Client,MC011-BULK-002"
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
  if (els.templateCount) els.templateCount.textContent = String(templates.length);
  if (els.clientCount) els.clientCount.textContent = String(state.clients.length);
  if (els.invoiceCount) els.invoiceCount.textContent = String(state.invoices.length);
  if (els.bulkCount) els.bulkCount.textContent = String(state.bulkRows.length);
  if (els.analyticsClientCount) {
    const savedValue = state.invoices.reduce((sum, invoice) => sum + calculateTotals(invoice).total, 0);
    els.analyticsClientCount.textContent = String(state.clients.length);
    els.analyticsInvoiceCount.textContent = String(state.invoices.length);
    if (els.analyticsInvoiceGenerated) els.analyticsInvoiceGenerated.textContent = String(state.invoices.length);
    els.analyticsBulkCount.textContent = String(state.bulkRows.length);
    els.analyticsTemplateCount.textContent = String(templates.length);
    els.analyticsRevenueTotal.textContent = money(savedValue, state.current?.currency || "$");
    renderAnalyticsRevenueTrend(savedValue);
    renderAnalyticsTemplateUsage();
  }
}

function renderAnalyticsRevenueTrend(savedValue) {
  if (!els.analyticsRevenueTrend) return;
  const paidInvoices = state.invoices.filter((invoice) => calculateTotals(invoice).total > 0).slice(0, 6);

  if (!paidInvoices.length || savedValue <= 0) {
    els.analyticsRevenueTrend.innerHTML = `<p>No payment data yet.</p>`;
    return;
  }

  const maxTotal = Math.max(...paidInvoices.map((invoice) => calculateTotals(invoice).total), 1);
  els.analyticsRevenueTrend.innerHTML = `
    <div class="revenue-bars">
      ${paidInvoices
        .map((invoice) => {
          const total = calculateTotals(invoice).total;
          const height = Math.max(12, Math.round((total / maxTotal) * 190));
          return `
            <div class="revenue-bar">
              <span style="--bar-height: ${height}px"></span>
              <small>${escapeHtml(invoice.invoiceNumber || "Invoice")}</small>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderAnalyticsTemplateUsage() {
  if (!els.analyticsTemplatePie || !els.analyticsTemplateLegend) return;

  const colors = ["#5b63f0", "#18bf8f", "#f9a20b", "#f04b4b", "#7959e8", "#38a4ff"];
  const usage = templates
    .map((template, index) => {
      const count = state.invoices.filter((invoice) => invoice.templateId === template.id).length;
      return {
        id: template.id,
        name: template.id.replace(/-/g, "_"),
        count,
        color: colors[index % colors.length]
      };
    })
    .filter((item) => item.count > 0);

  const data = usage.length
    ? usage
    : templates.slice(0, 5).map((template, index) => ({
        id: template.id,
        name: template.id.replace(/-/g, "_"),
        count: index === 0 ? 5 : 1,
        color: colors[index % colors.length]
      }));

  const total = data.reduce((sum, item) => sum + item.count, 0) || 1;
  let cursor = 0;
  const segments = data.map((item) => {
    const start = cursor;
    cursor += (item.count / total) * 100;
    return `${item.color} ${start.toFixed(2)}% ${cursor.toFixed(2)}%`;
  });

  els.analyticsTemplatePie.style.setProperty("--template-pie-gradient", `conic-gradient(${segments.join(", ")})`);
  els.analyticsTemplateLegend.innerHTML = data
    .map(
      (item) => `
        <span class="template-legend-item" style="--legend-color: ${item.color}">
          <span></span>${escapeHtml(item.name)}
        </span>
      `
    )
    .join("");
}

function showView(id) {
  const titles = {
    dashboard: "Dashboard",
    clients: "Clients",
    single: "Invoice Builder",
    bulk: "Bulk Invoice Generator",
    analytics: "Business Analytics",
    saved: "Saved Invoices",
    templates: "CSV Import",
    "data-cleaning": "Data Cleaning & Invoice Splitter"
  };
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("is-visible", view.id === id);
  });
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === id);
  });
  if (els.workspaceTitle) {
    els.workspaceTitle.textContent = titles[id] || "Dashboard";
  }
  if (id === "single" || id === "bulk") {
    setBuilderStage(id, "client");
  }
  if (id === "clients" && els.clientForm) {
    showClientForm(false);
  }
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
