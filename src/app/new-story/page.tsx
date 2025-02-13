"use client";
import type React from "react";
import { useState, useRef } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Image from "next/image";
import { PopUp } from "@/src/components/navbar";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const Story = () => {
  const { data: session } = useSession(); // Get the user session
  const user = session?.user; //Extracts user details
  const defaultImageUrl = "/User.png";

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = () => router.push("/");

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const togglePopup = () => setIsPopupVisible(!isPopupVisible);

  //title: The state variable holding the title of the story
  //setTitle: The function to update the title of the story when the input changes

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  //isTitleEditing: The boolean state determines if the title is in edit mode
  //setisTitleEditing: The function to toggle the edit state for the title
  const [isTitleEditing, setisTitleEditing] = useState(false);
  const [isDescriptionEditing, setisDescriptionEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handlePublish = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (!user) {
        toast.error("You must be logged in to publish a blog");
        return;
      }

      let imageUrl = "";
      if (imageFile) {
        const formdata = new FormData();
        formdata.append("image", imageFile);
        const res = await axios.post("/api/uploads", formdata);
        imageUrl = res.data.url;
      }

      const res = await axios.post("/api/blogs", {
        title,
        description,
        image: imageUrl,
        // Author is now the user's ID from session
        author: user.id, // Ensure your session includes the user's ID
      });

      if (res.status === 200) {
        toast.success("Blog published successfully!!");
        router.push("/membership");
      }
    } catch (error) {
      console.error("Error publishing blog:", error);
      toast.error("Failed to publish blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="h-screen bg-white">
        <div className="px-6 py-2 flex items-center justify-between bg-white max-w-[1050px] mx-auto">
          <div className="flex items-end gap-3">
            <h1
              className="font-bold text-black sm:text-[30px] text-[24px] cursor-pointer"
              onClick={handleLogin}
            >
              Medium
            </h1>
            <div className="text-black sm:text-sm text-xs mb-2">
              <p>Draft in {user?.name || "Guest"}</p>
            </div>
          </div>
          <div className="flex gap-6 items-center text-gray-400">
            {/* Publish button */}
            <button
              onClick={handlePublish}
              className="text-[13px] text-white bg-green-600 px-2.5 py-0.5 rounded-3xl hover:bg-green-700 transition-colors duration-200 cursor-pointer"
              disabled={!title || !description || !image || isSubmitting}
            >
              {isSubmitting ? "Publishing..." : "Publish"}
            </button>
            <div className="gap-6 items-center hidden xs:flex ">
              <i className="fa-solid fa-ellipsis cursor-pointer"></i>
              <i className="flex fa-regular fa-bell fa-lg cursor-pointer hover:text-gray-900"></i>
            </div>

            <Image
              src={user?.image || defaultImageUrl}
              alt="User avatar"
              width={32}
              height={32}
              priority
              className="w-8 h-8 rounded-full border-gray-300 cursor-pointer hover:opacity-55 transition"
              onClick={togglePopup}
            />
          </div>
        </div>
        {isPopupVisible && <PopUp />}

        {/* form section */}
        <div className="mt-6 max-w-[800px] mx-auto px-6">
          <form>
            <div className=" flex flex-row justify-between">
              <div className="flex flex-col sm:gap-6 gap-4">
                {/* Author Input */}
                <div>
                  <p className="mt-1 w-full rounded-md sm:text-sm text-gray-700">
                    {user?.name || "Author"}
                  </p>
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
              </div>

              {/* Image Input */}
              <div className="mt-5">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  ref={fileInputRef}
                />
                <div className="cursor-pointer text-gray-700">
                  {image ? (
                    <Image
                      src={image}
                      alt="Blog Image"
                      width={200}
                      height={200}
                      className="rounded mt-2"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="sm:text-sm text-xs font-medium">
                        Add an image
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          fileInputRef.current?.click();
                        }}
                        className="flex justify-center sm:text-sm text-xs items-center sm:py-2 sm:px-4 py-1.5 px-3 text-white rounded-full bg-black hover:bg-gray-800 transition-colors"
                      >
                        Select Image
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Story;
