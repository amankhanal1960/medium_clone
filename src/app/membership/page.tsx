"use client";

import { useState, useEffect } from "react";
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

interface Blog {
  id: string;
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
      const response = await axios.get("http://localhost:3000/api/blogs", {
        timeout: 15000,
      });
      const { data } = response;

      if (data.blogs && data.blogs.length > 0) {
        // Map _id to id for frontend consistency
        const formattedBlogs = data.blogs.map((blog: Blog) => ({
          ...blog,
          id: blog._id, // Map MongoDB _id to id
        }));
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
          .delete(`http://localhost:3000/api/blogs/${id}`)
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
            //Handle request error, reject the promise
            console.error("Error deleting blog:", error.message);
            toast.error(
              "An error occurred while deleting the blog. Please try again."
            );
            reject(error); //pass the error to the caller
          });
      });
    } else {
      return Promise.resolve("Blog deletion cancelled");
    }
  };

  if (error) {
    return <NetworkError errorType={error} onRetry={() => fetchBlogs()} />;
  }

  return (
    <div>
      <Navbar />
      <div className="flex h-full min-h-screen">
        {/* Blog List Section */}
        <div className="bg-white w-full lg:w-[65%]">
          <div className="xl:ml-44 xl:mr-28 lg:ml-24 lg:mr-16 ml-8 mr-8">
            {/* Recommendations Section */}
            <div className="text-gray-500 py-8 items-center justify-center">
              <div className="flex flex-col items-center">
                <ul className="flex gap-6 text-sm font-semibold">
                  {recommendations.map((item, index) => (
                    <li key={`${item.href}-${index}`}>
                      <Link className="hover:text-gray-900" href={item.href}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <hr className="border-t border-gray-200 mt-4" />
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
                  <div className="flex justify-around items-end">
                    {/* Blog Details */}
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
                    {/* Blog Actions */}
                    <div className="flex gap-6 text-gray-500 pr-10">
                      <i
                        onClick={() => removeBlog(blog.id)}
                        className="fa-solid fa-circle-minus cursor-pointer"
                      ></i>
                      <i className="fa-regular fa-bookmark"></i>
                      <i className="fa-solid fa-ellipsis"></i>
                    </div>
                    {/* Blog Image */}
                    <div className="flex flex-col items-center justify-center">
                      <Image
                        src={blog.image || "/placeholder.svg"}
                        alt="Blog Image"
                        width={176}
                        height={112}
                        className="min-w-44 h-28 rounded-md mb-4 object-cover"
                      />
                    </div>
                  </div>
                  <hr className="border-t border-gray-200 mt-6" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-l border-gray-200 h-full"></div>

        {/* Sidebar */}
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
