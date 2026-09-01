const allTemplates = [
  { id: "pound", name: "Pound Wholesale UK", team: "Pound Wholesale Team", region: "UK", color: "#29345f", initials: "PW" },
  { id: "zoro", name: "Zoro USA", team: "Zoro Team", region: "USA", color: "#1f1f1f", initials: "ZU" },
  { id: "gosupps", name: "GO SUPPS.COM", team: "Go Supps Team", region: "USA/EU", color: "#c31421", initials: "GS" },
  { id: "tw", name: "T W Wholesale & Superstore", team: "Pound Wholesale Team", region: "UK", color: "#d51f2a", initials: "TW" },
  { id: "bobmartin", name: "Bob Martin Invoice", team: "Bob Martin Team", region: "UK", color: "#1697d5", initials: "BM" },
  { id: "abw", name: "ABW Asian Beauty Wholesale", team: "ABW Beauty Wholesale Team", region: "Hong Kong / Global", color: "#ed1763", initials: "ABW" },
  { id: "ryze", name: "RYZE Coffee Paid Invoice", team: "RYZE Superfoods Team", region: "USA / Global", color: "#6b38c7", initials: "RY" },
  { id: "vetuk", name: "VET UK Petcare", team: "Vet UK Team", region: "UK", color: "#111111", initials: "VU" },
  { id: "petshop", name: "Petshop.co.uk Sales Order", team: "Petshop.co.uk Team", region: "UK", color: "#5575bb", initials: "PS" },
  { id: "pcsbooks", name: "PCS Books", team: "PCS Books Team", region: "UK", color: "#18324a", initials: "PB" },
  { id: "cosmetix", name: "Cosmetix Club", team: "Cosmetix Club Team", region: "USA", color: "#ee7c91", initials: "CC" },
  { id: "costcouk", name: "Costco Wholesale UK", team: "Costco UK Team", region: "UK", color: "#005daa", initials: "CU" },
  { id: "abena", name: "Abena Prepaid Invoice", team: "Abena UK Team", region: "UK", color: "#090caa", initials: "AB" },
  { id: "salonsupplies", name: "Salon Supplies", team: "Salon Supplies Team", region: "UK", color: "#c21862", initials: "SS" },
  { id: "dallaswholesale", name: "Dallas Wholesale Group", team: "Dallas Wholesale Group Team", region: "USA", color: "#0753ad", initials: "DW" },
  { id: "bruide", name: "Bruide Tools Invoice", team: "Bruide Tools Team", region: "China / Global", color: "#25105a", initials: "BR" },
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
  { id: "perfumeunlimited", name: "Perfume Limited Tax Invoice", team: "Perfume Limited Team", region: "UAE / Global", color: "#00b0f0", initials: "PU" },
  { id: "porton", name: "Porton Garden Aquatic & Pets", team: "Porton Team", region: "UK", color: "#2d643e", initials: "PG" },
  { id: "luxurysouq", name: "Luxury Souq (Watches)", team: "Luxury Souq Team", region: "UAE / UK", color: "#171722", initials: "LS" },
  { id: "autodoc", name: "Auto Doc Invoice", team: "Auto Doc Team", region: "UK", color: "#ff5a00", initials: "AD" },
  { id: "walmart", name: "Walmart Order Invoice", team: "Walmart Team", region: "USA", color: "#0071dc", initials: "WM" }
];

const templateAccessKey = "mc011-template-access-v1";
let templates = getAuthorizedTemplates(allTemplates);

function getAuthorizedTemplates(catalog) {
  try {
    const access = JSON.parse(localStorage.getItem(templateAccessKey) || "null");
    if (!access || access.role === "admin" || access.mode === "all") return catalog;
    const allowed = new Set(Array.isArray(access.allowedTemplateIds) ? access.allowedTemplateIds : []);
    return catalog.filter((template) => allowed.has(template.id));
  } catch {
    return catalog;
  }
}

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
  walmart: { headers: ["Description", "Qty", "Unit Price"], row: ["Great Value grocery product", "2", "4.96"] },
  tw: { headers: ["description", "qty", "unit"], row: ["Trade product description", "10", "5.39"] },
  gosupps: { headers: ["qty", "description", "unit"], row: ["150", "CeraVe Day & Night Face Lotion Skin Care Set", "15.99"] },
  pcsbooks: { headers: ["sku", "qty", "description", "unit"], row: ["PB1001", "4", "Paperback wholesale title", "3.25"] },
  costcouk: { headers: ["sku", "description", "unit", "qty"], row: ["CU1001", "Kirkland Signature Product", "12.99", "6"] },
  abena: { headers: ["sku", "qty", "product", "description", "unit", "vatCode"], row: ["621006", "1", "PAC", "Facial tissues pure pulp 20x19.5cm", "0.91", "1"] },
  salonsupplies: { headers: ["qty", "description", "sku", "listPrice", "unit"], row: ["15", "FIBER 50g CREW", "18505", "3.49", "3.49"] },
  dallaswholesale: { headers: ["product", "qty", "sku", "description", "unit"], row: ["Henckels Classic 15-pc Self-Sharpening Block Set", "15", "B07FMDN42N", "Henckels Classic 15-pc Self-Sharpening Block Set", "165.95"] },
  bruide: { headers: ["sku", "product", "qty", "unit"], row: ["H7K2L9Q", "Burgundy Red Touch Up Paint for Cars", "30", "6.20"] },
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
  sephorausa: { headers: ["product", "sku", "description", "qty", "unit"], row: ["Beauty Campaign", "SE1001", "Sephora beauty product", "5", "14.95"] },
  porton: { headers: ["description", "qty", "unit"], row: ["Marina 7.5cm Nylon Net 20cm Vinyl Coated Handle", "1", "1.99"] },
  bobmartin: { headers: ["sku", "description", "qty", "unit"], row: ["K0401S", "Bob Martin Clear Spot-On for Cats - 1 Dose", "1", "5.17"] },
  abw: { headers: ["sku", "qty", "product", "brand", "description", "unit"], row: ["8809560224299 x 80", "1", "1123312066", "BANILA CO", "Clean It Zero Cleansing Balm Original Mini (x80) (Bulk Box)", "415.00"] },
  ryze: { headers: ["description", "qty", "unit"], row: ["RYZE Mushroom Coffee USDA Organic, 30 servings", "100", "7.50"] }
};

const templateOptionalFields = {
  deliveryDateField: new Set(["pound", "zoro", "gosupps", "tw", "bobmartin", "ryze", "vetuk", "cosmetix", "costcouk", "abena", "scrubdaddy", "bestway", "mastertrade", "unfi"]),
  poNumberField: new Set(["pound", "zoro", "gosupps", "tw", "vetuk", "costcouk", "abena", "jellycat", "scrubdaddy", "bestway", "paperstone", "unfi", "bulkbuyamerica", "sephorausa"]),
  paymentDetailsField: new Set(["pound", "tw", "cosmetix", "qogitauk", "abena", "clearanceking", "sunsky", "idealtrading"]),
  paymentMethodField: new Set(["pound", "zoro", "gosupps", "tw", "bobmartin", "abw", "ryze", "vetuk", "cosmetix", "costcouk", "qogitauk", "abena", "bruide", "clearanceking", "sunsky", "justmae", "jellycat", "scrubdaddy", "bestway", "mastertrade", "idealtrading", "luxurysouq", "porton"]),
  trackingIdField: new Set(["gosupps", "tw", "bruide", "clearanceking", "unfi"]),
  orderIdField: new Set(["pound", "zoro", "gosupps", "tw", "bobmartin", "costcouk", "qogitauk", "bruide", "clearanceking", "jellycat", "bestway", "unfi", "bulkbuyamerica", "sephorausa"]),
  invoiceCardExpiryField: new Set(["costcouk", "qogitauk", "sunsky", "mastertrade", "luxurysouq"]),
  cardTypeField: new Set(["pound", "zoro", "tw", "bobmartin", "ryze", "vetuk", "pcsbooks", "costcouk", "qogitauk", "sunsky", "bestway", "mastertrade", "idealtrading", "luxurysouq"]),
  cardEndingField: new Set(["pound", "zoro", "tw", "bobmartin", "ryze", "vetuk", "pcsbooks", "costcouk", "qogitauk", "sunsky", "bestway", "mastertrade", "idealtrading", "luxurysouq"]),
  shippingAmountField: new Set(["pound", "zoro", "gosupps", "tw", "bobmartin", "abw", "ryze", "vetuk", "pcsbooks", "cosmetix", "costcouk", "qogitauk", "abena", "bruide", "clearanceking", "sunsky", "justmae", "jellycat", "scrubdaddy", "bestway", "mastertrade", "idealtrading", "unfi", "bulkbuyamerica", "sephorausa", "luxurysouq", "perfumeunlimited", "porton"])
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

async function initializeInvoiceStudio() {
  if (
    window.__INVOICE_CLOUD_CONFIG__?.clerkPublishableKey &&
    window.__INVOICE_CLOUD_CONFIG__?.convexUrl &&
    !window.InvoiceCloud?.ready
  ) {
    await new Promise((resolve) => window.addEventListener("invoice-cloud-ready", resolve, { once: true }));
  }
  templates = getAuthorizedTemplates(allTemplates);
  bindElements();
  initializeDynamicTitleLayout();
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
  renderBulkInvoiceForms();
  updateMetrics();
  bindEvents();
  window.initializeCustomSelects?.(document);
  window.lucide?.createIcons({
    attrs: {
      "aria-hidden": "true"
    }
  });
}

document.addEventListener("DOMContentLoaded", () => void initializeInvoiceStudio());

let dynamicTitleLayoutFrame = 0;

function initializeDynamicTitleLayout() {
  if (!els.invoicePreview) return;

  const schedule = () => {
    window.cancelAnimationFrame(dynamicTitleLayoutFrame);
    dynamicTitleLayoutFrame = window.requestAnimationFrame(() => {
      const invoice = els.invoicePreview.querySelector(".invoice-doc");
      if (invoice) applyDynamicTitleLayout(invoice);
    });
  };

  new MutationObserver(schedule).observe(els.invoicePreview, {
    childList: true,
    subtree: true,
    characterData: true
  });

  document.fonts?.ready.then(schedule);
}

function applyDynamicTitleLayout(invoice) {
  invoice.classList.add("dynamic-title-layout");
  invoice.style.removeProperty("--invoice-title-flow-offset");
  invoice.style.removeProperty("--paperstone-title-flow-offset");

  invoice.querySelectorAll("tbody tr").forEach((row) => {
    const cells = Array.from(row.cells || []);
    cells.forEach((cell) => cell.classList.remove("invoice-title-cell"));
    const titleCell = cells
      .filter((cell) => !cell.closest(".invoice-totals, .paperstone-total-box"))
      .sort((left, right) => right.textContent.trim().length - left.textContent.trim().length)[0];
    if (titleCell) titleCell.classList.add("invoice-title-cell");
  });

  if (invoice.classList.contains("perfume-unlimited-invoice")) {
    const table = invoice.querySelector(".perfume-unlimited-products");
    const rowCount = table?.tBodies[0]?.rows.length || 0;
    const naturalHeight = 31.68 + rowCount * 16;
    const extraHeight = table ? Math.max(0, table.getBoundingClientRect().height - naturalHeight) : 0;
    invoice.style.setProperty("--invoice-title-flow-offset", `${extraHeight}px`);
  }

  if (invoice.classList.contains("porton-invoice")) {
    const table = invoice.querySelector(".porton-products");
    const rowCount = table?.tBodies[0]?.rows.length || 0;
    const naturalHeight = 26.98 + rowCount * 27.98;
    const extraHeight = table ? Math.max(0, table.getBoundingClientRect().height - naturalHeight) : 0;
    invoice.style.setProperty("--invoice-title-flow-offset", `${extraHeight}px`);
  }

  if (invoice.classList.contains("paperstone-invoice")) {
    const items = invoice.querySelector(".paperstone-lower-items");
    const extraHeight = items ? Math.max(0, items.scrollHeight - 448) : 0;
    invoice.style.setProperty("--paperstone-title-flow-offset", `${extraHeight}px`);
  }

  keepAbsoluteFooterBelowContent(invoice);
}

function keepAbsoluteFooterBelowContent(invoice) {
  const footer = Array.from(invoice.children).find((child) => {
    const tagName = child.tagName?.toLowerCase();
    return tagName === "footer" && getComputedStyle(child).position === "absolute";
  });
  if (
    !footer
    || footer.classList.contains("perfume-unlimited-footer")
    || footer.classList.contains("porton-footer")
  ) return;

  footer.style.removeProperty("transform");
  const invoiceRect = invoice.getBoundingClientRect();
  const footerTop = footer.getBoundingClientRect().top - invoiceRect.top;
  const contentBottom = Array.from(invoice.children)
    .filter((child) => child !== footer && getComputedStyle(child).display !== "none")
    .reduce((bottom, child) => Math.max(bottom, child.getBoundingClientRect().bottom - invoiceRect.top), 0);
  const offset = Math.max(0, contentBottom + 24 - footerTop);
  if (offset > 0) {
    footer.style.transform = `translateY(${offset}px)`;
    invoice.style.minHeight = `${Math.ceil(Math.max(invoice.scrollHeight, footer.offsetTop + offset + footer.offsetHeight + 24))}px`;
  }
}

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
    "deliveryDateLabel",
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
    "trackingIdLabel",
    "orderId",
    "orderIdField",
    "orderIdLabel",
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
    "qogitaFields",
    "qogitaFooterText",
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
    "perfumeUnlimitedFields",
    "perfumeTitle",
    "perfumeCompanyName",
    "perfumeAddress",
    "perfumeTrn",
    "perfumeEmail",
    "perfumeThankYou",
    "perfumeFooterNote",
    "perfumePageLabel",
    "portonFields",
    "portonSellerName",
    "portonVatNumber",
    "bobMartinFields",
    "bobMartinBillingEmail",
    "bobMartinShippingMethod",
    "bobMartinDiscount",
    "bobMartinDiscountTax",
    "bobMartinShippingTax",
    "bobMartinFee",
    "abwFields",
    "abwCustomerId",
    "abwBillingEmail",
    "abwShippingEmail",
    "abwShippingMethod",
    "abwCoupon",
    "abwShipmentHandlingFee",
    "abwProductLabellingFee",
    "abwFreeProductHandlingFee",
    "abwCreditCardHandlingFee",
    "ryzeFields",
    "ryzeSellerAddress",
    "ryzeSellerPhone",
    "ryzeShippedFrom",
    "ryzeReduction",
    "ryzeTerms",
    "ryzeReturnPolicy",
    "ryzeContactEmail",
    "ryzeSignatory",
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
    "walmartFields",
    "walmartPrintDateTime",
    "walmartDeliveryLabel",
    "walmartDeliveryListPrice",
    "walmartDriverTip",
    "abenaFields",
    "abenaInvoiceAccount",
    "abenaOrderAccount",
    "abenaReference",
    "abenaDueDate",
    "abenaSalesOrder",
    "abenaOurReference",
    "abenaTermsOfDelivery",
    "abenaDeliveryNumber",
    "abenaPageLabel",
    "abenaNetWeight",
    "abenaGrossWeight",
    "abenaVolume",
    "abenaPackingDetails",
    "salonSuppliesFields",
    "salonSupplierAddress",
    "salonAccountRef",
    "salonCustomerNumber",
    "salonCustomerTel",
    "salonTotalBalance",
    "salonPageLabel",
    "salonVatNumber",
    "salonCompanyNumber",
    "salonRegisteredOffice",
    "salonShortageNotice",
    "dallasFields",
    "dallasCompanyName",
    "dallasCompanyAddress",
    "dallasPhone",
    "dallasEmail",
    "dallasWebsite",
    "dallasTerms",
    "dallasDueDate",
    "dallasPageLabel",
    "autodocFields",
    "autodocCompanyName",
    "autodocPhone",
    "autodocAddress",
    "autodocOrderReference",
    "autodocBankInformation",
    "autodocTerms",
    "autodocPageLabel",
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
    "saveEditorInvoice",
    "invoiceSaveNotice",
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
    "bulkCardType",
    "bulkCardLast4",
    "bulkCardExpiry",
    "bulkBatchFields",
    "bulkBatchFieldGrid",
    "bulkApplyAllLists",
    "bulkRowSummary",
    "bulkCaseTemplateFilter",
    "bulkCaseStatusFilter",
    "bulkCaseList",
    "bulkRowsHead",
    "bulkRows",
    "bulkInvoiceSetup",
    "bulkInvoiceSetupSummary",
    "bulkInvoiceForms",
    "bulkDownloadAll",
    "bulkDownload5mb",
    "bulkSaveAll",
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
  if (els.taxRateField) els.taxRateField.hidden = templateId === "abw";
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
    "qogitaFooterText",
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
    "perfumeTitle",
    "perfumeCompanyName",
    "perfumeAddress",
    "perfumeTrn",
    "perfumeEmail",
    "perfumeThankYou",
    "perfumeFooterNote",
    "perfumePageLabel",
    "bobMartinShippingMethod",
    "bobMartinBillingEmail",
    "bobMartinDiscount",
    "bobMartinDiscountTax",
    "bobMartinShippingTax",
    "bobMartinFee",
    "abwCustomerId",
    "abwBillingEmail",
    "abwShippingEmail",
    "abwShippingMethod",
    "abwCoupon",
    "abwShipmentHandlingFee",
    "abwProductLabellingFee",
    "abwFreeProductHandlingFee",
    "abwCreditCardHandlingFee",
    "ryzeSellerAddress",
    "ryzeSellerPhone",
    "ryzeShippedFrom",
    "ryzeReduction",
    "ryzeTerms",
    "ryzeReturnPolicy",
    "ryzeContactEmail",
    "ryzeSignatory",
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
    "walmartPrintDateTime",
    "walmartDeliveryLabel",
    "walmartDeliveryListPrice",
    "walmartDriverTip",
    "abenaInvoiceAccount",
    "abenaOrderAccount",
    "abenaReference",
    "abenaDueDate",
    "abenaSalesOrder",
    "abenaOurReference",
    "abenaTermsOfDelivery",
    "abenaDeliveryNumber",
    "abenaPageLabel",
    "abenaNetWeight",
    "abenaGrossWeight",
    "abenaVolume",
    "abenaPackingDetails",
    "dallasCompanyName",
    "dallasCompanyAddress",
    "dallasPhone",
    "dallasEmail",
    "dallasWebsite",
    "dallasTerms",
    "dallasDueDate",
    "dallasPageLabel",
    "autodocCompanyName",
    "autodocPhone",
    "autodocAddress",
    "autodocOrderReference",
    "autodocBankInformation",
    "autodocTerms",
    "autodocPageLabel",
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
    clearBulkInvoiceGroups();
  });
  ["bulkCardType", "bulkCardLast4", "bulkCardExpiry"].forEach(
    (id) => {
      els[id]?.addEventListener("input", syncBulkDetailsToCurrent);
      els[id]?.addEventListener("change", syncBulkDetailsToCurrent);
    }
  );
  els.bulkBatchFieldGrid?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-apply-bulk-list]");
    if (!button) return;
    applyBulkFieldList(button.dataset.applyBulkList);
  });
  els.bulkApplyAllLists?.addEventListener("click", applyAllBulkFieldLists);
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
      state.current.items.push({ sku: "", product: "", brand: "", description: "", qty: 1, pack: 1, vatCode: "S", listPrice: 0, unit: 0 });
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
    const value = field === "qty" || field === "pack" || field === "unit" || field === "listPrice" ? Number(input.value || 0) : input.value;
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
    if (!state.current.items.length) state.current.items.push({ sku: "", product: "", brand: "", description: "", qty: 1, pack: 1, vatCode: "S", listPrice: 0, unit: 0 });
    renderItems();
    renderPreview();
    persist();
  });

  els.saveInvoice.addEventListener("click", () => void saveCurrentInvoice(els.saveInvoice));
  els.backToWebsite.addEventListener("click", closeToolPage);
  els.openVetUk.addEventListener("click", openVetUkForm);
  els.downloadInvoice.addEventListener("click", () => downloadCurrentInvoicePdf());
  els.saveEditorInvoice.addEventListener("click", () => void saveCurrentInvoice(els.saveEditorInvoice));
  els.invoiceSavedInvoices.addEventListener("click", () => {
    renderSavedInvoices();
    showView("saved");
  });
  els.downloadInvoiceJpg.addEventListener("click", downloadCurrentInvoiceJpg);
  els.resetDemo.addEventListener("click", resetDemo);
  els.csvUpload.addEventListener("change", handleCsvUpload);
  els.singleCsvUpload.addEventListener("change", handleSingleCsvUpload);
  els.downloadSingleSampleCsv.addEventListener("click", () => downloadTemplateSampleCsv(state.current.templateId, false));
  els.downloadSampleCsv.addEventListener("click", downloadSampleCsv);
  els.generateBulk.addEventListener("click", generateBulkInvoices);
  els.bulkSaveAll?.addEventListener("click", generateBulkInvoices);
  els.bulkDownloadAll?.addEventListener("click", () => downloadBulkInvoices(false));
  els.bulkDownload5mb?.addEventListener("click", () => downloadBulkInvoices(true));
  els.bulkInvoiceForms?.addEventListener("input", handleBulkInvoiceFieldInput);
  els.bulkInvoiceForms?.addEventListener("change", handleBulkInvoiceFieldInput);
  els.bulkInvoiceForms?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-download-bulk-invoice]");
    if (!button) return;
    void downloadSingleBulkInvoice(Number(button.dataset.downloadBulkInvoice), button);
  });
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
    bulkInvoiceGroups: [],
    templateAssets: {}
  };
}

