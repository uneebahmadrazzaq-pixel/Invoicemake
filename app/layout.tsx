import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Invoice Studio — Pulse Interface Workspace",
  description:
    "A glassy, atmospheric invoice workspace for data cleaning, invoice generation, and export-ready results.",
  openGraph: {
    title: "Invoice Studio — Pulse Interface",
    description: "Create, clean, process, and export invoices in one focused workspace.",
    images: [{ url: "/og-pulse.png", width: 1536, height: 1024, alt: "Invoice Studio Pulse Interface" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Invoice Studio — Pulse Interface",
    description: "Create, clean, process, and export invoices in one focused workspace.",
    images: ["/og-pulse.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
