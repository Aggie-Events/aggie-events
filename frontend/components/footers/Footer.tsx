import React from "react";

export default function Footer() {
  return (
    <footer className="bg-maroon dark:bg-gray-950 text-white font-semibold dark:text-white mt-auto border-t-2 border-black dark:border-gray-200">
      {/* Navigation links */}
      <nav>
        <div className="flex"></div>
      </nav>

      {/* Copyright */}
      <div>
        <div className="flex items-center justify-between w-[92%] mx-auto p-5">
          <div>
            <p>© 2024 Aggie Events</p>
          </div>
          <div>
            <p>Created by: Aggie Events Team</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
