import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VetUK Invoice Designer | MC011",
  description:
    "Editable VetUK invoice design with automatic totals, saved records and print-ready export.",
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
