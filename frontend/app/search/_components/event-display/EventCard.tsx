import React from "react";
import Image from "next/image";
import {
  FaHeart,
  FaTag,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaCircle,
  FaBook,
  FaEllipsisH,
} from "react-icons/fa";
import Link from "next/link";
import { SearchEventsReturn } from "@/api/event";
import IconLabel from "@/components/common/IconLabel";
import { HiEye } from "react-icons/hi";
import { useMenuHandle } from "@/components/MenuHandle";

export default function EventCard({ event }: { event: SearchEventsReturn }) {
  const [isSaved, setIsSaved] = React.useState(false);
  const { isMenuOpen, menuRef, setIsMenuOpen } = useMenuHandle();

  const handleBlockEvent = (eventId: number) => {
    // Implement block functionality
    console.log(`Blocked event: ${eventId}`);
    setIsMenuOpen(false);
  };

  const handleReportEvent = (eventId: number) => {
    // Implement report functionality
    console.log(`Reported event: ${eventId}`);
    setIsMenuOpen(false);
  };

  return (
    <div className="flex flex-col gap-1 bg-gray-150 rounded-lg py-2 px-4 grow shadow-md w-full border-[1px] border-gray-200">
      <div className="flex">
        <div className="grow">
          {event.org_id && (
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                <Image
                  src="/cat.webp"
                  alt="organization logo"
                  width={35}
                  height={35}
                  className="object-cover rounded-full"
                />
              </div>
              <h3 className="flex flex-col justify-center grow">
                <Link
                  className="text-md font-medium text-maroon hover:underline"
                  href={event.org_slug ? `/orgs/${event.org_slug}` : `/orgs/${event.org_id}`}
                >
                  {event.org_name}
                </Link>
              </h3>
            </div>
          )}

          <Link
            className="text-2xl font-semibold text-maroon w-fit hover:underline"
            href={`/events/${event.event_id}`}
          >
            {event.event_name}
          </Link>
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 my-2">
              {event.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?tags=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-200 text-sm text-gray-700 rounded-full hover:bg-maroon hover:text-white transition-colors"
                >
                  <FaTag className="text-xs" />
                  {tag}
                </Link>
              ))}
            </div>
          )}
          <span>
            <p className="h-max line-clamp-3">{event.event_description}</p>
          </span>
        </div>

        <div className="h-max">
          <div className="flex items-center h-fit gap-2">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg h-fit ${isSaved ? "bg-maroon text-white" : "bg-white text-maroon border-[1px] border-maroon"}`}
              aria-label={isSaved ? "Unsave event" : "Save event"}
            >
              {isSaved ? <FaBookmark size={16} /> : <FaRegBookmark size={16} />}
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>

            {/* Menu Button */}
            <div className="relative" ref={menuRef}>
              <button
                className="flex items-center justify-center text-gray-500 hover:text-maroon p-2 rounded-full hover:bg-gray-100 h-full"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="More options"
              >
                <FaEllipsisH size={16} />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-1 z-10 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <button
                      onClick={() => handleBlockEvent(event.event_id)}
                      className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 group flex w-full items-center px-4 py-2 text-sm"
                    >
                      Block
                    </button>
                    <button
                      onClick={() => handleReportEvent(event.event_id)}
                      className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 group flex w-full items-center px-4 py-2 text-sm"
                    >
                      Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div className="flex items-center gap-1.5">
        <p className="text-sm w-fit ">
          Posted by{" "}
          <Link
            className="text-maroon hover:underline"
            href={`/users/${event.contributor_name}`}
          >
            {event.contributor_name}
          </Link>
        </p>
        <span className="text-maroon text-sm flex items-center">•</span>
        <div className="flex gap-2">
          <IconLabel text={"1000"}>
            <HiEye color="maroon" />
          </IconLabel>
          <IconLabel text={"1000"}>
            <FaBookmark color="maroon" />
          </IconLabel>
        </div>
      </div>
    </div>
  );
}
