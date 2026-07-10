import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MC011 Invoice Editor",
  description:
    "Authorized invoice editor dashboard with templates, clients, single invoices, bulk CSV import and saved invoice records.",
};

export default function Home() {
  return (
    <main className="site-frame">
      <iframe
        title="MC011 Invoice Editor"
        src="/editor/index.html"
        className="editor-frame"
      />
    </main>
  );
}
