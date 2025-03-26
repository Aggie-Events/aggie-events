import React from 'react';
import FilterTagList from "./filter-tag-list/FilterTagList";
import { SearchFilters } from "@/config/query-types";

const categories = [
  "All Events",
  "Free Food",
  "Career Fairs",
  "Sports",
  "Academic",
  "Social",
  "Greek Life",
  "Workshops",
] as const;

type Category = typeof categories[number];

interface CategoryTagsProps {
  filters: React.MutableRefObject<SearchFilters>;
  selectedCategory: Category;
  tags: string[];
  onCategorySelect: (category: Category) => void;
  onUpdateFilters: () => void;
}

export default function QuickFilters({ 
  filters, 
  selectedCategory, 
  tags, 
  onCategorySelect, 
  onUpdateFilters 
}: CategoryTagsProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-1 rounded-full border text-sm transition-all duration-300
              ${
                category === selectedCategory
                  ? "bg-maroon text-white border-maroon"
                  : "border-gray-200 hover:border-maroon hover:text-maroon"
              }`}
            onClick={() => onCategorySelect(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {tags.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm">|</span>
          <FilterTagList
            tags={tags}
            onTagClose={(tag) => {
              const newTags = new Set(filters.current.tags);
              newTags.delete(tag);
              filters.current.tags = newTags;
              onUpdateFilters();
            }}
          />
        </div>
      )}
    </div>
  );
}

export { categories, type Category }; 