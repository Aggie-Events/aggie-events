"use client";
import React, { useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import UserList from "../UserList";
import { Event } from "@/config/dbtypes";
import { EventCreate } from "@/config/query-types";
import IconLabel from "@/app/(other)/search/components/IconLabel";
import { FaLocationDot } from "react-icons/fa6";
import { createEvent } from "@/api/event";
import ToastManager from "@/components/toast/ToastManager";
import TagSelector from "@/components/tag/TagSelector";

export default function DevelopmentPage() {
  const { user } = useAuth();
  const [page, setPage] = useState<number>(0);
  const options = ["Overview", "Users", "Events", "Organizations"];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Development Dashboard</h1>
      </div>

      {/* Development Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* API Status Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">API Status</h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">All systems operational</span>
          </div>
        </div>

        {/* Environment Info Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Environment</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Mode:</span>
              <span className="font-medium">Development</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Version:</span>
              <span className="font-medium">1.0.0</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors">
              Clear Cache
            </button>
            <button className="w-full px-4 py-2 text-sm text-white bg-purple-500 rounded hover:bg-purple-600 transition-colors">
              Sync Database
            </button>
          </div>
        </div>
      </div>

      {/* Development Tools */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b">
          <ul className="flex gap-2 px-6 pt-4">
            {options.map((option, i) => (
              <li
                key={i}
                className={
                  "px-4 py-2 rounded-t-lg cursor-pointer " +
                  (page === i
                    ? "bg-maroon text-white"
                    : "hover:bg-gray-100 transition-colors")
                }
              >
                <button onClick={() => setPage(i)}>{option}</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6">
          {user && (
            <h2 className="text-xl font-bold mb-4">Welcome, {user.user_name}!</h2>
          )}
          {page === 1 && <UserForm />}
          {page === 2 && <EventForm />}
          {page === 0 && (
            <div className="space-y-4">
              {/* Recent Activity Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { time: "2 mins ago", action: "Database backup completed" },
                    { time: "15 mins ago", action: "New event type added" },
                    { time: "1 hour ago", action: "System update installed" },
                  ].map((activity, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                      <span className="text-gray-800">{activity.action}</span>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UserForm() {
  const [username, setUsername] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [update, setUpdate] = useState<boolean>(false);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Username"
          className="px-4 py-2 rounded border"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="px-4 py-2 rounded border"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-maroon text-white rounded hover:bg-darkmaroon transition-colors"
          onClick={() => setUpdate(!update)}
        >
          Add User
        </button>
      </div>
      <UserList update={update} />
    </div>
  );
}

function EventForm() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const addEvent = async () => {
    if (!title || !description || !location) return;

    const event: EventCreate = {
      event_name: title,
      event_description: description,
      event_location: location,
      start_time: new Date(),
      end_time: new Date(),
      tags: Array.from(selectedTags),
    };

    try {
      await createEvent(event);
      ToastManager.addToast("Event created successfully!", "success");
    } catch (error) {
      ToastManager.addToast("Failed to create event", "error");
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Event Title"
        className="w-full px-4 py-2 rounded border"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Event Description"
        className="w-full px-4 py-2 rounded border"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex gap-4">
        <IconLabel text="Location" >
        <FaLocationDot />
          <input
            type="text"
            placeholder="Location"
            className="px-4 py-2 rounded border"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </IconLabel>
      </div>
      <TagSelector 
        selectedTags={selectedTags} 
        onTagsChange={setSelectedTags}
      />
      <button
        className="px-4 py-2 bg-maroon text-white rounded hover:bg-darkmaroon transition-colors"
        onClick={addEvent}
      >
        Create Event
      </button>
    </div>
  );
} 