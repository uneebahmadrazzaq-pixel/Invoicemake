import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";

const root = process.cwd();
const html = fs.readFileSync(path.join(root, "public", "editor", "index.html"), "utf8");
const script = fs.readFileSync(path.join(root, "public", "editor", "app.js"), "utf8");
const styles = fs.readFileSync(path.join(root, "public", "editor", "dashboard-light.css"), "utf8");

function extractFunction(name) {
  const start = script.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} must exist`);
  const bodyStart = script.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < script.length; index += 1) {
    if (script[index] === "{") depth += 1;
    if (script[index] === "}") depth -= 1;
    if (depth === 0) return script.slice(start, index + 1);
  }
  throw new Error(`Could not extract ${name}`);
}

test("dashboard includes a live and accessible invoice activity graph", () => {
  assert.match(html, /id="dashboardActivityChart"/);
  assert.match(html, /id="dashboardActivityRange"/);
  assert.match(html, /id="dashboardActivityTotal"/);
  assert.match(script, /function renderDashboardActivity\(\)/);
  assert.match(script, /dashboardActivitySvgTitle/);
  assert.match(script, /renderDashboardActivity\(\);/);
});

test("invoice activity graph renders real invoice data without invalid geometry", () => {
  const context = {
    Date,
    Math,
    Number,
    state: {
      invoices: [
        { savedAt: "2026-04-03T09:00:00Z" },
        { savedAt: "2026-05-12T09:00:00Z" },
        { savedAt: "2026-05-16T09:00:00Z" },
        { savedAt: "2026-07-01T09:00:00Z" }
      ]
    },
    els: {
      dashboardActivityChart: { innerHTML: "" },
      dashboardActivityRange: { textContent: "" },
      dashboardActivityTotal: { textContent: "" }
    },
    escapeHtml: (value) => String(value)
  };
  vm.createContext(context);
  vm.runInContext(`${extractFunction("dashboardInvoiceDate")}\n${extractFunction("renderDashboardActivity")}`, context);
  context.renderDashboardActivity();

  assert.equal(context.els.dashboardActivityTotal.textContent, "4 invoices");
  assert.match(context.els.dashboardActivityChart.innerHTML, /<svg/);
  assert.match(context.els.dashboardActivityChart.innerHTML, /dashboard-activity-line/);
  assert.doesNotMatch(context.els.dashboardActivityChart.innerHTML, /NaN|undefined/);
});

test("dashboard and invoice builder polish remains wired", () => {
  assert.doesNotMatch(html, /âŒ•/);
  assert.match(html, /data-lucide="search"/);
  assert.match(html, /20260907-template-picker-v6/);
  assert.doesNotMatch(html, /class="dashboard-motion-strip"/);
  assert.doesNotMatch(html, /<th scope="col">Status<\/th>/);
  assert.doesNotMatch(html, /<th scope="col">Total<\/th>/);
  assert.match(script, /colspan="5"/);
  assert.doesNotMatch(script, /dashboard-client-status/);
  assert.doesNotMatch(styles, /#singleClientStage::before\s*\{/);
  assert.match(html, /class="invoice-builder-heading-signal"[\s\S]*?<span><\/span><span><\/span><span><\/span>/);
  assert.match(styles, /#single \.invoice-builder-heading-signal[\s\S]*?border-radius: 999px/);
  assert.match(styles, /#single \.invoice-builder-heading-signal span[\s\S]*?animation: saved-directory-pulse/);
  assert.match(styles, /#single > \.section-heading h2[\s\S]*?font-family: "Inter"[\s\S]*?font-weight: 500/);
  assert.match(html, /data-change-builder-client[\s\S]*?Change client/);
  assert.match(script, /querySelectorAll\("\[data-change-builder-client\]"\)[\s\S]*?setBuilderStage\("single", "client"\)/);
  assert.match(styles, /@keyframes clientChoiceIn/);
  assert.match(styles, /@keyframes selectedClientGlow/);
  assert.match(styles, /\.dashboard-welcome h2[\s\S]*?font-family: "Outfit", "Inter"/);
  assert.match(styles, /dashboard-activity-line/);
  assert.match(styles, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\) !important/);
  assert.match(styles, /\.dashboard-module-card small[\s\S]*?font-size: 13px/);
  assert.match(styles, /\.dashboard-client-table tbody td[\s\S]*?min-height: 54px/);
});

test("single invoice template picker uses the simplified accessible card design", () => {
  assert.match(script, /class="template-card-avatar"/);
  assert.match(script, /class="template-card-copy"/);
  assert.match(script, /class="template-card-meta"/);
  assert.match(script, /class="template-card-category"/);
  assert.match(script, /button\.setAttribute\("aria-pressed", String\(isSelected\)\)/);
  assert.match(styles, /#singleTemplateStage \.builder-template-choice[\s\S]*?background: #ffffff !important;[\s\S]*?border: 1px solid #dce3ec !important/);
  assert.match(styles, /#singleTemplateStage \.builder-template-choice\.is-selected[\s\S]*?background: #faf7ff !important;[\s\S]*?border: 2px solid #7c3aed !important;[\s\S]*?box-shadow: none !important/);
  assert.match(styles, /\.builder-template-choice::after[\s\S]*?content: none !important/);
  assert.match(styles, /@media \(max-width: 1160px\)[\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(styles, /@media \(max-width: 680px\)[\s\S]*?grid-template-columns: 1fr/);
});
