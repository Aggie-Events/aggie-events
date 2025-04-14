import React, { useState } from "react";
import { SearchEventsReturn } from "@/api/event";
import { FaCalendarAlt } from "react-icons/fa";
import Image from "next/image";

export default function EventImage({ event }: { event: SearchEventsReturn }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="w-[100px] h-[100px] rounded-lg overflow-hidden shrink-0 self-center relative">
      {event.event_img && !hasError ? (
        <>
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse">
              <div className="w-3/4 h-2 bg-gray-300 rounded absolute top-1/4 left-1/2 -translate-x-1/2"></div>
              <div className="w-1/2 h-2 bg-gray-300 rounded absolute top-1/3 left-1/2 -translate-x-1/2"></div>
              <div className="w-2/3 h-2 bg-gray-300 rounded absolute top-1/2 left-1/2 -translate-x-1/2"></div>
            </div>
          )}
          <Image
            src={event.event_img}
            alt={`Image for ${event.event_name}`}
            width={100}
            height={100}
            className={`object-cover w-full h-full transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </>
      ) : (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
          <FaCalendarAlt size={40} className="text-gray-500" />
        </div>
      )}
    </div>
  );
} 