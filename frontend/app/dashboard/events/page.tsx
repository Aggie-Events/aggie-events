"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdArrowUpward,
  MdArrowDownward,
} from "react-icons/md";
import ToastManager from "@/components/toast/ToastManager";
import { useEventSearchUser } from "@/api/event";
import { useAuth } from "@/components/auth/AuthContext";
import { EventStatus } from "@/config/query-types";
import LoadingBar from "@/components/common/LoadingBar";
import { AnimatePresence } from "framer-motion";

type SortableColumn =
  | "name"
  | "eventDate"
  | "lastModified"
  | "status"
  | "likes";

// Helper function to format dates
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
};

export default function EventsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [statusFilter, setStatusFilter] = useState<EventStatus | "all">(
    (searchParams.get("status") as EventStatus | "all") || "all",
  );
  const [upcomingOnly, setUpcomingOnly] = useState(
    searchParams.get("upcoming") === "true",
  );
  const [sortBy, setSortBy] = useState<SortableColumn>(
    (searchParams.get("sort") as SortableColumn) || "eventDate",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (searchParams.get("order") as "asc" | "desc") || "desc",
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [pageSize] = useState(Number(searchParams.get("pageSize")) || 10);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("q", searchQuery);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (upcomingOnly) params.set("upcoming", "true");
    if (sortBy !== "eventDate") params.set("sort", sortBy);
    if (sortOrder !== "desc") params.set("order", sortOrder);
    if (page !== 1) params.set("page", page.toString());
    if (pageSize !== 10) params.set("pageSize", pageSize.toString());

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "");
  }, [
    searchQuery,
    statusFilter,
    upcomingOnly,
    sortBy,
    sortOrder,
    page,
    pageSize,
    router,
  ]);

  const { data, isLoading } = useEventSearchUser({
    page,
    pageSize,
    sort: sortBy,
    order: sortOrder,
  });

  const handleSort = (column: SortableColumn) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    // Reset to first page when sorting changes
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1); // Reset to first page on new search
  };

  const handleStatusFilter = (value: EventStatus | "all") => {
    setStatusFilter(value);
    setPage(1); // Reset to first page on filter change
  };

  const handleUpcomingToggle = (value: boolean) => {
    setUpcomingOnly(value);
    setPage(1); // Reset to first page on filter change
  };

  const SortIndicator = ({ column }: { column: SortableColumn }) => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? (
      <MdArrowUpward className="inline-block ml-1" />
    ) : (
      <MdArrowDownward className="inline-block ml-1" />
    );
  };

  // Filter events based on search and status
  const filteredEvents =
    data?.events.filter((event) => {
      if (
        searchQuery &&
        !event.event_name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (statusFilter !== "all" && event.event_status !== statusFilter) {
        return false;
      }
      if (upcomingOnly && new Date(event.start_time) <= new Date()) {
        return false;
      }
      return true;
    }) ?? [];

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusUpdate = async (eventId: number, status: EventStatus) => {
    // TODO: Implement status update
    ToastManager.addToast(`Status updated to ${status}`, "success");
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>{isLoading && <LoadingBar />}</AnimatePresence>

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

      {/* Filter Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) =>
              handleStatusFilter(e.target.value as EventStatus | "all")
            }
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon hover:bg-gray-100"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              id="upcomingOnly"
              checked={upcomingOnly}
              onChange={(e) => handleUpcomingToggle(e.target.checked)}
              className="w-4 h-4 text-maroon border-gray-300 rounded focus:ring-maroon"
            />
            <span className="text-sm text-gray-700">Upcoming Events Only</span>
          </label>
        </div>
      </div>

      {!filteredEvents || filteredEvents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">
            {isLoading
              ? "Loading events..."
              : "You haven't created any events yet."}
          </p>
          {!isLoading && (
            <Link
              href="/dashboard/events/create"
              className="inline-block mt-4 text-maroon hover:text-darkmaroon"
            >
              Create your first event
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    onClick={() => handleSort("name")}
                    className="px-6 py-4 text-left text-sm font-medium text-gray-600 tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Event <SortIndicator column="name" />
                  </th>
                  <th
                    onClick={() => handleSort("eventDate")}
                    className="px-6 py-4 text-left text-sm font-medium text-gray-600 tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Event Date <SortIndicator column="eventDate" />
                  </th>
                  <th
                    onClick={() => handleSort("lastModified")}
                    className="px-6 py-4 text-left text-sm font-medium text-gray-600 tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Last Modified <SortIndicator column="lastModified" />
                  </th>
                  <th
                    onClick={() => handleSort("status")}
                    className="px-6 py-4 text-left text-sm font-medium text-gray-600 tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Status <SortIndicator column="status" />
                  </th>
                  <th
                    onClick={() => handleSort("likes")}
                    className="px-6 py-4 text-left text-sm font-medium text-gray-600 tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Likes <SortIndicator column="likes" />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredEvents.map((event) => (
                  <tr
                    key={event.event_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <Link
                            href={`/events/${event.event_id}`}
                            className="text-base font-medium text-gray-900 hover:text-maroon"
                          >
                            {event.event_name}
                          </Link>
                          <div className="text-sm text-gray-500 mt-1">
                            {event.event_location || "No location"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(new Date(event.start_time))}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(new Date(event.start_time))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(new Date(event.date_modified))}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(new Date(event.date_modified))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={event.event_status ?? "published"}
                        onChange={(e) =>
                          handleStatusUpdate(
                            event.event_id,
                            e.target.value as EventStatus,
                          )
                        }
                        className={`px-2 py-1 text-xs font-semibold rounded-full border-0 ${getStatusColor(event.event_status ?? "published")}`}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">{event.event_saves}</td>
                    <td className="px-6 py-4">
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
