import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Invoice Studio — Aether Intelligence Workspace",
  description:
    "A glassy intelligence-network workspace for invoice cleaning, generation, and export-ready results.",
  openGraph: {
    title: "Invoice Studio — Aether Intelligence Network",
    description: "Create, clean, process, and export invoices through one intelligent network.",
    images: [{ url: "/og-aether.png", width: 1536, height: 1024, alt: "Invoice Studio Aether Intelligence Network" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Invoice Studio — Aether Intelligence Network",
    description: "Create, clean, process, and export invoices through one intelligent network.",
    images: ["/og-aether.png"],
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
