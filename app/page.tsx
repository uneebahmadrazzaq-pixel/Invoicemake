import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auto Doc Invoice Designer | MC011",
  description:
    "Editable Auto Doc invoice design with automatic totals, team workflows, saved records and print-ready export.",
};

export default function Home() {
  return (
    <main className="site-frame">
      <iframe
        title="MC011 Invoice Website"
        src="/editor/index.html?v=20260713-autodoc-design-one"
        className="editor-frame"
      />
    </main>
  );
}
