import React from "react";
import { FaChevronDown } from "react-icons/fa";
import { useMenuSelect } from "@/components/common/MenuSelectionHook";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function FilterSection({
  title,
  children,
  defaultOpen = true,
}: FilterSectionProps) {
  const menuHandle = useMenuSelect({ isOpen: defaultOpen });

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => menuHandle.setIsMenuOpen(!menuHandle.isMenuOpen)}
        className="w-full flex justify-between items-center p-3 bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition-colors"
      >
        <h3 className="font-medium text-gray-900">{title}</h3>
        <FaChevronDown
          className={`ml-1 h-3 w-3 transition-transform duration-200 ${menuHandle.isMenuOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`transition-all duration-200 ease-in-out ${menuHandle.isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 invisible"}`}
      >
        <div className="p-3 space-y-2">{children}</div>
      </div>
    </div>
  );
}
