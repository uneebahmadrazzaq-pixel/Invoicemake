import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auto Doc Invoice Designer | MC011",
  description:
    "Editable Auto Doc invoice design with automatic totals, saved records and print-ready export.",
  openGraph: {
    title: "Auto Doc Editable Invoice Designer",
    description: "Create, edit and export a polished Auto Doc invoice format.",
    images: [{ url: "/og.png", width: 1536, height: 806, alt: "Auto Doc Editable Invoice Designer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Auto Doc Editable Invoice Designer",
    description: "Create, edit and export a polished Auto Doc invoice format.",
    images: ["/og.png"],
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