function normalizeState() {
  state.clients = state.clients || [];
  state.invoices = state.invoices || [];
  state.bulkRows = state.bulkRows || [];
  state.bulkInvoiceGroups = Array.isArray(state.bulkInvoiceGroups) ? state.bulkInvoiceGroups : [];
  state.templateAssets = state.templateAssets || {};
  if (templates.length === 0) return;
  if (state.current) {
    if (!templates.some((template) => template.id === state.current.templateId)) {
      state.current.templateId = templates[0].id;
    }
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
    if (typeof state.current.qogitaFooterText !== "string") {
      state.current.qogitaFooterText = "© 2025 Qogita. All rights reserved.";
    }
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
    state.current.perfumeTitle = state.current.perfumeTitle || "TAX INVOICE";
    state.current.perfumeCompanyName = state.current.perfumeCompanyName || "PERFUME UNLIMITED";
    state.current.perfumeAddress = state.current.perfumeAddress || "Shop No 3, Al-Daghaya (Al Sabkha)\nDeira,Dubai,UAE";
    state.current.perfumeTrn = state.current.perfumeTrn || "100430681500008";
    state.current.perfumeEmail = state.current.perfumeEmail || "wholesale@perfumeunlimited.com";
    state.current.perfumeThankYou = state.current.perfumeThankYou || "Thank you for your business!";
    state.current.perfumeFooterNote = state.current.perfumeFooterNote || "This is an electronically generated document no signature required.";
    state.current.perfumePageLabel = state.current.perfumePageLabel || "Page 1 of 1";
    state.current.portonSellerName = state.current.portonSellerName || "Porton Garden Aquatic & Pets";
    state.current.portonVatNumber = state.current.portonVatNumber || "750456633";
    state.current.bobMartinShippingMethod = state.current.bobMartinShippingMethod || "1-3 Working Days";
    state.current.bobMartinBillingEmail = state.current.bobMartinBillingEmail || "";
    state.current.bobMartinDiscount = Number(state.current.bobMartinDiscount || 0);
    state.current.bobMartinDiscountTax = Number(state.current.bobMartinDiscountTax || 0);
    state.current.bobMartinShippingTax = Number(state.current.bobMartinShippingTax || 0);
    state.current.bobMartinFee = Number(state.current.bobMartinFee || 0);
    state.current.abwCustomerId = state.current.abwCustomerId || "";
    state.current.abwBillingEmail = state.current.abwBillingEmail || "";
    state.current.abwShippingEmail = state.current.abwShippingEmail || "";
    state.current.abwShippingMethod = state.current.abwShippingMethod || "Express";
    state.current.abwCoupon = Number(state.current.abwCoupon || 0);
    state.current.abwShipmentHandlingFee = Number(state.current.abwShipmentHandlingFee || 0);
    state.current.abwProductLabellingFee = Number(state.current.abwProductLabellingFee || 0);
    state.current.abwFreeProductHandlingFee = Number(state.current.abwFreeProductHandlingFee || 0);
    state.current.abwCreditCardHandlingFee = Number(state.current.abwCreditCardHandlingFee || 0);
    state.current.ryzeSellerAddress = state.current.ryzeSellerAddress || "RYZE SUPERFOODS\n867 Boylston St, 5th FL, #1863\nBoston MA 02199\nUnited States of America (USA)";
    state.current.ryzeSellerPhone = state.current.ryzeSellerPhone || "+1 254 259 6728";
    state.current.ryzeShippedFrom = state.current.ryzeShippedFrom || state.current.ryzeSellerAddress;
    state.current.ryzeReduction = Math.max(0, Number(state.current.ryzeReduction || 0));
    state.current.ryzeTerms = state.current.ryzeTerms || "1. Please pay within 15 days from the date of invoice, overdue interest @ 14% will be charged on delayed payments.\n2. Please quote invoice number when remitting funds.";
    state.current.ryzeReturnPolicy = state.current.ryzeReturnPolicy || "If you would like to return an item to RYZE, you must contact us within 30 days of delivery of your item to request a return shipping label.";
    state.current.ryzeContactEmail = state.current.ryzeContactEmail || "alex@ryzesuperfoods.com";
    state.current.ryzeSignatory = state.current.ryzeSignatory || "Authorized Signatory";
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
    state.current.walmartPrintDateTime = state.current.walmartPrintDateTime || `${formatWalmartPrintDate(state.current.deliveryDate || state.current.orderDate)}, 5:33 AM`;
    state.current.walmartDeliveryLabel = state.current.walmartDeliveryLabel || "Free delivery from store";
    state.current.walmartDeliveryListPrice = Math.max(0, Number(state.current.walmartDeliveryListPrice || 0));
    state.current.walmartDriverTip = Math.max(0, Number(state.current.walmartDriverTip || 0));
    state.current.abenaInvoiceAccount = state.current.abenaInvoiceAccount || "117001";
    state.current.abenaOrderAccount = state.current.abenaOrderAccount || "117001";
    state.current.abenaReference = state.current.abenaReference || "";
    state.current.abenaDueDate = state.current.abenaDueDate || state.current.orderDate || "";
    state.current.abenaSalesOrder = state.current.abenaSalesOrder || "";
    state.current.abenaOurReference = state.current.abenaOurReference || "MULESOFT_ERP";
    state.current.abenaTermsOfDelivery = state.current.abenaTermsOfDelivery || "EXW Coventry";
    state.current.abenaDeliveryNumber = state.current.abenaDeliveryNumber || "";
    state.current.abenaPageLabel = state.current.abenaPageLabel || "1 of 1";
    state.current.abenaNetWeight = state.current.abenaNetWeight || "0.00 G";
    state.current.abenaGrossWeight = state.current.abenaGrossWeight || "0.00 G";
    state.current.abenaVolume = state.current.abenaVolume || "0.00 M3";
    state.current.abenaPackingDetails = state.current.abenaPackingDetails || "";
    state.current.salonSupplierAddress = state.current.salonSupplierAddress || "SALON SUPPLIES\nBond Street\nSouthampton\nHampshire\nSO14 5QA\n0844 335 6121";
    state.current.salonAccountRef = state.current.salonAccountRef || "512796SO";
    state.current.salonCustomerNumber = state.current.salonCustomerNumber || "75922";
    state.current.salonCustomerTel = state.current.salonCustomerTel || "";
    state.current.salonTotalBalance = Math.max(0, Number(state.current.salonTotalBalance || 0));
    state.current.salonPageLabel = state.current.salonPageLabel || "1";
    state.current.salonVatNumber = state.current.salonVatNumber || "834 8405 19";
    state.current.salonCompanyNumber = state.current.salonCompanyNumber || "5064077";
    state.current.salonRegisteredOffice = state.current.salonRegisteredOffice || "Bond Street, Southampton SO14 5QA";
    state.current.salonShortageNotice = state.current.salonShortageNotice || "Shortages must be notified within 48 hours";
    state.current.dallasCompanyName = state.current.dallasCompanyName || "DWG - DALLAS WHOLESALE GROUP";
    state.current.dallasCompanyAddress = state.current.dallasCompanyAddress || "17502 Alejandro Humbolt\nOtay Mesa-MX, CA 22430 US";
    state.current.dallasPhone = state.current.dallasPhone || "+1 4694262816";
    state.current.dallasEmail = state.current.dallasEmail || "fba@dallaswholesalecompany.com";
    state.current.dallasWebsite = state.current.dallasWebsite || "www.dallaswholesalecompany.com";
    state.current.dallasTerms = state.current.dallasTerms || "Due on receipt";
    state.current.dallasDueDate = state.current.dallasDueDate || state.current.orderDate || "";
    state.current.dallasPageLabel = state.current.dallasPageLabel || "Page 1 of 1";
    state.current.autodocCompanyName = state.current.autodocCompanyName || "Autodoc Operations UK Limited";
    state.current.autodocPhone = state.current.autodocPhone || "+44 203 885 3401";
    state.current.autodocAddress = state.current.autodocAddress || "Suite 1, 7th Floor, 50 Broadway\nLondon, SW1H 0DB\nUnited Kingdom";
    state.current.autodocOrderReference = state.current.autodocOrderReference || "";
    state.current.autodocBankInformation = state.current.autodocBankInformation || "Visa card ending in 7743";
    state.current.autodocTerms = state.current.autodocTerms || "The seller acknowledges and permits the buyer to resell the purchased goods in any manner deemed suitable by the buyer.";
    state.current.autodocPageLabel = state.current.autodocPageLabel || "01";
    state.current.amountPaid = state.current.amountPaid ?? null;
    state.current.testMode = false;
    state.current.items = (state.current.items || []).map((item) => ({
      sku: item.sku || "",
      product: item.product || "",
      description: item.description || "",
      qty: Number(item.qty || 1),
      unit: Number(item.unit || 0),
      pack: Math.max(1, Number(item.pack || 1)),
      listPrice: Number(item.listPrice ?? item.unit ?? 0),
      vatCode: item.vatCode || "S"
    }));
  }
}

