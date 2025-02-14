"use client";
import React, { useState } from "react";
import UserList from "./UserList";
import { useAuth } from "@/components/auth/AuthContext";
import { addUser, deleteUser } from "@/api/user";
import { testAuth } from "@/api/auth";
import { Event } from "@/config/dbtypes";
import { EventCreate } from "@/config/query-types";
import IconLabel from "@/app/(other)/search/components/IconLabel";
import { FaLocationDot } from "react-icons/fa6";
import { createEvent } from "@/api/event";
import ToastManager from "@/components/toast/ToastManager";
import TagSelector from "@/components/tag/TagSelector";

export default function Dashboard() {
  const { user } = useAuth();
  const [page, setPage] = useState<number>(0);
  const options = ["Users", "Events", "Organizations"];
  return (
    <div className="flex grow justify-center mt-5 h-full">
      <div className="max-w-[1000px] w-full">
        <ul className="flex gap-2">
          {options.map((option, i) => (
            <li
              className={
                "px-3 py-1 rounded-t-lg " +
                (page === i && "bg-maroon-500 text-white")
              }
              key={i}
            >
              <button onClick={() => setPage(i)}>{option}</button>
            </li>
          ))}
        </ul>
        <div className="p-2 bg-gray-200 rounded-b-lg">
          {user && (
            <h1 className="text-xl font-bold">Welcome, {user.user_name}!</h1>
          )}
          {page === 0 && <UserForm />}
          {page === 1 && <EventForm />}
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
    <>
      <div className="my-2">
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className="border border-gray-300 bg-gray-100 p-1 rounded mr-2"
        />
        <input
          type="text"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 bg-gray-100 p-1 rounded mr-2"
        />
        <button
          onClick={() => {
            addUser(username!, email!);
            setUpdate(!update);
          }}
          className="bg-blue-500 rounded-md px-2 py-1"
        >
          Create user
        </button>
      </div>
      <div className="my-2">
        <button
          className="bg-red-400 rounded-md px-2 py-1"
          onClick={() => {
            deleteUser();
            setUpdate(!update);
          }}
        >
          Delete users
        </button>
      </div>
      <div className="mx-3 w-2/5">
        <UserList update={update} />
      </div>
    </>
  );
}

function EventForm() {
  const [eventName, setEventName] = useState<string>();
  const [eventDescription, setEventDescription] = useState<string>();
  const [eventLocation, setEventLocation] = useState<string>();
  const [startTime, setStartTime] = useState<string>();
  const [endTime, setEndTime] = useState<string>();
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  // Common tags that can be suggested
  const suggestedTags = [
    "Free Food",
    "Career Fairs",
    "Sports",
    "Academic",
    "Social",
    "Greek Life",
    "Workshops",
    "MSC",
    "Kyle Field",
    "Engineering",
    "Business",
    "Liberal Arts",
    "Science",
    "Research",
    "Networking",
  ];

  const addEvent = async () => {
    const event: EventCreate = {
      event_name: eventName!,
      event_description: eventDescription?.trim() || null,
      event_location: eventLocation?.trim() || null,
      start_time: new Date(startTime!),
      end_time: new Date(endTime!),
      tags: Array.from(selectedTags), // Convert Set to Array for API
    };

    console.log(event as EventCreate);
    createEvent(event)
      .then((res) => {
        ToastManager.addToast("Event created successfully", "success");
        // Clear form after successful creation
        setSelectedTags(new Set());
        setEventName("");
        setEventDescription("");
        setEventLocation("");
        setStartTime("");
        setEndTime("");
        console.log(res);
      })
      .catch((err) => {
        ToastManager.addToast("Error creating event", "error");
        console.log(err);
      });
  };

  return (
    <>
      <div className="my-2">
        <div className="flex flex-col w-[700px] gap-1">
          <input
            type="text"
            value={eventName || ""}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Enter event name"
            className="border border-gray-300 bg-gray-100 p-1 rounded mr-2 text-lg"
          />

          <div className="flex gap-2 items-center">
            <input
              type="datetime-local"
              placeholder="Enter start time"
              value={startTime || ""}
              onChange={(e) => setStartTime(e.target.value)}
              className="border border-gray-300 bg-gray-100 p-1 rounded"
            />
            <div>to</div>
            <input
              type="datetime-local"
              placeholder="Enter end time"
              value={endTime || ""}
              onChange={(e) => setEndTime(e.target.value)}
              className="border border-gray-300 bg-gray-100 p-1 rounded"
            />
          </div>

          <div className="flex items-center gap-1 text-md">
            <FaLocationDot color="maroon" />
            <input
              type="text"
              placeholder="Add location..."
              value={eventLocation || ""}
              onChange={(e) => setEventLocation(e.target.value)}
              className="border border-gray-300 bg-gray-100 p-1 rounded mr-2"
            />
          </div>

          <textarea
            placeholder="Add description..."
            value={eventDescription || ""}
            onChange={(e) => setEventDescription(e.target.value)}
            className="border border-gray-300 bg-gray-100 p-1 rounded min-h-[100px]"
          />

          {/* New Tag Selector Component */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Event Tags</label>
            <TagSelector
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              suggestedTags={suggestedTags}
            />
          </div>

          <button
            onClick={addEvent}
            className="bg-maroon text-white rounded-md px-4 py-2 hover:bg-darkmaroon transition-colors"
          >
            Create Event
          </button>
        </div>
      </div>
    </>
  );
}
