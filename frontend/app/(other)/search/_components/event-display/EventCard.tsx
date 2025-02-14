"use client";
import React from "react";
import Image from "next/image";
import IconLabel from "@/app/(other)/search/components/IconLabel";
import { HiEye } from "react-icons/hi";
import { FaHeart, FaTag } from "react-icons/fa";
import { Event } from "@/config/dbtypes";
import EventTagList from "@/components/tag/EventTagList";
import Link from "next/link";
import { SearchEventsReturn } from "@/api/event";

export default function EventCard({ event }: { event: SearchEventsReturn }) {
  return (
    <div className="flex flex-col gap-1 bg-gray-100 rounded-lg py-2 px-4 grow hover:shadow-md w-full">
      <div className="flex flex-col">
        <div className="flex justify-center gap-2">
          {event.org_id && (
            <>
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
              </h3>
            </>
          )}
        </div>
      </div>
      <Link
        className="text-2xl font-semibold text-maroon w-fit"
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
      <div className="">
        <span>
          <p className="h-max line-clamp-3">{event.event_description}</p>
        </span>
      </div>
      <hr />
      <p className="text-sm w-fit ">
        Posted by{" "}
        <Link className="text-maroon" href={`/users/${event.contributor_id}`}>
          {event.contributor_name}
        </Link>
      </p>
      {/*<div className="flex gap-2">*/}
      {/*  <IconLabel text={"1000"}>*/}
      {/*    <HiEye color="maroon" />*/}
      {/*  </IconLabel>*/}
      {/*  <IconLabel text={"1000"}>*/}
      {/*    <FaHeart color="maroon" />*/}
      {/*  </IconLabel>*/}
      {/*</div>*/}
    </div>
  );
}
