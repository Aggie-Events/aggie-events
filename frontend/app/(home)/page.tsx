import React from "react";
import Image from "next/image";
import ParallaxBanner from "./components/ParallaxBanner";
import EventCategories from './components/EventCategories';
import PopularEvents from './components/PopularEvents';
import SearchHero from './components/SearchHero';
import Header from "@/components/headers/Header";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      {/* Hero Section with Search */}
      <SearchHero />
      
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
