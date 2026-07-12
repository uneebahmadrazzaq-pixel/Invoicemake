import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Go Supps Invoice Template | MC011",
  description:
    "Editable Go Supps invoice template with automatic totals, team workflows, saved records and print-ready export.",
};

export default function Home() {
  return (
    <main className="site-frame">
      <iframe
        title="MC011 Invoice Website"
        src="/editor/index.html?v=20260712-gosupps-header-asset"
        className="editor-frame"
      />
    </main>
  );
}
