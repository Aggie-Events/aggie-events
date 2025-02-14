"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MdAdd, MdEdit, MdDelete, MdMoreVert } from "react-icons/md";
import ToastManager from "@/components/toast/ToastManager";

type EventStatus = 'draft' | 'published' | 'cancelled';

interface Event {
  id: number;
  title: string;
  date: string;
  status: EventStatus;
  attendees: number;
  thumbnail: string;
}

export default function EventsPage() {
  const [events, setEvents] = React.useState<Event[]>([
    {
      id: 1,
      title: "Aggie Football Game",
      date: "2024-03-20",
      status: "published",
      attendees: 1200,
      thumbnail: "/tamufield.png",
    },
    {
      id: 2,
      title: "MSC Open House",
      date: "2024-03-25",
      status: "draft",
      attendees: 0,
      thumbnail: "/tamufield.png",
    },
  ]);

  const updateEventStatus = async (eventId: number, newStatus: EventStatus) => {
    try {
      // TODO: Add API call to update status
      // await updateEvent(eventId, { status: newStatus });
      
      setEvents(events.map(event => 
        event.id === eventId ? { ...event, status: newStatus } : event
      ));
      
      ToastManager.addToast("Event status updated", "success");
    } catch (error) {
      ToastManager.addToast("Failed to update event status", "error");
    }
  };

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Events Management</h1>
        <Link
          href="/dashboard/events/create"
          className="flex items-center gap-2 px-4 py-2 bg-maroon text-white rounded-md hover:bg-darkmaroon transition-colors"
        >
          <MdAdd className="text-xl" />
          Create Event
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <Image
                          className="h-10 w-10 rounded-md object-cover"
                          src={event.thumbnail}
                          alt=""
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {event.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={event.status}
                      onChange={(e) => updateEventStatus(event.id, e.target.value as EventStatus)}
                      className={`px-2 py-1 text-xs font-semibold rounded-full border-0 ${getStatusColor(event.status)}`}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.attendees}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-3">
                      <button className="text-blue-600 hover:text-blue-900">
                        <MdEdit className="text-xl" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <MdDelete className="text-xl" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 