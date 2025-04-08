import React from "react";
import ParallaxBanner from "./_components/ParallaxBanner";
import HomeHeader from "@/app/(home)/_components/HomeHeader";
import TypeAnim from "@/app/(home)/_components/typing-anim/TypeAnim";
import { TypingTextBase, TypingText } from "@/config/config";
import Link from "next/link";
import Image from "next/image";

// Define organization type
interface Organization {
  id: number;
  name: string;
  image: string;
  tags: string[];
  description: string;
  memberCount: number;
  eventCount: number;
  verified: boolean;
}

// Sample organization data
const organizations: Organization[] = [
  {
    id: 1,
    name: "Tech Innovation Club",
    image: "/cat.webp",
    tags: ["Technology", "Innovation", "Coding"],
    description: "Exploring the frontiers of technology and innovation on campus",
    memberCount: 128,
    eventCount: 24,
    verified: true
  },
  {
    id: 2,
    name: "Aggie Gaming Society",
    image: "/cat.webp",
    tags: ["Gaming", "eSports", "Entertainment"],
    description: "Where gamers unite to compete and have fun together",
    memberCount: 256,
    eventCount: 42,
    verified: true
  },
  {
    id: 3,
    name: "Sports & Recreation",
    image: "/cat.webp",
    tags: ["Sports", "Recreation", "Health"],
    description: "Stay active with intramural sports and outdoor activities",
    memberCount: 187,
    eventCount: 32,
    verified: true
  },
  {
    id: 4,
    name: "Fitness Collective",
    image: "/cat.webp",
    tags: ["Fitness", "Wellness", "Health"],
    description: "Building healthier minds and bodies through fitness programs",
    memberCount: 93,
    eventCount: 18,
    verified: false
  },
  {
    id: 5,
    name: "Business Leaders of Tomorrow",
    image: "/cat.webp",
    tags: ["Business", "Leadership", "Networking"],
    description: "Preparing students for success in the business world",
    memberCount: 142,
    eventCount: 15,
    verified: true
  },
  {
    id: 6,
    name: "Study Group Network",
    image: "/cat.webp",
    tags: ["Academic", "Learning", "Support"],
    description: "Collaborative learning and academic support for all majors",
    memberCount: 211,
    eventCount: 45,
    verified: false
  }
];

// Sample categories with icons
const categories = [
  { id: 1, name: "Academic", icon: "🎓", count: 32 },
  { id: 2, name: "Sports", icon: "🏀", count: 28 },
  { id: 3, name: "Technology", icon: "💻", count: 25 },
  { id: 4, name: "Arts", icon: "🎨", count: 21 },
  { id: 5, name: "Service", icon: "🤝", count: 19 },
  { id: 6, name: "Cultural", icon: "🌍", count: 23 },
  { id: 7, name: "Business", icon: "💼", count: 17 },
  { id: 8, name: "Social", icon: "🎉", count: 31 }
];

