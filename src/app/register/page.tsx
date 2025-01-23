"use client";

import type React from "react";
import { useGoogleLogin } from "@react-oauth/google";

interface RegisterPopupProps {
  onClose: () => void;
  mode?: "write" | "start";
}

//this declares a functional React component named LoginPopup using typescript
//({ onClose }) this props object is destructured to extract the onClose function
const RegisterPopup: React.FC<RegisterPopupProps> = ({
  onClose,
  mode = "start",
}) => {
  //useGoogleLogin hook to handle the login process
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      // call backend api
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 bg-opacity-80">
      {/* Login form */}
      <div className="bg-white shadow-lg rounded-lg md:w-[670px] w-[600px] md:p-[38px] pt-[55px] md:h-[95%] h-[100%] relative">
        <div className="relative">
          <img
            src="/assects/x.svg"
            alt="Close button"
            className="absolute top-0 right-0 w-6 h-6 cursor-pointer z-30 md:-translate-y-6 md:translate-x-6 -translate-y-9 -translate-x-3"
            onClick={onClose}
          />
        </div>
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

          <button className="relative w-[300px] flex items-center border border-black rounded-full px-4 py-[10px] text-sm font-medium text-gray-800 hover:bg-gray-100">
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
