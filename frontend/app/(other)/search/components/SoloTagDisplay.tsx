import React from "react";
import { IoClose } from "react-icons/io5";

export default function SoloTagDisplay({ text }: { text: string }) {
  return (
    <div className="bg-lightmaroon rounded-md py-1 px-2 text-sm text-white flex items-center font-semibold gap-1 w-max">
      {text}
    </div>
  );
}