// Sample events data
const popularEvents = [
  {
    id: 1,
    title: "MSC Open House",
    date: "Apr 15, 2023",
    time: "10:00 AM - 3:00 PM",
    location: "Memorial Student Center",
    organizer: "Student Activities",
    image: "/tamufield.png",
    attendees: 520,
    tags: ["Campus", "Social", "Activities"]
  },
  {
    id: 2,
    title: "Ring Day Ceremony",
    date: "Apr 22, 2023",
    time: "9:00 AM - 4:00 PM",
    location: "Reed Arena",
    organizer: "Association of Former Students",
    image: "/tamufield.png",
    attendees: 1200,
    tags: ["Tradition", "Ceremony"]
  },
  {
    id: 3,
    title: "Career Fair",
    date: "May 3, 2023",
    time: "9:00 AM - 3:00 PM",
    location: "Rudder Tower",
    organizer: "Career Center",
    image: "/tamufield.png",
    attendees: 850,
    tags: ["Career", "Professional", "Networking"]
  }
];

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
        <div className="absolute bg-maroon/60 w-full h-full -z-[20] top-0 left-0" />
      </ParallaxBanner>
      
      {/* Quick Access Tabs */}
      <div className="sticky top-0 z-10 bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-3 gap-6 items-center justify-center text-sm font-medium">
            <a href="#organizations" className="text-maroon hover:text-maroon-600 whitespace-nowrap flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Organizations
            </a>
            <a href="#categories" className="text-gray-700 hover:text-maroon whitespace-nowrap flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Categories
            </a>
            <a href="#events" className="text-gray-700 hover:text-maroon whitespace-nowrap flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Events
            </a>
            <a href="#trending" className="text-gray-700 hover:text-maroon whitespace-nowrap flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Trending
            </a>
            <a href="#create" className="bg-maroon text-white px-3 py-1 rounded-md hover:bg-maroon-600 whitespace-nowrap flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Event
            </a>
          </div>
        </div>
      </div>

      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <input
                  type="text"
                  placeholder="Search for organizations or events..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex gap-2">
                <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent">
                  <option>All Categories</option>
                  <option>Academic</option>
                  <option>Sports</option>
                  <option>Technology</option>
                  <option>Arts</option>
                </select>
                
                <button className="bg-maroon text-white px-4 py-2 rounded-md hover:bg-maroon-600">
                  Filter
                </button>
              </div>
            </div>
          </div>
          
          {/* Organizations Section */}
          <section id="organizations" className="mb-12">
            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <svg className="w-6 h-6 text-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Popular Organizations
                </h2>
                
                {/* Organization Type Filters */}
                <div className="flex overflow-x-auto py-1 gap-2">
                  <button className="px-3 py-1 rounded-full bg-maroon text-white text-sm whitespace-nowrap shadow-sm">
                    All
                  </button>
                  <button className="px-3 py-1 rounded-full border border-gray-300 bg-white text-sm whitespace-nowrap hover:bg-gray-50">
                    Tech
                  </button>
                  <button className="px-3 py-1 rounded-full border border-gray-300 bg-white text-sm whitespace-nowrap hover:bg-gray-50">
                    Gaming
                  </button>
                  <button className="px-3 py-1 rounded-full border border-gray-300 bg-white text-sm whitespace-nowrap hover:bg-gray-50">
                    Sports
                  </button>
                  <button className="px-3 py-1 rounded-full border border-gray-300 bg-white text-sm whitespace-nowrap hover:bg-gray-50">
                    More...
                  </button>
                </div>
              </div>
              
              {/* Organizations Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {organizations.map((org) => (
                  <OrganizationCard key={org.id} organization={org} />
                ))}
              </div>
              
              <div className="text-center mt-6">
                <Link 
                  href="/organizations" 
                  className="inline-flex items-center text-white bg-maroon hover:bg-maroon-600 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                >
                  View all organizations
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
          
          {/* Categories Section */}
          <section id="categories" className="mb-12">
            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <svg className="w-6 h-6 text-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Browse by Category
                </h2>
                <Link href="/categories" className="text-maroon hover:underline text-sm font-medium flex items-center">
                  View All
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <Link 
                    key={category.id} 
                    href={`/categories/${category.name.toLowerCase()}`}
                    className="bg-white border border-gray-100 p-4 rounded-lg hover:shadow transition-all hover:border-maroon/20 flex items-center gap-3 group"
                  >
                    <div className="bg-gray-50 p-3 rounded-lg text-maroon group-hover:bg-maroon group-hover:text-white transition-colors duration-300 flex-shrink-0 flex items-center justify-center w-12 h-12">
                      <span className="text-2xl">{category.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-maroon transition-colors">{category.name}</h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {category.count} organizations
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
          
          {/* Events Section */}
          <section id="events" className="mb-12">
            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <svg className="w-6 h-6 text-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Popular Events
                </h2>
                
                {/* Time filters */}
                <div className="flex overflow-x-auto py-1 gap-2">
                  <button className="px-3 py-1 rounded-full bg-maroon text-white text-sm whitespace-nowrap shadow-sm">
                    This Week
                  </button>
                  <button className="px-3 py-1 rounded-full border border-gray-300 bg-white text-sm whitespace-nowrap hover:bg-gray-50">
                    This Month
                  </button>
                  <button className="px-3 py-1 rounded-full border border-gray-300 bg-white text-sm whitespace-nowrap hover:bg-gray-50">
                    All Upcoming
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularEvents.map((event) => (
                  <Link 
                    key={event.id} 
                    href={`/events/${event.id}`}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition flex flex-col h-full border border-gray-200"
                  >
                    <div className="relative h-36">
                      <Image 
                        src={event.image} 
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                        <div className="p-3 text-white">
                          <h3 className="font-bold text-lg">{event.title}</h3>
                          <div className="flex items-center text-sm">
                            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {event.date}
                          </div>
                        </div>
                      </div>
                      
                      {/* Event badge */}
                      <div className="absolute top-2 right-2 bg-maroon/80 backdrop-blur-sm text-white text-xs py-1 px-2 rounded-full flex items-center">
                        <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {event.attendees}
                      </div>
                    </div>
                    <div className="p-3 flex-grow flex flex-col">
                      <div className="flex items-center text-sm text-gray-700 mb-2">
                        <svg className="w-4 h-4 mr-1 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700 mb-2">
                        <svg className="w-4 h-4 mr-1 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700 mb-3">
                        <svg className="w-4 h-4 mr-1 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="truncate">{event.organizer}</span>
                      </div>
                      <div className="mt-auto pt-2 flex flex-wrap gap-1">
                        {event.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="inline-block px-2 py-0.5 text-xs bg-gray-50 rounded-md text-gray-700 border border-gray-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="text-center mt-6">
                <Link 
                  href="/events" 
                  className="inline-flex items-center text-white bg-maroon hover:bg-maroon-600 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                >
                  View all events
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Call to Action Banner */}
      <section id="create" className="bg-maroon">
        <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Create Your Own Event</h2>
            <p className="mb-4 text-white/80">
              Have an idea for an event? Create and promote it to the entire Texas A&M community.
              Get discovered by students and organizations with similar interests.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link 
                href="/create-event" 
                className="bg-white text-maroon px-5 py-2 rounded-md font-bold hover:bg-gray-100 transition inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Event
              </Link>
              <Link 
                href="/register-organization" 
                className="bg-transparent text-white border border-white px-5 py-2 rounded-md font-bold hover:bg-white/10 transition inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Register Organization
              </Link>
            </div>
          </div>
          <div className="hidden md:block relative w-1/3 h-64">
            <Image 
              src="/tamufield.png" 
              alt="Create event" 
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function OrganizationCard({ organization }: { organization: Organization }) {
  return (
    <Link 
      href={`/organizations/${organization.id}`}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex flex-col h-full border border-gray-200"
    >
      <div className="relative">
        {/* Organization image */}
        <div className="h-36 relative">
          <Image 
            src={organization.image} 
            alt={organization.name}
            fill
            className="object-cover"
          />
          
          {/* Stats pills - positioned on the image */}
          <div className="absolute bottom-2 left-2 flex gap-2">
            <div className="bg-black/60 backdrop-blur-sm text-white text-xs py-1 px-2 rounded-full flex items-center">
              <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {organization.memberCount}
            </div>
            <div className="bg-black/60 backdrop-blur-sm text-white text-xs py-1 px-2 rounded-full flex items-center">
              <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {organization.eventCount}
            </div>
          </div>
          
          {/* Verified badge */}
          {organization.verified && (
            <div className="absolute top-2 right-2 bg-blue-500/80 backdrop-blur-sm text-white p-1 rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-3 flex-grow flex flex-col">
        {/* Organization name */}
        <h3 className="font-bold text-base text-maroon">{organization.name}</h3>
        
        {/* Organization description */}
        <p className="text-xs text-gray-600 mb-2 line-clamp-2 flex-grow">{organization.description}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {organization.tags.slice(0, 2).map((tag: string, index: number) => (
            <span 
              key={index} 
              className="inline-block px-2 py-0.5 text-xs bg-gray-50 rounded-md text-gray-700 border border-gray-200"
            >
              {tag}
            </span>
          ))}
          {organization.tags.length > 2 && (
            <span className="inline-block px-2 py-0.5 text-xs bg-gray-50 rounded-md text-maroon border border-gray-200 font-medium">
              +{organization.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
