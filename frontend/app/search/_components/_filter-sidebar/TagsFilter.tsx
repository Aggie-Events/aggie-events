import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useMenuHandle } from "@/components/MenuHandle";
import { useSearchParams } from "next/navigation";

interface TagsFilterProps {
  onTagsChange: (tags: string[]) => void;
}

// These would ideally be fetched from an API
const AVAILABLE_TAGS = [
  "Academic", "Arts", "Career", "Cultural", "Recreation", 
  "Service", "Social", "Sports", "Tech", "Other"
];

export default function TagsFilter({ onTagsChange }: TagsFilterProps) {
  const searchParams = useSearchParams();
  
  // Initialize from URL parameters if available
  const initialTags = searchParams.get('tags')
    ? searchParams.get('tags')!.split(',')
    : [];
    
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [tagSearchQuery, setTagSearchQuery] = useState<string>("");
  const tagsMenu = useMenuHandle({isOpen: true});
  
  // Update parent component when tags change on initial load
  useEffect(() => {
    if (initialTags.length > 0) {
      onTagsChange(initialTags);
    }
  }, []); // Runs only on mount to sync initial state

  const handleTagSelect = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    onTagsChange(newTags);
  };
  
  const clearAllTags = () => {
    setSelectedTags([]);
    onTagsChange([]);
  };
  
  const filteredTags = tagSearchQuery 
    ? AVAILABLE_TAGS.filter(tag => tag.toLowerCase().includes(tagSearchQuery.toLowerCase()))
    : AVAILABLE_TAGS;

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
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="Search tags..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon focus:ring-maroon sm:text-sm p-1"
              value={tagSearchQuery}
              onChange={(e) => setTagSearchQuery(e.target.value)}
            />
            {selectedTags.length > 0 && (
              <button 
                onClick={clearAllTags}
                className="ml-2 text-xs text-gray-500 hover:text-maroon whitespace-nowrap"
              >
                Clear All
              </button>
            )}
          </div>
          
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {selectedTags.map(tag => (
                <span 
                  key={`selected-${tag}`}
                  className="bg-maroon text-white text-xs px-2 py-1 rounded-full flex items-center"
                >
                  {tag}
                  <button 
                    onClick={() => handleTagSelect(tag)}
                    className="ml-1 hover:bg-maroon-dark rounded-full"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
          
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
            
            {filteredTags.length === 0 && (
              <p className="text-sm text-gray-500 italic">No matching tags found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 