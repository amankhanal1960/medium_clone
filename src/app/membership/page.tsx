"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/src/components/navbar";
import Link from "next/link";
import Image from "next/image";
import { recommendations } from "@/src/constants/index";
import axios from "axios";
import BlogCardSkeleton from "./blogCardSkeleton";
import { toast } from "react-toastify";
import NetworkError from "@/src/components/networkError";
import ShowMoreText from "react-show-more-text";

interface Blog {
  id: string;
  author: {
    name: string;
    image: string;
  };
  title: string;
  subtitle: string;
  description: string;
  date: string;
  likes: number;
  comments: number;
  image: string;
  isBookmarked: boolean;
  isLiked: boolean;
}

interface ApiBlog {
  _id: string;
  author: {
    name: string;
    image: string;
  };
  title: string;
  subtitle: string;
  description: string;
  date: string;
  likes: number;
  comments: number;
  image: string;
}

const Blog = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { status } = useSession();
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blogs on component mount
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      router.push("/membership");
      fetchBlogs();
    }
  }, [status, router]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get<{ blogs: ApiBlog[] }>("/api/blogs", {
        timeout: 15000,
      });
      const { data } = response;

      if (data.blogs && data.blogs.length > 0) {
        // Properly map API blogs to frontend Blog interface
        const formattedBlogs = data.blogs
          .map(({ _id, author, ...rest }) => ({
            ...rest,
            id: _id,
            author: {
              name: author.name || "Unknown User",
              image: author.image || "/User.png",
            },
            isBookmarked: false,
            isLiked: false,
          }))
          .reverse();
        setBlogs(formattedBlogs);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          setError("timeout");
        } else if (!error.response) {
          setError("network");
        } else {
          setError("server");
        }
      } else {
        setError("unknown");
      }
    } finally {
      setLoading(false);
    }
  };

  //writing the code for the delete with promise,resolve and reject
  const removeBlog = (id: string) => {
    const confirmed = confirm("Are you sure you want to remove?");
    if (confirmed) {
      //Return a new promise
      return new Promise<string>((resolve, reject) => {
        //Perform the axios DELETE request
        axios
          .delete(`/api/blogs/${id}`)
          .then((res) => {
            if (res.status === 200) {
              //Handle success. Resolve the promise
              toast.success("Blog deleted successfully!!");
              setBlogs((prevBlogs) =>
                prevBlogs.filter((blog) => blog.id !== id)
              );
              resolve("Success in deleting the blog");
            } else {
              toast.error("Failed to delete the blog!!");
              reject(new Error("Failed to delete the blog"));
            }
          })
          .catch((error) => {
            if (error.response?.status === 403) {
              toast.error(
                "Forbidden! You are not authorized to delete this blog."
              );
            } else {
              toast.error("An error occurred. Please try again.");
            }
          });
      });
    } else {
      return Promise.resolve("Blog deletion cancelled");
    }
  };

  if (error) {
    return <NetworkError errorType={error} onRetry={() => fetchBlogs()} />;
  }

  // Functions to scroll the container
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -100, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 100, behavior: "smooth" });
    }
  };

  return (
    <div>
      <Navbar />
      {/* Outer container remains unchanged */}
      <div className="flex flex-col lg:flex-row relative">
        {/* Blog List Section */}
        <div className="bg-white w-full lg:w-[65%] h-full min-h-screen">
          <div className="xl:ml-44 xl:mr-28 lg:ml-24 lg:mr-16 sm:ml-8 sm:mr-8 ml-4 mr-4">
            {/* Recommendations Section */}
            <div className="sticky top-0">
              <div className="bg-white text-gray-500 py-4 flex items-center ">
                {/* Left Arrow (only on mobile) */}
                <button
                  onClick={scrollLeft}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white bg-opacity-50 backdrop-blur-md"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                {/* Scrollable container */}
                <div
                  ref={scrollContainerRef}
                  className="overflow-x-auto scroll-smooth whitespace-nowrap pl-8 pr-8 no-scrollbar"
                >
                  <ul className="inline-flex gap-6 text-sm font-semibold">
                    {recommendations.map((item, index) => (
                      <li key={`${item.href}-${index}`} className="min-w-max">
                        <Link className="hover:text-gray-900" href={item.href}>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Right Arrow (only on mobile) */}
                <button
                  onClick={scrollRight}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white bg-opacity-50 backdrop-blur-md"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
              <hr className="border-t border-gray-200 mb-4 z-50" />
            </div>

            {/* Blog Cards */}
            {loading ? (
              <>
                <BlogCardSkeleton />
                <BlogCardSkeleton />
                <BlogCardSkeleton />
                <BlogCardSkeleton />
              </>
            ) : (
              blogs.map((blog) => (
                <div key={blog.id} className="mb-8">
                  <div className="flex items-end gap-x-2 md:gap-x-6">
                    {/* Blog Details */}
                    <div className="flex-grow pr-2 md:pr-4">
                      {/* Author Info with Profile Picture */}
                      <div className="flex items-center mb-2">
                        <Image
                          src={blog.author.image || "/placeholder.svg"}
                          alt={!blog.author.name ? "User" : blog.author.name}
                          width={22}
                          height={22}
                          className="rounded-full mr-2"
                        />
                        <p className="text-sm text-gray-600">
                          {blog.author?.name || "Unknown User"}
                        </p>
                      </div>
                      <h1 className="text-xl font-extrabold text-black mt-2">
                        {blog.title}
                      </h1>
                      <h4 className="md:text-base text-sm font-medium text-gray-400 mt-2">
                        <ShowMoreText
                          lines={2}
                          more="See more"
                          less="See less"
                          anchorClass="text-gray-800 cursor-pointer text-sm"
                          expanded={false}
                          truncatedEndingComponent="... "
                        >
                          {blog.description}
                        </ShowMoreText>
                      </h4>
                      <div className="sm:text-base text-sm flex items-center mt-4 text-gray-500">
                        <p>{blog.date}</p>
                        <div className="flex items-center ml-4">
                          <i className="fa-solid fa-hands-clapping mr-1 cursor-pointer"></i>
                          <p>{blog.likes}</p>
                        </div>
                        <div className="flex items-center ml-4">
                          <i className="fa-solid fa-comment mr-1 cursor-pointer"></i>
                          <p>{blog.comments}</p>
                        </div>
                      </div>
                    </div>
                    {/* Right Side Container: Image & Icons */}
                    <div className="flex flex-col md:flex-row items-end">
                      {/* Blog Image */}
                      <div className="order-1 md:order-2">
                        <Image
                          src={blog.image || "/placeholder.svg"}
                          alt="Blog Image"
                          width={176}
                          height={112}
                          className="w-28 sm:min-w-44 sm:h-28 min-w-36 h-20 rounded-md mb-4 md:mb-0 object-cover"
                        />
                      </div>
                      {/* Blog Actions (Icons) */}
                      <div className="order-2 md:order-1 flex gap-5 text-gray-500 pr-2 md:pr-6 sm:text-xs text-base">
                        <i
                          onClick={() => removeBlog(blog.id)}
                          className="fa-solid fa-circle-minus cursor-pointer"
                        ></i>
                        <i className="fa-regular fa-bookmark cursor-pointer"></i>
                        <i className="fa-solid fa-ellipsis cursor-pointer"></i>
                      </div>
                    </div>
                  </div>
                  <hr className="border-t border-gray-200 mt-6" />
                </div>
              ))
            )}
          </div>
          <Link href="/new-story">
            <button className="lg:hidden flex fixed bottom-4 right-4 bg-green-600 text-white rounded-full w-12 h-12 items-center justify-center shadow-lg transform hover:-translate-y-1.5 transition-all duration-200">
              <i className="fa-regular fa-pen-to-square fa-lg"></i>
            </button>
          </Link>
        </div>

        {/* Divider */}
        <div className="border-l border-gray-200 h-full"></div>

        {/* Sidebar */}
        <div className="bg-white w-[35%] hidden lg:block">
          <div className="h-full text-black">
            <div className="p-4">
              <h2 className="text-xl font-semibold">Membership Content</h2>
            </div>
            <ul className="flex flex-wrap items-end gap-2 text-[11px] w-3/5 pl-4 text-black">
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
  );
};

export default Blog;
