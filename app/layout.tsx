import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MC011 Invoice Editor",
  description:
    "Authorized invoice editor for teams that need client profiles, single invoices, bulk CSV generation, saved records and controlled template access.",
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
