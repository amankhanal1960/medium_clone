"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/src/components/navbar";
import Link from "next/link";
import Image from "next/image";
import { recommendations } from "@/src/constants/index";

interface Blog {
  author: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  likes: number;
  comments: number;
  image: string;
}

const Blog = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/blogs");
        const data = await response.json();

        if (data.blogs && data.blogs.length > 0) {
          setBlogs(data.blogs);
        }
      } catch (error: any) {
        console.error("Error fetching blogs: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <p className="text-black font-bold h-screen bg-white text-xl">
        Gooning...
      </p>
    );
  }

  if (blogs.length === 0) {
    return <p>No blogs found</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="flex h-full">
        <div className="bg-white w-full lg:w-[65%]">
          <div className="xl:ml-44 xl:mr-28 lg:ml-24 lg:mr-16 ml-8 mr-8">
            <div className="text-gray-500 py-8 items-center justify-center">
              <div className="flex flex-col items-center">
                <ul className="flex gap-6 text-sm font-semibold">
                  {recommendations.map((item, index) => (
                    <li key={index}>
                      <Link className="hover:text-gray-900" href={item.href}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <hr className="border-t border-gray-200 mt-4" />
            </div>

            {blogs.map((blog, index) => (
              <div key={index} className="mb-8">
                <div className="flex justify-around items-end">
                  <div className="flex-grow pr-4">
                    <p className="text-sm text-gray-600">{blog.author}</p>
                    <h1 className="text-xl font-extrabold text-black mt-2">
                      {blog.title}
                    </h1>
                    <h4 className="text-base font-medium text-gray-400 mt-2">
                      {blog.description}
                    </h4>
                    <div className="flex items-center mt-4 text-gray-500">
                      <p>{blog.date}</p>
                      <div className="flex items-center ml-4">
                        <i className="fa-solid fa-hands-clapping mr-1"></i>
                        <p>{blog.likes}</p>
                      </div>
                      <div className="flex items-center ml-4">
                        <i className="fa-solid fa-comment mr-1"></i>
                        <p>{blog.comments}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-6 text-gray-500 pr-10">
                    <i className="fa-solid fa-circle-minus"></i>
                    <i className="fa-regular fa-bookmark"></i>
                    <i className="fa-solid fa-ellipsis"></i>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <Image
                      src={blog.image}
                      alt="Blog Image"
                      width={176}
                      height={112}
                      className="min-w-44 h-28 rounded-md mb-4 object-cover"
                    />
                  </div>
                </div>
                <hr className="border-t border-gray-200 mt-6" />
              </div>
            ))}
          </div>
        </div>

        <div className="border-l border-gray-200 h-full"></div>
        <div className="bg-white w-[35%] hidden lg:block">
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
