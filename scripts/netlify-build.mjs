import { spawnSync } from "node:child_process";

if (!process.env.CONVEX_DEPLOY_KEY) {
  console.warn("CONVEX_DEPLOY_KEY is not configured; building the existing editor with cloud login disabled.");
  await import("./build-cloud-client.mjs");
  process.exit(0);
}

const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const result = spawnSync(command, ["exec", "convex", "deploy", "--cmd", "pnpm run build:cloud"], {
  stdio: "inherit",
  env: process.env,
});

if (result.error) throw result.error;
process.exit(result.status ?? 1);
