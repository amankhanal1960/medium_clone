"use client";

import type React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface RegisterPopupProps {
  onClose: () => void;
  mode?: "write" | "start";
}

//this declares a functional React component named LoginPopup using typescript
//({ onClose }) this props object is destructured to extract the onClose function
const RegisterPopup = ({ onClose, mode = "start" }: RegisterPopupProps) => {
  const router = useRouter();

  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);

  useEffect(() => {
    setIsRegisterPopupOpen(true);
    return () => setIsRegisterPopupOpen(false);
  }, []);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      // call backend api
    },
  });

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
            ? "transform translate-y-0 scale-x-100 scale-y-100 opacity-100" // Popup fully visible and scaled to 100%
            : "transform translate-y-[10%] scale-x-[0.9] scale-y-[0.9] opacity-0" // Starts from 70% width and height, moved from bottom
        }`}
      >
        <button
          className="absolute top-4 right-4 w-6 h-6 text-gray-600 hover:text-gray-800"
          onClick={onClose}
          aria-label="Close login popup"
        >
          <img src="/assects/x.svg" alt="Close" className="w-full h-full" />
        </button>
        <h2 className="text-[26px] font-normal text-black mt-20 mb-20 text-center">
          {mode === "write"
            ? "Create an account to start writing"
            : "Join medium"}
        </h2>

        <div className="flex flex-col gap-3 items-center justify-center">
          {/* Social buttons */}
          <button
            className="relative w-[300px] flex items-center border border-black rounded-full px-4 py-[10px] text-sm font-medium text-gray-800 hover:bg-gray-100"
            onClick={() => login()}
          >
            <img
              src="/assects/google.png"
              alt="Google logo"
              className="absolute left-3 w-4 h-4"
            />
            <span className="flex-grow text-center">Sign in with Google</span>
          </button>

          <button className="relative w-[300px] flex items-center border border-black rounded-full px-4 py-[10px] text-sm font-medium text-gray-800 hover:bg-gray-100">
            <img
              src="/assects/facebook.png"
              alt="Facebook logo"
              className="absolute left-3 w-4 h-4"
            />
            <span className="flex-grow text-center">Sign in with Facebook</span>
          </button>

          <button
            className="relative w-[300px] flex items-center border border-black rounded-full px-4 py-[10px] text-sm font-medium text-gray-800 hover:bg-gray-100"
            onClick={() => router.push("/membership")}
          >
            <img
              src="/assects/mail.png"
              alt="Mail logo"
              className="absolute left-3 w-4 h-4"
            />
            <span className="flex-grow text-center">Sign in with email</span>
          </button>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm font-semibold text-gray-800">
            Already have an account?&nbsp;
            <a href="#" className="text-green-800  font-bold">
              Sign in
            </a>
          </p>
        </div>

        <div className="mt-24 text-center text-xs font-light text-gray-600 px-10">
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

export default RegisterPopup;
