import { build } from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";

await mkdir("public/editor/cloud", { recursive: true });

const config = {
  supabaseUrl: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wwlgzdwkaqmnbopmukjq.supabase.co",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_PPCw6XJgn_ht1LOKQejSdg_v640yyal",
  hcaptchaSiteKey: process.env.HCAPTCHA_SITE_KEY || process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || "c04c6d90-8124-444c-af1c-39deb6d413d0",
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

console.log("Supabase browser client built.");
