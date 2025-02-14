'use client';
import { useState } from 'react';
import { MdEdit, MdSchool, MdDescription, MdEventAvailable } from 'react-icons/md';
import Image from 'next/image';

export default function Profile() {
  // This would come from your auth/database in a real implementation
  const [user] = useState({
    user_name: "johndoe",
    user_displayname: "John Doe",
    user_email: "john@tamu.edu",
    user_major: "Computer Science",
    user_year: 2025,
    user_description: "Passionate about technology and event planning",
    user_profile_img: "/cat.webp"
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-32 h-32">
            <Image
              src={user.user_profile_img}
              alt="Profile"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">{user.user_displayname}</h1>
            <p className="text-gray-600 mb-2">@{user.user_name}</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                <MdSchool className="inline mr-1" />
                {user.user_major}
              </span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                Class of {user.user_year}
              </span>
            </div>
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition">
            <MdEdit />
            Edit Profile
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MdDescription />
              About
            </h2>
            <p className="text-gray-600">{user.user_description}</p>
          </div>
        </div>

        {/* Events Section */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MdEventAvailable />
              My Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* This would be populated from your database */}
              <div className="border rounded-lg p-4 hover:shadow-md transition">
                <h3 className="font-semibold">No events yet</h3>
                <p className="text-gray-600">Start by creating or joining an event!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
