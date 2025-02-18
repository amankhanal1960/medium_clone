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
import Pagination from "@/src/components/Pagination";
import { useConfirm } from "@/src/components/hooks/useConfirm";
import { motion, AnimatePresence } from "framer-motion";
import CommentSection from "@/src/components/ui/commentPopup";

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
  isBookmarked: boolean;
  isLiked: boolean;
}

const Blog = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { status } = useSession();
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // State to control which blog's comment popup is open
  const [activeCommentBlogId, setActiveCommentBlogId] = useState<string | null>(
    null
  );
  // State to track which blog's like popup is showing
  const [popupBlogId, setPopupBlogId] = useState<string | null>(null);
  const [pendingLikes, setPendingLikes] = useState<Record<string, boolean>>({});
  const [pendingBookmark, setpendingBookmark] = useState<
    Record<string, boolean>
  >({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = currentPage * itemsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstItem, indexOfLastItem);
  const pageCount = Math.ceil(blogs.length / itemsPerPage);

  const [fullSizeImageData, setFullSizeImageData] = useState<{
    src: string;
    id: string;
  } | null>(null);
  const [showCloseButton, setShowCloseButton] = useState(false);

  // Handle page click
  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  // Importing the custom confirmation hook
  const { confirm, ConfirmDialog } = useConfirm();

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
          .map(({ _id, author, isBookmarked, isLiked, ...rest }) => ({
            ...rest,
            id: _id,
            author: author
              ? {
                  name: author.name || "Unknown User",
                  image: author.image || "/User.png",
                }
              : { name: "Unknown User", image: "/User.png" },
            isBookmarked: isBookmarked ?? false,
            isLiked: isLiked ?? false,
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

  // Function to toggle like/unlike for a blog post and show the +1 popup
  // Add a state to track pending likes per blog

  const handleLikeClick = async (blogId: string) => {
    // If a like is already pending for this blog, do nothing.
    if (pendingLikes[blogId]) return;

    // Mark as pending
    setPendingLikes((prev) => ({ ...prev, [blogId]: true }));

    // Optimistically update UI:
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog.id === blogId
          ? {
              ...blog,
              likes: blog.isLiked ? blog.likes - 1 : blog.likes + 1,
              isLiked: !blog.isLiked,
            }
          : blog
      )
    );

    // Show popup immediately if liked:
    if (!pendingLikes[blogId]) {
      setPopupBlogId(blogId);
      setTimeout(() => setPopupBlogId(null), 1000);
    }

    try {
      const response = await axios.post(`/api/blogs/${blogId}/like`);
      if (response.status === 200) {
        // Reconcile with server data
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog.id === blogId
              ? {
                  ...blog,
                  likes: response.data.likes,
                  isLiked: response.data.isLiked,
                }
              : blog
          )
        );
      }
    } catch (error: unknown) {
      console.error("Failed to update like", error);
      // Rollback optimistic update
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === blogId
            ? {
                ...blog,
                likes: blog.isLiked ? blog.likes - 1 : blog.likes + 1,
                isLiked: !blog.isLiked,
              }
            : blog
        )
      );
      setPopupBlogId(null);
      toast.error("Failed to update like. Please try again.");
    } finally {
      // Clear pending state for this blog
      setPendingLikes((prev) => ({ ...prev, [blogId]: false }));
    }
  };

  // Function to toggle bookmark for a blog post
  const handleBookmarkClick = async (blogId: string) => {
    // Prevent processing if a bookmark update is already pending for this blog.
    if (pendingBookmark[blogId]) return;

    // Mark this blog's bookmark action as pending.
    setpendingBookmark((prev) => ({ ...prev, [blogId]: true }));

    // Optimistically update the UI:
    // Toggle the isBookmarked flag and update the bookmarks count accordingly.
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog.id === blogId
          ? {
              ...blog,
              isBookmarked: !blog.isBookmarked,
            }
          : blog
      )
    );

    setTimeout(() => setPopupBlogId(null), 1000);

    try {
      // Make the API call to update the bookmark on the server.
      const response = await axios.post(`/api/blogs/${blogId}/bookmark`);
      if (response.status === 200) {
        // On success, reconcile our state with the server response.
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog.id === blogId
              ? {
                  ...blog,
                  // Update with the confirmed bookmark status from the API.
                  isBookmarked: response.data.isBookmarked,
                }
              : blog
          )
        );
        toast.success(response.data.message);
      }
    } catch (error: unknown) {
      console.error("Failed to toggle bookmark", error);
      toast.error("Failed to update bookmark. Please try again.");
      // Roll back the optimistic update:
      // Toggle back the isBookmarked flag and adjust the bookmarks count accordingly.
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === blogId
            ? {
                ...blog,
                bookmarks: blog.isBookmarked,
              }
            : blog
        )
      );
    } finally {
      // Clear the pending bookmark flag so further clicks are allowed.
      setpendingBookmark((prev) => ({ ...prev, [blogId]: false }));
    }
  };

  const openCommentPopup = (blogId: string) => {
    setActiveCommentBlogId(blogId);
  };

  // Close the comment popup
  const closeCommentPopup = () => {
    setActiveCommentBlogId(null);
  };

  // Updated removeBlog function using the custom confirmation hook
  const removeBlog = async (id: string) => {
    // Use the custom confirmation instead of native confirm()
    const confirmed = await confirm(
      "Are you sure you want to remove this blog post?"
    );
    if (confirmed) {
      try {
        const response = await axios.delete(`/api/blogs/${id}`);
        if (response.status === 200) {
          toast.success("Blog deleted successfully!");
          setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
        } else {
          toast.error("Failed to delete the blog!");
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          toast.error("Forbidden! You are not authorized to delete this blog.");
        } else {
          toast.error("An error occurred. Please try again.");
        }
      }
    }
  };

  // Modify the image click handler to also capture the blog id
  const handleImageClick = (src: string, id: string) => {
    setShowCloseButton(false);
    setFullSizeImageData({ src, id });
  };

  const closeFullSizeImage = () => {
    setFullSizeImageData(null);
    setShowCloseButton(false);
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
            <div className="sticky top-0 z-10">
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
              currentBlogs.map((blog) => (
                <div key={blog.id} className="mb-8">
                  <div className="flex items-end gap-x-2 md:gap-x-6">
                    {/* Blog Details */}
                    <div className="flex-grow pr-2 md:pr-4">
                      {/* Author Info with Profile Picture */}
                      <div className="flex items-center mb-2">
                        <Image
                          src={blog.author.image || "/placeholder.svg"}
                          alt={blog.author.name || "User"}
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
                        <div className="flex items-center ml-4 relative">
                          <i
                            onClick={() => handleLikeClick(blog.id)}
                            className={`fa-regular fa-heart mr-1 cursor-pointer ${
                              blog.isLiked
                                ? "fa-solid text-red-600"
                                : "fa-regular text-gray-500"
                            }`}
                          ></i>
                          {/* Render +1 popup if this blog is the one that was just liked */}
                          {popupBlogId === blog.id && (
                            <span className="absolute -top-6 -right-6 text-white text-lg rounded-full w-10 h-10 flex items-center justify-start animate-fade-out">
                              <i className="fa-solid fa-heart text-red-400"></i>
                            </span>
                          )}
                          <p>{blog.likes}</p>
                        </div>
                        <div className="flex items-center ml-4">
                          <i
                            className="fa-solid fa-comment mr-1 cursor-pointer"
                            onClick={() => openCommentPopup(blog.id)}
                          ></i>
                          <p>{blog.comments}</p>
                        </div>
                      </div>
                      {/* CommentSection */}
                      {activeCommentBlogId === blog.id && (
                        <CommentSection
                          blogId={blog.id}
                          onClose={closeCommentPopup}
                          onCommentAdded={() => {
                            setBlogs((prevBlogs) =>
                              prevBlogs.map((b) =>
                                b.id === blog.id
                                  ? { ...b, comments: b.comments + 1 }
                                  : b
                              )
                            );
                          }}
                          onCommentDeleted={() => {
                            setBlogs((prevBlogs) =>
                              prevBlogs.map((b) =>
                                b.id === blog.id
                                  ? {
                                      ...b,
                                      comments: Math.max(0, b.comments - 1),
                                    }
                                  : b
                              )
                            );
                          }}
                        />
                      )}
                    </div>
                    {/* Right Side Container: Image & Icons */}
                    <div className="flex flex-col md:flex-row items-end">
                      {/* Blog Image */}
                      <div className="order-1 md:order-2">
                        {/* Wrap the thumbnail in a motion.div with a unique layoutId */}
                        <motion.div
                          layoutId={`blog-image-${blog.id}`}
                          className="cursor-pointer"
                          onClick={() => handleImageClick(blog.image, blog.id)}
                        >
                          <Image
                            src={blog.image || "/placeholder.svg"}
                            alt="Blog Image"
                            width={176}
                            height={112}
                            className="w-28 sm:min-w-44 sm:h-28 min-w-36 h-20 rounded-md mb-4 md:mb-0 object-cover"
                          />
                        </motion.div>
                      </div>
                      {/* Blog Actions (Icons) */}
                      <div className="order-2 md:order-1 flex gap-5 text-gray-500 pr-2 md:pr-6 sm:text-xs text-base">
                        <i
                          onClick={() => removeBlog(blog.id)}
                          className="fa-solid fa-circle-minus cursor-pointer animate-heartbeat hover:scale-105 transition-all duration-300"
                        ></i>
                        <i
                          onClick={() => handleBookmarkClick(blog.id)}
                          className={`cursor-pointer transition-all duration-300 ease-in-out ${
                            blog.isBookmarked
                              ? "fa-solid fa-bookmark text-yellow-500 animate-pop"
                              : "fa-regular fa-bookmark text-gray-500 hover:scale-105"
                          }`}
                        />
                        <i className="fa-solid fa-ellipsis cursor-pointer hover:scale-125 transition-all duration-100"></i>
                      </div>
                    </div>
                  </div>
                  <hr className="border-t border-gray-200 mt-6" />
                </div>
              ))
            )}

            {/* Pagination Controls */}
            {!loading && pageCount > 1 && (
              <Pagination
                pageCount={pageCount}
                currentPage={currentPage}
                onPageChange={handlePageClick}
              />
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
      {/* Render the custom confirmation dialog */}
      <ConfirmDialog />
      {/* Full-size image modal with shared element transition */}
      <AnimatePresence>
        {fullSizeImageData && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-75 flex items-center justify-center z-50  transition-opacity duration-30"
            onClick={closeFullSizeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key={`modal-${fullSizeImageData.id}`} // Add unique key here
              layoutId={`blog-image-${fullSizeImageData.id}`}
              className="relative max-w-full max-h-full"
              onLayoutAnimationComplete={() => setShowCloseButton(true)}
            >
              <Image
                src={fullSizeImageData.src || "/placeholder.svg"}
                alt="Full size image"
                layout="responsive"
                width={1920}
                height={1080}
                objectFit="contain"
                className="object-contain max-w-[90vw] max-h-[90vh]"
              />
              {showCloseButton && (
                <motion.button
                  className="absolute top-4 right-4 text-white text-2xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeFullSizeImage();
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <i className="fa-solid fa-times"></i>
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blog;
