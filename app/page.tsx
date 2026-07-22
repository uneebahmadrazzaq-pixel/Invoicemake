import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoice Studio — Professional Invoice Workspace",
  description:
    "A dark, focused workspace for invoice creation, bulk processing, data cleaning, and supplier-ready exports.",
};

export default function Home() {
  return (
    <main className="site-frame">
      <iframe
        title="MC011 Invoice Website"
        src="/editor/index.html?v=20260722-halo-redesign"
        className="editor-frame"
      />
    </main>
  );
}
