import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoice Tool — Business Dashboard",
  description:
    "A dark business dashboard for invoice creation, data cleaning, and supplier-ready exports.",
};

export default function Home() {
  return (
    <main className="site-frame">
      <iframe
        title="Invoice Tool Workspace"
        src="/editor/index.html?v=20260908-saved-all-v16"
        className="editor-frame"
      />
    </main>
  );
}
