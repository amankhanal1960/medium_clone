"use client";

import type React from "react";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface LoginPopupProps {
  onClose: () => void;
}

const LoginPopup = ({ onClose }: LoginPopupProps) => {
  const router = useRouter();
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);

  useEffect(() => {
    setIsRegisterPopupOpen(true);
    return () => setIsRegisterPopupOpen(false);
  }, []);

  // Use NextAuth signIn for Google OAuth
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/membership" }); // Redirect to /membership after login
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out ${
        isRegisterPopupOpen
          ? "bg-gray-50 bg-opacity-90"
          : "bg-gray-50 bg-opacity-0"
      }`}
    >
      <div
        className={`bg-white shadow-lg rounded-lg md:w-[670px] w-[600px] md:p-[38px] pt-[55px] md:h-[95%] h-[100%] relative transition-transform duration-300 ease-in-out ${
          isRegisterPopupOpen
            ? "transform translate-y-0 scale-x-100 scale-y-100 opacity-100"
            : "transform translate-y-[10%] scale-x-[0.9] scale-y-[0.9] opacity-0"
        }`}
      >
        <button
          className="absolute top-4 right-4 w-6 h-6 text-gray-600 hover:text-gray-800"
          onClick={onClose}
          aria-label="Close login popup"
        >
          <img src="/assects/x.svg" alt="Close" className="w-full h-full" />
        </button>
        <h2 className="text-[26px] font-normal text-black mt-[14px] mb-20 text-center">
          Welcome back.
        </h2>

        <div className="flex flex-col gap-3 items-center justify-center">
          <button
            className="relative w-[300px] flex items-center border border-black rounded-full px-4 py-[10px] text-sm font-medium text-gray-800 hover:bg-gray-100"
            onClick={handleGoogleSignIn} // ✅ Use NextAuth for Google login
          >
            <img
              src="/assects/google.png"
              alt="Google Logo"
              className="absolute left-3 w-4 h-4"
            />
            <span className="flex-grow text-center">Sign in with Google</span>
          </button>

          <button className="relative w-[300px] flex items-center border border-black rounded-full px-4 py-[10px] text-sm font-medium text-gray-800 hover:bg-gray-100">
            <img
              src="/assects/facebook.png"
              alt="Facebook Logo"
              className="absolute left-3 w-4 h-4"
            />
            <span className="flex-grow text-center">Sign in with Facebook</span>
          </button>

          <button className="relative w-[300px] flex items-center border border-black rounded-full px-4 py-[10px] text-sm font-medium text-gray-800 hover:bg-gray-100">
            <img
              src="/assects/apple-logo.png"
              alt="Apple Logo"
              className="absolute left-3 w-4 h-4"
            />
            <span className="flex-grow text-center">Sign in with Apple</span>
          </button>

          <button className="relative w-[300px] flex items-center border border-black rounded-full px-4 py-[10px] text-sm font-medium text-gray-800 hover:bg-gray-100">
            <img
              src="/assects/twitter.png"
              alt="X Logo"
              className="absolute left-3 w-4 h-4"
            />
            <span className="flex-grow text-center">Sign in with X</span>
          </button>

          <button
            className="relative w-[300px] flex items-center border border-black rounded-full px-4 py-[10px] text-sm font-medium text-gray-800 hover:bg-gray-100"
            onClick={() => router.push("/signUp")}
          >
            <img
              src="/assects/mail.png"
              alt="Mail Logo"
              className="absolute left-3 w-4 h-4"
            />
            <span className="flex-grow text-center">Sign in with email</span>
          </button>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm font-semibold text-gray-800">
            No account?&nbsp;
            <a href="#" className="text-green-800 font-bold">
              Create one
            </a>
          </p>
        </div>

        <div className="mt-16 text-center text-xs font-light text-gray-600 px-10">
          <p className="mb-10">
            Forgot email or trouble signing in?&nbsp;
            <a href="#" className="underline">
              Get help.
            </a>
          </p>
          <p>
            Click "Sign in" to agree to Medium's&nbsp;
            <a href="#" className="underline">
              Terms of Service
            </a>
            &nbsp;and acknowledge that Medium's&nbsp;
            <a href="#" className="underline">
              Privacy Policy
            </a>
            &nbsp;applies to you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
