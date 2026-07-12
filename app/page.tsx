import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VetUK Invoice Designer | MC011",
  description:
    "Editable VetUK invoice design with automatic totals, team workflows, saved records and print-ready export.",
};

export default function Home() {
  return (
    <main className="site-frame">
      <iframe
        title="MC011 Invoice Website"
        src="/editor/index.html?v=20260712-vetuk-design-three"
        className="editor-frame"
      />
    </main>
  );
}
