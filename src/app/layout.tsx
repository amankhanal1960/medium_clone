// src/app/layout.tsx
import { inter, playfairDisplay } from "@/src/components/ui/fonts";
import "./globals.css";
import ClientProviders from "../components/clientProviders";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
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
