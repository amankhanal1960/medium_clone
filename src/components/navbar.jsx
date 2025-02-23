"use client";
import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const handleLogout = async () => {
  await signOut({ callbackUrl: "/login" }); // Redirect to login after logout
};

export const PopUp = () => (
  <div className="fixed top-14 right-0 bg-white shadow-lg border border-gray-200 rounded-md p-4 sm:w-72 w-44 z-20">
    <div>
      <ul className="flex flex-col items-start justify-center gap-6">
        <Link
          href={"/username"}
          className="flex items-center gap-4 text-gray-600 hover:text-gray-900 transition"
        >
          <i className="fa-regular fa-user"></i>
          Profile
        </Link>
        <Link
          href={"/"}
          className="flex items-center gap-4 text-gray-600 hover:text-gray-900 transition cursor-pointer"
        >
          <i className="fa-regular fa-bookmark"></i>
          Library
        </Link>
        <Link
          href={"/"}
          className="flex items-center gap-4 text-gray-600 hover:text-gray-900 transition cursor-pointer"
        >
          <i className="fa-regular fa-file-lines"></i>
          Stories
        </Link>
        <Link
          href={"/"}
          className="flex items-center gap-4 text-gray-600 hover:text-gray-900 transition cursor-pointer"
        >
          <i className="fa-solid fa-chart-simple"></i>
          Stats
        </Link>
        <p
          onClick={handleLogout}
          className="flex items-center gap-4 text-gray-600 cursor-pointer hover:text-gray-900 transition"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          Log Out
        </p>
      </ul>
    </div>
  </div>
);

const Navbar = () => {
  const router = useRouter();

  const handleLogin = () => {
    if (session && session.user) {
      router.push("/membership");
    } else {
      router.push("/");
    }
  };
  const handleStory = () => {
    router.push("/new-story");
  };

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };
  const { data: session } = useSession(); // Get user session
  const user = session?.user; // Extract user details

  // Error states for images
  const [navbarImageError, setNavbarImageError] = useState(false);

  const defaultImageUrl = "/User.png";

  return (
    <>
      <div>
        <div className="px-6 py-2 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <h1
              className="font-bold text-black text-[30px] cursor-pointer transition"
              onClick={handleLogin}
            >
              Medium
            </h1>
            <div className=" rounded-3xl sm:bg-gray-100 flex gap-4 items-center px-3 py-3">
              <i className="fa-solid fa-magnifying-glass fa-lg pl-2 text-gray-300"></i>
              <input
                type="text"
                placeholder="Search"
                className="bg-gray-100 text-black text-sm  outline-none sm:flex hidden"
              />
            </div>
          </div>
          <div className="flex sm:gap-10 gap-6 items-center">
            <div
              className="flex gap-3 items-center cursor-pointer"
              onClick={handleStory}
            >
              <i className="fa-regular fa-pen-to-square fa-lg text-gray-400 hover:text-gray-900 transition"></i>
              <p className="font-normal text-gray-600 text-base hover:text-gray-950 transition hidden sm:flex">
                Write
              </p>
            </div>
            <i className="flex fa-regular fa-bell fa-lg text-gray-400 cursor-pointer hover:text-gray-900 transition"></i>
            <Image
              src={
                navbarImageError || !user?.image ? defaultImageUrl : user.image
              }
              alt="User Image"
              width={600}
              height={600}
              priority
              className="w-8 h-8 rounded-full border-gray-300 cursor-pointer  hover:opacity-55 transition"
              onClick={togglePopup}
              onError={() => setNavbarImageError(true)}
            />
          </div>
        </div>
        <hr className="border-t border-gray-200" />

        {isPopupVisible && <PopUp />}
      </div>
    </>
  );
};

export default Navbar;
