"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { recommendations } from "@/constants";
import Image from "next/image";

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
  // const [activeLink, setActiveLink] = useState("");
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  //fetch the data when the component mounts
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/blogs");
        const data = await response.json();

        if (data.blogs && data.blogs.length > 0) {
          setBlog(data.blogs[1]); // Assuming you're showing the first blog
        }
      } catch (error: any) {
        console.error("Error fetching blog: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!blog) {
    return <p>No blog found</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="flex h-screen">
        {/* left section */}

        <div className="bg-white w-full lg:w-[65%]">
          <div className="xl:ml-44 xl:mr-28 lg:ml-24 lg:mr-16 ml-8 mr-8">
            <div className="text-gray-500 py-8 items-center justify-center">
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
              <hr className="border-t border-gray-200 mt-4" />
            </div>
            <div>
              <div className="flex mt-4 text-black justify-between items-center ">
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-gray-600">{blog.author}</p>
                  <h1 className="text-xl font-extrabold text-black ">
                    {blog.title}
                  </h1>
                  <h4 className="text-base font-medium text-gray-400">
                    {blog.description}
                  </h4>
                  <div className="flex text-gray-500 justify-between py-3 ">
                    <div className=" flex gap-4 ">
                      <p>Aug 22, 2024</p>
                      <div className="flex items-center gap-1.5">
                        <i className="fa-solid fa-hands-clapping"></i>
                        <p>5.5K</p>
                      </div>
                      <div className="flex items-center gap-1.5 justify-center">
                        <i className="fa-solid fa-comment"></i>
                        <p>39</p>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <i className="fa-solid fa-circle-minus"></i>
                      <i className="fa-regular fa-bookmark"></i>
                      <i className="fa-solid fa-ellipsis"></i>
                    </div>
                  </div>
                </div>
                <div>
                  <Image
                    src="/assects/background.png"
                    alt="Placeholder Image"
                    width={600}
                    height={600}
                    priority
                    className="w-44 h-28 rounded-md"
                  />
                </div>
              </div>
              <hr className="border-t border-gray-200 mt-4" />
            </div>
          </div>
        </div>
        <div className="border-l border-gray-200 h-full"></div>
        {/* right section */}
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
