"use client";
import React from "react";
import { navLinks } from "@/app/constants/index";
import { Button } from "./ui/Button";
import Link from "next/link";

const Header = () => {
  return (
    <header className=" z-10 w-full fixed bg-customBackground">
      <nav className="flex flex-1 items-center justify-between gap-8 py-5 px-2 sm:px-12 md:px-16 lg:px-28 xl:px-44">
        <h1 className="text-2xl font-extrabold text-gray-950">Medium</h1>
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
          </ul>
          {/* <p className="text-gray-950 font-medium text-sm" onClick={}>Sign in</p> */}

          <Button label="Button" aria-label="Click this button" />
        </div>
      </nav>
      <hr className="border-t border-black" />
    </header>
  );
};

export default Header;
