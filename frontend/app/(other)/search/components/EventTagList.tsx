import React from "react";
import SoloTagDisplay from "@/app/(other)/search/components/SoloTagDisplay";

export default function TagList() {
  return (
    <div className="flex flex-wrap gap-1 my-1">
      <SoloTagDisplay text="Engineering"></SoloTagDisplay>
      <SoloTagDisplay text="Engineering"></SoloTagDisplay>
      <SoloTagDisplay text="Engineering"></SoloTagDisplay>
      <SoloTagDisplay text="Engineering"></SoloTagDisplay>
      <SoloTagDisplay text="Engineering"></SoloTagDisplay>
    </div>
  );
}
