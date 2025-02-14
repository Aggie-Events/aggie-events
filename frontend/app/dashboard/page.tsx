"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MdHistory, MdAccessTime, MdThumbUp, MdPlaylistPlay } from "react-icons/md";
import AuthSuspense from "@/components/auth/AuthSuspense";
import { useAuth } from "@/components/auth/AuthContext";

export default function DashboardPage() {
  return (
    <AuthSuspense>
      <Dashboard />
    </AuthSuspense>
  );
}

function Dashboard() {
  const { user } = useAuth();

  const recentEvents = [
    {
      id: 1,
      title: "Aggie Football Game",
      organizer: "Texas A&M Athletics",
      thumbnail: "/images/placeholder.jpg",
      views: 1200,
      date: "2 days ago",
    },
    {
      id: 2,
      title: "MSC Open House",
      organizer: "Memorial Student Center",
      thumbnail: "/images/placeholder.jpg",
      views: 800,
      date: "3 days ago",
    },
    // Add more events as needed
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.user_name}!
        </h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <MdHistory className="text-2xl text-maroon" />
            <div>
              <h3 className="text-sm text-gray-500">Events Attended</h3>
              <p className="text-xl font-bold">24</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <MdAccessTime className="text-2xl text-maroon" />
            <div>
              <h3 className="text-sm text-gray-500">Upcoming Events</h3>
              <p className="text-xl font-bold">5</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <MdThumbUp className="text-2xl text-maroon" />
            <div>
              <h3 className="text-sm text-gray-500">Liked Events</h3>
              <p className="text-xl font-bold">16</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <MdPlaylistPlay className="text-2xl text-maroon" />
            <div>
              <h3 className="text-sm text-gray-500">My Events</h3>
              <p className="text-xl font-bold">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentEvents.map((event) => (
            <Link href={`/event/${event.id}`} key={event.id}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-40">
                  <Image
                    src={event.thumbnail}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600">{event.organizer}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <span>{event.views} views</span>
                    <span className="mx-2">•</span>
                    <span>{event.date}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/create"
              className="block w-full px-4 py-2 text-center text-white bg-maroon rounded hover:bg-darkmaroon transition-colors"
            >
              Create New Event
            </Link>
            <Link
              href="/dashboard/events"
              className="block w-full px-4 py-2 text-center text-maroon border border-maroon rounded hover:bg-maroon hover:text-white transition-colors"
            >
              Manage Events
            </Link>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Your Organizations</h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/organizations"
              className="block px-4 py-3 rounded hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Texas A&M Athletics</span>
                <span className="text-sm text-gray-500">Admin</span>
              </div>
            </Link>
            <Link
              href="/dashboard/organizations"
              className="block px-4 py-3 rounded hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Memorial Student Center</span>
                <span className="text-sm text-gray-500">Member</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
