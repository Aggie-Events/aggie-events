import React from "react";

export default function Footer() {
  return (
    <footer className="bg-maroon dark:bg-gray-950 text-white font-semibold dark:text-white mt-auto">
      {/* Navigation links */}
      <nav>
        <div className="flex"></div>
      </nav>

      {/* Copyright */}
      <div>
        <div className="flex items-center justify-between w-[92%] mx-auto p-4">
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
