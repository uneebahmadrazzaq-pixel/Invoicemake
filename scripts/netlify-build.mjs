await import("./build-cloud-client.mjs");
// Render the actual website at the entry point instead of a visible meta-refresh page.
const { readFile, writeFile } = await import("node:fs/promises");
const editorHtml = await readFile(new URL("../public/editor/index.html", import.meta.url), "utf8");
await writeFile(new URL("../public/index.html", import.meta.url), editorHtml.replace("<head>", '<head>\n    <base href="./editor/" />'), "utf8");
