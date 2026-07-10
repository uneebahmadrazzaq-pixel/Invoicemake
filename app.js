const templates = [
  { id: "pound", name: "Pound Wholesale UK", team: "Pound Wholesale Team", region: "UK", color: "#d51f2a", initials: "PW" },
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
    "templateSelect",
    "currencySelect",
    "invoiceNumber",
    "orderDate",
    "deliveryDate",
    "poNumber",
    "billTo",
    "shipTo",
    "cardType",
    "cardEnding",
    "taxRate",
    "shippingAmount",
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
    "cardType",
    "cardEnding",
    "taxRate",
    "shippingAmount"
  ].forEach((id) => {
    els[id].addEventListener("input", syncInvoiceFromForm);
    els[id].addEventListener("change", syncInvoiceFromForm);
  });

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
  els.duplicateInvoice.addEventListener("click", duplicateCurrentInvoice);
  els.printInvoice.addEventListener("click", () => window.print());
  els.resetDemo.addEventListener("click", resetDemo);
  els.csvUpload.addEventListener("change", handleCsvUpload);
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
    templateId: "pound",
    currency: "GBP",
    invoiceNumber: `MC011-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`,
    orderDate: formatDate(today),
    deliveryDate: formatDate(delivery),
    poNumber: "PO-74820",
    billTo: "Sample Retail Buyer\n14 Market Street\nLondon, UK\naccounts@example.com",
    shipTo: "Warehouse Receiving\nUnit 8 Trade Park\nManchester, UK",
    cardType: "Visa",
    cardEnding: "4242",
    taxRate: 20,
    shippingAmount: 12.5,
    items: sampleItems.map((item) => ({ ...item }))
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
  els.cardType.value = invoice.cardType;
  els.cardEnding.value = invoice.cardEnding;
  els.taxRate.value = invoice.taxRate;
  els.shippingAmount.value = invoice.shippingAmount;
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
  state.current.cardType = els.cardType.value;
  state.current.cardEnding = els.cardEnding.value.replace(/\D/g, "").slice(0, 4);
  state.current.taxRate = Number(els.taxRate.value || 0);
  state.current.shippingAmount = Number(els.shippingAmount.value || 0);

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
      applyCurrentToForm();
      renderPreview();
      renderTemplateAssetPreview();
      persist();
      showView("single");
    });
  });
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
  els.previewTemplateName.textContent = template.name;
  els.invoicePreview.style.setProperty("--preview-color", template.color);

  els.invoicePreview.innerHTML = `
    <div class="invoice-doc">
      <header class="invoice-doc-header">
        <div>
          <div class="invoice-logo">${escapeHtml(template.initials)}</div>
          <h3>${escapeHtml(template.name)}</h3>
          <p>Authorized client invoice</p>
        </div>
        <div class="invoice-meta">
          <div><strong>Invoice</strong><span>${escapeHtml(invoice.invoiceNumber)}</span></div>
          <div><strong>Order</strong><span>${escapeHtml(invoice.orderDate)}</span></div>
          <div><strong>Delivery</strong><span>${escapeHtml(invoice.deliveryDate)}</span></div>
          <div><strong>PO</strong><span>${escapeHtml(invoice.poNumber)}</span></div>
        </div>
      </header>

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
        Generated in MC011 Invoice Editor for authorized client use.
      </p>
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
