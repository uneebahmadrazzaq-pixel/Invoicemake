const templates = [
  { id: "pound", name: "Pound Wholesale UK", team: "Pound Wholesale Team", region: "UK", color: "#29345f", initials: "PW" },
  { id: "zoro", name: "Zoro USA", team: "Zoro Team", region: "USA", color: "#1f1f1f", initials: "ZU" },
  { id: "gosupps", name: "GO SUPPS.COM", team: "Go Supps Team", region: "USA/EU", color: "#c31421", initials: "GS" },
  { id: "tw", name: "T W Wholesale & Superstore", team: "Pound Wholesale Team", region: "UK", color: "#d51f2a", initials: "TW" },
  { id: "vetuk", name: "VET UK Petcare", team: "Vet UK Team", region: "UK", color: "#111111", initials: "VU" },
  { id: "pcsbooks", name: "PCS Books", team: "PCS Books Team", region: "UK", color: "#18324a", initials: "PB" },
  { id: "cosmetix", name: "Cosmetix Club", team: "Cosmetix Club Team", region: "USA", color: "#ee7c91", initials: "CC" },
  { id: "costcouk", name: "Costco Wholesale UK", team: "Costco UK Team", region: "UK", color: "#005daa", initials: "CU" },
  { id: "qogitauk", name: "Qogita UK", team: "Qogita UK Team", region: "UK", color: "#9a8dab", initials: "QG" },
  { id: "clearanceking", name: "Clearance King Ltd", team: "Clearance King Team", region: "UK", color: "#0c3b57", initials: "CK" },
  { id: "sunsky", name: "Sunsky Commercial Invoice", team: "Sunsky Team", region: "China / Global", color: "#f58220", initials: "SS" },
  { id: "justmae", name: "Justmae Limited", team: "Justmae Team", region: "UK", color: "#07844c", initials: "JM" },
  { id: "jellycat", name: "Jellycat Order Invoice", team: "Jellycat Team", region: "UK", color: "#08b8dc", initials: "JC" },
  { id: "scrubdaddy", name: "Scrub Daddy Invoice", team: "Scrub Daddy Team", region: "UK", color: "#ffd719", initials: "SD" },
  { id: "bestway", name: "Bestway Wholesale", team: "Bestway Wholesale Team", region: "UK", color: "#0099d8", initials: "BW" },
  { id: "paperstone", name: "Paperstone VAT Receipt", team: "Paperstone Team", region: "UK", color: "#ec008c", initials: "PS" },
  { id: "mastertrade", name: "Mastertrade Supplies", team: "Mastertrade Team", region: "UK", color: "#f6c515", initials: "MT" },
  { id: "idealtrading", name: "Ideal Trading USA - Toy Wholesale", team: "Ideal Trading USA Team", region: "USA", color: "#202020", initials: "IT" },
  { id: "unfi", name: "UNFI Invoice", team: "UNFI / Ungi Team", region: "USA / Ungi", color: "#6fbe44", initials: "UN" },
  { id: "bulkbuyamerica", name: "Bulk Buy America", team: "Bulk Buy America Team", region: "USA", color: "#24549b", initials: "BA" },
  { id: "sephorausa", name: "Sephora USA", team: "Sephora USA Team", region: "USA", color: "#111111", initials: "SE" },
  { id: "luxurysouq", name: "Luxury Souq (Watches)", team: "Luxury Souq Team", region: "UAE / UK", color: "#171722", initials: "LS" }
];

const sampleItems = [
  { sku: "SUP-1001", product: "Vitamin C", description: "Vitamin C 1000mg - 120 tablets", qty: 4, unit: 11.95 },
  { sku: "SUP-2210", product: "Omega 3", description: "Omega 3 softgels - 90 count", qty: 2, unit: 16.5 },
  { sku: "SUP-4407", product: "Magnesium", description: "Magnesium complex", qty: 3, unit: 9.75 }
];

const defaultTemplateCsvSchema = {
  headers: ["sku", "product", "description", "qty", "unit"],
  row: ["SUP-1001", "Vitamin C", "Vitamin C 1000mg", "4", "11.95"]
};

const templateCsvSchemas = {
  pcsbooks: { headers: ["sku", "qty", "description", "unit"], row: ["PB1001", "4", "Paperback wholesale title", "3.25"] },
  costcouk: { headers: ["sku", "description", "unit", "qty"], row: ["CU1001", "Kirkland Signature Product", "12.99", "6"] },
  qogitauk: { headers: ["description", "sku", "product", "unit", "qty"], row: ["Medicube Zero Pore Pad 2.0 - 70 Pieces", "EM572P", "8800256119066", "5.82", "100"] },
  clearanceking: { headers: ["description", "sku", "product", "qty", "unit"], row: ["Wholesale clearance item", "CK1001", "5060123456789", "8", "2.49"] },
  sunsky: { headers: ["sku", "description", "product", "qty", "unit"], row: ["SUN-1001", "USB-C charging cable", "854442", "10", "1.85"] },
  justmae: { headers: ["description", "qty", "unit"], row: ["Beauty care wholesale item", "12", "4.20"] },
  jellycat: { headers: ["qty", "sku", "description", "product", "unit"], row: ["6", "JC1001", "Bashful Bunny", "Medium", "18.50"] },
  scrubdaddy: { headers: ["description", "sku", "product", "qty", "unit"], row: ["Scrub Daddy Original", "SD1001", "80g", "12", "2.75"] },
  bestway: { headers: ["sku", "description", "qty", "unit"], row: ["BW1001", "Bestway wholesale item", "10", "3.40"] },
  paperstone: { headers: ["sku", "description", "qty", "pack", "vatCode", "unit"], row: ["GL85858", "Fine Tip Marker Pens 4 Pack", "14", "1", "S", "2.23"] },
  unfi: { headers: ["sku", "description", "qty", "product", "unit"], row: ["UN1001", "Natural grocery product", "8", "EA", "6.2500"] },
  bulkbuyamerica: { headers: ["sku", "description", "qty", "unit"], row: ["BA1001", "Bulk Buy America product", "10", "4.99"] },
  sephorausa: { headers: ["product", "sku", "description", "qty", "unit"], row: ["Beauty Campaign", "SE1001", "Sephora beauty product", "5", "14.95"] }
};

const templateOptionalFields = {
  deliveryDateField: new Set(["pound", "zoro", "gosupps", "tw", "vetuk", "cosmetix", "costcouk", "scrubdaddy", "bestway", "mastertrade", "unfi"]),
  poNumberField: new Set(["pound", "zoro", "gosupps", "tw", "vetuk", "costcouk", "jellycat", "scrubdaddy", "bestway", "paperstone", "unfi", "bulkbuyamerica", "sephorausa"]),
  paymentDetailsField: new Set(["pound", "tw", "cosmetix", "qogitauk", "clearanceking", "sunsky", "idealtrading"]),
  paymentMethodField: new Set(["pound", "zoro", "gosupps", "tw", "vetuk", "cosmetix", "costcouk", "qogitauk", "clearanceking", "sunsky", "justmae", "jellycat", "scrubdaddy", "bestway", "mastertrade", "idealtrading", "luxurysouq"]),
  trackingIdField: new Set(["gosupps", "tw", "clearanceking", "unfi"]),
  orderIdField: new Set(["pound", "zoro", "gosupps", "tw", "costcouk", "qogitauk", "clearanceking", "jellycat", "bestway", "unfi", "bulkbuyamerica", "sephorausa"]),
  invoiceCardExpiryField: new Set(["costcouk", "qogitauk", "sunsky", "mastertrade", "luxurysouq"]),
  cardTypeField: new Set(["pound", "zoro", "tw", "vetuk", "pcsbooks", "costcouk", "qogitauk", "sunsky", "bestway", "mastertrade", "idealtrading", "luxurysouq"]),
  cardEndingField: new Set(["pound", "zoro", "tw", "vetuk", "pcsbooks", "costcouk", "qogitauk", "sunsky", "bestway", "mastertrade", "idealtrading", "luxurysouq"]),
  shippingAmountField: new Set(["pound", "zoro", "gosupps", "tw", "vetuk", "pcsbooks", "cosmetix", "costcouk", "qogitauk", "clearanceking", "sunsky", "justmae", "jellycat", "scrubdaddy", "bestway", "mastertrade", "idealtrading", "unfi", "bulkbuyamerica", "sephorausa", "luxurysouq"])
};

const storageKey = "mc011-invoice-editor-v1";
const state = loadState();

const els = {};
const builderStages = { single: "client", bulk: "client" };
const clientDirectoryPageSize = 10;
let clientDirectoryPage = 1;
let editingClientId = "";
let metadataFiles = [];
let compressedPdfFile = null;
let metadataResults = [];
let pdfCompressionResult = null;
let pdfLibPromise = null;

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
  window.initializeCustomSelects?.(document);
  window.lucide?.createIcons({
    attrs: {
      "aria-hidden": "true"
    }
  });
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
    "invoiceClientCards",
    "singleTemplateGrid",
    "templateSelect",
    "currencySelect",
    "invoiceNumberLabel",
    "invoiceNumber",
    "orderDateLabel",
    "orderDate",
    "deliveryDate",
    "poNumberLabel",
    "poNumber",
    "deliveryDateField",
    "poNumberField",
    "caseNumber",
    "invoiceClientName",
    "billTo",
    "shipTo",
    "paymentDetails",
    "paymentDetailsField",
    "paymentMethod",
    "paymentMethodField",
    "trackingId",
    "trackingIdField",
    "orderId",
    "orderIdField",
    "invoiceCardExpiry",
    "invoiceCardExpiryField",
    "pcsBooksFields",
    "pcsPlatform",
    "pcsBoxWeight",
    "pcsDeliveryService",
    "pcsUnitCode",
    "pcsPaymentDetails",
    "pcsPostage",
    "pcsDiscount",
    "pcsCommodityCode",
    "pcsCountryOfOrigin",
    "costcoUkFields",
    "costcoMembershipNumber",
    "costcoCardExpiry",
    "zoroFields",
    "zoroCustomerNumber",
    "zoroTerms",
    "zoroDueDate",
    "zoroMailingAddress",
    "zoroRemitTo",
    "zoroShippingMethod",
    "zoroAmountDue",
    "clearanceKingFields",
    "clearanceKingVatNumber",
    "sunskyFields",
    "sunskySalesperson",
    "sunskyRemarks",
    "justmaeFields",
    "justmaeVatNumber",
    "justmaePaypalFee",
    "jellycatFields",
    "jellycatShippingMethod",
    "jellycatComments",
    "scrubDaddyFields",
    "scrubDaddyVatNumber",
    "scrubDaddyShippingService",
    "bestwayFields",
    "bestwayVatNumber",
    "bestwayInvoiceDate",
    "bestwayPaymentStatus",
    "paperstoneFields",
    "paperstoneReceiptNumber",
    "paperstoneAccountNumber",
    "paperstoneVatNumber",
    "paperstoneCompanyNumber",
    "paperstonePaymentNote",
    "sephoraUsaFields",
    "sephoraUsaCustomerCount",
    "sephoraUsaDiscount",
    "mastertradeFields",
    "mastertradeShipDate",
    "mastertradeDiscountRate",
    "mastertradeCardholder",
    "mastertradePaymentStatus",
    "unfiFields",
    "unfiDeliveryNumber",
    "unfiSalesOrderNumber",
    "unfiFreightTerms",
    "unfiIncoTerms",
    "unfiCarrier",
    "unfiPageLabel",
    "unfiVatNumber",
    "unfiShipToCode",
    "unfiBillToCode",
    "unfiDiscount",
    "amountPaid",
    "amountPaidField",
    "cardType",
    "cardTypeField",
    "cardEnding",
    "cardEndingField",
    "taxRate",
    "taxRateField",
    "shippingAmount",
    "shippingAmountField",
    "singleCsvUpload",
    "singleCsvFileName",
    "singleCsvTemplateName",
    "singleCsvColumns",
    "downloadSingleSampleCsv",
    "testMode",
    "itemsTableWrap",
    "itemsTable",
    "itemsHeader",
    "itemsBody",
    "invoicePreview",
    "invoiceSavedInvoices",
    "changeTemplate",
    "downloadInvoice",
    "downloadInvoiceJpg",
    "clearAllItems",
    "billToLabel",
    "shipToLabel",
    "invoiceBillToName",
    "invoiceBillToCompany",
    "invoiceBillToStreet",
    "invoiceBillToCity",
    "invoiceBillToState",
    "invoiceBillToPostal",
    "invoiceBillToCountry",
    "invoiceBillToPhone",
    "invoiceShipToName",
    "invoiceShipToCompany",
    "invoiceShipToStreet",
    "invoiceShipToCity",
    "invoiceShipToState",
    "invoiceShipToPostal",
    "invoiceShipToCountry",
    "invoiceShipToPhone",
    "csvUpload",
    "csvFileName",
    "downloadSampleCsv",
    "bulkClientStage",
    "bulkClientSelect",
    "bulkTemplateSelect",
    "bulkTemplateHint",
    "bulkTemplateStage",
    "bulkTemplateGrid",
    "bulkDestination",
    "bulkInvoiceDate",
    "bulkInvoiceNumberMode",
    "bulkCardType",
    "bulkCardLast4",
    "bulkCardExpiry",
    "bulkFreightAmount",
    "bulkApplyFreight",
    "bulkRowSummary",
    "bulkCaseTemplateFilter",
    "bulkCaseStatusFilter",
    "bulkCaseList",
    "bulkRows",
    "generateBulk",
    "newClient",
    "clientForm",
    "clientSavedPanel",
    "cancelClient",
    "saveClient",
    "clientFormTitle",
    "clientFormMode",
    "clientName",
    "clientEmail",
    "clientCaseNumber",
    "clientTeam",
    "clientCardType",
    "clientCardEnding",
    "clientCardExpiry",
    "clientCurrency",
    "sameAsBillTo",
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
    "clientDirectoryCount",
    "clientDirectorySearch",
    "clientDirectoryList",
    "clientDirectoryPagination",
    "clientList",
    "savedGrid",
    "exportInvoices",
    "dashboardTemplates",
    "dashboardClientRows",
    "dashboardClientSearch",
    "dashboardAddClient",
    "dashboardTemplateClient",
    "dashboardTemplateChart",
    "dashboardTemplateTotal",
    "dashboardSummaryClients",
    "dashboardSummaryInvoices",
    "dashboardSummaryDrafts",
    "dashboardSummarySaved",
    "dashboardSummarySent",
    "dashboardSummaryCountries",
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
    "analyticsTemplateLegend",
    "metadataDropZone",
    "metadataInput",
    "metadataFileList",
    "metadataProcess",
    "metadataResults",
    "pdfCompressorDropZone",
    "pdfCompressorInput",
    "pdfCompressorFile",
    "pdfRemoveMetadata",
    "pdfCompressorProcess",
    "pdfCompressorResults"
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function getTemplateCsvSchema(templateId) {
  return templateCsvSchemas[templateId] || defaultTemplateCsvSchema;
}

function updateSingleCsvHelp(templateId) {
  const template = getTemplate(templateId);
  const schema = getTemplateCsvSchema(templateId);
  els.singleCsvTemplateName.textContent = `${template.name} Product CSV`;
  els.singleCsvColumns.textContent = `Columns: ${schema.headers.join(", ")}`;
}

