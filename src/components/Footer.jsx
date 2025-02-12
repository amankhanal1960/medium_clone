// components/Footer.tsx
import React from "react";
import { footerLinks, smallScreenLinks } from "@/src/constants";

const Footer = () => {
  return (
    <footer className=" absolute bottom-0 w-full bg-black lg:bg-customBackground text-white pb-7">
      <hr className=" border-t border-black mb-[23px]" />
      <div className="flex flex-col lg:items-center lg:justify-center">
        <ul className="hidden lg:flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600 pr-32">
          {footerLinks.map((link, index) => (
            <li key={index}>
              <a href={link.href} className="hover:underline">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <ul className="flex lg:hidden flex-wrap justify-start gap-4 text-xs text-white pl-2 sm:pl-12 md:pl-16 lg:pl-28">
          {smallScreenLinks.map((link, index) => (
            <li key={index}>
              <a href={link.href} className="hover:underline">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="absolute bottom-2 right-1 sm:font-bold sm:text-xs text-[8px] lg:text-black">
          Copyright © 2025 Aman Khanal. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
