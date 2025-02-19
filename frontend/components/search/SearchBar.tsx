"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import SearchPrompt from "@/components/search/SearchPrompt";

export default function SearchBar() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [focused, setFocused] = useState<boolean>(false);
  const searchParams = useSearchParams();

  const searchRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { push } = useRouter();

  function handleSearch() {
    // Manipulate url query parameters
    const params = new URLSearchParams(searchParams);
    console.log("Searching for: " + searchInput);
    if (searchInput) {
      params.set("query", searchInput);
    } else {
      params.delete("query");
    }
    setFocused(false);
    setSearchInput("");
    push(`/search?${params.toString()}`);
  }

  function tagSearch(tag: string) {
    const params = new URLSearchParams(searchParams);
    if (params.has("tags")) {
      const tags = params.get("tags")!.split(",");
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
      params.set("tags", tags.join(","));
    } else {
      params.set("tags", tag);
    }
    setFocused(false);
    setSearchInput("");
    push(`/search?${params.toString()}`);
  }

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setFocused(false);
      }
    };

    // Add event listener when the menu is open
    if (focused) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      inputRef.current?.blur();
    }

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [focused]);

  return (
    <>
      <form
        className={`flex grow justify-center hover:drop-shadow-lg ${focused && "z-[999]"}`}
        ref={searchRef}
      >
        <div
          className={`relative flex w-full items-center
          ${
            focused
              ? (searchInput.length > 0 ? "rounded-t-md" : "rounded-md") +
                " bg-white"
              : "rounded-md bg-gray-100"
          }
            `}
        >
          <FaSearch className="text-gray-700 mx-2" />
          <input
            id="search-input"
            alt="Test"
            className={`text-black py-1 w-full h-10 outline-none bg-transparent`}
            placeholder="Search..."
            ref={inputRef}
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
              if (e.key === "Escape") {
                setFocused(false);
              }
            }}
            onClick={() => setFocused(true)}
          />
          {focused && (
            <SearchPrompt
              prompt={searchInput}
              onNameSearch={handleSearch}
              onTagSearch={(t) => tagSearch(t)}
            />
          )}
        </div>
      </form>
      {focused && (
        <div className="fixed h-screen w-screen bg-black/20 top-0 left-0 z-[998]"></div>
      )}
    </>
  );
}
