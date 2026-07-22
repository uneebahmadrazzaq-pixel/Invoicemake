import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MC011 Invoice Website",
  description:
    "Invoice service website with Home, Our Services, and a dedicated invoice tool workspace.",
};

export default function Home() {
  return (
    <main className="site-frame">
      <iframe
        title="MC011 Invoice Website"
        src="/editor/index.html?v=20260719-number-sequence"
        className="editor-frame"
      />
    </main>
  );
}
