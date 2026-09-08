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

test("dashboard includes a client-filtered account outcome pie chart", () => {
  assert.match(html, /id="dashboardOutcomeClient"/);
  assert.match(html, /id="dashboardOutcomeChart"/);
  assert.match(html, /id="dashboardSummaryReinstated"/);
  assert.match(html, /id="dashboardSummarySuspended"/);
  assert.doesNotMatch(html, /id="dashboardSummaryDrafts"/);
  assert.doesNotMatch(html, /Draft invoices/);
  assert.match(script, /function getInvoiceAccountOutcome/);
  assert.match(script, /function renderDashboardAccountOutcomes/);
  assert.match(script, /Account reinstated \$\{reinstatedPercent\} percent/);
  assert.match(styles, /\.dashboard-outcome-pie[\s\S]*?conic-gradient\(#7137e8/);
  assert.match(styles, /@keyframes dashboardOutcomeIn/);
});

test("account outcome pie calculates saved invoice percentages", () => {
  const context = {
    Math,
    state: {
      clients: [{ id: "client-a", name: "Client A" }],
      invoices: [
        { clientId: "client-a", accountOutcome: "reinstated" },
        { clientId: "client-a", accountOutcome: "suspended" },
        { clientId: "client-a" }
      ]
    },
    els: {
      dashboardOutcomeClient: { value: "", innerHTML: "" },
      dashboardOutcomeChart: { innerHTML: "" }
    },
    escapeHtml: (value) => String(value)
  };
  vm.createContext(context);
  vm.runInContext(`${extractFunction("getInvoiceAccountOutcome")}\n${extractFunction("renderDashboardAccountOutcomes")}`, context);
  context.renderDashboardAccountOutcomes();

  assert.match(context.els.dashboardOutcomeChart.innerHTML, /Account reinstated 67 percent/);
  assert.match(context.els.dashboardOutcomeChart.innerHTML, /account suspended 33 percent/);
  assert.match(context.els.dashboardOutcomeChart.innerHTML, /--reinstated-angle:240deg/);
  assert.doesNotMatch(context.els.dashboardOutcomeChart.innerHTML, /NaN|undefined/);
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
  assert.match(html, /20260908-account-outcomes-v17/);
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
  assert.match(script, /class="template-card-meta"/);
  assert.match(script, /class="template-card-category"/);
  assert.match(script, /button\.setAttribute\("aria-pressed", String\(isSelected\)\)/);
  assert.match(html, /id="singleTemplateSearch"[^>]*type="search"/);
  assert.match(script, /function filterSingleTemplateChoices\(\)/);
  assert.match(script, /button\.hidden = !isVisible/);
  assert.doesNotMatch(script, /templateAvatarTextColor/);
  assert.match(styles, /#singleTemplateStage \.builder-template-choice[\s\S]*?linear-gradient\(100deg, #fbfaff, #f4efff\)[\s\S]*?border: 1px solid #ded3fb/);
  assert.match(styles, /#singleTemplateStage \.builder-template-choice > \.template-card-avatar[\s\S]*?linear-gradient\(135deg, #8b42f1, #5a27bd\)/);
  assert.match(styles, /#singleTemplateStage \.builder-template-choice\.is-selected[\s\S]*?linear-gradient\(100deg, #f8f5ff, #efe8ff\)[\s\S]*?border: 1px solid #7137e8/);
  assert.match(styles, /\.builder-template-choice::after[\s\S]*?content: none !important/);
  assert.match(styles, /#singleTemplateStage \.builder-template-grid[\s\S]*?grid-template-columns: 1fr/);
  assert.match(styles, /@media \(max-width: 680px\)[\s\S]*?grid-template-columns: 1fr/);
});

test("Invoice Tool branding uses the supplied logo asset", () => {
  assert.match(html, /invoice-tool-logo\.svg/);
  assert.doesNotMatch(html, /invoice-studio-logo\.svg/);
  assert.match(html, /<strong>Invoice Tool<\/strong>/);
  assert.match(styles, /\.studio-brand[\s\S]*?justify-content: center/);
});

test("saved invoice directory uses a compact themed design", () => {
  assert.match(styles, /#saved \.saved-client-directory[\s\S]*?border: 1px solid #ddd4f4/);
  assert.match(styles, /#saved \.saved-directory-heading[\s\S]*?linear-gradient\(100deg, #fbfaff 0%, #f4efff 100%\)/);
  assert.match(styles, /#saved \.saved-client-panel > summary[\s\S]*?min-height: 66px/);
  assert.match(styles, /#saved \.saved-count-generated[\s\S]*?background: #eee7ff/);
  assert.match(styles, /#saved \.saved-invoice-table[\s\S]*?border: 1px solid #ddd4f4/);
  assert.match(styles, /#saved \.saved-invoice-row[\s\S]*?min-height: 50px[\s\S]*?font-size: 13px/);
  assert.match(styles, /#saved \.saved-invoice-row:not\(\.saved-invoice-head\) > strong[\s\S]*?font-size: 15px/);
  assert.match(styles, /#saved \.saved-row-actions button\.is-primary[\s\S]*?background: #7137e8/);
});
