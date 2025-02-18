"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, Smile, Send, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { EmojiPicker } from "./emoji-picker";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

interface Comment {
  _id: string;
  blogId: string;
  comment: string;
  createdAt: Date;
  userId: {
    name: string;
    image: string;
  };
}

interface CommentSectionProps {
  blogId: string;
  onClose: () => void;
  onCommentAdded?: () => void;
  onCommentDeleted?: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  blogId,
  onClose,
  onCommentAdded,
  onCommentDeleted,
}) => {
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const { data: session } = useSession();
  const user = session?.user;

  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(`/api/blogs/${blogId}/comments`);
      setComments(response.data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setFetching(false);
    }
  }, [blogId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(`/api/blogs/${blogId}/comments`, {
        comment,
      });
      if (response.status === 200) {
        setComment("");
        await fetchComments(); // Refresh comments after submission
        onCommentAdded?.(); // Call the callback if provided
        // onClose?.();
        toast.success("Comment posted successfully.");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment. Please try again.");
    }
    setLoading(false);
  };

  // Delete a comment
  // Example client-side code using axios
  const handleDeleteComment = async (commentId: string) => {
    try {
      // Optimistically remove the comment from UI
      setComments((prev) => prev.filter((c) => c._id !== commentId));

      await axios.delete(
        `/api/blogs/${blogId}/comments?commentId=${commentId}`
      );
      // await fetchComments(); // Refresh comments after submission

      onCommentDeleted?.(); // Call the callback if provided
      // onClose?.();

      toast.success("Comment deleted successfully.");
      // Refresh comments or update state
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setComment((prev) => prev + emoji);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Comments ({comments.length})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
          {fetching ? (
            <div className="text-center text-gray-500">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-center text-gray-500 italic py-4">
              No comments yet. Be the first to share your thoughts!
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="flex items-start gap-3">
                <Image
                  src={comment.userId.image || "/User.png"}
                  alt={comment.userId.name}
                  width={40}
                  height={40}
                  className="rounded-full flex-shrink-0 h-8 w-8"
                />
                <div className="flex-1">
                  <div className="bg-gray-100 dark:bg-gray-700 px-3 py-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="font-normal text-xs text-gray-800 dark:text-gray-200">
                        {comment.userId.name}
                      </div>
                      <div>
                        {user?.name === comment.userId.name ? (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
                          >
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </div>
                    <p className="text-gray-800 text-base dark:text-gray-300">
                      {comment.comment}
                    </p>
                  </div>
                  <time className="text-xs text-gray-500 mt-1 block">
                    {new Date(comment.createdAt).toLocaleString()}
                  </time>
                </div>
              </div>
            ))
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-t dark:border-gray-700 pt-4"
        >
          <div className="flex gap-2">
            <Image
              src={user?.image || "/User.png"}
              alt={user?.name || "User"}
              width={32}
              height={32}
              className="rounded-full flex-shrink-0 h-12 w-12"
            />
            <div className="flex-1 relative">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment..."
                className="w-full p-2 border dark:border-gray-700 rounded-lg resize-none focus:outline-none dark:bg-gray-800 dark:text-gray-200"
                rows={2}
              />

              <div className="absolute right-2 bottom-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-gray-500 hover:text-blue-500"
                >
                  <Smile className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="text-gray-500 hover:text-blue-500"
                >
                  <ImageIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {showEmojiPicker && (
            <div className="mt-2">
              <EmojiPicker onEmojiSelect={handleEmojiSelect} />
            </div>
          )}

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={loading || !comment.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">↻</span>
                  Posting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Post Comment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentSection;