function persist(options = {}) {
  const storedState = cloneInvoice(state);
  Object.values(storedState.templateAssets || {}).forEach((asset) => {
    delete asset.dataUrl;
  });
  localStorage.setItem(storageKey, JSON.stringify(storedState));
  const cloudSave = window.InvoiceCloud?.saveStorage(
    storageKey,
    storedState,
    storedState.current?.templateId,
    options.immediateCloud === true
  );
  updateMetrics();
  return cloudSave;
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
    currency: "£",
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
    qogitaFooterText: "© 2025 Qogita. All rights reserved.",
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
    perfumeTitle: "TAX INVOICE",
    perfumeCompanyName: "PERFUME UNLIMITED",
    perfumeAddress: "Shop No 3, Al-Daghaya (Al Sabkha)\nDeira,Dubai,UAE",
    perfumeTrn: "100430681500008",
    perfumeEmail: "wholesale@perfumeunlimited.com",
    perfumeThankYou: "Thank you for your business!",
    perfumeFooterNote: "This is an electronically generated document no signature required.",
    perfumePageLabel: "Page 1 of 1",
    portonSellerName: "Porton Garden Aquatic & Pets",
    portonVatNumber: "750456633",
    bobMartinShippingMethod: "1-3 Working Days",
    bobMartinBillingEmail: "",
    bobMartinDiscount: 0,
    bobMartinDiscountTax: 0,
    bobMartinShippingTax: 0,
    bobMartinFee: 0,
    abwCustomerId: "",
    abwBillingEmail: "",
    abwShippingEmail: "",
    abwShippingMethod: "Express",
    abwCoupon: 0,
    abwShipmentHandlingFee: 0,
    abwProductLabellingFee: 0,
    abwFreeProductHandlingFee: 0,
    abwCreditCardHandlingFee: 0,
    ryzeSellerAddress: "RYZE SUPERFOODS\n867 Boylston St, 5th FL, #1863\nBoston MA 02199\nUnited States of America (USA)",
    ryzeSellerPhone: "+1 254 259 6728",
    ryzeShippedFrom: "RYZE SUPERFOODS\n867 Boylston St, 5th FL, #1863\nBoston MA 02199\nUnited States of America (USA)",
    ryzeReduction: 0,
    ryzeTerms: "1. Please pay within 15 days from the date of invoice, overdue interest @ 14% will be charged on delayed payments.\n2. Please quote invoice number when remitting funds.",
    ryzeReturnPolicy: "If you would like to return an item to RYZE, you must contact us within 30 days of delivery of your item to request a return shipping label.",
    ryzeContactEmail: "alex@ryzesuperfoods.com",
    ryzeSignatory: "Authorized Signatory",
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
    walmartPrintDateTime: "",
    walmartDeliveryLabel: "Free delivery from store",
    walmartDeliveryListPrice: 9.95,
    walmartDriverTip: 0,
    abenaInvoiceAccount: "117001",
    abenaOrderAccount: "117001",
    abenaReference: "",
    abenaDueDate: "",
    abenaSalesOrder: "",
    abenaOurReference: "MULESOFT_ERP",
    abenaTermsOfDelivery: "EXW Coventry",
    abenaDeliveryNumber: "",
    abenaPageLabel: "1 of 1",
    abenaNetWeight: "0.00 G",
    abenaGrossWeight: "0.00 G",
    abenaVolume: "0.00 M3",
    abenaPackingDetails: "",
    salonSupplierAddress: "SALON SUPPLIES\nBond Street\nSouthampton\nHampshire\nSO14 5QA\n0844 335 6121",
    salonAccountRef: "512796SO",
    salonCustomerNumber: "75922",
    salonCustomerTel: "",
    salonTotalBalance: 0,
    salonPageLabel: "1",
    salonVatNumber: "834 8405 19",
    salonCompanyNumber: "5064077",
    salonRegisteredOffice: "Bond Street, Southampton SO14 5QA",
    salonShortageNotice: "Shortages must be notified within 48 hours",
    dallasCompanyName: "DWG - DALLAS WHOLESALE GROUP",
    dallasCompanyAddress: "17502 Alejandro Humbolt\nOtay Mesa-MX, CA 22430 US",
    dallasPhone: "+1 4694262816",
    dallasEmail: "fba@dallaswholesalecompany.com",
    dallasWebsite: "www.dallaswholesalecompany.com",
    dallasTerms: "Due on receipt",
    dallasDueDate: "",
    dallasPageLabel: "Page 1 of 1",
    autodocCompanyName: "Autodoc Operations UK Limited",
    autodocPhone: "+44 203 885 3401",
    autodocAddress: "Suite 1, 7th Floor, 50 Broadway\nLondon, SW1H 0DB\nUnited Kingdom",
    autodocOrderReference: "",
    autodocBankInformation: "Visa card ending in 7743",
    autodocTerms: "The seller acknowledges and permits the buyer to resell the purchased goods in any manner deemed suitable by the buyer.",
    autodocPageLabel: "01",
    amountPaid: null,
    cardType: "Visa",
    cardEnding: "",
    taxRate: 0,
    shippingAmount: 0,
    testMode: false,
    items: [{ sku: "", product: "", brand: "", description: "", qty: 1, unit: 0 }]
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
  const isBobMartin = invoice.templateId === "bobmartin";
  const isAbw = invoice.templateId === "abw";
  const isRyze = invoice.templateId === "ryze";
  const isBruide = invoice.templateId === "bruide";
  document.querySelectorAll("[data-paperstone-address-extra]").forEach((field) => {
    field.hidden = isPaperstone;
  });
  document.querySelectorAll("[data-paperstone-address-name-label]").forEach((label) => {
    label.textContent = isPaperstone ? "Person Name / Company Name" : "Name";
  });
  els.invoiceNumberLabel.textContent = isPaperstone ? "Invoice" : isAbw ? "Order Number" : "Invoice #";
  els.orderDateLabel.textContent = isPaperstone ? "Date" : isBobMartin ? "Invoice Date" : "Order Date";
  els.deliveryDateLabel.textContent = isBobMartin ? "Order Date" : "Delivery Date";
  els.invoiceNumberLabel.textContent = isPaperstone ? "Invoice" : "Invoice #";
  els.orderDateLabel.textContent = isPaperstone ? "Date" : isBobMartin || isRyze ? "Invoice Date" : "Order Date";
  els.deliveryDateLabel.textContent = isBobMartin ? "Order Date" : isRyze ? "Due Date" : "Delivery Date";
  els.poNumberLabel.textContent = isPaperstone ? "Your Order No" : "PO Number";
  els.billToLabel.textContent = isPaperstone ? "Invoice Address" : "Bill To";
  els.shipToLabel.textContent = isPaperstone ? "Delivery Address" : "Ship To";
  els.trackingIdLabel.textContent = isBruide ? "Shipping Method" : "Tracking ID";
  els.orderIdLabel.textContent = isBruide ? "User ID #" : "Order ID";
  els.trackingId.placeholder = isBruide ? "FedEx Express" : "Enter tracking ID";
  els.orderId.placeholder = isBruide ? "95876325" : "Enter order ID";
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
  els.qogitaFooterText.value = typeof invoice.qogitaFooterText === "string"
    ? invoice.qogitaFooterText
    : "© 2025 Qogita. All rights reserved.";
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
  els.perfumeTitle.value = invoice.perfumeTitle || "TAX INVOICE";
  els.perfumeCompanyName.value = invoice.perfumeCompanyName || "PERFUME UNLIMITED";
  els.perfumeAddress.value = invoice.perfumeAddress || "";
  els.perfumeTrn.value = invoice.perfumeTrn || "";
  els.perfumeEmail.value = invoice.perfumeEmail || "";
  els.perfumeThankYou.value = invoice.perfumeThankYou || "";
  els.perfumeFooterNote.value = invoice.perfumeFooterNote || "";
  els.perfumePageLabel.value = invoice.perfumePageLabel || "";
  els.portonSellerName.value = invoice.portonSellerName || "Porton Garden Aquatic & Pets";
  els.portonVatNumber.value = invoice.portonVatNumber || "750456633";
  els.bobMartinShippingMethod.value = invoice.bobMartinShippingMethod || "1-3 Working Days";
  els.bobMartinBillingEmail.value = invoice.bobMartinBillingEmail || "";
  els.bobMartinDiscount.value = Number(invoice.bobMartinDiscount || 0);
  els.bobMartinDiscountTax.value = Number(invoice.bobMartinDiscountTax || 0);
  els.bobMartinShippingTax.value = Number(invoice.bobMartinShippingTax || 0);
  els.bobMartinFee.value = Number(invoice.bobMartinFee || 0);
  els.abwCustomerId.value = invoice.abwCustomerId || "";
  els.abwBillingEmail.value = invoice.abwBillingEmail || "";
  els.abwShippingEmail.value = invoice.abwShippingEmail || "";
  els.abwShippingMethod.value = invoice.abwShippingMethod || "Express";
  els.abwCoupon.value = Number(invoice.abwCoupon || 0);
  els.abwShipmentHandlingFee.value = Number(invoice.abwShipmentHandlingFee || 0);
  els.abwProductLabellingFee.value = Number(invoice.abwProductLabellingFee || 0);
  els.abwFreeProductHandlingFee.value = Number(invoice.abwFreeProductHandlingFee || 0);
  els.abwCreditCardHandlingFee.value = Number(invoice.abwCreditCardHandlingFee || 0);
  els.ryzeSellerAddress.value = invoice.ryzeSellerAddress || "";
  els.ryzeSellerPhone.value = invoice.ryzeSellerPhone || "";
  els.ryzeShippedFrom.value = invoice.ryzeShippedFrom || "";
  els.ryzeReduction.value = Number(invoice.ryzeReduction || 0);
  els.ryzeTerms.value = invoice.ryzeTerms || "";
  els.ryzeReturnPolicy.value = invoice.ryzeReturnPolicy || "";
  els.ryzeContactEmail.value = invoice.ryzeContactEmail || "";
  els.ryzeSignatory.value = invoice.ryzeSignatory || "Authorized Signatory";
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
  els.walmartPrintDateTime.value = invoice.walmartPrintDateTime || `${formatWalmartPrintDate(invoice.deliveryDate || invoice.orderDate)}, 5:33 AM`;
  els.walmartDeliveryLabel.value = invoice.walmartDeliveryLabel || "Free delivery from store";
  els.walmartDeliveryListPrice.value = Number(invoice.walmartDeliveryListPrice || 0);
  els.walmartDriverTip.value = Number(invoice.walmartDriverTip || 0);
  els.abenaInvoiceAccount.value = invoice.abenaInvoiceAccount || "117001";
  els.abenaOrderAccount.value = invoice.abenaOrderAccount || "117001";
  els.abenaReference.value = invoice.abenaReference || "";
  els.abenaDueDate.value = invoice.abenaDueDate || invoice.orderDate || "";
  els.abenaSalesOrder.value = invoice.abenaSalesOrder || "";
  els.abenaOurReference.value = invoice.abenaOurReference || "MULESOFT_ERP";
  els.abenaTermsOfDelivery.value = invoice.abenaTermsOfDelivery || "EXW Coventry";
  els.abenaDeliveryNumber.value = invoice.abenaDeliveryNumber || "";
  els.abenaPageLabel.value = invoice.abenaPageLabel || "1 of 1";
  els.abenaNetWeight.value = invoice.abenaNetWeight || "0.00 G";
  els.abenaGrossWeight.value = invoice.abenaGrossWeight || "0.00 G";
  els.abenaVolume.value = invoice.abenaVolume || "0.00 M3";
  els.abenaPackingDetails.value = invoice.abenaPackingDetails || "";
  els.salonSupplierAddress.value = invoice.salonSupplierAddress || "";
  els.salonAccountRef.value = invoice.salonAccountRef || "";
  els.salonCustomerNumber.value = invoice.salonCustomerNumber || "";
  els.salonCustomerTel.value = invoice.salonCustomerTel || "";
  els.salonTotalBalance.value = Number(invoice.salonTotalBalance || 0);
  els.salonPageLabel.value = invoice.salonPageLabel || "1";
  els.salonVatNumber.value = invoice.salonVatNumber || "834 8405 19";
  els.salonCompanyNumber.value = invoice.salonCompanyNumber || "5064077";
  els.salonRegisteredOffice.value = invoice.salonRegisteredOffice || "";
  els.salonShortageNotice.value = invoice.salonShortageNotice || "";
  els.dallasCompanyName.value = invoice.dallasCompanyName || "DWG - DALLAS WHOLESALE GROUP";
  els.dallasCompanyAddress.value = invoice.dallasCompanyAddress || "";
  els.dallasPhone.value = invoice.dallasPhone || "";
  els.dallasEmail.value = invoice.dallasEmail || "";
  els.dallasWebsite.value = invoice.dallasWebsite || "";
  els.dallasTerms.value = invoice.dallasTerms || "Due on receipt";
  els.dallasDueDate.value = invoice.dallasDueDate || invoice.orderDate || "";
  els.dallasPageLabel.value = invoice.dallasPageLabel || "Page 1 of 1";
  els.autodocCompanyName.value = invoice.autodocCompanyName || "Autodoc Operations UK Limited";
  els.autodocPhone.value = invoice.autodocPhone || "+44 203 885 3401";
  els.autodocAddress.value = invoice.autodocAddress || "";
  els.autodocOrderReference.value = invoice.autodocOrderReference || "";
  els.autodocBankInformation.value = invoice.autodocBankInformation || "";
  els.autodocTerms.value = invoice.autodocTerms || "";
  els.autodocPageLabel.value = invoice.autodocPageLabel || "01";
  els.amountPaid.value = invoice.amountPaid ?? "";
  els.amountPaidField.hidden = invoice.templateId !== "cosmetix" && invoice.templateId !== "bulkbuyamerica";
  els.pcsBooksFields.hidden = invoice.templateId !== "pcsbooks";
  els.costcoUkFields.hidden = invoice.templateId !== "costcouk";
  els.qogitaFields.hidden = invoice.templateId !== "qogitauk";
  els.zoroFields.hidden = invoice.templateId !== "zoro";
  els.clearanceKingFields.hidden = invoice.templateId !== "clearanceking";
  els.sunskyFields.hidden = invoice.templateId !== "sunsky";
  els.justmaeFields.hidden = invoice.templateId !== "justmae";
  els.jellycatFields.hidden = invoice.templateId !== "jellycat";
  els.scrubDaddyFields.hidden = invoice.templateId !== "scrubdaddy";
  els.bestwayFields.hidden = invoice.templateId !== "bestway";
  els.paperstoneFields.hidden = invoice.templateId !== "paperstone";
  els.sephoraUsaFields.hidden = invoice.templateId !== "sephorausa";
  els.perfumeUnlimitedFields.hidden = invoice.templateId !== "perfumeunlimited";
  els.portonFields.hidden = invoice.templateId !== "porton";
  els.bobMartinFields.hidden = invoice.templateId !== "bobmartin";
  els.abwFields.hidden = invoice.templateId !== "abw";
  els.ryzeFields.hidden = invoice.templateId !== "ryze";
  els.mastertradeFields.hidden = invoice.templateId !== "mastertrade";
  els.unfiFields.hidden = invoice.templateId !== "unfi";
  els.walmartFields.hidden = invoice.templateId !== "walmart";
  els.abenaFields.hidden = invoice.templateId !== "abena";
  els.salonSuppliesFields.hidden = invoice.templateId !== "salonsupplies";
  els.dallasFields.hidden = invoice.templateId !== "dallaswholesale";
  els.autodocFields.hidden = invoice.templateId !== "autodoc";
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
  state.current.qogitaFooterText = els.qogitaFooterText.value;
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
  state.current.perfumeTitle = els.perfumeTitle.value.trim();
  state.current.perfumeCompanyName = els.perfumeCompanyName.value.trim();
  state.current.perfumeAddress = els.perfumeAddress.value.trim();
  state.current.perfumeTrn = els.perfumeTrn.value.trim();
  state.current.perfumeEmail = els.perfumeEmail.value.trim();
  state.current.perfumeThankYou = els.perfumeThankYou.value.trim();
  state.current.perfumeFooterNote = els.perfumeFooterNote.value.trim();
  state.current.perfumePageLabel = els.perfumePageLabel.value.trim();
  state.current.portonSellerName = els.portonSellerName.value.trim();
  state.current.portonVatNumber = els.portonVatNumber.value.trim();
  state.current.bobMartinShippingMethod = els.bobMartinShippingMethod.value.trim();
  state.current.bobMartinBillingEmail = els.bobMartinBillingEmail.value.trim();
  state.current.bobMartinDiscount = Number(els.bobMartinDiscount.value || 0);
  state.current.bobMartinDiscountTax = Number(els.bobMartinDiscountTax.value || 0);
  state.current.bobMartinShippingTax = Number(els.bobMartinShippingTax.value || 0);
  state.current.bobMartinFee = Number(els.bobMartinFee.value || 0);
  state.current.abwCustomerId = els.abwCustomerId.value.trim();
  state.current.abwBillingEmail = els.abwBillingEmail.value.trim();
  state.current.abwShippingEmail = els.abwShippingEmail.value.trim();
  state.current.abwShippingMethod = els.abwShippingMethod.value.trim();
  state.current.abwCoupon = Number(els.abwCoupon.value || 0);
  state.current.abwShipmentHandlingFee = Number(els.abwShipmentHandlingFee.value || 0);
  state.current.abwProductLabellingFee = Number(els.abwProductLabellingFee.value || 0);
  state.current.abwFreeProductHandlingFee = Number(els.abwFreeProductHandlingFee.value || 0);
  state.current.abwCreditCardHandlingFee = Number(els.abwCreditCardHandlingFee.value || 0);
  state.current.ryzeSellerAddress = els.ryzeSellerAddress.value.trim();
  state.current.ryzeSellerPhone = els.ryzeSellerPhone.value.trim();
  state.current.ryzeShippedFrom = els.ryzeShippedFrom.value.trim();
  state.current.ryzeReduction = Math.max(0, Number(els.ryzeReduction.value || 0));
  state.current.ryzeTerms = els.ryzeTerms.value.trim();
  state.current.ryzeReturnPolicy = els.ryzeReturnPolicy.value.trim();
  state.current.ryzeContactEmail = els.ryzeContactEmail.value.trim();
  state.current.ryzeSignatory = els.ryzeSignatory.value.trim();
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
  state.current.walmartPrintDateTime = els.walmartPrintDateTime.value.trim();
  state.current.walmartDeliveryLabel = els.walmartDeliveryLabel.value.trim();
  state.current.walmartDeliveryListPrice = Math.max(0, Number(els.walmartDeliveryListPrice.value || 0));
  state.current.walmartDriverTip = Math.max(0, Number(els.walmartDriverTip.value || 0));
  state.current.abenaInvoiceAccount = els.abenaInvoiceAccount.value.trim();
  state.current.abenaOrderAccount = els.abenaOrderAccount.value.trim();
  state.current.abenaReference = els.abenaReference.value.trim();
  state.current.abenaDueDate = els.abenaDueDate.value;
  state.current.abenaSalesOrder = els.abenaSalesOrder.value.trim();
  state.current.abenaOurReference = els.abenaOurReference.value.trim();
  state.current.abenaTermsOfDelivery = els.abenaTermsOfDelivery.value.trim();
  state.current.abenaDeliveryNumber = els.abenaDeliveryNumber.value.trim();
  state.current.abenaPageLabel = els.abenaPageLabel.value.trim();
  state.current.abenaNetWeight = els.abenaNetWeight.value.trim();
  state.current.abenaGrossWeight = els.abenaGrossWeight.value.trim();
  state.current.abenaVolume = els.abenaVolume.value.trim();
  state.current.abenaPackingDetails = els.abenaPackingDetails.value.trim();
  state.current.salonSupplierAddress = els.salonSupplierAddress.value.trim();
  state.current.salonAccountRef = els.salonAccountRef.value.trim();
  state.current.salonCustomerNumber = els.salonCustomerNumber.value.trim();
  state.current.salonCustomerTel = els.salonCustomerTel.value.trim();
  state.current.salonTotalBalance = Math.max(0, Number(els.salonTotalBalance.value || 0));
  state.current.salonPageLabel = els.salonPageLabel.value.trim();
  state.current.salonVatNumber = els.salonVatNumber.value.trim();
  state.current.salonCompanyNumber = els.salonCompanyNumber.value.trim();
  state.current.salonRegisteredOffice = els.salonRegisteredOffice.value.trim();
  state.current.salonShortageNotice = els.salonShortageNotice.value.trim();
  state.current.dallasCompanyName = els.dallasCompanyName.value.trim();
  state.current.dallasCompanyAddress = els.dallasCompanyAddress.value.trim();
  state.current.dallasPhone = els.dallasPhone.value.trim();
  state.current.dallasEmail = els.dallasEmail.value.trim();
  state.current.dallasWebsite = els.dallasWebsite.value.trim();
  state.current.dallasTerms = els.dallasTerms.value.trim();
  state.current.dallasDueDate = els.dallasDueDate.value;
  state.current.dallasPageLabel = els.dallasPageLabel.value.trim();
  state.current.autodocCompanyName = els.autodocCompanyName.value.trim();
  state.current.autodocPhone = els.autodocPhone.value.trim();
  state.current.autodocAddress = els.autodocAddress.value.trim();
  state.current.autodocOrderReference = els.autodocOrderReference.value.trim();
  state.current.autodocBankInformation = els.autodocBankInformation.value.trim();
  state.current.autodocTerms = els.autodocTerms.value.trim();
  state.current.autodocPageLabel = els.autodocPageLabel.value.trim();
  state.current.amountPaid = els.amountPaid.value === "" ? null : Number(els.amountPaid.value);
  els.pcsBooksFields.hidden = state.current.templateId !== "pcsbooks";
  els.costcoUkFields.hidden = state.current.templateId !== "costcouk";
  els.qogitaFields.hidden = state.current.templateId !== "qogitauk";
  els.zoroFields.hidden = state.current.templateId !== "zoro";
  els.clearanceKingFields.hidden = state.current.templateId !== "clearanceking";
  els.sunskyFields.hidden = state.current.templateId !== "sunsky";
  els.justmaeFields.hidden = state.current.templateId !== "justmae";
  els.jellycatFields.hidden = state.current.templateId !== "jellycat";
  els.scrubDaddyFields.hidden = state.current.templateId !== "scrubdaddy";
  els.bestwayFields.hidden = state.current.templateId !== "bestway";
  els.paperstoneFields.hidden = state.current.templateId !== "paperstone";
  els.sephoraUsaFields.hidden = state.current.templateId !== "sephorausa";
  els.perfumeUnlimitedFields.hidden = state.current.templateId !== "perfumeunlimited";
  els.portonFields.hidden = state.current.templateId !== "porton";
  els.bobMartinFields.hidden = state.current.templateId !== "bobmartin";
  els.abwFields.hidden = state.current.templateId !== "abw";
  els.ryzeFields.hidden = state.current.templateId !== "ryze";
  els.mastertradeFields.hidden = state.current.templateId !== "mastertrade";
  els.unfiFields.hidden = state.current.templateId !== "unfi";
  els.walmartFields.hidden = state.current.templateId !== "walmart";
  els.abenaFields.hidden = state.current.templateId !== "abena";
  els.salonSuppliesFields.hidden = state.current.templateId !== "salonsupplies";
  els.dallasFields.hidden = state.current.templateId !== "dallaswholesale";
  els.autodocFields.hidden = state.current.templateId !== "autodoc";
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
  if (templateId === "walmart") {
    state.current.currency = "$";
    state.current.invoiceNumber = "2000153-18488842";
    state.current.orderDate = "2026-08-26";
    state.current.deliveryDate = "2026-08-28";
    state.current.poNumber = "";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = state.current.clientName || "Poteet Food Mart";
    state.current.billTo = state.current.billTo || "Poteet Food Mart\n20 Brandywine Dr, Poteet, TX 78065";
    state.current.shipTo = state.current.shipTo || state.current.billTo;
    state.current.paymentDetails = "";
    state.current.paymentMethod = "";
    state.current.trackingId = "";
    state.current.orderId = state.current.invoiceNumber;
    state.current.cardType = "Visa";
    state.current.cardEnding = "";
    state.current.cardExpiry = "";
    state.current.taxRate = 0;
    state.current.shippingAmount = 0;
    state.current.walmartPrintDateTime = "8/28/26, 5:33 AM";
    state.current.walmartDeliveryLabel = "Free delivery from store";
    state.current.walmartDeliveryListPrice = 9.95;
    state.current.walmartDriverTip = 1.73;
    state.current.testMode = false;
    state.current.items = [
      { sku: "Unavailable", product: "", description: "Kraft Natural Medium Cheddar Cheese, 8 oz Block", qty: 2, unit: 2.98 },
      { sku: "22 shopped", product: "", description: "Great Value White Sandwich Bread, 20 oz", qty: 6, unit: 1.48 },
      { sku: "22 shopped", product: "", description: "Great Value Large White Eggs, 12 Count", qty: 6, unit: 1.67 },
      { sku: "22 shopped", product: "", description: "Philadelphia Cream Cheese, 2 Blocks, for Recipes and Baking, Original, No Artificial Preservatives, Flavors or Dye, 8 oz", qty: 2, unit: 4.96 },
      { sku: "22 shopped", product: "", description: "Great Value Milk Whole Vitamin D, Half Gallon, 64 fl oz", qty: 2, unit: 2.22 },
      { sku: "22 shopped", product: "", description: "Great Value Whole Vitamin D Milk, Gallon", qty: 2, unit: 3.67 },
      { sku: "22 shopped", product: "", description: "Great Value Mayonnaise, 18 fl oz", qty: 3, unit: 3.52 },
      { sku: "22 shopped", product: "", description: "Kraft Natural Sharp Cheddar Cheese, 8 oz Block", qty: 1, unit: 2.98 },
      { sku: "", product: "", description: "(3 pack) La Botanera Hot Sauce 33.8 fl oz", qty: 1, unit: 4.17 }
    ];
    return;
  }
  if (templateId === "petshop") {
    const today = new Date();
    state.current.currency = "GBP";
    state.current.invoiceNumber = `SO${String(Date.now()).slice(-7)}`;
    state.current.orderDate = formatDate(today);
    state.current.deliveryDate = formatDate(today);
    state.current.poNumber = "111134971";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = "Customer Name";
    state.current.billTo = "Customer Name\nBusiness or house name\nStreet address\nTown / City\nPostcode\nUnited Kingdom";
    state.current.shipTo = "Recipient Name\nDelivery address\nTown / City\nPostcode\nUnited Kingdom";
    state.current.paymentDetails = "We appreciate your prompt payment.\nPetShopBowl Limited, 09-02-22, A/C: 11029845";
    state.current.paymentMethod = "1-3 Working Days - Delivery";
    state.current.trackingId = "";
    state.current.orderId = state.current.invoiceNumber;
    state.current.cardType = "Visa";
    state.current.cardEnding = "";
    state.current.cardExpiry = "";
    state.current.taxRate = 20;
    state.current.shippingAmount = 2.49;
    state.current.testMode = false;
    state.current.items = [
      { sku: "EA", product: "Bottomless Bowl: 16 weeks | Free Item: No", description: "Pet care product description", qty: 1, unit: 30.41 }
    ];
    return;
  }
  if (templateId === "dallaswholesale") {
    state.current.currency = "$";
    state.current.invoiceNumber = "7698665";
    state.current.orderDate = "2022-11-07";
    state.current.deliveryDate = "2022-11-07";
    state.current.poNumber = "";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = "PANWORLD TRADERS LLC";
    state.current.billTo = "PANWORLD TRADERS LLC\n8403 PINES BLVD\nPEMBROKE, Florida 33024 USA";
    state.current.shipTo = state.current.billTo;
    state.current.billToFields = { name: "PANWORLD TRADERS LLC", company: "", street: "8403 PINES BLVD", city: "PEMBROKE", state: "Florida", postal: "33024", country: "USA", phone: "" };
    state.current.shipToFields = { ...state.current.billToFields };
    state.current.paymentDetails = "";
    state.current.paymentMethod = "";
    state.current.trackingId = "";
    state.current.orderId = "";
    state.current.cardType = "Visa";
    state.current.cardEnding = "";
    state.current.cardExpiry = "";
    state.current.taxRate = 0;
    state.current.shippingAmount = 0;
    state.current.dallasCompanyName = "DWG - DALLAS WHOLESALE GROUP";
    state.current.dallasCompanyAddress = "17502 Alejandro Humbolt\nOtay Mesa-MX, CA 22430 US";
    state.current.dallasPhone = "+1 4694262816";
    state.current.dallasEmail = "fba@dallaswholesalecompany.com";
    state.current.dallasWebsite = "www.dallaswholesalecompany.com";
    state.current.dallasTerms = "Due on receipt";
    state.current.dallasDueDate = "2022-11-07";
    state.current.dallasPageLabel = "Page 1 of 1";
    state.current.testMode = false;
    state.current.items = [
      { sku: "", product: "FNSKU Labeling", description: "Product label generated by customer - Put on each product shipped", qty: 15, unit: 0.25 },
      { sku: "B07FMDN42N", product: "Henckels Classic 15-pc Self-Sharpening Block Set", description: "Henckels Classic 15-pc Self-Sharpening Block Set", qty: 15, unit: 165.95 }
    ];
    return;
  }
  if (templateId === "salonsupplies") {
    state.current.currency = "GBP";
    state.current.invoiceNumber = "3126223";
    state.current.orderDate = "2026-05-23";
    state.current.deliveryDate = "2026-05-23";
    state.current.poNumber = "";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = "MUHAMMAD UMAIR ALI";
    state.current.billTo = "MUHAMMAD UMAIR ALI\nTHE ULTIMATE OUTLET LTD\n159 DAGENHAM ROAD\nDAGENHAM\nROMFORD\nRM7 0TL";
    state.current.shipTo = state.current.billTo;
    state.current.billToFields = { name: "MUHAMMAD UMAIR ALI", company: "THE ULTIMATE OUTLET LTD", street: "159 DAGENHAM ROAD", city: "DAGENHAM", state: "ROMFORD", postal: "RM7 0TL", country: "", phone: "" };
    state.current.shipToFields = { ...state.current.billToFields };
    state.current.paymentDetails = "";
    state.current.paymentMethod = "";
    state.current.trackingId = "";
    state.current.orderId = "";
    state.current.cardType = "Visa";
    state.current.cardEnding = "";
    state.current.cardExpiry = "";
    state.current.taxRate = 20;
    state.current.shippingAmount = 0;
    state.current.salonSupplierAddress = "SALON SUPPLIES\nBond Street\nSouthampton\nHampshire\nSO14 5QA\n0844 335 6121";
    state.current.salonAccountRef = "512796SO";
    state.current.salonCustomerNumber = "75922";
    state.current.salonCustomerTel = "";
    state.current.salonTotalBalance = 0;
    state.current.salonPageLabel = "1";
    state.current.salonVatNumber = "834 8405 19";
    state.current.salonCompanyNumber = "5064077";
    state.current.salonRegisteredOffice = "Bond Street, Southampton SO14 5QA";
    state.current.salonShortageNotice = "Shortages must be notified within 48 hours";
    state.current.testMode = false;
    state.current.items = [
      { sku: "18505", product: "", description: "FIBER 50g CREW", qty: 15, listPrice: 3.49, unit: 3.49 },
      { sku: "99999", product: "", description: "STANDARD DELIVERY CHARGE", qty: 1, listPrice: 5.95, unit: 5.95 }
    ];
    return;
  }
  if (templateId === "abw") {
    state.current.currency = "$";
    state.current.invoiceNumber = "20818584";
    state.current.orderDate = "2023-07-18";
    state.current.deliveryDate = "2023-07-18";
    state.current.poNumber = "";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = "S SWISS LLC";
    state.current.billTo = "S SWISS LLC\n15003 Escalante Pass Von Ormy\nSan Antonio, TX 78073";
    state.current.shipTo = "FAZEL SAFI\n15003 Escalante Pass Von Ormy\nSan Antonio, TX 78073";
    state.current.billToFields = { name: "", company: "S SWISS LLC", street: "15003 Escalante Pass Von Ormy", city: "San Antonio", state: "TX", postal: "78073", country: "", phone: "07262689094" };
    state.current.shipToFields = { name: "FAZEL SAFI", company: "", street: "15003 Escalante Pass Von Ormy", city: "San Antonio", state: "TX", postal: "78073", country: "", phone: "543559832" };
    state.current.paymentDetails = "";
    state.current.paymentMethod = "PayPal";
    state.current.trackingId = "";
    state.current.orderId = "";
    state.current.cardType = "Visa";
    state.current.cardEnding = "";
    state.current.cardExpiry = "";
    state.current.taxRate = 0;
    state.current.shippingAmount = 80.5;
    state.current.abwCustomerId = "20818584";
    state.current.abwBillingEmail = "fazelsultansafi.llc1987@gmail.com";
    state.current.abwShippingEmail = "fazelsultan.safi@gmail.com";
    state.current.abwShippingMethod = "Express";
    state.current.abwCoupon = 0;
    state.current.abwShipmentHandlingFee = 0;
    state.current.abwProductLabellingFee = 0;
    state.current.abwFreeProductHandlingFee = 0;
    state.current.abwCreditCardHandlingFee = 0;
    state.current.testMode = false;
    state.current.items = [
      {
        sku: "8809560224299 x 80",
        product: "1123312066",
        brand: "BANILA CO",
        description: "Clean It Zero Cleansing Balm Original Mini (x80) (Bulk Box)",
        qty: 1,
        unit: 415
      }
    ];
    return;
  }

  if (templateId === "ryze") {
    state.current.currency = "$";
    state.current.invoiceNumber = "RSF-526990474";
    state.current.orderDate = "2025-09-09";
    state.current.deliveryDate = "2025-09-20";
    state.current.poNumber = "";
    state.current.clientName = "Madeeha Usama";
    state.current.billTo = "Madeeha Usama\n25 Gibson Street\nSmithton, TAS 7330\nAustralia\nPhone: 61 481277127";
    state.current.shipTo = "XAIN PREP\n1805 Avada Dr\nRichardson, TX 75081-2135\nUnited States";
    state.current.billToFields = { name: "Madeeha Usama", company: "", street: "25 Gibson Street", city: "Smithton", state: "TAS", postal: "7330", country: "Australia", phone: "61 481277127" };
    state.current.shipToFields = { name: "XAIN PREP", company: "", street: "1805 Avada Dr", city: "Richardson", state: "TX", postal: "75081-2135", country: "United States", phone: "" };
    state.current.paymentMethod = "Mastercard";
    state.current.cardType = "Mastercard";
    state.current.cardEnding = "8647";
    state.current.taxRate = 6;
    state.current.shippingAmount = 30;
    state.current.ryzeSellerAddress = "RYZE SUPERFOODS\n867 Boylston St, 5th FL, #1863\nBoston MA 02199\nUnited States of America (USA)";
    state.current.ryzeSellerPhone = "+1 254 259 6728";
    state.current.ryzeShippedFrom = state.current.ryzeSellerAddress;
    state.current.ryzeReduction = 0;
    state.current.ryzeTerms = "1. Please pay within 15 days from the date of invoice, overdue interest @ 14% will be charged on delayed payments.\n2. Please quote invoice number when remitting funds.";
    state.current.ryzeReturnPolicy = "If you would like to return an item to RYZE, you must contact us within 30 days of delivery of your item to request a return shipping label.";
    state.current.ryzeContactEmail = "alex@ryzesuperfoods.com";
    state.current.ryzeSignatory = "Authorized Signatory";
    state.current.testMode = false;
    state.current.items = [{ sku: "", product: "", description: "RYZE Mushroom Coffee USDA Organic with 6 Adaptogenic Mushrooms and MCT Oil, USA Grown Instant Coffee for Better Energy, Focus, Digestion, Immunity with Lions Mane & Turkey Tail, 30 servings", qty: 100, unit: 7.5 }];
    return;
  }
  if (templateId === "bobmartin") {
    state.current.currency = "GBP";
    state.current.invoiceNumber = "539";
    state.current.orderDate = "2026-06-06";
    state.current.deliveryDate = "2026-06-06";
    state.current.poNumber = "";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = "NEST CRAFT LTD";
    state.current.billTo = "NEST CRAFT LTD\nNEST CRAFT LIMITED\n159 Dagenham Road\nRomford, RM7 0TL\nUnited Kingdom (UK)";
    state.current.shipTo = "NEST CRAFT LTD\nNEST CRAFT LIMITED\n159 Dagenham Road\nRomford, RM7 0TL\nUnited Kingdom (UK)";
    state.current.billToFields = { name: "NEST CRAFT LTD", company: "NEST CRAFT LIMITED", street: "159 Dagenham Road", city: "Romford", state: "", postal: "RM7 0TL", country: "United Kingdom (UK)", phone: "07737139244" };
    state.current.shipToFields = { name: "NEST CRAFT LTD", company: "NEST CRAFT LIMITED", street: "159 Dagenham Road", city: "Romford", state: "", postal: "RM7 0TL", country: "United Kingdom (UK)", phone: "" };
    state.current.paymentDetails = "";
    state.current.paymentMethod = "Visa";
    state.current.trackingId = "";
    state.current.orderId = "BM50170";
    state.current.cardType = "Visa";
    state.current.cardEnding = "0111";
    state.current.cardExpiry = "";
    state.current.taxRate = 20;
    state.current.shippingAmount = 2.49;
    state.current.bobMartinShippingMethod = "1-3 Working Days";
    state.current.bobMartinBillingEmail = "azaankhan78657@gmail.com";
    state.current.bobMartinDiscount = 0;
    state.current.bobMartinDiscountTax = 0;
    state.current.bobMartinShippingTax = 0.5;
    state.current.bobMartinFee = 0;
    state.current.testMode = false;
    state.current.items = [
      { sku: "K0401S", product: "", description: "Bob Martin Clear Spot-On for Cats - 1 Dose", qty: 1, unit: 5.17 }
    ];
    return;
  }
  if (templateId === "porton") {
    state.current.currency = "GBP";
    state.current.invoiceNumber = "1149702";
    state.current.orderDate = "2026-07-12";
    state.current.deliveryDate = "2026-07-12";
    state.current.poNumber = "";
    state.current.paymentDetails = "";
    state.current.paymentMethod = "Visa debit card";
    state.current.trackingId = "";
    state.current.orderId = "";
    state.current.cardType = "Visa";
    state.current.cardEnding = "";
    state.current.cardExpiry = "";
    state.current.taxRate = 20;
    state.current.shippingAmount = 7.99;
    state.current.portonSellerName = "Porton Garden Aquatic & Pets";
    state.current.portonVatNumber = "750456633";
    state.current.testMode = false;
    state.current.items = [
      { sku: "", product: "", description: "Marina 7.5cm Nylon Net 20cm Vinyl Coated Handle", qty: 1, unit: 1.99 }
    ];
    return;
  }
  if (templateId === "perfumeunlimited") {
    state.current.currency = "$";
    state.current.invoiceNumber = "483218";
    state.current.orderDate = "2025-12-10";
    state.current.deliveryDate = "2025-12-10";
    state.current.poNumber = "";
    state.current.paymentDetails = "Paid by card";
    state.current.paymentMethod = "Mastercard";
    state.current.trackingId = "";
    state.current.orderId = "";
    state.current.cardType = "Mastercard";
    state.current.cardEnding = "0740";
    state.current.cardExpiry = "";
    state.current.taxRate = 5;
    state.current.shippingAmount = 0;
    state.current.perfumeTitle = "TAX INVOICE";
    state.current.perfumeCompanyName = "PERFUME UNLIMITED";
    state.current.perfumeAddress = "Shop No 3, Al-Daghaya (Al Sabkha)\nDeira,Dubai,UAE";
    state.current.perfumeTrn = "100430681500008";
    state.current.perfumeEmail = "wholesale@perfumeunlimited.com";
    state.current.perfumeThankYou = "Thank you for your business!";
    state.current.perfumeFooterNote = "This is an electronically generated document no signature required.";
    state.current.perfumePageLabel = "Page 1 of 1";
    state.current.testMode = false;
    state.current.items = [
      { sku: "", product: "", description: "Giorgio Armani Stronger with You Absolutely Eau de Perfume 100ml", qty: 60, unit: 14.5 },
      { sku: "", product: "", description: "Giorgio Armani Stronger with You Sandalwood Eau de Perfume 100ml", qty: 30, unit: 30.5 }
    ];
    return;
  }
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
    const selectedClient = state.clients.find((client) => client.id === state.current.clientId);
    due.setDate(today.getDate() + 2);
    state.current.currency = "£";
    state.current.invoiceNumber = `GS-${today.getFullYear()}-${String(Date.now()).slice(-6)}`;
    state.current.orderDate = formatDate(today);
    state.current.deliveryDate = formatDate(due);
    state.current.poNumber = "PO-1001";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = state.current.clientName || "";
    state.current.billTo = state.current.billTo || "";
    state.current.shipTo = state.current.shipTo || "";
    state.current.paymentDetails = state.current.paymentDetails || "";
    state.current.paymentMethod = formatClientCardPayment(selectedClient?.cardType, selectedClient?.cardEnding);
    state.current.trackingId = "";
    state.current.orderId = "";
    state.current.cardType = selectedClient?.cardType || "";
    state.current.cardEnding = String(selectedClient?.cardEnding || "").replace(/\D/g, "").slice(-4);
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
    state.current.qogitaFooterText = typeof state.current.qogitaFooterText === "string"
      ? state.current.qogitaFooterText
      : "© 2025 Qogita. All rights reserved.";
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
  if (templateId === "bruide") {
    state.current.currency = "$";
    state.current.invoiceNumber = "309593610";
    state.current.orderDate = "2025-10-09";
    state.current.deliveryDate = "2025-10-09";
    state.current.poNumber = "";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = "Zeeshan Ali Shabbir Akhtar";
    state.current.billToFields = {
      name: "Zeeshan Ali Shabbir Akhtar",
      company: "",
      street: "6 Sharja Muhaila",
      city: "Sharja",
      state: "",
      postal: "25314",
      country: "United Arab Emirates",
      phone: "+971559678114"
    };
    state.current.shipToFields = {
      name: "David E. Owen",
      company: "",
      street: "1050 Adam St",
      city: "Sheridan",
      state: "WY",
      postal: "82801-2912",
      country: "U.S.A.",
      phone: ""
    };
    state.current.billTo = formatStructuredAddress(state.current.billToFields);
    state.current.shipTo = formatStructuredAddress(state.current.shipToFields);
    state.current.paymentDetails = "";
    state.current.paymentMethod = "VISA****6941";
    state.current.trackingId = "FedEx Express";
    state.current.orderId = "95876325";
    state.current.cardType = "Visa";
    state.current.cardEnding = "6941";
    state.current.cardExpiry = "";
    state.current.taxRate = 0;
    state.current.shippingAmount = 150.2;
    state.current.testMode = false;
    state.current.items = [
      { sku: "H7K2L9Q", product: "Burgundy Red Touch Up Paint for Cars", description: "", qty: 30, unit: 6.2 },
      { sku: "T4M8Z1B", product: "9pcs Pin Punches Set 1/16 - 5/16", description: "", qty: 24, unit: 5.36 },
      { sku: "V6P3R2X", product: "RC Car Body Clips (R Pins) Bent Spring Steel - 100 pcs", description: "", qty: 20, unit: 4.6 },
      { sku: "D9F5W7N", product: "ATV Fuel Pump for Polaris Sportsman & Magnum Models (325-700)", description: "", qty: 30, unit: 12.5 },
      { sku: "K3X8H4S", product: "Drive Belt for Can-Am Maverick X3 OEM 422280652 10mm", description: "", qty: 20, unit: 19.3 },
      { sku: "J5C9L2T", product: "Engine Oil Pressure Switch for Mopar Vehicles (5149062AA)", description: "", qty: 24, unit: 12.5 },
      { sku: "W2N6B8A", product: "4 Inch L Shape Wall Shelf Support Brackets White (2 Pack)", description: "", qty: 30, unit: 3.3 },
      { sku: "P7Q4E1M", product: "Thumb Throttle Accelerator for Ninebot Max G30 Scooter", description: "", qty: 25, unit: 3.62 },
      { sku: "R8T3K6D", product: "Food Grade Silicone Tube 1/4 ID x 3/8 OD (10FT)", description: "", qty: 30, unit: 4.4 },
      { sku: "Y1F9C5L", product: "AC Push Button Switch 600V 10A with Indicator Light APBB-22/25N (2pcs)", description: "", qty: 32, unit: 3 },
      { sku: "S4D7P2V", product: "12 Pin Waterproof Automotive Electrical Connector with Wire Pigtail", description: "", qty: 28, unit: 5.82 },
      { sku: "Z6H1X8G", product: '3/8" Quick Connect Water Flow Sensor Hall Effect Flowmeter', description: "", qty: 34, unit: 3.78 }
    ];
    return;
  }
  if (templateId === "abena") {
    state.current.currency = "GBP";
    state.current.invoiceNumber = "901596073";
    state.current.orderDate = "2026-06-26";
    state.current.deliveryDate = "2026-06-26";
    state.current.poNumber = "#54022";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = "Muhammad Umair Ali";
    state.current.billTo = "Abena Online Shopify\nAbena Online Shopify\nCoventry\nCV5 6US";
    state.current.shipTo = "Muhammad Umair Ali\nDagenham\n159 Dagenham Road\nRomford\nRM7 0TL";
    state.current.paymentDetails = "Prepayment";
    state.current.paymentMethod = "";
    state.current.trackingId = "";
    state.current.orderId = "";
    state.current.abenaInvoiceAccount = "117001";
    state.current.abenaOrderAccount = "117001";
    state.current.abenaReference = "gid://shopify/Order/13399902028";
    state.current.abenaDueDate = "2026-06-26";
    state.current.abenaSalesOrder = "1353228";
    state.current.abenaOurReference = "MULESOFT_ERP";
    state.current.abenaTermsOfDelivery = "EXW Coventry";
    state.current.abenaDeliveryNumber = "81713962";
    state.current.abenaPageLabel = "1 of 1";
    state.current.abenaNetWeight = "152.00 G";
    state.current.abenaGrossWeight = "155.00 G";
    state.current.abenaVolume = "0.00 M3";
    state.current.abenaPackingDetails = "40 Pack/1 Carton, 24 Carton/1 Pallet";
    state.current.cardType = "Visa";
    state.current.cardEnding = "";
    state.current.cardExpiry = "";
    state.current.taxRate = 20;
    state.current.shippingAmount = 4;
    state.current.testMode = false;
    state.current.items = [
      { sku: "621006", product: "PAC", description: "Facial tissues pure pulp 20x19.5cm", qty: 1, unit: 0.91, vatCode: "1" }
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
  if (templateId === "autodoc") {
    state.current.currency = "GBP";
    state.current.invoiceNumber = "183625";
    state.current.orderDate = "2025-12-15";
    state.current.deliveryDate = "2025-12-15";
    state.current.poNumber = "";
    state.current.caseNumber = state.current.caseNumber || "";
    state.current.clientName = "Muhammad Usman Qaisar";
    state.current.billTo = "Muhammad Usman Qaisar\n110 Blackborne Road Dagenham\nEssex RM10 8SL\nUnited Kingdom";
    state.current.shipTo = state.current.billTo;
    state.current.paymentDetails = "";
    state.current.paymentMethod = "Visa";
    state.current.trackingId = "";
    state.current.orderId = "";
    state.current.cardType = "Visa";
    state.current.cardEnding = "7743";
    state.current.cardExpiry = "";
    state.current.taxRate = 20;
    state.current.shippingAmount = 0;
    state.current.autodocCompanyName = "Autodoc Operations UK Limited";
    state.current.autodocPhone = "+44 203 885 3401";
    state.current.autodocAddress = "Suite 1, 7th Floor, 50 Broadway\nLondon, SW1H 0DB\nUnited Kingdom";
    state.current.autodocOrderReference = "126391";
    state.current.autodocBankInformation = "Visa card ending in 7743";
    state.current.autodocTerms = "The seller acknowledges and permits the buyer to resell the purchased goods in any manner deemed suitable by the buyer.";
    state.current.autodocPageLabel = "01";
    state.current.testMode = false;
    state.current.items = [
      { sku: "", product: "", description: "Diesel Air Heater Power Adapter 110V-240V AC 12V Converter Supply For 5/8KW", qty: 15, unit: 10.21 },
      { sku: "", product: "", description: "BM550 Car Battery Tester 6V 12V 24V 100-2000 CCA 2Ah-220Ah Detect AnalyzerTool", qty: 10, unit: 6.09 },
      { sku: "", product: "", description: "7000A Car Jump Starter With Air Compressors Battery Booster 99800mah Power Bank", qty: 10, unit: 32.27 },
      { sku: "", product: "", description: "WOLFBOX Car Jump Starter 3000A Booster Jumper Power Bank Battery Charge Portable", qty: 5, unit: 28.89 }
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
  const isTwWholesale = state.current.templateId === "tw";
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
  const isAbena = state.current.templateId === "abena";
  const isBulkBuyAmerica = state.current.templateId === "bulkbuyamerica";
  const isSephoraUsa = state.current.templateId === "sephorausa";
  const isPerfumeUnlimited = state.current.templateId === "perfumeunlimited";
  const isPorton = state.current.templateId === "porton";
  const isSalonSupplies = state.current.templateId === "salonsupplies";
  const isAbw = state.current.templateId === "abw";
  const isDallasWholesale = state.current.templateId === "dallaswholesale";
  const isPetshop = state.current.templateId === "petshop";
  const isAutodoc = state.current.templateId === "autodoc";
  const isWalmart = state.current.templateId === "walmart";
  els.itemsTableWrap.classList.toggle("is-pcsbooks-item-editor", isPcsBooks);
  els.itemsTableWrap.classList.toggle("is-costco-item-editor", isCostcoUk);
  els.itemsTable.classList.toggle("is-tw-wholesale-items", isTwWholesale);
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
  els.itemsTable.classList.toggle("is-abena-items", isAbena);
  els.itemsTable.classList.toggle("is-bulk-buy-america-items", isBulkBuyAmerica);
  els.itemsTable.classList.toggle("is-sephora-usa-items", isSephoraUsa);
  els.itemsTable.classList.toggle("is-perfume-unlimited-items", isPerfumeUnlimited);
  els.itemsTable.classList.toggle("is-porton-items", isPorton);
  els.itemsTable.classList.toggle("is-salon-supplies-items", isSalonSupplies);
  els.itemsTable.classList.toggle("is-abw-items", isAbw);
  els.itemsTable.classList.toggle("is-dallas-wholesale-items", isDallasWholesale);
  els.itemsTable.classList.toggle("is-petshop-items", isPetshop);
  els.itemsTable.classList.toggle("is-autodoc-items", isAutodoc);
  els.itemsTable.classList.toggle("is-walmart-items", isWalmart);
  els.itemsHeader.innerHTML = isWalmart
    ? "<tr><th>Description</th><th>Qty</th><th>Unit Price</th></tr>"
    : isTwWholesale
    ? "<tr><th>Item Description</th><th>QTY</th><th>Rate</th><th></th></tr>"
    : isAutodoc
      ? "<tr><th>#</th><th>Item Description</th><th>Qty</th><th>Price</th><th>VAT</th><th>Amount</th></tr>"
    : isPetshop
    ? "<tr><th>Description</th><th>Units</th><th>Quantity</th><th>Rate</th><th>Options</th><th>Amount</th></tr>"
    : isPcsBooks
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
      : isAbena
        ? "<tr><th>Material No.</th><th>Quantity</th><th>Unit</th><th>Material description</th><th>Unit price</th><th>VAT code</th><th>Net amount</th></tr>"
      : isBulkBuyAmerica
        ? "<tr><th>SKU</th><th>Name</th><th>Qty</th><th>Price</th><th>Tax</th><th>Total (USD)</th></tr>"
      : isSephoraUsa
        ? "<tr><th>Campaign</th><th>Product No.</th><th>Description</th><th>Qty</th><th>Unit Price</th><th>Total Price</th></tr>"
      : isPerfumeUnlimited
        ? "<tr><th>Product Details</th><th>Unit Price</th><th>QTY</th><th>Sub Total</th></tr>"
      : isPorton
        ? "<tr><th>Product</th><th>Quantity</th><th>Unit Price</th><th>Total</th></tr>"
      : isSalonSupplies
        ? "<tr><th>Qty</th><th>Description</th><th>Code</th><th>List Price</th><th>Price</th><th>Net</th></tr>"
      : isAbw
        ? "<tr><th>UPC/EAN</th><th>Qty</th><th>Catalog#</th><th>Brand</th><th>Product Description</th><th>Unit Price in USD</th><th>Subtotal</th></tr>"
      : isDallasWholesale
        ? "<tr><th>Product</th><th>Qty</th><th>SKU/ASIN</th><th>Description</th><th>Price</th><th>Amount</th></tr>"
        : "<tr><th>SKU</th><th>Product</th><th>Description</th><th>Qty</th><th>Unit</th><th>Total</th><th></th></tr>";

  state.current.items.forEach((item, index) => {
    if (isWalmart) {
      const row = document.createElement("tr");
      row.className = "walmart-item-editor-row";
      row.dataset.index = index;
      row.innerHTML = `
        <td><input data-field="description" type="text" value="${escapeHtml(item.description || "")}" /></td>
        <td><input data-field="qty" min="0" step="1" type="number" value="${Number(item.qty || 0)}" /></td>
        <td class="walmart-total-editor"><input data-field="unit" min="0" step="0.01" type="number" value="${Number(item.unit || 0)}" /><button class="mini-danger" data-remove-row type="button" aria-label="Remove item">x</button></td>`;
      els.itemsBody.appendChild(row);
      return;
    }
    if (isAutodoc) {
      const lineVat = rowTotal(item) * (Number(state.current.taxRate || 0) / 100);
      const row = document.createElement("tr");
      row.className = "autodoc-item-editor-row";
      row.dataset.index = index;
      row.innerHTML = `
        <td>${index + 1}</td>
        <td><input data-field="description" type="text" value="${escapeHtml(item.description || item.product || "")}" /></td>
        <td><input data-field="qty" min="0" step="1" type="number" value="${Number(item.qty || 0)}" /></td>
        <td><input data-field="unit" min="0" step="0.01" type="number" value="${Number(item.unit || 0)}" /></td>
        <td><span class="row-total">${money(lineVat, state.current.currency)}</span></td>
        <td class="autodoc-total-editor"><span class="row-total">${money(rowTotal(item), state.current.currency)}</span><button class="mini-danger" data-remove-row type="button" aria-label="Remove item">x</button></td>`;
      els.itemsBody.appendChild(row);
      return;
    }
    if (isTwWholesale) {
      const row = document.createElement("tr");
      row.className = "tw-wholesale-item-editor-row";
      row.dataset.index = index;
      row.innerHTML = `
        <td><input data-field="description" type="text" value="${escapeHtml(itemLine(item))}" /></td>
        <td><input data-field="qty" min="0" step="1" type="number" value="${Number(item.qty || 0)}" /></td>
        <td><input data-field="unit" min="0" step="0.01" type="number" value="${Number(item.unit || 0)}" /></td>
        <td><button class="mini-danger" data-remove-row type="button" aria-label="Remove item">x</button></td>`;
      els.itemsBody.appendChild(row);
      return;
    }
    if (isPetshop) {
      const row = document.createElement("tr");
      row.className = "petshop-item-editor-row";
      row.dataset.index = index;
      row.innerHTML = `
        <td><input data-field="description" type="text" value="${escapeHtml(item.description || "")}" /></td>
        <td><input data-field="sku" type="text" value="${escapeHtml(item.sku || "EA")}" /></td>
        <td><input data-field="qty" min="0" step="1" type="number" value="${Number(item.qty || 0)}" /></td>
        <td><input data-field="unit" min="0" step="0.01" type="number" value="${Number(item.unit || 0)}" /></td>
        <td><input data-field="product" type="text" value="${escapeHtml(item.product || "")}" /></td>
        <td class="petshop-total-editor"><span class="row-total">${money(rowTotal(item), state.current.currency)}</span><button class="mini-danger" data-remove-row type="button" aria-label="Remove item">x</button></td>`;
      els.itemsBody.appendChild(row);
      return;
    }
    if (isDallasWholesale) {
      const row = document.createElement("tr");
      row.className = "dallas-wholesale-item-editor-row";
      row.dataset.index = index;
      row.innerHTML = `
        <td><input data-field="product" type="text" value="${escapeHtml(item.product || "")}" /></td>
        <td><input data-field="qty" min="0" step="1" type="number" value="${Number(item.qty || 0)}" /></td>
        <td><input data-field="sku" type="text" value="${escapeHtml(item.sku || "")}" /></td>
        <td><input data-field="description" type="text" value="${escapeHtml(item.description || "")}" /></td>
        <td><input data-field="unit" min="0" step="0.01" type="number" value="${Number(item.unit || 0)}" /></td>
        <td class="dallas-wholesale-total-editor"><span class="row-total">${money(rowTotal(item), state.current.currency)}</span><button class="mini-danger" data-remove-row type="button" aria-label="Remove item">x</button></td>`;
      els.itemsBody.appendChild(row);
      return;
    }
    if (isSalonSupplies) {
      const row = document.createElement("tr");
      row.className = "salon-supplies-item-editor-row";
      row.dataset.index = index;
      row.innerHTML = `
        <td><input data-field="qty" min="0" step="1" type="number" value="${Number(item.qty || 0)}" /></td>
        <td><input data-field="description" type="text" value="${escapeHtml(itemLine(item))}" /></td>
        <td><input data-field="sku" type="text" value="${escapeHtml(item.sku || "")}" /></td>
        <td><input data-field="listPrice" min="0" step="0.01" type="number" value="${Number(item.listPrice ?? item.unit ?? 0)}" /></td>
        <td><input data-field="unit" min="0" step="0.01" type="number" value="${Number(item.unit || 0)}" /></td>
        <td class="salon-supplies-total-editor"><span class="row-total">${money(rowTotal(item), state.current.currency)}</span><button class="mini-danger" data-remove-row type="button" aria-label="Remove item">x</button></td>`;
      els.itemsBody.appendChild(row);
      return;
    }
    if (isAbena) {
      const row = document.createElement("tr");
      row.className = "abena-item-editor-row";
      row.dataset.index = index;
      row.innerHTML = `
        <td><input data-field="sku" type="text" value="${escapeHtml(item.sku || "")}" /></td>
        <td><input data-field="qty" min="0" step="1" type="number" value="${Number(item.qty || 0)}" /></td>
        <td><input data-field="product" type="text" value="${escapeHtml(item.product || "PAC")}" /></td>
        <td><input data-field="description" type="text" value="${escapeHtml(item.description || "")}" /></td>
        <td><input data-field="unit" min="0" step="0.01" type="number" value="${Number(item.unit || 0)}" /></td>
        <td><input data-field="vatCode" type="text" value="${escapeHtml(item.vatCode || "1")}" /></td>
        <td class="abena-total-editor"><span class="row-total">${money(rowTotal(item), state.current.currency)}</span><button class="mini-danger" data-remove-row type="button" aria-label="Remove item">x</button></td>`;
      els.itemsBody.appendChild(row);
      return;
    }
    if (isAbw) {
      const row = document.createElement("tr");
      row.className = "abw-item-editor-row";
      row.dataset.index = index;
      row.innerHTML = `
        <td><input data-field="sku" type="text" value="${escapeHtml(item.sku || "")}" /></td>
        <td><input data-field="qty" min="0" step="1" type="number" value="${Number(item.qty || 0)}" /></td>
        <td><input data-field="product" type="text" value="${escapeHtml(item.product || "")}" /></td>
        <td><input data-field="brand" type="text" value="${escapeHtml(item.brand || "")}" /></td>
        <td><input data-field="description" type="text" value="${escapeHtml(item.description || "")}" /></td>
        <td><input data-field="unit" min="0" step="0.01" type="number" value="${Number(item.unit || 0)}" /></td>
        <td class="abw-total-editor"><span class="row-total">${abwAmount(rowTotal(item))}</span><button class="mini-danger" data-remove-row type="button" aria-label="Remove item">x</button></td>`;
      els.itemsBody.appendChild(row);
      return;
    }
    if (isPorton) {
      const row = document.createElement("tr");
      row.className = "porton-item-editor-row";
      row.dataset.index = index;
      row.innerHTML = `
        <td><input data-field="description" type="text" value="${escapeHtml(itemLine(item))}" /></td>
        <td><input data-field="qty" min="0" step="1" type="number" value="${Number(item.qty || 0)}" /></td>
        <td><input data-field="unit" min="0" step="0.01" type="number" value="${Number(item.unit || 0)}" /></td>
        <td class="porton-total-editor"><span class="row-total">${money(rowTotal(item), state.current.currency)}</span><button class="mini-danger" data-remove-row type="button" aria-label="Remove item">x</button></td>`;
      els.itemsBody.appendChild(row);
      return;
    }
    if (isPerfumeUnlimited) {
      const row = document.createElement("tr");
      row.className = "perfume-unlimited-item-editor-row";
      row.dataset.index = index;
      row.innerHTML = `
        <td><input data-field="description" type="text" value="${escapeHtml(itemLine(item))}" /></td>
        <td><input data-field="unit" min="0" step="0.01" type="number" value="${Number(item.unit || 0)}" /></td>
        <td><input data-field="qty" min="0" step="1" type="number" value="${Number(item.qty || 0)}" /></td>
        <td class="perfume-unlimited-total-editor"><span class="row-total">${money(rowTotal(item), state.current.currency)}</span><button class="mini-danger" data-remove-row type="button" aria-label="Remove item">x</button></td>`;
      els.itemsBody.appendChild(row);
      return;
    }
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
  const isAbena = template.id === "abena";
  const isBruide = template.id === "bruide";
  const isBulkBuyAmerica = template.id === "bulkbuyamerica";
  const isSephoraUsa = template.id === "sephorausa";
  const isLuxurySouq = template.id === "luxurysouq";
  const isPerfumeUnlimited = template.id === "perfumeunlimited";
  const isPorton = template.id === "porton";
  const isTw = template.id === "tw";
  const isBobMartin = template.id === "bobmartin";
  const isSalonSupplies = template.id === "salonsupplies";
  const isAbw = template.id === "abw";
  const isRyze = template.id === "ryze";
  const isDallasWholesale = template.id === "dallaswholesale";
  const isPetshop = template.id === "petshop";
  const isAutodoc = template.id === "autodoc";
  const isWalmart = template.id === "walmart";
  const testMode = invoice.testMode === true;
  els.invoicePreview.style.setProperty("--preview-color", template.color);

  if (isWalmart) {
    els.invoicePreview.innerHTML = renderWalmartPreview(invoice, totals);
    return;
  }

  if (isDallasWholesale) {
    els.invoicePreview.innerHTML = renderDallasWholesalePreview(invoice, totals);
    return;
  }

  if (isAutodoc) {
    els.invoicePreview.innerHTML = renderAutodocPreview(invoice, totals);
    return;
  }

  if (isPetshop) {
    els.invoicePreview.innerHTML = renderPetshopPreview(invoice, totals);
    return;
  }

  if (isSalonSupplies) {
    els.invoicePreview.innerHTML = renderSalonSuppliesPreview(invoice, totals);
    return;
  }

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

  if (isAbena) {
    els.invoicePreview.innerHTML = renderAbenaPreview(invoice, totals);
    return;
  }

  if (isBruide) {
    els.invoicePreview.innerHTML = renderBruidePreview(invoice, totals);
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

  if (isBobMartin) {
    els.invoicePreview.innerHTML = renderBobMartinPreview(invoice);
    return;
  }

  if (isAbw) {
    els.invoicePreview.innerHTML = renderAbwPreview(invoice);
    return;
  }

  if (isRyze) {
    els.invoicePreview.innerHTML = renderRyzePreview(invoice, totals);
    return;
  }

  if (isPound) {
    els.invoicePreview.innerHTML = renderPoundPreview(invoice, totals, testMode);
    return;
  }

  if (isPerfumeUnlimited) {
    els.invoicePreview.innerHTML = renderPerfumeUnlimitedPreview(invoice, totals);
    return;
  }

  if (isPorton) {
    els.invoicePreview.innerHTML = renderPortonPreview(invoice, totals);
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

function formatWalmartBuyer(invoice) {
  const savedFields = invoice.billToFields || {};
  const fields = Object.values(savedFields).some(Boolean)
    ? savedFields
    : parseInvoiceAddress(invoice.billTo || clientAddress(invoice));
  const buyerName = String(fields.company || fields.name || invoice.clientName || "").trim();
  const locality = [
    String(fields.city || "").trim(),
    [String(fields.state || "").trim(), String(fields.postal || "").trim()].filter(Boolean).join(" ")
  ].filter(Boolean).join(", ");
  const addressLine = [String(fields.street || "").trim(), locality].filter(Boolean).join(", ");

  if (buyerName || addressLine) {
    return { buyerName, addressLine };
  }

  const fallbackLines = String(invoice.billTo || clientAddress(invoice) || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !/^(phone|tel|telephone)\s*:/i.test(line));
  return {
    buyerName: fallbackLines.shift() || "",
    addressLine: fallbackLines.slice(0, 2).join(", ")
  };
}

function renderWalmartPreview(invoice, totals) {
  const orderNumber = invoice.invoiceNumber || invoice.orderId || "";
  const printDateTime = invoice.walmartPrintDateTime || `${formatWalmartPrintDate(invoice.deliveryDate || invoice.orderDate)}, 5:33 AM`;
  const deliveryListPrice = Math.max(0, Number(invoice.walmartDeliveryListPrice || 0));
  const driverTip = Math.max(0, Number(invoice.walmartDriverTip || 0));
  const productRows = invoice.items.map((item) => `
    <tr>
      <td>${escapeHtml(item.description || item.product || "")}</td>
      <td>Qty ${Number(item.qty || 0)}</td>
      <td>${money(Number(item.unit || 0), "$")}</td>
    </tr>
  `).join("");

  const walmartBuyer = formatWalmartBuyer(invoice);

  return `
    <div class="invoice-doc walmart-invoice">
      <div class="walmart-print-header"><span>${escapeHtml(printDateTime)}</span><span>Order details - Walmart.com</span></div>
      <div class="walmart-sheet-border" aria-hidden="true"></div>
      <header class="walmart-header">
        <img class="walmart-wordmark" src="${assetPath("/assets/walmart-logo.png")}" alt="Walmart" />
        <strong class="walmart-document-title">Invoice</strong>
      </header>

      <section class="walmart-order-details">
        <h2>${formatWalmartDate(invoice.orderDate)} order</h2>
        <h3>Order# ${escapeHtml(orderNumber)}</h3>
        <div class="walmart-buyer">
          <strong>Buyer</strong>
          <p><span class="walmart-buyer-name">${escapeHtml(walmartBuyer.buyerName)}</span><span class="walmart-buyer-address">${escapeHtml(walmartBuyer.addressLine)}</span></p>
        </div>
      </section>

      <section class="walmart-purchase-card">
        <table class="walmart-items"><tbody>${productRows}</tbody></table>
        <div class="walmart-summary walmart-subtotal"><span>Subtotal</span><strong>${money(totals.subtotal, "$")}</strong></div>
        <div class="walmart-summary walmart-delivery">
          <span><img class="walmart-delivery-mark" src="${assetPath("/assets/walmart-delivery-mark.png")}" alt="" />${escapeHtml(invoice.walmartDeliveryLabel || "Free delivery from store")}</span>
          <strong>${deliveryListPrice > 0 ? `<del>${money(deliveryListPrice, "$")}</del>` : ""} ${money(totals.shipping, "$")}</strong>
        </div>
        <div class="walmart-summary walmart-tax"><span>Tax</span><strong>${money(totals.tax, "$")}</strong></div>
        <div class="walmart-summary walmart-tip"><span>Driver tip</span><strong>${money(driverTip, "$")}</strong></div>
        <div class="walmart-summary walmart-total"><span>Total</span><strong>${money(totals.total, "$")}</strong></div>
      </section>

      <section class="walmart-barcode-block">
        <span>Order# ${escapeHtml(orderNumber)}</span>
        <img class="walmart-barcode" src="${assetPath("/assets/walmart-order-barcode.png")}" alt="" />
      </section>
      <footer class="walmart-print-footer"><span>https://www.walmart.com/orders/${escapeHtml(String(orderNumber).replace(/\D/g, ""))}?groupId=1fe5aa3b2b7829461e6c5da79b25db1f</span><span>1/1</span></footer>
    </div>
  `;
}

function renderDallasWholesalePreview(invoice, totals) {
  const companyAddress = String(invoice.dallasCompanyAddress || "").split(/\r?\n/).filter(Boolean);
  const billTo = String(invoice.billTo || invoice.clientName || "").split(/\r?\n/).filter(Boolean);
  const rows = (invoice.items || []).map((item) => `
    <tr>
      <td>${escapeHtml(item.product || item.description || "")}</td>
      <td>${Number(item.qty || 0)}</td>
      <td>${escapeHtml(item.sku || "")}</td>
      <td>${escapeHtml(item.description || item.product || "")}</td>
      <td>${Number(item.unit || 0).toFixed(2)}</td>
      <td>${rowTotal(item).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
    </tr>`).join("");

  return `
    <div class="invoice-doc dallas-wholesale-invoice">
      <header class="dallas-wholesale-header">
        <section>
          <h1>${escapeHtml(invoice.dallasCompanyName || "DWG - DALLAS WHOLESALE GROUP")}</h1>
          <p>${companyAddress.map((line) => escapeHtml(line)).join("<br>")}</p>
          <p>${escapeHtml(invoice.dallasPhone || "")}<br>${escapeHtml(invoice.dallasEmail || "")}<br>${escapeHtml(invoice.dallasWebsite || "")}</p>
        </section>
        <img src="${assetPath("/assets/dallas-wholesale-logo.png")}" alt="Dallas Wholesale Group" />
      </header>

      <h2>INVOICE</h2>
      <section class="dallas-wholesale-details">
        <div class="dallas-bill-to"><span>BILL TO</span><p>${billTo.map((line) => escapeHtml(line)).join("<br>")}</p></div>
        <dl>
          <div><dt>INVOICE</dt><dd>${escapeHtml(invoice.invoiceNumber || "")}</dd></div>
          <div><dt>DATE</dt><dd>${formatDallasDate(invoice.orderDate)}</dd></div>
          <div><dt>TERMS</dt><dd>${escapeHtml(invoice.dallasTerms || "")}</dd></div>
          <div><dt>DUE DATE</dt><dd>${formatDallasDate(invoice.dallasDueDate || invoice.orderDate)}</dd></div>
        </dl>
      </section>

      <table class="dallas-wholesale-products">
        <thead><tr><th>PRODUCT</th><th>QTY</th><th>SKU/ASIN</th><th>DESCRIPTION</th><th>PRICE</th><th>AMOUNT</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="6">No products added</td></tr>`}</tbody>
      </table>

      <section class="dallas-balance"><span>BALANCE DUE</span><strong>$${totals.total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></section>
      <footer>${escapeHtml(invoice.dallasPageLabel || "Page 1 of 1")}</footer>
    </div>`;
}

function formatDallasDate(value) {
  const [year, month, day] = String(value || "").split("-");
  return year && month && day ? `${month}/${day}/${year}` : escapeHtml(value || "");
}

function renderSalonSuppliesPreview(invoice, totals) {
  const supplierLines = String(invoice.salonSupplierAddress || "").split(/\r?\n/).filter(Boolean);
  const quantityTotal = (invoice.items || []).reduce((sum, item) => sum + Number(item.qty || 0), 0);
  const vatRate = Math.max(0, Number(invoice.taxRate || 0));
  const moneyPlain = (value) => Number(value || 0).toFixed(2);
  const addressHtml = escapeHtml(invoice.billTo || invoice.clientName || "").replace(/\n/g, "<br>");
  const itemRows = (invoice.items || []).map((item) => `
    <tr>
      <td>${Number(item.qty || 0)}</td>
      <td>${escapeHtml(itemLine(item))}</td>
      <td>${escapeHtml(item.sku || "")}</td>
      <td>${moneyPlain(item.listPrice ?? item.unit)}</td>
      <td>${moneyPlain(item.unit)}</td>
      <td>${moneyPlain(rowTotal(item))}</td>
    </tr>`).join("");

  return `
    <div class="invoice-doc salon-supplies-invoice">
      <header class="salon-supplies-header">
        <img class="salon-supplies-logo" src="${assetPath("/assets/salon-supplies-logo.png")}" alt="Salon Supplies" />
        <div class="salon-supplies-seller">${supplierLines.map((line) => escapeHtml(line)).join("<br>")}</div>
        <h1>INVOICE <strong>${escapeHtml(invoice.invoiceNumber || "")}</strong></h1>
      </header>
      <section class="salon-supplies-customer">
        <p>${addressHtml}</p>
        <strong>#${escapeHtml(invoice.salonCustomerNumber || "")}</strong>
      </section>
      <section class="salon-supplies-meta">
        <div><strong>Account Ref:</strong><span>${escapeHtml(invoice.salonAccountRef || "")}</span></div>
        <div><strong>Customer Tel:</strong><span>${escapeHtml(invoice.salonCustomerTel || "")}</span></div>
        <div class="salon-balance"><strong>Total Balance:</strong><span>£${moneyPlain(invoice.salonTotalBalance)}</span></div>
        <div><strong>Date:</strong><span>${formatSalonSuppliesDate(invoice.orderDate)}</span></div>
        <div><strong>Page:</strong><span>${escapeHtml(invoice.salonPageLabel || "1")}</span></div>
      </section>
      <table class="salon-supplies-products">
        <thead><tr><th>Qty</th><th>Description</th><th>Code</th><th>List Price</th><th>Price £</th><th>Net £</th></tr></thead>
        <tbody>${itemRows || `<tr><td colspan="6">No products added</td></tr>`}<tr class="salon-supplies-fill"><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody>
      </table>
      <section class="salon-supplies-summary">
        <div class="salon-supplies-vat-block">
          <strong>${quantityTotal} Total Del Qty</strong>
          <p>VAT Registration No. <span>${escapeHtml(invoice.salonVatNumber || "")}</span></p>
          <div class="salon-vat-title"><i></i><span>£ VAT Analysis</span><i></i></div>
          <table><thead><tr><th>Code</th><th>Rate</th><th>Supplies</th><th>VAT</th></tr></thead>
            <tbody><tr><td>1</td><td>${vatRate.toFixed(2)}</td><td>${moneyPlain(totals.subtotal)}</td><td>${moneyPlain(totals.tax)}</td></tr></tbody>
          </table>
        </div>
        <dl class="salon-supplies-totals">
          <div><dt>Net £</dt><dd>${moneyPlain(totals.subtotal)}</dd></div>
          <div><dt>VAT £</dt><dd>${moneyPlain(totals.tax)}</dd></div>
          <div><dt>Total £</dt><dd>${moneyPlain(totals.total)}</dd></div>
        </dl>
      </section>
      <footer class="salon-supplies-footer">
        <strong>${escapeHtml(invoice.salonShortageNotice || "")}</strong>
        <p>KB Salon Supplies Ltd. Registration No. ${escapeHtml(invoice.salonCompanyNumber || "")} in England<br>
        Registered office: ${escapeHtml(invoice.salonRegisteredOffice || "")}</p>
      </footer>
    </div>`;
}

function formatSalonSuppliesDate(value) {
  const [year, month, day] = String(value || "").split("-");
  return year && month && day ? `${day}/${month}/${year}` : escapeHtml(value || "");
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

function abwAmount(value) {
  return Number(value || 0).toFixed(2);
}

function formatAbwDate(value) {
  const [year, month, day] = String(value || "").split("-").map(Number);
  if (!year || !month || !day) return escapeHtml(value || "");
  const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month - 1];
  return `${String(day).padStart(2, "0")} ${monthName} ${year}`;
}

function formatAbwAddress(fields, fallbackValue) {
  const source = fields && Object.values(fields).some(Boolean) ? fields : parseInvoiceAddress(fallbackValue);
  const locality = [source.city, source.state, source.postal].filter(Boolean).join(", ");
  return [source.street, locality, source.country].filter(Boolean).map(escapeHtml).join("<br>") || "&nbsp;";
}

function renderAbwPreview(invoice) {
  const items = invoice.items || [];
  const subtotal = items.reduce((sum, item) => sum + rowTotal(item), 0);
  const coupon = Math.max(0, Number(invoice.abwCoupon || 0));
  const shipping = Math.max(0, Number(invoice.shippingAmount || 0));
  const shipmentHandling = Math.max(0, Number(invoice.abwShipmentHandlingFee || 0));
  const labelling = Math.max(0, Number(invoice.abwProductLabellingFee || 0));
  const freeProductHandling = Math.max(0, Number(invoice.abwFreeProductHandlingFee || 0));
  const cardHandling = Math.max(0, Number(invoice.abwCreditCardHandlingFee || 0));
  const total = subtotal - coupon + shipping + shipmentHandling + labelling + freeProductHandling + cardHandling;
  const bill = invoice.billToFields || {};
  const ship = invoice.shipToFields || {};

  return `
    <div class="invoice-doc abw-invoice">
      <header class="abw-header">
        <div class="abw-seller">
          <img src="${assetPath("/assets/abw-logo.png")}" alt="ABW Asian Beauty Wholesale" />
          <strong>AsianBeautyWholesale (Hong Kong) Limited</strong>
          <address>
            5/F, KC100, 100 Kwai Cheong Road,<br>
            Kwai Chung, New Territories, Hong Kong<br>
            Phone: (852) 2786-0817<br>
            Fax: (852) 2786-0650<br>
            Email: service-reply@asianbeautywholesale.com<br>
            Website: www.asianbeautywholesale.com
          </address>
        </div>
        <h1>ORDER INVOICE</h1>
        <dl class="abw-order-meta">
          <div><dt>Customer ID</dt><dd>${escapeHtml(invoice.abwCustomerId || "")}</dd></div>
          <div><dt>Order Number</dt><dd>${escapeHtml(invoice.invoiceNumber || "")}</dd></div>
          <div><dt>Order Date</dt><dd>${formatAbwDate(invoice.orderDate)}</dd></div>
          <div aria-hidden="true"><dt>&nbsp;</dt><dd>&nbsp;</dd></div>
        </dl>
      </header>

      <section class="abw-parties">
        <article>
          <h2>Bill To</h2>
          <dl>
            <div><dt>Company Name:</dt><dd>${escapeHtml(bill.company || invoice.clientName || "")}</dd></div>
            <div><dt>Name:</dt><dd>${escapeHtml(bill.name || "")}</dd></div>
            <div class="abw-address-row"><dt>Address:</dt><dd>${formatAbwAddress(bill, invoice.billTo)}</dd></div>
            <div><dt>Phone:</dt><dd>${escapeHtml(bill.phone || "")}</dd></div>
            <div><dt>Email:</dt><dd>${escapeHtml(invoice.abwBillingEmail || "")}</dd></div>
          </dl>
        </article>
        <article>
          <h2>Ship To</h2>
          <dl>
            <div><dt>Name:</dt><dd>${escapeHtml(ship.name || ship.company || "")}</dd></div>
            <div class="abw-address-row"><dt>Address:</dt><dd>${formatAbwAddress(ship, invoice.shipTo)}</dd></div>
            <div><dt>Phone:</dt><dd>${escapeHtml(ship.phone || "")}</dd></div>
            <div><dt>Email:</dt><dd>${escapeHtml(invoice.abwShippingEmail || "")}</dd></div>
          </dl>
        </article>
      </section>

      <section class="abw-methods">
        <p><strong>SHIPPING METHOD:</strong><span>${escapeHtml(invoice.abwShippingMethod || "")}</span></p>
        <p><strong>PAYMENT METHOD:</strong><span>${escapeHtml(invoice.paymentMethod || "")}</span></p>
      </section>

      <p class="abw-currency-note">*all prices are in USD</p>
      <table class="abw-products">
        <thead><tr><th>UPC/EAN</th><th>Qty</th><th>Catalog#</th><th>BRAND</th><th>Product Description</th><th>Unit Price in USD</th><th>Subtotal</th></tr></thead>
        <tbody>${items.map((item) => `<tr>
          <td>${escapeHtml(item.sku || "")}</td>
          <td>${Number(item.qty || 0)}</td>
          <td>${escapeHtml(item.product || "")}</td>
          <td>${escapeHtml(item.brand || "")}</td>
          <td>${escapeHtml(item.description || "")}</td>
          <td>${abwAmount(item.unit)}</td>
          <td>${abwAmount(rowTotal(item))}</td>
        </tr>`).join("")}</tbody>
      </table>

      <dl class="abw-totals">
        <div><dt>Subtotal</dt><dd>${abwAmount(subtotal)}</dd></div>
        <div><dt>Coupon</dt><dd>-${abwAmount(coupon)}</dd></div>
        <div><dt>Shipping Fee</dt><dd>${abwAmount(shipping)}</dd></div>
        <div><dt>Per Shipment Handling Fee</dt><dd>${abwAmount(shipmentHandling)}</dd></div>
        <div><dt>Product Labelling Fee</dt><dd>${abwAmount(labelling)}</dd></div>
        <div><dt>Free Product Handling Fee</dt><dd>${abwAmount(freeProductHandling)}</dd></div>
        <div><dt>Credit Card Handling Fee</dt><dd>${abwAmount(cardHandling)}</dd></div>
        <div class="abw-order-total"><dt>Order Total</dt><dd>${abwAmount(total)}</dd></div>
      </dl>
    </div>
  `;
}

function renderBobMartinPreview(invoice) {
  const taxRate = Math.max(0, Number(invoice.taxRate || 0));
  const items = invoice.items || [];
  const productSubtotal = items.reduce((sum, item) => sum + rowTotal(item) * (1 + taxRate / 100), 0);
  const discount = Math.max(0, Number(invoice.bobMartinDiscount || 0));
  const discountTax = Math.max(0, Number(invoice.bobMartinDiscountTax || 0));
  const shipping = Math.max(0, Number(invoice.shippingAmount || 0));
  const shippingTax = Math.max(0, Number(invoice.bobMartinShippingTax || 0));
  const fee = Math.max(0, Number(invoice.bobMartinFee || 0));
  const total = productSubtotal - discount - discountTax + shipping + shippingTax + fee;
  const cardEnding = String(invoice.cardEnding || "").replace(/\D/g, "").slice(-4);
  const paymentMethod = invoice.paymentMethod || invoice.cardType || "Visa";
  const paymentLabel = cardEnding ? `${paymentMethod} ending in ${cardEnding}` : paymentMethod;
  const totalTop = 588 + Math.max(0, items.length - 1) * 50;

  return `
    <div class="invoice-doc bob-martin-invoice">
      <header class="bob-martin-header">
        <img src="${assetPath("/assets/bob-martin-logo.png")}" alt="Bob Martin - established 1892" />
        <address>
          <strong>From Address</strong>
          Bob Martin<br>
          Wemberham Lane<br>
          Yatton<br>
          Bristol<br>
          United Kingdom (UK),<br>
          BS49 4BS<br>
          0344 748 0108<br>
          info@bobmartin.co.uk
        </address>
      </header>

      <section class="bob-martin-order">
        <p>INVOICE: ${escapeHtml(invoice.invoiceNumber || "")}</p>
        <p>Invoice Date: ${formatBobMartinDate(invoice.orderDate)}</p>
        <p>Order Date: ${formatBobMartinDate(invoice.deliveryDate)}</p>
        <p>Order No: ${escapeHtml(invoice.orderId || "")}</p>
        <p>Payment Method: ${escapeHtml(paymentLabel)}</p>
        <p>Shipping Method: ${escapeHtml(invoice.bobMartinShippingMethod || "")}</p>
      </section>

      <section class="bob-martin-parties">
        <div>
          <h2>Billing Address</h2>
          <p>${escapeHtml(invoice.billTo || invoice.clientName || "").replace(/\n/g, "<br>")}</p>
          ${invoice.bobMartinBillingEmail ? `<p>${escapeHtml(invoice.bobMartinBillingEmail)}</p>` : ""}
          ${invoice.billToFields?.phone ? `<p>${escapeHtml(invoice.billToFields.phone)}</p>` : ""}
        </div>
        <div>
          <h2>Shipping Address</h2>
          <p>${escapeHtml(invoice.shipTo || invoice.billTo || "").replace(/\n/g, "<br>")}</p>
        </div>
      </section>

      <table class="bob-martin-products">
        <thead><tr><th>SKU</th><th>Product</th><th>Quantity</th><th>Price</th><th>Tax Rate</th><th>Tax Type</th><th>Tax Value</th><th>Total</th></tr></thead>
        <tbody>
          ${items.map((item) => {
            const net = rowTotal(item);
            const tax = net * (taxRate / 100);
            return `<tr>
              <td>${escapeHtml(item.sku || "")}</td>
              <td>${escapeHtml(item.description || item.product || "")}</td>
              <td>${Number(item.qty || 0)}</td>
              <td>${money(Number(item.unit || 0), invoice.currency)}</td>
              <td>${taxRate}%</td>
              <td>VAT</td>
              <td>${money(tax, invoice.currency)}</td>
              <td>${money(net + tax, invoice.currency)}</td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>

      <dl class="bob-martin-totals" style="top:${totalTop}px">
        <div><dt>Subtotal</dt><dd>${money(productSubtotal, invoice.currency)}</dd></div>
        <div><dt>Discount</dt><dd>- ${money(discount, invoice.currency)}</dd></div>
        <div><dt>Discount Tax</dt><dd>- ${money(discountTax, invoice.currency)}</dd></div>
        <div><dt>Shipping</dt><dd>${money(shipping, invoice.currency)}</dd></div>
        <div><dt>Shipping Tax</dt><dd>${money(shippingTax, invoice.currency)}</dd></div>
        <div><dt>Fee</dt><dd>${money(fee, invoice.currency)}</dd></div>
        <div class="bob-martin-grand-total"><dt>Total</dt><dd>${money(total, invoice.currency)}</dd></div>
      </dl>

      <footer>Bob Martin is a trademark of Pets Choice Ltd.</footer>
    </div>
  `;
}

function renderRyzePreview(invoice, totals) {
  const reduction = Math.max(0, Number(invoice.ryzeReduction || 0));
  const grandTotal = Math.max(0, totals.total - reduction);
  const taxRate = Math.max(0, Number(invoice.taxRate || 0));
  const paidDate = formatRyzeDate(invoice.orderDate);
  const paymentMethod = invoice.paymentMethod || invoice.cardType || "Card";
  const cardEnding = String(invoice.cardEnding || "").replace(/\D/g, "").slice(-4);
  const seller = escapeHtml(invoice.ryzeSellerAddress || "").replace(/\n/g, "<br>");
  const shippedFrom = escapeHtml(invoice.ryzeShippedFrom || invoice.ryzeSellerAddress || "").replace(/\n/g, "<br>");
  const billedTo = escapeHtml(invoice.billTo || invoice.clientName || "").replace(/\n/g, "<br>");
  const shippedTo = escapeHtml(invoice.shipTo || "").replace(/\n/g, "<br>");
  const itemRows = (invoice.items || []).map((item, index) => {
    const amount = rowTotal(item);
    const lineTax = amount * (taxRate / 100);
    return `<tr>
      <td class="ryze-item-cell"><span>${index + 1}.</span><div><strong>${escapeHtml(item.description || item.product || "")}</strong>${index === 0 ? `<img src="${assetPath("/assets/ryze-coffee-product.png")}" alt="RYZE Mushroom Coffee" />` : ""}</div></td>
      <td>${Number(item.qty || 0)}</td>
      <td>${money(Number(item.unit || 0), invoice.currency)}</td>
      <td>${money(amount, invoice.currency)}</td>
      <td>${money(lineTax, invoice.currency)}</td>
      <td>${money(amount + lineTax, invoice.currency)}</td>
    </tr>`;
  }).join("");

  const pageFooter = (page) => `<footer class="ryze-page-footer">
    <div><small>Invoice No</small><strong>${escapeHtml(invoice.invoiceNumber || "")}</strong></div>
    <div><small>Invoice Date</small><strong>${paidDate}</strong></div>
    <div><small>Billed To</small><strong>${escapeHtml(invoice.clientName || (invoice.billTo || "").split(/\r?\n/)[0] || "")}</strong></div>
    <b>Page ${page} of 2</b>
  </footer>`;

  return `<div class="invoice-doc ryze-invoice">
    <section class="ryze-page ryze-page-one invoice-page">
      <header class="ryze-header">
        <div class="ryze-title-block"><div><h1>Invoice</h1><span>Paid</span></div><p>RYZE SUPERFOODS</p>
          <dl><div><dt>Invoice No #</dt><dd>${escapeHtml(invoice.invoiceNumber || "")}</dd></div><div><dt>Invoice Date</dt><dd>${paidDate}</dd></div><div><dt>Due Date</dt><dd>${formatRyzeDate(invoice.deliveryDate)}</dd></div></dl>
        </div>
        <div class="ryze-wordmark" aria-label="RYZE">R<span>Y</span>ZE</div>
      </header>
      <section class="ryze-address-grid">
        <article><h2>Billed By</h2><p>${seller}<br><b>Phone:</b> ${escapeHtml(invoice.ryzeSellerPhone || "")}</p></article>
        <article><h2>Billed To</h2><p>${billedTo}</p></article>
        <article class="ryze-shipping"><h2>Shipped From</h2><p>${shippedFrom}</p></article>
        <article class="ryze-shipping"><h2>Shipped To</h2><p>${shippedTo}</p></article>
      </section>
      <table class="ryze-products"><thead><tr><th>Item</th><th>Quantity</th><th>Unit<br>Price</th><th>Amount</th><th>Tax</th><th>Total</th></tr></thead><tbody>${itemRows || `<tr><td colspan="6">No items added</td></tr>`}</tbody></table>
      ${pageFooter(1)}
    </section>
    <section class="ryze-page ryze-page-two invoice-page">
      <div class="ryze-summary-row">
        <div class="ryze-paid-stamp"><span>THANK YOU</span><strong>PAID</strong><small>THANK YOU</small></div>
        <div><dl class="ryze-totals">
          <div><dt>Amount</dt><dd>${money(totals.subtotal, invoice.currency)}</dd></div>
          <div><dt>Tax</dt><dd>${money(totals.tax, invoice.currency)}</dd></div>
          <div><dt>Reductions</dt><dd>(${money(reduction, invoice.currency)})</dd></div>
          <div><dt>Shipping Charges</dt><dd>${money(totals.shipping, invoice.currency)}</dd></div>
          <div class="ryze-grand"><dt>Total (USD)</dt><dd>${money(grandTotal, invoice.currency)}</dd></div>
          <div class="ryze-amount-paid"><dt>Amount Paid</dt><dd>(${money(grandTotal, invoice.currency)})</dd></div>
        </dl><div class="ryze-signature"><em>Ryze</em><span>${escapeHtml(invoice.ryzeSignatory || "Authorized Signatory")}</span></div></div>
      </div>
      <section class="ryze-terms"><h2>Terms and Conditions</h2><p>${escapeHtml(invoice.ryzeTerms || "").replace(/\n/g, "<br>")}</p></section>
      <section class="ryze-return"><h2>Return<br>Policy</h2><p>${escapeHtml(invoice.ryzeReturnPolicy || "")}</p></section>
      <section class="ryze-payments"><h2>Payments</h2><div><span>Date</span><span>Amount Received</span><span>Payment Method</span><strong>${paidDate}</strong><strong>${money(grandTotal, invoice.currency)}</strong><strong>${escapeHtml(paymentMethod)}${cardEnding ? ` ending in ${escapeHtml(cardEnding)}` : ""}</strong></div></section>
      <p class="ryze-contact">For any enquiry, reach out via email at ${escapeHtml(invoice.ryzeContactEmail || "")}, call on ${escapeHtml(invoice.ryzeSellerPhone || "")}</p>
      ${pageFooter(2)}
    </section>
  </div>`;
}

function formatRyzeDate(value) {
  const [year, month, day] = String(value || "").split("-").map(Number);
  if (!year || !month || !day) return escapeHtml(value || "");
  const monthName = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][month - 1];
  return `${monthName} ${String(day).padStart(2, "0")}, ${year}`;
}

function formatBobMartinDate(value) {
  const [year, month, day] = String(value || "").split("-").map(Number);
  if (!year || !month || !day) return escapeHtml(value || "");
  const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month - 1];
  return `${String(day).padStart(2, "0")}/${monthName}/${year}`;
}

function formatTwWholesalePartyAddress(value, hiddenPartyLines = [], phoneNumber = "") {
  const normalizedHiddenLines = (Array.isArray(hiddenPartyLines) ? hiddenPartyLines : [hiddenPartyLines])
    .map((line) => String(line || "").trim().toLowerCase())
    .filter(Boolean);
  const normalizedPhone = String(phoneNumber || "").replace(/\D/g, "");
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !normalizedHiddenLines.includes(line.toLowerCase()))
    .filter((line) => !/^(?:phone|telephone|tel|mobile)\s*:/i.test(line))
    .filter((line) => {
      const digits = line.replace(/\D/g, "");
      return !(normalizedPhone && digits === normalizedPhone);
    })
    .flatMap((line) => line
      .split(/\s+(?=(?:mohalla|mohallah|nasir)\b)/i)
      .map((part) => part.trim())
      .filter(Boolean))
    .map((line) => line.replace(/\b([A-Z]{1,2}\d[A-Z\d]?)\s+(\d[A-Z]{2})\b/gi, "$1\u00a0$2"))
    .join("\n");
}

function twWholesaleParty(invoice, prefix, fallbackAddress = "") {
  const fields = invoice[`${prefix}Fields`] || {};
  const hasStructuredAddress = ["name", "company", "street", "city", "state", "postal", "country"]
    .some((key) => String(fields[key] || "").trim());
  const heading = String(fields.company || fields.name || "").trim()
    || (!hasStructuredAddress ? String(invoice.clientName || "").trim() : "");
  const address = String(invoice[prefix] || fallbackAddress || "");
  return {
    heading,
    address: formatTwWholesalePartyAddress(
      address,
      [fields.company, fields.name, heading].filter(Boolean),
      fields.phone
    )
  };
}

function renderTwWholesalePreview(invoice, totals) {
  const requestedPaymentMethod = String(invoice.paymentMethod || "").trim();
  const genericPaymentMethods = new Set(["", "card", "credit card", "debit card", "credit / debit card", "credit/debit card"]);
  const paymentMethod = genericPaymentMethods.has(requestedPaymentMethod.toLowerCase())
    ? (invoice.cardType || "Visa")
    : requestedPaymentMethod;
  const cardDigits = String(invoice.cardEnding || "").replace(/\D/g, "").slice(-4);
  const paymentReference = cardDigits ? `${paymentMethod} card ending ****${cardDigits}` : paymentMethod;
  const paymentLines = paymentReference;
  const shipping = Number(invoice.shipping || 0);
  const billTo = twWholesaleParty(invoice, "billTo");
  const shipTo = twWholesaleParty(invoice, "shipTo", invoice.billTo);
  return `
    <div class="invoice-doc tw-invoice">
      <header class="tw-header">
        <div class="tw-brand">
          <div class="tw-logo-mark" aria-label="TW Wholesale">
            <img src="${assetPath("/assets/tw-wholesale-logo.png")}" alt="TW Wholesale &amp; Superstore" />
          </div>
          <p>Tools · Hardware · Building Supplies</p>
        </div>
        <div class="tw-title">
          <h1>INVOICE</h1>
          <dl>
            <div><dt>Invoice#:</dt><dd>${escapeHtml(invoice.invoiceNumber)}</dd></div>
            <div><dt>Order Date:</dt><dd>${formatDisplayDate(invoice.orderDate)}</dd></div>
            <div><dt>Delivery Date:</dt><dd>${formatDisplayDate(invoice.deliveryDate)}</dd></div>
            <div><dt>PO Number:</dt><dd>${escapeHtml(invoice.poNumber || invoice.orderId || "")}</dd></div>
          </dl>
        </div>
      </header>

      <section class="tw-company-line">
        <address>
          <strong>T W Wholesale Limited.</strong>
          Unit 11, Ryder Close<br>
          Cadley Hill Road, Swadlincote<br>
          Derbyshire, DE11 9EU<br>
          United Kingdom<br>
          Phone: +44 1283 558 313<br>
          Email: enquiries@twwholesale.co.uk<br>
          Company Number: 02522049<br>
          Vat Number: GB 111 164 035
        </address>
      </section>

      <section class="tw-parties">
        <div>
          <h2>Bill To</h2>
          ${billTo.heading ? `<strong>${escapeHtml(billTo.heading)}</strong>` : ""}
          <p>${escapeHtml(billTo.address)}</p>
        </div>
        <div>
          <h2>Ship To</h2>
          ${shipTo.heading ? `<strong>${escapeHtml(shipTo.heading)}</strong>` : ""}
          <p>${escapeHtml(shipTo.address)}</p>
        </div>
      </section>

      <table class="tw-products" style="--tw-item-count: ${Math.max(1, invoice.items.length)}">
        <thead>
          <tr>
            <th>Item Description</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Vat</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map((item) => `
            <tr>
              <td>${escapeHtml(itemLine(item))}</td>
              <td>${Number(item.qty || 0)}</td>
              <td>${money(Number(item.unit || 0), invoice.currency)}</td>
              <td>${Number(invoice.taxRate || 0)}%</td>
              <td>${money(rowTotal(item), invoice.currency)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <section class="tw-summary-area">
        <div class="tw-payment">
          <h2>Payment Details</h2>
          <p>${escapeHtml(paymentLines)}</p>
        </div>
        <dl class="tw-totals">
          <div><dt>Item Total:</dt><dd>${money(totals.subtotal, invoice.currency)}</dd></div>
          <div><dt>Vat:</dt><dd>${money(totals.tax, invoice.currency)}</dd></div>
          ${shipping ? `<div><dt>Shipping:</dt><dd>${money(shipping, invoice.currency)}</dd></div>` : ""}
          <div class="tw-grand-total"><dt>Total:</dt><dd>${money(totals.total, invoice.currency)}</dd></div>
        </dl>
      </section>

      <section class="tw-terms">
        <h2>Terms &amp; Conditions</h2>
        <p>The seller confirms that the items listed in this invoice are intended for resale and grants the buyer full authority to resell them in compliance with relevant laws.</p>
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

function renderBruidePreview(invoice, totals) {
  const invoiceDate = (() => {
    const [year, month, day] = String(invoice.orderDate || "").split("-").map(Number);
    if (!year || !month || !day) return escapeHtml(invoice.orderDate || "");
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC"
    }).format(new Date(Date.UTC(year, month - 1, day)));
  })();
  const invoiceMoney = (value) => money(Number(value || 0), invoice.currency).replaceAll(",", "");
  const address = (value) => escapeHtml(String(value || "").replace(/^Phone:\s*/gim, ""));

  return `
    <div class="invoice-doc bruide-invoice">
      <header class="bruide-header">
        <div class="bruide-brand">
          <img src="${assetPath("/assets/bruide-logo.png")}" alt="Bruide" />
          <p>Your Reliable Auto Tools Supplier</p>
        </div>
        <address>
          <span>www.bridertools.com</span>
          <span>Tel: +86-15868854226</span>
          <span>E-mail: lxd@bruidetools.com</span>
          <span>Address: No. 25, Shenwan Rd,</span>
          <span>Lucheng District Light Industrial</span>
          <span>Park, Wenzhou, China</span>
        </address>
      </header>

      <section class="bruide-meta">
        <div><strong>Invoice No #</strong><span>${escapeHtml(invoice.invoiceNumber)}</span></div>
        <div><strong>Order Date:</strong><span>${invoiceDate}</span></div>
        <div><strong>User ID #</strong><span>${escapeHtml(invoice.orderId || "")}</span></div>
      </section>

      <section class="bruide-addresses">
        <div><h2>Bill To:</h2><p>${address(invoice.billTo)}</p></div>
        <div><h2>Ship To:</h2><p>${address(invoice.shipTo)}</p></div>
      </section>

      <table class="bruide-products">
        <thead><tr><th>Product ID</th><th>Products Names</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
        <tbody>${invoice.items.map((item) => `
          <tr>
            <td>${escapeHtml(item.sku || "")}</td>
            <td>${escapeHtml(itemLine(item))}</td>
            <td>${Number(item.qty || 0)}</td>
            <td>${invoiceMoney(item.unit)}</td>
            <td>${invoiceMoney(rowTotal(item))}</td>
          </tr>`).join("")}</tbody>
      </table>

      <section class="bruide-order-details">
        <div><h2>Payment Method:</h2><p>${escapeHtml(invoice.paymentMethod || "")}</p></div>
        <div><h2>Shipping Method:</h2><p>${escapeHtml(invoice.trackingId || "")}</p></div>
        <div>
          <h2>Order Details</h2>
          <dl>
            <div><dt>Sub Total:</dt><dd>${invoiceMoney(totals.subtotal)}</dd></div>
            <div><dt>Tax:</dt><dd>${invoiceMoney(totals.tax)}</dd></div>
            <div><dt>Shipping:</dt><dd>${invoiceMoney(totals.shipping)}</dd></div>
            <div><dt>Grand Total:</dt><dd>${invoiceMoney(totals.total)}</dd></div>
          </dl>
        </div>
      </section>

      <footer class="bruide-footer">Copyright &copy; <span>WENZHOU BRUIDE PRECISION METAL CO., LTD.</span> All Rights Reserved.</footer>
    </div>`;
}

function renderAbenaPreview(invoice, totals) {
  const amount = (value) => Number(value || 0).toFixed(2);
  const date = (value) => {
    if (!value) return "";
    const [year, month, day] = String(value).split("-");
    return year && month && day ? `${day}-${month}-${year}` : escapeHtml(value);
  };
  const productVat = totals.subtotal * (Number(invoice.taxRate || 0) / 100);
  const freightVat = totals.shipping * (Number(invoice.taxRate || 0) / 100);
  const billAddress = String(invoice.billTo || "").trim();
  const shipAddress = String(invoice.shipTo || "").trim();

  return `
    <div class="invoice-doc abena-invoice">
      <header class="abena-header">
        <div class="abena-logo" aria-label="Abena">ABENA<sup>®</sup></div>
        <section class="abena-address-grid">
          <div><p><span>Invoice Account No.:</span><b>${escapeHtml(invoice.abenaInvoiceAccount || "")}</b></p><address>${escapeHtml(billAddress)}</address></div>
          <div><p><span>Order Account No.:</span><b>${escapeHtml(invoice.abenaOrderAccount || "")}</b></p><address>${escapeHtml(shipAddress)}</address></div>
        </section>
      </header>

      <section class="abena-title-row">
        <div><span>DISA</span><b>${date(invoice.deliveryDate)}</b></div>
        <h1>Prepaid Invoice</h1>
        <dl>
          <div><dt>Number:</dt><dd>${escapeHtml(invoice.invoiceNumber)}</dd></div>
          <div><dt>Date</dt><dd>${date(invoice.orderDate)}</dd></div>
        </dl>
        <span class="abena-page">Page&nbsp;&nbsp;${escapeHtml(invoice.abenaPageLabel || "1 of 1")}</span>
      </section>

      <section class="abena-meta-grid">
        <dl>
          <div><dt>Your PO No.:</dt><dd>${escapeHtml(invoice.poNumber || "")}</dd></div>
          <div><dt>Your reference:</dt><dd>${escapeHtml(invoice.abenaReference || "")}</dd></div>
          <div><dt>Your VAT No.</dt><dd>${escapeHtml(invoice.caseNumber || "")}</dd></div>
          <div><dt>Dispatch date:</dt><dd>${date(invoice.deliveryDate)}</dd></div>
        </dl>
        <dl>
          <div><dt>Payment Terms:</dt><dd>${escapeHtml(invoice.paymentDetails || "")}</dd></div>
          <div><dt>Due date:</dt><dd>${date(invoice.abenaDueDate)}</dd></div>
          <div><dt>&nbsp;</dt><dd>&nbsp;</dd></div>
          <div><dt>Payment Method:</dt><dd>${escapeHtml(invoice.paymentMethod || "")}</dd></div>
        </dl>
        <dl>
          <div><dt>Invoice account:</dt><dd>${escapeHtml(invoice.abenaInvoiceAccount || "")}</dd></div>
          <div><dt>Sales order:</dt><dd>${escapeHtml(invoice.abenaSalesOrder || "")}</dd></div>
          <div><dt>Our reference:</dt><dd>${escapeHtml(invoice.abenaOurReference || "")}</dd></div>
          <div><dt>Terms of delivery:</dt><dd>${escapeHtml(invoice.abenaTermsOfDelivery || "")}</dd></div>
        </dl>
      </section>

      <table class="abena-products">
        <thead><tr><th>Material No.</th><th>Quantity</th><th>Unit</th><th>Material description</th><th>Unit price</th><th>VAT code</th><th>Net amount</th></tr></thead>
        <tbody>${invoice.items.map((item, index) => `
          <tr>
            <td>${escapeHtml(item.sku || "")}<small>Pos.:${String((index + 1) * 10).padStart(6, "0")}</small></td>
            <td>${Number(item.qty || 0)}</td>
            <td>${escapeHtml(item.product || "PAC")}</td>
            <td>${escapeHtml(item.description || "")}<small>${escapeHtml(invoice.abenaPackingDetails || "")}</small><small class="abena-delivery-line">Delivery: ${escapeHtml(invoice.abenaDeliveryNumber || "")}<i>PO. Number: ${escapeHtml(invoice.poNumber || "")}</i></small></td>
            <td>${amount(item.unit)}<small>Pr. 1 ${escapeHtml(item.product || "PAC")}</small></td>
            <td>${escapeHtml(item.vatCode || "1")}</td>
            <td>${amount(rowTotal(item))}</td>
          </tr>`).join("")}</tbody>
      </table>

      <section class="abena-vat-tables">
        <table><thead><tr><th>VAT code</th><th>Net amount</th><th>VAT %</th><th>VAT Amount</th></tr></thead><tbody><tr><td>1</td><td>${amount(totals.subtotal)}</td><td>${amount(invoice.taxRate)}</td><td>${amount(productVat)}</td></tr></tbody></table>
        <table><thead><tr><th>Momskode</th><th>Fragtbeløb</th><th>% moms</th><th>VAT Amount</th></tr></thead><tbody><tr><td>1</td><td>${amount(totals.shipping)}</td><td>${amount(invoice.taxRate)}</td><td>${amount(freightVat)}</td></tr></tbody></table>
      </section>

      <section class="abena-bottom">
        <dl class="abena-weights">
          <div><dt>Total net weight</dt><dd>${escapeHtml(invoice.abenaNetWeight || "")}</dd></div>
          <div><dt>Total gross weight</dt><dd>${escapeHtml(invoice.abenaGrossWeight || "")}</dd></div>
          <div><dt>Total volume</dt><dd>${escapeHtml(invoice.abenaVolume || "")}</dd></div>
        </dl>
        <dl class="abena-totals">
          <div><dt>Gross amount</dt><dd>${amount(totals.subtotal)}</dd></div>
          <div><dt>Total freight</dt><dd>${amount(totals.shipping)}</dd></div>
          <div><dt>Fee&nbsp; Misc. charges</dt><dd>0.00</dd></div>
          <div><dt>VAT amount</dt><dd>${amount(totals.tax)}</dd></div>
          <div><dt>GBP Total amount</dt><dd>${amount(totals.total)}</dd></div>
        </dl>
        <footer class="abena-footer">
          <p><strong>Abena UK Ltd</strong><br>Sprint Point, Dolomite Avenue<br>Coventry Business Park<br>Coventry CV5 6US</p>
          <p>Account:&nbsp;&nbsp;&nbsp; 301281 93400575<br>VAT no.:&nbsp;&nbsp;&nbsp; GB747669868</p>
          <p>Phone :&nbsp; +44 (0)2476 854800<br>Fax:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; +44 (0)2476 854840<br>Email:&nbsp;&nbsp;&nbsp; customerservices@abena.co.uk</p>
        </footer>
      </section>
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
  const paymentStatus = "Paid in Full";
  const cardNumber = invoice.cardEnding ? `**${invoice.cardEnding}` : "**0000";
  const vatRate = Math.max(0, Number(invoice.taxRate || 0));

  return `
    <div class="invoice-doc qogita-uk-invoice">
      <header class="qogita-header">
        <div class="qogita-mondu-badge" role="img" aria-label="Mondú pay later"></div>
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
      <footer><span>${escapeHtml(typeof invoice.qogitaFooterText === "string" ? invoice.qogitaFooterText : "© 2025 Qogita. All rights reserved.")}</span></footer>
    </div>`;
}

function renderPerfumeUnlimitedPreview(invoice, totals) {
  const displayDate = String(invoice.orderDate || "")
    .split("-")
    .reverse()
    .join("-");
  const cardType = invoice.cardType || invoice.paymentMethod || "Mastercard";
  const normalizedCardType = String(cardType).toLowerCase();
  const cardBrand = normalizedCardType.includes("american") || normalizedCardType.includes("amex")
    ? "amex"
    : normalizedCardType.includes("visa")
      ? "visa"
      : "mastercard";
  const cardMark = cardBrand === "mastercard"
    ? "<i></i><i></i>"
    : cardBrand === "visa"
      ? "VISA"
      : "AMERICAN<br>EXPRESS";
  return `
    <div class="invoice-doc perfume-unlimited-invoice">
      <header class="perfume-unlimited-header">
        <h1>${escapeHtml(invoice.perfumeTitle || "TAX INVOICE")}</h1>
        <div class="perfume-unlimited-rule"></div>
        <div class="perfume-unlimited-invoice-meta">
          <strong>INVOICE # ${escapeHtml(invoice.invoiceNumber)}</strong>
          <strong>Date: ${escapeHtml(displayDate)}</strong>
        </div>
        <div class="perfume-unlimited-brand">
          <img src="${assetPath("/assets/perfume-unlimited-logo.png")}" alt="${escapeHtml(invoice.perfumeCompanyName || "Perfume Unlimited")}" />
          <p>${escapeHtml(invoice.perfumeAddress || "")}<br>TRN: ${escapeHtml(invoice.perfumeTrn || "")}<br>${escapeHtml(invoice.perfumeEmail || "")}</p>
        </div>
      </header>

      <section class="perfume-unlimited-shipping">
        <h2>SHIPPING DETAILS</h2>
        <p>${escapeHtml(invoice.shipTo) || "&nbsp;"}</p>
      </section>

      <table class="perfume-unlimited-products">
        <colgroup>
          <col class="perfume-product-col">
          <col class="perfume-unit-price-col">
          <col class="perfume-qty-col">
          <col class="perfume-subtotal-col">
        </colgroup>
        <thead><tr><th><span>Product Details</span></th><th><span>Unit Price</span></th><th><span>QTY</span></th><th><span>Sub Total</span></th></tr></thead>
        <tbody>${invoice.items.map((item) => `
          <tr>
            <td><span>${escapeHtml(itemLine(item))}</span></td>
            <td><span>${perfumeUnlimitedMoney(Number(item.unit || 0), invoice.currency)}</span></td>
            <td><span>${Number(item.qty || 0)}</span></td>
            <td><span>${perfumeUnlimitedMoney(rowTotal(item), invoice.currency)}</span></td>
          </tr>`).join("")}</tbody>
      </table>

      <section class="perfume-unlimited-lower">
        <div class="perfume-unlimited-billing">
          <h2>BILLING DETAILS</h2>
          <p>${escapeHtml(clientAddress(invoice)) || "&nbsp;"}</p>
          <p class="perfume-unlimited-card"><span class="perfume-card-mark perfume-card-mark--${cardBrand}" aria-hidden="true">${cardMark}</span>${escapeHtml(cardType)} **** **** **** ${escapeHtml(invoice.cardEnding || "0000")}</p>
        </div>
        <div class="perfume-unlimited-totals">
          <dl>
            <div><dt>TOTAL BEFORE VAT:</dt><dd>${perfumeUnlimitedMoney(totals.subtotal, invoice.currency)}</dd></div>
            <div><dt>VAT INC:</dt><dd>${perfumeUnlimitedMoney(totals.tax, invoice.currency)}</dd></div>
            <div><dt>SHIPPING:</dt><dd>${perfumeUnlimitedMoney(totals.shipping, invoice.currency)}</dd></div>
          </dl>
          <div class="perfume-unlimited-grand"><strong>TOTAL:</strong><b>${perfumeUnlimitedMoney(totals.total, invoice.currency)}</b></div>
        </div>
      </section>

      <footer class="perfume-unlimited-footer">
        <div class="perfume-unlimited-thanks"><span class="perfume-unlimited-footer-mark" aria-hidden="true"><img src="${assetPath("/assets/perfume-unlimited-logo.png")}" alt="" /></span><strong>${escapeHtml(invoice.perfumeThankYou || "")}</strong></div>
        <div class="perfume-unlimited-dash"></div>
        <div class="perfume-unlimited-footer-copy"><span>${escapeHtml(invoice.perfumeFooterNote || "")}</span><span>${escapeHtml(invoice.perfumePageLabel || "")}</span></div>
      </footer>
    </div>`;
}

function perfumeUnlimitedMoney(value, currency) {
  return `${currencySymbol(currency)}${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

function renderPortonPreview(invoice, totals) {
  const date = invoice.orderDate ? new Date(`${invoice.orderDate}T12:00:00`) : new Date();
  const displayDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  // The source has one row and a 31.32px whitespace band before Subtotal.
  // Set this synchronously in the markup so preview and export always capture
  // the same source-matched gap, including before layout observers run.
  const portonRowFlowOffset = Math.max(0, invoice.items.length - 1) * 27.98;
  return `
    <div class="invoice-doc porton-invoice" style="--porton-row-flow-offset: ${portonRowFlowOffset}px">
      <header class="porton-header">
        <img class="porton-logo" src="${assetPath("/assets/porton-logo-2017.png")}" alt="Porton Garden Aquatic & Pets" />
        <strong class="porton-seller-name">${escapeHtml(invoice.portonSellerName || "Porton Garden Aquatic & Pets")}</strong>
        <h1>INVOICE</h1>
      </header>

      <section class="porton-customer-address">${escapeHtml(formatPortonCustomerAddress(invoice)) || "&nbsp;"}</section>

      <dl class="porton-order-meta">
        <div><dt>Order Number:</dt><dd>${escapeHtml(invoice.invoiceNumber || "")}</dd></div>
        <div><dt>Order Date:</dt><dd>${escapeHtml(displayDate)}</dd></div>
        <div><dt>Payment Method:</dt><dd>${escapeHtml(invoice.paymentMethod || "")}</dd></div>
      </dl>

      <table class="porton-products">
        <colgroup><col class="porton-product-col"><col class="porton-qty-col"><col class="porton-total-col"></colgroup>
        <thead><tr><th>Product</th><th>Quantity</th><th>Total</th></tr></thead>
        <tbody>${invoice.items.map((item) => `
          <tr><td>${escapeHtml(itemLine(item))}</td><td>${Number(item.qty || 0)}</td><td>${money(rowTotal(item), invoice.currency)}</td></tr>`).join("")}</tbody>
      </table>

      <dl class="porton-totals">
        <div><dt>Subtotal</dt><dd>${money(totals.subtotal, invoice.currency)}</dd></div>
        <div><dt>Shipping</dt><dd>${money(totals.shipping, invoice.currency)}</dd></div>
        <div class="porton-grand-total"><dt>Total</dt><dd>${money(totals.total, invoice.currency)}</dd></div>
        <div><dt>VAT</dt><dd>${money(totals.tax, invoice.currency)}</dd></div>
      </dl>

      <footer class="porton-footer">VAT Number: ${escapeHtml(invoice.portonVatNumber || "750456633")}</footer>
    </div>`;
}

function formatPortonCustomerAddress(invoice) {
  const address = invoice.billToFields || parseInvoiceAddress(invoice.billTo || "");
  const identity = address.name || address.company || invoice.clientName || "";
  return [identity, address.street, address.city, address.postal]
    .map((line) => String(line || "").trim())
    .filter(Boolean)
    .join("\n");
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
          <p class="costco-payment-line costco-payment-line--${paymentBrand}">
            <span class="costco-card-mark costco-card-mark--${paymentBrand}" aria-hidden="true">${paymentMark}</span>
            <span class="costco-payment-copy"><span>${escapeHtml(paymentLabel)}</span><small>Expires ${escapeHtml(invoice.costcoCardExpiry || "--/--")}</small></span>
          </p>
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
  const payment = formatClientCardPayment(invoice.cardType, invoice.cardEnding) || String(invoice.paymentMethod || "");
  const tracking = String(invoice.trackingId || "");
  const order = String(invoice.orderId || "");
  const selectedClient = state.clients.find((client) => client.id === invoice.clientId);
  const clientEmail = String(selectedClient?.email || invoice.clientEmail || "").trim();
  const formatGoSuppsAddress = (type) => {
    const fallbackValue = type === "billTo" ? clientAddress(invoice) : invoice.shipTo;
    const sourceFields = type === "billTo" ? invoice.billToFields : invoice.shipToFields;
    const fields = sourceFields && Object.values(sourceFields).some(Boolean)
      ? sourceFields
      : parseInvoiceAddress(fallbackValue);
    const name = String(fields.company || fields.name || (type === "billTo" ? invoice.clientName : "")).trim();
    const cityLine = [fields.city, fields.state, fields.postal].filter(Boolean).join(", ");

    return [
      name ? `Name: ${name}` : "",
      clientEmail ? `E-Mail: ${clientEmail}` : "",
      fields.phone ? `Phone: ${fields.phone}` : "",
      fields.street ? `Address: ${fields.street}` : "",
      cityLine,
      fields.country ? `Country: ${fields.country}` : ""
    ].filter(Boolean).join("\n");
  };
  const goSuppsBillTo = formatGoSuppsAddress("billTo");
  const goSuppsShipTo = formatGoSuppsAddress("shipTo");

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
        <div><h4>BILL TO</h4><p>${escapeHtml(goSuppsBillTo) || "&nbsp;"}</p></div>
        <div><h4>SHIP TO</h4><p>${escapeHtml(goSuppsShipTo) || "&nbsp;"}</p></div>
      </section>

      <table class="gosupps-table">
        <thead><tr><th>QTY</th><th>DESCRIPTION</th><th>UNIT PRICE</th><th>AMOUNT</th></tr></thead>
        <tbody>${invoice.items.map((item) => `<tr><td>${Number(item.qty || 0)}</td><td>${escapeHtml(itemLine(item))}</td><td>${money(Number(item.unit || 0), invoice.currency)}</td><td>${money(rowTotal(item), invoice.currency)}</td></tr>`).join("")}</tbody>
      </table>

      <section class="gosupps-totals">
        <div><span class="gosupps-total-label">SUBTOTAL:</span><strong>${money(totals.subtotal, invoice.currency)}</strong></div>
        <div><span class="gosupps-total-label">SHIPPING &amp; HANDLING:</span><strong>${money(totals.shipping, invoice.currency)}</strong></div>
        <div><span class="gosupps-total-label">TAX:</span><strong>${money(totals.tax, invoice.currency)}</strong></div>
        <div><span class="gosupps-total-label">GRAND TOTAL:</span><strong>${money(totals.total, invoice.currency)}</strong></div>
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

function renderAutodocPreview(invoice, totals) {
  const dateValue = invoice.orderDate ? new Date(`${invoice.orderDate}T00:00:00`) : null;
  const invoiceDate = dateValue && !Number.isNaN(dateValue.getTime())
    ? dateValue.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).replace(",", "").replaceAll(" ", "-")
    : escapeHtml(invoice.orderDate || "");
  const vatRate = Number(invoice.taxRate || 0);
  const bankInformation = invoice.autodocBankInformation || `${invoice.cardType || "Visa"} card ending in ${invoice.cardEnding || ""}`;
  const bankExpiry = invoice.cardExpiry && !bankInformation.toLowerCase().includes("expiry")
    ? `Expiry ${invoice.cardExpiry}`
    : "";
  const itemRows = invoice.items.map((item, index) => {
    const amount = rowTotal(item);
    return `<tr>
      <td>${index + 1}</td>
      <td>${escapeHtml(item.description || item.product || "")}</td>
      <td>${Number(item.qty || 0)}</td>
      <td>${money(item.unit, invoice.currency)}</td>
      <td>VAT ${vatRate.toFixed(0)}%</td>
      <td>${money(amount, invoice.currency)}</td>
    </tr>`;
  }).join("");

  return `
    <div class="invoice-doc autodoc-invoice">
      <section class="autodoc-sheet">
        <header class="autodoc-header">
          <div class="autodoc-brand-crop"><img src="${assetPath("/assets/autodoc-source-reference.jpg")}" alt="AUTODOC" /></div>
          <div class="autodoc-company">
            <strong>${escapeHtml(invoice.autodocCompanyName || "Autodoc Operations UK Limited")}</strong>
            <span>Tel:${escapeHtml(invoice.autodocPhone || "")}</span>
            <p>${escapeHtml(invoice.autodocAddress || "")}</p>
          </div>
          <h1>INVOICE</h1>
        </header>

        <section class="autodoc-meta">
          <dl>
            <div><dt>Invoice#</dt><dd>: ${escapeHtml(invoice.invoiceNumber || "")}</dd></div>
            <div><dt>Invoice Date</dt><dd>: ${invoiceDate}</dd></div>
            <div><dt>Order Date</dt><dd>: ${escapeHtml(invoice.autodocOrderReference || invoice.orderId || "")}</dd></div>
          </dl>
        </section>

        <section class="autodoc-addresses">
          <div><h2>Bill To:</h2><p>${escapeHtml(clientAddress(invoice))}</p></div>
          <div><h2>Ship To:</h2><p>${escapeHtml(invoice.shipTo || clientAddress(invoice))}</p></div>
        </section>

        <table class="autodoc-products">
          <thead><tr><th>#</th><th>Item Description</th><th>Qty</th><th>Price</th><th>VAT</th><th>Amount</th></tr></thead>
          <tbody>${itemRows || `<tr><td colspan="6">No items added</td></tr>`}</tbody>
        </table>

        <section class="autodoc-lower">
          <div class="autodoc-notes">
            <h3>Bank Information</h3>
            <p>${escapeHtml(bankInformation)}${bankExpiry ? `<br>${escapeHtml(bankExpiry)}` : ""}</p>
            <h3>Terms &amp; Conditions</h3>
            <p>${escapeHtml(invoice.autodocTerms || "")}</p>
          </div>
          <dl class="autodoc-totals">
            <div><dt>Sub Total</dt><dd>${money(totals.subtotal, invoice.currency)}</dd></div>
            <div><dt>VAT (${vatRate.toFixed(0)}%)</dt><dd>${money(totals.tax, invoice.currency)}</dd></div>
            <div><dt>TOTAL PAID</dt><dd>${money(totals.total, invoice.currency)}</dd></div>
          </dl>
        </section>
      </section>
      <footer class="autodoc-page-footer"><span></span><small>${escapeHtml(invoice.autodocPageLabel || "01")}</small></footer>
    </div>`;
}

function renderPetshopPreview(invoice, totals) {
  const taxRate = Number(invoice.taxRate || 0);
  const orderNumber = invoice.orderId || invoice.invoiceNumber;
  const taxNet = totals.subtotal + totals.shipping;

  return `
    <div class="invoice-doc petshop-invoice">
      <header class="petshop-header">
        <div class="petshop-brand">
          <img src="${assetPath("/assets/petshop-logo.jpg")}" alt="PetShop.co.uk" />
          <h2>Woof! We&rsquo;ve received your order</h2>
          <address><strong>PetShopBowl</strong><br>Unit A5 Precision Business Park<br>100 Masons Road<br>Stratford-upon-Avon Warwickshire CV37 9BY<br>United Kingdom<br>Tax ID # ${escapeHtml(invoice.poNumber || "")}</address>
        </div>
        <div class="petshop-meta">
          <h1>Sales Order</h1>
          <dl>
            <div><dt>Date</dt><dd>${formatDisplayDate(invoice.orderDate)}</dd></div>
            <div><dt>Order #</dt><dd>${escapeHtml(orderNumber)}</dd></div>
            <div class="petshop-meta-gap"><dt>VAT Reg N&ordm;</dt><dd>${escapeHtml(invoice.poNumber || "")}</dd></div>
            <div><dt>Shipping Method</dt><dd>${escapeHtml(invoice.paymentMethod || "")}</dd></div>
            <div><dt>Order Date</dt><dd>${formatDisplayDate(invoice.orderDate)}</dd></div>
            <div><dt>Tracking #</dt><dd>${escapeHtml(invoice.trackingId || "")}</dd></div>
          </dl>
        </div>
      </header>
      <section class="petshop-addresses">
        <div><h3>Bill To</h3><p>${escapeHtml(clientAddress(invoice)) || "&nbsp;"}</p></div>
        <div><h3>Ship To</h3><p>${escapeHtml(invoice.shipTo) || "&nbsp;"}</p></div>
      </section>
      <table class="petshop-products">
        <thead><tr><th>Description</th><th>Units</th><th>Quantity</th><th>Rate</th><th>Options</th><th>Amount</th><th>Gross Amt</th></tr></thead>
        <tbody>
          ${invoice.items.map((item) => {
            const amount = rowTotal(item);
            const gross = amount * (1 + taxRate / 100);
            const options = escapeHtml(item.product || "").replaceAll(" | ", "<br>");
            return `<tr class="petshop-product-row"><td>${escapeHtml(item.description || "")}</td><td>${escapeHtml(item.sku || "EA")}</td><td>${Number(item.qty || 0)}</td><td>${Number(item.unit || 0).toFixed(2)}</td><td>${options}</td><td>${amount.toFixed(2)}</td><td>${gross.toFixed(2)}</td></tr>`;
          }).join("")}
          <tr class="petshop-tax-heading"><td>Tax Code Summary</td><td colspan="2"></td><td>Tax Rate</td><td>Total Net</td><td>Total Tax</td><td></td></tr>
          <tr class="petshop-tax-row"><td>S-GB</td><td colspan="2"></td><td>${taxRate.toFixed(1)}%</td><td>${money(taxNet, invoice.currency)}</td><td>${money(totals.tax, invoice.currency)}</td><td></td></tr>
        </tbody>
      </table>
      <footer class="petshop-footer">
        <p>${escapeHtml(invoice.paymentDetails || "")}</p>
        <div class="petshop-totals">
          <div><span>Subtotal</span><strong>${totals.subtotal.toFixed(2)}</strong></div>
          <div><span>Shipping Cost (${escapeHtml(invoice.paymentMethod || "Delivery")})</span><strong>${totals.shipping.toFixed(2)}</strong></div>
          <div><span>Tax Total</span><strong>${totals.tax.toFixed(2)}</strong></div>
          <div><span>Total</span><strong>${money(totals.total, invoice.currency)}</strong></div>
        </div>
        <div class="petshop-barcode" aria-label="Order ${escapeHtml(orderNumber)}"><i></i><span>${escapeHtml(orderNumber)}</span></div>
      </footer>
    </div>`;
}

function renderVetUkPreview(invoice, totals, testMode) {
  const vetUkItemTotal = totals.subtotal + totals.tax;
  const vetUkGrandTotal = vetUkItemTotal + totals.shipping;
  const vetUkBillToLines = clientAddress(invoice)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const vetUkBillToName = vetUkBillToLines.shift() || "";

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
            Phone:+44 01845 591 040
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
        <div class="vetuk-billto-address">
          <strong>${escapeHtml(vetUkBillToName)}</strong>
          ${vetUkBillToLines.map((line) => `<span>${escapeHtml(line)}</span>`).join("")}
        </div>
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

async function saveCurrentInvoice(triggerButton) {
  const saveButtons = [els.saveInvoice, els.saveEditorInvoice].filter(Boolean);
  saveButtons.forEach((button) => {
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
  });
  showInvoiceSaveNotice("Saving invoice…", "working");

  try {
    syncInvoiceFromForm();
    const invoice = cloneInvoice(state.current);
    invoice.id = invoice.id || `inv-${Date.now()}`;
    invoice.savedSource = invoice.savedSource || "invoice-builder";
    invoice.savedAt = new Date().toISOString();
    invoice.status = "saved";
    const existingIndex = state.invoices.findIndex((item) =>
      item.id === invoice.id || (
        invoice.invoiceNumber &&
        item.invoiceNumber === invoice.invoiceNumber &&
        (item.clientId || "") === (invoice.clientId || "")
      )
    );
    if (existingIndex >= 0) {
      state.invoices[existingIndex] = invoice;
    } else {
      state.invoices.unshift(invoice);
    }
    state.current.id = invoice.id;
    state.current.savedSource = invoice.savedSource;
    state.current.savedAt = invoice.savedAt;
    state.current.status = invoice.status;

    const cloudSave = persist({ immediateCloud: true });
    assertInvoiceSavedLocally(invoice.id);
    renderSavedInvoices();
    renderClients();
    updateMetrics();
    showView("saved");

    try {
      await cloudSave;
      showInvoiceSaveNotice("Invoice saved successfully.", "success");
    } catch (cloudError) {
      console.error("Invoice was saved locally but cloud synchronization failed.", cloudError);
      showInvoiceSaveNotice("Invoice saved on this browser. Cloud sync will retry when you save again.", "error");
    }
  } catch (error) {
    console.error("Invoice could not be saved.", error);
    showInvoiceSaveNotice("Invoice could not be saved. Please try again.", "error");
    triggerButton?.focus();
  } finally {
    saveButtons.forEach((button) => {
      button.disabled = false;
      button.removeAttribute("aria-busy");
    });
  }
}

function assertInvoiceSavedLocally(invoiceId) {
  const storedState = JSON.parse(localStorage.getItem(storageKey) || "null");
  const savedInvoices = Array.isArray(storedState?.invoices) ? storedState.invoices : [];
  if (!savedInvoices.some((invoice) => invoice.id === invoiceId)) {
    throw new Error("The saved invoice was not written to browser storage.");
  }
}

function showInvoiceSaveNotice(message, status = "working") {
  if (els.invoiceSaveNotice) {
    els.invoiceSaveNotice.hidden = !message;
    els.invoiceSaveNotice.textContent = message;
    els.invoiceSaveNotice.dataset.status = status;
  }
  let toast = document.getElementById("invoiceSaveToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "invoiceSaveToast";
    toast.className = "invoice-save-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.dataset.status = status;
  toast.hidden = !message;
  window.clearTimeout(showInvoiceSaveNotice.timeoutId);
  if (message && status !== "working") {
    showInvoiceSaveNotice.timeoutId = window.setTimeout(() => {
      toast.hidden = true;
    }, 5000);
  }
}

async function deleteSavedInvoice(invoiceId) {
  const invoice = state.invoices.find((item) => item.id === invoiceId);
  if (!invoice) return;
  const invoiceLabel = invoice.invoiceNumber || "this invoice";
  if (!window.confirm(`Delete ${invoiceLabel}? This action cannot be undone.`)) return;

  state.invoices = state.invoices.filter((item) => item.id !== invoiceId);
  if (state.current?.id === invoiceId) {
    delete state.current.id;
    delete state.current.savedAt;
    delete state.current.status;
  }
  renderSavedInvoices();
  renderClients();
  updateMetrics();
  try {
    await persist({ immediateCloud: true });
  } catch (error) {
    console.error("Invoice was deleted locally but cloud synchronization failed.", error);
  }
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
    await waitForInvoiceAssets(doc);
    const pages = Array.from(doc.querySelectorAll(":scope > .invoice-page"));
    const captureTargets = pages.length ? pages : [doc];
    const { jsPDF } = window.jspdf;
    const pdfFormat = state.current.templateId === "walmart" ? [935.04, 1210.08] : state.current.templateId === "zoro" ? "letter" : "a4";
    const exportPdfFormat = state.current.templateId === "unfi" ? "letter" : state.current.templateId === "sephorausa" ? "letter" : state.current.templateId === "perfumeunlimited" ? "letter" : state.current.templateId === "autodoc" ? "letter" : pdfFormat;
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: exportPdfFormat });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 0;
    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;
    const isPortonExport = state.current.templateId === "porton";
    const isVetUkExport = state.current.templateId === "vetuk";
    const isTwExport = state.current.templateId === "tw";
    const isAutodocExport = state.current.templateId === "autodoc";
    const isFixedA4Export = isPortonExport || isVetUkExport || isTwExport;
    const isWalmartExport = state.current.templateId === "walmart";
    const isHighResolutionExport = state.current.templateId === "qogitauk" || state.current.templateId === "perfumeunlimited" || isWalmartExport || isFixedA4Export || isAutodocExport;
    for (let index = 0; index < captureTargets.length; index += 1) {
      const target = captureTargets[index];
      const captureWidth = isAutodocExport ? 816 : isFixedA4Export ? 794 : target.scrollWidth;
      const captureHeight = target.scrollHeight;
      const canvas = await window.html2canvas(target, {
        backgroundColor: "#ffffff",
        scale: isHighResolutionExport ? 4 : 2,
        onclone: prepareInvoiceExportClone,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: captureWidth,
        height: captureHeight,
        windowWidth: Math.max(captureWidth, target.offsetWidth),
        windowHeight: Math.max(captureHeight, target.offsetHeight)
      });
      if (index > 0) pdf.addPage(exportPdfFormat, "portrait");
      const ratio = Math.min(maxWidth / canvas.width, maxHeight / canvas.height);
      const width = canvas.width * ratio;
      const height = canvas.height * ratio;
      const x = (pageWidth - width) / 2;
      const y = margin;
      const imageFormat = isHighResolutionExport ? "PNG" : "JPEG";
      const imageData = isHighResolutionExport ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg", 0.98);
      pdf.addImage(imageData, imageFormat, x, y, width, height);
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

async function downloadSingleBulkInvoice(groupIndex, button) {
  const invoices = buildBulkInvoices({ showErrors: true });
  const invoice = invoices[groupIndex];
  if (!invoice) return;
  const originalText = button?.textContent || "Download This Invoice";
  if (button) {
    button.disabled = true;
    button.textContent = "Preparing PDF...";
  }
  const previous = cloneInvoice(state.current);
  try {
    state.current = cloneInvoice(invoice);
    applyCurrentToForm();
    renderItems();
    renderPreview();
    await downloadCurrentInvoicePdf();
  } finally {
    state.current = previous;
    applyCurrentToForm();
    renderItems();
    renderPreview();
    if (button) {
      button.disabled = false;
      button.textContent = originalText;
    }
  }
}

async function downloadBulkInvoices(targetFiveMb) {
  const invoices = buildBulkInvoices({ showErrors: true });
  if (!invoices.length) return;
  const button = targetFiveMb ? els.bulkDownload5mb : els.bulkDownloadAll;
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = targetFiveMb ? "Preparing Under 5 MB PDF..." : "Preparing All Invoices...";
  const previous = cloneInvoice(state.current);
  try {
    await ensurePdfLibraries();
    const blob = await createCombinedBulkPdf(invoices, targetFiveMb ? 5 * 1024 * 1024 : 0);
    const template = getTemplate(invoices[0].templateId);
    downloadBlob(`${template.id}-bulk-invoices${targetFiveMb ? "-under-5mb" : ""}.pdf`, blob);
  } catch (error) {
    console.error("Bulk PDF download failed", error);
    window.alert("The bulk PDF could not be prepared. Please check the invoice fields and try again.");
  } finally {
    state.current = previous;
    applyCurrentToForm();
    renderItems();
    renderPreview();
    button.disabled = false;
    button.textContent = originalText;
  }
}

function getInvoicePdfFormat(templateId) {
  if (templateId === "walmart") return [935.04, 1210.08];
  if (["zoro", "unfi", "sephorausa", "perfumeunlimited", "autodoc"].includes(templateId)) return "letter";
  return "a4";
}

async function createCombinedBulkPdf(invoices, targetBytes = 0) {
  const compressionAttempts = targetBytes
    ? [{ scale: 1.35, quality: 0.62 }, { scale: 1, quality: 0.44 }, { scale: 0.75, quality: 0.28 }]
    : [{ scale: 2, quality: 0.94 }];
  let lastBlob = null;

  for (const settings of compressionAttempts) {
    const pdfFormat = getInvoicePdfFormat(invoices[0].templateId);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: pdfFormat, compress: true });
    let pageCount = 0;

    for (const invoice of invoices) {
      state.current = cloneInvoice(invoice);
      applyCurrentToForm();
      renderItems();
      renderPreview();
      const doc = els.invoicePreview.querySelector(".invoice-doc");
      if (!doc) continue;
      await waitForInvoiceAssets(doc);
      const targets = Array.from(doc.querySelectorAll(":scope > .invoice-page"));
      const captureTargets = targets.length ? targets : [doc];

      for (const target of captureTargets) {
        const captureWidth = invoice.templateId === "autodoc" ? 816 : ["porton", "vetuk", "tw"].includes(invoice.templateId) ? 794 : target.scrollWidth;
        const captureHeight = target.scrollHeight;
        const canvas = await window.html2canvas(target, {
          backgroundColor: "#ffffff",
          scale: settings.scale,
          onclone: prepareInvoiceExportClone,
          useCORS: true,
          allowTaint: true,
          logging: false,
          width: captureWidth,
          height: captureHeight,
          windowWidth: Math.max(captureWidth, target.offsetWidth),
          windowHeight: Math.max(captureHeight, target.offsetHeight)
        });
        if (pageCount > 0) pdf.addPage(pdfFormat, "portrait");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
        const width = canvas.width * ratio;
        const height = canvas.height * ratio;
        pdf.addImage(canvas.toDataURL("image/jpeg", settings.quality), "JPEG", (pageWidth - width) / 2, 0, width, height, undefined, "FAST");
        pageCount += 1;
      }
    }

    lastBlob = pdf.output("blob");
    if (!targetBytes || lastBlob.size <= targetBytes) return lastBlob;
  }

  if (targetBytes && lastBlob?.size > targetBytes) {
    throw new Error("The batch contains too many pages to fit below 5 MB. Download fewer invoices at one time.");
  }
  return lastBlob;
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
    await waitForInvoiceAssets(doc);
    const isAutodocExport = state.current.templateId === "autodoc";
    const isFixedA4Export = state.current.templateId === "porton" || state.current.templateId === "vetuk" || state.current.templateId === "tw";
    const captureWidth = isAutodocExport ? 816 : isFixedA4Export ? 794 : doc.scrollWidth;
    const captureHeight = doc.scrollHeight;
    const canvas = await window.html2canvas(doc, {
      backgroundColor: "#ffffff",
      scale: state.current.templateId === "qogitauk" || state.current.templateId === "perfumeunlimited" || isFixedA4Export || isAutodocExport ? 4 : 2,
      onclone: prepareInvoiceExportClone,
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: captureWidth,
      height: captureHeight,
      windowWidth: Math.max(captureWidth, doc.offsetWidth),
      windowHeight: Math.max(captureHeight, doc.offsetHeight)
    });
    const link = document.createElement("a");
    link.download = `${state.current.invoiceNumber || "invoice"}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", state.current.templateId === "qogitauk" || state.current.templateId === "perfumeunlimited" || isFixedA4Export || isAutodocExport ? 1 : 0.95);
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

function prepareInvoiceExportClone(clonedDocument) {
  const goSuppsInvoice = clonedDocument.querySelector(".gosupps-invoice");
  if (goSuppsInvoice) {
    goSuppsInvoice.dataset.exportRender = "true";
    const forceGoSuppsFont = (selector, family) => {
      goSuppsInvoice.querySelectorAll(selector).forEach((element) => {
        element.style.setProperty("font-family", family, "important");
        element.style.setProperty("font-synthesis", "none", "important");
      });
    };
    forceGoSuppsFont(
      ".gosupps-title h3, .gosupps-brand em, .gosupps-from h4, .gosupps-addresses h4, .gosupps-meta, .gosupps-meta span, .gosupps-table th, .gosupps-totals, .gosupps-total-label",
      '"Courier New", Courier, monospace'
    );
    forceGoSuppsFont(
      ".gosupps-from p, .gosupps-addresses p, .gosupps-meta strong, .gosupps-table td, .gosupps-totals strong, .gosupps-footer h4, .gosupps-footer p",
      '"GoSupps Template Arial", Arial, Helvetica, sans-serif'
    );
    goSuppsInvoice.querySelectorAll(".gosupps-from h4, .gosupps-from p, .gosupps-meta, .gosupps-meta span, .gosupps-meta strong, .gosupps-addresses h4, .gosupps-addresses p").forEach((element) => {
      element.style.setProperty("color", "#000000", "important");
      element.style.setProperty("-webkit-text-fill-color", "#000000", "important");
      element.style.setProperty("font-weight", "400", "important");
      element.style.setProperty("opacity", "1", "important");
    });
    goSuppsInvoice.querySelectorAll(".gosupps-from h4, .gosupps-addresses h4, .gosupps-meta span, .gosupps-table th").forEach((element) => {
      element.style.setProperty("font-weight", "700", "important");
    });
    goSuppsInvoice.querySelectorAll(".gosupps-total-label").forEach((element) => {
      element.style.setProperty("font-weight", "800", "important");
    });
    goSuppsInvoice.querySelectorAll(".gosupps-table th, .gosupps-table td, .gosupps-total-label, .gosupps-totals strong, .gosupps-footer h4, .gosupps-footer p").forEach((element) => {
      element.style.setProperty("color", "#000000", "important");
      element.style.setProperty("-webkit-text-fill-color", "#000000", "important");
      element.style.setProperty("opacity", "1", "important");
    });
    goSuppsInvoice.querySelectorAll(".gosupps-footer h4, .gosupps-footer p").forEach((element) => {
      element.style.setProperty("font-weight", "400", "important");
    });
    goSuppsInvoice.querySelectorAll(".gosupps-totals strong").forEach((element) => {
      element.style.setProperty("font-weight", "700", "important");
    });
  }
  const walmartInvoice = clonedDocument.querySelector(".walmart-invoice");
  if (walmartInvoice) {
    const forceWalmartStyle = (selector, declarations) => {
      walmartInvoice.querySelectorAll(selector).forEach((element) => {
        Object.entries(declarations).forEach(([property, value]) => {
          element.style.setProperty(property, value, "important");
        });
      });
    };
    forceWalmartStyle("*", {
      "font-family": '"Walmart Source Sans", "Walmart Everyday Sans", Arial, Helvetica, sans-serif',
      "font-synthesis": "none"
    });
    forceWalmartStyle(".walmart-print-header, .walmart-print-header span", {
      "font-family": "Arial, Helvetica, sans-serif",
      "font-weight": "400"
    });
    forceWalmartStyle("p, span, del, td, .walmart-summary strong", { "font-weight": "400" });
    forceWalmartStyle(".walmart-buyer > strong, .walmart-buyer p, .walmart-buyer p > span, .walmart-summary, .walmart-summary strong, .walmart-barcode-block > span", {
      "color": "#2e2f32",
      "-webkit-text-fill-color": "#2e2f32",
      "letter-spacing": "0"
    });
    forceWalmartStyle(".walmart-buyer p, .walmart-buyer p > span", { "font-size": "14px", "font-weight": "400", "line-height": "21px" });
    forceWalmartStyle(".walmart-items", { "height": "auto", "min-height": "252px" });
    forceWalmartStyle(".walmart-items tbody", { "display": "block" });
    forceWalmartStyle(".walmart-items tr", { "display": "table", "width": "100%", "table-layout": "fixed" });
    forceWalmartStyle(".walmart-items td", { "font-size": "12px", "font-weight": "400" });
    forceWalmartStyle(".walmart-items td:last-child", { "font-size": "14px" });
    forceWalmartStyle(".walmart-delivery span", { "color": "#0053e2", "-webkit-text-fill-color": "#0053e2", "font-size": "14px", "font-weight": "700" });
    forceWalmartStyle(".walmart-tax, .walmart-tip, .walmart-delivery del, .walmart-barcode-block > span", { "font-size": "14px" });
    forceWalmartStyle(".walmart-subtotal", { "font-size": "18px" });
    forceWalmartStyle(".walmart-total", { "font-size": "24px" });
    forceWalmartStyle(".walmart-wordmark > strong, .walmart-document-title, .walmart-order-details h2, .walmart-order-details h3, .walmart-buyer > strong, .walmart-delivery > span, .walmart-subtotal > span, .walmart-subtotal > strong, .walmart-tip > span, .walmart-tip > strong, .walmart-total > span, .walmart-total > strong", { "font-weight": "700" });
  }
  const autodocInvoice = clonedDocument.querySelector(".autodoc-invoice");
  if (autodocInvoice) autodocInvoice.dataset.exportRender = "true";
  const perfumeInvoice = clonedDocument.querySelector(".perfume-unlimited-invoice");
  if (perfumeInvoice) perfumeInvoice.dataset.exportRender = "true";
  const vetUkInvoice = clonedDocument.querySelector(".vetuk-invoice");
  if (vetUkInvoice) vetUkInvoice.dataset.exportRender = "true";
  const twInvoice = clonedDocument.querySelector(".tw-invoice");
  if (twInvoice) {
    twInvoice.dataset.exportRender = "true";
    const forceStyle = (selector, declarations) => {
      twInvoice.querySelectorAll(selector).forEach((element) => {
        Object.entries(declarations).forEach(([property, value]) => {
          element.style.setProperty(property, value, "important");
        });
      });
    };
    forceStyle("*", {
      "font-family": '"TW Roboto", Roboto, Arial, Helvetica, sans-serif',
      "font-synthesis": "none"
    });
    forceStyle(".tw-company-line address, .tw-company-line address strong, .tw-parties h2, .tw-parties strong, .tw-parties p, .tw-payment h2, .tw-payment p, .tw-terms h2, .tw-terms p", {
      color: "#343a40",
      "-webkit-text-fill-color": "#343a40",
      opacity: "1"
    });
    forceStyle(".tw-payment h2, .tw-terms h2", {
      color: "#495057",
      "-webkit-text-fill-color": "#495057"
    });
    forceStyle(".tw-company-line address, .tw-parties h2, .tw-parties p, .tw-payment p, .tw-terms p", {
      "font-weight": "400"
    });
    forceStyle(".tw-company-line address strong, .tw-parties strong, .tw-payment h2, .tw-terms h2", {
      "font-weight": "700"
    });
    forceStyle(".tw-products", {
      "border-collapse": "collapse",
      "border-spacing": "0"
    });
    forceStyle(".tw-products thead, .tw-products thead tr", {
      background: "#173b6d"
    });
    forceStyle(".tw-products th", {
      background: "transparent",
      border: "0",
      outline: "0",
      "box-shadow": "none"
    });
    forceStyle(".tw-products td", {
      "position": "relative",
      "border-bottom": "1px solid #c6c9cc",
      "color": "#212529",
      "-webkit-text-fill-color": "#212529",
      "background": "#ffffff"
    });
  }
  const costcoUkInvoice = clonedDocument.querySelector(".costco-uk-invoice");
  if (costcoUkInvoice) {
    costcoUkInvoice.querySelectorAll(".costco-payment-line").forEach((element) => {
      element.style.setProperty("display", "grid", "important");
      element.style.setProperty("grid-template-columns", "34px minmax(0, 1fr)", "important");
      element.style.setProperty("column-gap", "5px", "important");
      element.style.setProperty("padding-left", "0", "important");
    });
    costcoUkInvoice.querySelectorAll(".costco-card-mark").forEach((element) => {
      element.style.setProperty("position", "relative", "important");
      element.style.setProperty("inset", "auto", "important");
    });
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

async function waitForInvoiceAssets(root) {
  if (root?.classList?.contains("walmart-invoice") && document.fonts?.load) {
    await Promise.all([
      document.fonts.load('400 16px "Walmart Source Sans"'),
      document.fonts.load('700 16px "Walmart Source Sans"')
    ]);
  }
  if (root?.classList?.contains("gosupps-invoice") && document.fonts?.load) {
    await Promise.all([
      document.fonts.load('400 16px "GoSupps Template Arial"'),
      document.fonts.load('700 16px "GoSupps Template Arial"'),
      document.fonts.load('400 16px "Courier New"')
    ]);
  }
  if (root?.classList?.contains("tw-invoice") && document.fonts?.load) {
    await Promise.all([
      document.fonts.load('400 16px "TW Roboto"'),
      document.fonts.load('700 16px "TW Roboto"')
    ]);
  }
  if (document.fonts?.ready) await document.fonts.ready;
  await waitForImages(root);
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
  state.bulkInvoiceGroups = [];
  state.templateAssets = {};
  seedDefaultInvoice(true);
  renderItems();
  renderPreview();
  renderTemplateAssetPreview();
  renderClients();
  renderSavedInvoices();
  renderBulkRows();
  renderBulkInvoiceForms();
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

function formatClientCardPayment(cardType, cardEnding) {
  const type = String(cardType || "").trim();
  const ending = String(cardEnding || "").replace(/\D/g, "").slice(-4);
  if (type && ending) return `${type} Ending in ${ending}`;
  return type;
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
  els.bulkTemplateSelect.disabled = !bulkReady;
  if (els.downloadSampleCsv) els.downloadSampleCsv.disabled = !bulkReady;
  if (els.bulkTemplateHint && !bulkReady) {
    els.bulkTemplateHint.textContent = "Select a client to unlock the template and its CSV format.";
  }
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
  if (state.current.templateId === "gosupps") {
    state.current.paymentMethod = formatClientCardPayment(client.cardType, client.cardEnding);
  }
}

function handleBuilderClientSelect(clientId, targetView) {
  if (!clientId) {
    state.current.clientId = "";
    if (targetView === "bulk") clearBulkInvoiceGroups();
    renderClientWorkflowSelectors();
    updateBuilderTemplateLocks();
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
  if (templateId === "salonsupplies" || templateId === "petshop") state.current.currency = "GBP";
  if (templateId === "dallaswholesale") state.current.currency = "$";
  els.pcsBooksFields.hidden = templateId !== "pcsbooks";
  els.costcoUkFields.hidden = templateId !== "costcouk";
  els.qogitaFields.hidden = templateId !== "qogitauk";
  els.zoroFields.hidden = templateId !== "zoro";
  els.clearanceKingFields.hidden = templateId !== "clearanceking";
  els.sunskyFields.hidden = templateId !== "sunsky";
  els.justmaeFields.hidden = templateId !== "justmae";
  els.jellycatFields.hidden = templateId !== "jellycat";
  els.bestwayFields.hidden = templateId !== "bestway";
  els.paperstoneFields.hidden = templateId !== "paperstone";
  els.sephoraUsaFields.hidden = templateId !== "sephorausa";
  els.perfumeUnlimitedFields.hidden = templateId !== "perfumeunlimited";
  els.portonFields.hidden = templateId !== "porton";
  els.bobMartinFields.hidden = templateId !== "bobmartin";
  els.abwFields.hidden = templateId !== "abw";
  els.ryzeFields.hidden = templateId !== "ryze";
  els.mastertradeFields.hidden = templateId !== "mastertrade";
  els.unfiFields.hidden = templateId !== "unfi";
  els.walmartFields.hidden = templateId !== "walmart";
  els.abenaFields.hidden = templateId !== "abena";
  els.salonSuppliesFields.hidden = templateId !== "salonsupplies";
  els.dallasFields.hidden = templateId !== "dallaswholesale";
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
  if (!els.bulkCardType) return;
  els.bulkCardType.value = state.current.cardType || "Visa";
  els.bulkCardLast4.value = state.current.cardEnding || "";
  const client = state.clients.find((item) => item.id === state.current.clientId);
  els.bulkCardExpiry.value = client?.cardExpiry || els.bulkCardExpiry.value || "";
  const template = getTemplate(els.bulkTemplateSelect?.value || state.current.templateId);
  if (els.bulkTemplateHint) {
    els.bulkTemplateHint.textContent = els.bulkClientSelect?.value
      ? `This bulk CSV is for ${template.name} only. Product rows will use this invoice format.`
      : "Select a client to unlock the template and its CSV format.";
  }
}

function syncBulkDetailsToCurrent() {
  if (!els.bulkCardType) return;
  state.current.templateId = els.bulkTemplateSelect.value || state.current.templateId;
  state.current.cardType = els.bulkCardType.value || state.current.cardType;
  state.current.cardEnding = els.bulkCardLast4.value.replace(/\D/g, "").slice(0, 4);
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
          <span role="columnheader">Created in</span>
          <span role="columnheader">Date</span>
          <span role="columnheader">Total</span>
          <span role="columnheader">Actions</span>
        </div>
        ${invoices
          .map((invoice) => {
            const invoiceDate = invoice.orderDate
              ? formatDisplayDate(invoice.orderDate)
              : formatDateTime(invoice.savedAt);
            const invoiceSource = invoice.savedSource === "bulk-generator" || String(invoice.id || "").startsWith("bulk-")
              ? "Bulk Invoice Generator"
              : "Invoice Builder";
            return `
              <div class="saved-invoice-row" role="row">
                <strong role="cell">${escapeHtml(invoice.invoiceNumber || "Draft invoice")}</strong>
                <span role="cell"><b class="saved-template-pill">${escapeHtml(getTemplate(invoice.templateId).name)}</b></span>
                <span role="cell"><b class="saved-source-pill ${invoiceSource === "Bulk Invoice Generator" ? "is-bulk" : "is-builder"}">${escapeHtml(invoiceSource)}</b></span>
                <span role="cell">${invoiceDate}</span>
                <strong role="cell">${money(calculateTotals(invoice).total, invoice.currency)}</strong>
                <span class="saved-row-actions" role="cell">
                  <button type="button" data-load-invoice="${escapeHtml(invoice.id)}">Edit invoice</button>
                  <button class="is-primary" type="button" data-download-saved="${escapeHtml(invoice.id)}">Download</button>
                  <button class="is-danger" type="button" data-delete-invoice="${escapeHtml(invoice.id)}">Delete</button>
                </span>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  };

  els.savedGrid.innerHTML = `
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
      state.current.savedSource = invoice.savedSource || (String(invoice.id || "").startsWith("bulk-") ? "bulk-generator" : "invoice-builder");
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

  els.savedGrid.querySelectorAll("[data-delete-invoice]").forEach((button) => {
    button.addEventListener("click", () => void deleteSavedInvoice(button.dataset.deleteInvoice));
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

function getBulkInvoiceFieldDefinitions(templateId) {
  if (templateId === "walmart") {
    return [
      { key: "walmartPrintDateTime", label: "Invoice Date & Time", type: "text", placeholder: "8/28/26, 5:33 AM", required: true },
      { key: "orderDate", label: "Order Date", type: "date", required: true },
      { key: "invoiceNumber", label: "Order Number", type: "text", required: true },
      { key: "taxRate", label: "Tax (%)", type: "number", min: "0", step: "0.01", required: true },
      { key: "walmartDriverTip", label: "Driver Tip", type: "number", min: "0", step: "0.01", required: true }
    ];
  }

  const fields = [
    { key: "invoiceNumber", label: "Invoice Number", type: "text", required: true },
    { key: "orderDate", label: "Invoice Date", type: "date", required: true },
    { key: "taxRate", label: "Tax (%)", type: "number", min: "0", step: "0.01", required: true }
  ];
  if (templateOptionalFields.deliveryDateField.has(templateId)) fields.splice(2, 0, { key: "deliveryDate", label: "Delivery Date", type: "date", required: true });
  if (templateOptionalFields.orderIdField.has(templateId)) fields.push({ key: "orderId", label: "Order Number", type: "text", required: false });
  if (templateOptionalFields.poNumberField.has(templateId)) fields.push({ key: "poNumber", label: "PO Number", type: "text", required: false });
  if (templateOptionalFields.shippingAmountField.has(templateId)) fields.push({ key: "shippingAmount", label: "Shipping / Freight", type: "number", min: "0", step: "0.01", required: true });
  return fields;
}

function createBulkInvoiceMeta(index) {
  const template = getTemplate(els.bulkTemplateSelect?.value || state.current.templateId);
  const baseNumber = String(state.current.invoiceNumber || `${template.initials}-BULK`).trim();
  const invoiceNumber = index === 0 ? baseNumber : `${baseNumber}-${index + 1}`;
  return {
    invoiceNumber,
    orderDate: state.current.orderDate || formatDate(new Date()),
    deliveryDate: state.current.deliveryDate || state.current.orderDate || formatDate(new Date()),
    orderId: index === 0 ? String(state.current.orderId || "") : "",
    poNumber: index === 0 ? String(state.current.poNumber || "") : "",
    taxRate: Number(state.current.taxRate || 0),
    shippingAmount: Number(state.current.shippingAmount || 0),
    walmartPrintDateTime: state.current.walmartPrintDateTime || `${formatWalmartPrintDate(state.current.deliveryDate || state.current.orderDate)}, 5:33 AM`,
    walmartDriverTip: Number(state.current.walmartDriverTip || 0)
  };
}

function clearBulkInvoiceGroups() {
  state.bulkRows = [];
  state.bulkInvoiceGroups = [];
  if (els.csvUpload) els.csvUpload.value = "";
  if (els.csvFileName) els.csvFileName.textContent = "Use 4 to 13 blank rows between invoices. No file selected.";
  if (els.bulkBatchFieldGrid) {
    els.bulkBatchFieldGrid.innerHTML = "";
    delete els.bulkBatchFieldGrid.dataset.signature;
  }
  renderBulkRows();
  renderBulkInvoiceForms();
  persist();
}

function renderBulkInvoiceForms() {
  if (!els.bulkInvoiceSetup || !els.bulkInvoiceForms) return;
  const groups = state.bulkInvoiceGroups || [];
  els.bulkInvoiceSetup.hidden = groups.length === 0;
  els.generateBulk.disabled = groups.length === 0;
  if (!groups.length) {
    els.bulkInvoiceForms.innerHTML = "";
    renderBulkBatchFields();
    return;
  }

  const templateId = els.bulkTemplateSelect?.value || state.current.templateId;
  const fields = getBulkInvoiceFieldDefinitions(templateId);
  els.bulkInvoiceSetupSummary.textContent = `${groups.length} invoice(s) detected. Complete the ${getTemplate(templateId).name} fields below, then download one invoice or the complete batch.`;
  els.bulkInvoiceForms.innerHTML = groups.map((group, groupIndex) => `
    <article class="bulk-invoice-card" data-bulk-invoice-card="${groupIndex}">
      <header class="bulk-invoice-card-header">
        <div><strong>Invoice ${groupIndex + 1}</strong><small>${group.rows.length} product line${group.rows.length === 1 ? "" : "s"}</small></div>
        <button class="btn ghost" type="button" data-download-bulk-invoice="${groupIndex}"><i data-lucide="download" aria-hidden="true"></i> Download This Invoice</button>
      </header>
      <div class="bulk-invoice-fields">
        ${fields.map((field) => {
          const value = group.meta?.[field.key] ?? "";
          return `<label>${escapeHtml(field.label)}${field.required ? " *" : ""}<input data-bulk-group="${groupIndex}" data-bulk-field="${escapeHtml(field.key)}" type="${field.type}" value="${escapeHtml(value)}"${field.placeholder ? ` placeholder="${escapeHtml(field.placeholder)}"` : ""}${field.min !== undefined ? ` min="${field.min}"` : ""}${field.step ? ` step="${field.step}"` : ""}${field.required ? " required" : ""} /></label>`;
        }).join("")}
      </div>
    </article>
  `).join("");
  renderBulkBatchFields();
  window.lucide?.createIcons({ attrs: { "aria-hidden": "true" } });
}

function renderBulkBatchFields() {
  if (!els.bulkBatchFields || !els.bulkBatchFieldGrid) return;
  const groups = state.bulkInvoiceGroups || [];
  els.bulkBatchFields.hidden = groups.length === 0;
  if (!groups.length) {
    els.bulkBatchFieldGrid.innerHTML = "";
    delete els.bulkBatchFieldGrid.dataset.signature;
    return;
  }
  const templateId = els.bulkTemplateSelect?.value || state.current.templateId;
  const fields = getBulkInvoiceFieldDefinitions(templateId);
  const signature = `${templateId}:${groups.length}`;
  if (els.bulkBatchFieldGrid.dataset.signature === signature && els.bulkBatchFieldGrid.children.length) return;
  els.bulkBatchFieldGrid.dataset.signature = signature;
  els.bulkBatchFieldGrid.innerHTML = fields.map((field) => `
    <article class="bulk-batch-field-card">
      <label for="bulk-list-${escapeHtml(field.key)}">Paste ${escapeHtml(field.label.toLowerCase())} list</label>
      <textarea id="bulk-list-${escapeHtml(field.key)}" data-bulk-list-field="${escapeHtml(field.key)}" rows="6" placeholder="One value per invoice line"></textarea>
      <button class="btn ghost" type="button" data-apply-bulk-list="${escapeHtml(field.key)}">Apply</button>
    </article>
  `).join("");
}

function normalizeBulkListValue(field, value) {
  const text = String(value || "").trim();
  if (field.type === "number") return Number(text || 0);
  if (field.type !== "date" || /^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const namedMonths = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
  let match = text.match(/^(\d{1,2})[-\s]([A-Za-z]{3,9})[-\s](\d{4})$/);
  if (match) {
    const month = namedMonths[match[2].slice(0, 3).toLowerCase()];
    if (month) return `${match[3]}-${String(month).padStart(2, "0")}-${String(match[1]).padStart(2, "0")}`;
  }
  match = text.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (match) return `${match[3]}-${String(match[1]).padStart(2, "0")}-${String(match[2]).padStart(2, "0")}`;
  return text;
}

function applyBulkFieldList(fieldKey, { quiet = false } = {}) {
  const input = els.bulkBatchFieldGrid?.querySelector(`[data-bulk-list-field="${fieldKey}"]`);
  const field = getBulkInvoiceFieldDefinitions(els.bulkTemplateSelect.value || state.current.templateId).find((item) => item.key === fieldKey);
  if (!input || !field) return 0;
  const values = input.value.replace(/\r/g, "").split("\n");
  let applied = 0;
  values.slice(0, state.bulkInvoiceGroups.length).forEach((value, index) => {
    if (!String(value).trim()) return;
    state.bulkInvoiceGroups[index].meta[fieldKey] = normalizeBulkListValue(field, value);
    applied += 1;
  });
  renderBulkInvoiceForms();
  persist();
  if (!quiet) {
    const button = els.bulkBatchFieldGrid.querySelector(`[data-apply-bulk-list="${fieldKey}"]`);
    if (button) {
      const original = button.textContent;
      button.textContent = applied ? `Applied to ${applied}` : "No values found";
      setTimeout(() => { button.textContent = original; }, 1400);
    }
  }
  return applied;
}

function applyAllBulkFieldLists() {
  const fields = getBulkInvoiceFieldDefinitions(els.bulkTemplateSelect.value || state.current.templateId);
  const applied = fields.reduce((total, field) => total + applyBulkFieldList(field.key, { quiet: true }), 0);
  const original = els.bulkApplyAllLists.textContent;
  els.bulkApplyAllLists.textContent = applied ? `${applied} values applied` : "Paste values before applying";
  setTimeout(() => { els.bulkApplyAllLists.textContent = original; }, 1600);
}

function handleBulkInvoiceFieldInput(event) {
  const input = event.target.closest("[data-bulk-group][data-bulk-field]");
  if (!input) return;
  const group = state.bulkInvoiceGroups[Number(input.dataset.bulkGroup)];
  if (!group) return;
  const numericFields = new Set(["taxRate", "shippingAmount", "walmartDriverTip"]);
  group.meta[input.dataset.bulkField] = numericFields.has(input.dataset.bulkField) ? Number(input.value || 0) : input.value;
  input.setAttribute("aria-invalid", String(input.required && !String(input.value).trim()));
  persist();
}

function validateBulkInvoiceGroups(showErrors = false) {
  if (!state.bulkInvoiceGroups?.length || !els.bulkClientSelect.value) return false;
  const fields = getBulkInvoiceFieldDefinitions(els.bulkTemplateSelect.value || state.current.templateId);
  let valid = true;
  state.bulkInvoiceGroups.forEach((group, groupIndex) => {
    fields.forEach((field) => {
      if (!field.required) return;
      const value = group.meta?.[field.key];
      const missing = value === undefined || value === null || String(value).trim() === "";
      if (missing) valid = false;
      if (showErrors) {
        els.bulkInvoiceForms.querySelector(`[data-bulk-group="${groupIndex}"][data-bulk-field="${field.key}"]`)?.setAttribute("aria-invalid", String(missing));
      }
    });
  });
  if (!valid && showErrors) window.alert("Complete every required invoice field marked with * before continuing.");
  return valid;
}

function bulkRowToItem(row) {
  return {
    sku: row.sku || row.SKU || "",
    product: row.product || row.products || row.Product || row.Products || "",
    brand: row.brand || row.Brand || row.BRAND || "",
    description: row.description || row.Description || "",
    qty: Number(row.qty || row.quantity || row.Qty || 1),
    pack: Math.max(1, Number(row.pack || row.Pack || 1)),
    vatCode: row.vatCode || row.vat || row.VAT || "S",
    listPrice: Number(row.listPrice || row.listprice || row["list price"] || row.unit || row["Unit Price"] || row.price || 0),
    unit: Number(row.unit || row.unitPrice || row["Unit Price"] || row.price || row.Price || 0)
  };
}

function buildBulkInvoices({ showErrors = false } = {}) {
  if (!validateBulkInvoiceGroups(showErrors)) return [];
  syncBulkDetailsToCurrent();
  const client = state.clients.find((item) => item.id === els.bulkClientSelect.value);
  if (!client) {
    if (showErrors) window.alert("Select a saved client before continuing.");
    return [];
  }
  applyClientToCurrent(client);
  state.current.templateId = els.bulkTemplateSelect.value || state.current.templateId;
  return state.bulkInvoiceGroups.map((group, index) => {
    const invoice = cloneInvoice(state.current);
    Object.assign(invoice, group.meta || {});
    invoice.id = `bulk-${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`;
    invoice.items = group.rows.map(bulkRowToItem);
    invoice.savedSource = "bulk-generator";
    invoice.savedAt = new Date().toISOString();
    return invoice;
  });
}

function handleCsvUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (!els.bulkClientSelect.value) {
    window.alert("Select a client before uploading the bulk CSV.");
    event.target.value = "";
    return;
  }
  els.csvFileName.textContent = file.name;
  const reader = new FileReader();
  reader.onload = () => {
    const groups = parseCsvInvoiceGroups(String(reader.result || ""));
    if (!groups.length) {
      state.bulkRows = [];
      state.bulkInvoiceGroups = [];
      els.csvFileName.textContent = `${file.name} - no product rows found`;
      renderBulkRows();
      renderBulkInvoiceForms();
      persist();
      return;
    }
    state.bulkInvoiceGroups = groups.map((rows, index) => ({
      id: `bulk-group-${Date.now()}-${index}`,
      rows,
      meta: createBulkInvoiceMeta(index)
    }));
    if (els.bulkBatchFieldGrid) {
      els.bulkBatchFieldGrid.innerHTML = "";
      delete els.bulkBatchFieldGrid.dataset.signature;
    }
    state.bulkRows = groups.flatMap((rows, groupIndex) => rows.map((row) => ({ ...row, __groupIndex: groupIndex })));
    renderBulkRows();
    renderBulkInvoiceForms();
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
      brand: row.brand || row.Brand || row.BRAND || "",
      description: row.description || row.Description || "",
      qty: Number(row.qty || row.quantity || row.Qty || 1),
      pack: Math.max(1, Number(row.pack || row.Pack || 1)),
      vatCode: row.vatCode || row.vat || row.VAT || "S",
      listPrice: Number(row.listPrice || row.listprice || row["list price"] || row.unit || row.price || row.Price || 0),
      unit: Number(row.unit || row.unitPrice || row["Unit Price"] || row.price || row.Price || 0)
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
    const schema = getTemplateCsvSchema(els.bulkTemplateSelect?.value || state.current.templateId);
    els.bulkRowsHead.innerHTML = `<tr>${schema.headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>`;
    els.bulkRows.innerHTML = `<tr><td colspan="${schema.headers.length}">Upload a CSV file to preview product rows.</td></tr>`;
    if (els.bulkRowSummary) els.bulkRowSummary.textContent = "Upload a CSV to begin.";
    els.generateBulk.disabled = true;
    updateMetrics();
    return;
  }

  const schema = getTemplateCsvSchema(els.bulkTemplateSelect?.value || state.current.templateId);
  els.bulkRowsHead.innerHTML = `<tr>${schema.headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>`;
  let previousGroup = -1;
  els.bulkRows.innerHTML = state.bulkRows.map((row) => {
    const groupIndex = Number(row.__groupIndex || 0);
    const divider = groupIndex !== previousGroup
      ? `<tr class="bulk-group-divider"><td colspan="${schema.headers.length}">Invoice ${groupIndex + 1}</td></tr>`
      : "";
    previousGroup = groupIndex;
    return `${divider}<tr>${schema.headers.map((header) => `<td>${escapeHtml(readCsvRowValue(row, header))}</td>`).join("")}</tr>`;
  }).join("");
  if (els.bulkRowSummary) {
    els.bulkRowSummary.textContent = `${state.bulkInvoiceGroups.length} invoice(s) detected from ${state.bulkRows.length} product row(s). Complete the required fields below.`;
  }
  els.generateBulk.disabled = false;
  updateMetrics();
}

async function generateBulkInvoices() {
  const invoices = buildBulkInvoices({ showErrors: true });
  if (!invoices.length) return;
  state.invoices.unshift(...invoices);

  renderSavedInvoices();
  renderClients();
  updateMetrics();
  showView("saved");
  try {
    await persist({ immediateCloud: true });
  } catch (error) {
    console.error("Bulk invoices were saved locally but cloud synchronization failed.", error);
  }
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
  const exampleTwo = row.map((value, index) => index === 0 ? `${value} - Invoice 2` : value);
  const csvRows = includeBulkColumns
    ? [headers, row, row, "", "", "", "", exampleTwo, exampleTwo]
    : [headers, row];
  const csv = csvRows.map((values) => Array.isArray(values) ? values.map(csvCell).join(",") : values).join("\n");
  downloadText(`${template.id}-sample-products.csv`, csv, "text/csv");
}

function parseCsv(text) {
  return parseCsvInvoiceGroups(text).flat();
}

function parseCsvInvoiceGroups(text) {
  const lines = String(text || "").replace(/\r/g, "").split("\n");
  const headerIndex = lines.findIndex((line) => line.trim());
  if (headerIndex < 0) return [];
  const headers = splitCsvLine(lines[headerIndex]).map((header) => header.trim());
  const normalizedHeaders = headers.map(normalizeCsvHeader);
  const groups = [];
  let currentGroup = [];

  lines.slice(headerIndex + 1).forEach((line) => {
    const values = splitCsvLine(line);
    const isBlank = !line.trim() || values.every((value) => !String(value).trim());
    if (isBlank) {
      if (currentGroup.length) {
        groups.push(currentGroup);
        currentGroup = [];
      }
      return;
    }
    const normalizedValues = values.map((value) => normalizeCsvHeader(value));
    if (normalizedValues.length === normalizedHeaders.length && normalizedValues.every((value, index) => value === normalizedHeaders[index])) return;
    currentGroup.push(createCsvRow(headers, values));
  });
  if (currentGroup.length) groups.push(currentGroup);
  return groups;
}

function normalizeCsvHeader(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function createCsvRow(headers, values) {
  const row = {};
  headers.forEach((header, index) => {
    row[header] = values[index] ? values[index].trim() : "";
  });
  headers.forEach((header) => {
    const normalizedHeader = normalizeCsvHeader(header);
    if (normalizedHeader === "description" && row.description === undefined) row.description = row[header];
    if ((normalizedHeader === "qty" || normalizedHeader === "quantity") && row.qty === undefined) row.qty = row[header];
    if ((normalizedHeader === "unit" || normalizedHeader === "unitprice" || normalizedHeader === "price") && row.unit === undefined) row.unit = row[header];
    if (normalizedHeader === "sku" && row.sku === undefined) row.sku = row[header];
    if ((normalizedHeader === "product" || normalizedHeader === "products") && row.product === undefined) row.product = row[header];
  });
  return row;
}

function readCsvRowValue(row, header) {
  if (Object.prototype.hasOwnProperty.call(row, header)) return row[header];
  const normalized = normalizeCsvHeader(header);
  if (normalized === "unitprice") return row.unit || "";
  return row[normalized] || "";
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
  const requestedView = document.getElementById(id);
  if (!requestedView || requestedView.hidden) return;
  const titles = {
    dashboard: "Dashboard",
    clients: "Clients",
    single: "Invoice Builder",
    bulk: "Bulk Invoice Generator",
    saved: "Saved Invoices",
    templates: "CSV Import",
    "auto-data-cleaning": "Data Cleaning",
    "data-cleaning": "Manual Data Cleaning",
    "meta-remover": "Meta Remover",
    "pdf-compressor": "PDF Compressor",
    admin: "Admin Control Panel"
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
  const vatInclusive = invoice.templateId === "jellycat" || invoice.templateId === "scrubdaddy" || invoice.templateId === "paperstone" || invoice.templateId === "porton";
  const taxBase = invoice.templateId === "justmae" || invoice.templateId === "abena" || invoice.templateId === "petshop" ? netAmount + shipping
    : invoice.templateId === "clearanceking"
      ? netAmount + shipping
      : vatInclusive
        ? netAmount + shipping
        : netAmount;
  const tax = vatInclusive ? taxBase * (taxRate / (100 + taxRate || 1)) : taxBase * (taxRate / 100);
  const templateFee = invoice.templateId === "justmae" ? Number(invoice.justmaePaypalFee || 0) : 0;
  const walmartDriverTip = invoice.templateId === "walmart" ? Math.max(0, Number(invoice.walmartDriverTip || 0)) : 0;
  return {
    subtotal,
    discount,
    tax,
    shipping,
    total: netAmount + shipping + templateFee + walmartDriverTip + (vatInclusive ? 0 : tax)
  };
}

function formatWalmartDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return escapeHtml(value);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatWalmartPrintDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return escapeHtml(value);
  return date.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" });
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
