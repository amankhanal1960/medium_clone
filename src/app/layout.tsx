"use client";

import { inter, playfairDisplay } from "@/src/components/ui/fonts";
import "./globals.css";
import ClientProviders from "../components/clientProviders";
import type { ReactNode } from "react";
import { useEffect } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Detect in-app browser
    const userAgent = navigator.userAgent || navigator.vendor;
    const isInAppBrowser =
      /(FBAN|FBAV|Instagram|Messenger|Line|Twitter|Pinterest|Snapchat|WhatsApp)/i.test(
        userAgent
      );

    // Show alert if in-app browser detected
    if (isInAppBrowser) {
      alert(
        "It looks like you are using an in-app browser, which may not support all features of this site. For the best experience, please open this link in your full web browser (such as Chrome or Safari). You can copy the URL and paste into your preferred browser to continue."
      );
    }
  }, []);

  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${inter.className} ${playfairDisplay.className} antialiased`}
      >
        {/* Wrap everything inside ClientProviders to handle SessionProvider, ToastContainer, and GoogleOAuthProvider */}
        <ClientProviders>
          <div className="flex flex-col min-h-screen">
            <main className="flex-1 relative">{children}</main>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
