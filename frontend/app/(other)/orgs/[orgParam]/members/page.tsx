"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { FaSearch, FaUsers, FaCrown, FaUserCog } from "react-icons/fa";
import { useOrgPageInformation } from "@/api/orgs";
import LoadingSpinner from "@/components/common/LoadingSpinner";

// Temporary member type for demonstration
type Member = {
  id: string;
  name: string;
  avatar: string | null;
  role: 'owner' | 'admin' | 'member';
  joinDate: string;
};

export default function OrgMembersPage() {
  const { orgParam } = useParams<{ orgParam: string }>();
  const { data: org, isLoading, isError } = useOrgPageInformation(orgParam as string);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock members data for demonstration
  const mockMembers: Member[] = [
    {
      id: "1",
      name: "John Doe",
      avatar: null,
      role: "owner",
      joinDate: "2023-01-15"
    },
    {
      id: "2",
      name: "Jane Smith",
      avatar: null,
      role: "admin",
      joinDate: "2023-02-20"
    },
    {
      id: "3",
      name: "Alex Johnson",
      avatar: null,
      role: "member",
      joinDate: "2023-03-10"
    }
  ];
  
  // Filter members based on search query
  const filteredMembers = mockMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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

  // Render role badge with appropriate icon
  const getRoleBadge = (role: Member['role']) => {
    switch (role) {
      case 'owner':
        return (
          <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
            <FaCrown className="text-yellow-500" />
            Owner
          </span>
        );
      case 'admin':
        return (
          <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            <FaUserCog />
            Admin
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
            Member
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Search and Header Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-2">
            <FaUsers className="text-xl text-maroon" />
            <h2 className="text-xl font-semibold text-gray-900">Members</h2>
          </div>
          <div className="relative w-full md:w-auto md:min-w-[300px]">
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredMembers.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredMembers.map((member) => (
              <div key={member.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-semibold text-maroon">
                        {member.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                      {getRoleBadge(member.role)}
                    </div>
                    <p className="text-sm text-gray-500">
                      Joined {new Date(member.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <button className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <FaUsers className="text-5xl text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No members found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchQuery 
                ? `No members match your search query "${searchQuery}".` 
                : "This organization doesn't have any members yet."}
            </p>
          </div>
        )}
      </div>
      
      {/* Join Button (for non-members) */}
      <div className="flex justify-center mt-4">
        <button className="px-6 py-2 bg-maroon text-white rounded-md hover:bg-darkmaroon transition-colors">
          Join Organization
        </button>
      </div>
    </div>
  );
} 