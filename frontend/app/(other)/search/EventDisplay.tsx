import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface Event {
  title: string;
  description: string;
  location: string;
  date: string;
  link: string;
  time: string;
}

export default function EventDisplay({ event }: { event: Event }) {
  return (
    <div className="flex flex-col gap-1 bg-gray-50 rounded-md">
      <div className="flex gap-2 relative w-96 m-2">
        <div>
          <Image
            src="/cat.webp"
            alt="event"
            width={50}
            height={50}
            className="object-cover rounded-full"
          />
        </div>
        <div className="">
          <h4 className="text-xl">{event.title}</h4>
          <h4 className="text-md text-gray-400">Aggie Events</h4>
        </div>
      </div>

      <div className="px-2">
        <span>
          <p className="h-max line-clamp-3">{event.description}</p>
          <Link href="/">Read more</Link>
        </span>
      </div>

      <div className="border-t-[1px] border-gray-200 px-2">
        <h4 className="text-md font-semibold">Location: {event.location}</h4>
        <h4 className="text-md font-semibold">Date: {event.date}</h4>
        <h4 className="text-md font-semibold">Time: {event.time}</h4>
      </div>
    </div>
  );
}
