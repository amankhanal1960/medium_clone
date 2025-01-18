import { inter, playfairDisplay } from "@/src/components/ui/fonts";
import "./globals.css";
import { ClientOnlyGoogleOAuthProvider } from "@/src/components/GoogleOathProvider";

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
