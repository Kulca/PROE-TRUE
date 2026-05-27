import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Proe — South African Freebie Marketplace",
  description: "Discover free samples and products from South African brands via PUDO smart lockers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}