import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import {readFile} from 'node:fs/promises';
const source = await readFile(new URL('../cloud/client.ts', import.meta.url), 'utf8');
const styles = await readFile(new URL('../public/editor/cloud/cloud.css', import.meta.url), 'utf8');
function gateContext() {
  const gateContent = {innerHTML: ''};
  let locks = 0;
  const context = vm.createContext({gateContent, lockWorkspace: () => locks++, document: {getElementById: () => null}, escapeHtml: value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')});
  const code = source.slice(source.indexOf('function renderGate('), source.indexOf('function lockWorkspace('));
  vm.runInContext(ts.transpileModule(code, {compilerOptions: {target: ts.ScriptTarget.ES2022}}).outputText, context);
  return {context, gateContent, locks: () => locks};
}
test('workspace loading has accessible indeterminate indicators and safe text', () => {
  const {context, gateContent, locks} = gateContext();
  context.renderGate('Opening your workspace', 'Loading <invoices>…');
  assert.match(gateContent.innerHTML, /class="cloud-workspace-loading" role="status" aria-busy="true"/);
  assert.match(gateContent.innerHTML, /cloud-loading-ring/);
  assert.match(gateContent.innerHTML, /cloud-loading-track/);
  assert.match(gateContent.innerHTML, /Loading &lt;invoices&gt;/);
  assert.doesNotMatch(gateContent.innerHTML, /cloudSignOut|aria-valuenow/);
  assert.equal(locks(), 1);
});
test('error gates retain sign-out and never display a misleading loading indicator', () => {
  const {context, gateContent, locks} = gateContext();
  context.renderGate('Access renewal required', 'Please contact the administrator.', true);
  assert.match(gateContent.innerHTML, /id="cloudSignOut"/);
  assert.match(gateContent.innerHTML, /cloud-message-card/);
  assert.doesNotMatch(gateContent.innerHTML, /aria-busy|cloud-loading-track/);
  assert.equal(locks(), 1);
});
test('loading card is compact, responsive and respects reduced motion', () => {
  assert.match(styles, /\.cloud-workspace-loading\s*\{[^}]*width: min\(100%, 480px\)/s);
  assert.match(styles, /@media \(max-width: 520px\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.cloud-loading-ring, \.cloud-loading-track span \{ animation: none; \}/);
});
