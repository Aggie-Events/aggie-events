import React from "react";
import HeaderContent from "./HeaderContent";

export default function HomeHeader() {
  return (
    <>
      <header className="dark:bg-gray-950 bg-gradient-to-b from-40% from-lightmaroon/90 h-[120px] relative flex items-start">
        <HeaderContent />
      </header>
    </>
  );
}
