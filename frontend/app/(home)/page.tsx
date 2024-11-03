import React from "react";
import Image from "next/image";
import AnimText from "@/app/(home)/components/typing-animation/AnimText";
import { TypingText, TypingTextBase } from "@/config/config";
import HomeHeader from "@/components/headers/HomeHeader";
import ParallaxBanner from "@/app/(home)/components/ParallaxBanner";
import EventCard from "@/components/cards/EventCard";

export default function Homepage() {
  return (
    <>
      <ParallaxBanner imgSrc="/tamu_campus.jpg" imgAlt="Image Description">
        <HomeHeader />
        <div className="p-5 md:pl-14 md:pt-14">
          <div className="mb-4 w-full">
            <AnimText baseText={TypingTextBase} texts={TypingText} delay={0} />
          </div>
          <div className="w-fit">
            <hr></hr>
            <h2 className="text-white mt-2 text-xl">
              One stop shop for events and organizations happening on campus
            </h2>
          </div>
        </div>

        <div className="absolute bottom-5 w-full">
          <div className="flex justify-evenly">
            <button
              className="bg-lightmaroon text-white px-7 py-2 
                    rounded-lg mt-4 shadow-md hover:shadow-lg text-xl border-2 border-black"
            >
              Find Events
            </button>
            <button
              className="bg-lightmaroon text-white px-4 py-2
                     rounded-lg mt-4 shadow-md hover:shadow-lg text-xl border-2 border-black"
            >
              Register Your Club
            </button>
          </div>
        </div>

        {/* Background image and color filter */}
        {/* <Image
                src="/tamu_campus.jpg"
                quality={100}
                fill={true}
                // placeholder='blur'
                alt="TAMU Campus"
                className="-z-10 object-cover bg-fixed"
                priority={true}
            /> */}
        <div className="absolute bg-maroon/50 w-full h-full -z-[20] top-0 left-0" />
      </ParallaxBanner>

      <div className="bg-gray-950 text-black px-4 py-8 h-[1000px]">
        <h1 className="text-white text-3xl font-semibold">Featured Events</h1>
        <div className="my-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <EventCard />
          <EventCard />
          <EventCard />
        </div>
      </div>
    </>
  );
}
