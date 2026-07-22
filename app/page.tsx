import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoice Studio — Pulse Interface Workspace",
  description:
    "A Pulse-designed workspace for invoice creation, bulk processing, data cleaning, and supplier-ready exports.",
};

export default function Home() {
  return (
    <main className="site-frame">
      <iframe
        title="Invoice Studio Workspace"
        src="/editor/index.html?v=20260722-pulse-refined"
        className="editor-frame"
      />
    </main>
  );
}
