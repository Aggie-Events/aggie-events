import React from "react";
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
  // How many page numbers to display before showing ellipsis
  const pageDisplay = 5;
  
  const pageAmt = Math.ceil(maxResults / pageSize);
  
  // Calculate the range of pages to display
  let startPage = Math.max(1, page - Math.floor(pageDisplay / 2));
  let endPage = Math.min(pageAmt, startPage + pageDisplay - 1);
  
  // Adjust startPage if we're near the end
  if (endPage - startPage + 1 < pageDisplay) {
    startPage = Math.max(1, endPage - pageDisplay + 1);
  }

  // Generate array of page numbers to display
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="flex gap-2">
      <button
        className="flex items-center gap-1 font-semibold rounded-md px-2 py-1 bg-maroon text-white
        disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none hover:shadow-md"
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
      >
        <IoMdArrowBack />
        Back
      </button>

      <div className="flex gap-1">
        {startPage > 1 && (
          <>
            <button
              className="font-semibold rounded-md px-3 py-1 bg-gray-200 hover:bg-gray-300"
              onClick={() => setPage(1)}
            >
              1
            </button>
            {startPage > 2 && (
              <span className="flex items-center px-1">...</span>
            )}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            className={`font-semibold rounded-md px-3 py-1 ${
              p === page
                ? "bg-maroon text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setPage(p)}
          >
            {p}
          </button>
        ))}

        {endPage < pageAmt && (
          <>
            {endPage < pageAmt - 1 && (
              <span className="flex items-center px-1">...</span>
            )}
            <button
              className="font-semibold rounded-md px-3 py-1 bg-gray-200 hover:bg-gray-300"
              onClick={() => setPage(pageAmt)}
            >
              {pageAmt}
            </button>
          </>
        )}
      </div>

      <button
        className="flex items-center gap-1 font-semibold rounded-md px-2 py-1 bg-maroon text-white
        disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none hover:shadow-md"
        disabled={page >= pageAmt}
        onClick={() => setPage(page + 1)}
      >
        Next
        <IoMdArrowForward />
      </button>
    </div>
  );
}
