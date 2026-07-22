import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";

const source = fs.readFileSync(path.resolve("public/editor/splitter-core.js"), "utf8");
const context = { console, Math, Date, Map, Set, Uint32Array };
context.globalThis = context;
vm.runInNewContext(source, context, { filename: "splitter-core.js" });
const Core = context.SplitterCore;

test("wholesale title cleaning removes promotional phrases without inventing details", () => {
  const title = Core.generateWholesaleBaseTitle("Self Adhesive Wall Hooks Heavy Duty UK Stock Free Delivery", "2 PCS");
  assert.doesNotMatch(title, /UK Stock|Free Delivery/i);
  assert.match(title, /Self-Adhesive Wall Hooks Heavy-Duty/i);
});

test("variation extraction remains conservative", () => {
  assert.equal(Core.extractVariationFromTitle("Portable Pump (100ML)", ""), "100ML");
  assert.equal(Core.extractVariationFromTitle("Portable Pump for Workshop", ""), "");
});

test("variation normalization and round-bracket append", () => {
  assert.equal(Core.normalizeVariation("3 PCS"), "3 Pieces");
  assert.equal(Core.normalizeVariation("Select=Black"), "Black");
  assert.equal(Core.normalizeVariation("A"), "Black");
  assert.equal(Core.normalizeVariation("2"), "Medium");
  assert.equal(Core.appendVariationInBrackets("Wall Hooks", "3 PCS"), "Wall Hooks (3 Pieces)");
});

test("wholesale titles stay medium length and keep variation in round brackets", () => {
  const result = Core.appendVariationInBrackets("Universal Adjustable Heavy Duty Replacement Vehicle Accessory Mounting Bracket for Cars Motorcycles Workshops and Garages", "Color=Red");
  assert.ok(result.length <= 72);
  assert.match(result, /\(Red\)$/);
});

test("old oversized cleaned titles are shortened automatically", () => {
  const rows = [{
    title: "Universal Adjustable Heavy Duty Replacement Vehicle Accessory Mounting Bracket for Cars Motorcycles Workshops and Garages",
    cleanedBaseTitle: "Universal Adjustable Heavy Duty Replacement Vehicle Accessory Mounting Bracket for Cars Motorcycles Workshops and Garages",
    normalizedVariation: "Red",
    finalWholesaleTitle: "Universal Adjustable Heavy Duty Replacement Vehicle Accessory Mounting Bracket for Cars Motorcycles Workshops and Garages (Red)"
  }];
  assert.equal(Core.repairMediumWholesaleTitles(rows), 1);
  assert.ok(rows[0].finalWholesaleTitle.length <= Core.MAX_WHOLESALE_TITLE_LENGTH);
  assert.match(rows[0].finalWholesaleTitle, /\(Red\)$/);
});

test("duplicate variation wording is removed from base title", () => {
  assert.equal(Core.removeDuplicateVariationText("50 Pcs Disposable Eyeshadow Applicators", "50 Pieces", "50 PCS"), "Disposable Eyeshadow Applicators");
});

test("unit price uses integer-safe percentage rounding", () => {
  assert.equal(Core.calculateUnitPrice(498, 2939), 146);
  assert.equal(Core.calculateUnitPrice(498, 3212), 160);
});

test("quantity calculation adds available, sold and generated extra", () => {
  assert.equal(Core.calculateInvoiceQuantity(14, 9, 11), 34);
});

test("line total uses displayed rounded Unit Price", () => {
  assert.equal(Core.calculateLineTotal(146, 34), 4964);
});

test("product variations share a stable group despite different brackets", () => {
  const rows = [
    { supplier: "Chinese", title: "Heavy Duty Wall Hooks", variation: "1 PCS" },
    { supplier: "Chinese", title: "Heavy Duty Wall Hooks", variation: "4 PCS" }
  ];
  Core.cleanProductRows(rows);
  assert.equal(rows[0].productGroupId, rows[1].productGroupId);
  assert.equal(Core.groupProductVariations(rows).length, 1);
});

test("balanced split for 23 variations is 7, 8, 8", () => {
  assert.deepEqual(Array.from(Core.buildBalancedInvoices(23, 8, 10)), [7, 8, 8]);
});

test("invoice numbers progress with non-identical allowed gaps", () => {
  const first = Core.generateInvoiceNumber(392841, 76, 145, () => 87, null);
  const second = Core.generateInvoiceNumber(first.number, 76, 145, () => 87, first.gap);
  assert.equal(first.number, 392928);
  assert.equal(second.number, 393016);
  assert.ok(second.number > first.number);
});

