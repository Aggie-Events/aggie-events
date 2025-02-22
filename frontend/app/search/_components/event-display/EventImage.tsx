import Image from "next/image";
import { SearchEventsReturn } from "@/api/event";

export default function EventImage({ event }: { event: SearchEventsReturn }) {
  return (
    <div className="w-[200px] h-[200px] rounded-lg overflow-hidden shrink-0">
      <img
        src={event.event_img || "/cat.webp"}
        alt={`Image for ${event.event_name}`}
        className="object-cover"
        sizes="200px"
      />
    </div>
  );
} 