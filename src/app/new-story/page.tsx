"use client";
import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Image from "next/image";
import PopUp from "@/src/components/navbar";
import { useRouter } from "next/navigation";

const story = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/");
  };

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const togglePopup = () => setIsPopupVisible(!isPopupVisible);

  //title: The state variable holding the title of the story
  //setTitle: The function to update the title of the story when the input changes
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");

  //isTitleEditing: The boolean state determines if the title is in edit mode
  //setisTitleEditing: The function to toggle the edit state for the title
  const [isTitleEditing, setisTitleEditing] = useState(false);
  const [isDescriptionEditing, setisDescriptionEditing] = useState(false);
  const [isAuthorEditing, setisAuthorEditing] = useState(false);
  const [isDateEditing, setisDateEditing] = useState(false);
  const [isImageEditing, setisImageEditing] = useState(false);

  const handlePublish = async (event: any) => {
    event.preventDefault();
    console.log("Publishing:", { title, description, author, date, image });

    try {
      const response = await fetch("http://localhost:3000/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, author, date, image }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Blog published successfully", data.blog);
        router.push("/membership");
      } else {
        console.error("Failed to publish blog", data.message);
      }
    } catch (error: any) {
      console.error("Error publishing blog: " + error.message);
    }
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
              disabled={!title || !description || !author || !date || !image}
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
            {/* Date Input */}
            <div>
              {isDateEditing ? (
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Date"
                  onBlur={() => setisDateEditing(false)}
                  className="mt-1 w-full rounded-md sm:text-sm border-none outline-none text-gray-700"
                  autoFocus
                  aria-label="Edit Date"
                />
              ) : (
                <div
                  onClick={() => setisDateEditing(true)}
                  className="cursor-text text-gray-700"
                >
                  {date || "Date"}
                </div>
              )}
            </div>

            {/* Author Input */}
            <div>
              {isAuthorEditing ? (
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author"
                  onBlur={() => setisAuthorEditing(false)}
                  className="mt-1 w-full rounded-md sm:text-sm border-none outline-none text-gray-700"
                  autoFocus
                  aria-label="Edit Author"
                />
              ) : (
                <div
                  onClick={() => setisAuthorEditing(true)}
                  className="cursor-text text-gray-700"
                >
                  {author || "Author"}
                </div>
              )}
            </div>
            {/* Title Input */}
            <div>
              {isTitleEditing ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)} //updates the title state when the user types the title
                  placeholder="Title"
                  onBlur={() => setisTitleEditing(false)} //Disables editing when the user looses focus from the input
                  className="mt-1 w-full rounded-md sm:text-sm border-none outline-none text-2xl font-bold text-gray-700"
                  autoFocus
                  aria-label="Edit Title"
                />
              ) : (
                <div
                  className="cursor-text text-2xl font-bold text-gray-700"
                  onClick={() => setisTitleEditing(true)} //starts editing mode when clicked
                >
                  {/* shows either the current title or the placeholder */}
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
                  placeholder="Write Your Story...."
                  onBlur={() => setisDescriptionEditing(false)}
                  className="mt-1 block w-full rounded-md border-gray-300 border-none outline-none sm:text-sm text-gray-700 resize-none"
                  autoFocus
                  aria-label="Edit Description"
                ></textarea>
              ) : (
                <div
                  onClick={() => setisDescriptionEditing(true)}
                  className="cursor-text text-gray-700 min-h-[100px]"
                >
                  {description || "Description"}
                </div>
              )}
            </div>
            <div>
              {isImageEditing ? (
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Image URL"
                  onBlur={() => setisImageEditing(false)}
                  className="mt-1 w-full rounded-md sm:text-sm border-none outline-none text-gray-700"
                  autoFocus
                  aria-label="Edit Image URL"
                  required
                />
              ) : (
                <div
                  onClick={() => setisImageEditing(true)}
                  className="cursor-text text-gray-700"
                >
                  {image || "Image URL (required)"}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default story;
