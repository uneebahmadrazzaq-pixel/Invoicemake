import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoice Studio — Business Dashboard",
  description:
    "A dark business dashboard for invoice creation, data cleaning, and supplier-ready exports.",
};

export default function Home() {
  return (
    <main className="site-frame">
      <iframe
        title="Invoice Studio Workspace"
        src="/editor/index.html?v=20260723-client-ux"
        className="editor-frame"
      />
    </main>
  );
}
