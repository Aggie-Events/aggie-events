import React from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { motion } from "framer-motion";

interface SaveButtonProps {
  isSaved: boolean;
  onSaveEvent: (eventId: number) => void;
  eventId: number;
}

export default function SaveButton({ isSaved, onSaveEvent, eventId }: SaveButtonProps) {
  return (
    <motion.button
      onClick={() => onSaveEvent(eventId)}
      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg h-fit ${isSaved ? "bg-maroon text-white" : "bg-white text-maroon border-[1px] border-maroon"}`}
      aria-label={isSaved ? "Unsave event" : "Save event"}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        width: "auto"
      }}
      transition={{ 
        type: "tween",
        duration: 0.1
      }}
    >
      <motion.div
        key={isSaved ? "saved" : "unsaved"}
        initial={{ scale: 1.2}}
        animate={{ scale: 1}}
        exit={{ scale: 1.2}}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 10
        }}
      >
        {isSaved ? <FaBookmark size={16} /> : <FaRegBookmark size={16} />}
      </motion.div>
      <span>{isSaved ? "Saved" : "Save"}</span>
    </motion.button>
  );
} 