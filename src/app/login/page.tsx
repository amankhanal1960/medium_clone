"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      // call backend api
    },
  });

  const handleClose = () => {
    router.push("/");
  };

  return (
    <div>
      <div className="flex items-center justify-center h-screen bg-gray-50 overflow-hidden relative">
        {/* Background overlay */}
        <div
          className="absolute inset-0 bg-gray-50 opacity-80 z-10"
          onClick={handleClose}
        ></div>

        {/* Login form */}
        <div className="bg-white shadow-lg rounded-lg md:w-[670px] w-[600px] md:p-[38px] pt-[55px] md:h-[95%] h-[100%] relative z-20">
          <div className="relative">
            <img
              src="/assects/x.svg"
              alt="Close button"
              className="absolute top-0 right-0 w-6 h-6 cursor-pointer z-30 md:-translate-y-6 md:translate-x-6 -translate-y-9 -translate-x-3"
              onClick={handleClose}
            />
          </div>
          <h2 className="text-[26px] font-normal text-black mt-[14px] mb-20 text-center">
            Welcome back.
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
              <span className="flex-grow text-center">
                Sign in with Facebook
              </span>
            </button>

            <button className="relative w-[300px] flex items-center border border-black rounded-full px-4 py-[10px] text-sm font-medium text-gray-800 hover:bg-gray-100">
              <img
                src="/assects/apple-logo.png"
                alt="Apple logo"
                className="absolute left-3 w-4 h-4"
              />
              <span className="flex-grow text-center">Sign in with Apple</span>
            </button>

            <button className="relative w-[300px] flex items-center border border-black rounded-full px-4 py-[10px] text-sm font-medium text-gray-800 hover:bg-gray-100">
              <img
                src="/assects/twitter.png"
                alt="Twitter logo"
                className="absolute left-3 w-4 h-4"
              />
              <span className="flex-grow text-center">Sign in with X</span>
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
              No account?&nbsp;
              <a href="#" className="text-green-800  font-bold">
                Create one
              </a>
            </p>
          </div>

          <div className="mt-16 text-center text-xs font-light text-gray-600 px-10">
            <p className=" mb-10">
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
    </div>
  );
};

export default LoginPage;
