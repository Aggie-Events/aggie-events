import React from "react";
import { FaEllipsisH } from "react-icons/fa";
import { useMenuSelect } from "@/components/common/MenuSelectionHook";

interface EventMenuProps {
  onBlockEvent: (eventId: number) => void;
  onReportEvent: (eventId: number) => void;
  eventId: number;
}

export default function EventMenu({
  onBlockEvent,
  onReportEvent,
  eventId,
}: EventMenuProps) {
  const { isMenuOpen, menuRef, setIsMenuOpen } = useMenuSelect();

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center justify-center text-gray-500 hover:text-maroon p-2 rounded-full hover:bg-gray-100 h-full"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="More options"
      >
        <FaEllipsisH size={16} />
      </button>
      {isMenuOpen && (
        <div className="absolute right-0 top-full mt-1 z-20 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <button
              onClick={() => {
                onBlockEvent(eventId);
                setIsMenuOpen(false);
              }}
              className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 group flex w-full items-center px-4 py-2 text-sm"
            >
              Block
            </button>
            <button
              onClick={() => {
                onReportEvent(eventId);
                setIsMenuOpen(false);
              }}
              className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 group flex w-full items-center px-4 py-2 text-sm"
            >
              Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
