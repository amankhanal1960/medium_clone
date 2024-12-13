import React from "react";
import { inter } from "@/app/font";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";
import HeroSection from "@/components/HeroSection";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
            <section>
              <HeroSection />
            </section>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
