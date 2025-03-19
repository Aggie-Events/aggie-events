import React, { useState } from "react";
import { FaTag } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useTagAutocomplete } from "@/api/tags";
import { useMenuHandle } from "@/components/MenuHandle";

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export default function TagSelector({ selectedTags, onTagsChange }: TagSelectorProps) {
  const [tagInput, setTagInput] = useState("");
  const { data: tagSuggestions = [] } = useTagAutocomplete(tagInput);
  const { isMenuOpen: isSuggestionsOpen, menuRef: tagMenuRef, setIsMenuOpen: setIsSuggestionsOpen } = useMenuHandle();

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag]);
    }
    setTagInput("");
    setIsSuggestionsOpen(false);
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div ref={tagMenuRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        <FaTag className="inline mr-1" />
        Tags
      </label>

      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-primary/80"
            >
              <MdClose size={16} />
            </button>
          </span>
        ))}
      </div>

      {/* Tag Input */}
      <div className="relative">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onFocus={() => setIsSuggestionsOpen(true)}
          placeholder="Add tags..."
          className="w-full px-3 py-2 border rounded-md"
        />

        {/* Tag Suggestions */}
        {isSuggestionsOpen && tagSuggestions.length > 0 && (
          <div className="absolute z-10 w-full bg-white border rounded-md mt-1 shadow-lg">
            {tagSuggestions
              .filter((tag) => !selectedTags.includes(tag))
              .map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-left"
                >
                  <FaTag className="text-primary" size={12} />
                  <span>{tag}</span>
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
} 