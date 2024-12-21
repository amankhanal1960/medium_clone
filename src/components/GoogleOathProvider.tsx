"use client";
import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const ClientOnlyGoogleOAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
      {children}
    </GoogleOAuthProvider>
  );
};