test("invoice numbers can be generated as unique randomized six-digit values", () => {
  const used = new Set();
  const sequence = [731942, 284615, 906327];
  const first = Core.generateUniqueInvoiceNumber(used, () => sequence.shift());
  const second = Core.generateUniqueInvoiceNumber(used, () => sequence.shift());
  const third = Core.generateUniqueInvoiceNumber(used, () => sequence.shift());
  assert.deepEqual([first, second, third], [731942, 284615, 906327]);
  assert.equal(used.size, 3);
});

test("invoice numbers are randomized, increasing, and separated by more than 200", () => {
  let call = 0;
  const randomValues = [400000, 237, 412, 286, 455];
  const sequence = Core.generateIncreasingInvoiceSequence(5, (minimum, maximum) => Math.min(maximum, Math.max(minimum, randomValues[call++] ?? minimum)), 201, 499);
  assert.equal(Core.isValidIncreasingInvoiceSequence(sequence, 201), true);
  const gaps = sequence.slice(1).map((value, index) => value - sequence[index]);
  assert.equal(gaps.every((gap) => gap > 200), true);
  assert.ok(new Set(gaps).size > 1);
});

test("invoice dates are randomized inside the mandatory selected range", () => {
  const used = new Set();
  const first = Core.generateInvoiceDate(0, 2, "2026-02-01", "2026-02-10", () => 7, used);
  const second = Core.generateInvoiceDate(1, 2, "2026-02-01", "2026-02-10", () => 2, used);
  assert.equal(Core.formatDateDDMMYYYY(first), "08-02-2026");
  assert.equal(Core.formatDateDDMMYYYY(second), "03-02-2026");
  assert.equal(used.size, 2);
  assert.equal(Core.formatDateDDMMYYYYSlash(first), "08/02/2026");
});

test("invoice date validation prevents dates after listing", () => {
  assert.equal(Core.validateInvoiceDateAgainstListingDates("18-03-2026", [{ startDate: "Mar-19-26 04:45:04 PDT" }], true).valid, true);
  assert.equal(Core.validateInvoiceDateAgainstListingDates("20-03-2026", [{ startDate: "Mar-19-26 04:45:04 PDT" }], true).valid, false);
});

test("country shipping applies configured rate and minimum", () => {
  const rule = Core.defaultShippingRules["China|United Kingdom"];
  const result = Core.calculateCountryShipping({ rule, subtotalCents: 10000, lineItems: 8, totalQuantity: 100, randomInteger: () => 1000 });
  assert.equal(result.shippingCents, 2800);
  assert.equal(result.method, "Automatically Estimated");
});

test("automatic shipping covers non-Chinese supplier routes", () => {
  const domesticRule = Core.defaultShippingRules["United Kingdom|United Kingdom"];
  const internationalRule = Core.defaultShippingRules["United States|Germany"];
  assert.ok(domesticRule);
  assert.ok(internationalRule);
  const domestic = Core.calculateCountryShipping({ domesticRule, rule: domesticRule, subtotalCents: 20000, lineItems: 8, totalQuantity: 25, randomInteger: () => 300 });
  const international = Core.calculateCountryShipping({ rule: internationalRule, subtotalCents: 20000, lineItems: 8, totalQuantity: 25, randomInteger: () => 900 });
  assert.ok(domestic.shippingCents > 0);
  assert.ok(international.shippingCents > domestic.shippingCents);
});

test("subtotal, fixed tax and grand total remain cent-safe", () => {
  const invoice = { rows: [{ totalCents: 4964 }, { totalCents: 1036 }] };
  const subtotal = Core.calculateInvoiceSubtotal(invoice);
  assert.equal(subtotal, 6000);
  assert.equal(Core.calculateGrandTotal(subtotal, 0, 2400), 8400);
});

test("supplier export schemas match Chinese and Zoro formats", () => {
  assert.deepEqual(Array.from(Core.CHINESE_COLUMNS), ["Title", "QTY", "Unit Price", "Invoice Date", "Invoice #", "Shipping"]);
  assert.deepEqual(Array.from(Core.ZORO_COLUMNS), ["Title", "QTY", "Unit Price", "Z NUMBER", "Date", "Invoice #", "Customer #", "Due Date", "SO #", "Purchase Order", "Ship Date", "Shipping Cost", "Total", "Tax"]);
});

test("US accounts receive estimated tax while non-US accounts receive zero", () => {
  assert.equal(Core.calculateAccountTax(10000, "United States", 725), 725);
  assert.equal(Core.calculateAccountTax(10000, "China", 725), 0);
});

