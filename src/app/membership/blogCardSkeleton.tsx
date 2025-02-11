import React from "react";

const BlogCardSkeleton = () => {
  return (
    <div key="skeleton-blog" className="mb-8 animate-pulse">
      <div className="flex items-end gap-x-2 md:gap-x-6">
        {/* Blog Details Skeleton */}
        <div className="flex-grow pr-2 md:pr-4">
          {/* Author skeleton */}
          <div className="h-4 bg-gray-400 rounded w-1/4 mb-2"></div>
          {/* Title skeleton */}
          <div className="h-6 bg-gray-500 rounded w-3/4 mb-2"></div>
          {/* Description skeleton */}
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          {/* Meta data skeleton (date, likes, comments) */}
          <div className="flex items-center mt-4 text-gray-400">
            <div className="h-4 bg-gray-300 rounded w-1/5"></div>
            <div className="flex items-center ml-4">
              <div className="h-4 bg-gray-300 rounded w-8 mr-2"></div>
              <div className="h-4 bg-gray-300 rounded w-6"></div>
            </div>
            <div className="flex items-center ml-4">
              <div className="h-4 bg-gray-300 rounded w-8 mr-2"></div>
              <div className="h-4 bg-gray-300 rounded w-6"></div>
            </div>
          </div>
        </div>
        {/* Right Side Container: Image & Icons Skeleton */}
        <div className="flex flex-col md:flex-row items-end">
          {/* Blog Image Skeleton */}
          <div className="order-1 md:order-2">
            <div className="w-28 min-w-44 h-28 bg-gray-300 rounded-md mb-4 md:mb-0"></div>
          </div>
          {/* Blog Actions (Icons) Skeleton */}
          <div className="order-2 md:order-1 flex gap-5 text-gray-400 pr-6 md:pr-10">
            <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
            <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
            <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
      <hr className="border-t border-gray-200 mt-6" />
    </div>
  );
};

export default BlogCardSkeleton;
