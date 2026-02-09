import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "EpsteinRAG — AI Search for Declassified Epstein Documents",
  description:
    "Search 44,886+ declassified Epstein documents from the DOJ with AI-powered analysis. Every answer backed by source citations.",
  keywords: [
    "epstein files",
    "DOJ",
    "declassified documents",
    "search",
    "RAG",
    "AI",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="grain-overlay min-h-screen bg-[#060606] antialiased">
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
