"use client";
import React, { useState } from "react";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { recommendations } from "@/constants";

const Blog = () => {
  const [activeLink, setActiveLink] = useState("");

  return (
    <div>
      <Navbar />
      <div className="flex h-screen">
        {/* left section */}

        <div className="bg-white w-[65%]">
          <div>
            <div className="text-gray-500 py-8 items-center justify-center ml-10">
              <div className="flex flex-col items-center">
                <ul className=" flex gap-6 text-sm font-semibold">
                  {recommendations.map((item, index) => (
                    <li key={index}>
                      <Link className="hover:text-gray-900 " href={item.href}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <hr className="border-t border-gray-200 mt-4 mx-36" />
            </div>

            <div className="flex mt-4 mx-36 text-black">
              <div className="flex flex-col">
                <p> In Prototype by Melody Koh</p>
                <h2>The UX job Market REALLY sucks right now</h2>
                <h4>Why you should pivot and change directions right NOW</h4>
                <div></div>
              </div>
              <div className="h-22 w-28">
                <img src="https://miro.medium.com/v2/resize:fit:828/format:webp/0*vkzsR4xPNb63GYdn"></img>
              </div>
            </div>
          </div>
        </div>
        <div className="border-l border-gray-200 h-full"></div>
        {/* right section */}
        <div className="bg-white w-[35%]">
          <div className="h-full text-black">
            <div className="p-4">
              <h2 className="text-xl font-semibold">Membership Content</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
