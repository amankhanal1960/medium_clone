"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-toastify";
import { PopUp } from "@/src/components/navbar";

export default function MediumEditor() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const defaultImageUrl = "/User.png";

  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.focus();
    }
  }, []);

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
        author: user.id,
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
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1
                className="text-2xl font-bold text-black cursor-pointer"
                onClick={() => router.push("/membership")}
              >
                Medium
              </h1>
              <p className="ml-4 text-sm text-gray-500">
                Draft in {user?.name || "Guest"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePublish}
                disabled={!title || !description || !image || isSubmitting}
                className="text-[13px] text-white bg-green-600 px-2.5 py-0.5 rounded-3xl hover:bg-green-700 transition-colors duration-200 cursor-pointer"
              >
                {isSubmitting ? "Publishing..." : "Publish"}
              </button>
              <div className="hidden sm:flex items-center space-x-4 text-gray-400">
                <i className="fa-solid fa-ellipsis cursor-pointer"></i>
                <i className="fa-regular fa-bell fa-lg cursor-pointer hover:text-gray-900"></i>
              </div>
              <Image
                src={user?.image || defaultImageUrl}
                alt="User avatar"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={() => setIsPopupVisible(!isPopupVisible)}
              />
            </div>
          </div>
        </div>
      </header>
      {isPopupVisible && <PopUp />}

      <main className="max-w-3xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <motion.form
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-4 mb-6">
              <Image
                src={user?.image || defaultImageUrl}
                alt="User avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
              <p className="text-sm font-medium text-gray-700">
                {user?.name || "Guest"}
              </p>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full text-3xl sm:text-4xl font-bold border-none outline-none text-gray-800 placeholder-gray-400"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <textarea
              ref={descriptionRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell your story..."
              className="w-full text-lg sm:text-xl border-none outline-none text-gray-600 placeholder-gray-400 resize-none min-h-[200px]"
            />
          </motion.div>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {image ? (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt="Blog Image"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </motion.div>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }}
                className="flex items-center space-x-2 text-sm sm:text-base bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-full transition-colors duration-200"
              >
                <i className="fas fa-plus"></i>
                <span>Add an image</span>
              </button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </motion.div>
        </motion.form>
      </main>
    </div>
  );
}
