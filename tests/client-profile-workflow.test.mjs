import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("client profiles are editable and remain the source for invoice fields", async () => {
  const [html, script] = await Promise.all([
    readFile(new URL("public/editor/index.html", root), "utf8"),
    readFile(new URL("public/editor/app.js", root), "utf8")
  ]);

  assert.match(html, /id="clientFormTitle">Add client/);
  assert.match(html, /Profile Label\s*<input id="clientCaseNumber"/);
  assert.match(script, /let editingClientId = ""/);
  assert.match(script, /function editClientProfile\(clientId\)/);
  assert.match(script, /state\.clients\.splice\(existingIndex, 1, client\)/);
  assert.match(script, /editClientProfile\(button\.dataset\.directoryClient\)/);
  assert.match(script, /const selectedClient = state\.clients\.find/);
  assert.match(script, /applyTemplateDefaults\(templateId\);[\s\S]*?applyClientToCurrent\(selectedClient\)/);
  assert.match(script, /billToFields:\s*\{ \.\.\.\(state\.current\.billToFields/);
  assert.match(script, /paymentDetails:\s*state\.current\.paymentDetails/);
});

test("client profiles can copy Bill To into Ship To and select ten currencies", async () => {
  const [html, script, styles] = await Promise.all([
    readFile(new URL("public/editor/index.html", root), "utf8"),
    readFile(new URL("public/editor/app.js", root), "utf8"),
    readFile(new URL("public/editor/styles.css", root), "utf8")
  ]);

  assert.match(html, /id="sameAsBillTo" type="checkbox"/);
  assert.match(html, /Same as Bill To/);
  assert.match(script, /function copyBillToToShipTo\(\)/);
  assert.match(script, /if \(els\.sameAsBillTo\.checked\) copyBillToToShipTo\(\)/);
  assert.match(script, /input\.readOnly = linked/);
  assert.match(styles, /\.address-match-toggle/);

  for (const value of ["$", "GBP", "EUR", "CAD", "AUD", "JPY", "CNY", "INR", "AED", "CHF"]) {
    const escaped = value === "$" ? "\\$" : value;
    assert.match(html, new RegExp(`<option value="${escaped}">`));
  }
  assert.match(script, /currency === "CAD"/);
  assert.match(script, /currency === "AED"/);
  assert.match(script, /currency === "CHF"/);
});
