"use client";
import { useState } from "react";
import { MdPerson, MdNotifications, MdSecurity, MdEdit } from 'react-icons/md';
import { useAuth } from "@/components/auth/AuthContext";
import AuthSuspense from "@/components/auth/AuthSuspense";
import Image from 'next/image'; 

interface SettingsForm {
  username: string;
  displayName: string;
  email: string;
  major: string;
  year: string;
  description: string;
  notifications: {
    email: boolean;
    push: boolean;
    friendRequests: boolean;
    eventReminders: boolean;
  };
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  return (
    <AuthSuspense>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md">
          <div className="grid md:grid-cols-[240px,1fr] divide-x">
            {/* Sidebar */}
            <div className="p-6 space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  activeTab === 'profile' ? 'bg-primary text-white' : 'hover:bg-gray-100'
                }`}
              >
                <MdPerson size={20} />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  activeTab === 'notifications' ? 'bg-primary text-white' : 'hover:bg-gray-100'
                }`}
              >
                <MdNotifications size={20} />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('account')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  activeTab === 'account' ? 'bg-primary text-white' : 'hover:bg-gray-100'
                }`}
              >
                <MdSecurity size={20} />
                Account
              </button>
            </div>

            {/* Main Content */}
            <div className="p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Profile Settings</h2>
                  
                  {/* Profile Picture */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24">
                      <Image
                        src={user?.user_img || "/cat.webp"}
                        alt="Profile"
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">Profile Picture</h3>
                      <p className="text-sm text-gray-600">
                        Upload a new profile picture
                      </p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        value={user?.user_name || ''}
                        className="w-full px-3 py-2 border rounded-md"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={user?.user_name || ''}
                        className="w-full px-3 py-2 border rounded-md"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Major
                      </label>
                      <input
                        type="text"
                        value={ ''}
                        className="w-full px-3 py-2 border rounded-md"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Graduation Year
                      </label>
                      <input
                        type="text"
                        value={''}
                        className="w-full px-3 py-2 border rounded-md"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        value={''}
                        className="w-full px-3 py-2 border rounded-md"
                        rows={4}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Notification Preferences</h2>
                  <div className="space-y-4">
                    {Object.entries({
                      email: true,
                      push: true,
                      friendRequests: true,
                      eventReminders: true,
                    }).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span>{value ? 'Enabled' : 'Disabled'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'account' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Account Settings</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.user_email || ''}
                      className="w-full px-3 py-2 border rounded-md"
                      readOnly
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthSuspense>
  );
}
