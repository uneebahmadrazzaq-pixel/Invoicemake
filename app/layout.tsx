import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Invoice Studio — Business Dashboard",
  description:
    "Create, clean, process, and export invoices from one focused business dashboard.",
  openGraph: {
    title: "Invoice Studio — Business Dashboard",
    description: "Create, clean, process, and export invoices from one focused business dashboard.",
    images: [{ url: "/og-dashdark.png", width: 1536, height: 1024, alt: "Invoice Studio Business Dashboard" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Invoice Studio — Business Dashboard",
    description: "Create, clean, process, and export invoices from one focused business dashboard.",
    images: ["/og-dashdark.png"],
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
