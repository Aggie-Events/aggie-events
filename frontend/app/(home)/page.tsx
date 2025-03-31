import React from "react";
import ParallaxBanner from "./_components/ParallaxBanner";
import EventCategories from './_components/EventCategories';
import PopularEvents from './_components/PopularEvents';
import SearchHero from './_components/SearchHero';
import Header from "@/app/(other)/_components/CommonHeader";
import HomeHeader from "@/app/(home)/_components/HomeHeader";
import TypeAnim from "@/app/(home)/_components/typing-anim/TypeAnim";
import { TypingTextBase, TypingText } from "@/config/config";
import QuickFilters from './_components/QuickFilters';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <ParallaxBanner imgSrc="/tamu_campus.jpg" imgAlt="Image Description">
        <HomeHeader />
        <div className="p-5 md:pl-14 md:pt-14 font-">
          <div className="mb-4 w-full">
            <TypeAnim baseText={TypingTextBase} texts={TypingText} delay={0} className="text-white text-4xl" />
          </div>
          <div className="w-fit">
            <h2 className="text-white mt-2 text-xl">
              One stop shop for events and organizations in the Texas A&M campus
            </h2>
          </div> 
        </div>

        {/*<div className="absolute bottom-5 w-full">*/}
        {/*  <div className="flex justify-evenly">*/}
        {/*    <button*/}
        {/*      className="bg-lightmaroon text-white px-7 py-2*/}
        {/*            rounded-lg mt-4 shadow-md hover:shadow-lg text-xl border-2 border-black"*/}
        {/*    >*/}
        {/*      Find Events*/}
        {/*    </button>*/}
        {/*    <button*/}
        {/*      className="bg-lightmaroon text-white px-4 py-2*/}
        {/*             rounded-lg mt-4 shadow-md hover:shadow-lg text-xl border-2 border-black"*/}
        {/*    >*/}
        {/*      Register Your Club*/}
        {/*    </button>*/}
        {/*  </div>*/}
        {/*</div>*/}

        <div className="absolute bg-maroon/50 w-full h-full -z-[20] top-0 left-0" />
      </ParallaxBanner>
      
      {/* Event Categories */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
          <EventCategories />
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Popular Events</h2>
          <PopularEvents />
        </div>
      </section>

      {/* Quick Filters Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Quick Filters</h2>
          <QuickFilters />
        </div>
      </section>

      {/* Promotional Banner */}
      <ParallaxBanner 
        imgSrc="/images/banner.jpg"
        imgAlt="Promotional banner"
      >
        <div className="text-center text-white">
          <h2>Create Your Own Event</h2>
          <p>Start planning today</p>
        </div>
      </ParallaxBanner>
    </main>
  );
}
