(function (global) {
  "use strict";

  const SUPPLIERS = {
    "Tropicana Wholesale": [/(supplement|vitamin|protein|creatine|electrolyte|hydration tablet|sports nutrition|nutrition bar|wellness|omega[- ]?3|magnesium|collagen)/i],
    "VetUK Ltd": [/(dog food|cat food|pet food|dog treat|cat treat|pet treat|pet care|animal suppl|cat litter|flea|worming)/i],
    "Sunsky": [/(usb|charger|charging|adapter|card reader|memory card|phone holder|mobile accessor|led light|rc part|cable|gadget|power bank|bluetooth)/i],
    "Justmae Limited": [/(phone cable|phone charger|small gadget|electronic accessor)/i],
    "PoundWholesale / TW Wholesale / Everyday Supply Co": [/(pampers|napp(?:y|ies)|baby wipe|waterwipes|cleaning product|household consumable|laundry|toilet roll|kitchen roll)/i],
    "Sephora": [/\bsephora\b/i],
    "Qogita EU/UK": [/\bqogita\b/i],
    "Perfume Lab": [/\bperfume lab\b/i],
    "Luxury Souq": [/(luxury souq|branded (?:wrist)?watch)/i],
    "Jellycat": [/\bjellycat\b/i],
    "Autodoc Operations UK": [/(car part|automotive|vehicle|tyre|tire|engine oil|car oil|car inflator|brake|wiper blade)/i],
    "Zoro Tools / Justmae / TW Wholesale": [/(socket adapter|screwdriver|drill bit|tool accessor|industrial hardware|workshop|spanner|wrench)/i],
    "LEGO / Starway / Blowout / Ideal Trading USA / B\/A Products Co": [/(\blego\b|blind box|anime figure|collectible|action figure|plush|branded toy)/i],
    "Bestway Wholesale": [/\bbestway\b/i],
    "Yiwu Oudiya": [/(generic|unbranded|white label)/i]
  };

  const COLUMN_ALIASES = {
    title: ["title", "item title", "itemtitle"],
    variation: ["variation details", "variation detail", "variation", "variations"],
    available: ["available quantity", "available qty", "active quantity", "active qty", "quantity available"],
    price: ["start price", "current price", "price", "unit price"],
    sold: ["sold quantity", "sold qty", "quantity sold"],
    startDate: ["start date", "listing date", "date"],
    domain: ["listing site", "domain", "site", "listing domain"]
  };

  function cleanHeader(value) {
    return String(value ?? "").replace(/^\uFEFF/, "").trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
  }

  function findIndex(headers, aliases) {
    const normalized = headers.map(cleanHeader);
    return aliases.map(cleanHeader).map((name) => normalized.indexOf(name)).find((index) => index >= 0) ?? -1;
  }

  function numberValue(value) {
    if (value === null || value === undefined || value === "") return 0;
    const parsed = Number(String(value).replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function priceValue(value) {
    if (value === null || value === undefined || value === "") return null;
    const parsed = Number(String(value).replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }

  function parseDate(value) {
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
    if (typeof value === "number" && global.XLSX?.SSF) {
      const parsed = global.XLSX.SSF.parse_date_code(value);
      if (parsed) return new Date(parsed.y, parsed.m - 1, parsed.d, parsed.H || 0, parsed.M || 0, parsed.S || 0);
    }
    const text = String(value ?? "").trim();
    if (!text) return null;
    const parts = text.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})/);
    if (parts) {
      const year = Number(parts[3].length === 2 ? `20${parts[3]}` : parts[3]);
      const date = new Date(year, Number(parts[2]) - 1, Number(parts[1]));
      return Number.isNaN(date.getTime()) ? null : date;
    }
    const direct = new Date(text);
    return Number.isNaN(direct.getTime()) ? null : direct;
  }

  function assignSupplier(title) {
    const matches = Object.entries(SUPPLIERS).filter(([, patterns]) => patterns.some((pattern) => pattern.test(title)));
    return matches.length === 1 ? { supplier: matches[0][0], confidence: "High" } : { supplier: "Unconfirmed Titles – Please check manually", confidence: "Unconfirmed" };
  }

  function processRows(matrix) {
    if (!Array.isArray(matrix) || matrix.length < 2) throw new Error("The uploaded file does not contain any data rows.");
    const headers = matrix[0].map((value) => String(value ?? "").trim());
    const indexes = Object.fromEntries(Object.entries(COLUMN_ALIASES).map(([key, aliases]) => [key, findIndex(headers, aliases)]));
    const missing = ["title", "price", "sold", "startDate"].filter((key) => indexes[key] < 0);
    if (missing.length) throw new Error(`Missing required column(s): ${missing.map((key) => COLUMN_ALIASES[key][0]).join(", ")}.`);

    const combined = new Map();
    matrix.slice(1).forEach((row, offset) => {
      const title = String(row[indexes.title] ?? "").trim();
      if (!title) return;
      const variation = indexes.variation >= 0 ? String(row[indexes.variation] ?? "").trim() : "";
      const domain = indexes.domain >= 0 ? String(row[indexes.domain] ?? "").trim() || "Unspecified" : "Unspecified";
      const available = indexes.available >= 0 ? numberValue(row[indexes.available]) : 0;
      const sold = numberValue(row[indexes.sold]);
      const price = priceValue(row[indexes.price]);
      const rawDate = row[indexes.startDate];
      const date = parseDate(rawDate);
      const match = assignSupplier(title);
      const key = `${domain}\u0000${title}\u0000${variation || "–"}`;
      const current = combined.get(key) || {
        rowNumber: offset + 2,
        domain,
        supplier: match.supplier,
        title,
        variation: variation || "–",
        available: 0,
        sold: 0,
        qty: 0,
        unitPrice: null,
        startDate: rawDate ? String(rawDate) : "",
        parsedDate: date,
        confidence: match.confidence
      };
      current.available += available;
      current.sold += sold;
      current.qty = current.available + current.sold;
      if (price !== null && (current.unitPrice === null || price < current.unitPrice)) current.unitPrice = price;
      if (date && (!current.parsedDate || date < current.parsedDate)) {
        current.parsedDate = date;
        current.startDate = String(rawDate);
      }
      combined.set(key, current);
    });

    const rows = [...combined.values()];
    if (!rows.length) throw new Error("No rows with a valid Title were found.");
    const dates = rows.map((row) => row.parsedDate).filter(Boolean);
    const oldest = dates.length ? new Date(Math.min(...dates.map((date) => date.getTime()))) : null;
    return { rows, oldest, headers };
  }

  global.AutoDataCleanerCore = { processRows, assignSupplier };
})(window);
