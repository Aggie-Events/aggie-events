import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useMenuHandle } from "@/components/MenuHandle";

interface TagsFilterProps {
  onTagsChange: (tags: string[]) => void;
}

export default function TagsFilter({ onTagsChange }: TagsFilterProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSearchQuery, setTagSearchQuery] = useState<string>("");
  const tagsMenu = useMenuHandle({isOpen: true});

  const handleTagSelect = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    onTagsChange(newTags);
  };

  const allTags = ["Academic", "Arts", "Career", "Cultural", "Recreation", "Service", "Social", "Sports"];
  
  const filteredTags = tagSearchQuery 
    ? allTags.filter(tag => tag.toLowerCase().includes(tagSearchQuery.toLowerCase()))
    : allTags;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Tags</h3>
        <button 
          onClick={() => tagsMenu.setIsMenuOpen(!tagsMenu.isMenuOpen)}
          className="text-sm text-gray-500 flex items-center"
        >
          <FaChevronDown className={`ml-1 h-3 w-3 transition-transform ${tagsMenu.isMenuOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {tagsMenu.isMenuOpen && (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Search tags..."
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon focus:ring-maroon sm:text-sm p-1"
            value={tagSearchQuery}
            onChange={(e) => setTagSearchQuery(e.target.value)}
          />
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {filteredTags.map((tag) => (
              <label key={tag} className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded text-maroon focus:ring-maroon h-4 w-4"
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagSelect(tag)}
                />
                <span className="ml-2 text-sm text-gray-700">{tag}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 