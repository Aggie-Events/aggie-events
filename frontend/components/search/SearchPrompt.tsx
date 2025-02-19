import React from "react";
import { FaSearch, FaTag } from "react-icons/fa";
import { useTagAutocomplete } from "@/api/tags";

export default function SearchPrompt({
  prompt,
  onNameSearch,
  onTagSearch,
}: {
  prompt: string;
  onNameSearch: () => void;
  onTagSearch: (tag: string) => void;
}) {
  const { data: tags = [] } = useTagAutocomplete(prompt);
  const tagCompletion = tags.map(tag => tag.tag_name);

  return (
    <>
      {prompt.length > 0 && (
        <div className="absolute bg-white top-full left-0 w-full rounded-b-md border-t-[1px] border-gray-300">
          <div className="px-1">
            <button
              className="flex items-center bg-white hover:bg-gray-200 w-full rounded-md py-1 px-2 my-1 gap-2"
              onClick={onNameSearch}
            >
              <FaSearch className="text-gray-700 mt-1" size={13} />
              <div className="text-black grow text-left">{prompt}</div>
              <div className="text-gray-500 text-sm">Search by name...</div>
            </button>
          </div>
          {tagCompletion.length > 0 && (
            <div className="px-1 mb-1 border-t-[1px] border-gray-300">
              <div className="text-maroon text-sm px-2 py-1 font-semibold">
                Tags
              </div>
              {tagCompletion.map((tag) => (
                <button
                  key={tag}
                  className="flex items-center bg-white hover:bg-gray-200 w-full rounded-md py-1 px-2 gap-2"
                  onClick={() => onTagSearch(tag)}
                >
                  <FaTag className="text-maroon" size={13} />
                  <div className="text-black grow text-left">{tag}</div>
                  <div className="text-gray-500 text-sm">Search by tag...</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
