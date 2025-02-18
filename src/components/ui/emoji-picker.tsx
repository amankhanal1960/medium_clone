import type React from "react";

const emojis = ["😀", "😂", "😍", "🤔", "👍", "❤️", "🎉", "🔥"];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {emojis.map((emoji) => (
        <button
          key={emoji}
          type="button" // Prevents form submission
          className="text-2xl hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
          onClick={() => onEmojiSelect(emoji)}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};
