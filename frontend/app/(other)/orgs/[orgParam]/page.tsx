"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { FaEnvelope, FaCalendarAlt, FaUsers, FaLink, FaRegCalendar, FaRegClock, FaMapMarkerAlt } from "react-icons/fa";
import { FaRegBookmark, FaArrowUpRightFromSquare, FaLocationDot } from "react-icons/fa6";
import { MdVerified, MdAdd, MdOutlineEventAvailable } from "react-icons/md";
import IconLabel from "@/components/common/IconLabel";
import { useOrgPageInformation } from "@/api/orgs";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Link from "next/link";

// Define types for our events
interface EventItem {
  id: string;
  title: string;
  date: Date;
  location: string;
  image: string;
  category: string;
  isFree?: boolean;
  price?: string;
}

export default function OrgPage() {
  const { orgParam } = useParams<{ orgParam: string }>();
  const { data: org, isLoading, isError } = useOrgPageInformation(orgParam as string);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth());
  const [activeYear, setActiveYear] = useState(new Date().getFullYear());
  
  // Mock upcoming events - in real app, these would come from an API
  const upcomingEvents: EventItem[] = [
    {
      id: "1",
      title: "Weekly Member Meeting",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      location: "MSC 2400",
      image: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=2787&auto=format&fit=crop",
      category: "Meeting",
      isFree: true
    },
    {
      id: "2",
      title: "Spring Fundraising Gala",
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      location: "Rudder Auditorium",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop",
      category: "Fundraiser",
      isFree: false,
      price: "$25"
    },
    {
      id: "3",
      title: "Professional Development Workshop",
      date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      location: "ILCB 1108",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
      category: "Workshop",
      isFree: true
    }
  ];
  
  const pastEvents: EventItem[] = [
    {
      id: "4",
      title: "End of Semester Celebration",
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      location: "Wolf Pen Creek",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop",
      category: "Social"
    },
    {
      id: "5",
      title: "Guest Speaker Series",
      date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      location: "Zachry 101",
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2070&auto=format&fit=crop",
      category: "Speaker"
    }
  ];
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (isError || !org) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-2xl font-bold text-maroon mb-4">Organization Not Found</h1>
        <p className="text-gray-600">The organization you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };
  
  // Get days in month for calendar
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };
  
  // Generate calendar grid
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(activeYear, activeMonth);
    const firstDay = getFirstDayOfMonth(activeYear, activeMonth);
    const days = [];
    
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };
  
  // Get events for a specific day
  const getEventsForDay = (day: number | null): EventItem[] => {
    if (day === null) return [];
    
    const date = new Date(activeYear, activeMonth, day);
    return upcomingEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === activeMonth && 
             eventDate.getFullYear() === activeYear;
    });
  };
  
  // Get month name
  const getMonthName = (month: number): string => {
    return new Date(0, month).toLocaleString('default', { month: 'long' });
  };
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    if (activeMonth === 0) {
      setActiveMonth(11);
      setActiveYear(activeYear - 1);
    } else {
      setActiveMonth(activeMonth - 1);
    }
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    if (activeMonth === 11) {
      setActiveMonth(0);
      setActiveYear(activeYear + 1);
    } else {
      setActiveMonth(activeMonth + 1);
    }
  };
  
  const calendarDays = generateCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Count total upcoming events
  const totalUpcomingEvents = upcomingEvents.length;

  return (
    <div className="container mx-auto max-w-6xl px-4">
      {/* Calendar Section */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900">{getMonthName(activeMonth)} {activeYear}</h2>
              <div className="bg-maroon/10 text-maroon px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1.5">
                <MdOutlineEventAvailable />
                <span>{totalUpcomingEvents} Upcoming Events</span>
          </div>
        </div>

            <div className="flex gap-2">
              <button 
                onClick={goToPreviousMonth}
                className="p-2 rounded hover:bg-gray-100 transition-colors"
                aria-label="Previous month"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={goToNextMonth}
                className="p-2 rounded hover:bg-gray-100 transition-colors"
                aria-label="Next month"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map((day, index) => (
              <div key={index} className="py-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const eventsForDay = getEventsForDay(day);
              const hasEvents = eventsForDay.length > 0;
              const isToday = day === new Date().getDate() && 
                              activeMonth === new Date().getMonth() && 
                              activeYear === new Date().getFullYear();
              
              return (
                <div 
                  key={index} 
                  className={`min-h-[5rem] border ${day === null ? 'border-transparent bg-gray-50/50' : 'border-gray-100 hover:border-maroon/30 hover:bg-maroon/5'} rounded-md p-1.5 transition-colors overflow-hidden relative ${isToday ? 'ring-1 ring-maroon' : ''}`}
                >
                  {day !== null && (
                    <>
                      <div className={`text-right ${isToday ? 'font-bold text-maroon' : 'text-gray-700'}`}>
                        {day}
                      </div>
                      
                      {hasEvents && (
                        <div className="mt-1">
                          {eventsForDay.slice(0, 2).map((event, i) => (
                            <Link 
                              href={`/events/${event.id}`}
                              key={i} 
                              className="bg-maroon/10 text-maroon text-xs py-1 px-1.5 rounded mt-1 truncate block hover:bg-maroon/20 transition-colors"
                            >
                              {event.title}
                            </Link>
                          ))}
                          
                          {eventsForDay.length > 2 && (
                            <div className="text-xs text-maroon mt-1 text-center font-medium">
                              +{eventsForDay.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Events List Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Events Listing */}
        <div className="lg:w-2/3">
          {/* Tabs Navigation */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="flex border-b border-gray-200">
              <button 
                className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${activeTab === "upcoming" ? "text-maroon border-b-2 border-maroon" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("upcoming")}
              >
                Upcoming Events
              </button>
              <button 
                className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${activeTab === "past" ? "text-maroon border-b-2 border-maroon" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("past")}
              >
                Past Events
              </button>
            </div>
          </div>
          
          {/* Events Grid */}
          {activeTab === "upcoming" ? (
            upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow transition-shadow">
                    <div className="flex flex-col md:flex-row">
                      {/* Event Image */}
                      <div className="md:w-1/4 h-48 md:h-auto relative">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                        <div className="absolute top-0 right-0 bg-white/90 backdrop-blur-sm m-2 px-3 py-1 rounded-md text-xs font-semibold">
                          {event.isFree ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            <span className="text-maroon">{event.price}</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Event Details */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <span className="inline-block bg-maroon/10 text-maroon px-3 py-1 rounded-md text-xs font-medium">
                              {event.category}
                            </span>
                            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                              <FaRegCalendar className="text-maroon" />
                              <span>{formatDate(event.date).split(',')[0]}</span>
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">{event.title}</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <div className="bg-gray-100 p-1.5 rounded-full">
                                <FaRegClock className="text-maroon" />
                              </div>
                              <span>{formatTime(event.date)}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="bg-gray-100 p-1.5 rounded-full">
                                <FaMapMarkerAlt className="text-maroon" />
                              </div>
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-sm text-gray-500">By {org.org_name}</span>
                          <Link href={`/events/${event.id}`} className="flex items-center gap-1 text-maroon hover:underline font-medium">
                            <span>View Details</span>
                            <FaArrowUpRightFromSquare className="text-xs" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <FaCalendarAlt className="text-4xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No upcoming events</p>
                <p className="text-sm text-gray-500 mt-1">Check back later for new events</p>
              </div>
            )
          ) : (
            pastEvents.length > 0 ? (
              <div className="space-y-4">
                {pastEvents.map(event => (
                  <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow transition-shadow">
                    <div className="flex flex-col md:flex-row">
                      {/* Event Image with Overlay */}
                      <div className="md:w-1/4 h-48 md:h-auto relative">
                        <div className="absolute inset-0 bg-black/20 z-10"></div>
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                        <div className="absolute top-0 right-0 bg-gray-800/80 m-2 px-3 py-1 rounded-md text-xs font-semibold text-white">
                          Past Event
                        </div>
                      </div>
                      
                      {/* Event Details */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-xs font-medium">
                              {event.category}
                            </span>
                            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                              <FaRegCalendar className="text-gray-400" />
                              <span>{formatDate(event.date).split(',')[0]}</span>
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-semibold text-gray-700 mb-3">{event.title}</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <div className="bg-gray-100 p-1.5 rounded-full">
                                <FaRegClock className="text-gray-400" />
                              </div>
                              <span>{formatTime(event.date)}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="bg-gray-100 p-1.5 rounded-full">
                                <FaMapMarkerAlt className="text-gray-400" />
                              </div>
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-sm text-gray-500">By {org.org_name}</span>
                          <Link href={`/events/${event.id}`} className="flex items-center gap-1 text-maroon hover:underline font-medium">
                            <span>View Details</span>
                            <FaArrowUpRightFromSquare className="text-xs" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <FaCalendarAlt className="text-4xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No past events</p>
              </div>
            )
          )}
        </div>
        
        {/* Right Column - Sidebar */}
        <div className="lg:w-1/3 space-y-5">
          {/* Submit Event Button */}
          <Link 
            href="/dashboard/events/create" 
            className="w-full bg-maroon hover:bg-darkmaroon text-white rounded-lg py-3 px-6 font-medium transition-colors flex items-center justify-center gap-2"
          >
            <MdAdd size={20} />
            <span>Submit New Event</span>
          </Link>
          
          {/* Organization Info */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">About Organization</h2>
            </div>
            <div className="p-5">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <FaUsers className="text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{org.org_name}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                    {org.org_description || "No description available."}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 border-t border-gray-100 pt-4">
                {(org.org_building || org.org_room) && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <FaLocationDot className="text-maroon" />
                    </div>
                    <div>
                      <div className="font-medium">{org.org_building}{org.org_room ? `, Room ${org.org_room}` : ''}</div>
                    </div>
                  </div>
                )}
                
                {org.org_email && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <FaEnvelope className="text-maroon" />
                    </div>
                    <div>
                      <a href={`mailto:${org.org_email}`} className="font-medium hover:underline">{org.org_email}</a>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-5">
                <Link href={`/orgs/${orgParam}/about`} className="text-maroon font-medium hover:underline text-sm">
                  View full organization profile
                </Link>
              </div>
            </div>
          </div>
          
          {/* Organization Stats Card */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Stats & Details</h2>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <span className="block text-2xl font-bold text-maroon">{upcomingEvents.length + pastEvents.length}</span>
                  <span className="text-sm text-gray-600">Total Events</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <span className="block text-2xl font-bold text-maroon">{org.org_reputation}</span>
                  <span className="text-sm text-gray-600">Reputation</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <span className="block text-2xl font-bold text-maroon">0</span>
                  <span className="text-sm text-gray-600">Followers</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <span className="block text-2xl font-bold text-maroon">0</span>
                  <span className="text-sm text-gray-600">Members</span>
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}

