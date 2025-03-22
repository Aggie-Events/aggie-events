"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaLocationDot, FaArrowLeft, FaEnvelope } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import IconLabel from "@/components/common/IconLabel";
import { useOrgPageInformation } from "@/api/orgs";
import { OrgPageInformation } from "@/config/query-types";

export default function OrgPage() {
  const { orgParam } = useParams<{ orgParam: string }>();
  const { data: org, isLoading: isPending, isError } = useOrgPageInformation(orgParam);
  const router = useRouter();
  
  // Redirect to slug URL if organization is verified, has a slug, and current URL is using ID
  useEffect(() => {
    if (org && org.org_verified && org.org_slug && !isNaN(Number(orgParam))) {
      // Only redirect if we're currently using the ID in the URL
      router.replace(`/org/${org.org_slug}`);
    }
  }, [org, orgParam, router]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {isPending && <Loading />}
      {isError && <OrgNotFound />}
      {org && <OrgData org={org} />}
    </div>
  );
}

function OrgData({ org }: { org: OrgPageInformation }) {
  const router = useRouter();

  const handleBack = () => {
    if (document.referrer && new URL(document.referrer).origin === window.location.origin) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-600 hover:text-maroon mb-6 group transition-colors"
      >
        <FaArrowLeft className="text-lg transition-transform group-hover:-translate-x-1" />
        <span>Back</span>
      </button>

      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="bg-maroon h-3" />
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              {org.org_icon && (
                <img 
                  src={org.org_icon} 
                  alt={org.org_name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-4xl font-bold text-gray-900">{org.org_name}</h1>
                  {org.org_verified && (
                    <MdVerified className="text-maroon text-2xl" />
                  )}
                </div>
                <div className="text-gray-500">Reputation: {org.org_reputation}</div>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-maroon text-white rounded-full hover:bg-darkmaroon transition-colors">
              <FiEdit />
              <span>Edit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Organization Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Location & Contact Card */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Organization Details</h2>
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
            </div>
          </div>

          {/* Description Card */}
          {org.org_description && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About this Organization</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{org.org_description}</p>
            </div>
          )}
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-8">
          {/* Organization Stats Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Organization Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-maroon">0</p>
                <p className="text-sm text-gray-600">Events</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-maroon">0</p>
                <p className="text-sm text-gray-600">Members</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse space-y-4 w-full max-w-5xl">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

function OrgNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-5xl font-bold text-maroon mb-4">Organization Not Found</h1>
      <p className="text-gray-600 mb-8">The organization you're looking for doesn't exist or has been removed.</p>
      <button 
        onClick={() => window.history.back()}
        className="px-6 py-3 bg-maroon text-white rounded-full hover:bg-darkmaroon transition-colors"
      >
        Go Back
      </button>
    </div>
  );
}

