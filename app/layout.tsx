import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Invoice Maker Tool — Business Dashboard",
  description:
    "Create, clean, process, and export invoices from one focused business dashboard.",
  openGraph: {
    title: "Invoice Maker Tool — Business Dashboard",
    description: "Create, clean, process, and export invoices from one focused business dashboard.",
    images: [{ url: "/og-dashdark.png", width: 1536, height: 1024, alt: "Invoice Maker Tool Business Dashboard" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Invoice Maker Tool — Business Dashboard",
    description: "Create, clean, process, and export invoices from one focused business dashboard.",
    images: ["/og-dashdark.png"],
  },
  icons: {
    icon: "/assets/invoice-tool-logo.svg",
    shortcut: "/assets/invoice-tool-logo.svg",
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
