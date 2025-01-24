"use client";
import React, { useState } from "react";
import { navLinks } from "@/src/constants";
// import { useRouter } from "next/navigation"
import Link from "next/link";
import LoginPopup from "../app/LoginPopup/page";
import RegisterPopup from "../app/register/page";

const Header = () => {
  const [isLoginPopupOpen, setisLoginPopupOpen] = useState(false);
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);
  const [mode, setMode] = useState(null); // Mode can be "write" or "start"

  const handleRegister = (mode) => {
    setMode(mode);
    setIsRegisterPopupOpen(true);
  };

  return (
    <header className=" z-10 w-full fixed bg-customBackground">
      <nav className="flex flex-1 items-center justify-between gap-8 py-5 px-2 sm:px-12 md:px-16 lg:px-28 xl:px-44">
        <h1 className="text-3xl font-extrabold text-gray-950 cursor-pointer">
          Medium
        </h1>
        <div className="flex items-center gap-6 ">
          <ul className="flex items-center gap-6">
            {navLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-gray-950 font-medium text-sm hidden md:block"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <p
                onClick={() => handleRegister("write")}
                className="text-gray-950 font-medium text-sm hidden md:block cursor-pointer"
              >
                Write
              </p>
            </li>
          </ul>
          <p
            className="text-gray-950 font-medium hidden sm:flex cursor-pointer text-sm"
            onClick={() => setisLoginPopupOpen(true)}
          >
            Sign in
          </p>

          <button
            className="flex justify-center items-center gap-2 px-[16px] py-[8px] font-normal text-sm bg-black text-white rounded-full"
            onClick={() => handleRegister("start")}
          >
            Get Started
          </button>
        </div>
      </nav>
      <hr className="border-t border-black" />
      {/* the expression on the right will only be evaluated if the condition on the
      left (isLoginPopupOpen) is true. */}

      {isLoginPopupOpen && (
        <LoginPopup onClose={() => setisLoginPopupOpen(false)} />
      )}
      {isRegisterPopupOpen && (
        <RegisterPopup
          onClose={() => setIsRegisterPopupOpen(false)}
          mode={mode}
        />
      )}
    </header>
  );
};

export default Header;