test("Zoro due and ship dates use a randomized 2 to 3 day offset", () => {
  assert.equal(Core.generateFollowUpDayOffset(() => 2), 2);
  assert.equal(Core.generateFollowUpDayOffset(() => 3), 3);
});

test("invalid source rows do not block export when valid output rows exist", () => {
  assert.equal(Core.shouldBlockExport({ totalOutputRows: 3, invalidDataRows: 2 }), false);
  assert.equal(Core.shouldBlockExport({ totalOutputRows: 0 }), true);
  assert.equal(Core.shouldBlockExport({ totalOutputRows: 3, calculationErrors: 1 }), true);
});

test("large files always receive allowed decimal unit-price percentages", () => {
  const used = new Map();
  const percentages = Array.from({ length: 5367 }, () => Core.generateAllowedUnitPricePercentage(used, (_minimum, maximum) => maximum));
  assert.equal(percentages.every((value) => value >= 2801 && value <= 3299), true);
  assert.equal(percentages.some((value) => [2900, 3000, 3100, 3200].includes(value)), false);
  const counts = Array.from(used.values());
  assert.ok(Math.max(...counts) - Math.min(...counts) <= 1);
});

test("internally generated unit-price errors are repaired automatically", () => {
  const rows = [
    { startPriceCents: 10000, percentageBasisPoints: 3000, unitPriceCents: 3000, qty: 4, totalCents: 12000 },
    { startPriceCents: 2500, percentageBasisPoints: 2941, unitPriceCents: 1, qty: 3, totalCents: 3 }
  ];
  assert.equal(Core.repairInternalUnitPrices(rows, (minimum) => minimum), 2);
  assert.equal(Core.isAllowedUnitPricePercentage(rows[0].percentageBasisPoints), true);
  assert.equal(rows[0].unitPriceCents, Core.calculateUnitPrice(rows[0].startPriceCents, rows[0].percentageBasisPoints));
  assert.equal(rows[1].unitPriceCents, Core.calculateUnitPrice(rows[1].startPriceCents, rows[1].percentageBasisPoints));
  assert.equal(rows[1].totalCents, rows[1].unitPriceCents * rows[1].qty);
});

test("grouping preserves every source row and separates suppliers", () => {
  const rows = [
    { id: "1", supplier: "Chinese", title: "Wall Hooks", variation: "A" },
    { id: "2", supplier: "Chinese", title: "Wall Hooks", variation: "B" },
    { id: "3", supplier: "Zoro", title: "Wall Hooks", variation: "A" }
  ];
  Core.cleanProductRows(rows);
  const groups = Core.groupProductVariations(rows);
  assert.equal(groups.reduce((sum, group) => sum + group.rows.length, 0), rows.length);
  assert.equal(groups.length, 2);
});

test("template mapping writes repeated item rows and expands sheet range", () => {
  const sheet = { "!ref": "A1:B2" };
  Core.mapTemplateFields(sheet, { invoiceNumber: "B2", itemTitle: "A5" }, { invoiceNumber: "392841" }, [{ itemTitle: "One" }, { itemTitle: "Two" }]);
  assert.equal(sheet.B2.v, "392841");
  assert.equal(sheet.A5.v, "One");
  assert.equal(sheet.A6.v, "Two");
  assert.equal(sheet["!ref"], "A1:B6");
});

test("all mandatory supplier choices resolve to dedicated profiles", () => {
  const suppliers = [
    ["Chinese", "chinese"], ["Zoro", "zoro"], ["Go Supps", "gosupps"],
    ["TW Wholesale", "twWholesale"], ["Costco USA", "costcoUSA"], ["Costco UK", "costcoUK"],
    ["Pound wholesale", "poundWholesale"], ["SunSky", "sunsky"], ["Vet UK", "vetuk"],
    ["Blowout", "blowout"], ["Jellycat", "jellycat"], ["Qogita", "qogita"],
    ["PCS Books", "pcsBooks"], ["Sephora", "sephora"], ["Bestway", "bestway"],
    ["Auto Doc", "autodoc"], ["Justmae", "justmae"], ["Everyday Supply", "everydaySupply"],
    ["Sephora USA", "sephoraUSA"], ["Sephora UK", "sephoraUK"]
  ];
  suppliers.forEach(([name, key]) => {
    assert.equal(Core.detectSupplierProfile(name), key);
    assert.equal(Core.getSupplierProfile(key).profileName, name);
  });
});
