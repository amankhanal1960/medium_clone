import { inter, playfairDisplay } from "@/src/components/ui/fonts";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${inter.className} ${playfairDisplay.className} antialiased`}
      >
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          <div className="flex flex-col min-h-screen">
            <ToastContainer />
            <main className="flex-1 relative">{children}</main>
          </div>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
