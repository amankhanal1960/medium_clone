"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/src/components/navbar";
import { useSession } from "next-auth/react";

const Profile = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [activeSection, setActiveSection] = useState("home");

  // Error states for images
  const [readingListImageError, setReadingListImageError] = useState(false);
  const [sidebarImageError, setSidebarImageError] = useState(false);

  const defaultImageUrl = "/User.png";

  const ReadingList = () => (
    <div className="border rounded-lg xl:mr-32 lg:mr-20 flex gap-[2px]">
      <div className="bg-gray-50 w-3/5 p-6">
        <div className="flex items-center mb-4 gap-2">
          <Image
            src={
              readingListImageError || !user?.image
                ? defaultImageUrl
                : user.image
            }
            alt="User Image"
            width={24}
            height={24}
            priority
            className="w-6 h-6 rounded-full border-gray-300 cursor-pointer hover:opacity-55 transition"
            onError={() => setReadingListImageError(true)}
          />
          <h3 className="text-base text-black font-semibold">
            {user?.name || "Guest"}
          </h3>
        </div>
        <h4 className="text-xl font-bold text-black">Reading list</h4>
        <div className="flex justify-between items-center">
          <div className="flex items-center justify-center gap-2">
            <p className="text-gray-500 mt-2 text-sm">No stories</p>
          </div>
          <i className="fa-solid fa-ellipsis text-black"></i>
        </div>
      </div>
      <div className="w-3/12 bg-gray-100"></div>
      <div className="w-2/12 bg-gray-100"></div>
      <div className="w-1/12 bg-gray-100"></div>
    </div>
  );

  const AboutSection = () => (
    <div className="flex flex-col items-center justify-center xl:mr-32 lg:mr-20 bg-gray-50 p-6">
      <h4 className="text-lg font-bold text-black mt-12">
        Tell the world about yourself
      </h4>
      <p className="text-gray-500 mt-6 text-xs text-center sm:px-24">
        Here's where you can share more about yourself: your history, work
        experience, accomplishments, interests, dreams, and more.
      </p>
      <button className="border py-2 px-4 mt-5 mb-12 rounded-3xl border-black bg-white text-black text-sm">
        Get started
      </button>
    </div>
  );

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div>
        <Navbar />
      </div>
      <div className="flex px-6 lg:flex-row flex-col xl:ml-44 lg:ml-28 flex-grow">
        {/* Left Section */}
        <div className="lg:w-3/5 mt-14">
          <div className="mb-11">
            <div className="flex justify-between items-center xl:mr-32 lg:mr-20 mb-4">
              <h1 className="text-4xl font-bold mb-4 text-black">
                {user?.name || "Guest User"}
              </h1>
              <i className="fa-solid fa-ellipsis text-black"></i>
            </div>
            <div className="mb-3">
              <button
                className={`py-2 mr-6 font-medium text-black ${
                  activeSection === "home" ? "border-b border-black" : ""
                }`}
                onClick={() => setActiveSection("home")}
              >
                Home
              </button>
              <button
                className={`py-2 font-medium text-black ${
                  activeSection === "about" ? "border-b border-black" : ""
                }`}
                onClick={() => setActiveSection("about")}
              >
                About
              </button>
            </div>
            <hr className="border-t border-gray-200 mb-5 xl:mr-32 lg:mr-20" />
          </div>
          {activeSection === "home" && <ReadingList />}
          {activeSection === "about" && <AboutSection />}
        </div>

        {/* Right Section */}
        <div className="hidden lg:flex lg:w-2/5">
          <div className="border-l border-gray-200"></div>
          <div className="flex flex-grow flex-col justify-between p-10">
            <div>
              <Image
                src={
                  sidebarImageError || !user?.image
                    ? defaultImageUrl
                    : user.image
                }
                alt="User Image"
                width={80}
                height={80}
                priority
                className="w-20 h-20 rounded-full border-gray-300 cursor-pointer hover:opacity-55 transition mb-3"
                onError={() => setSidebarImageError(true)}
              />
              <h3 className="text-lg font-semibold mb-5 text-black">
                {user?.name || "Guest"}
              </h3>
              <button className="block text-sm text-green-600 font-medium">
                Edit profile
              </button>
            </div>
            <div className="mt-auto">
              <ul className="flex flex-wrap items-start gap-2 text-[11px] w-3/5 text-black">
                <Link href={"/"}>Help</Link>
                <Link href={"/"}>Status</Link>
                <Link href={"/"}>About</Link>
                <Link href={"/"}>Careers</Link>
                <Link href={"/"}>Press</Link>
                <Link href={"/"}>Blog</Link>
                <Link href={"/"}>Privacy</Link>
                <Link href={"/"}>Text to speech</Link>
                <Link href={"/"}>Teams</Link>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
