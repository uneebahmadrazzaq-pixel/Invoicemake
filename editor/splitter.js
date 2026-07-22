(function () {
  "use strict";

  const Core = window.SplitterCore;
  if (!Core) throw new Error("Splitter calculation core is unavailable.");
  const REQUIRED_FIELDS = ["supplier", "title", "variation", "available", "startPrice", "sold", "startDate"];
  const REQUIRED_SOURCE_FIELDS = ["supplier", "title", "available", "startPrice", "sold", "startDate"];
  const FIELD_LABELS = {
    supplier: "Supplier Name",
    title: "Title",
    variation: "Variation (optional)",
    available: "Available Quantity",
    startPrice: "Start Price",
    sold: "Sold Quantity",
    startDate: "Start Date"
  };
  const HEADER_ALIASES = {
    supplier: ["supplier", "supplier name"],
    title: ["title", "product title", "listing title"],
    variation: ["variation", "variation details", "variant", "option"],
    available: ["available quantity", "available qty", "quantity available"],
    startPrice: ["start price", "selling price", "listing price"],
    sold: ["sold quantity", "sold qty", "quantity sold"],
    startDate: ["start date", "listing date", "date listed"]
  };
  const PROJECTS_KEY = "mc011-data-splitter-projects-v1";
  const PROFILE_OVERRIDES_KEY = "mc011-supplier-profile-overrides-v1";
  const SAMPLE_DATA = `Supplier\tTitle\tVariation\tAvailable Quantity\tStart Price\tSold Quantity\tStart Date
Chinese\tSelf Adhesive Wall Hooks Heavy Duty Stick On Door Hanger Sticky Home Decor UK Stock\t1 PCS\t14\t1.95\t9\tMar-19-26 04:45:04 PDT
Chinese\tSelf Adhesive Wall Hooks Heavy Duty Stick On Door Hanger Sticky Home Decor UK Stock\t2 PCS\t9\t2.77\t24\tMar-19-26 04:45:04 PDT
Chinese\tSelf Adhesive Wall Hooks Heavy Duty Stick On Door Hanger Sticky Home Decor UK Stock\t4 PCS\t16\t1.99\t3\tMar-19-26 04:45:04 PDT
Chinese\tSelf Adhesive Wall Hooks Heavy Duty Stick On Door Hanger Sticky Home Decor UK Stock\t6 PCS\t17\t2.84\t2\tMar-19-26 04:45:04 PDT
Chinese\tQuick Release Pressure Washer Gun Adapter For Karcher K2-K7 To 1/4 Quick Connect\tA\t1\t0.99\t0\tMar-19-26 04:45:04 PDT
Chinese\tQuick Release Pressure Washer Gun Adapter For Karcher K2-K7 To 1/4 Quick Connect\tB\t13\t1.59\t5\tMar-19-26 05:05:38 PDT
Chinese\t1M 30-Pin USB Charging Cable for Apple iPhone 4 4S 3G 3GS iPad iPod UK Fast Shipping\tBlack\t7\t1.72\t7\tMar-26-26 06:39:02 PDT
Chinese\tUPINS 20 Pcs Flat Paint Brushes Small Brush Bulk for Detail Painting Free Delivery\t\t0\t3.3\t7\tApr-04-26 22:58:12 PDT`;

  const app = {
    sourceName: "",
    matrix: [],
    headers: [],
    mapping: {},
    rows: [],
    invalidRows: [],
    invoices: [],
    history: [],
    selected: new Set(),
    validation: null,
    profileOverrides: readProfileOverrides(),
    shippingRules: JSON.parse(JSON.stringify(Core.defaultShippingRules)),
    template: null,
    templateMappings: {},
    invoiceNumberSeed: [],
    selectedTitleRows: new Set(),
    automaticDateStart: "",
    automaticDateEnd: ""
  };
  const ui = {};

  document.addEventListener("DOMContentLoaded", initSplitter);

  function initSplitter() {
    [
      "splitterFile", "splitterFileName", "splitterPaste", "splitterReadPaste", "splitterLoadSample",
      "splitterInputStatus", "splitterMappingPanel", "splitterMapping", "splitterDetectedRows",
      "splitterMinRows", "splitterMaxRows", "splitterSort", "splitterDateFormat", "splitterAdvanced",
      "splitterInvoiceColumn", "splitterInvoiceStart", "splitterInvoicePrefix", "splitterInvoiceSuffix",
      "splitterAudit", "splitterTrailingRows", "splitterProcess", "splitterRegeneratePrices",
      "splitterRegenerateQty", "splitterRegroup", "splitterReset", "splitterErrorsPanel", "splitterErrors",
      "splitterResultsSection", "splitterValidation", "splitterInvoices", "splitterReviewMessage",
      "splitterMoveDestination", "splitterMoveRows", "splitterUndo", "splitterDownloadExcel",
      "splitterDownloadCsv", "splitterCopy", "splitterProjectName", "splitterProjectList",
      "splitterSaveProject", "splitterLoadProject", "splitterDeleteProject"
    ].forEach((id) => { ui[id] = document.getElementById(id); });
    document.querySelectorAll('[id^="splitter"]').forEach((element) => { ui[element.id] = element; });

    if (!ui.splitterFile) return;
    ui.splitterFile.addEventListener("change", handleFileUpload);
    ui.splitterUploadTrigger.addEventListener("click", () => ui.splitterFile.click());
    ui.splitterReadPaste.addEventListener("click", readPastedData);
    ui.splitterLoadSample.addEventListener("click", () => {
      ui.splitterPaste.value = SAMPLE_DATA;
      ui.splitterSupplierProfile.value = "chinese";
      ui.splitterDestination.value = "United Kingdom";
      ui.splitterInvoiceDateStart.value = "2026-02-15";
      ui.splitterInvoiceDateEnd.value = "2026-03-15";
      handleDestinationChange();
      handleSupplierProfileChange();
      handleInvoiceDateRangeChange();
      readPastedData();
    });
    ui.splitterProcess.addEventListener("click", processData);
    ui.splitterRegeneratePrices.addEventListener("click", regenerateUnitPrices);
    ui.splitterRegenerateQty.addEventListener("click", regenerateQuantities);
    ui.splitterRegroup.addEventListener("click", regroupInvoices);
    ui.splitterReset.addEventListener("click", resetSplitter);
    ui.splitterMoveRows.addEventListener("click", moveSelectedRows);
    ui.splitterUndo.addEventListener("click", undoLastChange);
    ui.splitterDownloadExcel.addEventListener("click", exportToExcel);
    ui.splitterDownloadCsv.addEventListener("click", exportToCSV);
    ui.splitterCopy.addEventListener("click", copyAllResults);
    ui.splitterSaveProject.addEventListener("click", saveProject);
    ui.splitterLoadProject.addEventListener("click", loadProject);
    ui.splitterDeleteProject.addEventListener("click", deleteProject);
    ui.splitterDateFormat.addEventListener("change", () => app.invoices.length && renderAll());
    ui.splitterInvoiceColumn.addEventListener("change", () => app.invoices.length && renderAll());
    ui.splitterSupplierProfile.addEventListener("change", handleSupplierProfileChange);
    ui.splitterDestination.addEventListener("change", handleDestinationChange);
    ui.splitterInvoiceDateStart.addEventListener("change", handleInvoiceDateRangeChange);
    ui.splitterInvoiceDateEnd.addEventListener("change", handleInvoiceDateRangeChange);
    ui.splitterShippingMethod.addEventListener("change", handleShippingMethodChange);
    ui.splitterTemplateFile.addEventListener("change", handleTemplateUpload);
    ui.splitterRegenerateInvoiceNumbers.addEventListener("click", regenerateInvoiceNumbers);
    ui.splitterRuleDestination.addEventListener("change", renderShippingRuleEditor);
    ui.splitterRuleOrigin.addEventListener("change", renderShippingRuleEditor);
    ui.splitterSaveShippingRule.addEventListener("click", saveShippingRule);
    ui.splitterResetShippingRules.addEventListener("click", resetShippingRules);
    renderTemplateMapping();
    renderShippingRuleEditor();
    updateCountryGate();
    handleSupplierProfileChange();
    refreshProjectList();
  }

  function normalizeHeaders(value) {
    return String(value ?? "").trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
  }

  function mapInputColumns(headers) {
    const normalized = headers.map(normalizeHeaders);
    return Object.fromEntries(REQUIRED_FIELDS.map((field) => {
      const index = normalized.findIndex((header) => HEADER_ALIASES[field].includes(header));
      return [field, index >= 0 ? index : ""];
    }));
  }

  async function handleFileUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    ui.splitterPaste.value = "";
    ui.splitterFileName.textContent = file.name;
    try {
      if (!window.XLSX) throw new Error("The local Excel reader could not be loaded.");
      const data = await file.arrayBuffer();
      const workbook = window.XLSX.read(data, { type: "array", cellDates: false, raw: false });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const matrix = window.XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: false, blankrows: true });
      setSourceMatrix(matrix, file.name);
    } catch (error) {
      setStatus(error.message || "Unable to read this file.", "error");
    }
  }

  function readPastedData() {
    const text = ui.splitterPaste.value;
    if (!text.trim()) return setStatus("Paste spreadsheet data first.", "error");
    setSourceMatrix(parseDelimitedText(text), "Pasted data");
  }

  function parseDelimitedText(text) {
    const firstLine = text.replace(/^\uFEFF/, "").split(/\r?\n/, 1)[0];
    const delimiter = firstLine.includes("\t") ? "\t" : firstLine.includes(";") && !firstLine.includes(",") ? ";" : ",";
    const rows = [];
    let row = [], value = "", quoted = false;
    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      if (char === '"') {
        if (quoted && text[i + 1] === '"') { value += '"'; i += 1; }
        else quoted = !quoted;
      } else if (char === delimiter && !quoted) { row.push(value); value = ""; }
      else if ((char === "\n" || char === "\r") && !quoted) {
        if (char === "\r" && text[i + 1] === "\n") i += 1;
        row.push(value); rows.push(row); row = []; value = "";
      } else value += char;
    }
    row.push(value);
    if (row.some((cell) => String(cell).trim())) rows.push(row);
    return rows;
  }

  function setSourceMatrix(matrix, sourceName) {
    const cleaned = matrix.filter((row) => Array.isArray(row) && row.some((cell) => String(cell ?? "").trim() !== ""));
    if (cleaned.length < 2) return setStatus("No data rows were found.", "error");
    app.sourceName = sourceName;
    app.matrix = cleaned;
    app.headers = cleaned[0].map((header, index) => String(header || `Column ${index + 1}`).trim());
    app.mapping = mapInputColumns(app.headers);
    app.rows = [];
    app.invoices = [];
    app.invalidRows = [];
    renderMapping();
    ui.splitterResultsSection.classList.add("is-hidden");
    const supplierIndex = app.mapping.supplier;
    if (supplierIndex !== "" && cleaned[1]) {
      const detectedKey = Core.detectSupplierProfile(cleaned[1][supplierIndex]);
      const detectedProfile = Core.getSupplierProfile(detectedKey, app.profileOverrides);
      if (!ui.splitterSupplierProfile.value) {
        ui.splitterSupplierProfile.value = detectedKey;
        handleSupplierProfileChange();
      }
    }
    setStatus(`${sourceName}: ${cleaned.length - 1} rows detected and columns mapped automatically`, "ready");
    updateWorkflowProgress();
  }

  function setAutomaticInvoiceDates(matrix) {
    const dateColumn = app.mapping.startDate;
    const parsedDates = dateColumn === "" ? [] : matrix.slice(1)
      .map((row) => Core.parseDateInput(row[dateColumn]))
      .filter((date) => date instanceof Date && !Number.isNaN(date.getTime()));
    const earliestListing = parsedDates.length
      ? new Date(Math.min(...parsedDates.map((date) => date.getTime())))
      : new Date();
    const rangeEnd = new Date(earliestListing);
    rangeEnd.setUTCDate(rangeEnd.getUTCDate() - 1);
    const rangeStart = new Date(rangeEnd);
    rangeStart.setUTCDate(rangeStart.getUTCDate() - 30);
    app.automaticDateStart = rangeStart.toISOString().slice(0, 10);
    app.automaticDateEnd = rangeEnd.toISOString().slice(0, 10);
  }

  function renderMapping() {
    if (!ui.splitterMapping) return;
    ui.splitterMapping.innerHTML = REQUIRED_FIELDS.map((field) => `
      <label>${FIELD_LABELS[field]}
        <select data-map-field="${field}">
          <option value="">Select a column</option>
          ${app.headers.map((header, index) => `<option value="${index}" ${String(app.mapping[field]) === String(index) ? "selected" : ""}>${escapeHtml(header)}</option>`).join("")}
        </select>
      </label>`).join("");
  }

  function readMapping() {
    if (!ui.splitterMapping) return { ...app.mapping };
    const mapping = {};
    ui.splitterMapping.querySelectorAll("[data-map-field]").forEach((select) => { mapping[select.dataset.mapField] = select.value === "" ? "" : Number(select.value); });
    return mapping;
  }

  function validateInputRows(matrix, mapping) {
    const valid = [], errors = [];
    matrix.slice(1).forEach((cells, index) => {
      const rowNumber = index + 2;
      const source = Object.fromEntries(REQUIRED_FIELDS.map((field) => [field, cells[mapping[field]] ?? ""]));
      const rowErrors = [];
      if (!String(source.supplier).trim()) rowErrors.push(["Supplier is missing", source.supplier, "Enter a supplier name"]);
      if (!String(source.title).trim()) rowErrors.push(["Title is missing", source.title, "Enter the original listing title"]);
      const available = parseWholeNumber(source.available);
      const sold = parseWholeNumber(source.sold);
      const startPrice = parseMoney(source.startPrice);
      if (available === null || available < 0) rowErrors.push(["Available quantity is invalid", source.available, "Enter a non-negative whole number"]);
      if (sold === null || sold < 0) rowErrors.push(["Sold quantity is invalid", source.sold, "Enter a non-negative whole number"]);
      if (startPrice === null || startPrice < 0) rowErrors.push(["Start price is invalid", source.startPrice, "Enter a non-negative price"]);
      if (!String(source.startDate).trim()) rowErrors.push(["Start date is missing", source.startDate, "Enter the original listing date/time"]);
      if (rowErrors.length) {
        rowErrors.forEach(([problem, originalValue, action]) => errors.push({ rowNumber, problem, originalValue: String(originalValue ?? ""), action }));
      } else {
        valid.push({
          id: `source-row-${rowNumber}`,
          rowNumber,
          supplier: String(source.supplier).trim(),
          title: String(source.title).trim(),
          variation: String(source.variation || "").trim(),
          originalTitle: String(source.title).trim(),
          originalVariation: String(source.variation || "").trim(),
          available,
          sold,
          startPriceCents: Math.round(startPrice * 100),
          originalStartPrice: String(source.startPrice).trim(),
          startDate: String(source.startDate).trim(),
          percentageBasisPoints: null,
          extraQuantity: null,
          unitPriceCents: null,
          qty: null,
          totalCents: null
        });
      }
    });
    return { valid, errors };
  }

  function processData() {
    if (ui.splitterPaste.value.trim()) setSourceMatrix(parseDelimitedText(ui.splitterPaste.value), "Pasted data");
    if (!app.matrix.length) return setStatus("Upload or paste data before processing.", "error");
    const settings = getSettings();
    const profileValue = getActiveProfile();
    const setupErrors = validateProcessingSetup(profileValue, settings);
    if (setupErrors.length) return setStatus(setupErrors.join(" "), "error");
    const mapping = readMapping();
    const missing = REQUIRED_SOURCE_FIELDS.filter((field) => mapping[field] === "");
    if (missing.length) return setStatus(`Map all required fields: ${missing.map((field) => FIELD_LABELS[field]).join(", ")}.`, "error");
    const mappedColumns = Object.values(mapping).filter((value) => value !== "");
    if (new Set(mappedColumns).size !== mappedColumns.length) return setStatus("Each mapped field must use a different source column.", "error");
    app.mapping = mapping;
    const previous = new Map(app.rows.map((row) => [row.id, row]));
    const result = validateInputRows(app.matrix, mapping);
    app.invalidRows = result.errors;
    const usedPercentages = new Map();
    const usedExtras = new Map();
    let previousExtra = null;
    app.rows = Core.cleanProductRows(result.valid.map((row) => {
      const old = previous.get(row.id);
      row.percentageBasisPoints = old?.percentageBasisPoints || generateRandomPercentage(usedPercentages);
      row.extraQuantity = Number.isInteger(old?.extraQuantity) ? old.extraQuantity : generateRandomExtraQuantity(usedExtras, previousExtra);
      usedPercentages.set(row.percentageBasisPoints, (usedPercentages.get(row.percentageBasisPoints) || 0) + (old?.percentageBasisPoints ? 1 : 0));
      usedExtras.set(row.extraQuantity, (usedExtras.get(row.extraQuantity) || 0) + (Number.isInteger(old?.extraQuantity) ? 1 : 0));
      previousExtra = row.extraQuantity;
      calculateRow(row);
      return row;
    }));
    app.rows.forEach((row) => {
      const detected = Core.detectSupplierProfile(row.supplier);
      if (detected !== settings.profileKey && settings.profileKey !== "custom") {
        app.invalidRows.push({ rowNumber: row.rowNumber, problem: "Supplier assignment does not match selected profile", originalValue: row.supplier, action: `Use the ${Core.getSupplierProfile(detected, app.profileOverrides).profileName} profile or correct the supplier value` });
      }
    });
    app.history = [];
    app.invoices = buildInvoiceGroups(app.rows, settings);
    assignInvoiceMetadata(false);
    renderErrors();
    renderTitleReview();
    renderAll();
    setStatus(`${app.rows.length} valid rows processed`, app.invalidRows.length ? "warning" : "ready");
  }

  function normalizeTitleForGrouping(title) {
    return String(title).trim().replace(/\s+/g, " ").toLowerCase();
  }

  function normalizeSupplier(supplier) {
    return String(supplier).trim().replace(/\s+/g, " ").toLowerCase();
  }

  function secureRandomInt(min, max) {
    const range = max - min + 1;
    if (window.crypto?.getRandomValues) {
      const limit = Math.floor(0x100000000 / range) * range;
      const values = new Uint32Array(1);
      do window.crypto.getRandomValues(values); while (values[0] >= limit);
      return min + (values[0] % range);
    }
    return min + Math.floor(Math.random() * range);
  }

  function generateRandomPercentage(usedValues) {
    return Core.generateAllowedUnitPricePercentage(usedValues, secureRandomInt);
  }

  function calculateUnitPrice(startPriceCents, percentageBasisPoints) {
    return Core.calculateUnitPrice(startPriceCents, percentageBasisPoints);
  }

  function generateRandomExtraQuantity(usedValues, previousValue) {
    if (!usedValues) {
      let value = secureRandomInt(8, 15);
      if (value === previousValue) value = value === 15 ? 8 : value + 1;
      return value;
    }
    const candidates = Array.from({ length: 8 }, (_, index) => index + 8);
    const minimumUse = Math.min(...candidates.map((value) => usedValues.get(value) || 0));
    const balanced = candidates.filter((value) => value !== previousValue && (usedValues.get(value) || 0) <= minimumUse + 1);
    const value = balanced[secureRandomInt(0, balanced.length - 1)];
    usedValues.set(value, (usedValues.get(value) || 0) + 1);
    return value;
  }
  function calculateInvoiceQuantity(available, sold, extra) { return Core.calculateInvoiceQuantity(available, sold, extra); }
  function calculateLineTotal(unitPriceCents, qty) { return Core.calculateLineTotal(unitPriceCents, qty); }

  function calculateRow(row) {
    row.unitPriceCents = calculateUnitPrice(row.startPriceCents, row.percentageBasisPoints);
    row.qty = calculateInvoiceQuantity(row.available, row.sold, row.extraQuantity);
    row.totalCents = calculateLineTotal(row.unitPriceCents, row.qty);
  }

  function groupRowsBySupplier(rows) {
    const groups = new Map();
    rows.forEach((row) => {
      const key = normalizeSupplier(row.supplier);
      if (!groups.has(key)) groups.set(key, { key, display: row.supplier, rows: [] });
      groups.get(key).rows.push(row);
    });
    return Array.from(groups.values());
  }

  function groupRowsByTitle(rows) {
    const groups = new Map();
    rows.forEach((row) => {
      const key = row.productGroupId || normalizeTitleForGrouping(row.title);
      if (!groups.has(key)) groups.set(key, { key, rows: [] });
      groups.get(key).rows.push(row);
    });
    return Array.from(groups.values());
  }

  function parseDateValue(value) {
    const parsed = Date.parse(String(value));
    return Number.isFinite(parsed) ? parsed : null;
  }

  function sortSupplierRows(rows, mode) {
    const sorted = rows.slice();
    sorted.sort((a, b) => {
      if (mode === "original") return a.rowNumber - b.rowNumber;
      if (mode === "supplier") return a.supplier.localeCompare(b.supplier) || a.rowNumber - b.rowNumber;
      if (mode === "title") return a.title.localeCompare(b.title) || a.rowNumber - b.rowNumber;
      const ad = parseDateValue(a.startDate), bd = parseDateValue(b.startDate);
      if (ad === null || bd === null || ad === bd) return a.rowNumber - b.rowNumber;
      return mode === "newest" ? bd - ad : ad - bd;
    });
    return sorted;
  }

  function calculateBalancedVariationSplit(count, minimum = 8, maximum = 10) {
    return Core.buildBalancedInvoices(count, minimum, maximum);
  }

  function combineSmallProductGroups(groups, minimum, maximum) {
    const invoices = [];
    let current = [], target = secureRandomInt(minimum, maximum);
    groups.forEach((group) => {
      if (current.length && current.length + group.rows.length > maximum) {
        invoices.push(current); current = []; target = secureRandomInt(minimum, maximum);
      }
      current.push(...group.rows);
      if (current.length >= target) { invoices.push(current); current = []; target = secureRandomInt(minimum, maximum); }
    });
    if (current.length) invoices.push(current);
    return invoices;
  }

  function buildInvoiceGroups(rows, settings) {
    const invoices = [];
    groupRowsBySupplier(rows).sort((a, b) => a.display.localeCompare(b.display)).forEach((supplierGroup) => {
      const ordered = sortSupplierRows(supplierGroup.rows, settings.sort);
      const titleGroups = groupRowsByTitle(ordered);
      const groupOrder = new Map(ordered.map((row, index) => [row.id, index]));
      titleGroups.sort((a, b) => Math.min(...a.rows.map((row) => groupOrder.get(row.id))) - Math.min(...b.rows.map((row) => groupOrder.get(row.id))));
      const small = [];
      titleGroups.forEach((titleGroup) => {
        if (titleGroup.rows.length >= 6) {
          const splits = calculateBalancedVariationSplit(titleGroup.rows.length, settings.minimum, settings.maximum);
          let offset = 0;
          splits.forEach((size) => { invoices.push(makeInvoice(titleGroup.rows.slice(offset, offset + size), supplierGroup.display)); offset += size; });
        } else small.push(titleGroup);
      });
      combineSmallProductGroups(small, settings.minimum, settings.maximum).forEach((invoiceRows) => invoices.push(makeInvoice(invoiceRows, supplierGroup.display)));
    });
    return renumberInvoices(invoices);
  }

  function makeInvoice(rows, supplier) {
    return { id: `invoice-${Date.now()}-${secureRandomInt(100000, 999999)}`, supplier, rows: rows.slice(), gapAfter: secureRandomInt(8, 10) };
  }

  function renumberInvoices(invoices) {
    invoices.forEach((invoice, index) => { invoice.number = index + 1; invoice.supplier = invoice.rows[0]?.supplier || invoice.supplier; });
    return invoices.filter((invoice) => invoice.rows.length);
  }

  function calculateInvoiceSubtotal(invoice) { return Core.calculateInvoiceSubtotal(invoice); }

  function assignInvoiceMetadata(regenerateNumbers) {
    const settings = getSettings();
    const profileValue = getActiveProfile();
    const usedDateOffsets = new Set();
    const existingInvoiceNumbers = app.invoices.map((invoice) => invoice.invoiceNumber);
    if (regenerateNumbers || !Core.isValidIncreasingInvoiceSequence(existingInvoiceNumbers, 201)) {
      const sequence = Core.generateIncreasingInvoiceSequence(app.invoices.length, secureRandomInt, 201, 499);
      app.invoices.forEach((invoice, index) => { invoice.invoiceNumber = sequence[index] ?? null; });
    }
    app.invoices.forEach((invoice, index) => {
      invoice.subtotalCents = calculateInvoiceSubtotal(invoice);
      const isUnitedStatesAccount = profileValue.originCountry === "United States";
      invoice.taxRateBasisPoints = isUnitedStatesAccount ? 725 : 0;
      invoice.taxCents = Core.calculateAccountTax(invoice.subtotalCents, profileValue.originCountry, invoice.taxRateBasisPoints);
      invoice.originCountry = settings.shippingOrigin;
      invoice.destinationCountry = settings.destinationCountry;

      const candidate = Core.generateInvoiceDate(index, app.invoices.length, settings.dateStart, settings.dateEnd, secureRandomInt, usedDateOffsets);
      const rangeEnd = Core.parseDateInput(settings.dateEnd);
      const listingDates = invoice.rows.map((row) => Core.parseDateInput(row.startDate)).filter(Boolean);
      const earliestListing = listingDates.length ? new Date(Math.min(...listingDates.map((date) => date.getTime()))) : null;
      let upperBound = rangeEnd;
      if (settings.dateBeforeListing && earliestListing && (!upperBound || earliestListing < upperBound)) upperBound = earliestListing;
      const chosen = invoice.invoiceDate && !regenerateNumbers ? Core.parseDateInput(invoice.invoiceDate) : candidate;
      invoice.dateError = "";
      if (!chosen || !upperBound || chosen > upperBound) {
        invoice.dateError = "The selected invoice date range is incompatible with one or more listing dates.";
      } else {
        invoice.invoiceDate = Core.formatDateDDMMYYYY(chosen);
        const dateCheck = Core.validateInvoiceDateAgainstListingDates(invoice.invoiceDate, invoice.rows, settings.dateBeforeListing);
        if (!dateCheck.valid) invoice.dateError = dateCheck.message;
      }

      if (profileValue.profileKey === "zoro") {
        if (regenerateNumbers || !invoice.zNumber) invoice.zNumber = `Z${secureRandomInt(1000000, 9999999)}`;
        if (regenerateNumbers || !invoice.zoroInvoiceNumber) invoice.zoroInvoiceNumber = `INV${secureRandomInt(1000000, 9999999)}`;
        if (regenerateNumbers || !invoice.customerNumber) invoice.customerNumber = `CUST${secureRandomInt(1000000, 9999999)}`;
        if (regenerateNumbers || !invoice.salesOrderNumber) invoice.salesOrderNumber = `SO${secureRandomInt(10000000, 99999999)}`;
        if (regenerateNumbers || !invoice.purchaseOrderNumber) invoice.purchaseOrderNumber = `#PO${secureRandomInt(100000000, 999999999)}`;
        if (regenerateNumbers || ![2, 3].includes(invoice.dueDateOffsetDays)) invoice.dueDateOffsetDays = Core.generateFollowUpDayOffset(secureRandomInt);
        if (regenerateNumbers || ![2, 3].includes(invoice.shipDateOffsetDays)) invoice.shipDateOffsetDays = Core.generateFollowUpDayOffset(secureRandomInt);
        invoice.zoroDate = formatDateSlash(invoice.invoiceDate);
        invoice.dueDate = addDaysFormatted(invoice.invoiceDate, invoice.dueDateOffsetDays);
        invoice.shipDate = addDaysFormatted(invoice.invoiceDate, invoice.shipDateOffsetDays);
      }

      const shippingSignature = `${invoice.rows.map((row) => row.id).sort().join("|")}|${settings.shippingOrigin}|${settings.destinationCountry}|${settings.shippingMethod}|${settings.manualShipping}`;
      if (invoice.shippingSignature !== shippingSignature) {
        invoice.shippingError = "";
        if (isUnitedStatesAccount) {
          invoice.shippingCents = 0;
          invoice.shippingRateBasisPoints = 0;
          invoice.shippingMethod = "US Account — Shipping Zero";
        } else {
          const rule = Core.getShippingRule(app.shippingRules, settings.shippingOrigin, settings.destinationCountry);
          const calculated = Core.calculateCountryShipping({
            rule, subtotalCents: invoice.subtotalCents, lineItems: invoice.rows.length,
            totalQuantity: invoice.rows.reduce((sum, row) => sum + row.qty, 0),
            storedRateBasisPoints: invoice.shippingRateBasisPoints,
            method: "automatic", randomInteger: secureRandomInt
          });
          if (calculated.error) invoice.shippingError = calculated.error;
          else {
            invoice.shippingCents = applyShippingRounding(calculated.shippingCents, rule.roundingMethod);
            invoice.shippingRateBasisPoints = calculated.rateBasisPoints;
            invoice.shippingMethod = calculated.method;
          }
        }
        invoice.shippingSignature = shippingSignature;
      }
      invoice.grandTotalCents = Core.calculateGrandTotal(invoice.subtotalCents, invoice.taxCents || 0, invoice.shippingCents || 0);
      invoice.mathErrors = Core.validateInvoiceMathematics(invoice);
      invoice.validationStatus = invoice.dateError || invoice.shippingError || invoice.mathErrors.length ? "Invalid" : "Valid";
    });
  }

  function validateInvoiceGroups() {
    const outputRows = app.invoices.flatMap((invoice) => invoice.rows);
    const ids = outputRows.map((row) => row.id);
    const expectedIds = new Set(app.rows.map((row) => row.id));
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    const missing = Array.from(expectedIds).filter((id) => !ids.includes(id));
    let unitPriceErrors = 0, qtyErrors = 0, lineTotalErrors = 0;
    outputRows.forEach((row) => {
      const percentageValid = Core.isAllowedUnitPricePercentage(row.percentageBasisPoints);
      const extraValid = Number.isInteger(row.extraQuantity) && row.extraQuantity >= 8 && row.extraQuantity <= 15;
      if (!percentageValid || row.unitPriceCents !== calculateUnitPrice(row.startPriceCents, row.percentageBasisPoints)) unitPriceErrors += 1;
      if (!extraValid || row.qty !== calculateInvoiceQuantity(row.available, row.sold, row.extraQuantity)) qtyErrors += 1;
      if (row.totalCents !== calculateLineTotal(row.unitPriceCents, row.qty)) lineTotalErrors += 1;
    });
    const warnings = [];
    app.invoices.forEach((invoice) => {
      const suppliers = new Set(invoice.rows.map((row) => normalizeSupplier(row.supplier)));
      if (suppliers.size > 1) warnings.push(`Invoice ${invoice.number} mixes suppliers.`);
      if (invoice.rows.length < getSettings().minimum) warnings.push(`Invoice ${invoice.number} has ${invoice.rows.length} rows, below the preferred minimum.`);
      const titleCounts = new Map();
      invoice.rows.forEach((row) => titleCounts.set(row.productGroupId, (titleCounts.get(row.productGroupId) || 0) + 1));
      if (titleCounts.size > 1 && Array.from(titleCounts.keys()).some((title) => app.rows.filter((row) => row.productGroupId === title).length >= 6)) warnings.push(`Invoice ${invoice.number} mixes another product with a large variation group.`);
    });
    const suppliers = new Set(app.rows.map((row) => normalizeSupplier(row.supplier))).size;
    const productGroups = new Set(app.rows.map((row) => row.productGroupId)).size;
    const subtotalErrors = app.invoices.filter((invoice) => invoice.subtotalCents !== calculateInvoiceSubtotal(invoice)).length;
    const activeProfile = getActiveProfile();
    const taxErrors = app.invoices.filter((invoice) => invoice.taxCents !== Core.calculateAccountTax(invoice.subtotalCents, activeProfile.originCountry, activeProfile.originCountry === "United States" ? 725 : 0)).length;
    const shippingErrors = app.invoices.filter((invoice) => invoice.shippingError).length;
    const grandTotalErrors = app.invoices.filter((invoice) => invoice.grandTotalCents !== Core.calculateGrandTotal(invoice.subtotalCents, invoice.taxCents, invoice.shippingCents)).length;
    const invoiceNumberErrors = validateInvoiceNumbers();
    const invoiceDateErrors = app.invoices.filter((invoice) => invoice.dateError).length;
    const templateMappingErrors = validateTemplateMapping();
    const lowConfidence = app.rows.filter((row) => row.variationConfidence === "Low").length;
    const calculationErrors = unitPriceErrors + qtyErrors + lineTotalErrors + subtotalErrors + taxErrors + grandTotalErrors;
    const invalidDataRows = new Set(app.invalidRows.map((error) => error.rowNumber)).size;
    if (invalidDataRows) warnings.push(`${invalidDataRows} invalid input row(s) were skipped. Downloads include all valid processed rows.`);
    const blockingGroupingWarnings = warnings.filter((warning) => /mixes suppliers|large variation/.test(warning)).length;
    const critical = Core.shouldBlockExport({
      totalOutputRows: outputRows.length,
      duplicateRows: duplicates.length,
      missingRows: missing.length,
      calculationErrors,
      shippingErrors,
      invoiceNumberErrors,
      invoiceDateErrors,
      outputCountMismatch: ids.length !== app.rows.length,
      blockingGroupingWarnings
    });
    return {
      totalInputRows: app.matrix.length ? app.matrix.length - 1 : 0,
      totalValidRows: app.rows.length,
      totalOutputRows: outputRows.length,
      totalSuppliers: suppliers,
      totalProductGroups: productGroups,
      totalInvoices: app.invoices.length,
      calculationErrors,
      unitPriceErrors, qtyErrors, lineTotalErrors, subtotalErrors, taxErrors, shippingErrors,
      grandTotalErrors, invoiceNumberErrors, invoiceDateErrors, templateMappingErrors,
      lowConfidenceVariations: lowConfidence,
      cleanedTitles: app.rows.filter((row) => row.finalWholesaleTitle).length,
      variationGroups: new Set(app.rows.filter((row) => row.normalizedVariation).map((row) => row.productGroupId)).size,
      duplicateRows: duplicates.length,
      missingRows: missing.length,
      groupingWarnings: warnings,
      invalidDataRows,
      critical,
      exportStatus: critical ? "Blocked" : "Ready"
    };
  }

  function regenerateUnitPrices() {
    if (!app.rows.length) return;
    const used = new Map();
    app.rows.forEach((row) => { row.percentageBasisPoints = generateRandomPercentage(used); calculateRow(row); });
    app.invoices.forEach((invoice) => { invoice.shippingSignature = ""; });
    assignInvoiceMetadata(false);
    renderAll();
    setStatus("Unit Prices regenerated; invoice groups were preserved.", "ready");
  }

  function regenerateQuantities() {
    if (!app.rows.length) return;
    const used = new Map();
    let previous = null;
    app.rows.forEach((row) => {
      const next = generateRandomExtraQuantity(used, previous);
      row.extraQuantity = next; previous = next; calculateRow(row);
    });
    app.invoices.forEach((invoice) => { invoice.shippingSignature = ""; });
    assignInvoiceMetadata(false);
    renderAll();
    setStatus("Quantities regenerated; invoice groups were preserved.", "ready");
  }

  function regroupInvoices() {
    if (!app.rows.length) return;
    pushHistory();
    const previousMetadata = app.invoices.map((invoice) => ({
      invoiceNumber: invoice.invoiceNumber, invoiceDate: invoice.invoiceDate,
      shippingCents: invoice.shippingCents, shippingRateBasisPoints: invoice.shippingRateBasisPoints,
      shippingMethod: invoice.shippingMethod, shippingSignature: invoice.shippingSignature
    }));
    app.invoices = buildInvoiceGroups(app.rows, getSettings());
    app.invoices.forEach((invoice, index) => Object.assign(invoice, previousMetadata[index] || {}));
    assignInvoiceMetadata(false);
    renderAll();
    setStatus("Invoices regrouped without changing Unit Prices or QTY.", "ready");
  }

  function getSettings() {
    const minimum = Math.max(1, Math.min(50, Number(ui.splitterMinRows.value) || 8));
    const maximum = Math.max(minimum, Math.min(50, Number(ui.splitterMaxRows.value) || 10));
    const invoiceGapMin = Math.max(1, Number(ui.splitterInvoiceGapMin.value) || 76);
    const invoiceGapMax = Math.max(invoiceGapMin, Number(ui.splitterInvoiceGapMax.value) || 145);
    ui.splitterMinRows.value = minimum; ui.splitterMaxRows.value = maximum;
    ui.splitterInvoiceGapMin.value = invoiceGapMin; ui.splitterInvoiceGapMax.value = invoiceGapMax;
    return {
      minimum, maximum, sort: ui.splitterSort.value, dateFormat: ui.splitterDateFormat.value,
      includeInvoiceNumber: ui.splitterInvoiceColumn.checked,
      invoiceStart: Number(ui.splitterInvoiceStart.value) || 0,
      invoiceGapMin, invoiceGapMax,
      invoicePrefix: ui.splitterInvoicePrefix.value,
      invoiceSuffix: ui.splitterInvoiceSuffix.value,
      includeAudit: ui.splitterAudit.checked,
      trailingRows: ui.splitterTrailingRows.checked,
      advanced: ui.splitterAdvanced.checked,
      profileKey: ui.splitterSupplierProfile.value,
      destinationCountry: ui.splitterDestination.value,
      shippingOrigin: ui.splitterShippingOrigin.value.trim(),
      shippingMethod: "automatic",
      manualShipping: "",
      caseNumber: "", billTo: "", shipTo: "",
      dateStart: ui.splitterInvoiceDateStart.value, dateEnd: ui.splitterInvoiceDateEnd.value,
      dateBeforeListing: true,
      totalsDisplay: ui.splitterTotalsDisplay.value
    };
  }

  function renderErrors() {
    ui.splitterErrorsPanel.classList.toggle("is-hidden", !app.invalidRows.length);
    ui.splitterErrors.innerHTML = app.invalidRows.map((error) => `<tr><td>${error.rowNumber}</td><td>${escapeHtml(error.problem)}</td><td>${escapeHtml(error.originalValue || "(blank)")}</td><td>${escapeHtml(error.action)}</td></tr>`).join("");
  }

  function renderAll() {
    Core.repairMediumWholesaleTitles(app.rows);
    const repairedUnitPrices = Core.repairInternalUnitPrices(app.rows, secureRandomInt);
    const invoiceNumbersNeedRepair = app.invoices.length && !Core.isValidIncreasingInvoiceSequence(app.invoices.map((invoice) => invoice.invoiceNumber), 201);
    if ((repairedUnitPrices || invoiceNumbersNeedRepair) && app.invoices.length) {
      if (repairedUnitPrices) app.invoices.forEach((invoice) => { invoice.shippingSignature = ""; });
      assignInvoiceMetadata(false);
    }
    app.validation = validateInvoiceGroups();
    renderValidation();
    renderInvoices();
    renderMoveDestinations();
    ui.splitterResultsSection.classList.toggle("is-hidden", !app.rows.length);
    [ui.splitterRegeneratePrices, ui.splitterRegenerateQty, ui.splitterRegroup].forEach((button) => { button.disabled = !app.rows.length; });
    ui.splitterRegenerateInvoiceNumbers.disabled = !app.invoices.length;
    ui.splitterUndo.disabled = !app.history.length;
    ui.splitterDownloadExcel.disabled = app.validation.critical;
    ui.splitterDownloadCsv.disabled = app.validation.critical;
    ui.splitterCopy.disabled = app.validation.critical;
    updateWorkflowProgress();
  }

  function renderValidation() {
    const value = app.validation;
    const metrics = [
      ["Uploaded rows", value.totalInputRows], ["Valid rows", value.totalValidRows], ["Invalid rows", value.invalidDataRows],
      ["Suppliers", value.totalSuppliers], ["Product groups", value.totalProductGroups], ["Variation groups", value.variationGroups],
      ["Low-confidence", value.lowConfidenceVariations], ["Cleaned titles", value.cleanedTitles], ["Invoices", value.totalInvoices],
      ["Unit Price errors", value.unitPriceErrors], ["QTY errors", value.qtyErrors], ["Line Total errors", value.lineTotalErrors],
      ["Subtotal errors", value.subtotalErrors], ["Tax errors", value.taxErrors], ["Shipping errors", value.shippingErrors],
      ["Grand Total errors", value.grandTotalErrors], ["Invoice # errors", value.invoiceNumberErrors], ["Invoice Date errors", value.invoiceDateErrors],
      ["Rows missing", value.missingRows], ["Rows duplicated", value.duplicateRows], ["Template errors", value.templateMappingErrors],
      ["Export status", value.exportStatus]
    ];
    ui.splitterValidation.innerHTML = `<div class="validation-heading"><div><span class="step-chip">Validation summary</span><h3>${value.critical ? "Final export is blocked" : "All critical checks passed"}</h3></div><span class="status-pill ${value.critical ? "is-error" : "is-ready"}">${value.critical ? "Review errors" : "Ready to export"}</span></div><div class="validation-metrics">${metrics.map(([label, number]) => `<div><span>${label}</span><strong>${escapeHtml(number)}</strong></div>`).join("")}</div>${value.groupingWarnings.length ? `<div class="warning-list"><strong>${value.groupingWarnings.length} grouping warning(s)</strong>${value.groupingWarnings.map((warning) => `<p>${escapeHtml(warning)}</p>`).join("")}</div>` : ""}`;
  }

  function outputHeaders() {
    const profileValue = getActiveProfile();
    if (profileValue.profileKey === "chinese") return Core.CHINESE_COLUMNS.slice();
    if (profileValue.profileKey === "zoro") return Core.ZORO_COLUMNS.slice();
    return (profileValue.outputColumns || []).slice();
  }

  function formatDateSlash(value) {
    return Core.formatDateDDMMYYYYSlash(value);
  }

  function addDaysFormatted(value, days) {
    const date = Core.parseDateInput(value);
    if (!date) return "";
    date.setUTCDate(date.getUTCDate() + Number(days || 0));
    return formatDateSlash(date.toISOString().slice(0, 10));
  }

  function invoiceLabel(invoice) {
    const settings = getSettings();
    return `${settings.invoicePrefix}${invoice.invoiceNumber || settings.invoiceStart + invoice.number - 1}${settings.invoiceSuffix}`;
  }

  function outputRow(row, invoice, raw = false) {
    const profileValue = getActiveProfile();
    const firstInvoiceRow = invoice.rows[0]?.id === row.id;
    if (profileValue.profileKey === "chinese") {
      return [row.finalWholesaleTitle || row.title, row.qty, raw ? row.unitPriceCents / 100 : cents(row.unitPriceCents), firstInvoiceRow ? invoice.invoiceDate || "" : "", firstInvoiceRow ? invoiceLabel(invoice) : "", firstInvoiceRow ? (raw ? invoice.shippingCents / 100 : cents(invoice.shippingCents)) : ""];
    }
    if (profileValue.profileKey === "zoro") {
      return [
        row.finalWholesaleTitle || row.title, row.qty, raw ? row.unitPriceCents / 100 : cents(row.unitPriceCents),
        firstInvoiceRow ? invoice.zNumber || "" : "",
        firstInvoiceRow ? invoice.zoroDate || formatDateSlash(invoice.invoiceDate) : "",
        firstInvoiceRow ? invoice.zoroInvoiceNumber || "" : "",
        firstInvoiceRow ? invoice.customerNumber || "" : "",
        firstInvoiceRow ? invoice.dueDate || "" : "",
        firstInvoiceRow ? invoice.salesOrderNumber || "" : "",
        firstInvoiceRow ? invoice.purchaseOrderNumber || "" : "",
        firstInvoiceRow ? invoice.shipDate || "" : "",
        firstInvoiceRow ? (raw ? invoice.shippingCents / 100 : cents(invoice.shippingCents)) : "",
        firstInvoiceRow ? (raw ? invoice.grandTotalCents / 100 : cents(invoice.grandTotalCents)) : "",
        firstInvoiceRow ? (raw ? invoice.taxCents / 100 : cents(invoice.taxCents)) : ""
      ];
    }
    const standard = { "Supplier Name": row.supplier, Supplier: row.supplier, Title: row.finalWholesaleTitle || row.title, "Unit Price": raw ? row.unitPriceCents / 100 : cents(row.unitPriceCents), QTY: row.qty, Total: raw ? row.totalCents / 100 : cents(row.totalCents), "Listing Date": formatListingDate(row.startDate), "Invoice Number": invoiceLabel(invoice) };
    return outputHeaders().map((header) => standard[header] ?? "");
  }

  function formatListingDate(value) {
    const mode = ui.splitterDateFormat.value;
    if (mode === "original") return value;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return mode === "iso" ? parsed.toISOString() : parsed.toLocaleString();
  }

  function renderInvoices() {
    const headers = outputHeaders();
    ui.splitterInvoices.innerHTML = app.invoices.map((invoice) => {
      const groups = groupRowsByTitle(invoice.rows);
      return `<section class="splitter-invoice" data-invoice-id="${invoice.id}"><div class="splitter-invoice-heading"><div><span>Invoice ${invoice.number}</span><h3>${escapeHtml(invoiceLabel(invoice))}</h3><small>${escapeHtml(invoice.invoiceDate || "Date unavailable")} · ${escapeHtml(invoice.destinationCountry || "Destination unavailable")}</small></div><div><strong>${invoice.rows.length} rows</strong><span>${invoice.validationStatus || "Pending"}</span></div></div><div class="invoice-case-summary"><div><span>Bill To</span><p>${escapeHtml(getSettings().billTo)}</p></div><div><span>Ship To</span><p>${escapeHtml(getSettings().shipTo)}</p></div></div><div class="splitter-table-wrap"><table class="splitter-table splitter-result-table"><thead><tr><th class="select-cell"><span class="sr-only">Select</span></th>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>${groups.map((group) => `<tbody draggable="true" data-drag-group="${escapeHtml(group.key)}" title="Drag this complete product group"><tr class="group-label-row"><td colspan="${headers.length + 1}"><span>${group.rows.length} variation${group.rows.length === 1 ? "" : "s"}</span> ${escapeHtml(group.rows[0].cleanedBaseTitle || group.rows[0].title)}</td></tr>${group.rows.map((row) => `<tr><td class="select-cell"><input type="checkbox" data-select-row="${row.id}" ${app.selected.has(row.id) ? "checked" : ""} aria-label="Select source row ${row.rowNumber}" /></td>${outputRow(row, invoice).map((value, index) => `<td class="${headers[index] === "Title" ? "title-cell" : ""}">${escapeHtml(value)}</td>`).join("")}</tr>`).join("")}</tbody>`).join("")}<tfoot><tr><th colspan="${headers.length}">Grand Total</th><td>${cents(invoice.grandTotalCents)}</td></tr></tfoot></table></div><div class="invoice-total-strip"><span>Sub Total <strong>${cents(invoice.subtotalCents)}</strong></span><span>Tax <strong>${cents(invoice.taxCents)}</strong></span><span>Shipping <strong>${cents(invoice.shippingCents)}</strong></span><span>Grand Total <strong>${cents(invoice.grandTotalCents)}</strong></span></div><div class="gap-indicator">Export gap after this invoice: ${invoice.number === app.invoices.length && !getSettings().trailingRows ? "none" : `${invoice.gapAfter} blank rows`}</div></section>`;
    }).join("");
    ui.splitterInvoices.querySelectorAll("[data-select-row]").forEach((checkbox) => checkbox.addEventListener("change", () => { checkbox.checked ? app.selected.add(checkbox.dataset.selectRow) : app.selected.delete(checkbox.dataset.selectRow); }));
    bindGroupDragging();
  }

  function bindGroupDragging() {
    let draggedKey = "";
    ui.splitterInvoices.querySelectorAll("[data-drag-group]").forEach((group) => group.addEventListener("dragstart", (event) => { draggedKey = group.dataset.dragGroup; event.dataTransfer.effectAllowed = "move"; }));
    ui.splitterInvoices.querySelectorAll("[data-invoice-id]").forEach((invoiceNode) => {
      invoiceNode.addEventListener("dragover", (event) => { event.preventDefault(); invoiceNode.classList.add("is-drag-target"); });
      invoiceNode.addEventListener("dragleave", () => invoiceNode.classList.remove("is-drag-target"));
      invoiceNode.addEventListener("drop", (event) => { event.preventDefault(); invoiceNode.classList.remove("is-drag-target"); if (draggedKey) moveCompleteProductGroup(draggedKey, invoiceNode.dataset.invoiceId); });
    });
  }

  function moveCompleteProductGroup(titleKey, destinationId) {
    const rows = app.invoices.flatMap((invoice) => invoice.rows).filter((row) => row.productGroupId === titleKey);
    moveRowsByIds(rows.map((row) => row.id), destinationId, true);
  }

  function renderMoveDestinations() {
    ui.splitterMoveDestination.innerHTML = app.invoices.map((invoice) => `<option value="${invoice.id}">Invoice ${invoice.number} · ${escapeHtml(invoice.supplier)}</option>`).join("");
  }

  function moveSelectedRows() {
    if (!app.selected.size) return setStatus("Select at least one row to move.", "error");
    moveRowsByIds(Array.from(app.selected), ui.splitterMoveDestination.value, false);
  }

  function moveRowsByIds(ids, destinationId, completeGroup) {
    const rows = app.invoices.flatMap((invoice) => invoice.rows).filter((row) => ids.includes(row.id));
    const destination = app.invoices.find((invoice) => invoice.id === destinationId);
    if (!rows.length || !destination) return;
    if (rows.some((row) => normalizeSupplier(row.supplier) !== normalizeSupplier(destination.supplier))) return setStatus("Rows cannot be moved to an invoice for a different supplier.", "error");
    if (!completeGroup && !getSettings().advanced) {
      const affected = new Set(rows.map((row) => row.productGroupId));
      for (const key of affected) {
        const allForTitle = app.rows.filter((row) => row.productGroupId === key);
        const selectedForTitle = rows.filter((row) => row.productGroupId === key);
        if (allForTitle.length >= 6 && selectedForTitle.length !== allForTitle.length) return setStatus("Select the entire large variation group or enable Advanced Manual Variation Editing.", "error");
      }
    }
    pushHistory();
    app.invoices.forEach((invoice) => { invoice.rows = invoice.rows.filter((row) => !ids.includes(row.id)); });
    destination.rows.push(...rows);
    app.invoices = renumberInvoices(app.invoices);
    app.invoices.forEach((invoice) => { invoice.shippingSignature = ""; });
    assignInvoiceMetadata(false);
    app.selected.clear();
    renderAll();
    setStatus(`${rows.length} row(s) moved. Calculations were preserved.`, "ready");
  }

  function pushHistory() {
    app.history.push(app.invoices.map((invoice) => ({ ...invoice, rows: invoice.rows.slice() })));
    if (app.history.length > 20) app.history.shift();
  }

  function undoLastChange() {
    const previous = app.history.pop();
    if (!previous) return;
    app.invoices = previous;
    app.selected.clear();
    renderAll();
    setStatus("Last group change undone.", "ready");
  }

  function buildExportMatrix(raw = false) {
    const matrix = [], headers = outputHeaders(), settings = getSettings();
    app.invoices.forEach((invoice, index) => {
      matrix.push(headers);
      invoice.rows.forEach((row) => matrix.push(outputRow(row, invoice, raw)));
      if (index < app.invoices.length - 1 || settings.trailingRows) for (let gap = 0; gap < invoice.gapAfter; gap += 1) matrix.push([]);
    });
    return matrix;
  }

  function exportToExcel() {
    if (app.validation?.critical) return setStatus("Resolve the highlighted invoice errors before downloading.", "error");
    if (!window.XLSX) return setStatus("The Excel download library did not load. Refresh the page and try again.", "error");
    if (getSettings().profileKey === "chinese" && app.template?.editable && validateTemplateMapping() === 0) return exportSupplierExcel();
    const settings = getSettings();
    const matrix = buildExportMatrix(true);
    const sheet = window.XLSX.utils.aoa_to_sheet(matrix);
    sheet["!cols"] = outputHeaders().map((header) => ({ wch: header === "Title" ? 72 : header === "Listing Date" ? 28 : 18 }));
    sheet["!freeze"] = { xSplit: 0, ySplit: 2 };
    const range = window.XLSX.utils.decode_range(sheet["!ref"] || "A1:A1");
    for (let row = range.s.r; row <= range.e.r; row += 1) {
      for (let col = range.s.c; col <= range.e.c; col += 1) {
        const cell = sheet[window.XLSX.utils.encode_cell({ r: row, c: col })];
        if (!cell) continue;
        const value = String(cell.v ?? "");
        if (value.startsWith("INVOICE ") || outputHeaders().includes(value)) cell.s = { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "D51F2A" } }, alignment: { wrapText: true } };
        else cell.s = { alignment: { vertical: "top", wrapText: col === (settings.includeInvoiceNumber ? 2 : 1) } };
      }
    }
    const moneyColumns = outputHeaders().map((header, index) => ["Unit Price", "Total", "Tax", "Shipping", "Shipping Cost"].includes(header) ? index : -1).filter((index) => index >= 0);
    matrix.forEach((rowValues, rowIndex) => moneyColumns.forEach((column) => { const cell = sheet[window.XLSX.utils.encode_cell({ r: rowIndex, c: column })]; if (cell && typeof cell.v === "number") cell.z = "0.00"; }));
    const workbook = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(workbook, sheet, "Cleaned Invoices");
    if (settings.includeAudit) {
      const auditHeaders = auditHeadersList();
      const audit = [auditHeaders, ...Core.createProcessingAudit(app.rows, app.invoices)];
      const auditSheet = window.XLSX.utils.aoa_to_sheet(audit);
      auditSheet["!cols"] = auditHeaders.map((header) => ({ wch: header.includes("Title") ? 72 : Math.max(16, header.length + 2) }));
      window.XLSX.utils.book_append_sheet(workbook, auditSheet, "Processing Audit");
    }
    window.XLSX.writeFile(workbook, `cleaned-invoices-${fileStamp()}.xlsx`, { cellStyles: true });
    setStatus("Excel download started.", "ready");
  }

  function exportToCSV() {
    if (app.validation?.critical) return setStatus("Resolve the highlighted invoice errors before downloading.", "error");
    const csv = buildExportMatrix(false).map((row) => row.map(csvCell).join(",")).join("\r\n");
    downloadBlob(`cleaned-invoices-${fileStamp()}.csv`, csv, "text/csv;charset=utf-8");
    setStatus("CSV download started.", "ready");
  }

  async function copyAllResults() {
    if (app.validation?.critical) return;
    const text = buildExportMatrix(false).map((row) => row.join("\t")).join("\n");
    try { await navigator.clipboard.writeText(text); setStatus("All invoice sections copied.", "ready"); }
    catch { const area = document.createElement("textarea"); area.value = text; document.body.appendChild(area); area.select(); document.execCommand("copy"); area.remove(); setStatus("All invoice sections copied.", "ready"); }
  }

  function saveProject() {
    const name = ui.splitterProjectName.value.trim();
    if (!name) return setStatus("Enter a project name before saving.", "error");
    const projects = readProjects();
    projects[name] = {
      savedAt: new Date().toISOString(), sourceName: app.sourceName, matrix: app.matrix, headers: app.headers,
      mapping: app.mapping, rows: app.rows, invalidRows: app.invalidRows,
      invoices: app.invoices.map((invoice) => ({ ...invoice, rows: invoice.rows.map((row) => row.id) })),
      settings: getSettings(), shippingRules: app.shippingRules, template: app.template,
      templateMappings: app.templateMappings, profileOverrides: app.profileOverrides
    };
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    refreshProjectList(name);
    setStatus(`Project “${name}” saved in this browser.`, "ready");
  }

  function loadProject() {
    const name = ui.splitterProjectList.value;
    const project = readProjects()[name];
    if (!project) return setStatus("Select a saved project to load.", "error");
    app.sourceName = project.sourceName; app.matrix = project.matrix; app.headers = project.headers; app.mapping = project.mapping;
    app.rows = project.rows; app.invalidRows = project.invalidRows || [];
    app.shippingRules = project.shippingRules || JSON.parse(JSON.stringify(Core.defaultShippingRules));
    app.template = project.template || null; app.templateMappings = project.templateMappings || {};
    app.profileOverrides = project.profileOverrides || readProfileOverrides();
    const rowMap = new Map(app.rows.map((row) => [row.id, row]));
    app.invoices = project.invoices.map((invoice) => ({ ...invoice, rows: invoice.rows.map((id) => rowMap.get(id)).filter(Boolean) }));
    applySettings(project.settings || {});
    app.history = []; app.selected.clear();
    renderMapping();
    renderErrors(); renderTitleReview(); renderTemplateMapping(); renderTemplateStatus(); renderShippingRuleEditor(); renderAll(); ui.splitterProjectName.value = name;
    setStatus(`Project “${name}” loaded.`, "ready");
  }

  function deleteProject() {
    const name = ui.splitterProjectList.value;
    if (!name) return setStatus("Select a saved project to delete.", "error");
    const projects = readProjects(); delete projects[name]; localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    refreshProjectList(); setStatus(`Project “${name}” deleted from this browser.`, "ready");
  }

  function readProjects() { try { return JSON.parse(localStorage.getItem(PROJECTS_KEY) || "{}"); } catch { return {}; } }
  function refreshProjectList(selected = "") {
    const projects = readProjects(), names = Object.keys(projects).sort((a, b) => a.localeCompare(b));
    ui.splitterProjectList.innerHTML = names.length ? names.map((name) => `<option value="${escapeHtml(name)}" ${name === selected ? "selected" : ""}>${escapeHtml(name)}</option>`).join("") : '<option value="">No saved projects</option>';
  }

  function applySettings(settings) {
    ui.splitterMinRows.value = settings.minimum ?? 8; ui.splitterMaxRows.value = settings.maximum ?? 10;
    ui.splitterSort.value = settings.sort || "oldest"; ui.splitterDateFormat.value = settings.dateFormat || "original";
    ui.splitterInvoiceColumn.checked = settings.includeInvoiceNumber !== false; ui.splitterInvoiceStart.value = settings.invoiceStart ?? 392841;
    ui.splitterInvoiceGapMin.value = settings.invoiceGapMin ?? 76; ui.splitterInvoiceGapMax.value = settings.invoiceGapMax ?? 145;
    ui.splitterInvoicePrefix.value = settings.invoicePrefix || ""; ui.splitterInvoiceSuffix.value = settings.invoiceSuffix || "";
    ui.splitterAudit.checked = Boolean(settings.includeAudit); ui.splitterTrailingRows.checked = Boolean(settings.trailingRows); ui.splitterAdvanced.checked = Boolean(settings.advanced);
    ui.splitterSupplierProfile.value = settings.profileKey || ""; ui.splitterDestination.value = destinationOption(settings.destinationCountry);
    ui.splitterShippingOrigin.value = settings.shippingOrigin || ""; ui.splitterShippingMethod.value = settings.shippingMethod || "automatic"; ui.splitterManualShipping.value = settings.manualShipping || "";
    ui.splitterInvoiceDateStart.value = settings.dateStart || "";
    ui.splitterInvoiceDateEnd.value = settings.dateEnd || "";
    app.automaticDateStart = ui.splitterInvoiceDateStart.value;
    app.automaticDateEnd = ui.splitterInvoiceDateEnd.value;
    ui.splitterTotalsDisplay.value = settings.totalsDisplay || "repeat";
    handleSupplierProfileChange(); handleDestinationChange(); handleShippingMethodChange();
  }

  function resetSplitter() {
    Object.assign(app, { sourceName: "", matrix: [], headers: [], mapping: {}, rows: [], invalidRows: [], invoices: [], history: [], selected: new Set(), selectedTitleRows: new Set(), validation: null, template: null, templateMappings: {}, automaticDateStart: "", automaticDateEnd: "" });
    ui.splitterFile.value = ""; ui.splitterFileName.textContent = ".xlsx, .xls or .csv"; ui.splitterPaste.value = "";
    ui.splitterInvoiceDateStart.value = ""; ui.splitterInvoiceDateEnd.value = "";
    ui.splitterErrorsPanel.classList.add("is-hidden"); ui.splitterResultsSection.classList.add("is-hidden");
    [ui.splitterRegeneratePrices, ui.splitterRegenerateQty, ui.splitterRegroup, ui.splitterRegenerateInvoiceNumbers].forEach((button) => { button.disabled = true; });
    ui.splitterTemplateFile.value = ""; renderTemplateMapping(); renderTemplateStatus();
    setStatus("Waiting for data", "neutral");
    updateCountryGate();
  }

  function readProfileOverrides() {
    try { return JSON.parse(localStorage.getItem(PROFILE_OVERRIDES_KEY) || "{}"); } catch { return {}; }
  }

  function getActiveProfile() {
    return Core.getSupplierProfile(ui.splitterSupplierProfile?.value || "custom", app.profileOverrides);
  }

  function handleSupplierProfileChange() {
    const key = ui.splitterSupplierProfile.value;
    const profileValue = Core.getSupplierProfile(key || "custom", app.profileOverrides);
    ui.splitterProfileStatus.textContent = !key ? "Required" : "Selected";
    ui.splitterProfileStatus.className = `status-pill ${key ? "is-ready" : "is-warning"}`;
    if (profileValue.originCountry) ui.splitterShippingOrigin.value = profileValue.originCountry;
    ui.splitterChineseSettings?.classList.toggle("is-profile-muted", key !== "chinese");
    updateCountryGate();
    if (app.rows.length) renderAll();
  }

  function getInvoiceDateRangeState() {
    const startValue = ui.splitterInvoiceDateStart.value;
    const endValue = ui.splitterInvoiceDateEnd.value;
    const start = Core.parseDateInput(startValue);
    const end = Core.parseDateInput(endValue);
    return {
      complete: Boolean(startValue && endValue),
      valid: Boolean(start && end && start <= end),
      startValue,
      endValue
    };
  }

  function handleInvoiceDateRangeChange() {
    const range = getInvoiceDateRangeState();
    app.automaticDateStart = range.startValue;
    app.automaticDateEnd = range.endValue;
    if (app.invoices.length) app.invoices.forEach((invoice) => { invoice.invoiceDate = ""; invoice.dateError = ""; });
    updateCountryGate();
  }

  function handleDestinationChange() {
    updateCountryGate();
    if (ui.splitterDestination.value) {
      ui.splitterRuleDestination.value = ui.splitterDestination.value;
      renderShippingRuleEditor();
    }
    if (app.invoices.length) { app.invoices.forEach((invoice) => { invoice.shippingSignature = ""; }); assignInvoiceMetadata(false); renderAll(); }
  }

  function updateCountryGate() {
    const countrySelected = Boolean(ui.splitterDestination.value);
    const supplierSelected = Boolean(ui.splitterSupplierProfile.value);
    const range = getInvoiceDateRangeState();
    const readyForDates = countrySelected && supplierSelected;
    const readyForCleaning = readyForDates && range.valid;
    ui.splitterCountryStatus.textContent = countrySelected ? "Selected" : "Required";
    ui.splitterCountryStatus.className = `status-pill ${countrySelected ? "is-ready" : "is-warning"}`;
    ui.splitterSupplierProfile.disabled = !countrySelected;
    ui.splitterInvoiceDateStart.disabled = !readyForDates;
    ui.splitterInvoiceDateEnd.disabled = !readyForDates;
    ui.splitterTemplateFile.disabled = !readyForCleaning;
    ui.splitterDateRangeStatus.textContent = range.valid ? "Selected" : range.complete ? "Check dates" : "Required";
    ui.splitterDateRangeStatus.className = `status-pill ${range.valid ? "is-ready" : range.complete ? "is-error" : "is-warning"}`;
    ui.splitterDateRangeError.textContent = range.complete && !range.valid ? "Start date must be on or before the end date." : "";
    const setupStages = { country: countrySelected, supplier: supplierSelected, dates: range.valid };
    let currentSetupAssigned = false;
    document.querySelectorAll("[data-setup-stage]").forEach((card) => {
      const complete = Boolean(setupStages[card.dataset.setupStage]);
      const current = !complete && !currentSetupAssigned;
      card.classList.toggle("is-stage-complete", complete);
      card.classList.toggle("is-stage-current", current);
      if (current) currentSetupAssigned = true;
    });
    [ui.splitterFile, ui.splitterPaste, ui.splitterReadPaste, ui.splitterUploadTrigger, ui.splitterProcess]
      .forEach((element) => { element.disabled = !readyForCleaning; });
    if (!countrySelected) setStatus("Step 1: select a country to continue", "warning");
    else if (!supplierSelected) setStatus("Step 2: select a supplier name to continue", "warning");
    else if (!range.complete) setStatus("Step 3: select the invoice start and end dates", "warning");
    else if (!range.valid) setStatus("Invoice start date must be on or before the end date", "error");
    else if (!app.matrix.length) setStatus("Required setup complete. Choose a template or upload data.", "ready");
    renderTemplateStatus();
    updateWorkflowProgress();
  }

  function updateWorkflowProgress() {
    if (!ui.splitterWorkflowSteps) return;
    const states = [
      Boolean(ui.splitterDestination.value),
      Boolean(ui.splitterSupplierProfile.value),
      getInvoiceDateRangeState().valid,
      Boolean(app.matrix.length),
      Boolean(app.rows.length),
      Boolean(app.invoices.length),
      Boolean(app.invoices.length && app.validation),
      Boolean(app.invoices.length && app.validation && !app.validation.critical)
    ];
    let activeAssigned = false;
    Array.from(ui.splitterWorkflowSteps.querySelectorAll("[data-workflow-step]")).forEach((step, index) => {
      step.classList.remove("is-complete", "is-current");
      if (states[index]) step.classList.add("is-complete");
      else if (!activeAssigned) { step.classList.add("is-current"); activeAssigned = true; }
    });
  }

  function handleShippingMethodChange() {
    ui.splitterManualShippingRow.classList.toggle("is-hidden", ui.splitterShippingMethod.value !== "manual");
  }

  function validateProcessingSetup(profileValue, settings) {
    const errors = [];
    if (!settings.profileKey) errors.push("Select and confirm a Supplier Profile.");
    if (profileValue?.configured) Core.validateSupplierConfiguration(profileValue).forEach((error) => { if (error !== "Supplier Profile Not Fully Configured") errors.push(error); });
    if (!settings.destinationCountry) errors.push("Select a Destination Country.");
    if (!settings.shippingOrigin) errors.push("Shipping Origin is required.");
    if (!settings.dateStart || !settings.dateEnd) errors.push("Invoice Date Range Start and End are required.");
    const start = Core.parseDateInput(settings.dateStart), end = Core.parseDateInput(settings.dateEnd);
    if (start && end && start > end) errors.push("Invoice Date Range Start must be before the End date.");
    if (settings.profileKey === "chinese") {
      if (settings.shippingMethod === "manual" && (parseMoney(settings.manualShipping) === null || parseMoney(settings.manualShipping) < 0)) errors.push("Enter a valid manual shipping charge.");
    }
    return errors;
  }

  function destinationOption(value) {
    const standard = ["United Kingdom", "United States", "Germany", "France", "Italy", "Australia", "Canada"];
    return standard.includes(value) ? value : "";
  }

  function renderShippingRuleEditor() {
    const origin = ui.splitterRuleOrigin.value.trim() || "China";
    const destination = ui.splitterRuleDestination.value || "United Kingdom";
    const rule = Core.getShippingRule(app.shippingRules, origin, destination) || {};
    ui.splitterRuleBase.value = cents(rule.baseCents || 0);
    ui.splitterRuleMin.value = cents(rule.minimumCents || 0);
    ui.splitterRuleMax.value = rule.maximumCents ? cents(rule.maximumCents) : "";
    ui.splitterRulePercentMin.value = ((rule.minimumBasisPoints || 0) / 100).toFixed(2);
    ui.splitterRulePercentMax.value = ((rule.maximumBasisPoints || 0) / 100).toFixed(2);
    ui.splitterRulePerLine.value = cents(rule.perLineCents || 0);
    ui.splitterRulePerQty.value = cents(rule.perQuantityCents || 0);
    ui.splitterRuleRounding.value = rule.roundingMethod || "nearest-cent";
  }

  function saveShippingRule() {
    const origin = ui.splitterRuleOrigin.value.trim(), destination = ui.splitterRuleDestination.value;
    if (!origin || !destination) return setStatus("Origin and destination are required for a shipping rule.", "error");
    const values = [ui.splitterRuleBase, ui.splitterRuleMin, ui.splitterRulePercentMin, ui.splitterRulePercentMax].map((input) => parseMoney(input.value));
    if (values.some((value) => value === null || value < 0)) return setStatus("Enter valid non-negative shipping rule values.", "error");
    const maximum = parseMoney(ui.splitterRuleMax.value);
    app.shippingRules[`${origin}|${destination}`] = {
      originCountry: origin, destinationCountry: destination, baseCents: Math.round(values[0] * 100),
      minimumCents: Math.round(values[1] * 100), maximumCents: maximum === null ? null : Math.round(maximum * 100),
      minimumBasisPoints: Math.round(values[2] * 100), maximumBasisPoints: Math.round(values[3] * 100),
      perLineCents: Math.round((parseMoney(ui.splitterRulePerLine.value) || 0) * 100),
      perQuantityCents: Math.round((parseMoney(ui.splitterRulePerQty.value) || 0) * 100),
      roundingMethod: ui.splitterRuleRounding.value
    };
    if (app.shippingRules[`${origin}|${destination}`].maximumBasisPoints < app.shippingRules[`${origin}|${destination}`].minimumBasisPoints) return setStatus("Maximum shipping percentage must be at least the minimum.", "error");
    app.invoices.forEach((invoice) => { invoice.shippingSignature = ""; });
    if (app.invoices.length) { assignInvoiceMetadata(false); renderAll(); }
    setStatus("Shipping rule saved. Existing affected invoices were recalculated.", "warning");
  }

  function resetShippingRules() {
    app.shippingRules = JSON.parse(JSON.stringify(Core.defaultShippingRules));
    renderShippingRuleEditor();
    app.invoices.forEach((invoice) => { invoice.shippingSignature = ""; });
    if (app.invoices.length) { assignInvoiceMetadata(false); renderAll(); }
    setStatus("Suggested shipping rules restored.", "ready");
  }

  function applyShippingRounding(value, method) {
    if (method === "nearest-whole") return Math.round(value / 100) * 100;
    if (method === "nearest-0.05") return Math.round(value / 5) * 5;
    return Math.round(value);
  }

  function renderTitleReview() {
    if (!ui.splitterTitleReviewPanel || !ui.splitterTitleReview) return;
    ui.splitterTitleReviewPanel.classList.toggle("is-hidden", !app.rows.length);
    const low = app.rows.filter((row) => row.variationConfidence === "Low").length;
    ui.splitterLowConfidenceCount.textContent = `${low} low-confidence variation${low === 1 ? "" : "s"}`;
    ui.splitterTitleReview.innerHTML = app.rows.map((row) => `<tr class="${row.variationConfidence === "Low" ? "low-confidence-row" : ""}"><td><input type="checkbox" data-title-select="${row.id}" ${app.selectedTitleRows.has(row.id) ? "checked" : ""} /></td><td>${escapeHtml(row.originalTitle)}</td><td><input data-variation-edit="${row.id}" value="${escapeHtml(row.normalizedVariation)}" /></td><td><input class="wide-title-input" data-title-edit="${row.id}" value="${escapeHtml(row.finalWholesaleTitle)}" /></td><td>${escapeHtml(row.variationType)}</td><td><span class="confidence-badge confidence-${row.variationConfidence.toLowerCase()}">${row.variationConfidence}</span></td><td>${escapeHtml(row.reviewStatus)}</td></tr>`).join("");
    ui.splitterTitleReview.querySelectorAll("[data-title-select]").forEach((input) => input.addEventListener("change", () => { input.checked ? app.selectedTitleRows.add(input.dataset.titleSelect) : app.selectedTitleRows.delete(input.dataset.titleSelect); }));
    ui.splitterTitleReview.querySelectorAll("[data-title-edit]").forEach((input) => input.addEventListener("change", () => { const row = app.rows.find((item) => item.id === input.dataset.titleEdit); if (row) { row.finalWholesaleTitle = input.value.trim() || row.finalWholesaleTitle; row.reviewStatus = "Edited"; renderAll(); } }));
    ui.splitterTitleReview.querySelectorAll("[data-variation-edit]").forEach((input) => input.addEventListener("change", () => { const row = app.rows.find((item) => item.id === input.dataset.variationEdit); if (row) { row.normalizedVariation = Core.normalizeVariation(input.value); row.variationType = Core.detectVariationType(row.normalizedVariation, row.originalTitle, []); row.variationConfidence = Core.calculateVariationConfidence(row.normalizedVariation, row.variationType); row.finalWholesaleTitle = Core.appendVariationInBrackets(row.cleanedBaseTitle, row.normalizedVariation); row.reviewStatus = "Edited"; renderTitleReview(); renderAll(); } }));
  }

  function selectedTitleRows() { return app.rows.filter((row) => app.selectedTitleRows.has(row.id)); }
  function approveHighConfidence() { app.rows.filter((row) => row.variationConfidence === "High").forEach((row) => { row.reviewStatus = "Approved"; }); renderTitleReview(); }
  function focusSelectedTitle() { const rows = selectedTitleRows(); if (rows.length !== 1) return setStatus("Select exactly one title to edit.", "error"); ui.splitterTitleReview.querySelector(`[data-title-edit="${rows[0].id}"]`)?.focus(); }
  function focusSelectedVariation() { const rows = selectedTitleRows(); if (rows.length !== 1) return setStatus("Select exactly one variation to edit.", "error"); ui.splitterTitleReview.querySelector(`[data-variation-edit="${rows[0].id}"]`)?.focus(); }
  function resetSelectedTitles() {
    const targets = selectedTitleRows().length ? selectedTitleRows() : app.rows;
    targets.forEach((row) => {
      row.normalizedVariation = Core.normalizeVariation(row.originalVariation);
      row.variationType = Core.detectVariationType(row.normalizedVariation, row.originalTitle, []);
      row.variationConfidence = Core.calculateVariationConfidence(row.normalizedVariation, row.variationType);
      row.cleanedBaseTitle = Core.generateWholesaleBaseTitle(row.originalTitle, row.originalVariation);
      row.finalWholesaleTitle = Core.appendVariationInBrackets(row.cleanedBaseTitle, row.normalizedVariation);
      row.reviewStatus = "Reset";
    });
    renderTitleReview(); renderAll();
  }

  function applyTitleToProductGroup() {
    const rows = selectedTitleRows();
    if (rows.length !== 1) return setStatus("Select one reviewed row as the product-group title source.", "error");
    const source = rows[0];
    const base = source.finalWholesaleTitle.replace(/\s*\([^()]+\)\s*$/, "").trim();
    app.rows.filter((row) => row.productGroupId === source.productGroupId).forEach((row) => { row.cleanedBaseTitle = base; row.finalWholesaleTitle = Core.appendVariationInBrackets(base, row.normalizedVariation); row.reviewStatus = "Group Updated"; });
    renderTitleReview(); renderAll();
  }

  function regenerateInvoiceNumbers() {
    if (!app.invoices.length) return;
    if (!window.confirm("Regenerate all stored invoice numbers? Existing invoice numbers will be replaced.")) return;
    app.invoices.forEach((invoice) => { invoice.invoiceNumber = null; });
    assignInvoiceMetadata(true); renderAll(); setStatus("Invoice numbers and dates regenerated.", "warning");
  }

  const templateFields = [
    ["invoiceNumber", "Invoice Number"], ["invoiceDate", "Invoice Date"],
    ["destinationCountry", "Destination Country"], ["itemTitle", "Item Title (first row)"], ["unitPrice", "Unit Price (first row)"],
    ["quantity", "Quantity (first row)"], ["lineTotal", "Line Total (first row)"], ["subtotal", "Sub Total"], ["tax", "Tax"],
    ["shipping", "Shipping"], ["grandTotal", "Grand Total"]
  ];

  function renderTemplateMapping() {
    ui.splitterTemplateMapping.innerHTML = templateFields.map(([key, label]) => `<label>${label}<input data-template-field="${key}" value="${escapeHtml(app.templateMappings[key] || "")}" placeholder="Cell or coordinate" /></label>`).join("");
    ui.splitterTemplateMapping.querySelectorAll("[data-template-field]").forEach((input) => input.addEventListener("input", () => { app.templateMappings[input.dataset.templateField] = input.value.trim().toUpperCase(); renderTemplateStatus(); if (app.rows.length) renderAll(); }));
  }

  async function handleTemplateUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const extension = file.name.split(".").pop().toLowerCase();
    const buffer = await file.arrayBuffer();
    app.template = { name: file.name, extension, type: file.type, dataBase64: arrayBufferToBase64(buffer), editable: ["xlsx", "xls"].includes(extension) };
    app.templateMappings = {};
    if (app.template.editable && window.XLSX) autoMapExcelTemplate(buffer);
    renderTemplateMapping(); renderTemplateStatus(); renderTemplatePreview();
    if (app.rows.length) renderAll();
    updateWorkflowProgress();
  }

  function autoMapExcelTemplate(buffer) {
    const workbook = window.XLSX.read(buffer, { type: "array", cellStyles: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]], range = window.XLSX.utils.decode_range(sheet["!ref"] || "A1:A1");
    const aliases = { invoiceNumber: ["invoice number", "invoice #", "invoice no"], invoiceDate: ["invoice date", "date"], destinationCountry: ["destination country", "country"], itemTitle: ["title", "item title", "description"], unitPrice: ["unit price", "price"], quantity: ["qty", "quantity"], lineTotal: ["total", "line total"], subtotal: ["sub total", "subtotal"], tax: ["tax"], shipping: ["shipping", "freight"], grandTotal: ["grand total", "amount due"] };
    for (let row = range.s.r; row <= Math.min(range.e.r, 80); row += 1) for (let col = range.s.c; col <= Math.min(range.e.c, 30); col += 1) {
      const address = window.XLSX.utils.encode_cell({ r: row, c: col }), value = String(sheet[address]?.v || "").trim().toLowerCase();
      Object.entries(aliases).forEach(([field, values]) => {
        if (!app.templateMappings[field] && values.includes(value)) {
          const target = ["itemTitle", "unitPrice", "quantity", "lineTotal"].includes(field) ? { r: row + 1, c: col } : { r: row, c: col + 1 };
          app.templateMappings[field] = window.XLSX.utils.encode_cell(target);
        }
      });
    }
  }

  function renderTemplateStatus() {
    if (!getInvoiceDateRangeState().valid) {
      ui.splitterTemplateName.textContent = "Complete invoice date range first";
      ui.splitterTemplateStatus.textContent = "Locked until dates are valid";
      ui.splitterTemplateStatus.className = "status-pill is-warning";
    } else if (!app.template) {
      ui.splitterTemplateName.textContent = "Excel editable · PDF/image preview only";
      ui.splitterTemplateStatus.textContent = "Optional · standard export available";
      ui.splitterTemplateStatus.className = "status-pill";
    } else {
      ui.splitterTemplateName.textContent = app.template.name;
      const valid = app.template.editable && validateTemplateMapping() === 0;
      ui.splitterTemplateStatus.textContent = valid ? "Template mapped" : app.template.editable ? "Standard export available · complete mappings for template layout" : "Preview only · standard Excel export available";
      ui.splitterTemplateStatus.className = `status-pill ${valid ? "is-ready" : "is-warning"}`;
    }
  }

  function renderTemplatePreview() {
    if (!app.template) { ui.splitterTemplatePreview.textContent = "No template selected"; return; }
    const url = `data:${app.template.type || "application/octet-stream"};base64,${app.template.dataBase64}`;
    if (/^image\//.test(app.template.type)) ui.splitterTemplatePreview.innerHTML = `<img src="${url}" alt="Chinese invoice template preview" />`;
    else if (app.template.extension === "pdf") ui.splitterTemplatePreview.innerHTML = `<embed src="${url}" type="application/pdf" />`;
    else ui.splitterTemplatePreview.innerHTML = `<strong>${escapeHtml(app.template.name)}</strong><span>Excel template loaded for mapped cell replacement.</span>`;
  }

  function validateTemplateMapping() {
    if (getSettings().profileKey !== "chinese") return 0;
    if (!app.template) return 0;
    if (!app.template.editable) return 1;
    return templateFields.filter(([key]) => !/^[A-Z]+\d+$/.test(app.templateMappings[key] || "")).length;
  }

  function validateInvoiceNumbers() {
    let errors = 0;
    app.invoices.forEach((invoice, index) => {
      const value = Number(invoice.invoiceNumber);
      const previous = index ? Number(app.invoices[index - 1].invoiceNumber) : null;
      if (!/^\d{6}$/.test(String(value)) || (previous != null && value - previous < 201)) errors += 1;
    });
    return errors;
  }

  function exportSupplierExcel() {
    if (!app.template?.editable || !app.template.dataBase64) return;
    const source = base64ToArrayBuffer(app.template.dataBase64);
    const original = window.XLSX.read(source, { type: "array", cellStyles: true, cellDates: false });
    const baseSheet = original.Sheets[original.SheetNames[0]];
    const workbook = window.XLSX.utils.book_new();
    app.invoices.forEach((invoice) => {
      const sheet = JSON.parse(JSON.stringify(baseSheet));
      const values = { invoiceNumber: invoiceLabel(invoice), invoiceDate: invoice.invoiceDate, billTo: getSettings().billTo, shipTo: getSettings().shipTo, destinationCountry: invoice.destinationCountry, subtotal: invoice.subtotalCents / 100, tax: invoice.taxCents / 100, shipping: invoice.shippingCents / 100, grandTotal: invoice.grandTotalCents / 100 };
      const itemRows = invoice.rows.map((row) => ({ itemTitle: row.finalWholesaleTitle, unitPrice: row.unitPriceCents / 100, quantity: row.qty, lineTotal: row.totalCents / 100 }));
      Core.mapTemplateFields(sheet, app.templateMappings, values, itemRows);
      window.XLSX.utils.book_append_sheet(workbook, sheet, `Invoice ${invoice.number}`.slice(0, 31));
    });
    if (getSettings().includeAudit) {
      const auditSheet = window.XLSX.utils.aoa_to_sheet([auditHeadersList(), ...Core.createProcessingAudit(app.rows, app.invoices)]);
      auditSheet["!cols"] = auditHeadersList().map((header) => ({ wch: header.includes("Title") ? 70 : Math.max(14, header.length + 2) }));
      window.XLSX.utils.book_append_sheet(workbook, auditSheet, "Processing Audit");
    }
    window.XLSX.writeFile(workbook, `chinese-commercial-invoices-${fileStamp()}.xlsx`, { cellStyles: true });
  }

  function auditHeadersList() {
    return ["Original Row Number", "Supplier", "Original Title", "Original Variation", "Cleaned Base Title", "Normalized Variation", "Final Wholesale Title", "Variation Confidence", "Available Quantity", "Sold Quantity", "Start Price", "Random Percentage", "Unit Price", "Random Extra Quantity", "QTY", "Total", "Original Start Date", "Assigned Invoice", "Invoice Number", "Invoice Date", "Sub Total", "Tax", "Shipping", "Shipping Method", "Origin Country", "Destination Country", "Grand Total", "Validation Status"];
  }

  function renderProfileEditor() {
    const key = ui.splitterProfileEditorSelect.value;
    const value = Core.getSupplierProfile(key, app.profileOverrides);
    ui.splitterProfileOrigin.value = value.originCountry || "";
    ui.splitterProfileDestinations.value = (value.destinationCountries || []).join(", ");
    ui.splitterProfileRequired.value = (value.requiredInputColumns || []).join(", ");
    ui.splitterProfileOutputs.value = (value.outputColumns || []).join(", ");
    ui.splitterProfileTaxType.value = value.taxRules?.mode || "none"; ui.splitterProfileTaxRate.value = value.taxRules?.rate || 0; ui.splitterProfileTaxLabel.value = value.taxRules?.label || "Tax";
    ui.splitterProfileNumberFormat.value = value.invoiceNumberFormat || ""; ui.splitterProfileDateFormat.value = value.invoiceDateRules?.format || ""; ui.splitterProfileCurrency.value = value.currencyRules?.display || "";
    ui.splitterProfileTitleRules.value = value.titleCleaningRules?.notes || ""; ui.splitterProfileTemplateMappings.value = value.templateMappingNotes || "";
    ui.splitterProfileFixedFields.value = (value.additionalFixedFields || []).join(", "); ui.splitterProfileCalculatedFields.value = (value.additionalCalculatedFields || []).join(", "); ui.splitterProfileConfigured.checked = Boolean(value.configured);
    ui.splitterZoroFields.classList.toggle("is-hidden", key !== "zoro"); renderZoroFieldList(value.zoroExcelFields || []);
  }

  function saveSupplierProfile() {
    const key = ui.splitterProfileEditorSelect.value;
    app.profileOverrides[key] = {
      originCountry: ui.splitterProfileOrigin.value.trim(), destinationCountries: splitList(ui.splitterProfileDestinations.value),
      requiredInputColumns: splitList(ui.splitterProfileRequired.value), outputColumns: splitList(ui.splitterProfileOutputs.value),
      taxRules: { mode: ui.splitterProfileTaxType.value, rate: Number(ui.splitterProfileTaxRate.value) || 0, label: ui.splitterProfileTaxLabel.value.trim() || "Tax" },
      invoiceNumberFormat: ui.splitterProfileNumberFormat.value.trim(), invoiceDateRules: { format: ui.splitterProfileDateFormat.value.trim() },
      currencyRules: { display: ui.splitterProfileCurrency.value.trim() }, titleCleaningRules: { enabled: true, notes: ui.splitterProfileTitleRules.value.trim() },
      templateMappingNotes: ui.splitterProfileTemplateMappings.value.trim(), additionalFixedFields: splitList(ui.splitterProfileFixedFields.value),
      additionalCalculatedFields: splitList(ui.splitterProfileCalculatedFields.value), configured: ui.splitterProfileConfigured.checked,
      zoroExcelFields: app.profileOverrides[key]?.zoroExcelFields || []
    };
    localStorage.setItem(PROFILE_OVERRIDES_KEY, JSON.stringify(app.profileOverrides));
    handleSupplierProfileChange(); setStatus(`${Core.getSupplierProfile(key, app.profileOverrides).profileName} profile saved.`, "ready");
  }

  function addZoroField() {
    const name = ui.splitterZoroFieldName.value.trim();
    if (!name) return setStatus("Enter a Zoro field name.", "error");
    const current = app.profileOverrides.zoro || {};
    current.zoroExcelFields = current.zoroExcelFields || [];
    current.zoroExcelFields.push({ name, type: ui.splitterZoroFieldType.value }); app.profileOverrides.zoro = current;
    ui.splitterZoroFieldName.value = ""; renderZoroFieldList(current.zoroExcelFields);
  }

  function renderZoroFieldList(fields) { ui.splitterZoroFieldList.innerHTML = fields.length ? fields.map((field, index) => `<span>${escapeHtml(field.name)} · ${escapeHtml(field.type)} <button type="button" data-remove-zoro="${index}">×</button></span>`).join("") : "No Zoro fields configured."; ui.splitterZoroFieldList.querySelectorAll("[data-remove-zoro]").forEach((button) => button.addEventListener("click", () => { app.profileOverrides.zoro.zoroExcelFields.splice(Number(button.dataset.removeZoro), 1); renderZoroFieldList(app.profileOverrides.zoro.zoroExcelFields); })); }
  function splitList(value) { return String(value || "").split(",").map((item) => item.trim()).filter(Boolean); }
  function arrayBufferToBase64(buffer) { let binary = ""; new Uint8Array(buffer).forEach((byte) => { binary += String.fromCharCode(byte); }); return btoa(binary); }
  function base64ToArrayBuffer(base64) { const binary = atob(base64), bytes = new Uint8Array(binary.length); for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index); return bytes.buffer; }

  function parseWholeNumber(value) {
    const text = String(value ?? "").trim().replace(/,/g, "");
    if (!/^-?\d+$/.test(text)) return null;
    const number = Number(text); return Number.isSafeInteger(number) ? number : null;
  }

  function parseMoney(value) {
    const text = String(value ?? "").trim().replace(/[$£€,%\s]/g, "").replace(/,/g, "");
    if (!/^-?(?:\d+\.?\d*|\.\d+)$/.test(text)) return null;
    const number = Number(text); return Number.isFinite(number) ? number : null;
  }

  function cents(value) { return (Number(value) / 100).toFixed(2); }
  function csvCell(value) { const text = String(value ?? ""); return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text; }
  function escapeHtml(value) { return String(value ?? "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char])); }
  function fileStamp() { return new Date().toISOString().slice(0, 10); }
  function downloadBlob(name, content, type) { const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob(["\uFEFF", content], { type })); link.download = name; link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 1000); }
  function setStatus(message, kind) { ui.splitterInputStatus.textContent = message; ui.splitterInputStatus.className = `status-pill ${kind === "error" ? "is-error" : kind === "warning" ? "is-warning" : kind === "ready" ? "is-ready" : ""}`; }
})();