function applyTemplateFieldVisibility(templateId) {
  Object.entries(templateOptionalFields).forEach(([fieldId, templatesUsingField]) => {
    if (els[fieldId]) els[fieldId].hidden = !templatesUsingField.has(templateId);
  });
  updateSingleCsvHelp(templateId);
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
    beginNewClient();
  });
  els.dashboardTemplateClient?.addEventListener("change", () => renderDashboardTemplateUsage());

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
    "invoiceCardExpiry",
    "pcsPlatform",
    "pcsBoxWeight",
    "pcsDeliveryService",
    "pcsUnitCode",
    "pcsPaymentDetails",
    "pcsPostage",
    "pcsDiscount",
    "pcsCommodityCode",
    "pcsCountryOfOrigin",
    "costcoMembershipNumber",
    "costcoCardExpiry",
    "zoroCustomerNumber",
    "zoroTerms",
    "zoroDueDate",
    "zoroMailingAddress",
    "zoroRemitTo",
    "zoroShippingMethod",
    "zoroAmountDue",
    "clearanceKingVatNumber",
    "sunskySalesperson",
    "sunskyRemarks",
    "justmaeVatNumber",
    "justmaePaypalFee",
    "jellycatShippingMethod",
    "jellycatComments",
    "scrubDaddyVatNumber",
    "scrubDaddyShippingService",
    "bestwayVatNumber",
    "bestwayInvoiceDate",
    "bestwayPaymentStatus",
    "paperstoneReceiptNumber",
    "paperstoneAccountNumber",
    "paperstoneVatNumber",
    "paperstoneCompanyNumber",
    "paperstonePaymentNote",
    "sephoraUsaCustomerCount",
    "sephoraUsaDiscount",
    "mastertradeShipDate",
    "mastertradeDiscountRate",
    "mastertradeCardholder",
    "mastertradePaymentStatus",
    "unfiDeliveryNumber",
    "unfiSalesOrderNumber",
    "unfiFreightTerms",
    "unfiIncoTerms",
    "unfiCarrier",
    "unfiPageLabel",
    "unfiVatNumber",
    "unfiShipToCode",
    "unfiBillToCode",
    "unfiDiscount",
    "cardType",
    "cardEnding",
    "taxRate",
    "shippingAmount",
    "invoiceBillToName",
    "invoiceBillToCompany",
    "invoiceBillToStreet",
    "invoiceBillToCity",
    "invoiceBillToState",
    "invoiceBillToPostal",
    "invoiceBillToCountry",
    "invoiceBillToPhone",
    "invoiceShipToName",
    "invoiceShipToCompany",
    "invoiceShipToStreet",
    "invoiceShipToCity",
    "invoiceShipToState",
    "invoiceShipToPostal",
    "invoiceShipToCountry",
    "invoiceShipToPhone"
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
    syncBulkDetailsToCurrent();
  });
  ["bulkDestination", "bulkInvoiceDate", "bulkInvoiceNumberMode", "bulkCardType", "bulkCardLast4", "bulkCardExpiry", "bulkFreightAmount"].forEach(
    (id) => {
      els[id]?.addEventListener("input", syncBulkDetailsToCurrent);
      els[id]?.addEventListener("change", syncBulkDetailsToCurrent);
    }
  );
  els.bulkApplyFreight?.addEventListener("click", () => {
    syncBulkDetailsToCurrent();
    if (els.bulkRowSummary) {
      els.bulkRowSummary.textContent = `Freight ${money(state.current.shippingAmount, state.current.currency)} will be applied to this batch.`;
    }
  });
  els.bulkCaseTemplateFilter?.addEventListener("change", renderBulkCases);
  els.bulkCaseStatusFilter?.addEventListener("change", renderBulkCases);

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

  els.changeTemplate.addEventListener("click", () => {
    syncInvoiceFromForm();
    markSelectedBuilderTemplate();
    setBuilderStage("single", "template");
    persist();
    els.singleTemplateStage.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.querySelectorAll("[data-add-item]").forEach((button) => {
    button.addEventListener("click", () => {
      state.current.items.push({ sku: "", product: "", description: "", qty: 1, pack: 1, vatCode: "S", unit: 0 });
      renderItems();
      renderPreview();
      persist();
      const focusField = button.dataset.focusField;
      const focusTarget = focusField
        ? els.itemsBody.lastElementChild?.querySelector(`[data-field="${focusField}"]`)
        : els.itemsBody.lastElementChild?.querySelector("input");
      focusTarget?.focus();
    });
  });

  els.clearAllItems.addEventListener("click", () => {
    state.current.items = [];
    renderItems();
    renderPreview();
    persist();
  });

  document.querySelectorAll("[data-clear-invoice-address]").forEach((button) => {
    button.addEventListener("click", () => {
      clearInvoiceStructuredAddress(button.dataset.clearInvoiceAddress);
      syncInvoiceFromForm();
    });
  });

  els.itemsBody.addEventListener("input", (event) => {
    const input = event.target.closest("input");
    if (!input) return;
    const row = input.closest("tr");
    const index = Number(row.dataset.index);
    const field = input.dataset.field;
    if (!field) return;
    const value = field === "qty" || field === "pack" || field === "unit" ? Number(input.value || 0) : input.value;
    if ((state.current.templateId === "pcsbooks" || state.current.templateId === "costcouk") && field === "description") {
      state.current.items[index].product = "";
    }
    state.current.items[index][field] = value;
    updateRowTotal(row, state.current.items[index]);
    renderPreview();
    persist();
  });

  els.itemsBody.addEventListener("click", (event) => {
    if (!event.target.matches("[data-remove-row]")) return;
    const index = Number(event.target.closest("tr").dataset.index);
    state.current.items.splice(index, 1);
    if (!state.current.items.length) state.current.items.push({ sku: "", product: "", description: "", qty: 1, pack: 1, vatCode: "S", unit: 0 });
    renderItems();
    renderPreview();
    persist();
  });

  els.saveInvoice.addEventListener("click", saveCurrentInvoice);
  els.backToWebsite.addEventListener("click", closeToolPage);
  els.openVetUk.addEventListener("click", openVetUkForm);
  els.downloadInvoice.addEventListener("click", downloadCurrentInvoicePdf);
  els.invoiceSavedInvoices.addEventListener("click", () => showView("saved"));
  els.downloadInvoiceJpg.addEventListener("click", downloadCurrentInvoiceJpg);
  els.resetDemo.addEventListener("click", resetDemo);
  els.csvUpload.addEventListener("change", handleCsvUpload);
  els.singleCsvUpload.addEventListener("change", handleSingleCsvUpload);
  els.downloadSingleSampleCsv.addEventListener("click", () => downloadTemplateSampleCsv(state.current.templateId, false));
  els.downloadSampleCsv.addEventListener("click", downloadSampleCsv);
  els.generateBulk.addEventListener("click", generateBulkInvoices);
  els.newClient.addEventListener("click", beginNewClient);
  els.clientDirectorySearch?.addEventListener("input", () => {
    clientDirectoryPage = 1;
    renderClientDirectory();
  });
  els.cancelClient.addEventListener("click", () => {
    editingClientId = "";
    clearClientForm();
    showClientForm(false);
  });
  els.saveClient.addEventListener("click", saveClient);
  els.sameAsBillTo.addEventListener("change", () => {
    if (els.sameAsBillTo.checked) copyBillToToShipTo();
    setShipToLinkedState();
  });
  clientAddressFields.forEach((field) => {
    els[`billTo${field}`]?.addEventListener("input", () => {
      if (els.sameAsBillTo.checked) copyBillToToShipTo();
    });
  });
  els.exportInvoices.addEventListener("click", exportInvoices);
  els.assetTemplateSelect.addEventListener("change", () => {
    state.current.templateId = els.assetTemplateSelect.value;
    applyCurrentToForm();
    renderPreview();
    renderTemplateAssetPreview();
    persist();
  });
  els.templateAssetUpload.addEventListener("change", handleTemplateAssetUpload);
  els.metadataInput?.addEventListener("change", () => setMetadataFiles(els.metadataInput.files));
  els.metadataProcess?.addEventListener("click", processMetadataFiles);
  els.pdfCompressorInput?.addEventListener("change", () => setPdfCompressorFile(els.pdfCompressorInput.files?.[0]));
  els.pdfCompressorProcess?.addEventListener("click", processPdfCompression);
  bindUtilityDropZone(els.metadataDropZone, (files) => setMetadataFiles(files));
  bindUtilityDropZone(els.pdfCompressorDropZone, (files) => setPdfCompressorFile(files?.[0]));

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
  document.body.classList.remove("tool-open", "dashboard-light");
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
    state.current.cardExpiry = state.current.cardExpiry || "";
    state.current.pcsPlatform = state.current.pcsPlatform || "";
    state.current.pcsBoxWeight = state.current.pcsBoxWeight || "";
    state.current.pcsDeliveryService = state.current.pcsDeliveryService || "";
    state.current.pcsUnitCode = state.current.pcsUnitCode || "";
    state.current.pcsPaymentDetails = state.current.pcsPaymentDetails || "";
    state.current.pcsPostage = Number(state.current.pcsPostage ?? state.current.shippingAmount ?? 0);
    state.current.pcsDiscount = Number(state.current.pcsDiscount || 0);
    state.current.pcsCommodityCode = state.current.pcsCommodityCode || "4901990000";
    state.current.pcsCountryOfOrigin = state.current.pcsCountryOfOrigin || "GB";
    state.current.costcoMembershipNumber = state.current.costcoMembershipNumber || "";
    state.current.costcoCardExpiry = state.current.costcoCardExpiry || "";
    state.current.zoroCustomerNumber = state.current.zoroCustomerNumber || "";
    state.current.zoroTerms = state.current.zoroTerms || "Net 30";
    state.current.zoroDueDate = state.current.zoroDueDate || state.current.orderDate || "";
    state.current.zoroMailingAddress = state.current.zoroMailingAddress || "";
    state.current.zoroRemitTo = state.current.zoroRemitTo || "PO Box 5233\nJanesville, WI 53547-5233";
    state.current.zoroShippingMethod = state.current.zoroShippingMethod || "Standard Ground";
    state.current.zoroAmountDue = Number(state.current.zoroAmountDue || 0);
    state.current.clearanceKingVatNumber = state.current.clearanceKingVatNumber || "GB 446549856";
    state.current.sunskySalesperson = state.current.sunskySalesperson || "Tracy";
    state.current.sunskyRemarks = state.current.sunskyRemarks || "";
    state.current.justmaeVatNumber = state.current.justmaeVatNumber || "GB406201156";
    state.current.justmaePaypalFee = Number(state.current.justmaePaypalFee || 0);
    state.current.jellycatShippingMethod = state.current.jellycatShippingMethod || "";
    state.current.jellycatComments = state.current.jellycatComments || "";
    state.current.scrubDaddyVatNumber = state.current.scrubDaddyVatNumber || "GB193567567";
    state.current.scrubDaddyShippingService = state.current.scrubDaddyShippingService || "Delivery";
    state.current.bestwayVatNumber = state.current.bestwayVatNumber || "GB 398 6193 89";
    state.current.bestwayInvoiceDate = state.current.bestwayInvoiceDate || state.current.orderDate || "";
    state.current.bestwayPaymentStatus = state.current.bestwayPaymentStatus || "PAID";
    state.current.paperstoneReceiptNumber = state.current.paperstoneReceiptNumber || state.current.invoiceNumber || "";
    state.current.paperstoneAccountNumber = state.current.paperstoneAccountNumber || "";
    state.current.paperstoneVatNumber = state.current.paperstoneVatNumber || "GB 843 6297 05";
    state.current.paperstoneCompanyNumber = state.current.paperstoneCompanyNumber || "GB5214658";
    state.current.paperstonePaymentNote = state.current.paperstonePaymentNote || "You have already paid so no further action is required";
    state.current.sephoraUsaCustomerCount = Math.max(1, Number(state.current.sephoraUsaCustomerCount || 1));
    state.current.sephoraUsaDiscount = Math.max(0, Number(state.current.sephoraUsaDiscount || 0));
    state.current.mastertradeShipDate = state.current.mastertradeShipDate || state.current.orderDate || "";
    state.current.mastertradeDiscountRate = Number(state.current.mastertradeDiscountRate ?? 10);
    state.current.mastertradeCardholder = state.current.mastertradeCardholder || state.current.clientName || "";
    state.current.mastertradePaymentStatus = state.current.mastertradePaymentStatus || "PAID IN FULL";
    state.current.unfiDeliveryNumber = state.current.unfiDeliveryNumber || "";
    state.current.unfiSalesOrderNumber = state.current.unfiSalesOrderNumber || "";
    state.current.unfiFreightTerms = state.current.unfiFreightTerms || "PREPAID";
    state.current.unfiIncoTerms = state.current.unfiIncoTerms || "DDP Destination";
    state.current.unfiCarrier = state.current.unfiCarrier || "See Notes";
    state.current.unfiPageLabel = state.current.unfiPageLabel || "1 of 1";
    state.current.unfiVatNumber = state.current.unfiVatNumber || "GB736734610";
    state.current.unfiShipToCode = state.current.unfiShipToCode || "";
    state.current.unfiBillToCode = state.current.unfiBillToCode || "";
    state.current.unfiDiscount = Number(state.current.unfiDiscount || 0);
    state.current.amountPaid = state.current.amountPaid ?? null;
    state.current.testMode = false;
    state.current.items = (state.current.items || []).map((item) => ({
      sku: item.sku || "",
      product: item.product || "",
      description: item.description || "",
      qty: Number(item.qty || 1),
      unit: Number(item.unit || 0),
      pack: Math.max(1, Number(item.pack || 1)),
      vatCode: item.vatCode || "S"
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
    cardExpiry: "",
    pcsPlatform: "",
    pcsBoxWeight: "",
    pcsDeliveryService: "",
    pcsUnitCode: "",
    pcsPaymentDetails: "",
    pcsPostage: 0,
    pcsDiscount: 0,
    pcsCommodityCode: "4901990000",
    pcsCountryOfOrigin: "GB",
    costcoMembershipNumber: "",
    costcoCardExpiry: "",
    zoroCustomerNumber: "",
    zoroTerms: "Net 30",
    zoroDueDate: "",
    zoroMailingAddress: "",
    zoroRemitTo: "PO Box 5233\nJanesville, WI 53547-5233",
    zoroShippingMethod: "Standard Ground",
    zoroAmountDue: 0,
    clearanceKingVatNumber: "GB 446549856",
    sunskySalesperson: "Tracy",
    sunskyRemarks: "",
    justmaeVatNumber: "GB406201156",
    justmaePaypalFee: 0,
    jellycatShippingMethod: "",
    jellycatComments: "",
    scrubDaddyVatNumber: "GB193567567",
    scrubDaddyShippingService: "Delivery",
    bestwayVatNumber: "GB 398 6193 89",
    bestwayInvoiceDate: "",
    bestwayPaymentStatus: "PAID",
    paperstoneReceiptNumber: "",
    paperstoneAccountNumber: "",
    paperstoneVatNumber: "GB 843 6297 05",
    paperstoneCompanyNumber: "GB5214658",
    paperstonePaymentNote: "You have already paid so no further action is required",
    sephoraUsaCustomerCount: 1,
    sephoraUsaDiscount: 0,
    mastertradeShipDate: "",
    mastertradeDiscountRate: 10,
    mastertradeCardholder: "",
    mastertradePaymentStatus: "PAID IN FULL",
    unfiDeliveryNumber: "",
    unfiSalesOrderNumber: "",
    unfiFreightTerms: "PREPAID",
    unfiIncoTerms: "DDP Destination",
    unfiCarrier: "See Notes",
    unfiPageLabel: "1 of 1",
    unfiVatNumber: "GB736734610",
    unfiShipToCode: "",
    unfiBillToCode: "",
    unfiDiscount: 0,
    amountPaid: null,
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

const invoiceAddressFieldIds = {
  billTo: {
    name: "invoiceBillToName",
    company: "invoiceBillToCompany",
    street: "invoiceBillToStreet",
    city: "invoiceBillToCity",
    state: "invoiceBillToState",
    postal: "invoiceBillToPostal",
    country: "invoiceBillToCountry",
    phone: "invoiceBillToPhone"
  },
  shipTo: {
    name: "invoiceShipToName",
    company: "invoiceShipToCompany",
    street: "invoiceShipToStreet",
    city: "invoiceShipToCity",
    state: "invoiceShipToState",
    postal: "invoiceShipToPostal",
    country: "invoiceShipToCountry",
    phone: "invoiceShipToPhone"
  }
};

function readInvoiceStructuredAddress(type) {
  return Object.fromEntries(
    Object.entries(invoiceAddressFieldIds[type]).map(([field, id]) => [field, String(els[id]?.value || "").trim()])
  );
}

function normalizePaperstoneAddressFields(fields, fallbackValue) {
  const fallbackLines = String(fallbackValue || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 4);
  const source = fields && Object.values(fields).some(Boolean) ? fields : {};
  return {
    name: String(source.name || source.company || fallbackLines[0] || "").trim(),
    company: "",
    street: String(source.street || fallbackLines[1] || "").trim(),
    city: String(source.city || fallbackLines[2] || "").trim(),
    state: "",
    postal: String(source.postal || source.country || fallbackLines[3] || "").trim(),
    country: "",
    phone: ""
  };
}

function formatPaperstoneAddressValue(fields) {
  return [fields.name, fields.street, fields.city, fields.postal].filter(Boolean).join("\n");
}

function parseInvoiceAddress(value) {
  const lines = String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (!lines.length) return {};

  const phoneIndex = lines.findIndex((line) => /^(phone|tel|telephone|t)\s*:/i.test(line));
  const phone = phoneIndex >= 0 ? lines.splice(phoneIndex, 1)[0].replace(/^[^:]+:\s*/, "") : "";
  const name = lines.shift() || "";
  const country = lines.length ? lines.pop() || "" : "";
  const company = lines.length >= 3 ? lines.shift() || "" : "";
  const street = lines.shift() || "";
  const cityParts = lines.join(", ").split(",").map((part) => part.trim()).filter(Boolean);
  return {
    name,
    company,
    street,
    city: cityParts[0] || "",
    state: cityParts.length > 2 ? cityParts[1] : "",
    postal: cityParts.length > 2 ? cityParts.slice(2).join(", ") : cityParts[1] || "",
    country,
    phone
  };
}

function populateInvoiceStructuredAddress(type, fields, fallbackValue, isPaperstone = false) {
  const address = isPaperstone
    ? normalizePaperstoneAddressFields(fields, fallbackValue)
    : fields && Object.values(fields).some(Boolean) ? fields : parseInvoiceAddress(fallbackValue);
  Object.entries(invoiceAddressFieldIds[type]).forEach(([field, id]) => {
    if (els[id]) els[id].value = address?.[field] || "";
  });
}

function clearInvoiceStructuredAddress(type) {
  if (!invoiceAddressFieldIds[type]) return;
  Object.values(invoiceAddressFieldIds[type]).forEach((id) => {
    if (els[id]) els[id].value = "";
  });
}

function applyCurrentToForm() {
  const invoice = state.current;
  applyTemplateFieldVisibility(invoice.templateId);
  const isPaperstone = invoice.templateId === "paperstone";
  document.querySelectorAll("[data-paperstone-address-extra]").forEach((field) => {
    field.hidden = isPaperstone;
  });
  document.querySelectorAll("[data-paperstone-address-name-label]").forEach((label) => {
    label.textContent = isPaperstone ? "Person Name / Company Name" : "Name";
  });
  els.invoiceNumberLabel.textContent = isPaperstone ? "Invoice" : "Invoice #";
  els.orderDateLabel.textContent = isPaperstone ? "Date" : "Order Date";
  els.poNumberLabel.textContent = isPaperstone ? "Your Order No" : "PO Number";
  els.billToLabel.textContent = isPaperstone ? "Invoice Address" : "Bill To";
  els.shipToLabel.textContent = isPaperstone ? "Delivery Address" : "Ship To";
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
  populateInvoiceStructuredAddress("billTo", invoice.billToFields, invoice.billTo, isPaperstone);
  populateInvoiceStructuredAddress("shipTo", invoice.shipToFields, invoice.shipTo, isPaperstone);
  els.paymentDetails.value = invoice.paymentDetails || "";
  els.paymentMethod.value = invoice.paymentMethod || "";
  els.trackingId.value = invoice.trackingId || "";
  els.orderId.value = invoice.orderId || "";
  els.invoiceCardExpiry.value = invoice.cardExpiry || "";
  els.pcsPlatform.value = invoice.pcsPlatform || "";
  els.pcsBoxWeight.value = invoice.pcsBoxWeight || "";
  els.pcsDeliveryService.value = invoice.pcsDeliveryService || "";
  els.pcsUnitCode.value = invoice.pcsUnitCode || "";
  els.pcsPaymentDetails.value = invoice.pcsPaymentDetails || "";
  els.pcsPostage.value = Number(invoice.pcsPostage ?? invoice.shippingAmount ?? 0);
  els.pcsDiscount.value = Number(invoice.pcsDiscount || 0);
  els.pcsCommodityCode.value = invoice.pcsCommodityCode || "4901990000";
  els.pcsCountryOfOrigin.value = invoice.pcsCountryOfOrigin || "GB";
  els.costcoMembershipNumber.value = invoice.costcoMembershipNumber || "";
  els.costcoCardExpiry.value = invoice.costcoCardExpiry || "";
  els.zoroCustomerNumber.value = invoice.zoroCustomerNumber || "";
  els.zoroTerms.value = invoice.zoroTerms || "Net 30";
  els.zoroDueDate.value = invoice.zoroDueDate || invoice.orderDate || "";
  els.zoroMailingAddress.value = invoice.zoroMailingAddress || "";
  els.zoroRemitTo.value = invoice.zoroRemitTo || "";
  els.zoroShippingMethod.value = invoice.zoroShippingMethod || "Standard Ground";
  els.zoroAmountDue.value = Number(invoice.zoroAmountDue || 0);
  els.clearanceKingVatNumber.value = invoice.clearanceKingVatNumber || "GB 446549856";
  els.sunskySalesperson.value = invoice.sunskySalesperson || "Tracy";
  els.sunskyRemarks.value = invoice.sunskyRemarks || "";
  els.justmaeVatNumber.value = invoice.justmaeVatNumber || "GB406201156";
  els.justmaePaypalFee.value = Number(invoice.justmaePaypalFee || 0);
  els.jellycatShippingMethod.value = invoice.jellycatShippingMethod || "";
  els.jellycatComments.value = invoice.jellycatComments || "";
  els.scrubDaddyVatNumber.value = invoice.scrubDaddyVatNumber || "GB193567567";
  els.scrubDaddyShippingService.value = invoice.scrubDaddyShippingService || "Delivery";
  els.bestwayVatNumber.value = invoice.bestwayVatNumber || "GB 398 6193 89";
  els.bestwayInvoiceDate.value = invoice.bestwayInvoiceDate || invoice.orderDate || "";
  els.bestwayPaymentStatus.value = invoice.bestwayPaymentStatus || "PAID";
  els.paperstoneReceiptNumber.value = invoice.paperstoneReceiptNumber || invoice.invoiceNumber || "";
  els.paperstoneAccountNumber.value = invoice.paperstoneAccountNumber || "";
  els.paperstoneVatNumber.value = invoice.paperstoneVatNumber || "GB 843 6297 05";
  els.paperstoneCompanyNumber.value = invoice.paperstoneCompanyNumber || "GB5214658";
  els.paperstonePaymentNote.value = invoice.paperstonePaymentNote || "You have already paid so no further action is required";
  els.sephoraUsaCustomerCount.value = Math.max(1, Number(invoice.sephoraUsaCustomerCount || 1));
  els.sephoraUsaDiscount.value = Math.max(0, Number(invoice.sephoraUsaDiscount || 0));
  els.mastertradeShipDate.value = invoice.mastertradeShipDate || invoice.orderDate || "";
  els.mastertradeDiscountRate.value = Number(invoice.mastertradeDiscountRate ?? 10);
  els.mastertradeCardholder.value = invoice.mastertradeCardholder || invoice.clientName || "";
  els.mastertradePaymentStatus.value = invoice.mastertradePaymentStatus || "PAID IN FULL";
  els.unfiDeliveryNumber.value = invoice.unfiDeliveryNumber || "";
  els.unfiSalesOrderNumber.value = invoice.unfiSalesOrderNumber || "";
  els.unfiFreightTerms.value = invoice.unfiFreightTerms || "PREPAID";
  els.unfiIncoTerms.value = invoice.unfiIncoTerms || "DDP Destination";
  els.unfiCarrier.value = invoice.unfiCarrier || "See Notes";
  els.unfiPageLabel.value = invoice.unfiPageLabel || "1 of 1";
  els.unfiVatNumber.value = invoice.unfiVatNumber || "GB736734610";
  els.unfiShipToCode.value = invoice.unfiShipToCode || "";
  els.unfiBillToCode.value = invoice.unfiBillToCode || "";
  els.unfiDiscount.value = Number(invoice.unfiDiscount || 0);
  els.amountPaid.value = invoice.amountPaid ?? "";
  els.amountPaidField.hidden = invoice.templateId !== "cosmetix" && invoice.templateId !== "bulkbuyamerica";
  els.pcsBooksFields.hidden = invoice.templateId !== "pcsbooks";
  els.costcoUkFields.hidden = invoice.templateId !== "costcouk";
  els.zoroFields.hidden = invoice.templateId !== "zoro";
  els.clearanceKingFields.hidden = invoice.templateId !== "clearanceking";
  els.sunskyFields.hidden = invoice.templateId !== "sunsky";
  els.justmaeFields.hidden = invoice.templateId !== "justmae";
  els.jellycatFields.hidden = invoice.templateId !== "jellycat";
  els.scrubDaddyFields.hidden = invoice.templateId !== "scrubdaddy";
  els.bestwayFields.hidden = invoice.templateId !== "bestway";
  els.paperstoneFields.hidden = invoice.templateId !== "paperstone";
  els.sephoraUsaFields.hidden = invoice.templateId !== "sephorausa";
  els.mastertradeFields.hidden = invoice.templateId !== "mastertrade";
  els.unfiFields.hidden = invoice.templateId !== "unfi";
  els.cardType.value = invoice.cardType;
  els.cardEnding.value = invoice.cardEnding;
  els.taxRate.value = invoice.taxRate;
  els.shippingAmount.value = invoice.shippingAmount;
  els.testMode.checked = invoice.testMode === true;
  renderClientWorkflowSelectors();
  updateBuilderTemplateLocks();
  window.refreshCustomSelects?.();
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
  state.current.billToFields = readInvoiceStructuredAddress("billTo");
  state.current.shipToFields = readInvoiceStructuredAddress("shipTo");
  const isPaperstone = state.current.templateId === "paperstone";
  state.current.billToFields = isPaperstone
    ? normalizePaperstoneAddressFields(state.current.billToFields, state.current.billTo)
    : state.current.billToFields;
  state.current.shipToFields = isPaperstone
    ? normalizePaperstoneAddressFields(state.current.shipToFields, state.current.shipTo)
    : state.current.shipToFields;
  state.current.billTo = isPaperstone
    ? formatPaperstoneAddressValue(state.current.billToFields)
    : formatStructuredAddress(state.current.billToFields);
  state.current.shipTo = isPaperstone
    ? formatPaperstoneAddressValue(state.current.shipToFields)
    : formatStructuredAddress(state.current.shipToFields);
  els.billTo.value = state.current.billTo;
  els.shipTo.value = state.current.shipTo;
  state.current.paymentDetails = els.paymentDetails.value;
  state.current.paymentMethod = els.paymentMethod.value;
  state.current.trackingId = els.trackingId.value;
  state.current.orderId = els.orderId.value;
  state.current.cardExpiry = formatCardExpiryInput(els.invoiceCardExpiry.value);
  state.current.pcsPlatform = els.pcsPlatform.value;
  state.current.pcsBoxWeight = els.pcsBoxWeight.value;
  state.current.pcsDeliveryService = els.pcsDeliveryService.value;
  state.current.pcsUnitCode = els.pcsUnitCode.value;
  state.current.pcsPaymentDetails = els.pcsPaymentDetails.value;
  state.current.pcsPostage = Number(els.pcsPostage.value || 0);
  state.current.pcsDiscount = Number(els.pcsDiscount.value || 0);
  state.current.pcsCommodityCode = els.pcsCommodityCode.value;
  state.current.pcsCountryOfOrigin = els.pcsCountryOfOrigin.value;
  state.current.costcoMembershipNumber = els.costcoMembershipNumber.value.replace(/\D/g, "").slice(0, 20);
  state.current.costcoCardExpiry = formatCardExpiryInput(els.costcoCardExpiry.value);
  state.current.zoroCustomerNumber = els.zoroCustomerNumber.value.trim();
  state.current.zoroTerms = els.zoroTerms.value.trim();
  state.current.zoroDueDate = els.zoroDueDate.value;
  state.current.zoroMailingAddress = els.zoroMailingAddress.value.trim();
  state.current.zoroRemitTo = els.zoroRemitTo.value.trim();
  state.current.zoroShippingMethod = els.zoroShippingMethod.value.trim();
  state.current.zoroAmountDue = Number(els.zoroAmountDue.value || 0);
  state.current.clearanceKingVatNumber = els.clearanceKingVatNumber.value.trim();
  state.current.sunskySalesperson = els.sunskySalesperson.value.trim();
  state.current.sunskyRemarks = els.sunskyRemarks.value.trim();
  state.current.justmaeVatNumber = els.justmaeVatNumber.value.trim();
  state.current.justmaePaypalFee = Number(els.justmaePaypalFee.value || 0);
  state.current.jellycatShippingMethod = els.jellycatShippingMethod.value.trim();
  state.current.jellycatComments = els.jellycatComments.value.trim();
  state.current.scrubDaddyVatNumber = els.scrubDaddyVatNumber.value.trim();
  state.current.scrubDaddyShippingService = els.scrubDaddyShippingService.value.trim();
  state.current.bestwayVatNumber = els.bestwayVatNumber.value.trim();
  state.current.bestwayInvoiceDate = els.bestwayInvoiceDate.value;
  state.current.bestwayPaymentStatus = els.bestwayPaymentStatus.value.trim();
  state.current.paperstoneReceiptNumber = els.paperstoneReceiptNumber.value.trim();
  state.current.paperstoneAccountNumber = els.paperstoneAccountNumber.value.trim();
  state.current.paperstoneVatNumber = els.paperstoneVatNumber.value.trim();
  state.current.paperstoneCompanyNumber = els.paperstoneCompanyNumber.value.trim();
  state.current.paperstonePaymentNote = els.paperstonePaymentNote.value.trim();
  state.current.sephoraUsaCustomerCount = Math.max(1, Number(els.sephoraUsaCustomerCount.value || 1));
  state.current.sephoraUsaDiscount = Math.max(0, Number(els.sephoraUsaDiscount.value || 0));
  state.current.mastertradeShipDate = els.mastertradeShipDate.value;
  state.current.mastertradeDiscountRate = Number(els.mastertradeDiscountRate.value || 0);
  state.current.mastertradeCardholder = els.mastertradeCardholder.value.trim();
  state.current.mastertradePaymentStatus = els.mastertradePaymentStatus.value.trim();
  state.current.unfiDeliveryNumber = els.unfiDeliveryNumber.value.trim();
  state.current.unfiSalesOrderNumber = els.unfiSalesOrderNumber.value.trim();
  state.current.unfiFreightTerms = els.unfiFreightTerms.value.trim();
  state.current.unfiIncoTerms = els.unfiIncoTerms.value.trim();
  state.current.unfiCarrier = els.unfiCarrier.value.trim();
  state.current.unfiPageLabel = els.unfiPageLabel.value.trim();
  state.current.unfiVatNumber = els.unfiVatNumber.value.trim();
  state.current.unfiShipToCode = els.unfiShipToCode.value.trim();
  state.current.unfiBillToCode = els.unfiBillToCode.value.trim();
  state.current.unfiDiscount = Number(els.unfiDiscount.value || 0);
  state.current.amountPaid = els.amountPaid.value === "" ? null : Number(els.amountPaid.value);
  els.pcsBooksFields.hidden = state.current.templateId !== "pcsbooks";
  els.costcoUkFields.hidden = state.current.templateId !== "costcouk";
  els.zoroFields.hidden = state.current.templateId !== "zoro";
  els.clearanceKingFields.hidden = state.current.templateId !== "clearanceking";
  els.sunskyFields.hidden = state.current.templateId !== "sunsky";
  els.justmaeFields.hidden = state.current.templateId !== "justmae";
  els.jellycatFields.hidden = state.current.templateId !== "jellycat";
  els.scrubDaddyFields.hidden = state.current.templateId !== "scrubdaddy";
  els.bestwayFields.hidden = state.current.templateId !== "bestway";
  els.paperstoneFields.hidden = state.current.templateId !== "paperstone";
  els.sephoraUsaFields.hidden = state.current.templateId !== "sephorausa";
  els.mastertradeFields.hidden = state.current.templateId !== "mastertrade";
  els.unfiFields.hidden = state.current.templateId !== "unfi";
  els.amountPaidField.hidden = state.current.templateId !== "cosmetix" && state.current.templateId !== "bulkbuyamerica";
  state.current.cardType = els.cardType.value;
  state.current.cardEnding = els.cardEnding.value.replace(/\D/g, "").slice(0, 4);
  state.current.taxRate = Number(els.taxRate.value || 0);
  state.current.shippingAmount = Number(els.shippingAmount.value || 0);
  state.current.testMode = els.testMode.checked;

  els.cardEnding.value = state.current.cardEnding;
  els.invoiceCardExpiry.value = state.current.cardExpiry;
  els.costcoMembershipNumber.value = state.current.costcoMembershipNumber;
  els.costcoCardExpiry.value = state.current.costcoCardExpiry;
  document.querySelectorAll(".costco-readonly-rate").forEach((input) => {
    input.value = `${state.current.taxRate}%`;
  });
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
  if (els.bulkCaseTemplateFilter) {
    const selectedFilter = els.bulkCaseTemplateFilter.value;
    els.bulkCaseTemplateFilter.innerHTML = `<option value="">All templates</option>${options}`;
    els.bulkCaseTemplateFilter.value = selectedFilter;
  }
  renderBuilderTemplateChoices();
}

function renderBuilderTemplateChoices() {
  if (!els.singleTemplateGrid || !els.bulkTemplateGrid) return;

  const templateIcon = (template) => {
    const name = template.name.toLowerCase();
    if (name.includes("zoro")) return "wrench";
    if (name.includes("supplement")) return "pill";
    if (name.includes("electronic")) return "cpu";
    if (name.includes("vet")) return "dog";
    if (name.includes("cash") || name.includes("carry")) return "boxes";
    if (name.includes("central")) return "globe";
    if (name.includes("pound")) return "receipt";
    if (name.includes("superstore")) return "store";
    return "package";
  };

  const cardMarkup = (target) =>
    templates
      .map(
        (template) => `
          <button class="builder-template-choice" data-${target}-template-id="${template.id}" type="button" style="--template-color: ${template.color}">
            <span>${escapeHtml(template.initials)}</span>
            <strong>${escapeHtml(template.name)}</strong>
            <small>${escapeHtml(template.region)}</small>
            <i class="template-card-icon" data-lucide="${templateIcon(template)}" aria-hidden="true"></i>
          </button>
        `
      )
      .join("");

  els.singleTemplateGrid.innerHTML = cardMarkup("single");
  els.bulkTemplateGrid.innerHTML = cardMarkup("bulk");
  window.lucide?.createIcons({ attrs: { "aria-hidden": "true" } });
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
  if (templateId === "tw") {
    const today = new Date();
    const delivery = new Date(today);
    delivery.setDate(today.getDate() + 2);
    state.current.currency = "GBP";
    state.current.invoiceNumber = `TW-${today.getFullYear()}-${String(Date.now()).slice(-6)}`;
    state.current.orderDate = formatDate(today);
    state.current.deliveryDate = formatDate(delivery);
    state.current.poNumber = "WEB-ORDER";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = state.current.clientName || "Trade Customer";
    state.current.billTo = state.current.billTo || "Trade Customer\nBusiness Address\nTown / City\nPostcode\nUnited Kingdom";
    state.current.shipTo = state.current.shipTo || state.current.billTo;
    state.current.paymentDetails = "Payment received";
    state.current.paymentMethod = "Card";
    state.current.trackingId = "";
    state.current.orderId = `TW${String(Date.now()).slice(-7)}`;
    state.current.cardType = "Visa";
    state.current.cardEnding = "";
    state.current.cardExpiry = "";
    state.current.taxRate = 20;
    state.current.shippingAmount = 0;
    state.current.testMode = false;
    state.current.items = [
      {
        sku: "TW-1001",
        product: "",
        description: "Trade product description",
        qty: 1,
        unit: 10
      }
    ];
    return;
  }
  if (templateId === "zoro") {
    state.current.currency = "$";
    state.current.invoiceNumber = "INV2089415";
    state.current.orderDate = "2025-01-22";
    state.current.deliveryDate = "2025-01-22";
    state.current.poNumber = "";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = "Metaforge Innovations LLC";
    state.current.billTo = "Metaforge Innovations LLC\n1110 E Algonquin Rd\nApt 1G, Schaumburg\nIL 60173-4008\nUnited States";
    state.current.shipTo = state.current.billTo;
    state.current.paymentDetails = "Paid by card";
    state.current.paymentMethod = "Mastercard";
    state.current.trackingId = "";
    state.current.orderId = "SO13987105";
    state.current.cardType = "Mastercard";
    state.current.cardEnding = "8349";
    state.current.cardExpiry = "";
    state.current.zoroCustomerNumber = "CUST9355757";
    state.current.zoroTerms = "Net 30";
    state.current.zoroDueDate = "2025-01-22";
    state.current.zoroMailingAddress = "909\nAsbury Drive\nBuffalo Grove, IL 60089";
    state.current.zoroRemitTo = "PO Box 5233\nJanesville, WI 53547-5233";
    state.current.zoroShippingMethod = "Standard Ground";
    state.current.zoroAmountDue = 0;
    state.current.taxRate = 0;
    state.current.shippingAmount = 46;
    state.current.testMode = false;
    state.current.items = [
      { sku: "G1475661", product: "", description: "CELLCORE BIOSCIENCES KL Support - Drainage", qty: 30, unit: 13.9 },
      { sku: "G713771904", product: "", description: "Nu Skin Pharmanex Marine Omega MarineOmega, 120 Softgel", qty: 35, unit: 15.5 },
      { sku: "G513337096", product: "", description: "SeroVital Age Renewal Complex, 120 ct Reverse", qty: 20, unit: 24.95 }
    ];
    return;
  }
  if (templateId === "luxurysouq") {
    const stamp = String(Date.now());
    state.current.currency = "GBP";
    state.current.invoiceNumber = `${stamp.slice(-2)}-${stamp.slice(-4, -2)}-${stamp.slice(-6, -4)}`;
    state.current.orderDate = formatDate(new Date());
    state.current.deliveryDate = formatDate(new Date());
    state.current.poNumber = "";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = state.current.clientName || "Customer Name";
    state.current.billTo = state.current.billTo || "Customer Name\n12 River Road\nLisburn, Antrim BT27 4SD\n+44 7949 319593";
    state.current.shipTo = state.current.shipTo || state.current.billTo;
    state.current.paymentDetails = "";
    state.current.paymentMethod = "Mastercard";
    state.current.trackingId = "";
    state.current.orderId = "";
    state.current.cardType = "Mastercard";
    state.current.cardEnding = "4331";
    state.current.cardExpiry = "11/29";
    state.current.taxRate = 0;
    state.current.shippingAmount = 48;
    state.current.testMode = false;
    state.current.items = [
      { sku: "86791", product: "", description: "Seiko 5 7009 Japan Automatic 17 Jewels Day/Date Salmon Men's Watch", qty: 2, unit: 48 },
      { sku: "73186", product: "", description: "Seiko 5 Japan Automatic 21 Jewels Day/Date Railway Time Gold Men's Watch", qty: 1, unit: 50.22 },
      { sku: "43170", product: "", description: "Seiko 5 Japan Automatic 7009 Day/Date Railway Time White Men's Watch", qty: 2, unit: 40 }
    ];
    return;
  }
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
  if (templateId === "pcsbooks") {
    const today = new Date();
    const due = new Date(today);
    due.setDate(today.getDate() + 14);
    state.current.currency = "GBP";
    state.current.invoiceNumber = `PCS-${today.getFullYear()}-${String(Date.now()).slice(-5)}`;
    state.current.orderDate = formatDate(today);
    state.current.deliveryDate = formatDate(due);
    state.current.poNumber = "BOOK-1001";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = state.current.clientName || "";
    state.current.billTo = state.current.billTo || "";
    state.current.shipTo = state.current.shipTo || "";
    state.current.paymentDetails = state.current.paymentDetails || "Card payment";
    state.current.paymentMethod = "Card";
    state.current.trackingId = "";
    state.current.orderId = "";
    state.current.pcsPlatform = "SFY";
    state.current.pcsBoxWeight = "SP1134 - 17.25 kg";
    state.current.pcsDeliveryService = "Tracked 48";
    state.current.pcsUnitCode = "Unit 8 / A-88";
    state.current.pcsPaymentDetails = "Mastercard ending in 9463";
    state.current.pcsPostage = 30;
    state.current.pcsDiscount = 0;
    state.current.pcsCommodityCode = "4901990000";
    state.current.pcsCountryOfOrigin = "GB";
    state.current.cardType = "Mastercard";
    state.current.cardEnding = "9463";
    state.current.taxRate = 0;
    state.current.shippingAmount = 30;
    state.current.testMode = false;
    state.current.items = [
      { sku: "Unit 8 / A-88", product: "Holy Bible: King James Version", description: "Leather Bound", qty: 15, unit: 10 }
    ];
    return;
  }
  if (templateId === "cosmetix") {
    state.current.currency = "$";
    state.current.invoiceNumber = "24467";
    state.current.orderDate = "2023-02-20";
    state.current.deliveryDate = "2023-02-20";
    state.current.poNumber = "";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = state.current.clientName || "Kami John";
    state.current.billTo = state.current.billTo || "ADAM FLEET LLC\n1005 SALERNO WAY\nHOWELL TOWNSHIP NJ 07731\nEmail: info@adamfleetcollection.com\nPhone: (740) 467-9889";
    state.current.shipTo = state.current.shipTo || "Talha Khan\nA2Z PREP SERVICES\n5765-F Burke center\nPkwy #189 Burke VA, 22015\nEmail: info@a2zprepservices.com\nPhone: (210) 741-4126";
    state.current.paymentDetails = "Thank you for your purchase.";
    state.current.paymentMethod = "Credit Card";
    state.current.trackingId = "";
    state.current.orderId = "24467";
    state.current.cardType = "Visa";
    state.current.cardEnding = "";
    state.current.taxRate = 0;
    state.current.shippingAmount = 56.9;
    state.current.amountPaid = 1406.9;
    state.current.testMode = false;
    state.current.items = [
      {
        sku: "B08G59HFZ7",
        product: "Estee Lauder Advanced Night Repair 100ml",
        description: "Hydrating Multi-Recovery Cream for Wrinkles and Wholebody",
        qty: 30,
        unit: 45
      }
    ];
    return;
  }
  if (templateId === "costcouk") {
    const today = new Date();
    const orderDate = new Date(today);
    orderDate.setDate(today.getDate() - 2);
    state.current.currency = "GBP";
    state.current.invoiceNumber = `${String(Date.now()).slice(-8)}-1`;
    state.current.orderDate = formatDate(today);
    state.current.deliveryDate = formatDate(orderDate);
    state.current.poNumber = String(Date.now()).slice(-10);
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = state.current.clientName || "Customer Name";
    state.current.billTo = state.current.billTo || "Customer Name\n98 Example Road\nGlasgow G67 2QH\nUnited Kingdom\n+44 7700 900000";
    state.current.shipTo = state.current.shipTo || "Customer Name\n247 Example Road\nGlasgow G67 3AT\nUnited Kingdom\n+44 7700 900000";
    state.current.paymentDetails = "";
    state.current.paymentMethod = "Card";
    state.current.trackingId = "";
    state.current.orderId = state.current.poNumber;
    state.current.costcoMembershipNumber = state.current.costcoMembershipNumber || "123456789012";
    state.current.costcoCardExpiry = state.current.costcoCardExpiry || "06/29";
    state.current.cardType = "Mastercard";
    state.current.cardEnding = "7762";
    state.current.taxRate = 20;
    state.current.shippingAmount = 0;
    state.current.testMode = false;
    state.current.items = [
      {
        sku: "836214",
        product: "",
        description: "Warehouse product description",
        qty: 25,
        unit: 3.81
      }
    ];
    return;
  }
  if (templateId === "qogitauk") {
    state.current.currency = "GBP";
    state.current.invoiceNumber = "R7K9K9S3Q6Y";
    state.current.orderDate = "2026-03-09";
    state.current.deliveryDate = "2026-03-09";
    state.current.poNumber = "";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = "Ali Bangash";
    state.current.billTo = "Ali Bangash\n1 Ivinghoe Road\nDagenham, Essex RM8 2NB\nUnited Kingdom\n+44 7930686653";
    state.current.shipTo = state.current.billTo;
    state.current.paymentDetails = "Paid in Full";
    state.current.paymentMethod = "Mastercard";
    state.current.trackingId = "";
    state.current.orderId = "JH8TQZ62";
    state.current.cardType = "Mastercard";
    state.current.cardEnding = "4593";
    state.current.cardExpiry = "03/30";
    state.current.taxRate = 20;
    state.current.shippingAmount = 35;
    state.current.testMode = false;
    state.current.items = [
      { sku: "EM572P", product: "8800256119066", description: "Medicube Zero Pore Pad 2.0 - 70 Pieces", qty: 100, unit: 5.82 }
    ];
    return;
  }
  if (templateId === "clearanceking") {
    state.current.currency = "GBP";
    state.current.invoiceNumber = "1000029104";
    state.current.orderDate = "2026-06-26";
    state.current.deliveryDate = "2026-06-26";
    state.current.poNumber = "";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = "Mr Muhammad Umair Ali";
    state.current.billTo = "Mr Muhammad Umair Ali\nthe ultimate outlet ltd\n159 dagenham road\nlondon, rm7 0tl\nUnited Kingdom\nT: 07466313452";
    state.current.shipTo = state.current.billTo;
    state.current.paymentDetails = "Credit Cards / Debit Card (The Card Must be registered within the UK otherwise payment will be Rejected and Charges May Apply)";
    state.current.paymentMethod = "Credit Cards / Debit Card";
    state.current.trackingId = "Delivery - Delivery - Order will be dispatched within 2-6 working days";
    state.current.orderId = "11000041003";
    state.current.clearanceKingVatNumber = "GB 446549856";
    state.current.cardType = "Visa";
    state.current.cardEnding = "";
    state.current.cardExpiry = "";
    state.current.taxRate = 20;
    state.current.shippingAmount = 9.99;
    state.current.testMode = false;
    state.current.items = [
      {
        sku: "75537",
        product: "6990314575537",
        description: "Children Fashion Face Mask - Reusable - Assorted Colours & Designs",
        qty: 20,
        unit: 0.2
      }
    ];
    return;
  }
  if (templateId === "sunsky") {
    state.current.currency = "GBP";
    state.current.invoiceNumber = "2109861742";
    state.current.orderDate = "2025-12-15";
    state.current.deliveryDate = "2025-12-15";
    state.current.poNumber = "";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = "";
    state.current.billTo = "Name: Bedcircle Ltd\nAddress: 19 Crabtree Avenue\nHeckmondwike\nPostal Code: WF16 9PH\nCountry: United Kingdom\nTelephone: +44 7359 603695";
    state.current.shipTo = "Name: Bedcircle Ltd\nAddress: 19 Crabtree Avenue\nHeckmondwike\nPostal Code: WF16 9PH\nCountry: United Kingdom\nTelephone: +44 7359 603695";
    state.current.paymentDetails = "Paid in Full";
    state.current.paymentMethod = "Mastercard";
    state.current.trackingId = "";
    state.current.orderId = "";
    state.current.cardType = "Mastercard";
    state.current.cardEnding = "1693";
    state.current.cardExpiry = "01/31";
    state.current.sunskySalesperson = "Tracy";
    state.current.sunskyRemarks = "Shenzhen to U.K by Yun Express";
    state.current.taxRate = 0;
    state.current.shippingAmount = 138;
    state.current.testMode = false;
    state.current.items = [
      { sku: "KTX-RM17", product: "8517629090", description: "Samsung Galaxy Smart Ring Heart Rate Blood Oxygen Monitor - Black 7", qty: 30, unit: 4.94 },
      { sku: "VQP-HN28", product: "8517629090", description: "Samsung Galaxy Smart Ring Heart Rate Blood Oxygen Monitor - Black 8", qty: 23, unit: 5.2 },
      { sku: "LFD-XC39", product: "8517629090", description: "Samsung Galaxy Smart Ring Heart Rate Blood Oxygen Monitor - Black 9", qty: 26, unit: 4.8 },
      { sku: "ZMR-TK46", product: "8517629090", description: "Samsung Galaxy Smart Ring Heart Rate Blood Oxygen Monitor - Black 10", qty: 14, unit: 5.6 },
      { sku: "BHW-NP51", product: "8517629090", description: "Samsung Galaxy Smart Ring Heart Rate Blood Oxygen Monitor - Black 11", qty: 18, unit: 4.6 },
      { sku: "QCY-RV63", product: "8517629090", description: "Samsung Galaxy Smart Ring Heart Rate Blood Oxygen Monitor - Black 12", qty: 33, unit: 5.4 },
      { sku: "JGT-MX72", product: "8517629090", description: "Samsung Galaxy Smart Ring Heart Rate Blood Oxygen Monitor - Black 13", qty: 38, unit: 5 },
      { sku: "PNK-DL84", product: "8517629090", description: "Samsung Galaxy Smart Ring Heart Rate Blood Oxygen Monitor - Gold 7", qty: 19, unit: 5.8 }
    ];
    return;
  }
  if (templateId === "justmae") {
    state.current.currency = "GBP";
    state.current.invoiceNumber = `JS${new Date().toISOString().slice(0, 10).replaceAll("-", "")}${String(Date.now()).slice(-4)}`;
    state.current.orderDate = formatDate(new Date());
    state.current.deliveryDate = formatDate(new Date());
    state.current.poNumber = "";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = state.current.clientName || "Sultan MANZOO";
    state.current.billTo = state.current.billTo || "254a, Lincoln Road\nPeterborough\nCambridgeshire\nPE1 2ND\nUnited Kingdom";
    state.current.shipTo = state.current.shipTo || state.current.billTo;
    state.current.paymentDetails = "";
    state.current.paymentMethod = "paypal";
    state.current.trackingId = "";
    state.current.orderId = "";
    state.current.justmaeVatNumber = "GB406201156";
    state.current.justmaePaypalFee = 0.89;
    state.current.cardType = "Visa";
    state.current.cardEnding = "";
    state.current.taxRate = 20;
    state.current.shippingAmount = 4;
    state.current.testMode = false;
    state.current.items = [
      {
        sku: "",
        product: "",
        description: "High Quality USB 8pin Data Sync Charging Cable for iPhone 11 12 13 14 Series",
        qty: 20,
        unit: 0.62
      }
    ];
    return;
  }
  if (templateId === "jellycat") {
    state.current.currency = "GBP";
    state.current.invoiceNumber = "403433111";
    state.current.orderDate = "2026-04-17";
    state.current.deliveryDate = "2026-04-21";
    state.current.poNumber = "";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = "Raja Yasir Mehmood";
    state.current.billTo = "Raja Yasir Mehmood\nYF STORE LTD\n78 Croftmont Avenue\nGlasgow, Scotland G44 5LH\nUnited Kingdom\nPhone: 07438 615194\nEmail: customer@example.com";
    state.current.shipTo = state.current.billTo;
    state.current.paymentDetails = "";
    state.current.paymentMethod = "PayPal";
    state.current.trackingId = "";
    state.current.orderId = "403433111";
    state.current.jellycatShippingMethod = "Standard - Royal Mail (estimated delivery within 4 days Mon-Sat)";
    state.current.jellycatComments = "";
    state.current.cardType = "Visa";
    state.current.cardEnding = "";
    state.current.cardExpiry = "";
    state.current.taxRate = 20;
    state.current.shippingAmount = 5;
    state.current.testMode = false;
    state.current.items = [
      { sku: "PNS3PN", product: "Small", description: "Peanut Penguin", qty: 1, unit: 15 }
    ];
    return;
  }
  if (templateId === "scrubdaddy") {
    state.current.currency = "GBP";
    state.current.invoiceNumber = "247";
    state.current.orderDate = "2026-06-23";
    state.current.deliveryDate = "2026-06-22";
    state.current.poNumber = "";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = "Value Junction";
    state.current.billTo = "Value Junction\n159 Dagenham Road\nRomford\nRM7 0TL\numair.ali78657@gmail.com\n07828724976";
    state.current.shipTo = state.current.billTo;
    state.current.paymentDetails = "";
    state.current.paymentMethod = "Paypal Express Checkout";
    state.current.trackingId = "";
    state.current.orderId = "SD45006";
    state.current.scrubDaddyVatNumber = "GB193567567";
    state.current.scrubDaddyShippingService = "Delivery";
    state.current.cardType = "Visa";
    state.current.cardEnding = "";
    state.current.cardExpiry = "";
    state.current.taxRate = 20;
    state.current.shippingAmount = 4;
    state.current.testMode = false;
    state.current.items = [
      { sku: "SDWSHI", product: "0.572kg", description: "Wonder Wash-Up", qty: 1, unit: 1.99 }
    ];
    return;
  }
  if (templateId === "mastertrade") {
    state.current.currency = "GBP";
    state.current.invoiceNumber = "7913731";
    state.current.orderDate = "2025-09-10";
    state.current.mastertradeShipDate = "2025-09-12";
    state.current.deliveryDate = "2025-09-17";
    state.current.poNumber = "";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = "JAYAKESHAV LTD";
    state.current.billTo = "JAYAKESHAV LTD\nSANDEEP REDDY\n65a Clifford Road\nHounslow, TW4 7LR\nUnited Kingdom";
    state.current.shipTo = "JAYAKESHAV LTD\nSANDEEP REDDY\n14 Portville Road\nManchester, M19 3DN\nUnited Kingdom";
    state.current.paymentDetails = "";
    state.current.paymentMethod = "VISA";
    state.current.trackingId = "";
    state.current.orderId = "";
    state.current.mastertradeDiscountRate = 10;
    state.current.mastertradeCardholder = "SANDEEP REDDY";
    state.current.mastertradePaymentStatus = "PAID IN FULL";
    state.current.cardType = "Visa";
    state.current.cardEnding = "7575";
    state.current.cardExpiry = "";
    state.current.taxRate = 20;
    state.current.shippingAmount = 9.99;
    state.current.testMode = false;
    state.current.items = [
      { sku: "", product: "", description: "500W Smoke Machine Fog Mist Haze Hazer Effect 3 LED RGB For Disco Party Club", qty: 10, unit: 13.99 },
      { sku: "", product: "", description: "1200W LED Fog Machine Fog Machine Disco Party Xmas Effect with Remote Control", qty: 10, unit: 22.99 },
      { sku: "", product: "", description: "500W Smoke Machine Fog Mist Haze Hazer Effect 6 LED RGB For Disco Party Club", qty: 10, unit: 16.99 }
    ];
    return;
  }
  if (templateId === "idealtrading") {
    state.current.currency = "$";
    state.current.invoiceNumber = "46P54/87";
    state.current.orderDate = "2020-03-19";
    state.current.deliveryDate = "2020-03-19";
    state.current.poNumber = "";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = "Sam Maleki";
    state.current.billTo = "4258 Don Luis Dr Los Angeles CA 90035\nP. +1 310 876 2620\nE. castsilver@gmail.com";
    state.current.shipTo = "Sam Maleki\n4258 Don Luis Dr Los Angeles CA 90008\nP. +1 310 876 2620\nE. castsilver@gmail.com";
    state.current.paymentDetails = "Please Check All Products Before Signing Delivery Sheet. there is be no damage claim in driver left your Door Step";
    state.current.paymentMethod = "Paid In Advance Via Visa Credit Card";
    state.current.trackingId = "";
    state.current.orderId = "";
    state.current.cardType = "Visa";
    state.current.cardEnding = "0318";
    state.current.cardExpiry = "";
    state.current.taxRate = 10;
    state.current.shippingAmount = 59.64;
    state.current.testMode = false;
    state.current.items = [
      {
        sku: "",
        product: "",
        description: "PAW Patrol Ready Race Rescue Mobile Pit Stop Team Vehicle with Sounds",
        qty: 12,
        unit: 39.82
      }
    ];
    return;
  }
  if (templateId === "paperstone") {
    state.current.currency = "GBP";
    state.current.invoiceNumber = "SINV00214786";
    state.current.paperstoneReceiptNumber = "SINV00210854";
    state.current.orderDate = "2026-03-29";
    state.current.deliveryDate = "2026-03-29";
    state.current.poNumber = "CC_1048637";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = "The Ultimate Outlet Ltd";
    state.current.billTo = "The Ultimate Outlet Ltd\n159 Dagenham Road\nRomford\nRM7 0TL";
    state.current.shipTo = state.current.billTo;
    state.current.paymentDetails = "Payment received";
    state.current.paymentMethod = "Paid";
    state.current.trackingId = "";
    state.current.orderId = "";
    state.current.paperstoneAccountNumber = "A26791";
    state.current.paperstoneVatNumber = "GB 843 6297 05";
    state.current.paperstoneCompanyNumber = "GB5214658";
    state.current.paperstonePaymentNote = "You have already paid so no further action is required";
    state.current.cardType = "Visa";
    state.current.cardEnding = "";
    state.current.cardExpiry = "";
    state.current.taxRate = 20;
    state.current.shippingAmount = 0;
    state.current.testMode = false;
    state.current.items = [
      { sku: "GL85858", product: "", description: "Fine Tip Marker Pens 4 Pack", qty: 14, pack: 1, vatCode: "S", unit: 2.23 },
      { sku: "AU24042", product: "", description: "Robinsons Peach & Raspberry Squash 1L", qty: 18, pack: 1, vatCode: "S", unit: 1.08 },
      { sku: "HK05134", product: "", description: "UniBond Picture Hanging Strips 10 Pack", qty: 11, pack: 1, vatCode: "S", unit: 2.9 },
      { sku: "NWT7829", product: "", description: "Kilner Wide Mouth Jar 500ml", qty: 16, pack: 1, vatCode: "S", unit: 3.35 },
      { sku: "KF01300", product: "", description: "Black A4 PVC Clipboard", qty: 20, pack: 1, vatCode: "S", unit: 4.1 }
    ];
    return;
  }
  if (templateId === "bestway") {
    state.current.currency = "GBP";
    state.current.invoiceNumber = "GBINV2062013";
    state.current.orderDate = "2025-07-14";
    state.current.bestwayInvoiceDate = "2025-07-14";
    state.current.deliveryDate = "2025-07-15";
    state.current.poNumber = "";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = "Muhammad Bilal";
    state.current.billTo = "120 Owen Road\nWolverhampton, West Midlands\nWV3 0AJ, United Kingdom";
    state.current.shipTo = "Muhammad Bilal\n120 Owen Road\nWolverhampton, West Midlands\nWV3 0AJ, United Kingdom";
    state.current.paymentDetails = "";
    state.current.paymentMethod = "VISA Card";
    state.current.trackingId = "";
    state.current.orderId = "1116126011";
    state.current.bestwayVatNumber = "GB 398 6193 89";
    state.current.bestwayPaymentStatus = "PAID";
    state.current.cardType = "Visa";
    state.current.cardEnding = "0312";
    state.current.cardExpiry = "";
    state.current.taxRate = 20;
    state.current.shippingAmount = 39;
    state.current.testMode = false;
    state.current.items = [
      {
        sku: "823082",
        product: "",
        description: "Barr American Cream Soda 330ml Zero No Sugar (pack of 24)",
        qty: 40,
        unit: 5.21
      }
    ];
    return;
  }
  if (templateId === "unfi") {
    state.current.currency = "$";
    state.current.invoiceNumber = "3004929106";
    state.current.orderDate = "2025-03-18";
    state.current.deliveryDate = "2025-03-18";
    state.current.poNumber = "";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = "Metaforge Innovations LLC";
    state.current.billTo = "1110 E Algonquin Rd\nApt 1G, Schaumburg\nBradford\nUnited States";
    state.current.shipTo = "Metaforge Innovations LLC\n1110 E Algonquin Rd\nApt 1G, Schaumburg\nIL 60173-4008\nUnited States";
    state.current.paymentDetails = "";
    state.current.paymentMethod = "Remit in USD Only";
    state.current.trackingId = "1ZG223X26840678561";
    state.current.orderId = "";
    state.current.unfiDeliveryNumber = "88952239";
    state.current.unfiSalesOrderNumber = "S005788427";
    state.current.unfiFreightTerms = "PREPAID";
    state.current.unfiIncoTerms = "DDP Destination";
    state.current.unfiCarrier = "See Notes";
    state.current.unfiPageLabel = "1 of 1";
    state.current.unfiVatNumber = "GB736734610";
    state.current.unfiShipToCode = "OT71393";
    state.current.unfiBillToCode = "OT71393";
    state.current.unfiDiscount = 0;
    state.current.cardType = "Visa";
    state.current.cardEnding = "";
    state.current.cardExpiry = "";
    state.current.taxRate = 0;
    state.current.shippingAmount = 0;
    state.current.testMode = false;
    state.current.items = [
      { sku: "01", product: "EA", description: "Trunature Prostate Plus Health Complex, 250 Softgels", qty: 20, unit: 12.16 },
      { sku: "02", product: "EA", description: "Cramp Defense High Absorption 180 Capsules", qty: 24, unit: 20 },
      { sku: "03", product: "EA", description: "Optimum Nutrition Opti-Men, Immune Support, 240 CT", qty: 32, unit: 17.5 },
      { sku: "04", product: "EA", description: "Nutrafol Womens Balance Hair Growth 120 Count", qty: 30, unit: 23.5 },
      { sku: "05", product: "EA", description: "Prevagen Extra Strength Caps, 60ct 3 Pack", qty: 24, unit: 10.1596 }
    ];
    return;
  }
  if (templateId === "bulkbuyamerica") {
    state.current.currency = "$";
    state.current.invoiceNumber = "INVC0898-bek";
    state.current.orderDate = "2022-10-27";
    state.current.deliveryDate = "2022-10-27";
    state.current.poNumber = "";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = "Infinityfat LLC";
    state.current.billTo = "Infinityfat LLC\n312 W 2nd Street Unit-A687\nCasper, WY\n82601\nEmail info@infinityfat.com\nPhone +1 307 207 7723";
    state.current.shipTo = state.current.billTo;
    state.current.paymentDetails = "Paid in full";
    state.current.paymentMethod = "Card";
    state.current.trackingId = "";
    state.current.orderId = "SO2161";
    state.current.cardType = "Visa";
    state.current.cardEnding = "";
    state.current.cardExpiry = "";
    state.current.taxRate = 0;
    state.current.shippingAmount = 0;
    state.current.amountPaid = 694.6;
    state.current.testMode = false;
    state.current.items = [
      {
        sku: "STVE02",
        product: "",
        description: "St. Ives Acne Control, Apricot Scrub 6 oz - St. Ives Face Scrub Apricot 6 oz - Pack of 3 (Pack of 3)",
        qty: 92,
        unit: 7.3
      },
      {
        sku: "PRNT01",
        product: "",
        description: "Labeling",
        qty: 92,
        unit: 0.25
      }
    ];
    return;
  }
  if (templateId === "sephorausa") {
    state.current.currency = "$";
    state.current.invoiceNumber = "92100340";
    state.current.orderDate = "2025-02-26";
    state.current.deliveryDate = "2025-02-26";
    state.current.poNumber = "";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = "Kevin Panameno";
    state.current.billTo = "Kevin Panameno\n640 N Kingsley Dr Apt 205, 90004,\nLos Angeles, California\nPrimeexclusiveselects@gmail.com\n3232515497";
    state.current.shipTo = state.current.billTo;
    state.current.paymentDetails = "";
    state.current.paymentMethod = "Card";
    state.current.trackingId = "";
    state.current.orderId = "93042-F1";
    state.current.cardType = "Visa";
    state.current.cardEnding = "";
    state.current.cardExpiry = "";
    state.current.taxRate = 9.5;
    state.current.shippingAmount = 0;
    state.current.sephoraUsaCustomerCount = 1;
    state.current.sephoraUsaDiscount = 0;
    state.current.testMode = false;
    state.current.items = [
      {
        sku: "2532042",
        product: "92001",
        description: "NEST New York Mini Wild Mint & Eucalyptus Candle",
        qty: 200,
        unit: 20
      }
    ];
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
  const isPcsBooks = state.current.templateId === "pcsbooks";
  const isCostcoUk = state.current.templateId === "costcouk";
  const isQogitaUk = state.current.templateId === "qogitauk";
  const isClearanceKing = state.current.templateId === "clearanceking";
  const isSunsky = state.current.templateId === "sunsky";
  const isJustmae = state.current.templateId === "justmae";
  const isJellycat = state.current.templateId === "jellycat";
  const isScrubDaddy = state.current.templateId === "scrubdaddy";
  const isBestway = state.current.templateId === "bestway";
  const isPaperstone = state.current.templateId === "paperstone";
  const isUnfi = state.current.templateId === "unfi";
  const isBulkBuyAmerica = state.current.templateId === "bulkbuyamerica";
  const isSephoraUsa = state.current.templateId === "sephorausa";
  els.itemsTableWrap.classList.toggle("is-pcsbooks-item-editor", isPcsBooks);
  els.itemsTableWrap.classList.toggle("is-costco-item-editor", isCostcoUk);
  els.itemsTable.classList.toggle("is-pcsbooks-items", isPcsBooks);
  els.itemsTable.classList.toggle("is-costco-items", isCostcoUk);
  els.itemsTable.classList.toggle("is-qogita-items", isQogitaUk);
  els.itemsTable.classList.toggle("is-clearance-king-items", isClearanceKing);
  els.itemsTable.classList.toggle("is-sunsky-items", isSunsky);
  els.itemsTable.classList.toggle("is-justmae-items", isJustmae);
  els.itemsTable.classList.toggle("is-jellycat-items", isJellycat);
  els.itemsTable.classList.toggle("is-scrub-daddy-items", isScrubDaddy);
  els.itemsTable.classList.toggle("is-bestway-items", isBestway);
  els.itemsTable.classList.toggle("is-paperstone-items", isPaperstone);
  els.itemsTable.classList.toggle("is-unfi-items", isUnfi);
  els.itemsTable.classList.toggle("is-bulk-buy-america-items", isBulkBuyAmerica);
  els.itemsTable.classList.toggle("is-sephora-usa-items", isSephoraUsa);
  els.itemsHeader.innerHTML = isPcsBooks
    ? "<tr><th>Code #</th><th>QTY</th><th>Description</th><th>Price</th></tr>"
    : isCostcoUk
      ? "<tr><th>SKU Code</th><th>Description</th><th>Unit Price (Inc VAT)</th><th>VAT %</th><th>Quantity</th><th>Total (Inc VAT)</th></tr>"
      : isQogitaUk
        ? "<tr><th>Name</th><th>Seller ID</th><th>GTIN</th><th>Price</th><th>Quantity</th><th>Subtotal</th></tr>"
      : isClearanceKing
        ? "<tr><th>Items</th><th>Image</th><th>Qty</th><th>Price</th><th>VAT</th><th>Subtotal</th></tr>"
      : isSunsky
        ? "<tr><th>No.</th><th>P/N</th><th>Description</th><th>HS Code</th><th>Qty</th><th>Price</th><th>Amount</th></tr>"
      : isJustmae
        ? "<tr><th>S.No.</th><th>Product</th><th>QTY</th><th>Unit</th><th>Total</th></tr>"
      : isJellycat
        ? "<tr><th>Qty</th><th>Code/SKU</th><th>Product Name</th><th>Size</th><th>Price</th><th>Total</th></tr>"
      : isScrubDaddy
        ? "<tr><th>Product</th><th>SKU</th><th>Weight</th><th>Quantity</th><th>Price</th><th>Total</th></tr>"
      : isBestway
        ? "<tr><th>Item No.</th><th>Description</th><th>Quantity</th><th>Price</th><th>VAT Rate</th><th>Total Price</th></tr>"
      : isPaperstone
        ? "<tr><th>Code</th><th>Description</th><th>Qty</th><th>Pack</th><th>VAT</th><th>Each</th><th>Total</th></tr>"
      : isUnfi
        ? "<tr><th>Item No.</th><th>Product Description</th><th>Qty Invoiced</th><th>UOM</th><th>Net Unit Price</th><th>Net Extended Amount</th></tr>"
      : isBulkBuyAmerica
        ? "<tr><th>SKU</th><th>Name</th><th>Qty</th><th>Price</th><th>Tax</th><th>Total (USD)</th></tr>"
      : isSephoraUsa
        ? "<tr><th>Campaign</th><th>Product No.</th><th>Description</th><th>Qty</th><th>Unit Price</th><th>Total Price</th></tr>"
        : "<tr><th>SKU</th><th>Product</th><th>Description</th><th>Qty</th><th>Unit</th><th>Total</th><th></th></tr>";

  state.current.items.forEach((item, index) => {
    if (isPcsBooks) {
      const row = document.createElement("tr");
      row.className = "pcsbooks-item-editor-row";
      row.dataset.index = index;
      row.innerHTML = `
        <td><input data-field="sku" type="text" value="${escapeHtml(item.sku || "")}" /></td>
        <td><input data-field="qty" min="0" step="1" type="number" value="${Number(item.qty || 0)}" /></td>
        <td><input data-field="description" type="text" value="${escapeHtml(itemLine(item))}" /></td>
        <td class="pcsbooks-price-editor">
          <input data-field="unit" min="0" step="0.01" type="number" value="${Number(item.unit || 0)}" />
          <button class="mini-danger" data-remove-row type="button" aria-label="Remove item">x</button>
        </td>`;
      els.itemsBody.appendChild(row);
      return;
    }
    if (isSephoraUsa) {
      const row = document.createElement("tr");
      row.className = "sephora-usa-item-editor-row";
      row.dataset.index = index;
      row.innerHTML = `
        <td><input data-field="product" type="text" value="${escapeHtml(item.product || "")}" /></td>
        <td><input data-field="sku" type="text" value="${escapeHtml(item.sku || "")}" /></td>
        <td><input data-field="description" type="text" value="${escapeHtml(item.description || "")}" /></td>
        <td><input data-field="qty" min="0" step="1" type="number" value="${Number(item.qty || 0)}" /></td>
        <td><input data-field="unit" min="0" step="0.01" type="number" value="${Number(item.unit || 0)}" /></td>
        <td class="sephora-usa-total-editor"><span class="row-total">${money(rowTotal(item), state.current.currency)}</span><button class="mini-danger" data-remove-row type="button" aria-label="Remove item">x</button></td>`;
      els.itemsBody.appendChild(row);
      return;
    }
    if (isCostcoUk) {
      const row = document.createElement("tr");
      row.className = "costco-item-editor-row";
      row.dataset.index = index;
      row.innerHTML = `
        <td><input data-field="sku" type="text" value="${escapeHtml(item.sku || "")}" /></td>
        <td><input data-field="description" type="text" value="${escapeHtml(itemLine(item))}" /></td>
        <td><input data-field="unit" min="0" step="0.01" type="number" value="${Number(item.unit || 0)}" /></td>
        <td><input class="costco-readonly-rate" type="text" value="${Number(state.current.taxRate || 0)}%" readonly /></td>
        <td><input data-field="qty" min="0" step="1" type="number" value="${Number(item.qty || 0)}" /></td>
        <td class="costco-total-editor"><span class="row-total">${money(rowTotal(item), state.current.currency)}</span><button class="mini-danger" data-remove-row type="button" aria-label="Remove item">x</button></td>`;
      els.itemsBody.appendChild(row);
      return;
    }
    if (isQogitaUk) {
      const row = document.createElement("tr");
      row.className = "qogita-item-editor-row";
      row.dataset.index = index;
      row.innerHTML = `
        <td><input data-field="description" type="text" value="${escapeHtml(item.description || "")}" /></td>
        <td><input data-field="sku" type="text" value="${escapeHtml(item.sku || "")}" /></td>
        <td><input data-field="product" type="text" value="${escapeHtml(item.product || "")}" /></td>
        <td><input data-field="unit" min="0" step="0.01" type="number" value="${Number(item.unit || 0)}" /></td>
        <td><input data-field="qty" min="0" step="1" type="number" value="${Number(item.qty || 0)}" /></td>
        <td class="qogita-total-editor"><span class="row-total">${money(rowTotal(item), state.current.currency)}</span><button class="mini-danger" data-remove-row type="button" aria-label="Remove item">x</button></td>`;
      els.itemsBody.appendChild(row);
      return;
    }
    if (isClearanceKing) {
      const lineVat = rowTotal(item) * (Number(state.current.taxRate || 0) / 100);
      const row = document.createElement("tr");
      row.className = "clearance-king-item-editor-row";
      row.dataset.index = index;
      row.innerHTML = `
        <td>
          <input data-field="description" type="text" value="${escapeHtml(item.description || "")}" aria-label="Item description" />
          <input data-field="sku" type="text" value="${escapeHtml(item.sku || "")}" aria-label="SKU" placeholder="SKU" />
          <input data-field="product" type="text" value="${escapeHtml(item.product || "")}" aria-label="Barcode" placeholder="Barcode" />
        </td>
        <td><img src="${assetPath("/assets/clearance-king-product-reference.png")}" alt="" /></td>
        <td><input data-field="qty" min="0" step="1" type="number" value="${Number(item.qty || 0)}" /></td>
        <td><input data-field="unit" min="0" step="0.01" type="number" value="${Number(item.unit || 0)}" /></td>
        <td><span class="row-total">${money(lineVat, state.current.currency)}</span></td>
        <td class="clearance-king-total-editor"><span class="row-total">${money(rowTotal(item) + lineVat, state.current.currency)}</span><button class="mini-danger" data-remove-row type="button" aria-label="Remove item">x</button></td>`;
      els.itemsBody.appendChild(row);
      return;
    }
    if (isJustmae) {
      const row = document.createElement("tr");
      row.className = "justmae-item-editor-row";
      row.dataset.index = index;
      row.innerHTML = `
        <td>${index + 1}</td>
        <td><input data-field="description" type="text" value="${escapeHtml(itemLine(item))}" /></td>
        <td><input data-field="qty" min="0" step="1" type="number" value="${Number(item.qty || 0)}" /></td>
        <td><input data-field="unit" min="0" step="0.01" type="number" value="${Number(item.unit || 0)}" /></td>
        <td class="justmae-total-editor"><span class="row-total">${money(rowTotal(item), state.current.currency)}</span><button class="mini-danger" data-remove-row type="button" aria-label="Remove item">x</button></td>`;
      els.itemsBody.appendChild(row);
      return;
    }
    if (isSunsky) {
      const row = document.createElement("tr");
      row.className = "sunsky-item-editor-row";
      row.dataset.index = index;
      row.innerHTML = `
        <td>${index + 1}</td>
        <td><input data-field="sku" type="text" value="${escapeHtml(item.sku || "")}" /></td>
        <td><input data-field="description" type="text" value="${escapeHtml(item.description || "")}" /></td>
        <td><input data-field="product" type="text" value="${escapeHtml(item.product || "")}" /></td>
        <td><input data-field="qty" min="0" step="1" type="number" value="${Number(item.qty || 0)}" /></td>
        <td><input data-field="unit" min="0" step="0.01" type="number" value="${Number(item.unit || 0)}" /></td>
        <td class="sunsky-total-editor"><span class="row-total">${money(rowTotal(item), state.current.currency)}</span><button class="mini-danger" data-remove-row type="button" aria-label="Remove item">x</button></td>`;
      els.itemsBody.appendChild(row);
      return;
    }
    if (isJellycat) {
      const row = document.createElement("tr");
      row.className = "jellycat-item-editor-row";
      row.dataset.index = index;
      row.innerHTML = `
        <td><input data-field="qty" min="0" step="1" type="number" value="${Number(item.qty || 0)}" /></td>
        <td><input data-field="sku" type="text" value="${escapeHtml(item.sku || "")}" /></td>
        <td><input data-field="description" type="text" value="${escapeHtml(item.description || "")}" /></td>
        <td><input data-field="product" type="text" value="${escapeHtml(item.product || "")}" /></td>
        <td><input data-field="unit" min="0" step="0.01" type="number" value="${Number(item.unit || 0)}" /></td>
        <td class="jellycat-total-editor"><span class="row-total">${money(rowTotal(item), state.current.currency)}</span><button class="mini-danger" data-remove-row type="button" aria-label="Remove item">x</button></td>`;
      els.itemsBody.appendChild(row);
      return;
    }
    if (isScrubDaddy) {
      const row = document.createElement("tr");
      row.className = "scrub-daddy-item-editor-row";
      row.dataset.index = index;
      row.innerHTML = `
        <td><input data-field="description" type="text" value="${escapeHtml(item.description || "")}" /></td>
        <td><input data-field="sku" type="text" value="${escapeHtml(item.sku || "")}" /></td>
        <td><input data-field="product" type="text" value="${escapeHtml(item.product || "")}" /></td>
        <td><input data-field="qty" min="0" step="1" type="number" value="${Number(item.qty || 0)}" /></td>
        <td><input data-field="unit" min="0" step="0.01" type="number" value="${Number(item.unit || 0)}" /></td>
        <td class="scrub-daddy-total-editor"><span class="row-total">${money(rowTotal(item), state.current.currency)}</span><button class="mini-danger" data-remove-row type="button" aria-label="Remove item">x</button></td>`;
      els.itemsBody.appendChild(row);
      return;
    }
    if (isBestway) {
      const row = document.createElement("tr");
      row.className = "bestway-item-editor-row";
      row.dataset.index = index;
      row.innerHTML = `
        <td><input data-field="sku" type="text" value="${escapeHtml(item.sku || "")}" /></td>
        <td><input data-field="description" type="text" value="${escapeHtml(item.description || "")}" /></td>
        <td><input data-field="qty" min="0" step="1" type="number" value="${Number(item.qty || 0)}" /></td>
        <td><input data-field="unit" min="0" step="0.01" type="number" value="${Number(item.unit || 0)}" /></td>
        <td>${Number(state.current.taxRate || 0).toFixed(0)}%</td>
        <td class="bestway-total-editor"><span class="row-total">${money(rowTotal(item), state.current.currency)}</span><button class="mini-danger" data-remove-row type="button" aria-label="Remove item">x</button></td>`;
      els.itemsBody.appendChild(row);
      return;
    }
    if (isPaperstone) {
      const row = document.createElement("tr");
      row.className = "paperstone-item-editor-row";
      row.dataset.index = index;
      row.innerHTML = `
        <td><input data-field="sku" type="text" value="${escapeHtml(item.sku || "")}" /></td>
        <td><input data-field="description" type="text" value="${escapeHtml(item.description || "")}" /></td>
        <td><input data-field="qty" min="0" step="1" type="number" value="${Number(item.qty || 0)}" /></td>
        <td><input data-field="pack" min="1" step="1" type="number" value="${Math.max(1, Number(item.pack || 1))}" /></td>
        <td><input data-field="vatCode" type="text" maxlength="3" value="${escapeHtml(item.vatCode || "S")}" /></td>
        <td><input data-field="unit" min="0" step="0.01" type="number" value="${Number(item.unit || 0)}" /></td>
        <td class="paperstone-total-editor"><span class="row-total">${money(rowTotal(item), state.current.currency)}</span><button class="mini-danger" data-remove-row type="button" aria-label="Remove item">x</button></td>`;
      els.itemsBody.appendChild(row);
      return;
    }
    if (isUnfi) {
      const row = document.createElement("tr");
      row.className = "unfi-item-editor-row";
      row.dataset.index = index;
      row.innerHTML = `
        <td><input data-field="sku" type="text" value="${escapeHtml(item.sku || "")}" /></td>
        <td><input data-field="description" type="text" value="${escapeHtml(item.description || "")}" /></td>
        <td><input data-field="qty" min="0" step="1" type="number" value="${Number(item.qty || 0)}" /></td>
        <td><input data-field="product" type="text" value="${escapeHtml(item.product || "EA")}" /></td>
        <td><input data-field="unit" min="0" step="0.0001" type="number" value="${Number(item.unit || 0)}" /></td>
        <td class="unfi-total-editor"><span class="row-total">${money(rowTotal(item), state.current.currency)}</span><button class="mini-danger" data-remove-row type="button" aria-label="Remove item">x</button></td>`;
      els.itemsBody.appendChild(row);
      return;
    }
    if (isBulkBuyAmerica) {
      const row = document.createElement("tr");
      row.className = "bulk-buy-america-item-editor-row";
      row.dataset.index = index;
      row.innerHTML = `
        <td><input data-field="sku" type="text" value="${escapeHtml(item.sku || "")}" /></td>
        <td><input data-field="description" type="text" value="${escapeHtml(item.description || item.product || "")}" /></td>
        <td><input data-field="qty" min="0" step="1" type="number" value="${Number(item.qty || 0)}" /></td>
        <td><input data-field="unit" min="0" step="0.01" type="number" value="${Number(item.unit || 0)}" /></td>
        <td><input class="bulk-buy-america-readonly-rate" type="text" value="${Number(state.current.taxRate || 0)}%" readonly /></td>
        <td class="bulk-buy-america-total-editor"><span class="row-total">${money(rowTotal(item), state.current.currency)}</span><button class="mini-danger" data-remove-row type="button" aria-label="Remove item">x</button></td>`;
      els.itemsBody.appendChild(row);
      return;
    }
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
  const totalCell = row.querySelector(".row-total");
  if (totalCell) totalCell.textContent = money(rowTotal(item), state.current.currency);
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
  return path.startsWith("/") ? `..${path}` : path;
}

function clientAddress(invoice) {
  const name = String(invoice.clientName || "").trim();
  const address = String(invoice.billTo || "").trim();
  if (!name) return address;
  if (!address) return name;
  if (address.toLowerCase().startsWith(name.toLowerCase())) return address;
  return `${name}\n${address}`;
}

function formatCosmetixAddress(value) {
  const lines = String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return "&nbsp;";

  return lines
    .map((line, index) => index < 2 ? `<strong>${escapeHtml(line)}</strong>` : escapeHtml(line))
    .join("<br>");
}

function renderPreview() {
  const invoice = state.current;
  const template = getTemplate(invoice.templateId);
  const totals = calculateTotals(invoice);
  const isPound = template.id === "pound";
  const isZoro = template.id === "zoro";
  const isVet = template.id === "vetuk";
  const isGoSupps = template.id === "gosupps";
  const isPcsBooks = template.id === "pcsbooks";
  const isCosmetix = template.id === "cosmetix";
  const isCostcoUk = template.id === "costcouk";
  const isQogitaUk = template.id === "qogitauk";
  const isClearanceKing = template.id === "clearanceking";
  const isSunsky = template.id === "sunsky";
  const isJustmae = template.id === "justmae";
  const isJellycat = template.id === "jellycat";
  const isScrubDaddy = template.id === "scrubdaddy";
  const isBestway = template.id === "bestway";
  const isPaperstone = template.id === "paperstone";
  const isMastertrade = template.id === "mastertrade";
  const isIdealTrading = template.id === "idealtrading";
  const isUnfi = template.id === "unfi";
  const isBulkBuyAmerica = template.id === "bulkbuyamerica";
  const isSephoraUsa = template.id === "sephorausa";
  const isLuxurySouq = template.id === "luxurysouq";
  const isTw = template.id === "tw";
  const testMode = invoice.testMode === true;
  els.invoicePreview.style.setProperty("--preview-color", template.color);

  if (isZoro) {
    els.invoicePreview.innerHTML = renderZoroPreview(invoice, totals);
    return;
  }

  if (isVet) {
    els.invoicePreview.innerHTML = renderVetUkPreview(invoice, totals, testMode);
    return;
  }

  if (isGoSupps) {
    els.invoicePreview.innerHTML = renderGoSuppsPreview(invoice, totals);
    return;
  }

  if (isPcsBooks) {
    els.invoicePreview.innerHTML = renderPcsBooksPreview(invoice, totals);
    return;
  }

  if (isCosmetix) {
    els.invoicePreview.innerHTML = renderCosmetixPreview(invoice, totals);
    return;
  }

  if (isCostcoUk) {
    els.invoicePreview.innerHTML = renderCostcoUkPreview(invoice);
    return;
  }

  if (isQogitaUk) {
    els.invoicePreview.innerHTML = renderQogitaUkPreview(invoice, totals);
    return;
  }

  if (isClearanceKing) {
    els.invoicePreview.innerHTML = renderClearanceKingPreview(invoice, totals);
    return;
  }

  if (isSunsky) {
    els.invoicePreview.innerHTML = renderSunskyPreview(invoice, totals);
    return;
  }

  if (isJustmae) {
    els.invoicePreview.innerHTML = renderJustmaePreview(invoice, totals);
    return;
  }

  if (isJellycat) {
    els.invoicePreview.innerHTML = renderJellycatPreview(invoice, totals);
    return;
  }

  if (isScrubDaddy) {
    els.invoicePreview.innerHTML = renderScrubDaddyPreview(invoice, totals);
    return;
  }

  if (isBestway) {
    els.invoicePreview.innerHTML = renderBestwayPreview(invoice, totals);
    return;
  }

  if (isPaperstone) {
    els.invoicePreview.innerHTML = renderPaperstonePreview(invoice, totals);
    return;
  }

  if (isMastertrade) {
    els.invoicePreview.innerHTML = renderMastertradePreview(invoice, totals);
    return;
  }

  if (isIdealTrading) {
    els.invoicePreview.innerHTML = renderIdealTradingPreview(invoice, totals);
    return;
  }

  if (isUnfi) {
    els.invoicePreview.innerHTML = renderUnfiPreview(invoice, totals);
    return;
  }

  if (isBulkBuyAmerica) {
    els.invoicePreview.innerHTML = renderBulkBuyAmericaPreview(invoice, totals);
    return;
  }

  if (isSephoraUsa) {
    els.invoicePreview.innerHTML = renderSephoraUsaPreview(invoice, totals);
    return;
  }

  if (isLuxurySouq) {
    els.invoicePreview.innerHTML = renderLuxurySouqPreview(invoice, totals);
    return;
  }

  if (isTw) {
    els.invoicePreview.innerHTML = renderTwWholesalePreview(invoice, totals);
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

function renderIdealTradingPreview(invoice, totals) {
  const items = invoice.items.slice(0, 8);
  const emptyRows = Math.max(0, 8 - items.length);
  const paymentMethod = invoice.paymentMethod || `Paid In Advance Via ${invoice.cardType || "Credit"} Card`;
  const cardEnding = invoice.cardEnding || "0000";

  return `
    <div class="invoice-doc ideal-trading-invoice">
      <div class="ideal-top-motif" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <header class="ideal-header">
        <h1>Ideal Trading USA Inc -<br>Toy Wholesale</h1>
        <div class="ideal-invoice-title">INVOICE</div>
      </header>

      <section class="ideal-parties">
        <div>
          <h2>Invoice To</h2>
          <h3>${escapeHtml(invoice.clientName || "Customer")}</h3>
          <p>${escapeHtml(invoice.billTo || "")}</p>
        </div>
        <div class="ideal-ship-to">
          <h2>Ship To</h2>
          <h3>${escapeHtml((invoice.shipTo || invoice.clientName || "Customer").split(/\r?\n/)[0])}</h3>
          <p>${escapeHtml((invoice.shipTo || "").split(/\r?\n/).slice(1).join("\n"))}</p>
        </div>
        <dl class="ideal-meta">
          <div><dt>Invoice No.</dt><dd>${escapeHtml(invoice.invoiceNumber)}</dd></div>
          <div><dt>Invoice Date</dt><dd>${formatUsDate(invoice.orderDate)}</dd></div>
        </dl>
      </section>

      <table class="ideal-products">
        <thead><tr><th>Description</th><th>Quantity</th><th>Unit Price</th><th>Line Total</th></tr></thead>
        <tbody>
          ${items.map((item) => `
            <tr>
              <td>${escapeHtml(item.description || item.product || item.sku || "")}</td>
              <td>${Number(item.qty || 0)}</td>
              <td>${money(item.unit, invoice.currency)}</td>
              <td>${money(rowTotal(item), invoice.currency)}</td>
            </tr>`).join("")}
          ${Array.from({ length: emptyRows }, () => `<tr class="ideal-empty-row"><td></td><td></td><td></td><td>$0.00</td></tr>`).join("")}
        </tbody>
      </table>

      <section class="ideal-lower">
        <div>
          <h2>Payment Method</h2>
          <div class="ideal-payment-box">
            <p>${escapeHtml(paymentMethod)}</p>
            <p>**** **** **** ${escapeHtml(cardEnding)}</p>
          </div>
          <h2>Terms &amp; Conditions/Notes:</h2>
          <div class="ideal-notes">${escapeHtml(invoice.paymentDetails || "")}</div>
        </div>
        <dl class="ideal-totals">
          <div><dt>Subtotal :</dt><dd>${money(totals.subtotal, invoice.currency)}</dd></div>
          <div><dt>Shipping :</dt><dd>${money(totals.shipping, invoice.currency)}</dd></div>
          <div><dt>VAT :</dt><dd>${money(totals.tax, invoice.currency)}</dd></div>
          <div><dt>Grand Total :</dt><dd>${money(totals.total, invoice.currency)}</dd></div>
        </dl>
      </section>

      <footer class="ideal-footer">
        <strong>THANK YOU FOR YOUR BUSINESS</strong>
        <div class="ideal-bottom-motif" aria-hidden="true"><i></i><i></i><i></i></div>
        <address>
          <p>+1 718-366-8860</p>
          <p>www.idealtradingusa.com<br>Sale@idealtradingusa.com</p>
          <p>5000 Grand Ave, Maspeth, NY<br>11378, United States</p>
        </address>
      </footer>
    </div>
  `;
}

function renderTwWholesalePreview(invoice, totals) {
  const paymentMethod = invoice.paymentMethod || invoice.cardType || "Card";
  const paymentReference = invoice.cardEnding ? `${paymentMethod} ending ${invoice.cardEnding}` : paymentMethod;
  return `
    <div class="invoice-doc tw-invoice">
      <header class="tw-header">
        <div class="tw-brand">
          <div class="tw-logo-mark" aria-label="TW Wholesale">
            <strong><span>T</span>W</strong>
            <small>WHOLESALE</small>
          </div>
          <p>Tools · Hardware · Building Supplies</p>
        </div>
        <div class="tw-title">
          <h1>VAT INVOICE</h1>
          <strong>${escapeHtml(invoice.invoiceNumber)}</strong>
        </div>
      </header>

      <section class="tw-company-line">
        <p><strong>TW Wholesale Ltd</strong><br>Unit 11 Ryder Close, Cadley Hill Road<br>Swadlincote, Derbyshire DE11 9EU</p>
        <p>Tel: 01283 558 313<br>Web: www.twwholesale.co.uk<br>Company No: 02522049</p>
      </section>

      <section class="tw-parties">
        <div>
          <h2>Invoice To</h2>
          <p>${escapeHtml(clientAddress(invoice))}</p>
        </div>
        <div>
          <h2>Deliver To</h2>
          <p>${escapeHtml(invoice.shipTo || clientAddress(invoice))}</p>
        </div>
      </section>

      <dl class="tw-meta">
        <div><dt>Invoice Date</dt><dd>${formatDisplayDate(invoice.orderDate)}</dd></div>
        <div><dt>Order Number</dt><dd>${escapeHtml(invoice.orderId || "")}</dd></div>
        <div><dt>Customer PO</dt><dd>${escapeHtml(invoice.poNumber || "")}</dd></div>
        <div><dt>Delivery Date</dt><dd>${formatDisplayDate(invoice.deliveryDate)}</dd></div>
      </dl>

      <table class="tw-products">
        <thead>
          <tr>
            <th>Product Code</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Net</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map((item) => `
            <tr>
              <td>${escapeHtml(item.sku || "")}</td>
              <td>${escapeHtml(itemLine(item))}</td>
              <td>${Number(item.qty || 0)}</td>
              <td>${money(Number(item.unit || 0), invoice.currency)}</td>
              <td>${money(rowTotal(item), invoice.currency)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <section class="tw-summary-area">
        <div class="tw-payment">
          <h2>Payment Details</h2>
          <p>${escapeHtml(invoice.paymentDetails || "Payment received")}</p>
          <p>${escapeHtml(paymentReference)}</p>
          ${invoice.trackingId ? `<p>Tracking: ${escapeHtml(invoice.trackingId)}</p>` : ""}
        </div>
        <dl class="tw-totals">
          <div><dt>Goods Total</dt><dd>${money(totals.subtotal, invoice.currency)}</dd></div>
          <div><dt>Delivery</dt><dd>${money(totals.shipping, invoice.currency)}</dd></div>
          <div><dt>VAT (${Number(invoice.taxRate || 0)}%)</dt><dd>${money(totals.tax, invoice.currency)}</dd></div>
          <div class="tw-grand-total"><dt>Invoice Total</dt><dd>${money(totals.total, invoice.currency)}</dd></div>
        </dl>
      </section>

      <footer class="tw-footer">
        <strong>Thank you for your business</strong>
        <span>TW Wholesale Ltd · Big enough to cope, small enough to care.</span>
      </footer>
    </div>
  `;
}

function renderZoroPreview(invoice, totals) {
  const customerLabel = [invoice.zoroCustomerNumber, invoice.clientName].filter(Boolean).join(" ");
  const paymentLabel = `${invoice.cardType || invoice.paymentMethod || "Card"}${invoice.cardEnding ? `****${invoice.cardEnding}` : ""}`;
  return `
    <div class="invoice-doc zoro-invoice">
      <header class="zoro-header">
        <div class="zoro-brand-column">
          <img class="zoro-logo" src="${assetPath("/assets/zoro-logo.png")}" alt="Zoro.com" />
          <div class="zoro-mailing"><strong>Mailing Address</strong><p>${escapeHtml(invoice.zoroMailingAddress || "")}</p></div>
        </div>
        <dl class="zoro-primary-meta">
          <div><dt>Date</dt><dd>${formatUsDate(invoice.orderDate)}</dd></div>
          <div><dt>Invoice #</dt><dd>${escapeHtml(invoice.invoiceNumber)}</dd></div>
          <div><dt>Customer #</dt><dd>${escapeHtml(invoice.zoroCustomerNumber || "")}</dd></div>
          <div><dt>Terms</dt><dd>${escapeHtml(invoice.zoroTerms || "")}</dd></div>
          <div><dt>Due Date</dt><dd>${formatUsDate(invoice.zoroDueDate || invoice.orderDate)}</dd></div>
        </dl>
        <div class="zoro-title-meta">
          <h1>Invoice</h1>
          <dl>
            <div><dt>SO # Purchase<br>Order #</dt><dd>${escapeHtml(invoice.orderId || invoice.poNumber || "")}</dd></div>
            <div><dt>Shipping<br>Method</dt><dd>${escapeHtml(invoice.zoroShippingMethod || "")}</dd></div>
            <div><dt>Ship Date</dt><dd>${formatUsDate(invoice.deliveryDate)}</dd></div>
          </dl>
        </div>
      </header>

      <section class="zoro-addresses">
        <div><h2>Remit To</h2><p>${escapeHtml(invoice.zoroRemitTo || "")}</p></div>
        <div><h2>Bill To</h2><p>${escapeHtml(clientAddress(invoice))}</p></div>
        <div><h2>Ship To</h2><p>${escapeHtml(invoice.shipTo)}</p></div>
      </section>

      <section class="zoro-contact">
        <div>
          <h2>For Questions Please Contact</h2>
          <p>www.zoro.com/pages/zoro_info/contactus/<br>(855) 289-9676</p>
        </div>
        <h2>SUMMARY TERMS AND CONDITIONS</h2>
      </section>

      <section class="zoro-legal">
        <p>By placing an order, customers accept Zoro Tools, Inc.'s terms and conditions available at www.zoro.com/pages/zoro_info/legal/. Prices exclude shipping, handling fees, taxes and duties unless stated otherwise.</p>
        <p><strong>Sales Tax.</strong> Applicable sales tax is charged based on the shipment destination. <strong>Payment Terms.</strong> Established-credit payment terms are net thirty (30) days from shipment or pickup.</p>
        <p><strong>Return Policy.</strong> Eligible products may be returned within 30 days of shipment with return authorization. Products and country of origin may be substituted and may differ from published descriptions or images.</p>
        <h2>ZORO TOOLS, INC. LIMITED WARRANTY</h2>
        <p><strong>LIMITED WARRANTY.</strong> Products purchased for business use or resale are warranted against defects in workmanship or materials under normal use for one year from purchase. Other warranties are disclaimed where permitted by law.</p>
        <p><strong>LIMITATION OF LIABILITY.</strong> Liability is limited to the purchase price paid for the product giving rise to the claim. For manufacturer warranty information, contact Zoro at 855-BUY-ZORO.</p>
      </section>

      <table class="zoro-products">
        <thead><tr><th>Z Number</th><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
        <tbody>
          ${invoice.items.map((item) => `
            <tr>
              <td>${escapeHtml(item.sku || "")}</td>
              <td>${escapeHtml(item.description || item.product || "")}</td>
              <td>${Number(item.qty || 0)}</td>
              <td>${Number(item.unit || 0).toFixed(2)}</td>
              <td>${rowTotal(item).toFixed(2)}</td>
            </tr>`).join("")}
        </tbody>
      </table>

      <section class="zoro-summary">
        <div><span>Subtotal</span><strong>${totals.subtotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></div>
        <div><span>Shipping Cost (${escapeHtml(invoice.zoroShippingMethod || "Standard Ground")})</span><strong>${totals.shipping.toFixed(2)}</strong></div>
        <div><span>Total Tax</span><strong>${totals.tax.toFixed(2)}</strong></div>
        <div><span>Total</span><strong>${money(totals.total, invoice.currency)}</strong></div>
      </section>

      <section class="zoro-payment">
        <h2>Zoro</h2>
        <table>
          <thead><tr><th>Customer</th><th>Invoice #</th><th>Amount Due</th></tr></thead>
          <tbody><tr><td>${escapeHtml(customerLabel)}</td><td>${escapeHtml(invoice.invoiceNumber)}</td><td>${money(invoice.zoroAmountDue || 0, invoice.currency)}</td></tr></tbody>
        </table>
        <p><strong>Payment Method :</strong> ${escapeHtml(paymentLabel)}</p>
      </section>

      <footer class="zoro-footer">These items are sold for domestic consumption in the United States. If exported, purchaser assumes full responsibility for compliance with US export controls.</footer>
    </div>`;
}

function renderMastertradePreview(invoice, totals) {
  const discountRate = Number(invoice.mastertradeDiscountRate || 0);
  const cardType = String(invoice.cardType || invoice.paymentMethod || "VISA").toUpperCase();
  const paymentStatus = invoice.mastertradePaymentStatus || "PAID IN FULL";
  const rows = invoice.items.map((item) => `
    <tr>
      <td>${escapeHtml(itemLine(item))}</td>
      <td>${Number(item.qty || 0).toFixed(2)}</td>
      <td>${Number(item.unit || 0).toFixed(2)}</td>
      <td>${rowTotal(item).toFixed(2)}</td>
    </tr>`).join("");

  return `
    <div class="invoice-doc mastertrade-invoice">
      <section class="mastertrade-page invoice-page">
        <header class="mastertrade-header">
          <div class="mastertrade-from">
            <strong>FROM:</strong>
            <p><b>Mastertrade Supplies Ltd</b><br>Address:<br>Unit 1 Navigation Point, Golds Hill Way, Tipton,<br>DY4 0PY<br>Trade Counter:<br>0121 522 6222<br>Web Sales:<br>0121 522 6229<br>General Sales Email:<br>sales@mastertrade.co.uk<br>Web Sales Email:<br>websales@mastertrade.co.uk<br>Opening Hours:<br>Mon - Fri - 06:30 - 17:00</p>
          </div>
          <div class="mastertrade-brand" aria-label="Mastertrade Electrical Supplies">
            <strong>MA<span class="mastertrade-bolt">&#9889;&#65038;</span>TER<span>TRADE</span></strong>
            <small>ELECTRICAL SUPPLIES</small>
          </div>
        </header>

        <section class="mastertrade-overview">
          <div class="mastertrade-addresses">
            <div><h2>BILL TO :</h2><p>${escapeHtml(clientAddress(invoice))}</p></div>
            <div><h2>SHIP TO:</h2><p>${escapeHtml(invoice.shipTo || clientAddress(invoice))}</p></div>
          </div>
          <div class="mastertrade-meta">
            <h1>SALES INVOICE</h1>
            <dl>
              <div><dt>Invoice #</dt><dd>${escapeHtml(invoice.invoiceNumber)}</dd></div>
              <div><dt>Invoice Issue Date</dt><dd>${formatMastertradeDate(invoice.orderDate)}</dd></div>
              <div><dt>Invoice Ship Date</dt><dd>${formatMastertradeDate(invoice.mastertradeShipDate || invoice.orderDate)}</dd></div>
              <div><dt>Delivery date</dt><dd>${formatMastertradeDate(invoice.deliveryDate)}</dd></div>
            </dl>
          </div>
        </section>

        <table class="mastertrade-products">
          <thead><tr><th>ITEM</th><th>QUANTITY</th><th>UNIT COST</th><th>TOTAL ITEM</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>

        <section class="mastertrade-summary">
          <dl>
            <div class="mastertrade-subtotal"><dt>Subtotal Without Taxes</dt><dd>${money(totals.subtotal, invoice.currency)}</dd></div>
            <div><dt>Discount - ${discountRate.toFixed(2)}%</dt><dd>-${money(totals.discount, invoice.currency)}</dd></div>
            <div><dt>VAT - ${Number(invoice.taxRate || 0).toFixed(2)}%</dt><dd>${money(totals.tax, invoice.currency)}</dd></div>
            <div><dt>Shipping</dt><dd>${money(totals.shipping, invoice.currency)}</dd></div>
            <div class="mastertrade-total"><dt>Total (GBP)</dt><dd>${money(totals.total, invoice.currency)}</dd></div>
          </dl>
        </section>

        <section class="mastertrade-payment">
          <h2>PAYMENT DETAILS</h2>
          <p><b>CARD HOLDER NAME:</b> ${escapeHtml(invoice.mastertradeCardholder || invoice.clientName || "")}</p>
          <p><b>CARD TYPE:</b> ${escapeHtml(cardType)}</p>
          <p><b>ENDING DIGITS:</b> ${escapeHtml(invoice.cardEnding || "")}</p>
        </section>

        <section class="mastertrade-terms mastertrade-terms-first">
          <h2>Mastertrade Supplies Ltd - Terms &amp; Conditions of Sale</h2>
          <h3>1. Prices &amp; VAT</h3>
          <p>1.1 All prices stated on this invoice are <b>inclusive of VAT</b> at the prevailing UK rate.<br>
          1.2 The VAT charge and rate have been itemised on the invoice for compliance and record-keeping purposes.<br>
          1.3 Pricing is based on the Seller's published trade rates at the time of ordering and remains fixed for this transaction.</p>
        </section>
        <footer class="mastertrade-page-footer">Page 1 of 2</footer>
      </section>

      <section class="mastertrade-page mastertrade-terms-page invoice-page">
        <section class="mastertrade-terms">
          <h3>2. Payment Status</h3>
          <p>2.1 This invoice is marked <b>${escapeHtml(paymentStatus)}</b>, and the Buyer acknowledges that full settlement has been received by the Seller.<br>
          2.2 No outstanding balance or credit is due in respect of the Goods listed.<br>
          2.3 Ownership and title to the Goods transferred to the Buyer upon full cleared payment.</p>

          <h3>3. Delivery &amp; Risk</h3>
          <p>3.1 Delivery terms were agreed at the point of order.<br>
          3.2 Risk in the Goods passed to the Buyer on delivery.<br>
          3.3 The Seller is not liable for delays caused by third-party carriers or unforeseen events outside its control.</p>

          <h3>4. Returns &amp; Faulty Goods</h3>
          <p>4.1 Goods may only be returned in accordance with the Seller's returns procedure and with prior written authorisation.<br>
          4.2 Faulty or damaged Goods must be reported in writing within 48 hours of delivery.<br>
          4.3 Approved returns will be processed by replacement, repair, or refund at the Seller's discretion.</p>

          <h3>5. Warranty</h3>
          <p>5.1 Goods supplied are warranted to be free from defects in materials and workmanship for 12 months from delivery, unless otherwise stated.<br>
          5.2 The warranty excludes damage caused by misuse, incorrect installation, or accidental damage.</p>

          <h3>6. Liability</h3>
          <p>6.1 The Seller's liability is limited to the replacement, repair, or refund of the Goods and shall not extend to indirect or consequential losses.<br>
          6.2 Nothing in these Terms limits liability for death or personal injury caused by negligence.</p>

          <h3>7. Governing Law</h3>
          <p>7.1 These Terms are governed by English law.<br>
          7.2 Any dispute shall be subject to the jurisdiction of the courts of England and Wales.</p>

          <h3>8. Entire Agreement</h3>
          <p>8.1 These Terms constitute the entire agreement relating to this transaction and supersede any prior representations or discussions.<br>
          8.2 Variations must be agreed in writing by an authorised representative of the Seller.</p>

          <h3>Statement</h3>
          <p class="mastertrade-statement">This invoice is fully settled and issued as proof of purchase. The Buyer accepts these Terms upon receipt of Goods and confirmation of payment.</p>
        </section>
        <footer class="mastertrade-page-footer">Page 2 of 2</footer>
      </section>
    </div>`;
}

function formatPaperstoneAddress(fields, value) {
  const address = normalizePaperstoneAddressFields(fields, value);
  const { name: party, street, city, postal } = address;
  if (![party, street, city, postal].some(Boolean)) return "&nbsp;";
  return `
    <strong>${escapeHtml(party) || "&nbsp;"}</strong>
    <span class="paperstone-address-lines">
      ${escapeHtml(street) || "&nbsp;"}<br>
      ${escapeHtml(city) || "&nbsp;"}<br>
      <strong>${escapeHtml(postal) || "&nbsp;"}</strong>
    </span>`;
}

function renderPaperstonePreview(invoice) {
  const vatRate = Math.max(0, Number(invoice.taxRate || 0));
  const grossGoods = invoice.items.reduce((sum, item) => sum + rowTotal(item), 0);
  const netGoods = vatRate ? grossGoods / (1 + vatRate / 100) : grossGoods;
  const vatAmount = grossGoods - netGoods;
  const invoiceAddress = invoice.billTo || clientAddress(invoice);
  const deliveryAddress = invoice.shipTo || invoiceAddress;
  const normalizePaperstoneText = (value) => String(value || "").replace(/\r/g, "").trim();
  const paperstoneReferenceAddress = "The Ultimate Outlet Ltd\n159 Dagenham Road\nRomford\nRM7 0TL";
  const hasReferenceReceipt = (invoice.paperstoneReceiptNumber || invoice.invoiceNumber) === "SINV00210854";
  const hasReferenceInvoiceAddress = normalizePaperstoneText(invoiceAddress) === paperstoneReferenceAddress;
  const hasReferenceDeliveryAddress = normalizePaperstoneText(deliveryAddress) === paperstoneReferenceAddress;
  const hasReferenceOrderNumber = (invoice.poNumber || "") === "CC_1048637";
  const hasReferenceInvoiceNumber = invoice.invoiceNumber === "SINV00214786";
  const hasReferenceDate = formatDisplayDate(invoice.orderDate) === "29/03/2026";
  const hasReferenceAccount = (invoice.paperstoneAccountNumber || "") === "A26791";
  const paperstoneReferenceItems = [
    ["GL85858", "Fine Tip Marker Pens 4 Pack", 14, 1, "S", 2.23],
    ["AU24042", "Robinsons Peach & Raspberry Squash 1L", 18, 1, "S", 1.08],
    ["HK05134", "UniBond Picture Hanging Strips 10 Pack", 11, 1, "S", 2.9],
    ["NWT7829", "Kilner Wide Mouth Jar 500ml", 16, 1, "S", 3.35],
    ["KF01300", "Black A4 PVC Clipboard", 20, 1, "S", 4.1]
  ];
  const hasReferenceItems = invoice.items.length === paperstoneReferenceItems.length
    && invoice.items.every((item, index) => {
      const reference = paperstoneReferenceItems[index];
      return (item.sku || "") === reference[0]
        && (item.description || itemLine(item)) === reference[1]
        && Number(item.qty || 0) === reference[2]
        && Math.max(1, Number(item.pack || 1)) === reference[3]
        && (item.vatCode || "S") === reference[4]
        && Number(item.unit || 0) === reference[5];
    });
  const hasReferenceSummary = Math.abs(netGoods - 181.8) < 0.005
    && Math.abs(vatRate - 20) < 0.005
    && Math.abs(vatAmount - 36.36) < 0.005
    && Math.abs(grossGoods - 218.16) < 0.005;
  const hasReferenceNote = (invoice.paperstonePaymentNote || "") === "You have already paid so no further action is required";
  const hasReferenceRegistration = (invoice.paperstoneVatNumber || "") === "GB 843 6297 05"
    && (invoice.paperstoneCompanyNumber || "") === "GB5214658";
  return `
    <div class="invoice-doc paperstone-invoice">
      <section class="paperstone-upper" aria-label="Paperstone VAT receipt header and details">
        <img class="paperstone-upper-artwork" src="${assetPath("/assets/paperstone-upper-template.png?v=paperstone-v10")}" alt="" />
        ${hasReferenceReceipt ? "" : `
          <span class="paperstone-mask paperstone-mask-receipt" aria-hidden="true"></span>
          <span class="paperstone-upper-receipt">${escapeHtml(invoice.paperstoneReceiptNumber || invoice.invoiceNumber)}</span>`}

        ${hasReferenceInvoiceAddress ? "" : `
          <span class="paperstone-mask paperstone-mask-invoice-address" aria-hidden="true"></span>
          <p class="paperstone-upper-address paperstone-upper-invoice-address">${formatPaperstoneAddress(invoice.billToFields, invoiceAddress)}</p>`}
        ${hasReferenceDeliveryAddress ? "" : `
          <span class="paperstone-mask paperstone-mask-delivery-address" aria-hidden="true"></span>
          <p class="paperstone-upper-address paperstone-upper-delivery-address">${formatPaperstoneAddress(invoice.shipToFields, deliveryAddress)}</p>`}

        ${hasReferenceOrderNumber ? "" : `
          <span class="paperstone-mask paperstone-mask-order" aria-hidden="true"></span>
          <strong class="paperstone-upper-order">${escapeHtml(invoice.poNumber || "")}</strong>`}
        ${hasReferenceInvoiceNumber ? "" : `
          <span class="paperstone-mask paperstone-mask-invoice" aria-hidden="true"></span>
          <strong class="paperstone-upper-invoice-number">${escapeHtml(invoice.invoiceNumber)}</strong>`}
        ${hasReferenceDate ? "" : `
          <span class="paperstone-mask paperstone-mask-date" aria-hidden="true"></span>
          <strong class="paperstone-upper-date">${formatDisplayDate(invoice.orderDate)}</strong>`}
        ${hasReferenceAccount ? "" : `
          <span class="paperstone-mask paperstone-mask-account" aria-hidden="true"></span>
          <span class="paperstone-upper-account">${escapeHtml(invoice.paperstoneAccountNumber || "")}</span>`}
      </section>

      <section class="paperstone-lower" aria-label="Paperstone products, VAT summary and receipt footer">
        <img class="paperstone-lower-artwork" src="${assetPath("/assets/paperstone-lower-template.png?v=paperstone-v10")}" alt="" />

        ${hasReferenceItems ? "" : `
          <svg class="paperstone-editable-column-rules" viewBox="0 0 794 696" preserveAspectRatio="none" aria-hidden="true">
            <g class="paperstone-editable-column-repairs">
              <rect class="paperstone-editable-header-repair" x="129.88" y="1.9" width="3.2" height="22.8" />
              <rect class="paperstone-editable-body-repair" x="129.88" y="25.9" width="3.2" height="457.5" />
              <rect class="paperstone-editable-header-repair" x="493.4" y="1.9" width="3.2" height="22.8" />
              <rect class="paperstone-editable-body-repair" x="493.4" y="25.9" width="3.2" height="457.5" />
              <rect class="paperstone-editable-header-repair" x="534.57" y="1.9" width="3.2" height="22.8" />
              <rect class="paperstone-editable-body-repair" x="534.57" y="25.9" width="3.2" height="457.5" />
              <rect class="paperstone-editable-header-repair" x="583.57" y="1.9" width="3.2" height="22.8" />
              <rect class="paperstone-editable-body-repair" x="583.57" y="25.9" width="3.2" height="457.5" />
              <rect class="paperstone-editable-header-repair" x="621.52" y="1.9" width="3.2" height="22.8" />
              <rect class="paperstone-editable-body-repair" x="621.52" y="25.9" width="3.2" height="457.5" />
              <rect class="paperstone-editable-header-repair" x="685.58" y="1.9" width="3.2" height="22.8" />
              <rect class="paperstone-editable-body-repair" x="685.58" y="25.9" width="3.2" height="457.5" />
            </g>
            <path d="M131.48 1.28V483.96 M495 1.28V483.96 M536.17 1.28V483.96 M585.17 1.28V483.96 M623.12 1.28V483.96 M687.18 1.28V483.96" />
          </svg>`}

        ${hasReferenceItems ? "" : `
          <span class="paperstone-lower-mask paperstone-mask-code" aria-hidden="true"></span>
          <span class="paperstone-lower-mask paperstone-mask-description" aria-hidden="true"></span>
          <span class="paperstone-lower-mask paperstone-mask-qty" aria-hidden="true"></span>
          <span class="paperstone-lower-mask paperstone-mask-pack" aria-hidden="true"></span>
          <span class="paperstone-lower-mask paperstone-mask-vat-code" aria-hidden="true"></span>
          <span class="paperstone-lower-mask paperstone-mask-each" aria-hidden="true"></span>
          <span class="paperstone-lower-mask paperstone-mask-total" aria-hidden="true"></span>
          <div class="paperstone-lower-items">
            ${invoice.items.slice(0, 14).map((item) => `
              <div class="paperstone-lower-item">
                <span>${escapeHtml(item.sku || "")}</span>
                <span>${escapeHtml(item.description || itemLine(item))}</span>
                <span>${Number(item.qty || 0)}</span>
                <span>${Math.max(1, Number(item.pack || 1))}</span>
                <span>${escapeHtml(item.vatCode || "S")}</span>
                <span>${Number(item.unit || 0).toFixed(2)}</span>
                <span>${rowTotal(item).toFixed(2)}</span>
              </div>`).join("")}
          </div>`}

        ${hasReferenceSummary ? "" : `
          <span class="paperstone-lower-mask paperstone-mask-goods-value" aria-hidden="true"></span>
          <span class="paperstone-summary-value paperstone-goods-value">${netGoods.toFixed(2)}</span>
          <span class="paperstone-lower-mask paperstone-mask-vat-rate" aria-hidden="true"></span>
          <span class="paperstone-summary-value paperstone-vat-rate">${vatRate.toFixed(0)}</span>
          <span class="paperstone-lower-mask paperstone-mask-vat-amount" aria-hidden="true"></span>
          <span class="paperstone-summary-value paperstone-vat-amount">${vatAmount.toFixed(2)}</span>
          <span class="paperstone-total-box" aria-hidden="true"></span>
          <div class="paperstone-total-labels">
            <span>Total Goods:</span>
            <span>VAT:</span>
            <strong>Total inc VAT (PAID):</strong>
          </div>
          <div class="paperstone-total-values">
            <span>${netGoods.toFixed(2)}</span>
            <span>${vatAmount.toFixed(2)}</span>
            <strong>${grossGoods.toFixed(2)}</strong>
          </div>`}

        ${hasReferenceNote ? "" : `
          <span class="paperstone-lower-mask paperstone-mask-paid-note" aria-hidden="true"></span>
          <strong class="paperstone-lower-paid-note">${escapeHtml(invoice.paperstonePaymentNote || "")}</strong>`}

        ${hasReferenceRegistration ? "" : `
          <span class="paperstone-lower-mask paperstone-mask-registration-values" aria-hidden="true"></span>
          <div class="paperstone-registration-values">
            <span>${escapeHtml(invoice.paperstoneVatNumber || "")}</span>
            <span>${escapeHtml(invoice.paperstoneCompanyNumber || "")}</span>
          </div>`}
      </section>
    </div>
  `;
}

function renderBestwayPreview(invoice, totals) {
  const vatRate = Number(invoice.taxRate || 0);
  const paymentType = invoice.paymentMethod || invoice.cardType || "VISA Card";
  const cardNumber = invoice.cardEnding ? `************${escapeHtml(invoice.cardEnding)}` : "****************";
  return `
    <div class="invoice-doc bestway-invoice">
      <header class="bestway-header">
        <img class="bestway-logo" src="${assetPath("/assets/bestway-logo.png")}" alt="Bestway Wholesale" />
        <h1>Invoice</h1>
        <p>Page 1 of 1</p>
      </header>

      <section class="bestway-parties">
        <div class="bestway-buyer">
          <h2>Buyer:</h2>
          <p>${escapeHtml(clientAddress(invoice))}</p>
        </div>
        <div class="bestway-seller">
          <h2>Seller:</h2>
          <p>Bestway Wholesale Ltd<br>2 Abbey Road, Park Royal<br>London, NW10 7BW<br>United Kingdom<br>VAT number: ${escapeHtml(invoice.bestwayVatNumber || "")}</p>
        </div>
        <div class="bestway-delivery">
          <h2>Delivery Address:</h2>
          <p>${escapeHtml(invoice.shipTo)}</p>
        </div>
        <div class="bestway-details">
          <h2>Invoice Details:</h2>
          <dl>
            <div><dt>Order Date:</dt><dd>${formatDisplayDate(invoice.orderDate)}</dd></div>
            <div><dt>Order Number:</dt><dd>${escapeHtml(invoice.orderId || "")}</dd></div>
            <div><dt>Invoice Date:</dt><dd>${formatDisplayDate(invoice.bestwayInvoiceDate || invoice.orderDate)}</dd></div>
            <div><dt>Invoice Number:</dt><dd>${escapeHtml(invoice.invoiceNumber)}</dd></div>
            <div><dt>Delivery/Collection Date:</dt><dd>${formatDisplayDate(invoice.deliveryDate)}</dd></div>
          </dl>
        </div>
      </section>

      <table class="bestway-products">
        <thead>
          <tr><th>Item No.</th><th>Description</th><th>Quantity</th><th>Price</th><th>VAT Rate</th><th>Total Price</th></tr>
        </thead>
        <tbody>
          ${invoice.items.map((item) => `
            <tr>
              <td>${escapeHtml(item.sku || "")}</td>
              <td>${escapeHtml(item.description || itemLine(item))}</td>
              <td>${Number(item.qty || 0)}</td>
              <td>${money(Number(item.unit || 0), invoice.currency)}</td>
              <td>${vatRate.toFixed(0)}%</td>
              <td>${money(rowTotal(item), invoice.currency)}</td>
            </tr>`).join("")}
          <tr class="bestway-shipping-row">
            <td>400.006.06</td>
            <td>Home Delivery</td>
            <td>1</td>
            <td>${money(totals.shipping, invoice.currency)}</td>
            <td></td>
            <td>${money(totals.shipping, invoice.currency)}</td>
          </tr>
        </tbody>
      </table>

      <section class="bestway-financials">
        <div class="bestway-vat">
          <h2>VAT Specification:</h2>
          <div class="bestway-vat-head"><span>VAT Rate</span><strong>${vatRate.toFixed(0)} %</strong></div>
          <dl>
            <div><dt>Goods</dt><dd>${money(totals.subtotal, invoice.currency)}</dd></div>
            <div><dt>Shipping</dt><dd>${money(totals.shipping, invoice.currency)}</dd></div>
            <div><dt>Total</dt><dd>${money(totals.subtotal + totals.shipping, invoice.currency)}</dd></div>
            <div><dt>Net Amount</dt><dd>${money(totals.subtotal, invoice.currency)}</dd></div>
            <div><dt>VAT Amount</dt><dd>${money(totals.tax, invoice.currency)}</dd></div>
          </dl>
        </div>
        <div class="bestway-total">
          <div><span>Invoice Total:</span><strong>${money(totals.total, invoice.currency)}</strong></div>
          <b>${escapeHtml(invoice.bestwayPaymentStatus || "PAID")}</b>
        </div>
      </section>

      <section class="bestway-payment">
        <h2>Payment Details:</h2>
        <dl>
          <div><dt>Payment Type</dt><dd>${escapeHtml(paymentType)}</dd></div>
          <div><dt>Card Number</dt><dd>${cardNumber}</dd></div>
        </dl>
        <strong>${money(totals.total, invoice.currency)}</strong>
      </section>

      <footer class="bestway-footer">
        Bestway Wholesale Ltd company register No. 01207120 in England with its registered address, 2 Abbey Road, Park Royal, London, NW10 7BW<br>
        United Kingdom. Web: www.bestwaywholesale.co.uk our Company Number +44 (0)20 8453 1234. Email @ exportteam@bestway.co.uk
      </footer>
    </div>
  `;
}

function renderSephoraUsaPreview(invoice, totals) {
  const customerCount = Math.max(1, Number(invoice.sephoraUsaCustomerCount || 1));
  const discount = Math.max(0, Number(invoice.sephoraUsaDiscount || 0));
  const billTo = escapeHtml(invoice.billTo || clientAddress(invoice));
  const shipTo = escapeHtml(invoice.shipTo || invoice.billTo || clientAddress(invoice));
  return `
    <div class="invoice-doc sephora-usa-invoice">
      <header class="sephora-usa-header">
        <div class="sephora-usa-company">
          <h2>Sephora USA Inc.</h2>
          <p>525 Market Street First Market Tower<br>32nd Floor, San Francisco, California,<br>United States<br>Registration number, 3007918<br>Phone, 1-877-737-4672<br>Email, sephora@shop.sephora.com<br>Web, www.sephora.com</p>
        </div>
        <div class="sephora-usa-wordmark" aria-label="Sephora">SEPHORA</div>
        <div class="sephora-usa-title">
          <h1>Invoice</h1>
          <p>${formatSephoraUsaDate(invoice.orderDate)}</p>
        </div>
        <p class="sephora-usa-account-note">You can see your account statement and pay at<br><strong>Sephora&gt;MyAccount&gt;AccountBalance</strong></p>
      </header>

      <section class="sephora-usa-overview">
        <div class="sephora-usa-addresses">
          <div><h3>BILL TO</h3><p>${billTo}</p></div>
          <div><h3>SHIP TO</h3><p>${shipTo}</p></div>
        </div>
        <dl class="sephora-usa-meta">
          <div><dt>Invoice Number</dt><dd>${escapeHtml(invoice.invoiceNumber)}</dd></div>
          <div><dt>Order Number</dt><dd>${escapeHtml(invoice.orderId || "")}</dd></div>
          <div><dt>Customers</dt><dd>${customerCount}</dd></div>
          <div><dt>Tax</dt><dd>${Number(invoice.taxRate || 0).toFixed(1)}%</dd></div>
        </dl>
      </section>

      <table class="sephora-usa-products">
        <thead>
          <tr><th>CAMP.</th><th>QTY</th><th>PRODUCT NO.</th><th>DESCRIPTION</th><th>UNIT PRICE</th><th>TOTAL PRICE</th><th>DISCOUNT</th></tr>
        </thead>
        <tbody>
          ${invoice.items.map((item) => `
            <tr>
              <td>${escapeHtml(item.product || "")}</td>
              <td>${Number(item.qty || 0)}</td>
              <td>${escapeHtml(item.sku || "")}</td>
              <td>${escapeHtml(item.description || "")}</td>
              <td>${sephoraUsd(Number(item.unit || 0))}</td>
              <td>${sephoraUsd(rowTotal(item))}</td>
              <td></td>
            </tr>`).join("")}
        </tbody>
      </table>

      <section class="sephora-usa-lower">
        <div class="sephora-usa-tax-note">
          <p><strong>Tax is based on Customer price.</strong><br>**Non-Taxable</p>
          <p>**May vary with partially Taxed products</p>
        </div>
        <dl class="sephora-usa-summary">
          <div><dt>Sub Total</dt><dd>${sephoraUsd(totals.subtotal)}</dd></div>
          <div><dt>Discount</dt><dd>${sephoraUsd(discount)}</dd></div>
          <div class="sephora-usa-summary-rule"><dt>Shipping</dt><dd>${sephoraUsd(totals.shipping)}</dd></div>
          <div><dt>Tax</dt><dd>${sephoraUsd(totals.tax)}</dd></div>
          <div class="sephora-usa-order-total"><dt>Order Total</dt><dd>${sephoraUsd(totals.total)}</dd></div>
        </dl>
      </section>

      <footer class="sephora-usa-footer">
        <p>Sephora Customer Service: <strong>1-877-737-4672</strong></p>
        <p>Monday-Friday, 8 AM-11 PM ET | Sunday, 3 PM-12 AM ET</p>
      </footer>
    </div>`;
}

function renderUnfiPreview(invoice, totals) {
  const number = (value) => Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return `
    <div class="invoice-doc unfi-invoice">
      <header class="unfi-header">
        <img class="unfi-logo" src="${assetPath("/assets/unfi-logo.jpg")}" alt="UNFI - Better Food. Better Future." />
        <p><strong>UNFI INC</strong><br>313 Iron Horse Way<br>Providence<br>RI 02908<br>United States<br><br>VAT Reg. ${escapeHtml(invoice.unfiVatNumber || "")}</p>
        <h1>INVOICE</h1>
      </header>

      <section class="unfi-shipping-meta">
        <div><strong>DELIVERY NO.</strong><span>${escapeHtml(invoice.unfiDeliveryNumber || "")}</span></div>
        <div><strong>SHIPPED DATE</strong><span>${formatUsDate(invoice.deliveryDate)}</span></div>
        <div><strong>PAGE</strong><span>${escapeHtml(invoice.unfiPageLabel || "1 of 1")}</span></div>
        <div class="unfi-carrier"><strong>CARRIER</strong><span>${escapeHtml(invoice.unfiCarrier || "")}</span></div>
        <div class="unfi-lading"><strong>BILL OF LADING</strong><span>${escapeHtml(invoice.trackingId || "")}</span></div>
      </section>

      <section class="unfi-order-meta">
        <div><strong>INVOICE NO.</strong><span>${escapeHtml(invoice.invoiceNumber)}</span></div>
        <div><strong>INVOICE DATE</strong><span>${formatUsDate(invoice.orderDate)}</span></div>
        <div><strong>CUSTOMER PURCHASE ORDER NO.</strong><span>${escapeHtml(invoice.poNumber || "")}</span></div>
        <div><strong>SALES ORDER NO.</strong><span>${escapeHtml(invoice.unfiSalesOrderNumber || "")}</span></div>
        <div><strong>FREIGHT TERMS</strong><span>${escapeHtml(invoice.unfiFreightTerms || "")}</span></div>
        <div><strong>INCO TERMS</strong><span>${escapeHtml(invoice.unfiIncoTerms || "")}</span></div>
      </section>

      <section class="unfi-addresses">
        <div><h2>SHIP TO: <span>${escapeHtml(invoice.unfiShipToCode || "")}</span></h2><p>${escapeHtml(invoice.shipTo || "")}</p></div>
        <div><h2>BILL TO: <span>${escapeHtml(invoice.unfiBillToCode || "")}</span></h2><p>${escapeHtml(clientAddress(invoice))}</p></div>
      </section>

      <section class="unfi-products-wrap">
        <table class="unfi-products">
          <thead>
            <tr>
              <th>ITEM NO.</th>
              <th>PRODUCT NUMBER<br><span>PRODUCT DESCRIPTION</span></th>
              <th>QTY<br>INVOICED</th>
              <th>UOM</th>
              <th>NET UNIT PRICE<br><span>LIST PRICE</span></th>
              <th>NET EXTENDED<br><span>AMOUNT</span></th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map((item) => `
              <tr>
                <td>${escapeHtml(item.sku || "")}</td>
                <td>${escapeHtml(item.description || "")}</td>
                <td>${Number(item.qty || 0)}</td>
                <td>${escapeHtml(item.product || "EA")}</td>
                <td><span>USD</span><b>${number(item.unit)}</b></td>
                <td>${number(rowTotal(item))}</td>
              </tr>`).join("")}
          </tbody>
        </table>
        <section class="unfi-summary">
          <div class="unfi-summary-currency">USD</div>
          <dl>
            <div><dt>Line Total:</dt><dd>${number(totals.subtotal)}</dd></div>
            <div><dt>Discount:</dt><dd>${number(totals.discount)}</dd></div>
            <div><dt>Freight:</dt><dd>${number(totals.shipping)}</dd></div>
            <div><dt>Total Tax:</dt><dd>${number(totals.tax)}</dd></div>
            <div><dt>Total:</dt><dd>${number(totals.total)}</dd></div>
          </dl>
          <p class="unfi-tax">Tax%: <span>${number(invoice.taxRate)}</span><br><small>(Remit in USD Only)</small></p>
        </section>
        <p class="unfi-original">******ORIGINAL******</p>
      </section>

      <footer class="unfi-footer">
        <span>Sales of multiple units may lead to rounding differences on the net price. The total amount is unaffected.</span>
        <span>https://www.unfi.com/</span>
      </footer>
    </div>
  `;
}

function renderBulkBuyAmericaPreview(invoice, totals) {
  const taxRate = Number(invoice.taxRate || 0);
  const totalUnits = invoice.items.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  const amountPaid = Math.max(0, Number(invoice.amountPaid ?? totals.total));
  const amountDue = Math.max(0, totals.total - amountPaid);
  const paymentStatus = amountDue <= 0.005 ? "PAID" : "DUE";
  return `
    <div class="invoice-doc bulk-buy-america-invoice">
      <header class="bulk-buy-america-header">
        <img src="${assetPath("/assets/bulk-buy-america-logo.png")}" alt="Bulk Buy America" />
        <div>
          <span class="${paymentStatus === "PAID" ? "is-paid" : "is-due"}">${paymentStatus}</span>
          <h1>Invoice</h1>
        </div>
      </header>

      <section class="bulk-buy-america-details">
        <div class="bulk-buy-america-customer">
          <h2>Ship/Bill to</h2>
          <p>${escapeHtml(clientAddress(invoice))}</p>
        </div>
        <dl>
          <div><dt>Invoice Number</dt><dd>${escapeHtml(invoice.invoiceNumber)}</dd></div>
          <div><dt>Order Number</dt><dd>${escapeHtml(invoice.orderId || invoice.poNumber || "")}</dd></div>
          <div><dt>Issue Date</dt><dd>${formatBulkBuyAmericaDate(invoice.orderDate)}</dd></div>
        </dl>
      </section>

      <table class="bulk-buy-america-products">
        <thead>
          <tr><th>SKU</th><th>Name</th><th>Qty</th><th>Price</th><th>Tax</th><th>Total (USD)</th></tr>
        </thead>
        <tbody>
          ${invoice.items.map((item) => `
            <tr>
              <td>${escapeHtml(item.sku || "")}</td>
              <td>${escapeHtml(item.description || item.product || "")}</td>
              <td>${Number(item.qty || 0)}</td>
              <td>${Number(item.unit || 0).toFixed(2)}</td>
              <td>${taxRate.toFixed(0)}%</td>
              <td>${rowTotal(item).toFixed(2)}</td>
            </tr>`).join("")}
        </tbody>
      </table>

      <section class="bulk-buy-america-summary">
        <div><span>Total Units</span><strong>${totalUnits}</strong></div>
        <div><span>Subtotal</span><strong>${totals.subtotal.toFixed(2)}</strong></div>
        <div><span>Total (USD)</span><strong>${totals.total.toFixed(2)}</strong></div>
        <div><span>Amount Paid</span><strong>${money(amountPaid, invoice.currency)}</strong></div>
        <div class="bulk-buy-america-due"><span>Amount Due</span><strong>${money(amountDue, invoice.currency)}</strong></div>
      </section>

      <footer class="bulk-buy-america-footer">
        <p><strong>Bulk Buy America Inc</strong> Bulk Buy America Inc, 777 Lehigh Ave, UNIT G, Union, New Jersey, 07083, US</p>
        <p><strong>Phone</strong> +1(833)285-5289&nbsp;&nbsp; <strong>Email</strong> hg@buybulkamerica.com</p>
      </footer>
    </div>
  `;
}

function renderClearanceKingPreview(invoice, totals) {
  const vatRate = Number(invoice.taxRate || 0);
  return `
    <div class="invoice-doc clearance-king-invoice">
      <header class="clearance-king-logo-row">
        <img src="${assetPath("/assets/clearance-king-logo.png")}" alt="Clearance King - Importers and Wholesalers of Fast Moving Lines" />
      </header>

      <section class="clearance-king-company">
        <div class="clearance-king-order-meta">
          <p>Invoice #${escapeHtml(invoice.invoiceNumber)}</p>
          <p>Order #${escapeHtml(invoice.orderId || "")}</p>
          <p>Order / Tax Point Date: ${escapeHtml(invoice.orderDate || "")}</p>
        </div>
        <div>
          <p>Clearance King Ltd<br>C/O On Demand Warehousing<br>Sakhi house, Bridge Street, Swinton,<br>Manchester, M27 4DU<br>VAT Number : ${escapeHtml(invoice.clearanceKingVatNumber || "")}</p>
        </div>
      </section>

      <section class="clearance-king-addresses">
        <div><h3>Sold to:</h3><p>${escapeHtml(invoice.billTo || "")}</p></div>
        <div><h3>Ship to:</h3><p>${escapeHtml(invoice.shipTo || "")}</p></div>
      </section>

      <section class="clearance-king-methods">
        <div><h3>Payment Method</h3><p>${escapeHtml(invoice.paymentDetails || invoice.paymentMethod || "")}</p></div>
        <div><h3>Delivery Method</h3><p>${escapeHtml(invoice.trackingId || "")}</p></div>
      </section>

      <table class="clearance-king-items">
        <thead><tr><th>Items</th><th>Image</th><th>Qty</th><th>Price</th><th>VAT</th><th>Subtotal</th></tr></thead>
        <tbody>
          ${invoice.items.map((item) => {
            const lineTotal = rowTotal(item);
            const lineVat = lineTotal * (vatRate / 100);
            return `
              <tr>
                <td><strong>${escapeHtml(item.description || "")}</strong><small>SKU: ${escapeHtml(item.sku || "")}<br>Barcode: ${escapeHtml(item.product || "")}</small></td>
                <td><img src="${assetPath("/assets/clearance-king-product-reference.png")}" alt="" /></td>
                <td>${Number(item.qty || 0)}</td>
                <td>${money(Number(item.unit || 0), invoice.currency)}</td>
                <td>${money(lineVat, invoice.currency)}</td>
                <td>${money(lineTotal + lineVat, invoice.currency)}</td>
              </tr>`;
          }).join("")}
        </tbody>
      </table>

      <section class="clearance-king-summary">
        <div><strong>Subtotal</strong><span>${money(totals.subtotal, invoice.currency)}</span></div>
        <div><strong>Shipping &amp; Handling</strong><span>${money(totals.shipping, invoice.currency)}</span></div>
        <div><strong>VAT</strong><span>${money(totals.tax, invoice.currency)}</span></div>
        <div class="clearance-king-grand"><strong>Grand Total</strong><span>${money(totals.total, invoice.currency)}</span></div>
      </section>
    </div>
  `;
}

function renderScrubDaddyPreview(invoice, totals) {
  return `
    <div class="invoice-doc scrub-daddy-invoice">
      <header class="scrub-daddy-header">
        <img src="${assetPath("/assets/scrub-daddy-logo.png")}" alt="Scrub Daddy" />
        <address><strong>Scrub Daddy</strong><br>1 Ormidale Square<br>Lowman Way<br>Tiverton<br>EX16 6TW<br>United Kingdom (UK)</address>
      </header>

      <h1>INVOICE</h1>

      <section class="scrub-daddy-parties">
        <p>${escapeHtml(clientAddress(invoice))}</p>
        <dl>
          <div><dt>Invoice Number:</dt><dd>${escapeHtml(invoice.invoiceNumber)}</dd></div>
          <div><dt>Invoice Date:</dt><dd>${formatScrubDaddyDate(invoice.orderDate)}</dd></div>
          <div><dt>Order Number:</dt><dd>${escapeHtml(invoice.orderId || invoice.poNumber)}</dd></div>
          <div><dt>Order Date:</dt><dd>${formatScrubDaddyDate(invoice.deliveryDate)}</dd></div>
          <div><dt>Payment Method:</dt><dd>${escapeHtml(invoice.paymentMethod || "")}</dd></div>
        </dl>
      </section>

      <table class="scrub-daddy-products">
        <thead><tr><th>Product</th><th>Quantity</th><th>Price</th></tr></thead>
        <tbody>
          ${invoice.items.map((item) => `
            <tr>
              <td>
                <strong>${escapeHtml(item.description || item.product || "")}</strong>
                <small><b>SKU:</b> ${escapeHtml(item.sku || "")}</small>
                <small><b>Weight:</b> ${escapeHtml(item.product || "")}</small>
              </td>
              <td>${Number(item.qty || 0)}</td>
              <td>${money(rowTotal(item), invoice.currency)}</td>
            </tr>`).join("")}
        </tbody>
      </table>

      <section class="scrub-daddy-summary">
        <div><strong>Subtotal</strong><span>${money(totals.subtotal, invoice.currency)}</span></div>
        <div><strong>Shipping</strong><span>${money(totals.shipping, invoice.currency)} <small>via ${escapeHtml(invoice.scrubDaddyShippingService || "Delivery")}</small></span></div>
        <div class="scrub-daddy-total"><strong>Total</strong><span>${money(totals.total, invoice.currency)} <small>(includes ${money(totals.tax, invoice.currency)} Tax)</small></span></div>
      </section>

      <footer>VAT #: ${escapeHtml(invoice.scrubDaddyVatNumber || "")}</footer>
    </div>
  `;
}

function renderJellycatPreview(invoice, totals) {
  const orderNumber = invoice.orderId || invoice.invoiceNumber;
  const vatIncluded = totals.tax;
  return `
    <div class="invoice-doc jellycat-invoice">
      <header class="jellycat-header">
        <img src="${assetPath("/assets/jellycat-logo.png")}" alt="Jellycat London" />
      </header>

      <h2>Jellycat Invoice for Order #${escapeHtml(orderNumber)}</h2>
      <address><strong>Westworks Building</strong><br>195 Wood Ln, London W12 7FQ<br>United Kingdom</address>

      <section class="jellycat-addresses">
        <div><h3>Bill To</h3><p>${escapeHtml(invoice.billTo) || "&nbsp;"}</p></div>
        <div><h3>Ship To</h3><p>${escapeHtml(invoice.shipTo) || "&nbsp;"}</p></div>
      </section>

      <section class="jellycat-order-meta">
        <dl>
          <div><dt>Order:</dt><dd>#${escapeHtml(orderNumber)}</dd></div>
          <div><dt>Payment Method:</dt><dd>${escapeHtml(invoice.paymentMethod || "PayPal")} (${money(totals.total, invoice.currency)})</dd></div>
        </dl>
        <dl>
          <div><dt>Order Date:</dt><dd>${formatJellycatDate(invoice.orderDate)}</dd></div>
          <div><dt>Shipping Method:</dt><dd>${escapeHtml(invoice.jellycatShippingMethod || "")}</dd></div>
        </dl>
      </section>

      <section class="jellycat-items">
        <h3>Order Items</h3>
        <table>
          <thead><tr><th>Qty</th><th>Code/SKU</th><th>Product Name</th><th>Price</th><th>Total</th></tr></thead>
          <tbody>${invoice.items.map((item) => `
            <tr>
              <td>${Number(item.qty || 0)}</td>
              <td>${escapeHtml(item.sku || "")}</td>
              <td>${escapeHtml(item.description || "")}<small><b>Size:</b> ${escapeHtml(item.product || "")}</small></td>
              <td>${money(Number(item.unit || 0), invoice.currency)}</td>
              <td>${money(rowTotal(item), invoice.currency)}</td>
            </tr>`).join("")}</tbody>
        </table>
      </section>

      <section class="jellycat-summary">
        <div><span>Subtotal</span><strong>${money(totals.subtotal, invoice.currency)}</strong></div>
        <div><span>Shipping</span><strong>${money(totals.shipping, invoice.currency)}</strong></div>
        <div><span>Grand total</span><strong>${money(totals.total, invoice.currency)}</strong></div>
        <div class="jellycat-vat"><span>VAT Included in Total</span><strong>${money(vatIncluded, invoice.currency)}</strong></div>
      </section>

      <section class="jellycat-comments">
        <h3>Comments</h3>
        <p>${escapeHtml(invoice.jellycatComments || "")}</p>
      </section>
    </div>
  `;
}

function renderJustmaePreview(invoice, totals) {
  const vatRate = Number(invoice.taxRate || 0);
  const paypalFee = Number(invoice.justmaePaypalFee || 0);
  const grandTotal = totals.subtotal + totals.shipping + totals.tax + paypalFee;
  return `
    <div class="invoice-doc justmae-invoice">
      <header class="justmae-header">
        <div class="justmae-company">
          <h2>JUSTMAE LIMITED</h2>
          <p>First Floor Unit 3 Cromwell Road<br>Stockport<br>SK6 2RF</p>
        </div>
        <div class="justmae-meta">
          <h3>SALES INVOICE</h3>
          <dl>
            <div><dt>Issue Date:</dt><dd>${formatJustmaeDate(invoice.orderDate)}</dd></div>
            <div><dt>Invoice No:</dt><dd>${escapeHtml(invoice.invoiceNumber)}</dd></div>
            <div><dt>VAT No:</dt><dd>${escapeHtml(invoice.justmaeVatNumber || "")}</dd></div>
          </dl>
        </div>
      </header>

      <section class="justmae-customer">
        <h3>Invoice to:</h3>
        <p>${escapeHtml(clientAddress(invoice))}</p>
      </section>

      <p class="justmae-payment">Payment Method: ${escapeHtml(invoice.paymentMethod || "")}</p>

      <table class="justmae-table">
        <thead>
          <tr><th>S.No.</th><th>Product</th><th>QTY</th><th>Unit (&pound;)</th><th>Total(&pound;)</th></tr>
        </thead>
        <tbody>
          ${invoice.items.map((item, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${escapeHtml(itemLine(item))}</td>
              <td>${Number(item.qty || 0)}</td>
              <td>${Number(item.unit || 0).toFixed(2)}</td>
              <td>${rowTotal(item).toFixed(2)}</td>
            </tr>`).join("")}
        </tbody>
      </table>

      <section class="justmae-summary">
        <div><span>Sub total:</span><strong>${totals.subtotal.toFixed(2)}</strong></div>
        <div><span>Shipping:</span><strong>${totals.shipping.toFixed(2)}</strong></div>
        <div><span>Paypal Fee:</span><strong>${paypalFee.toFixed(2)}</strong></div>
        <div><span>${vatRate.toFixed(0)}% VAT:</span><strong>${totals.tax.toFixed(2)}</strong></div>
        <div class="justmae-grand"><span>Grand total:</span><strong>${grandTotal.toFixed(2)}</strong></div>
      </section>

      <footer class="justmae-footer">
        <div class="justmae-thanks">Thank you!</div>
        <div class="justmae-terms">
          <h3>TERMS &amp; CONDITIONS</h3>
          <p>All sales subject to our Terms and Conditions,<br>available on request.<br>All goods remain the property of Justmae Limited until<br>paid in full.</p>
        </div>
      </footer>
    </div>
  `;
}

function renderSunskyPreview(invoice, totals) {
  const paymentStatus = invoice.paymentDetails || "Paid in Full";
  const paymentMethod = invoice.cardType || invoice.paymentMethod || "Mastercard";
  return `
    <div class="invoice-doc sunsky-invoice">
      <header class="sunsky-header">
        <img class="sunsky-logo" src="${assetPath("/assets/sunsky-logo.png")}" alt="Sunsky Wholesale and Dropshipping" />
        <div class="sunsky-company">
          <h2>Shenzhen SUNSKY Technology Limited</h2>
          <p>Tel: 86-755-61302080, Fax: 86-755-61302090</p>
          <p>8/F, No.614 Building, Bagua 1st Road, Futian District, Shenzhen</p>
          <p>Contact: Tracy, Email: tracy@sunsky-online.com</p>
          <p>Website: https://www.sunsky-online.com</p>
        </div>
      </header>

      <h1>Commercial INVOICE</h1>

      <section class="sunsky-addresses">
        <div>
          <h3>To Bill:</h3>
          <p>${escapeHtml(invoice.billTo)}</p>
        </div>
        <div>
          <h3>To Ship:</h3>
          <p>${escapeHtml(invoice.shipTo)}</p>
        </div>
        <dl>
          <div><dt>Date:</dt><dd>${formatSunskyDate(invoice.orderDate)}</dd></div>
          <div><dt>Invoice NO:</dt><dd>${escapeHtml(invoice.invoiceNumber)}</dd></div>
          <div><dt>By:</dt><dd>${escapeHtml(invoice.sunskySalesperson || "Tracy")}</dd></div>
        </dl>
      </section>

      <section class="sunsky-payment">
        <h3>Payment</h3>
        <div>
          <span class="sunsky-card-mark" aria-hidden="true"><i></i><i></i></span>
          <p>${escapeHtml(paymentMethod)} ending in ${escapeHtml(invoice.cardEnding || "0000")}<br>
          Exp: ${escapeHtml(invoice.cardExpiry || "MM/YY")}<br>
          Payment Status: ${escapeHtml(paymentStatus)}</p>
        </div>
      </section>

      <table class="sunsky-products">
        <thead>
          <tr><th>No.</th><th>P/N</th><th>Description</th><th>HS Code</th><th>Qty</th><th>Price</th><th>Amount</th></tr>
        </thead>
        <tbody>
          ${invoice.items
            .map(
              (item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${escapeHtml(item.sku || "")}</td>
                  <td>${escapeHtml(item.description || item.product || "")}</td>
                  <td>${escapeHtml(item.product || "")}</td>
                  <td>${Number(item.qty || 0)}</td>
                  <td>${money(Number(item.unit || 0), invoice.currency)}</td>
                  <td>${money(rowTotal(item), invoice.currency)}</td>
                </tr>`
            )
            .join("")}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5" class="sunsky-remarks-label">Remarks:</td>
            <th>Sum:</th>
            <td>${money(totals.subtotal, invoice.currency)}</td>
          </tr>
          <tr>
            <td colspan="5">${escapeHtml(invoice.sunskyRemarks || "")}</td>
            <th>Freight:</th>
            <td>${money(totals.shipping, invoice.currency)}</td>
          </tr>
          <tr class="sunsky-grand-total">
            <td colspan="6">Total Amount:</td>
            <td>${money(totals.total, invoice.currency)}</td>
          </tr>
        </tfoot>
      </table>
    </div>`;
}

function renderQogitaUkPreview(invoice, totals) {
  const paymentStatus = invoice.paymentDetails || "Paid in Full";
  const cardNumber = invoice.cardEnding ? `**${invoice.cardEnding}` : "**0000";
  const vatRate = Math.max(0, Number(invoice.taxRate || 0));

  return `
    <div class="invoice-doc qogita-uk-invoice">
      <header class="qogita-header">
        <div class="qogita-mondu-badge" aria-label="Mondú pay later">
          <small>30 days payment terms</small><strong>mondú</strong><span>PAY LATER</span><em>VIA BANK TRANSFER</em>
        </div>
        <div class="qogita-wordmark" aria-label="Qogita">Qogita</div>
        <dl class="qogita-meta">
          <div><dt>Type:</dt><dd>Invoice</dd></div>
          <div><dt>Invoice ID:</dt><dd>${escapeHtml(invoice.invoiceNumber)}</dd></div>
          <div><dt>Order ID:</dt><dd>${escapeHtml(invoice.orderId || invoice.poNumber)}</dd></div>
          <div><dt>Date:</dt><dd>${formatQogitaDate(invoice.orderDate)}</dd></div>
          <div><dt>Payment Method:</dt><dd>${escapeHtml(invoice.paymentMethod || invoice.cardType || "Card")}</dd></div>
          <div><dt>Card Number:</dt><dd>${escapeHtml(cardNumber)}</dd></div>
          <div><dt>Exp:</dt><dd>${escapeHtml(invoice.cardExpiry || "--/--")}</dd></div>
          <div class="qogita-payment-status"><dt>Payment Status:</dt><dd>${escapeHtml(paymentStatus)}</dd></div>
        </dl>
      </header>

      <section class="qogita-company-grid">
        <article><h2>Invoicing Company</h2><p>Qogita UK LTD<br>1 Poultry Wework, 4th Floor<br>London EC2R 8EJ<br>United Kingdom<br>Company # 13207678<br>GB378624947</p></article>
        <article class="qogita-contact"><h2>Contact Details</h2><p>support@qogita.com<br>www.qogita.com<br>Samuel Rose - Operations Lead<br>+31208098587</p></article>
      </section>

      <section class="qogita-address-grid">
        <article><h2>Shipping Details</h2><p>${escapeHtml(invoice.shipTo) || "&nbsp;"}</p></article>
        <article><h2>Billing Details</h2><p>${escapeHtml(clientAddress(invoice)) || "&nbsp;"}</p></article>
      </section>

      <section class="qogita-products-section">
        <h2>Domestic For Resale</h2>
        <table class="qogita-products">
          <thead><tr><th>NAME</th><th>SELLER ID</th><th>GTIN</th><th>PRICE</th><th>QUANTITY</th><th>SUBTOTAL</th></tr></thead>
          <tbody>${invoice.items.map((item) => `
            <tr><td>${escapeHtml(item.description || item.product || "")}</td><td>${escapeHtml(item.sku || "")}</td><td>${escapeHtml(item.product || "")}</td><td>${money(Number(item.unit || 0), invoice.currency)}</td><td>${Number(item.qty || 0)}</td><td>${money(rowTotal(item), invoice.currency)}</td></tr>`).join("")}</tbody>
        </table>
      </section>

      <section class="qogita-totals"><dl>
        <div><dt>Subtotal</dt><dd>${money(totals.subtotal, invoice.currency)}</dd></div>
        <div><dt>Shipping</dt><dd>${money(totals.shipping, invoice.currency)}</dd></div>
        <div><dt>VAT (${vatRate}%) - Domestic For Resale</dt><dd>${money(totals.tax, invoice.currency)}</dd></div>
        <div class="qogita-grand-total"><dt>Total</dt><dd>${money(totals.total, invoice.currency)}</dd></div>
      </dl></section>

      <section class="qogita-transaction"><strong>Transaction Summary</strong><span>Thanks for ordering at Qogita!</span><b>${money(totals.total, invoice.currency)} Invoiced of Which ${money(totals.total, invoice.currency)} PAID</b></section>
      <footer>© 2025 Qogita. All rights reserved.</footer>
    </div>`;
}

function renderCostcoUkPreview(invoice) {
  const grossItems = invoice.items.reduce((sum, item) => sum + rowTotal(item), 0);
  const shipping = Math.max(0, Number(invoice.shippingAmount || 0));
  const grossTotal = grossItems + shipping;
  const vatRate = Math.max(0, Number(invoice.taxRate || 0));
  const netTotal = vatRate > 0
    ? Math.round((grossTotal / (1 + vatRate / 100)) * 100) / 100
    : grossTotal;
  const vatTotal = grossTotal - netTotal;
  const paymentLabel = `${invoice.cardType || "Card"} ending in ${invoice.cardEnding || "0000"}`;
  const normalizedCardType = String(invoice.cardType || "").toLowerCase();
  const paymentBrand = normalizedCardType.includes("american")
    ? "amex"
    : normalizedCardType.includes("visa")
      ? "visa"
      : "mastercard";
  const paymentMark = paymentBrand === "mastercard"
    ? "<i></i><i></i>"
    : paymentBrand === "visa"
      ? "<b>VISA</b>"
      : "<b>AMERICAN</b><b>EXPRESS</b>";

  return `
    <div class="invoice-doc costco-uk-invoice">
      <header class="costco-header">
        <div class="costco-brand">
          <img src="${assetPath("/assets/costco-uk-logo.png")}" alt="Costco Wholesale" />
          <p>Costco Online UK Limited Hartspring Lane<br>Watford<br>Hertfordshire WD25 8JS</p>
          <p>Registered Company Number England: 0880554444 VAT<br>registration Number: GB650186252<br>AWRS Number : XVAW0000102593</p>
        </div>
        <div class="costco-invoice-meta">
          <h2>INVOICE</h2>
          <dl>
            <dt>INVOICE DATE:</dt><dd>${formatDisplayDate(invoice.orderDate)}</dd>
            <dt>INVOICE NO:</dt><dd>${escapeHtml(invoice.invoiceNumber)}</dd>
            <dt>ORDER DATE:</dt><dd>${formatDisplayDate(invoice.deliveryDate)}</dd>
            <dt>ORDER NO:</dt><dd>${escapeHtml(invoice.poNumber || invoice.orderId)}</dd>
          </dl>
        </div>
      </header>

      <section class="costco-contact-grid">
        <div>
          <h3>BILLING ADDRESS</h3>
          <p>${escapeHtml(clientAddress(invoice)) || "&nbsp;"}</p>
          <h3 class="costco-payment-heading">PAYMENT METHOD</h3>
          <p class="costco-payment-line costco-payment-line--${paymentBrand}"><span class="costco-card-mark costco-card-mark--${paymentBrand}" aria-hidden="true">${paymentMark}</span>${escapeHtml(paymentLabel)}<br><small>Expires ${escapeHtml(invoice.costcoCardExpiry || "--/--")}</small></p>
        </div>
        <div>
          <h3>SHIPPING ADDRESS</h3>
          <p>${escapeHtml(invoice.shipTo) || "&nbsp;"}</p>
        </div>
        <div class="costco-membership">
          <h3>MEMBERSHIP NO: <span>${escapeHtml(invoice.costcoMembershipNumber)}</span></h3>
        </div>
      </section>

      <table class="costco-products">
        <thead>
          <tr>
            <th>SKU Code</th>
            <th>Description</th>
            <th>Unit Price<br>(Inc VAT)</th>
            <th>VAT%</th>
            <th>Quantity</th>
            <th>Total (Inc VAT)</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map((item) => `
            <tr>
              <td>${escapeHtml(item.sku)}</td>
              <td>${escapeHtml(itemLine(item))}</td>
              <td>${money(Number(item.unit || 0), invoice.currency)}</td>
              <td>${vatRate}%</td>
              <td>${Number(item.qty || 0)}</td>
              <td>${money(rowTotal(item), invoice.currency)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <section class="costco-order-subtotal">
        <strong>ORDER SUB TOTAL(INC VAT:-)</strong>
        <span>${money(grossItems, invoice.currency)}</span>
      </section>

      <section class="costco-vat-summary">
        <h3>VAT BREAKDOWN</h3>
        <div class="costco-vat-grid costco-vat-head">
          <strong></strong><strong>VAT(%)</strong><strong>NET(£)</strong><strong>VAT(£)</strong><strong>TOTAL(INC VAT)</strong>
        </div>
        <div class="costco-vat-grid">
          <span>Sub Total@</span><span>${vatRate.toFixed(2)}%</span><span>${money(netTotal, "GBP")}</span><span>${money(vatTotal, "GBP")}</span><span>${money(grossTotal, "GBP")}</span>
        </div>
        <div class="costco-vat-grid costco-vat-total">
          <strong>TOTAL INVOICE VALUE</strong><span></span><span>${money(netTotal, "GBP")}</span><span>${money(vatTotal, "GBP")}</span><span>${money(grossTotal, "GBP")}</span>
        </div>
      </section>
    </div>`;
}

function renderCosmetixPreview(invoice, totals) {
  const paidAmount = invoice.amountPaid === null || invoice.amountPaid === undefined || invoice.amountPaid === ""
    ? totals.total
    : Math.max(0, Number(invoice.amountPaid || 0));
  const amountDue = Math.max(0, totals.total - paidAmount);
  const paymentMethod = invoice.paymentMethod || "Credit Card";
  const orderNumber = invoice.orderId || invoice.invoiceNumber;

  return `
    <div class="invoice-doc cosmetix-invoice">
      <div class="cosmetix-top-rule"></div>
      <main class="cosmetix-page">
        <section class="cosmetix-intro">
          <div class="cosmetix-heading">
            <h2>INVOICE</h2>
            <dl>
              <dt>INVOICE:</dt>
              <dd>${escapeHtml(invoice.invoiceNumber)}</dd>
              <dt>ISSUE DATE:</dt>
              <dd>${formatCosmetixDate(invoice.orderDate)}</dd>
            </dl>
          </div>

          <div class="cosmetix-details">
            <div class="cosmetix-supplier-row">
              <div class="cosmetix-supplier">
                <h3>SUPPLIER</h3>
                <p><strong>Cosmetix Club</strong><br>465 S. DEAN STREET<br>ENGLEWOOD, NJ 07631</p>
                <p>cosmetixclub@gmail.com<br>(732) 337-7111<br>cosmetixclub.com</p>
              </div>
              <img class="cosmetix-logo" src="${assetPath("/assets/cosmetix-club-logo.png")}" alt="Cosmetix Club" />
            </div>
            <div class="cosmetix-addresses">
              <div>
                <h3>BILL TO :</h3>
                <p>${formatCosmetixAddress(clientAddress(invoice))}</p>
              </div>
              <div>
                <h3>SHIP TO :</h3>
                <p>${formatCosmetixAddress(invoice.shipTo)}</p>
              </div>
            </div>
          </div>
        </section>

        <table class="cosmetix-table">
          <thead><tr><th>Item</th><th>Quantity</th><th>Unit<br>Price</th><th>Total</th></tr></thead>
          <tbody>
            ${invoice.items.map((item) => `
              <tr>
                <td><span class="cosmetix-sku">${escapeHtml(item.sku ? `ASIN:${item.sku}` : "")}</span>${escapeHtml(itemLine(item))}</td>
                <td>${Number(item.qty || 0)}</td>
                <td>${money(Number(item.unit || 0), invoice.currency)}</td>
                <td>${money(rowTotal(item), invoice.currency)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <section class="cosmetix-totals">
          <div><span>SUBTOTAL:</span><strong>${money(totals.subtotal, invoice.currency)}</strong></div>
          ${Number(invoice.taxRate || 0) > 0 ? `<div><span>TAX (${Number(invoice.taxRate)}%):</span><strong>${money(totals.tax, invoice.currency)}</strong></div>` : ""}
          <div><span>SHIPPING:</span><strong>${money(totals.shipping, invoice.currency)}</strong></div>
          <div><span>TOTAL:</span><strong>${money(totals.total, invoice.currency)}</strong></div>
          <div><span>AMOUNT PAID:</span><strong>${money(paidAmount, invoice.currency)}</strong></div>
        </section>

        <section class="cosmetix-due">
          <div><span>ISSUE DATE:</span><strong>${formatCosmetixDate(invoice.orderDate)}</strong></div>
          <div><span>AMOUNT DUE:</span><strong>${money(amountDue, invoice.currency)}</strong></div>
        </section>
      </main>

      <footer class="cosmetix-footer">
        <div class="cosmetix-thanks">
          <p>${escapeHtml(invoice.paymentDetails || "Thank you for your purchase.")}</p>
          <img src="${assetPath("/assets/cosmetix-club-logo.png")}" alt="Cosmetix Club" />
        </div>
        <div class="cosmetix-payment">
          <div><span>PAYMENT METHOD</span><strong>${escapeHtml(paymentMethod)}</strong></div>
          <div><span>ORDER NUMBER</span><strong>#${escapeHtml(orderNumber)}</strong></div>
        </div>
        <p class="cosmetix-contact">Cosmetix Club | Phone: 7323377111 | Email: cosmetixclub@gmail.com | Website: cosmetixclub.com</p>
      </footer>
    </div>`;
}

function renderPcsBooksPreview(invoice, totals) {
  const paymentMethod = invoice.pcsPaymentDetails || `${invoice.cardType} ending in ${invoice.cardEnding || "0000"}`;
  const unitCode = invoice.pcsUnitCode || invoice.items[0]?.sku || "";
  const netAmount = Math.max(0, totals.subtotal - totals.discount);
  return `
    <div class="invoice-doc pcsbooks-invoice">
      <header class="pcsbooks-header">
        <div class="pcsbooks-brand">
          <h2>PCS Books Ltd</h2>
          <p>Unit 5, Vulcan House Business Centre<br>Vulcan Road, Leicester, LE5 3EF<br>United Kingdom</p>
        </div>
        <div class="pcsbooks-company">
          <p>Trading as <strong>Books4People</strong></p>
          <p>VAT No: GB883421809<br>Company No: 5643251<br>Registered in England</p>
        </div>
      </header>

      <section class="pcsbooks-meta">
        <div class="pcsbooks-meta-column">
          <div><strong>Invoice / Order No :</strong><span class="pcsbooks-order-number">${escapeHtml(invoice.invoiceNumber)}</span></div>
          <div><strong>Platform:</strong><span>${escapeHtml(invoice.pcsPlatform || "SFY")}</span></div>
          <div><strong>Box / Weight:</strong><span>${escapeHtml(invoice.pcsBoxWeight || "")}</span></div>
        </div>
        <div class="pcsbooks-meta-column">
          <div><strong>Invoice Date:</strong><span>${formatPcsDate(invoice.orderDate)}</span></div>
          <div><strong>Delivery Service:</strong><span>${escapeHtml(invoice.pcsDeliveryService || "")}</span></div>
          <div><strong>Unit / Code:</strong><span>${escapeHtml(unitCode)}</span></div>
        </div>
      </section>

      <section class="pcsbooks-addresses">
        <div>
          <h4>Bill to</h4>
          <p>${escapeHtml(clientAddress(invoice)) || "&nbsp;"}</p>
        </div>
        <div>
          <h4>Ship to</h4>
          <p>${escapeHtml(invoice.shipTo) || "&nbsp;"}</p>
        </div>
      </section>

      <section class="pcsbooks-payment">
        <h4>Payment method</h4>
        <p>${escapeHtml(paymentMethod)}</p>
      </section>

      <table class="pcsbooks-table">
        <thead>
          <tr><th>Code #</th><th>QTY</th><th>Description</th><th>Price</th></tr>
        </thead>
        <tbody>
          ${invoice.items.map((item) => `
            <tr>
              <td>${escapeHtml(item.sku || unitCode)}</td>
              <td>${Number(item.qty || 0)}</td>
              <td>${escapeHtml(itemLine(item) || "Book item")}</td>
              <td>${money(Number(item.unit || 0), invoice.currency)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <section class="pcsbooks-summary">
        <div class="pcsbooks-totals">
          <div><span>Discount:</span><strong>${money(totals.discount, invoice.currency)}</strong></div>
          <div><span>Subtotal:</span><strong>${money(netAmount, invoice.currency)}</strong></div>
          <div><span>Postage (Standard 3-5 Working Days):</span><strong>${money(totals.shipping, invoice.currency)}</strong></div>
          <div><span>VAT @ ${Number(invoice.taxRate || 0)}%:</span><strong>${money(totals.tax, invoice.currency)}</strong></div>
          <div class="pcsbooks-grand"><span>TOTAL:</span><strong>${money(totals.total, invoice.currency)}</strong></div>
        </div>
      </section>

      <p class="pcsbooks-vat-breakdown">
        VAT Breakdown - Net Amount:${money(netAmount, invoice.currency)}
        &nbsp;VAT @ ${Number(invoice.taxRate || 0)}%: ${money(totals.tax, invoice.currency)}
        &nbsp;&nbsp;Commodity Code: ${escapeHtml(invoice.pcsCommodityCode || "4901990000")}
        &nbsp;&nbsp;Country of Origin: ${escapeHtml(invoice.pcsCountryOfOrigin || "GB")}
      </p>

      <footer class="pcsbooks-footer">
        <span>PCS Books Ltd, Unit 5 Vulcan House Business Centre, Vulcan Road, Leicester, LE5 3EF, United Kingdom</span>
        <span>VAT Number: GB883421809&nbsp; | &nbsp;Company Number: 5643251&nbsp; | &nbsp;Registered in England</span>
        <span>Trading as Books4People&nbsp; | &nbsp;&copy; 2026 PCS Books Ltd. All Rights Reserved.</span>
      </footer>
    </div>`;
}

function renderLuxurySouqPreview(invoice, totals) {
  const cardExpiry = invoice.cardExpiry || "MM/YY";
  return `
    <div class="invoice-doc luxury-souq-invoice">
      <header class="luxury-souq-header">
        <div class="luxury-souq-brand">
          <img src="../assets/luxury-souq-logo-reference.png" alt="Luxury Souq" />
          <address>
            <strong>LUXURY SOUQ WATCHES TRADING</strong><br>
            Unit 117, 1st Floor, Al Shafar Building 7<br>
            Al Wasl Road, Jumeirah 1<br>
            Dubai, UAE<br>
            info@luxurysouq.com<br>
            0800 LUXE (5893)
          </address>
        </div>
        <div class="luxury-souq-meta">
          <strong>Invoice Number # ${escapeHtml(invoice.invoiceNumber)}</strong>
          <span>Invoice Date : ${formatDisplayDate(invoice.orderDate)}</span>
        </div>
      </header>

      <section class="luxury-souq-details">
        <div>
          <h3>Billing Details</h3>
          <p>${escapeHtml(clientAddress(invoice)) || "&nbsp;"}</p>
        </div>
        <div>
          <h3>Payment Details</h3>
          <p class="luxury-souq-card"><span aria-hidden="true"><i></i><i></i></span>${escapeHtml(invoice.cardType || "Mastercard")} ending ${escapeHtml(invoice.cardEnding || "0000")}<br><em>Expires ${escapeHtml(cardExpiry)}</em></p>
        </div>
      </section>

      <table class="luxury-souq-table">
        <thead>
          <tr><th>Item Description</th><th>SKU</th><th>Unit Price</th><th>QTY</th><th>Total</th></tr>
        </thead>
        <tbody>
          ${invoice.items.map((item) => `
            <tr>
              <td>${escapeHtml(itemLine(item))}</td>
              <td>${escapeHtml(item.sku)}</td>
              <td>${money(Number(item.unit || 0), invoice.currency)}</td>
              <td>${Number(item.qty || 0)}</td>
              <td>${money(rowTotal(item), invoice.currency)}</td>
            </tr>`).join("")}
        </tbody>
      </table>

      <section class="luxury-souq-summary">
        <div class="luxury-souq-shipping">
          <h3>Shipping Details</h3>
          <p>${escapeHtml(invoice.shipTo) || "&nbsp;"}</p>
        </div>
        <div class="luxury-souq-totals">
          <div><span>Sub Total:</span><strong>${money(totals.subtotal, invoice.currency)}</strong></div>
          <div><span>Tax:</span><strong>${money(totals.tax, invoice.currency)}</strong></div>
          <div><span>Shipping:</span><strong>${money(totals.shipping, invoice.currency)}</strong></div>
          <div class="grand"><span>Grand Total:</span><strong>${money(totals.total, invoice.currency)}</strong></div>
        </div>
      </section>

      <footer class="luxury-souq-footer">
        <div>
          <h3>*Disclaimer:</h3>
          <p>Authenticity Guarantee: All products sold by Luxury Souq are 100% genuine and pre-owned. Each item undergoes thorough inspection and authentication prior to shipment. Due to their pre-owned nature, minor signs of wear may be present, as detailed in the product listing.</p>
          <p>Buyers are responsible for any import duties, customs fees, or local taxes imposed by their country upon delivery. Luxury Souq is not liable for delays or additional costs related to customs clearance.</p>
        </div>
        <img src="../assets/luxury-souq-qr-reference.png" alt="Luxury Souq QR code" />
      </footer>
    </div>`;
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
  renderClients();
  updateMetrics();
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
    const pages = Array.from(doc.querySelectorAll(":scope > .invoice-page"));
    const captureTargets = pages.length ? pages : [doc];
    const { jsPDF } = window.jspdf;
    const pdfFormat = state.current.templateId === "zoro" ? "letter" : "a4";
    const exportPdfFormat = state.current.templateId === "unfi" ? "letter" : state.current.templateId === "sephorausa" ? "letter" : pdfFormat;
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: exportPdfFormat });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 0;
    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;
    for (let index = 0; index < captureTargets.length; index += 1) {
      const target = captureTargets[index];
      const canvas = await window.html2canvas(target, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: target.scrollWidth,
        height: target.scrollHeight,
        windowWidth: Math.max(target.scrollWidth, target.offsetWidth),
        windowHeight: Math.max(target.scrollHeight, target.offsetHeight)
      });
      if (index > 0) pdf.addPage(exportPdfFormat, "portrait");
      const ratio = Math.min(maxWidth / canvas.width, maxHeight / canvas.height);
      const width = canvas.width * ratio;
      const height = canvas.height * ratio;
      const x = (pageWidth - width) / 2;
      const y = margin;
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.98), "JPEG", x, y, width, height);
    }
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

async function downloadCurrentInvoiceJpg() {
  let doc = els.invoicePreview.querySelector(".invoice-doc");
  if (!doc) {
    renderPreview();
    doc = els.invoicePreview.querySelector(".invoice-doc");
  }
  if (!doc) return;

  const button = els.downloadInvoiceJpg;
  const originalText = button.textContent;
  button.textContent = "Preparing...";
  button.disabled = true;

  try {
    await loadScriptOnce(assetPath("/vendor/html2canvas.min.js"), () => typeof window.html2canvas === "function");
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
    const link = document.createElement("a");
    link.download = `${state.current.invoiceNumber || "invoice"}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.95);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("JPG download failed", error);
    window.alert("JPG download could not be prepared. Please refresh the page and try again.");
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

function writeStructuredAddress(prefix, address = {}) {
  clientAddressFields.forEach((field) => {
    const input = els[`${prefix}${field}`];
    if (input) input.value = address[field.toLowerCase()] || "";
  });
}

function copyBillToToShipTo() {
  writeStructuredAddress("shipTo", readStructuredAddress("billTo"));
}

function addressesMatch(left = {}, right = {}) {
  return clientAddressFields.every((field) => {
    const key = field.toLowerCase();
    return String(left[key] || "").trim() === String(right[key] || "").trim();
  });
}

function setShipToLinkedState() {
  const linked = Boolean(els.sameAsBillTo?.checked);
  clientAddressFields.forEach((field) => {
    const input = els[`shipTo${field}`];
    if (input) input.readOnly = linked;
  });
  els.sameAsBillTo?.closest(".client-data-section")?.classList.toggle("is-address-linked", linked);
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

function beginNewClient() {
  editingClientId = "";
  clearClientForm();
  if (els.clientFormTitle) els.clientFormTitle.textContent = "Add client";
  if (els.clientFormMode) els.clientFormMode.textContent = "Save the details once and reuse them automatically in invoices.";
  if (els.saveClient) els.saveClient.textContent = "Save Client";
  showClientForm(true);
  els.clientName?.focus();
}

function editClientProfile(clientId) {
  const client = state.clients.find((item) => item.id === clientId);
  if (!client) return;
  editingClientId = client.id;
  els.clientName.value = client.name || "";
  els.clientEmail.value = client.email || "";
  els.clientCaseNumber.value = client.caseNumber || "";
  els.clientTeam.value = client.team || "Client";
  els.clientCardType.value = client.cardType || "Visa";
  els.clientCardEnding.value = client.cardEnding || "";
  els.clientCardExpiry.value = client.cardExpiry || "";
  els.clientCurrency.value = client.currency || "$";
  const billToFields = client.billToFields || parseInvoiceAddress(client.billTo || "");
  const shipToFields = client.shipToFields || parseInvoiceAddress(client.shipTo || "");
  writeStructuredAddress("billTo", billToFields);
  writeStructuredAddress("shipTo", shipToFields);
  els.sameAsBillTo.checked = addressesMatch(billToFields, shipToFields);
  setShipToLinkedState();
  if (els.clientFormTitle) els.clientFormTitle.textContent = `Edit ${client.name || "client"}`;
  if (els.clientFormMode) els.clientFormMode.textContent = "Update this profile and every new invoice will use the latest saved details.";
  if (els.saveClient) els.saveClient.textContent = "Update Client";
  showClientForm(true);
  els.clientForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function saveClient() {
  const billToFields = readStructuredAddress("billTo");
  const shipToFields = readStructuredAddress("shipTo");
  const cardEnding = els.clientCardEnding.value.replace(/\D/g, "").slice(0, 4);
  const name = els.clientName.value || billToFields.name || shipToFields.name || "Unnamed Client";
  const existingIndex = editingClientId
    ? state.clients.findIndex((item) => item.id === editingClientId)
    : -1;
  const client = {
    ...(existingIndex >= 0 ? state.clients[existingIndex] : {}),
    id: existingIndex >= 0 ? state.clients[existingIndex].id : `client-${Date.now()}`,
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

  if (existingIndex >= 0) {
    state.clients.splice(existingIndex, 1, client);
  } else {
    state.clients.unshift(client);
  }
  if (state.current.clientId === client.id) {
    applyClientToCurrent(client);
    applyCurrentToForm();
    renderPreview();
  }
  editingClientId = "";
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

  renderInvoiceClientCards();
  updateBuilderTemplateLocks();
}

function renderInvoiceClientCards() {
  if (!els.invoiceClientCards) return;

  if (!state.clients.length) {
    els.invoiceClientCards.innerHTML = `
      <div class="invoice-client-empty">
        <span class="invoice-client-empty-icon" aria-hidden="true"><i data-lucide="users"></i></span>
        <div>
          <strong>No saved clients yet</strong>
          <p>Add a client profile to start building an invoice.</p>
        </div>
        <button class="btn primary" data-add-invoice-client type="button">Add Client</button>
      </div>
    `;
  } else {
    els.invoiceClientCards.innerHTML = state.clients
      .map((client) => {
        const isSelected = client.id === state.current.clientId;
        const caseLabel = client.caseNumber ? `Profile: ${client.caseNumber}` : "Profile label not set";
        return `
          <button class="invoice-client-choice${isSelected ? " is-selected" : ""}" data-invoice-client="${escapeHtml(client.id)}" type="button" aria-pressed="${isSelected}">
            <span class="invoice-client-avatar" aria-hidden="true">${escapeHtml(getClientInitials(client))}</span>
            <span class="invoice-client-details">
              <strong>${escapeHtml(client.name || "Unnamed Client")}</strong>
              <span>${escapeHtml(caseLabel)}</span>
              <small>${escapeHtml(client.email || "No email saved")}</small>
            </span>
            <span class="invoice-client-select-label">Use client</span>
            <i data-lucide="chevron-right" aria-hidden="true"></i>
          </button>
        `;
      })
      .join("");
  }

  els.invoiceClientCards.querySelectorAll("[data-invoice-client]").forEach((button) => {
    button.addEventListener("click", () => handleBuilderClientSelect(button.dataset.invoiceClient, "single"));
  });
  els.invoiceClientCards.querySelector("[data-add-invoice-client]")?.addEventListener("click", () => {
    showView("clients");
    beginNewClient();
  });
  window.lucide?.createIcons({ attrs: { "aria-hidden": "true" } });
}

function updateBuilderTemplateLocks() {
  if (!els.invoiceClientSelect || !els.bulkClientSelect) return;
  const singleReady = Boolean(els.invoiceClientSelect.value);
  const bulkReady = Boolean(els.bulkClientSelect.value);

  els.templateSelect.disabled = !singleReady;
  els.bulkTemplateSelect.disabled = false;
  renderBuilderStage("single");
  renderBuilderStage("bulk");
}

function applyClientToCurrent(client) {
  state.current.clientId = client.id;
  state.current.caseNumber = client.caseNumber || "";
  state.current.billToFields = { ...(client.billToFields || parseInvoiceAddress(client.billTo || "")) };
  state.current.shipToFields = { ...(client.shipToFields || parseInvoiceAddress(client.shipTo || "")) };
  state.current.billTo = formatStructuredAddress(state.current.billToFields);
  state.current.shipTo = formatStructuredAddress(state.current.shipToFields);
  state.current.cardType = client.cardType;
  state.current.cardEnding = client.cardEnding;
  state.current.cardExpiry = client.cardExpiry || "";
  state.current.currency = client.currency || "$";
  state.current.clientName = client.name;
  state.current.paymentDetails = client.paymentDetails || formatClientPaymentDetails(client);
  if (els.bulkDestination) {
    const destination = client.shipToFields?.country || client.billToFields?.country || "United Kingdom";
    const matchingOption = Array.from(els.bulkDestination.options).find((option) => option.value === destination);
    if (matchingOption) els.bulkDestination.value = destination;
  }
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
  renderInvoiceClientCards();
  updateBuilderTemplateLocks();
}

function chooseBuilderTemplate(targetView, templateId) {
  if (!state.current.clientId && targetView !== "bulk") {
    setBuilderStage(targetView, "client");
    return;
  }

  const clientFields = {
    clientId: state.current.clientId,
    caseNumber: state.current.caseNumber,
    clientName: state.current.clientName,
    billTo: state.current.billTo,
    shipTo: state.current.shipTo,
    billToFields: { ...(state.current.billToFields || {}) },
    shipToFields: { ...(state.current.shipToFields || {}) },
    cardType: state.current.cardType,
    cardEnding: state.current.cardEnding,
    cardExpiry: state.current.cardExpiry,
    currency: state.current.currency,
    paymentDetails: state.current.paymentDetails
  };
  const selectedClient = state.clients.find((client) => client.id === state.current.clientId);
  state.current.templateId = templateId;
  applyTemplateDefaults(templateId);
  if (selectedClient) {
    applyClientToCurrent(selectedClient);
  } else {
    Object.assign(state.current, clientFields);
  }
  state.current.templateId = templateId;
  els.pcsBooksFields.hidden = templateId !== "pcsbooks";
  els.costcoUkFields.hidden = templateId !== "costcouk";
  els.zoroFields.hidden = templateId !== "zoro";
  els.clearanceKingFields.hidden = templateId !== "clearanceking";
  els.sunskyFields.hidden = templateId !== "sunsky";
  els.justmaeFields.hidden = templateId !== "justmae";
  els.jellycatFields.hidden = templateId !== "jellycat";
  els.bestwayFields.hidden = templateId !== "bestway";
  els.paperstoneFields.hidden = templateId !== "paperstone";
  els.sephoraUsaFields.hidden = templateId !== "sephorausa";
  els.mastertradeFields.hidden = templateId !== "mastertrade";
  els.unfiFields.hidden = templateId !== "unfi";
  els.amountPaidField.hidden = templateId !== "cosmetix" && templateId !== "bulkbuyamerica";
  applyCurrentToForm();
  markSelectedBuilderTemplate();
  renderItems();
  renderPreview();
  renderTemplateAssetPreview();
  setBuilderStage(targetView, "editor");
  persist();
}

function syncBulkDetailsFromCurrent() {
  if (!els.bulkInvoiceDate) return;
  els.bulkInvoiceDate.value = state.current.orderDate || formatDate(new Date());
  els.bulkCardType.value = state.current.cardType || "Visa";
  els.bulkCardLast4.value = state.current.cardEnding || "";
  const client = state.clients.find((item) => item.id === state.current.clientId);
  els.bulkCardExpiry.value = client?.cardExpiry || els.bulkCardExpiry.value || "";
  els.bulkFreightAmount.value = Number(state.current.shippingAmount || 0).toFixed(2);
  const template = getTemplate(els.bulkTemplateSelect?.value || state.current.templateId);
  if (els.bulkTemplateHint) {
    els.bulkTemplateHint.textContent = `This bulk CSV is for ${template.name} only. Product rows will use this invoice format.`;
  }
}

function syncBulkDetailsToCurrent() {
  if (!els.bulkInvoiceDate) return;
  state.current.templateId = els.bulkTemplateSelect.value || state.current.templateId;
  state.current.orderDate = els.bulkInvoiceDate.value || state.current.orderDate;
  state.current.cardType = els.bulkCardType.value || state.current.cardType;
  state.current.cardEnding = els.bulkCardLast4.value.replace(/\D/g, "").slice(0, 4);
  state.current.shippingAmount = Number(els.bulkFreightAmount.value || 0);
  els.bulkCardLast4.value = state.current.cardEnding;
  syncBulkDetailsFromCurrent();
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

  if (!isSingle) {
    clientStage.classList.remove("is-hidden-stage");
    templateStage.classList.add("is-hidden-stage");
    workPanels.forEach((panel) => panel.classList.remove("is-hidden-stage"));
    if (actions) actions.classList.remove("is-hidden-stage");
    syncBulkDetailsFromCurrent();
    return;
  }

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
  els.sameAsBillTo.checked = false;
  setShipToLinkedState();
  if (els.clientFormTitle) els.clientFormTitle.textContent = "Add client";
  if (els.clientFormMode) els.clientFormMode.textContent = "Save the details once and reuse them automatically in invoices.";
  if (els.saveClient) els.saveClient.textContent = "Save Client";
}

function getClientInitials(client) {
  return String(client?.name || "Client")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase() || "CL";
}

function renderClientDirectory() {
  if (!els.clientDirectoryList || !els.clientDirectoryCount) return;

  const query = String(els.clientDirectorySearch?.value || "").trim().toLowerCase();
  const clients = state.clients.filter((client) =>
    [client.name, client.email, client.caseNumber, client.billToFields?.country, client.shipToFields?.country]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  );

  const totalPages = Math.max(1, Math.ceil(clients.length / clientDirectoryPageSize));
  clientDirectoryPage = Math.min(Math.max(1, clientDirectoryPage), totalPages);
  const startIndex = (clientDirectoryPage - 1) * clientDirectoryPageSize;
  const visibleClients = clients.slice(startIndex, startIndex + clientDirectoryPageSize);

  els.clientDirectoryCount.textContent = query
    ? `${clients.length} of ${state.clients.length} records`
    : `${state.clients.length} ${state.clients.length === 1 ? "record" : "records"}`;

  if (!clients.length) {
    els.clientDirectoryList.innerHTML = `
      <div class="client-directory-empty">
        ${query ? "No clients match this search." : "Add your first client to build the directory."}
      </div>
    `;
    if (els.clientDirectoryPagination) els.clientDirectoryPagination.innerHTML = "";
    return;
  }

  els.clientDirectoryList.innerHTML = visibleClients
    .map((client, index) => {
      const invoiceCount = state.invoices.filter((invoice) => invoice.clientId === client.id).length;
      const destinations = new Set(
        [client.billToFields?.country, client.shipToFields?.country].filter(Boolean)
      ).size;
      return `
        <button class="client-directory-item${startIndex + index === 0 && !query ? " is-selected" : ""}" data-directory-client="${escapeHtml(client.id)}" type="button">
          <span class="client-directory-avatar" aria-hidden="true">${escapeHtml(getClientInitials(client))}</span>
          <span class="client-directory-identity">
            <strong>${escapeHtml(client.name || "Unnamed Client")}</strong>
            <small>${escapeHtml(client.caseNumber || client.email || "Profile label not set")}</small>
          </span>
          <span class="client-directory-stat"><strong>${invoiceCount}</strong><small>Invoices</small></span>
          <span class="client-directory-stat"><strong>${destinations}</strong><small>Places</small></span>
          <i aria-hidden="true" data-lucide="pencil-line"></i>
        </button>
      `;
    })
    .join("");

  if (els.clientDirectoryPagination) {
    els.clientDirectoryPagination.innerHTML = totalPages > 1
      ? `
          <button type="button" data-client-page="${clientDirectoryPage - 1}" ${clientDirectoryPage === 1 ? "disabled" : ""}>
            <i data-lucide="chevron-left" aria-hidden="true"></i>
            Previous
          </button>
          <span>Page <strong>${clientDirectoryPage}</strong> of ${totalPages}</span>
          <button type="button" data-client-page="${clientDirectoryPage + 1}" ${clientDirectoryPage === totalPages ? "disabled" : ""}>
            Next
            <i data-lucide="chevron-right" aria-hidden="true"></i>
          </button>
        `
      : "";

    els.clientDirectoryPagination.querySelectorAll("[data-client-page]").forEach((button) => {
      button.addEventListener("click", () => {
        clientDirectoryPage = Number(button.dataset.clientPage) || 1;
        renderClientDirectory();
        els.clientDirectoryList.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    });
  }

  window.lucide?.createIcons({ attrs: { "aria-hidden": "true" } });

  els.clientDirectoryList.querySelectorAll("[data-directory-client]").forEach((button) => {
    button.addEventListener("click", () => {
      els.clientDirectoryList.querySelectorAll(".client-directory-item").forEach((item) => item.classList.remove("is-selected"));
      button.classList.add("is-selected");
      editClientProfile(button.dataset.directoryClient);
    });
  });
}

function renderClients() {
  renderClientWorkflowSelectors();
  renderDashboardClients();
  renderDashboardTemplateUsage();
  renderClientDirectory();

  if (!els.clientList) return;

  if (!state.clients.length) {
    els.clientList.innerHTML = `<div class="empty-state">No saved clients yet. Click New Client to add bill-to, ship-to and card details.</div>`;
    return;
  }

  els.clientList.innerHTML = state.clients
    .map(
      (client, index) => {
        const initials = getClientInitials(client);
        return `
        <article class="client-card" id="client-card-${escapeHtml(client.id)}" style="--delay: ${index * 70}ms">
          <div class="client-avatar" aria-hidden="true">${escapeHtml(initials || "CL")}</div>
          <div class="client-card-main">
            <div class="client-card-title">
              <strong>${escapeHtml(client.name)}</strong>
              <span>${escapeHtml(client.team || "Client")}</span>
            </div>
            <p>${escapeHtml(client.email || "No email")}</p>
            <div class="client-card-tags">
              ${client.caseNumber ? `<span>Profile: ${escapeHtml(client.caseNumber)}</span>` : ""}
              <span>${escapeHtml(client.cardType)} ending ${escapeHtml(client.cardEnding || "0000")}</span>
            </div>
          </div>
          <button class="client-use-button" data-load-client="${client.id}" type="button" aria-label="Use ${escapeHtml(client.name)} in editor">
            <span>Use in editor</span>
            <b aria-hidden="true">&rarr;</b>
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

function renderDashboardTemplateUsage() {
  if (!els.dashboardTemplateChart || !els.dashboardTemplateClient || !els.dashboardTemplateTotal) return;

  const previousClient = els.dashboardTemplateClient.value;
  els.dashboardTemplateClient.innerHTML = `
    <option value="">All clients</option>
    ${state.clients
      .map((client) => `<option value="${escapeHtml(client.id)}">${escapeHtml(client.name || "Unnamed Client")}</option>`)
      .join("")}
  `;
  if (previousClient && state.clients.some((client) => client.id === previousClient)) {
    els.dashboardTemplateClient.value = previousClient;
  }

  const selectedClient = els.dashboardTemplateClient.value;
  const invoices = state.invoices.filter((invoice) => !selectedClient || invoice.clientId === selectedClient);
  const usage = templates
    .map((template) => ({
      id: template.id,
      name: template.name,
      initials: template.initials,
      count: invoices.filter((invoice) => invoice.templateId === template.id).length
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  els.dashboardTemplateTotal.textContent = `${invoices.length} ${invoices.length === 1 ? "invoice" : "invoices"}`;

  if (!usage.length) {
    els.dashboardTemplateChart.innerHTML = `
      <div class="dashboard-template-empty">
        Save invoices for ${selectedClient ? "this client" : "your clients"} to see which templates are used most.
      </div>
    `;
    return;
  }

  const maxCount = Math.max(...usage.map((item) => item.count), 1);
  const colors = ["#c62fff", "#6045ff", "#13bdf1", "#8e3dff", "#3278ff", "#00c6d7"];
  els.dashboardTemplateChart.innerHTML = usage
    .map((item, index) => {
      const height = Math.max(34, Math.round((item.count / maxCount) * 190));
      const percentage = Math.round((item.count / invoices.length) * 100);
      return `
        <article class="dashboard-template-bar" style="--usage-height:${height}px;--usage-color:${colors[index % colors.length]}">
          <div class="dashboard-template-track">
            <span><b>${item.count}</b></span>
          </div>
          <strong title="${escapeHtml(item.name)}">${escapeHtml(item.initials || item.name.slice(0, 2).toUpperCase())}</strong>
          <small>${percentage}%</small>
          <p>${escapeHtml(item.name)}</p>
        </article>
      `;
    })
    .join("");
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
                <small>${escapeHtml(client.caseNumber ? `Profile: ${client.caseNumber}` : "Profile label not set")}</small>
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
  renderBulkCases();
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

  const isDraftInvoice = (invoice) => String(invoice.status || "").trim().toLowerCase() === "draft";
  const clientsById = new Map(state.clients.map((client) => [client.id, client]));
  const groupedInvoices = new Map();

  state.invoices.forEach((invoice) => {
    const linkedClient = clientsById.get(invoice.clientId);
    const clientName = linkedClient?.name || invoice.clientName || "Unassigned client";
    const groupKey = invoice.clientId || `name:${String(clientName).trim().toLowerCase()}`;
    if (!groupedInvoices.has(groupKey)) {
      groupedInvoices.set(groupKey, {
        name: clientName,
        email: linkedClient?.email || "",
        invoices: []
      });
    }
    groupedInvoices.get(groupKey).invoices.push(invoice);
  });

  const clientGroups = Array.from(groupedInvoices.values()).sort((a, b) =>
    String(a.name).localeCompare(String(b.name))
  );
  const draftCount = state.invoices.filter(isDraftInvoice).length;
  const generatedCount = state.invoices.length - draftCount;

  const renderInvoiceRows = (invoices, emptyMessage) => {
    if (!invoices.length) {
      return `<div class="saved-list-empty">${escapeHtml(emptyMessage)}</div>`;
    }
    return `
      <div class="saved-invoice-table" role="table" aria-label="Client invoices">
        <div class="saved-invoice-row saved-invoice-head" role="row">
          <span role="columnheader">Invoice #</span>
          <span role="columnheader">Template</span>
          <span role="columnheader">Date</span>
          <span role="columnheader">Total</span>
          <span role="columnheader">Actions</span>
        </div>
        ${invoices
          .map((invoice) => {
            const invoiceDate = invoice.orderDate
              ? formatDisplayDate(invoice.orderDate)
              : formatDateTime(invoice.savedAt);
            return `
              <div class="saved-invoice-row" role="row">
                <strong role="cell">${escapeHtml(invoice.invoiceNumber || "Draft invoice")}</strong>
                <span role="cell"><b class="saved-template-pill">${escapeHtml(getTemplate(invoice.templateId).name)}</b></span>
                <span role="cell">${invoiceDate}</span>
                <strong role="cell">${money(calculateTotals(invoice).total, invoice.currency)}</strong>
                <span class="saved-row-actions" role="cell">
                  <button type="button" data-load-invoice="${escapeHtml(invoice.id)}">Open</button>
                  <button class="is-primary" type="button" data-download-saved="${escapeHtml(invoice.id)}">Download</button>
                </span>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  };

  els.savedGrid.innerHTML = `
    <section class="saved-overview" aria-label="Saved invoice overview">
      <article>
        <span class="saved-overview-icon" aria-hidden="true">SI</span>
        <div><small>Saved invoices</small><strong>${state.invoices.length}</strong></div>
      </article>
      <article>
        <span class="saved-overview-icon" aria-hidden="true">CL</span>
        <div><small>Clients with invoices</small><strong>${clientGroups.length}</strong></div>
      </article>
      <article>
        <span class="saved-overview-icon" aria-hidden="true">DR</span>
        <div><small>Draft invoices</small><strong>${draftCount}</strong></div>
      </article>
    </section>
    <section class="saved-client-directory" aria-label="Invoices grouped by client">
      <div class="saved-directory-heading">
        <div>
          <span class="eyebrow">Client directory</span>
          <h3>Invoices saved by client</h3>
        </div>
        <span>${generatedCount} generated / ${draftCount} drafts</span>
      </div>
      ${
        clientGroups.length
          ? clientGroups
              .map((group, groupIndex) => {
                const generatedInvoices = group.invoices.filter((invoice) => !isDraftInvoice(invoice));
                const draftInvoices = group.invoices.filter(isDraftInvoice);
                const defaultFilter = generatedInvoices.length ? "generated" : "drafts";
                return `
                  <details class="saved-client-panel" data-saved-group="${groupIndex}" ${groupIndex === 0 ? "open" : ""}>
                    <summary>
                      <span class="saved-client-avatar" aria-hidden="true">${escapeHtml(String(group.name).trim().charAt(0).toUpperCase() || "C")}</span>
                      <span class="saved-client-identity">
                        <strong>${escapeHtml(group.name)}</strong>
                        ${group.email ? `<small>${escapeHtml(group.email)}</small>` : ""}
                      </span>
                      <span class="saved-count saved-count-generated">${generatedInvoices.length} Generated</span>
                      <span class="saved-count saved-count-draft">${draftInvoices.length} Drafts</span>
                      <span class="saved-client-chevron" aria-hidden="true">⌄</span>
                    </summary>
                    <div class="saved-client-content">
                      <div class="saved-filter-tabs" role="tablist" aria-label="${escapeHtml(group.name)} invoice status">
                        <button type="button" role="tab" class="${defaultFilter === "generated" ? "is-active" : ""}" aria-selected="${defaultFilter === "generated"}" data-saved-filter="generated">Generated Invoices <b>${generatedInvoices.length}</b></button>
                        <button type="button" role="tab" class="${defaultFilter === "drafts" ? "is-active" : ""}" aria-selected="${defaultFilter === "drafts"}" data-saved-filter="drafts">Saved Drafts <b>${draftInvoices.length}</b></button>
                      </div>
                      <div data-saved-list="generated" ${defaultFilter !== "generated" ? "hidden" : ""}>
                        ${renderInvoiceRows(generatedInvoices, "No generated invoices saved for this client.")}
                      </div>
                      <div data-saved-list="drafts" ${defaultFilter !== "drafts" ? "hidden" : ""}>
                        ${renderInvoiceRows(draftInvoices, "No draft invoices saved for this client.")}
                      </div>
                    </div>
                  </details>
                `;
              })
              .join("")
          : `<div class="saved-directory-empty">
              <span aria-hidden="true">SI</span>
              <h3>No saved invoices yet</h3>
              <p>Create or save an invoice against a client and it will appear here automatically.</p>
              <button class="btn primary" type="button" data-jump="single">Create an invoice</button>
            </div>`
      }
    </section>
  `;

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

  els.savedGrid.querySelectorAll("[data-download-saved]").forEach((button) => {
    button.addEventListener("click", async () => {
      const invoice = state.invoices.find((item) => item.id === button.dataset.downloadSaved);
      if (!invoice) return;
      state.current = cloneInvoice(invoice);
      applyCurrentToForm();
      renderItems();
      renderPreview();
      renderTemplateAssetPreview();
      persist();
      await downloadCurrentInvoicePdf();
    });
  });

  els.savedGrid.querySelectorAll("[data-saved-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const panel = button.closest(".saved-client-panel");
      if (!panel) return;
      const filter = button.dataset.savedFilter;
      panel.querySelectorAll("[data-saved-filter]").forEach((tab) => {
        const selected = tab === button;
        tab.classList.toggle("is-active", selected);
        tab.setAttribute("aria-selected", String(selected));
      });
      panel.querySelectorAll("[data-saved-list]").forEach((list) => {
        list.hidden = list.dataset.savedList !== filter;
      });
    });
  });

  els.savedGrid.querySelector("[data-jump='single']")?.addEventListener("click", () => {
    showView("single");
  });
}

function renderBulkCases() {
  if (!els.bulkCaseList) return;
  const templateFilter = els.bulkCaseTemplateFilter?.value || "";
  const statusFilter = els.bulkCaseStatusFilter?.value || "";
  const cases = state.invoices
    .filter((invoice) => !templateFilter || invoice.templateId === templateFilter)
    .filter(() => !statusFilter || statusFilter === "generated")
    .slice(0, 8);

  if (!cases.length) {
    els.bulkCaseList.innerHTML = `
      <div class="bulk-case-empty">
        No saved bulk cases match these filters. Upload a CSV and generate invoices to create the first case.
      </div>
    `;
    return;
  }

  els.bulkCaseList.innerHTML = cases
    .map((invoice) => {
      const template = getTemplate(invoice.templateId);
      const client = state.clients.find((item) => item.id === invoice.clientId);
      return `
        <button class="bulk-case-item" data-open-bulk-case="${escapeHtml(invoice.id)}" type="button">
          <div>
            <strong>${escapeHtml(template.name)} / ${escapeHtml(invoice.invoiceNumber)}</strong>
            <span class="bulk-case-status">Generated</span>
          </div>
          <small>${escapeHtml(client?.name || invoice.clientName || "No client")} / ${invoice.items.length} product row(s) / ${formatDateTime(invoice.savedAt)}</small>
        </button>
      `;
    })
    .join("");

  els.bulkCaseList.querySelectorAll("[data-open-bulk-case]").forEach((button) => {
    button.addEventListener("click", () => {
      const invoice = state.invoices.find((item) => item.id === button.dataset.openBulkCase);
      if (!invoice) return;
      state.current = cloneInvoice(invoice);
      applyCurrentToForm();
      renderClientWorkflowSelectors();
      syncBulkDetailsFromCurrent();
      showView("bulk");
      persist();
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
      pack: Math.max(1, Number(row.pack || row.Pack || 1)),
      vatCode: row.vatCode || row.vat || row.VAT || "S",
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
    if (els.bulkRowSummary) els.bulkRowSummary.textContent = "Upload a CSV to begin.";
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
  if (els.bulkRowSummary) {
    els.bulkRowSummary.textContent = `${state.bulkRows.length} product row(s) loaded and ready for review.`;
  }
  updateMetrics();
}

function generateBulkInvoices() {
  if (!state.bulkRows.length) return;
  syncBulkDetailsToCurrent();
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
  const autoNumberSeed = Math.floor(100000 + Math.random() * 800000);
  state.bulkRows.forEach((row, index) => {
    const key =
      els.bulkInvoiceNumberMode?.value === "csv"
        ? row.invoiceNumber || row.invoice || `BULK-${autoNumberSeed + index * 237}`
        : `BULK-${autoNumberSeed + index * 237}`;
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
  renderClients();
  updateMetrics();
  persist();
  showView("saved");
}

function downloadSampleCsv() {
  downloadTemplateSampleCsv(els.bulkTemplateSelect.value || state.current.templateId, true);
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function downloadTemplateSampleCsv(templateId, includeBulkColumns) {
  const schema = getTemplateCsvSchema(templateId);
  const template = getTemplate(templateId);
  const headers = [...schema.headers];
  const row = [...schema.row];
  if (includeBulkColumns) {
    headers.push("client", "invoiceNumber");
    row.push("Saved Client Name", `${template.initials}-BULK-001`);
  }
  const csv = [headers, row].map((values) => values.map(csvCell).join(",")).join("\n");
  downloadText(`${template.id}-sample-products.csv`, csv, "text/csv");
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
  const draftInvoices = state.invoices.filter((invoice) => String(invoice.status || "").toLowerCase() === "draft").length;
  const sentInvoices = state.invoices.filter((invoice) => String(invoice.status || "").toLowerCase() === "sent").length;
  const savedInvoices = state.invoices.filter((invoice) => {
    const status = String(invoice.status || "").toLowerCase();
    return !status || status === "saved" || status === "final" || status === "finalised";
  }).length;
  const countries = new Set(
    state.clients
      .flatMap((client) => [client.billToFields?.country, client.shipToFields?.country])
      .map((country) => String(country || "").trim())
      .filter(Boolean)
  );

  if (els.templateCount) els.templateCount.textContent = String(templates.length);
  if (els.clientCount) els.clientCount.textContent = String(state.clients.length);
  if (els.invoiceCount) els.invoiceCount.textContent = String(state.invoices.length);
  if (els.bulkCount) els.bulkCount.textContent = String(state.bulkRows.length);
  if (els.dashboardSummaryClients) els.dashboardSummaryClients.textContent = String(state.clients.length);
  if (els.dashboardSummaryInvoices) els.dashboardSummaryInvoices.textContent = String(state.invoices.length);
  if (els.dashboardSummaryDrafts) els.dashboardSummaryDrafts.textContent = String(draftInvoices);
  if (els.dashboardSummarySaved) els.dashboardSummarySaved.textContent = String(savedInvoices);
  if (els.dashboardSummarySent) els.dashboardSummarySent.textContent = String(sentInvoices);
  if (els.dashboardSummaryCountries) els.dashboardSummaryCountries.textContent = String(countries.size);
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

function bindUtilityDropZone(dropZone, onFiles) {
  if (!dropZone || typeof onFiles !== "function") return;
  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.add("is-dragging");
    });
  });
  ["dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.remove("is-dragging");
    });
  });
  dropZone.addEventListener("drop", (event) => onFiles(event.dataTransfer?.files || []));
}

function isSupportedMetadataFile(file) {
  return file && (isPdfFile(file) || file.type.startsWith("image/") || /\.(jpe?g|png|webp)$/i.test(file.name));
}

function isPdfFile(file) {
  return Boolean(file && (file.type === "application/pdf" || /\.pdf$/i.test(file.name)));
}

function setMetadataFiles(fileList) {
  metadataFiles = Array.from(fileList || []).filter(isSupportedMetadataFile);
  metadataResults = [];
  if (els.metadataResults) {
    els.metadataResults.hidden = true;
    els.metadataResults.innerHTML = "";
  }
  if (els.metadataProcess) els.metadataProcess.disabled = !metadataFiles.length;
  if (!els.metadataFileList) return;
  els.metadataFileList.innerHTML = metadataFiles.length
    ? metadataFiles
        .map(
          (file) => `
            <div class="utility-file-row">
              <span class="utility-file-type">${isPdfFile(file) ? "PDF" : "IMG"}</span>
              <span><strong>${escapeHtml(file.name)}</strong><small>${formatBytes(file.size)}</small></span>
              <b>Ready</b>
            </div>
          `
        )
        .join("")
    : `<p class="utility-empty-copy">No supported files selected.</p>`;
}

function setPdfCompressorFile(file) {
  compressedPdfFile = isPdfFile(file) ? file : null;
  pdfCompressionResult = null;
  if (els.pdfCompressorResults) {
    els.pdfCompressorResults.hidden = true;
    els.pdfCompressorResults.innerHTML = "";
  }
  if (els.pdfCompressorProcess) els.pdfCompressorProcess.disabled = !compressedPdfFile;
  if (!els.pdfCompressorFile) return;
  els.pdfCompressorFile.innerHTML = compressedPdfFile
    ? `
      <div class="utility-file-row">
        <span class="utility-file-type">PDF</span>
        <span><strong>${escapeHtml(compressedPdfFile.name)}</strong><small>${formatBytes(compressedPdfFile.size)}</small></span>
        <b>Ready</b>
      </div>
    `
    : `<p class="utility-empty-copy">Please select a PDF file.</p>`;
}

async function processMetadataFiles() {
  if (!metadataFiles.length || !els.metadataProcess) return;
  const originalContent = els.metadataProcess.innerHTML;
  els.metadataProcess.disabled = true;
  els.metadataProcess.textContent = "Removing metadata...";
  metadataResults = [];

  for (const file of metadataFiles) {
    try {
      const blob = isPdfFile(file) ? await stripPdfMetadata(file) : await stripImageMetadata(file);
      metadataResults.push({
        name: createResultFileName(file.name, "clean"),
        sourceName: file.name,
        blob,
        originalSize: file.size,
        status: "ready"
      });
    } catch (error) {
      metadataResults.push({
        name: file.name,
        sourceName: file.name,
        originalSize: file.size,
        status: "error",
        message: error?.message || "Could not remove metadata."
      });
    }
  }

  els.metadataProcess.innerHTML = originalContent;
  els.metadataProcess.disabled = false;
  renderUtilityResults(els.metadataResults, metadataResults, "Metadata removed");
  window.lucide?.createIcons({ attrs: { "aria-hidden": "true" } });
}

async function processPdfCompression() {
  if (!compressedPdfFile || !els.pdfCompressorProcess) return;
  const originalContent = els.pdfCompressorProcess.innerHTML;
  els.pdfCompressorProcess.disabled = true;
  els.pdfCompressorProcess.textContent = "Compressing PDF...";

  try {
    const PDFLib = await ensurePdfLib();
    const originalBytes = new Uint8Array(await compressedPdfFile.arrayBuffer());
    const pdfDocument = await PDFLib.PDFDocument.load(originalBytes, { updateMetadata: false });
    if (els.pdfRemoveMetadata?.checked) clearPdfMetadata(pdfDocument, PDFLib);
    const optimizedBytes = await pdfDocument.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 50
    });
    const useOptimized = optimizedBytes.length < originalBytes.length;
    const resultBytes = useOptimized ? optimizedBytes : originalBytes;
    pdfCompressionResult = {
      name: createResultFileName(compressedPdfFile.name, "compressed", "pdf"),
      sourceName: compressedPdfFile.name,
      blob: new Blob([resultBytes], { type: "application/pdf" }),
      originalSize: originalBytes.length,
      status: "ready",
      note: useOptimized
        ? `${Math.max(0, Math.round((1 - resultBytes.length / originalBytes.length) * 100))}% smaller`
        : "Already optimized - original size preserved"
    };
  } catch (error) {
    pdfCompressionResult = {
      name: compressedPdfFile.name,
      sourceName: compressedPdfFile.name,
      originalSize: compressedPdfFile.size,
      status: "error",
      message: error?.message || "Could not compress this PDF."
    };
  }

  els.pdfCompressorProcess.innerHTML = originalContent;
  els.pdfCompressorProcess.disabled = false;
  renderUtilityResults(els.pdfCompressorResults, [pdfCompressionResult], "PDF ready");
  window.lucide?.createIcons({ attrs: { "aria-hidden": "true" } });
}

async function stripImageMetadata(file) {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadImageElement(objectUrl);
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;
    const context = canvas.getContext("2d", { alpha: file.type !== "image/jpeg" });
    if (!context) throw new Error("Image processing is not available in this browser.");
    context.drawImage(image, 0, 0);
    const outputType = ["image/jpeg", "image/png", "image/webp"].includes(file.type) ? file.type : "image/png";
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, outputType, outputType === "image/png" ? undefined : 0.94));
    if (!blob) throw new Error("The image could not be re-encoded.");
    return blob;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function stripPdfMetadata(file) {
  const PDFLib = await ensurePdfLib();
  const pdfDocument = await PDFLib.PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });
  clearPdfMetadata(pdfDocument, PDFLib);
  const bytes = await pdfDocument.save({ useObjectStreams: true, addDefaultPage: false, objectsPerTick: 50 });
  return new Blob([bytes], { type: "application/pdf" });
}

function clearPdfMetadata(pdfDocument, PDFLib) {
  pdfDocument.context.trailerInfo.Info = undefined;
  pdfDocument.catalog.delete(PDFLib.PDFName.of("Metadata"));
}

function ensurePdfLib() {
  if (window.PDFLib?.PDFDocument) return Promise.resolve(window.PDFLib);
  if (pdfLibPromise) return pdfLibPromise;
  pdfLibPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js";
    script.async = true;
    script.onload = () => (window.PDFLib?.PDFDocument ? resolve(window.PDFLib) : reject(new Error("PDF processor did not initialize.")));
    script.onerror = () => reject(new Error("PDF processor could not load. Check your connection and try again."));
    document.head.appendChild(script);
  });
  return pdfLibPromise;
}

function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("This image could not be opened."));
    image.src = src;
  });
}

function renderUtilityResults(container, results, heading) {
  if (!container) return;
  container.hidden = false;
  container.innerHTML = `
    <div class="utility-results-heading">
      <div><span class="utility-result-check">OK</span><div><h3>${escapeHtml(heading)}</h3><p>${results.filter((result) => result?.status === "ready").length} file(s) ready to download.</p></div></div>
    </div>
    <div class="utility-result-list">
      ${results
        .map((result, index) => {
          if (!result || result.status === "error") {
            return `<div class="utility-result-row is-error"><span>!</span><div><strong>${escapeHtml(result?.sourceName || "File")}</strong><small>${escapeHtml(result?.message || "Processing failed.")}</small></div></div>`;
          }
          return `
            <div class="utility-result-row">
              <span>OK</span>
              <div><strong>${escapeHtml(result.name)}</strong><small>${formatBytes(result.originalSize)} -> ${formatBytes(result.blob.size)}${result.note ? ` - ${escapeHtml(result.note)}` : ""}</small></div>
              <button type="button" data-utility-download="${index}">Download</button>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
  container.querySelectorAll("[data-utility-download]").forEach((button) => {
    button.addEventListener("click", () => {
      const result = results[Number(button.dataset.utilityDownload)];
      if (result?.blob) downloadBlob(result.name, result.blob);
    });
  });
}

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function createResultFileName(filename, suffix, forcedExtension = "") {
  const lastDot = filename.lastIndexOf(".");
  const base = (lastDot > 0 ? filename.slice(0, lastDot) : filename).replace(/[^a-z0-9._-]+/gi, "-");
  const extension = forcedExtension || (lastDot > 0 ? filename.slice(lastDot + 1) : "file");
  return `${base}-${suffix}.${extension.toLowerCase()}`;
}

function formatBytes(value) {
  const bytes = Math.max(0, Number(value || 0));
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
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
    "data-cleaning": "Data Cleaning & Invoice Splitter",
    "meta-remover": "Meta Remover",
    "pdf-compressor": "PDF Compressor"
  };
  document.body.classList.add("dashboard-light");
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
  window.refreshCustomSelects?.();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function calculateTotals(invoice) {
  const subtotal = invoice.items.reduce((sum, item) => sum + rowTotal(item), 0);
  const requestedDiscount = invoice.templateId === "mastertrade"
    ? subtotal * (Math.max(0, Number(invoice.mastertradeDiscountRate || 0)) / 100)
    : invoice.templateId === "unfi"
      ? Number(invoice.unfiDiscount || 0)
      : invoice.templateId === "sephorausa"
        ? Number(invoice.sephoraUsaDiscount || 0)
        : Number(invoice.pcsDiscount || 0);
  const discount = Math.min(subtotal, Math.max(0, requestedDiscount));
  const netAmount = subtotal - discount;
  const shipping = invoice.templateId === "pcsbooks"
    ? Number(invoice.pcsPostage ?? invoice.shippingAmount ?? 0)
    : Number(invoice.shippingAmount || 0);
  const taxRate = Number(invoice.taxRate || 0);
  const vatInclusive = invoice.templateId === "jellycat" || invoice.templateId === "scrubdaddy" || invoice.templateId === "paperstone";
  const taxBase = invoice.templateId === "justmae" ? netAmount + shipping
    : invoice.templateId === "clearanceking"
      ? netAmount + shipping
      : vatInclusive
        ? netAmount + shipping
        : netAmount;
  const tax = vatInclusive ? taxBase * (taxRate / (100 + taxRate || 1)) : taxBase * (taxRate / 100);
  const templateFee = invoice.templateId === "justmae" ? Number(invoice.justmaePaypalFee || 0) : 0;
  return {
    subtotal,
    discount,
    tax,
    shipping,
    total: netAmount + shipping + templateFee + (vatInclusive ? 0 : tax)
  };
}

function rowTotal(item) {
  return Number(item.qty || 0) * Number(item.unit || 0);
}

function money(value, currency) {
  const symbol = currencySymbol(currency);
  return `${symbol}${Number(value || 0).toFixed(2)}`;
}

function sephoraUsd(value) {
  const amount = Number(value || 0);
  const fractionDigits = amount === 0 || !Number.isInteger(amount) ? 2 : 0;
  return `USD $${amount.toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: 2
  })}`;
}

function currencySymbol(currency) {
  if (currency === "GBP") return "\u00a3";
  if (currency === "EUR") return "\u20ac";
  if (currency === "CAD") return "C$";
  if (currency === "AUD") return "A$";
  if (currency === "JPY" || currency === "CNY") return "\u00a5";
  if (currency === "INR") return "\u20b9";
  if (currency === "AED") return "AED ";
  if (currency === "CHF") return "CHF ";
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

function formatQogitaDate(value) {
  if (!value) return "";
  const [year, month, day] = String(value).split("-").map(Number);
  if (!year || !month || !day) return escapeHtml(value);
  const suffix = day % 100 >= 11 && day % 100 <= 13
    ? "th"
    : day % 10 === 1 ? "st" : day % 10 === 2 ? "nd" : day % 10 === 3 ? "rd" : "th";
  return `${new Date(year, month - 1, day).toLocaleDateString("en-GB", { month: "short" })} ${day}${suffix}, ${year}`;
}

function formatMastertradeDate(value) {
  if (!value) return "";
  const [year, month, day] = String(value).split("-");
  if (!year || !month || !day) return escapeHtml(value);
  return `${day}.${month}.${year}`;
}

function formatUsDate(value) {
  if (!value) return "";
  const [year, month, day] = String(value).split("-");
  if (!year || !month || !day) return escapeHtml(value);
  return `${month}/${day}/${year}`;
}

function formatSephoraUsaDate(value) {
  if (!value) return "";
  const [year, month, day] = String(value).split("-").map(Number);
  if (!year || !month || !day) return escapeHtml(value);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[month - 1]} ${day},${year}`;
}

function formatCardExpiryInput(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

function formatPcsDate(value) {
  if (!value) return "";
  const [year, month, day] = String(value).split("-").map(Number);
  if (!year || !month || !day) return escapeHtml(value);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function formatCosmetixDate(value) {
  if (!value) return "";
  const [year, month, day] = String(value).split("-").map(Number);
  if (!year || !month || !day) return escapeHtml(value);
  const months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
  return `${months[month - 1]} ${day}, ${year}`;
}

function formatSunskyDate(value) {
  if (!value) return "";
  const [year, month, day] = String(value).split("-").map(Number);
  if (!year || !month || !day) return escapeHtml(value);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function formatJustmaeDate(value) {
  if (!value) return "";
  const [year, month, day] = String(value).split("-").map(Number);
  if (!year || !month || !day) return escapeHtml(value);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${String(day).padStart(2, "0")}-${months[month - 1]}-${String(year).slice(-2)}`;
}

function formatJellycatDate(value) {
  if (!value) return "";
  const [year, month, day] = String(value).split("-").map(Number);
  if (!year || !month || !day) return escapeHtml(value);
  const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day}${suffix} ${months[month - 1]} ${year}`;
}

function formatScrubDaddyDate(value) {
  if (!value) return "";
  const [year, month, day] = String(value).split("-").map(Number);
  if (!year || !month || !day) return escapeHtml(value);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function formatBulkBuyAmericaDate(value) {
  if (!value) return "";
  const [year, month, day] = String(value).split("-").map(Number);
  if (!year || !month || !day) return escapeHtml(value);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day} ${months[month - 1]} ${year}`;
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
