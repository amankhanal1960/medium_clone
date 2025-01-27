import React from "react";

const BlogCardSkeleton = () => {
  return (
    <div key="skeleton-blog" className="mb-8 animate-pulse">
      <div className="flex justify-around items-end">
        {/* Blog Details Skeleton */}
        <div className="flex-grow pr-4">
          <div className="h-4 bg-gray-400 rounded w-1/4 mb-2"></div>
          <div className="h-6 bg-gray-500 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
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
        {/* Blog Actions Skeleton */}
        <div className="flex gap-6 text-gray-400 pr-10">
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
        </div>
        {/* Blog Image Skeleton */}
        <div className="flex flex-col items-center justify-center">
          <div className="min-w-44 h-28 bg-gray-300 rounded-md mb-4"></div>
        </div>
      </div>
      <hr className="border-t border-gray-200 mt-6" />
    </div>
  );
};

export default BlogCardSkeleton;
