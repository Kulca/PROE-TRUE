import type { Metadata } from "next";
import { Inter, DM_Serif_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif-display",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Proe — South African Freebie Marketplace",
  description: "Discover free samples from South African brands.",
};

import { ToastProvider } from "@/components/ui/toast";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { AuthProvider } from "@/components/auth-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(
      inter.variable,
      dmSerifDisplay.variable,
      jetbrainsMono.variable
    )}>
      <body className="bg-bg-primary text-text-primary antialiased font-sans">
        <AuthProvider>
          <ConvexClientProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ConvexClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
