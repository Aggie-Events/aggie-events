import React from "react";
import { IoClose } from "react-icons/io5";
import { FaTag } from "react-icons/fa";

export default function FilterTagDisplay({
  text,
  onClose,
}: {
  text: string;
  onClose: () => void;
}) {
  return (
    <button
      className="inline-flex items-center gap-1.5 px-3 py-1 bg-maroon text-white rounded-full hover:bg-darkmaroon transition-colors"
      onClick={onClose}
    >
      <FaTag className="text-xs" />
      <span>{text}</span>
      <IoClose className="text-white/80 hover:text-white" />
    </button>
  );
}
