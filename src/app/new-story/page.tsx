"use client";
import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Image from "next/image";
import PopUp from "@/src/components/navbar";
import { useRouter } from "next/navigation";

const Story = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/");
  };

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const togglePopup = () => setIsPopupVisible(!isPopupVisible);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);

  const handlePublish = () => {
    // Add publish logic here
    console.log("Publishing:", { title, description });
    // You might want to send this data to an API or perform other actions
  };

  return (
    <div>
      <div className="h-screen bg-white">
        <div className="px-6 py-2 flex items-center justify-between bg-white max-w-[1050px] mx-auto">
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
            <button
              onClick={handlePublish}
              className="text-[13px] text-white bg-green-600 px-2.5 py-0.5 rounded-3xl hover:bg-green-700 transition-colors duration-200"
            >
              Publish
            </button>
            <i className="fa-solid fa-ellipsis cursor-pointer"></i>
            <i className="flex fa-regular fa-bell fa-lg cursor-pointer hover:text-gray-900"></i>
            <Image
              src="/assects/me1.jpg"
              alt="Placeholder Image"
              width={600}
              height={600}
              priority
              className="w-8 h-8 rounded-full border-gray-300 cursor-pointer hover:opacity-55 transition"
              onClick={togglePopup}
            />
          </div>
        </div>
        {isPopupVisible && <PopUp />}

        {/* form section */}
        <div className="mt-6 max-w-[800px] mx-auto px-6">
          <form className="flex flex-col gap-4">
            {/* Title Input */}
            <div>
              {isTitleEditing ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => setIsTitleEditing(false)}
                  placeholder="Enter your title here"
                  className="mt-1 w-full rounded-md sm:text-sm border-none outline-none text-2xl font-bold"
                  autoFocus
                  aria-label="Edit title"
                />
              ) : (
                <div
                  onClick={() => setIsTitleEditing(true)}
                  className="cursor-text text-2xl font-bold text-gray-700"
                >
                  {title || "Title"}
                </div>
              )}
            </div>

            {/* Description Input */}
            <div>
              {isDescriptionEditing ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => setIsDescriptionEditing(false)}
                  placeholder="Write your description here..."
                  className="mt-1 block w-full rounded-md border-none outline-none sm:text-sm resize-none"
                  rows={4}
                  autoFocus
                  aria-label="Edit description"
                ></textarea>
              ) : (
                <div
                  onClick={() => setIsDescriptionEditing(true)}
                  className="cursor-text text-gray-700 min-h-[100px]"
                >
                  {description || "Description"}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Story;
