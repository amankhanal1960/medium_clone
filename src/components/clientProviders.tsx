"use client";

import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import type { ReactNode } from "react";

export default function ClientProviders({ children }: { children: ReactNode }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    throw new Error(
      "Google Client ID is missing in the environment variables."
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <SessionProvider>
        <ToastContainer />
        {children}
      </SessionProvider>
    </GoogleOAuthProvider>
  );
}
