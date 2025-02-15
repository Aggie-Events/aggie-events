"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import ToastManager from "@/components/toast/ToastManager";
import { getUserEvents } from "@/api/event";
import { Event } from "@/config/dbtypes";
import { useAuth } from "@/components/auth/AuthContext";

type EventStatus = 'draft' | 'published' | 'cancelled';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!user) return;
      
      try {
        const userEvents = await getUserEvents(user.user_id);
        setEvents(userEvents);
      } catch (error) {
        ToastManager.addToast("Failed to fetch events", "error");
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [user]);

  const updateEventStatus = async (eventId: number, newStatus: EventStatus) => {
    try {
      // TODO: Add API call to update status
      // await updateEvent(eventId, { status: newStatus });
      
      setEvents(events.map(event => 
        event.event_id === eventId ? { ...event, status: newStatus } : event
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

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Events</h1>
        <Link
          href="/dashboard/events/create"
          className="flex items-center gap-2 px-4 py-2 bg-maroon text-white rounded-md hover:bg-darkmaroon transition-colors"
        >
          <MdAdd className="text-xl" />
          Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">You haven't created any events yet.</p>
          <Link
            href="/dashboard/events/create"
            className="inline-block mt-4 text-maroon hover:text-darkmaroon"
          >
            Create your first event
          </Link>
        </div>
      ) : (
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
                    Likes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.event_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {event.event_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {event.event_location || 'No location'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(event.start_time).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(event.start_time).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value="published" // TODO: Add status to event type
                        onChange={(e) => updateEventStatus(event.event_id, e.target.value as EventStatus)}
                        className={`px-2 py-1 text-xs font-semibold rounded-full border-0 ${getStatusColor('published')}`}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.event_likes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-3">
                        <Link 
                          href={`/dashboard/events/edit/${event.event_id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <MdEdit className="text-xl" />
                        </Link>
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
      )}
    </div>
  );
} 