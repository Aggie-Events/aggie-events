"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { FaSearch, FaUsers, FaCrown, FaUserCog, FaGraduationCap, FaCalendarAlt, FaFilter, FaSortAmountDown } from "react-icons/fa";
import { useOrgPageInformation, useOrgMembers } from "@/api/orgs";
import LoadingSpinner from "@/components/common/LoadingSpinner";

// Format date helper
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function OrgMembersPage() {
  const { orgParam } = useParams<{ orgParam: string }>();
  const { data: org, isLoading: orgLoading, isError } = useOrgPageInformation(orgParam as string);
  const { data: members = [], isLoading: membersLoading } = useOrgMembers(org?.org_id ?? 0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "joined" | "role">("joined");
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter members based on search query and role filter
  const filteredMembers = members.filter(member =>
    (!searchQuery || 
      member.user_displayname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.user_name && member.user_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (member.user_major && member.user_major.toLowerCase().includes(searchQuery.toLowerCase()))
    ) && 
    (!filterRole || member.user_role === filterRole)
  );
  
  // Sort members
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.user_displayname.localeCompare(b.user_displayname);
      case "role":
        // Sort owners first, then editors
        if (a.user_role === "owner" && b.user_role !== "owner") return -1;
        if (a.user_role !== "owner" && b.user_role === "owner") return 1;
        return a.user_displayname.localeCompare(b.user_displayname);
      case "joined":
      default:
        // Sort by join date (newest first)
        return new Date(b.join_date).getTime() - new Date(a.join_date).getTime();
    }
  });
  
  const isLoading = orgLoading || membersLoading;
  
  // Count members by role
  const ownerCount = members.filter(m => m.user_role === "owner").length;
  const editorCount = members.filter(m => m.user_role === "editor").length;
  
  if (orgLoading) {
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
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return (
          <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
            <FaCrown className="text-yellow-500" />
            Owner
          </span>
        );
      case 'editor':
        return (
          <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            <FaUserCog />
            Editor
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

  const formatStudentInfo = (member: any) => {
    const parts = [];
    if (member.user_major) parts.push(member.user_major);
    if (member.user_year) parts.push(`Class of ${member.user_year}`);
    return parts.join(' • ');
  };

  return (
    <div className="space-y-8 mb-10 px-2 sm:px-4 md:px-8 lg:px-12">
      {/* Page Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {/* Sidebar - Stats & Filters */}
        <div className={`md:block ${showFilters ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
            <h2 className="text-lg font-semibold mb-4">Member Stats</h2>
            
            {/* Statistics */}
            <div className="space-y-3 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Total Members</div>
                <div className="text-2xl font-bold text-gray-900">{members.length}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-sm text-purple-600">Owners</div>
                  <div className="text-xl font-bold text-purple-800">{ownerCount}</div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm text-blue-600">Editors</div>
                  <div className="text-xl font-bold text-blue-800">{editorCount}</div>
                </div>
              </div>
            </div>
            
            {/* Filters */}
            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-700 mb-3">Filter by Role</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setFilterRole(null)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${filterRole === null ? 'bg-maroon text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  All Members
                </button>
                <button 
                  onClick={() => setFilterRole("owner")}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${filterRole === "owner" ? 'bg-maroon text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Owners Only
                </button>
                <button 
                  onClick={() => setFilterRole("editor")}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${filterRole === "editor" ? 'bg-maroon text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Editors Only
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-3 lg:col-span-4">
          {/* Header and Controls */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="bg-maroon bg-opacity-10 p-2 rounded-full">
                    <FaUsers className="text-xl text-maroon" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Members</h2>
                  <button 
                    onClick={() => setShowFilters(!showFilters)} 
                    className="md:hidden px-3 py-1 text-sm bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200"
                  >
                    <FaFilter className="inline mr-1" />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
                  {/* Search */}
                  <div className="relative w-full sm:w-60">
                    <input
                      type="text"
                      placeholder="Search members..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-2 px-4 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  
                  {/* Sort dropdown */}
                  <div className="w-full sm:w-auto">
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full py-2 pl-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent appearance-none bg-white"
                    >
                      <option value="joined">Sort by: Latest Joined</option>
                      <option value="name">Sort by: Name</option>
                      <option value="role">Sort by: Role</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Filters active message */}
              {filterRole && (
                <div className="mt-4 flex items-center text-sm text-gray-600">
                  <FaFilter className="mr-2 text-maroon" />
                  <span>
                    Showing only <strong>{filterRole === "owner" ? "owners" : "editors"}</strong> •&nbsp;
                    <button 
                      onClick={() => setFilterRole(null)}
                      className="text-maroon hover:underline"
                    >
                      Clear filter
                    </button>
                  </span>
                </div>
              )}
            </div>
            
            {/* Members Grid */}
            {membersLoading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
              </div>
            ) : sortedMembers.length > 0 ? (
              <div className="p-6 space-y-4">
                {sortedMembers.map((member) => (
                  <div 
                    key={member.user_id} 
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                        member.user_role === 'owner' ? 'bg-purple-100' : 'bg-gray-100'
                      }`}>
                        {member.user_profile_img ? (
                          <img
                            src={member.user_profile_img}
                            alt={member.user_displayname}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-xl font-semibold text-maroon">
                            {member.user_displayname.charAt(0)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-gray-900">{member.user_displayname}</h3>
                          {getRoleBadge(member.user_role)}
                          {member.user_name && (
                            <span className="text-xs text-gray-500">@{member.user_name}</span>
                          )}
                        </div>
                        
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                          {formatStudentInfo(member) && (
                            <div className="flex items-center gap-1.5">
                              <FaGraduationCap className="text-maroon flex-shrink-0" />
                              <span>{formatStudentInfo(member)}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-1.5">
                            <FaCalendarAlt className="text-maroon flex-shrink-0" />
                            <span>Joined {formatDate(new Date(member.join_date))}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 sm:mt-0 flex justify-end">
                        <a 
                          href={`/users/${member.user_name}`} 
                          className="px-4 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          View Profile
                        </a>
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
                  {searchQuery || filterRole
                    ? `No members match your search criteria. Try different filters.` 
                    : "This organization doesn't have any members yet."}
                </p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
} 