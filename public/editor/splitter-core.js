(function (root) {
  "use strict";

  const CHINESE_COLUMNS = [
    "Title", "QTY", "Unit Price", "Invoice Date", "Invoice #", "Shipping"
  ];
  const ZORO_COLUMNS = [
    "Title", "QTY", "Unit Price", "Z NUMBER", "Date", "Invoice #", "Customer #",
    "Due Date", "SO #", "Purchase Order", "Ship Date", "Shipping Cost", "Total", "Tax"
  ];
  const MAX_WHOLESALE_TITLE_LENGTH = 72;

  const baseProfile = {
    requiredInputColumns: ["supplier", "title", "variation", "available", "startPrice", "sold", "startDate"],
    requiredCaseFields: [],
    titleCleaningRules: { enabled: true, targetMinimum: 35, targetMaximum: MAX_WHOLESALE_TITLE_LENGTH },
    variationRules: { bracketStyle: "round", preserveUnsupportedMeaning: true },
    unitPriceRules: null,
    quantityRules: null,
    invoiceGroupingRules: { minimumRows: 8, maximumRows: 10, largeVariationMinimum: 6 },
    invoiceNumberRules: null,
    invoiceDateRules: null,
    taxRules: null,
    shippingRules: null,
    currencyRules: { display: "profile-defined" },
    outputColumns: ["Supplier Name", "Title", "Unit Price", "QTY", "Total", "Listing Date"],
    templateRequirements: { requiredForFinalExport: false, supportedEditableFormats: ["xlsx", "xls"] },
    validationRules: {},
    exportRules: { processingAuditDefault: false },
    configured: false
  };

  function profile(key, profileName, originCountry, extra) {
    return Object.assign({}, baseProfile, { profileKey: key, profileName, originCountry }, extra || {});
  }

  const supplierProfiles = {
    chinese: profile("chinese", "Chinese", "China", {
      configured: true,
      requiredCaseFields: ["caseNumber", "billTo", "shipTo", "destinationCountry", "dateRangeStart", "dateRangeEnd"],
      unitPriceRules: { minimumBasisPoints: 2801, maximumBasisPoints: 3299, excludedBasisPoints: [2900, 3000, 3100, 3200] },
      quantityRules: { extraMinimum: 8, extraMaximum: 15 },
      invoiceNumberRules: { digits: 6, minimumGap: 201, maximumGap: 499 },
      invoiceDateRules: { format: "DD-MM-YYYY", beforeEarliestListingDefault: true },
      taxRules: { mode: "fixed", valueCents: 0, locked: true, label: "Tax" },
      shippingRules: { mode: "country-bands", estimatedDisclosureRequired: true },
      currencyRules: { display: "numbers-only", symbol: "" },
      outputColumns: CHINESE_COLUMNS,
      templateRequirements: {
        requiredForFinalExport: true,
        supportedEditableFormats: ["xlsx", "xls"],
        previewOnlyFormats: ["pdf", "png", "jpg", "jpeg", "webp"]
      }
    }),
    gosupps: profile("gosupps", "Go Supps", "United States"),
    twWholesale: profile("twWholesale", "TW Wholesale", "United Kingdom"),
    autodoc: profile("autodoc", "Auto Doc", "Germany"),
    zoro: profile("zoro", "Zoro", "United States", { zoroExcelFields: [], outputColumns: ZORO_COLUMNS }),
    vetuk: profile("vetuk", "Vet UK", "United Kingdom"),
    poundWholesale: profile("poundWholesale", "Pound wholesale", "United Kingdom"),
    costcoUSA: profile("costcoUSA", "Costco USA", "United States"),
    costcoUK: profile("costcoUK", "Costco UK", "United Kingdom"),
    sunsky: profile("sunsky", "SunSky", "China"),
    blowout: profile("blowout", "Blowout", "United States"),
    jellycat: profile("jellycat", "Jellycat", "United Kingdom"),
    qogita: profile("qogita", "Qogita", "United Kingdom / European warehouse"),
    pcsBooks: profile("pcsBooks", "PCS Books", "United Kingdom"),
    sephora: profile("sephora", "Sephora", "France"),
    bestway: profile("bestway", "Bestway", "United Kingdom"),
    justmae: profile("justmae", "Justmae", "United Kingdom"),
    everydaySupply: profile("everydaySupply", "Everyday Supply", "United Kingdom"),
    sephoraUSA: profile("sephoraUSA", "Sephora USA", "United States"),
    sephoraUK: profile("sephoraUK", "Sephora UK", "United Kingdom"),
    custom: profile("custom", "Custom Supplier", "")
  };

  const shippingBands = [
    ["United Kingdom", 1800, 2400, null, 700, 1100],
    ["United States", 2200, 2900, null, 800, 1200],
    ["Germany", 2000, 2600, null, 750, 1150],
    ["France", 2000, 2600, null, 750, 1150],
    ["Italy", 2100, 2700, null, 800, 1200],
    ["Australia", 2500, 3400, null, 900, 1300],
    ["Canada", 2300, 3100, null, 850, 1250],
    ["Other", 2500, 3500, null, 900, 1300]
  ];

  const defaultShippingRules = Object.fromEntries(shippingBands.map((band) => {
    const [destinationCountry, baseCents, minimumCents, maximumCents, minimumBasisPoints, maximumBasisPoints] = band;
    return [`China|${destinationCountry}`, {
      originCountry: "China", destinationCountry, baseCents, minimumCents, maximumCents,
      minimumBasisPoints, maximumBasisPoints, perLineCents: 0, perQuantityCents: 0, roundingMethod: "nearest-cent"
    }];
  }));

  const automaticShippingOrigins = ["United Kingdom", "United States", "Germany", "France", "United Kingdom / European warehouse"];
  const europeanLocations = new Set(["United Kingdom", "Germany", "France", "Italy", "United Kingdom / European warehouse"]);
  automaticShippingOrigins.forEach((originCountry) => shippingBands.forEach((band) => {
    const [destinationCountry, internationalBase, internationalMinimum, maximumCents, internationalMinimumRate, internationalMaximumRate] = band;
    const domestic = originCountry === destinationCountry || (originCountry === "United Kingdom / European warehouse" && destinationCountry === "United Kingdom");
    const regional = !domestic && europeanLocations.has(originCountry) && europeanLocations.has(destinationCountry);
    defaultShippingRules[`${originCountry}|${destinationCountry}`] = {
      originCountry,
      destinationCountry,
      baseCents: domestic ? 650 : regional ? 950 : internationalBase,
      minimumCents: domestic ? 900 : regional ? 1300 : internationalMinimum,
      maximumCents,
      minimumBasisPoints: domestic ? 250 : regional ? 400 : internationalMinimumRate,
      maximumBasisPoints: domestic ? 450 : regional ? 700 : internationalMaximumRate,
      perLineCents: domestic ? 15 : 25,
      perQuantityCents: domestic ? 2 : 4,
      roundingMethod: "nearest-cent"
    };
  }));

  const promotionalPhrases = [
    "UK Stock", "Fast Shipping", "Free Delivery", "Best Seller", "Hot Sale", "Cheap",
    "New Arrival", "Limited Offer", "Free Postage", "Same Day Dispatch", "High Quality",
    "Premium Quality"
  ];

  function normalizeOriginalTitle(value) {
    return String(value == null ? "" : value).trim().replace(/\s+/g, " ");
  }

  function normalizeSupplierKey(value) {
    return String(value == null ? "" : value).trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
  }

  function detectSupplierProfile(value) {
    const normalized = normalizeSupplierKey(value);
    const aliases = {
      chinese: "chinese", china: "chinese",
      gosupps: "gosupps", gosupp: "gosupps",
      twwholesale: "twWholesale", tw: "twWholesale",
      autodoc: "autodoc", zoro: "zoro", vetuk: "vetuk",
      poundwholesale: "poundWholesale", justmae: "justmae",
      costco: "costcoUSA", costcousa: "costcoUSA", costcouk: "costcoUK",
      sunsky: "sunsky", blowout: "blowout", jellycat: "jellycat", qogita: "qogita",
      pcsbooks: "pcsBooks", sephora: "sephora", bestway: "bestway",
      everydaysupply: "everydaySupply", sephorausa: "sephoraUSA", sephorauk: "sephoraUK"
    };
    return aliases[normalized] || "custom";
  }

  function getSupplierProfile(key, overrides) {
    const base = supplierProfiles[key] || supplierProfiles.custom;
    const override = overrides && overrides[key];
    return override ? Object.assign({}, base, override) : base;
  }

  function validateSupplierConfiguration(profileValue) {
    const errors = [];
    if (!profileValue) errors.push("Supplier profile is required.");
    else {
      if (!profileValue.originCountry) errors.push("Shipping origin has not been configured.");
      if (!Array.isArray(profileValue.outputColumns) || !profileValue.outputColumns.length) errors.push("Output columns have not been configured.");
      if (!profileValue.configured) errors.push("Supplier Profile Not Fully Configured");
    }
    return errors;
  }

  function extractVariationFromTitle(title, suppliedVariation) {
    if (normalizeOriginalTitle(suppliedVariation)) return normalizeOriginalTitle(suppliedVariation);
    const match = normalizeOriginalTitle(title).match(/\(([^()]{1,40})\)\s*$/);
    if (!match) return "";
    const candidate = match[1].trim();
    return /^(?:\d+\s*(?:pcs?|pieces?|pack|ml|mm|cm|m|metres?)|(?:type|model|option)\s+[a-z0-9]+|black|white|red|blue|green|grey|gray|small|medium|large|xl|xxl|uk plug)$/i.test(candidate) ? candidate : "";
  }

  function normalizeVariation(value) {
    let variation = normalizeOriginalTitle(value)
      .replace(/^[\[(]+|[\])]+$/g, "")
      .replace(/^(?:select|variation|option|colour|color|size)\s*[:=]\s*/i, "")
      .trim();
    if (!variation) return "";
    let match = variation.match(/^(\d+)\s*(?:pcs?|pieces?)$/i);
    if (match) return `${Number(match[1])} ${Number(match[1]) === 1 ? "Piece" : "Pieces"}`;
    match = variation.match(/^(\d+(?:\.\d+)?)\s*ml$/i);
    if (match) return `${match[1]} ml`;
    match = variation.match(/^(\d+(?:\.\d+)?)\s*(?:m|metres?|meters?)$/i);
    if (match) return `${match[1]} ${Number(match[1]) === 1 ? "Metre" : "Metres"}`;
    match = variation.match(/^(\d+)\s*pack$/i);
    if (match) return `${Number(match[1])} Pack`;
    if (/^[a-e]$/i.test(variation)) return ({ A: "Black", B: "Blue", C: "Red", D: "White", E: "Grey" })[variation.toUpperCase()];
    if (/^[a-z]$/i.test(variation)) return `Style ${variation.toUpperCase()}`;
    if (/^[1-5]$/.test(variation)) return ({ 1: "Small", 2: "Medium", 3: "Large", 4: "XL", 5: "XXL" })[variation];
    if (/^0*\d+$/.test(variation)) return `Style ${Number(variation)}`;
    match = variation.match(/^option\s*(\d+)$/i);
    if (match) return `Option ${Number(match[1])}`;
    match = variation.match(/^(type|model)\s*([a-z0-9-]+)$/i);
    if (match) return `${capitalise(match[1])} ${match[2].toUpperCase()}`;
    return variation.replace(/\s+/g, " ");
  }

  function detectVariationType(value, title, siblingVariations) {
    const variation = normalizeVariation(value);
    if (!variation) return "None";
    if (/^\d+ (?:Piece|Pieces|Pack)$/i.test(variation)) return "Pack Quantity";
    if (/^\d+(?:\.\d+)? ml$/i.test(variation)) return "Volume";
    if (/^\d+(?:\.\d+)? Metres?$/i.test(variation)) return "Length";
    if (/^(?:small|medium|large|xl|xxl)$/i.test(variation)) return "Size";
    if (/^(?:black|white|red|blue|green|yellow|pink|purple|grey|gray|silver|gold|brown|orange)$/i.test(variation)) return "Colour";
    if (/plug$/i.test(variation) || /\bplug\b/i.test(title || "")) return "Plug Type";
    if (/^model\s/i.test(variation)) return "Model";
    if (/^(?:type|option)\s/i.test(variation)) return "Generic Option";
    const siblings = (siblingVariations || []).map(normalizeVariation).filter(Boolean);
    if (siblings.length && siblings.every((item) => /^\d+ (?:Piece|Pieces|Pack)$/i.test(item))) return "Pack Quantity";
    return "Product Option";
  }

  function calculateVariationConfidence(value, type) {
    const variation = normalizeVariation(value);
    if (!variation) return "High";
    if (/^(?:Type|Style) [A-Z0-9]+$/i.test(variation) || type === "Generic Option") return "Low";
    if (["Pack Quantity", "Volume", "Length", "Size", "Colour", "Plug Type", "Model"].includes(type)) return "High";
    return "Medium";
  }

  function phraseRegex(phrase) {
    return new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+")}\\b`, "gi");
  }

  function removePromotionalLanguage(title) {
    let result = normalizeOriginalTitle(title);
    promotionalPhrases.forEach((phrase) => { result = result.replace(phraseRegex(phrase), " "); });
    result = result.replace(/\bfor\s+men\s+women\s+kids\b/gi, " ");
    return result;
  }

  function removeDuplicateVariationText(baseTitle, normalizedVariation, originalVariation) {
    let base = normalizeOriginalTitle(baseTitle);
    const variants = [normalizeOriginalTitle(originalVariation), normalizeOriginalTitle(normalizedVariation)]
      .filter((variation) => variation && variation.length > 1);
    variants.forEach((variation) => {
      base = base.replace(new RegExp(`(?:\\s*[-–—,:;/]\\s*)?\\(?${escapeRegex(variation)}\\)?`, "ig"), " ");
    });
    const quantity = normalizeVariation(normalizedVariation).match(/^(\d+) (?:Piece|Pieces)$/i);
    if (quantity) base = base.replace(new RegExp(`\\b${quantity[1]}\\s*(?:pcs?|pieces?)\\b`, "ig"), " ");
    return normalizeOriginalTitle(base);
  }

  function generateWholesaleBaseTitle(originalTitle, originalVariation) {
    const normalizedVariation = normalizeVariation(originalVariation);
    let title = removePromotionalLanguage(originalTitle)
      .replace(/[|*_~]+/g, " ")
      .replace(/\s*[-–—,:;!]{2,}\s*/g, " ")
      .replace(/\.{2,}/g, ".")
      .replace(/\s+/g, " ")
      .trim();
    title = removeDuplicateVariationText(title, normalizedVariation, originalVariation);
    title = title
      .replace(/\bself adhesive\b/gi, "Self-Adhesive")
      .replace(/\bheavy duty\b/gi, "Heavy-Duty")
      .replace(/\bquick release\b/gi, "Quick-Release")
      .replace(/\bstick on\b/gi, "Stick-On");
    const tokens = title.split(/\s+/).filter(Boolean);
    const deduplicated = [];
    tokens.forEach((token) => {
      const cleaned = token.toLowerCase().replace(/[^a-z0-9]/g, "");
      const previous = deduplicated.length ? deduplicated[deduplicated.length - 1].toLowerCase().replace(/[^a-z0-9]/g, "") : "";
      if (!cleaned || cleaned !== previous) deduplicated.push(token);
    });
    return smartTitleCase(deduplicated.join(" ").replace(/^[\s,.;:/-]+|[\s,.;:/-]+$/g, ""));
  }

  function appendVariationInBrackets(baseTitle, variation) {
    const base = normalizeOriginalTitle(baseTitle).replace(/\s*\([^()]+\)\s*$/, "").trim();
    let normalized = normalizeVariation(variation);
    if (normalized.length > 26) {
      normalized = normalized.slice(0, 27);
      if (normalized.includes(" ")) normalized = normalized.slice(0, normalized.lastIndexOf(" "));
      normalized = normalized.replace(/[\s,.;:/-]+$/g, "");
    }
    const suffix = normalized ? ` (${normalized})` : "";
    const available = Math.max(24, MAX_WHOLESALE_TITLE_LENGTH - suffix.length);
    let mediumBase = base;
    if (mediumBase.length > available) {
      mediumBase = mediumBase.slice(0, available + 1);
      if (mediumBase.includes(" ")) mediumBase = mediumBase.slice(0, mediumBase.lastIndexOf(" "));
      mediumBase = mediumBase.replace(/[\s,.;:/-]+$/g, "");
    }
    return `${mediumBase}${suffix}`;
  }

  function repairMediumWholesaleTitles(rows) {
    let repaired = 0;
    (rows || []).forEach((row) => {
      if (String(row.finalWholesaleTitle || "").length <= MAX_WHOLESALE_TITLE_LENGTH) return;
      row.finalWholesaleTitle = appendVariationInBrackets(row.cleanedBaseTitle || row.title || row.originalTitle, row.normalizedVariation || row.variation || row.originalVariation);
      repaired += 1;
    });
    return repaired;
  }

  function buildProductGroupId(row) {
    const originalTitle = row.originalTitle || row.title || "";
    const variation = row.originalVariation || row.variation || "";
    const identity = generateWholesaleBaseTitle(originalTitle, variation)
      .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    return `${normalizeSupplierKey(row.supplier)}|${identity}`;
  }

  function groupProductVariations(rows) {
    const groups = new Map();
    (rows || []).forEach((row) => {
      const key = row.productGroupId || buildProductGroupId(row);
      if (!groups.has(key)) groups.set(key, { key, rows: [] });
      groups.get(key).rows.push(row);
    });
    return Array.from(groups.values());
  }

  function cleanProductRows(rows) {
    const rawGroups = new Map();
    rows.forEach((row) => {
      const key = `${normalizeSupplierKey(row.supplier)}|${normalizeOriginalTitle(row.title).toLowerCase().replace(/\s+/g, " ")}`;
      if (!rawGroups.has(key)) rawGroups.set(key, []);
      rawGroups.get(key).push(row);
    });
    rows.forEach((row) => {
      row.originalTitle = normalizeOriginalTitle(row.originalTitle || row.title);
      row.originalVariation = normalizeOriginalTitle(row.originalVariation != null ? row.originalVariation : row.variation);
      const siblings = rawGroups.get(`${normalizeSupplierKey(row.supplier)}|${row.originalTitle.toLowerCase().replace(/\s+/g, " ")}`) || [];
      const extracted = extractVariationFromTitle(row.originalTitle, row.originalVariation);
      row.normalizedVariation = normalizeVariation(extracted);
      row.variationType = detectVariationType(row.normalizedVariation, row.originalTitle, siblings.map((item) => item.variation));
      row.variationConfidence = calculateVariationConfidence(row.normalizedVariation, row.variationType);
      row.cleanedBaseTitle = generateWholesaleBaseTitle(row.originalTitle, row.originalVariation);
      row.finalWholesaleTitle = appendVariationInBrackets(row.cleanedBaseTitle, row.normalizedVariation);
      row.productGroupId = buildProductGroupId(row);
      row.reviewStatus = row.variationConfidence === "High" ? "Ready" : "Review";
    });
    return rows;
  }

  function calculateUnitPrice(startPriceCents, percentageBasisPoints) {
    return Math.round((Number(startPriceCents) * Number(percentageBasisPoints)) / 10000);
  }

  function isAllowedUnitPricePercentage(value) {
    return Number.isInteger(value) && value >= 2801 && value <= 3299 && ![2900, 3000, 3100, 3200].includes(value);
  }

  function generateAllowedUnitPricePercentage(usedValues, randomInteger = secureRandomInteger) {
    const forbidden = new Set([2900, 3000, 3100, 3200]);
    const candidates = [];
    for (let value = 2801; value <= 3299; value += 1) if (!forbidden.has(value)) candidates.push(value);
    let pool = candidates;
    if (usedValues) {
      const minimumUse = Math.min(...candidates.map((value) => usedValues.get(value) || 0));
      pool = candidates.filter((value) => (usedValues.get(value) || 0) === minimumUse);
    }
    const value = pool[randomInteger(0, pool.length - 1)];
    if (usedValues) usedValues.set(value, (usedValues.get(value) || 0) + 1);
    return value;
  }

  function calculateInvoiceQuantity(available, sold, extra) {
    return Number(available) + Number(sold) + Number(extra);
  }

  function calculateLineTotal(unitPriceCents, quantity) {
    return Number(unitPriceCents) * Number(quantity);
  }

  function repairInternalUnitPrices(rows, randomInteger = secureRandomInteger) {
    const usedValues = new Map();
    let repaired = 0;
    (rows || []).forEach((row) => {
      let changed = false;
      if (!isAllowedUnitPricePercentage(row.percentageBasisPoints)) {
        row.percentageBasisPoints = generateAllowedUnitPricePercentage(usedValues, randomInteger);
        changed = true;
      } else {
        usedValues.set(row.percentageBasisPoints, (usedValues.get(row.percentageBasisPoints) || 0) + 1);
      }
      const expectedUnitPrice = calculateUnitPrice(row.startPriceCents, row.percentageBasisPoints);
      if (row.unitPriceCents !== expectedUnitPrice) {
        row.unitPriceCents = expectedUnitPrice;
        changed = true;
      }
      if (changed) {
        row.totalCents = calculateLineTotal(row.unitPriceCents, row.qty);
        repaired += 1;
      }
    });
    return repaired;
  }

  function buildBalancedInvoices(count, minimum, maximum) {
    if (count <= maximum) return [count];
    const allowedMinimum = Math.min(7, minimum, maximum);
    let invoiceCount = Math.ceil(count / maximum);
    while (Math.floor(count / invoiceCount) < allowedMinimum && invoiceCount > 1) invoiceCount -= 1;
    const base = Math.floor(count / invoiceCount);
    const remainder = count % invoiceCount;
    return Array.from({ length: invoiceCount }, (_, index) => base + (index >= invoiceCount - remainder ? 1 : 0));
  }

  function generateInvoiceNumber(previousNumber, minimumGap, maximumGap, randomInteger, previousGap) {
    if (previousNumber == null) return null;
    const random = randomInteger || secureRandomInteger;
    let gap = random(minimumGap, maximumGap);
    if (gap === previousGap && maximumGap > minimumGap) gap = gap === maximumGap ? gap - 1 : gap + 1;
    return { number: Number(previousNumber) + gap, gap };
  }

  function generateUniqueInvoiceNumber(existingNumbers, randomInteger) {
    const used = existingNumbers instanceof Set ? existingNumbers : new Set(existingNumbers || []);
    const random = randomInteger || secureRandomInteger;
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const candidate = random(100000, 999999);
      if (!used.has(candidate)) { used.add(candidate); return candidate; }
    }
    for (let candidate = 100000; candidate <= 999999; candidate += 1) {
      if (!used.has(candidate)) { used.add(candidate); return candidate; }
    }
    return null;
  }

  function isValidIncreasingInvoiceSequence(numbers, minimumGap = 201) {
    return (numbers || []).every((value, index, sequence) => {
      const number = Number(value);
      if (!/^\d{6}$/.test(String(number))) return false;
      return index === 0 || number - Number(sequence[index - 1]) >= minimumGap;
    });
  }

  function generateIncreasingInvoiceSequence(count, randomInteger = secureRandomInteger, minimumGap = 201, maximumGap = 499) {
    const total = Math.max(0, Number(count) || 0);
    if (!total) return [];
    const effectiveMaximumGap = total === 1 ? maximumGap : Math.min(maximumGap, Math.floor((999999 - 100000) / (total - 1)));
    if (effectiveMaximumGap < minimumGap) return [];
    const maximumStart = total === 1 ? 999999 : 999999 - effectiveMaximumGap * (total - 1);
    const sequence = [randomInteger(100000, maximumStart)];
    let previousGap = null;
    while (sequence.length < total) {
      const next = generateInvoiceNumber(sequence[sequence.length - 1], minimumGap, effectiveMaximumGap, randomInteger, previousGap);
      sequence.push(next.number);
      previousGap = next.gap;
    }
    return sequence;
  }

  function parseDateInput(value) {
    const text = String(value || "").trim();
    let match = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
    match = text.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (match) return new Date(Date.UTC(Number(match[3]), Number(match[2]) - 1, Number(match[1])));
    const parsed = Date.parse(text);
    return Number.isFinite(parsed) ? new Date(parsed) : null;
  }

  function formatDateDDMMYYYY(value) {
    const date = value instanceof Date ? value : parseDateInput(value);
    if (!date || Number.isNaN(date.getTime())) return "";
    return `${String(date.getUTCDate()).padStart(2, "0")}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${date.getUTCFullYear()}`;
  }

  function formatDateDDMMYYYYSlash(value) {
    const date = value instanceof Date ? value : parseDateInput(value);
    if (!date || Number.isNaN(date.getTime())) return "";
    return `${String(date.getUTCDate()).padStart(2, "0")}/${String(date.getUTCMonth() + 1).padStart(2, "0")}/${date.getUTCFullYear()}`;
  }

  function generateInvoiceDate(index, count, rangeStart, rangeEnd, randomInteger, usedOffsets) {
    const start = parseDateInput(rangeStart), end = parseDateInput(rangeEnd);
    if (!start || !end || start > end) return null;
    const days = Math.floor((end - start) / 86400000);
    const random = randomInteger || secureRandomInteger;
    const used = usedOffsets instanceof Set ? usedOffsets : new Set();
    let offset = random(0, days);
    if (days + 1 >= count) {
      let attempts = 0;
      while (used.has(offset) && attempts <= days + 1) { offset = random(0, days); attempts += 1; }
      if (used.has(offset)) for (let candidate = 0; candidate <= days; candidate += 1) if (!used.has(candidate)) { offset = candidate; break; }
    }
    used.add(offset);
    return new Date(start.getTime() + offset * 86400000);
  }

  function validateInvoiceDateAgainstListingDates(invoiceDate, rows, mustBeBefore) {
    const date = parseDateInput(invoiceDate);
    if (!date) return { valid: false, message: "Invoice date is invalid." };
    if (!mustBeBefore) return { valid: true, message: "" };
    const listingDates = (rows || []).map((row) => parseDateInput(row.startDate)).filter(Boolean);
    if (!listingDates.length) return { valid: false, message: "One or more listing dates could not be parsed." };
    const earliest = new Date(Math.min(...listingDates.map((value) => value.getTime())));
    return date.getTime() <= earliest.getTime()
      ? { valid: true, message: "" }
      : { valid: false, message: "The selected invoice date range is incompatible with one or more listing dates." };
  }

  function getShippingRule(rules, originCountry, destinationCountry) {
    return (rules || defaultShippingRules)[`${originCountry}|${destinationCountry}`]
      || (rules || defaultShippingRules)[`${originCountry}|Other`]
      || null;
  }

  function calculateCountryShipping(options) {
    const rule = options.rule;
    if (!rule) return { error: "No shipping rule is configured for this route." };
    const random = options.randomInteger || secureRandomInteger;
    const rateBasisPoints = options.storedRateBasisPoints || random(rule.minimumBasisPoints, rule.maximumBasisPoints);
    let shippingCents = Number(rule.baseCents || 0)
      + Math.round((Number(options.subtotalCents || 0) * rateBasisPoints) / 10000)
      + Number(rule.perLineCents || 0) * Number(options.lineItems || 0)
      + Number(rule.perQuantityCents || 0) * Number(options.totalQuantity || 0);
    shippingCents = Math.max(shippingCents, Number(rule.minimumCents || 0));
    if (Number.isFinite(Number(rule.maximumCents)) && Number(rule.maximumCents) > 0) shippingCents = Math.min(shippingCents, Number(rule.maximumCents));
    return { shippingCents: Math.round(shippingCents), rateBasisPoints, method: options.method === "rule" ? "Rule Table Generated" : "Automatically Estimated" };
  }

  function applyManualShippingOverride(estimatedShippingCents, manualShippingCents) {
    return Number.isFinite(Number(manualShippingCents)) && Number(manualShippingCents) >= 0
      ? { shippingCents: Math.round(Number(manualShippingCents)), method: "Manually Entered" }
      : { shippingCents: estimatedShippingCents, method: "Automatically Estimated" };
  }

  function calculateInvoiceSubtotal(invoice) {
    return (invoice.rows || []).reduce((sum, row) => sum + Number(row.totalCents || 0), 0);
  }

  function calculateGrandTotal(subtotalCents, taxCents, shippingCents) {
    return Number(subtotalCents) + Number(taxCents) + Number(shippingCents);
  }

  function calculateAccountTax(subtotalCents, originCountry, rateBasisPoints) {
    if (originCountry !== "United States") return 0;
    const rate = Number.isFinite(Number(rateBasisPoints)) ? Number(rateBasisPoints) : 725;
    return Math.round((Number(subtotalCents || 0) * rate) / 10000);
  }

  function validateInvoiceMathematics(invoice) {
    const errors = [];
    (invoice.rows || []).forEach((row) => {
      if (Number(row.totalCents) !== calculateLineTotal(row.unitPriceCents, row.qty)) errors.push(`Row ${row.rowNumber}: line total mismatch.`);
    });
    const subtotal = calculateInvoiceSubtotal(invoice);
    if (Number(invoice.subtotalCents) !== subtotal) errors.push("Invoice subtotal mismatch.");
    const expectedGrand = calculateGrandTotal(subtotal, invoice.taxCents, invoice.shippingCents);
    if (Number(invoice.grandTotalCents) !== expectedGrand) errors.push("Grand total mismatch.");
    if (Number(invoice.grandTotalCents) - subtotal - Number(invoice.shippingCents) - Number(invoice.taxCents) !== 0) errors.push("Grand total zero-balance verification failed.");
    return errors;
  }

  function mapTemplateFields(sheet, mappings, values, itemRows) {
    const result = sheet;
    const setCell = (address, value) => {
      if (!address || !/^[A-Z]+\d+$/i.test(address)) return;
      const normalizedAddress = address.toUpperCase();
      result[normalizedAddress] = { t: typeof value === "number" ? "n" : "s", v: value };
      const point = decodeCell(normalizedAddress), current = decodeRange(result["!ref"] || "A1:A1");
      current.s.r = Math.min(current.s.r, point.r); current.s.c = Math.min(current.s.c, point.c);
      current.e.r = Math.max(current.e.r, point.r); current.e.c = Math.max(current.e.c, point.c);
      result["!ref"] = encodeRange(current);
    };
    Object.keys(values || {}).forEach((field) => setCell(mappings[field], values[field]));
    const repeated = ["itemTitle", "unitPrice", "quantity", "lineTotal"];
    repeated.forEach((field) => {
      const start = mappings[field];
      const match = String(start || "").match(/^([A-Z]+)(\d+)$/i);
      if (!match) return;
      (itemRows || []).forEach((row, index) => setCell(`${match[1]}${Number(match[2]) + index}`, row[field]));
    });
    return result;
  }

  function decodeCell(address) {
    const match = address.match(/^([A-Z]+)(\d+)$/), letters = match[1];
    let column = 0;
    for (let index = 0; index < letters.length; index += 1) column = column * 26 + letters.charCodeAt(index) - 64;
    return { c: column - 1, r: Number(match[2]) - 1 };
  }
  function encodeCell(point) { let column = point.c + 1, letters = ""; while (column > 0) { const remainder = (column - 1) % 26; letters = String.fromCharCode(65 + remainder) + letters; column = Math.floor((column - 1) / 26); } return `${letters}${point.r + 1}`; }
  function decodeRange(value) { const parts = String(value).split(":"); return { s: decodeCell(parts[0]), e: decodeCell(parts[1] || parts[0]) }; }
  function encodeRange(value) { return `${encodeCell(value.s)}:${encodeCell(value.e)}`; }

  function createProcessingAudit(rows, invoices) {
    const invoiceByRow = new Map();
    (invoices || []).forEach((invoice) => (invoice.rows || []).forEach((row) => invoiceByRow.set(row.id, invoice)));
    return (rows || []).map((row) => {
      const invoice = invoiceByRow.get(row.id) || {};
      return [
        row.rowNumber, row.supplier, row.originalTitle, row.originalVariation, row.cleanedBaseTitle,
        row.normalizedVariation, row.finalWholesaleTitle, row.variationConfidence, row.available, row.sold,
        row.startPriceCents / 100, `${(row.percentageBasisPoints / 100).toFixed(2)}%`, row.unitPriceCents / 100,
        row.extraQuantity, row.qty, row.totalCents / 100, row.startDate, invoice.number || "",
        invoice.invoiceNumber || "", invoice.invoiceDate || "", (invoice.subtotalCents || 0) / 100,
        (invoice.taxCents || 0) / 100, (invoice.shippingCents || 0) / 100, invoice.shippingMethod || "",
        invoice.originCountry || "", invoice.destinationCountry || "", (invoice.grandTotalCents || 0) / 100,
        invoice.validationStatus || "Valid"
      ];
    });
  }

  function smartTitleCase(value) {
    const minor = new Set(["a", "an", "and", "as", "at", "by", "for", "from", "in", "of", "on", "or", "the", "to", "with"]);
    return String(value || "").split(/\s+/).map((word, index) => {
      if (/^[A-Z0-9]{2,}$/.test(word) || /\d/.test(word)) return word;
      const lower = word.toLowerCase();
      if (index > 0 && minor.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }).join(" ");
  }

  function capitalise(value) { const text = String(value || "").toLowerCase(); return text.charAt(0).toUpperCase() + text.slice(1); }
  function escapeRegex(value) { return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  function secureRandomInteger(minimum, maximum) {
    const range = maximum - minimum + 1;
    if (root.crypto && root.crypto.getRandomValues) {
      const values = new Uint32Array(1), limit = Math.floor(0x100000000 / range) * range;
      do root.crypto.getRandomValues(values); while (values[0] >= limit);
      return minimum + (values[0] % range);
    }
    return minimum + Math.floor(Math.random() * range);
  }

  function generateFollowUpDayOffset(randomInteger = secureRandomInteger) {
    return randomInteger(2, 3);
  }

  function shouldBlockExport(checks = {}) {
    return Number(checks.totalOutputRows || 0) < 1 || Boolean(
      checks.duplicateRows || checks.missingRows || checks.calculationErrors || checks.shippingErrors ||
      checks.invoiceNumberErrors || checks.invoiceDateErrors || checks.outputCountMismatch || checks.blockingGroupingWarnings
    );
  }

  root.SplitterCore = {
    CHINESE_COLUMNS, ZORO_COLUMNS, MAX_WHOLESALE_TITLE_LENGTH, supplierProfiles, defaultShippingRules, detectSupplierProfile, getSupplierProfile,
    validateSupplierConfiguration, normalizeOriginalTitle, extractVariationFromTitle, normalizeVariation,
    detectVariationType, generateWholesaleBaseTitle, appendVariationInBrackets, removeDuplicateVariationText,
    calculateVariationConfidence, buildProductGroupId, groupProductVariations, cleanProductRows, repairMediumWholesaleTitles,
    calculateUnitPrice, isAllowedUnitPricePercentage, generateAllowedUnitPricePercentage, repairInternalUnitPrices,
    calculateInvoiceQuantity, calculateLineTotal, buildBalancedInvoices,
    generateInvoiceNumber, generateUniqueInvoiceNumber, isValidIncreasingInvoiceSequence, generateIncreasingInvoiceSequence,
    generateInvoiceDate, parseDateInput, formatDateDDMMYYYY, formatDateDDMMYYYYSlash,
    validateInvoiceDateAgainstListingDates, getShippingRule, calculateCountryShipping,
    applyManualShippingOverride, calculateInvoiceSubtotal, calculateGrandTotal, calculateAccountTax, validateInvoiceMathematics,
    mapTemplateFields, createProcessingAudit, secureRandomInteger, generateFollowUpDayOffset, shouldBlockExport
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
