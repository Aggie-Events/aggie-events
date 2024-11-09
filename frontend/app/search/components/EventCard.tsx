"use client";
import React from "react";
import Image from "next/image";
import IconLabel from "@/app/search/components/IconLabel";
import { HiEye } from "react-icons/hi";
import { FaHeart } from "react-icons/fa";
import { Event } from "@/config/dbtypes";
import EventTagList from "@/components/tag/EventTagList";
import Link from "next/link";

export default function EventCard({ event }: { event: Event }) {
  return (
    <div className="flex flex-col gap-1 bg-gray-50 rounded-lg py-2 px-4 grow">
      <div className="flex flex-col">
        <div className="flex justify-center gap-2">
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
              className="text-md font-medium text-maroon"
              href={`/org/${event.event_id}`}
            >
              Aggie Events
            </Link>
            <Link className="text-sm" href="/">
              Posted by <span className="text-maroon">John Doe</span>
            </Link>
          </h3>
        </div>
      </div>
      <h1 className="">
        <Link
          className="text-xl font-semibold text-maroon"
          href={`/events/${event.event_id}`}
        >
          {event.event_name}
        </Link>
      </h1>
      <div>
        <EventTagList tags={["Engineering", "Yes"]} />
      </div>
      <div className="">
        <span>
          <p className="h-max line-clamp-3">{event.event_description}</p>
        </span>
      </div>
      <div className="flex gap-2">
        <IconLabel text={"1000"}>
          <HiEye color="maroon" />
        </IconLabel>
        <IconLabel text={"1000"}>
          <FaHeart color="maroon" />
        </IconLabel>
      </div>
    </div>
  );
}