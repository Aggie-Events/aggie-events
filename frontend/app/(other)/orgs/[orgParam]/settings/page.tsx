"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaSave, FaTrash, FaUpload } from "react-icons/fa";
import { useOrgPageInformation } from "@/api/orgs";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function OrgSettingsPage() {
  const { orgParam } = useParams<{ orgParam: string }>();
  const router = useRouter();
  const { data: org, isLoading, isError } = useOrgPageInformation(orgParam as string);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    building: "",
    room: "",
    icon: null as File | null
  });
  
  // Load data into form when it's available
  useEffect(() => {
    if (org) {
      setFormData({
        name: org.org_name || "",
        description: org.org_description || "",
        email: org.org_email || "",
        building: org.org_building || "",
        room: org.org_room || "",
        icon: null
      });
    }
  }, [org]);
  
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
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, icon: e.target.files?.[0] || null }));
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would implement the actual API call to update the organization
    alert("Organization settings would be updated here.");
  };
  
  // Handle organization deletion
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this organization? This action cannot be undone.")) {
      // Here you would implement the actual API call to delete the organization
      alert("Organization would be deleted here.");
      router.push("/dashboard/orgs");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Organization Settings</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">Basic Information</h3>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Organization Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">Location Information</h3>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-1">
                    Building
                  </label>
                  <input
                    type="text"
                    id="building"
                    name="building"
                    value={formData.building}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-1">
                    Room
                  </label>
                  <input
                    type="text"
                    id="room"
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            {/* Organization Icon */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">Organization Icon</h3>
              
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                  {org.org_icon ? (
                    <img 
                      src={org.org_icon} 
                      alt={org.org_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-semibold text-maroon">
                      {org.org_name.charAt(0)}
                    </span>
                  )}
                </div>
                
                <div>
                  <label htmlFor="icon" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors cursor-pointer">
                    <FaUpload />
                    <span>Upload new icon</span>
                    <input
                      type="file"
                      id="icon"
                      name="icon"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                  {formData.icon && (
                    <p className="mt-2 text-sm text-gray-600">Selected: {formData.icon.name}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors"
              >
                <FaTrash />
                <span>Delete Organization</span>
              </button>
              
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2 bg-maroon text-white rounded-md hover:bg-darkmaroon transition-colors"
              >
                <FaSave />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 