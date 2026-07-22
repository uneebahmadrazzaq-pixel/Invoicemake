import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoice Studio — Aether Intelligence Workspace",
  description:
    "An Aether-designed intelligence workspace for invoice creation, data cleaning, and supplier-ready exports.",
};

export default function Home() {
  return (
    <main className="site-frame">
      <iframe
        title="Invoice Studio Workspace"
        src="/editor/index.html?v=20260722-static"
        className="editor-frame"
      />
    </main>
  );
}
