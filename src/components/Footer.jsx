import React from "react";
import { footerLinks } from "@/constants/index";

const Footer = () => {
  return (
    <>
      <footer className="bg-gray-100 py-6">
        <hr className="absolute bottom-16 z-10 left-0 w-full border-t border-black" />
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            {footerLinks.map((link, index) => (
              <li key={index}>
                <a href={link.href} className="hover:underline">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </>
  );
};

export default Footer;
