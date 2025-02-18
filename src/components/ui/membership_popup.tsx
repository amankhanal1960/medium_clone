import Blog from "@/src/app/membership/page";
import { motion } from "framer-motion";

const Popup = ({
  blog,
  onRemove,
  onBookmark,
}: {
  blog: Blog;
  onRemove: (id: string) => void;
  onBookmark: (id: string) => void;
}) => {
  return (
    <motion.div
      className="absolute z-10 bg-white shadow-lg border border-gray-200 rounded-md p-3 w-44 sm:right-6 right-0 md:w-48"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, type: "tween" }}
    >
      <div className="flex flex-col gap-2">
        <motion.button
          onClick={() => onRemove(blog.id)}
          className="flex items-center text-gray-700 hover:text-red-600 transition-colors duration-200 w-full justify-start"
          whileHover={{ scale: 1.05 }}
        >
          <i className="fa-solid fa-trash-can mr-2"></i> Remove
        </motion.button>
        <motion.button
          onClick={() => onBookmark(blog.id)}
          className={`flex items-center transition-colors duration-200 w-full justify-start ${
            blog.isBookmarked
              ? "text-yellow-500 hover:text-yellow-600"
              : "text-gray-700 hover:text-yellow-600"
          }`}
          whileHover={{ scale: 1.05 }}
        >
          <i
            className={`fa-solid fa-bookmark mr-2 ${
              blog.isBookmarked ? "text-yellow-500" : ""
            }`}
          ></i>{" "}
          {blog.isBookmarked ? "Unbookmark" : "Bookmark"}
        </motion.button>
        <motion.button
          className="flex items-center text-gray-700 hover:text-green-600 transition-colors duration-200 w-full justify-start"
          whileHover={{ scale: 1.05 }}
        >
          <i className="fa-solid fa-share-nodes mr-2"></i> Share
        </motion.button>
      </div>
    </motion.div>
  );
};
export default Popup;
