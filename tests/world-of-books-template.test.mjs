import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

test("World of Books is available as an editable paid invoice using the source PDF's complete Lato 1.104 fonts", async () => {
  const [editorSource, styles, cloudSource, dashboardStyles] = await Promise.all([
    readFile(new URL("../public/editor/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../cloud/client.ts", import.meta.url), "utf8"),
    readFile(new URL("../public/editor/dashboard-light.css", import.meta.url), "utf8")
  ]);

  assert.match(editorSource, /id:\s*"worldofbooks",\s*name:\s*"World of Books Paid Invoice"/);
  assert.match(editorSource, /template\.id === "worldofbooks"/);
  assert.match(editorSource, /function renderWorldOfBooksPreview/);
  assert.match(cloudSource, /\["worldofbooks", "World of Books Paid Invoice"\]/);
  assert.match(editorSource, /new URLSearchParams\(location\.search\)\.get\("template"\)/);
  assert.doesNotMatch(editorSource, /formatAddress\(customer\)/);
  assert.match(editorSource, /function formatWorldOfBooksCustomer/);
  assert.match(styles, /\.\.\/assets\/fonts\/world-of-books-lato-regular\.ttf/);
  assert.match(styles, /--wob-green:\s*#30844a/);
  assert.match(styles, /grid-template-columns:\s*240px minmax\(0, 1fr\) 170px/);
  assert.match(styles, /\.wob-summary dl div:first-child \{ border-bottom:/);
  assert.match(styles, /\.wob-summary dl div \{[\s\S]*?border-bottom:\s*0;/);
  assert.match(styles, /\.wob-products th:first-child \{ width:\s*30%;/);
  assert.match(dashboardStyles, /\.wob-products th,[\s\S]*?color:\s*var\(--wob-green\) !important;/);
  assert.match(editorSource, /class="invoice-doc wob-invoice"/);
  assert.match(editorSource, /WORLD OF BOOKS LTD/);
  assert.match(styles, /font-family:\s*"WobLato"/);
  assert.match(styles, /world-of-books-lato-regular\.ttf/);
  assert.match(styles, /world-of-books-lato-bold\.ttf/);
  assert.match(styles, /font-display:\s*block/);
  assert.match(styles, /\.invoice-doc\.wob-invoice \*/);
  assert.match(styles, /font-family:\s*"WobLato", sans-serif !important/);
  assert.match(styles, /font-weight:\s*400 !important/);
  assert.match(styles, /font-kerning:\s*none !important/);
  assert.match(styles, /font-feature-settings:\s*"kern" 0 !important/);
  assert.match(styles, /\.wob-address-block strong,[\s\S]*?\.wob-paid-box strong[\s\S]*?font-weight:\s*700 !important/);
  assert.match(editorSource, /document\.fonts\.load\('400 16px "WobLato"'\)/);
  assert.match(editorSource, /document\.fonts\.load\('700 16px "WobLato"'\)/);
  assert.match(styles, /@page wob-a4/);

  await Promise.all([
    access(new URL("../public/assets/world-of-books-logo-header.png", import.meta.url)),
    access(new URL("../public/assets/world-of-books-logo-footer.png", import.meta.url)),
    access(new URL("../public/assets/fonts/world-of-books-lato-regular.ttf", import.meta.url)),
    access(new URL("../public/assets/fonts/world-of-books-lato-bold.ttf", import.meta.url))
  ]);

  const [regularFont, boldFont] = await Promise.all([
    stat(new URL("../public/assets/fonts/world-of-books-lato-regular.ttf", import.meta.url)),
    stat(new URL("../public/assets/fonts/world-of-books-lato-bold.ttf", import.meta.url))
  ]);
  assert.ok(regularFont.size > 100_000, "regular font must be the complete Lato 1.104 font, not a PDF subset");
  assert.ok(boldFont.size > 100_000, "bold font must be the complete Lato 1.104 font, not a PDF subset");
});
