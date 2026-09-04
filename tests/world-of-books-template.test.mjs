import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("World of Books is available as an editable paid invoice using its embedded PDF fonts", async () => {
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
  assert.match(styles, /@page wob-a4/);

  await Promise.all([
    access(new URL("../public/assets/world-of-books-logo-header.png", import.meta.url)),
    access(new URL("../public/assets/world-of-books-logo-footer.png", import.meta.url)),
    access(new URL("../public/assets/fonts/world-of-books-lato-regular.ttf", import.meta.url)),
    access(new URL("../public/assets/fonts/world-of-books-lato-bold.ttf", import.meta.url))
  ]);
});
