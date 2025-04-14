import React from "react";
import { SearchFilters } from "@/config/query-types";
import { useMenuHandle } from "@/components/MenuHandle";
import { FaChevronDown } from "react-icons/fa";

interface SortOptionProps {
  currentSort: string;
  onUpdate: (value: string) => void;
  sortOptions: { display: string; value: string }[];
}

export default function SortOption({ currentSort, onUpdate, sortOptions }: SortOptionProps) {
  const { isMenuOpen, menuRef, setIsMenuOpen } = useMenuHandle();
  
  const currentSortDisplay = sortOptions.find(option => option.value === currentSort)?.display || "Sort by";

  const handleSortChange = (value: string) => {
    onUpdate(value);
    setIsMenuOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-white border rounded-lg hover:bg-gray-50"
      >
        <span>{currentSortDisplay}</span>
        <FaChevronDown className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isMenuOpen && (
        <div className="absolute right-0 z-10 mt-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`${
                  currentSort === option.value ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } group flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100`}
              >
                {option.display}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
