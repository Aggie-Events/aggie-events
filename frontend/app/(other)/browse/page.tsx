"use client";

import React, { useState } from "react";
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

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("organizations");

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Quick Access Tabs */}
      <div className="sticky top-0 z-10 bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-3 gap-6 items-center justify-center text-sm font-medium">
            <button
              onClick={() => setActiveTab("organizations")}
              className={`whitespace-nowrap flex items-center gap-1 ${
                activeTab === "organizations"
                  ? "text-maroon"
                  : "text-gray-700 hover:text-maroon"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Organizations
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`whitespace-nowrap flex items-center gap-1 ${
                activeTab === "categories"
                  ? "text-maroon"
                  : "text-gray-700 hover:text-maroon"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Categories
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`whitespace-nowrap flex items-center gap-1 ${
                activeTab === "events"
                  ? "text-maroon"
                  : "text-gray-700 hover:text-maroon"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Events
            </button>
            <button
              onClick={() => setActiveTab("trending")}
              className={`whitespace-nowrap flex items-center gap-1 ${
                activeTab === "trending"
                  ? "text-maroon"
                  : "text-gray-700 hover:text-maroon"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Trending
            </button>
            <Link
              href="/dashboard/events/create"
              className="bg-maroon text-white px-3 py-1 rounded-md hover:bg-darkmaroon whitespace-nowrap flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Event
            </Link>
          </div>
        </div>
      </div>

        <div className="container mx-auto px-4 py-8">
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <input
                  type="text"
                  placeholder="Search for organizations or events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
                  </svg>
            </div>
            <button className="px-4 py-2 bg-maroon text-white rounded-md hover:bg-darkmaroon transition-colors">
              Search
            </button>
                </div>
              </div>
              
        {/* Content based on active tab */}
        {activeTab === "organizations" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {organizations.map((org) => (
                  <OrganizationCard key={org.id} organization={org} />
                ))}
              </div>
        )}

        {activeTab === "categories" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} events</p>
              </div>
                ))}
              </div>
        )}

        {activeTab === "events" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {activeTab === "trending" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularEvents
              .sort((a, b) => b.attendees - a.attendees)
              .map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
          </div>
        )}
        </div>
    </main>
  );
}

function OrganizationCard({ organization }: { organization: Organization }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48">
          <Image 
            src={organization.image} 
            alt={organization.name}
            fill
            className="object-cover"
          />
            </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {organization.name}
          </h3>
          {organization.verified && (
            <span className="text-blue-500">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-4">{organization.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {organization.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-maroon/10 text-maroon rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>{organization.memberCount} members</span>
          <span>{organization.eventCount} events</span>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: typeof popularEvents[0] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <div className="text-xs font-medium text-maroon mb-2">
          {event.date} • {event.time}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {event.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          {event.location} • {event.organizer}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {event.tags.map((tag) => (
            <span 
              key={tag}
              className="px-2 py-1 bg-maroon/10 text-maroon rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {event.attendees} attendees
            </span>
          <button className="px-4 py-2 bg-maroon text-white rounded-md hover:bg-darkmaroon transition-colors text-sm">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
