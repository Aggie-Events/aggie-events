"use client";
import React from "react";
import { useParams } from "next/navigation";
import { FaEnvelope, FaCalendarAlt, FaUsers, FaLink } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";
import IconLabel from "@/components/common/IconLabel";
import { useOrgPageInformation } from "@/api/orgs";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function OrgPage() {
  const { orgParam } = useParams<{ orgParam: string }>();
  const { data: org, isLoading, isError } = useOrgPageInformation(orgParam as string);
  
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Organization Overview */}
      <div className="lg:col-span-2 space-y-8">
        {/* About Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-gray-900">About</h2>
          </div>
          {org.org_description ? (
            <div className="prose max-w-none text-gray-600">
              <p className="whitespace-pre-wrap">{org.org_description}</p>
            </div>
          ) : (
            <p className="text-gray-500 italic">No description available.</p>
          )}
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-4">
            {(org.org_building || org.org_room) && (
              <IconLabel
                text={`${org.org_building}${org.org_room ? `, Room ${org.org_room}` : ''}`}
                className="flex items-center gap-3 text-gray-700"
              >
                <FaLocationDot className="text-xl text-maroon" />
              </IconLabel>
            )}
            {org.org_email && (
              <IconLabel 
                text={org.org_email}
                className="flex items-center gap-3 text-gray-700"
              >
                <FaEnvelope className="text-xl text-maroon" />
              </IconLabel>
            )}
            {/* Placeholder for website */}
            <IconLabel 
              text="N/A"
              className="flex items-center gap-3 text-gray-400"
            >
              <FaLink className="text-xl text-gray-300" />
            </IconLabel>
          </div>
        </div>

        {/* Upcoming Events Preview */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
            <a href={`/orgs/${orgParam}/events`} className="text-maroon hover:underline text-sm font-medium">
              See All Events
            </a>
          </div>
          <div className="text-center py-8 text-gray-500">
            <FaCalendarAlt className="text-4xl text-gray-300 mx-auto mb-2" />
            <p>No upcoming events</p>
          </div>
        </div>
      </div>

      {/* Right Column - Stats */}
      <div className="space-y-8">
        {/* Organization Stats Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Organization Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Reputation</span>
              <span className="font-medium">{org.org_reputation}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Events</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Followers</span>
              <span className="font-medium">0</span>
            </div>
          </div>
        </div>
        
        {/* Members Preview */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Members</h2>
          <div className="text-center py-6 text-gray-500">
            <FaUsers className="text-4xl text-gray-300 mx-auto mb-2" />
            <p>No members to display</p>
          </div>
        </div>
      </div>
    </div>
  );
}

