import { build } from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";

await mkdir("public/editor/cloud", { recursive: true });

const config = {
  clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "",
  convexUrl: process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL || "",
};

await writeFile(
  "public/editor/cloud/config.js",
  `window.__INVOICE_CLOUD_CONFIG__ = ${JSON.stringify(config)};\n`,
  "utf8",
);

await build({
  entryPoints: ["cloud/client.ts"],
  outfile: "public/editor/cloud/client.js",
  bundle: true,
  minify: true,
  sourcemap: false,
  format: "iife",
  target: ["es2022"],
});

console.log("Clerk + Convex browser client built.");
