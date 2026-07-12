import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Go Supps Invoice Template | MC011",
  description:
    "Editable Go Supps invoice template with controlled team access, automatic totals, saved records and print-ready export.",
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
