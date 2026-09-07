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
  assert.match(html, /20260907-dashboard-insights/);
  assert.match(styles, /#singleClientStage::before[\s\S]*?animation: templateStageFlow/);
  assert.match(styles, /#single > \.section-heading h2[\s\S]*?font-weight: 760/);
  assert.match(styles, /dashboard-activity-line/);
  assert.match(styles, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\) !important/);
});
