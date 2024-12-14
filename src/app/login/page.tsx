import React from "react";

const LoginPage = () => {
  return (
    <div>
      <img src="/assects/close.png" alt="close logo" className="w-4 h-4 " />
      <div className="flex items-center justify-center h-screen bg-gray-50 overflow-hidden relative">
        {/* This div adds a semi-transparent background overlay */}
        <div className="absolute inset-0 bg-gray-50 opacity-80 z-10"></div>
        <div className="bg-white shadow-lg rounded-lg md:w-[670px] w-[600px] p-10 md:h-[95%] h-[100%] relative z-20">
          <h2 className="text-[26px] font-normal text-black mt-[14px] mb-20 text-center">
            Welcome back.
          </h2>

          <div className="flex flex-col gap-3 items-center justify-center ">
            <button className="w-[300px] flex items-center justify-center border border-black rounded-full px-4 py-[10px] text-sm font-medium text-gray-800 hover:bg-gray-100">
              <img
                src="/assects/google.png"
                alt="Google logo"
                className="w-4 h-4 mr-5 "
              />
              Sign in with Google
            </button>

            <button className="w-[300px] flex items-center justify-center border border-black rounded-full px-4 py-[10px] text-sm font-medium text-gray-800 hover:bg-gray-100">
              <img
                src="/assects/facebook.png"
                alt="Facebook logo"
                className="w-4 h-4 mr-3"
              />
              Sign in with Facebook
            </button>

            <button className="w-[300px] flex items-center justify-center border border-black rounded-full px-4 py-[10px] text-sm font-medium text-gray-800 hover:bg-gray-100">
              <img
                src="/assects/apple-logo.png"
                alt="Apple logo"
                className="w-4 h-4 mr-3"
              />
              Sign in with Apple
            </button>

            <button className="w-[300px] flex items-center justify-center border border-black rounded-full px-4 py-[10px] text-sm font-medium text-gray-800 hover:bg-gray-100">
              <img
                src="/assects/twitter.png"
                alt="twitter logo"
                className="w-4 h-4 mr-3"
              />
              Sign in with X
            </button>

            <button className="w-[300px] flex items-center justify-center border border-black rounded-full px-4 py-[10px] text-sm font-medium text-gray-800 hover:bg-gray-100">
              <img
                src="/assects/mail.png"
                alt="mail logo"
                className="w-4 h-4 mr-3"
              />
              Sign in with email
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-800">
              No account?&nbsp;
              <a
                href="#"
                className="text-green-600 hover:underline font-semibold"
              >
                Create one
              </a>
            </p>
          </div>

          <div className="mt-16 text-center text-gray-600 px-10">
            <p className="text-xs mb-10">
              Forgot email or trouble signing in?&nbsp;
              <a href="#" className="underline">
                Get help.
              </a>
            </p>
            <p className="text-xs">
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
