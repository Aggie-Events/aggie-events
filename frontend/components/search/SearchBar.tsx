"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import SearchPrompt from "@/components/search/SearchPrompt";
import { useMenuSelect } from "../common/MenuSelectionHook";

export default function SearchBar() {
  const [searchInput, setSearchInput] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const {
    isMenuOpen: focused,
    menuRef,
    setIsMenuOpen: setFocused,
  } = useMenuSelect();
  const { push } = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (params.has("query")) {
      setSearchInput(params.get("query")!);
    }
  }, [searchParams]);

  useEffect(() => {
    // On / pressed, focus the input
    // Ensure / doesn't get entered into the input
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !focused) {
        e.preventDefault();
        setFocused(true);
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleSearch() {
    // Manipulate url query parameters
    const params = new URLSearchParams(searchParams);

    if (searchInput) {
      params.set("query", searchInput);
    } else {
      params.delete("query");
    }
    params.delete("page");

    setFocused(false);
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
    params.delete("page");
    setFocused(false);
    setSearchInput("");
    push(`/search?${params.toString()}`);
  }

  return (
    <>
      <form
        className={`flex grow justify-center hover:drop-shadow-lg ${focused && "z-[999]"}`}
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
          ref={menuRef}
        >
          <button
            onClick={handleSearch}
            className="text-gray-700 rounded-full p-1.5 m-1 hover:bg-gray-200 transition-colors"
          >
            <FaSearch />
          </button>
          <input
            ref={inputRef}
            id="search-input"
            alt="Test"
            className={`text-black py-1 w-full h-10 outline-none bg-transparent`}
            placeholder="Search..."
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
              if (e.key === "Escape") {
                setFocused(false);
                inputRef.current?.blur();
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
