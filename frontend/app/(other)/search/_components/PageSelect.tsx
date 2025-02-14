import React, { useEffect } from "react";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";

export interface PageSelectProps {
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  maxResults: number;
}

export default function PageSelect({
  page,
  pageSize,
  setPage,
  maxResults,
}: PageSelectProps) {
  const pageDisplay = 5;
  const pageAmt = Math.ceil(maxResults / pageSize);
  const startPage = Math.max(1, page - Math.floor(pageDisplay / 2));

  const pages = Array.from(
    { length: Math.min(pageDisplay, pageAmt) },
    (_, i) => i + startPage,
  );

  return (
    <div className="flex gap-2">
      <button
        className="flex items-center gap-1 font-semibold rounded-md px-2 py-1 bg-maroon text-white
        disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none hover:shadow-md"
        disabled={page == 1}
        onClick={() => setPage(page - 1)}
      >
        {page != 1 && <IoMdArrowBack />}
        Back
      </button>
      <div className="flex gap-1">
        {pages.map((p) => (
          <button
            key={p}
            className={`font-semibold rounded-md px-3 py-1 ${
              p == page
                ? "bg-maroon text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setPage(p)}
          >
            {p}
          </button>
        ))}
      </div>
      <button
        className="flex items-center gap-1 font-semibold rounded-md px-2 py-1 bg-maroon text-white
        disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none hover:shadow-md"
        disabled={page == pageAmt}
        onClick={() => setPage(page + 1)}
      >
        Next
        {page != pageAmt && <IoMdArrowForward />}
      </button>
    </div>
  );
}
