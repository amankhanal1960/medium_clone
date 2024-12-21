// "use client";
// import React, { useEffect, useState } from "react";
import { inter, playfairDisplay } from "@/components/ui/fonts";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
import "./globals.css";
import { ClientOnlyGoogleOAuthProvider } from "@/components/GoogleOathProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${playfairDisplay.className} antialiased`}
      >
        <ClientOnlyGoogleOAuthProvider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-1 relative">{children}</main>
          </div>
        </ClientOnlyGoogleOAuthProvider>
      </body>
    </html>
  );
}
