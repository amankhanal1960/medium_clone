"use client";
import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Image from "next/image";
import PopUp from "@/src/components/navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";

const story = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/");
  };

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };
  return (
    <div>
      <div className="h-screen bg-white">
        <div className="px-6 py-2 flex items-center justify-between bg-white">
          <div className="flex items-end gap-3">
            <h1
              className="font-bold text-black text-[30px] cursor-pointer"
              onClick={handleLogin}
            >
              Medium
            </h1>
            <div className="text-black text-sm mb-2">
              <p>Draft in Amankhanal</p>
            </div>
          </div>
          <div className="flex gap-6 items-center text-gray-400">
            <div className="text-[13px] text-white bg-green-900 opacity-30 px-2.5 py-0.5 rounded-3xl">
              <button>Publish</button>
            </div>
            <i className="fa-solid fa-ellipsis cursor-pointer"></i>
            <i className="flex fa-regular fa-bell fa-lg  cursor-pointer  hover:text-gray-900"></i>
            <Image
              src="/assects/me1.jpg"
              alt="Placeholder Image"
              width={600}
              height={600}
              priority
              className="w-8 h-8 rounded-full border-gray-300 cursor-pointer  hover:opacity-55 transition"
              onClick={togglePopup}
            />
          </div>
        </div>

        {isPopupVisible && <PopUp />}
      </div>
    </div>
  );
};

export default story;
