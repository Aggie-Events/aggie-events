"use client";
import { useParams } from "next/navigation";
import { UserProfile } from "@/api/user";
import EventCard from "@/app/search/_components/event-display/EventCard";
import Image from "next/image";
import Link from "next/link";
import { useUserProfile } from "@/api/user";
import { FaArrowLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const { username } = useParams<{ username: string }>();
  const { data: userData, isPending, isError } = useUserProfile(username);

  return (
    <div className="min-h-screen bg-gray-50">
      {isPending && <Loading />}
      {isError && <UserNotFound />}
      {userData && <UserData userData={userData} />}
    </div>
  );
}

function UserData({ userData }: { userData: UserProfile }) {
  const router = useRouter();

  const handleBack = () => {
    if (document.referrer && new URL(document.referrer).origin === window.location.origin) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-600 hover:text-maroon mb-6 group transition-colors"
      >
        <FaArrowLeft className="text-lg transition-transform group-hover:-translate-x-1" />
        <span>Back</span>
      </button>

      {/* User Profile Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden">
            {userData.user_profile_img ? (
              <Image
                src={userData.user_profile_img}
                alt={userData.user_displayname}
                width={128}
                height={128}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                {userData.user_displayname[0].toUpperCase()}
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {userData.user_displayname}
              {userData.user_verified && (
                <span className="ml-2 text-blue-500">✓</span>
              )}
            </h1>
            {userData.user_name && (
              <p className="text-gray-600 mb-2">@{userData.user_name}</p>
            )}
            {userData.user_major && (
              <p className="text-gray-600">
                {userData.user_major}
                {userData.user_year && ` • Year ${userData.user_year}`}
              </p>
            )}
          </div>
        </div>

        {userData.user_description && (
          <p className="mt-4 text-gray-700">{userData.user_description}</p>
        )}

        {/* Organizations Section */}
        {userData.organizations.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Organizations</h2>
            <div className="flex flex-wrap gap-3">
              {userData.organizations.map((org) => (
                <Link
                  key={org.org_id}
                  href={`/org/${org.org_id}`}
                  className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 hover:bg-gray-200 transition-colors"
                >
                  {org.org_icon && (
                    <Image
                      src={org.org_icon}
                      alt={org.org_name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  )}
                  <span>{org.org_name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User's Events Section */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Events Added by {userData.user_displayname}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userData.events.length > 0 ? (
          userData.events.map((event) => (
            <EventCard 
              key={event.event_id} 
              event={event}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-8">
            No events added yet.
          </div>
        )}
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-maroon border-t-transparent rounded-full animate-spin" />
      <p className="mt-4 text-gray-600">Loading user profile...</p>
    </div>
  );
}

function UserNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-5xl font-bold text-maroon mb-4">User Not Found</h1>
      <p className="text-gray-600 mb-8">The user you're looking for doesn't exist or has been removed.</p>
      <button 
        onClick={() => window.history.back()}
        className="px-6 py-3 bg-maroon text-white rounded-full hover:bg-darkmaroon transition-colors"
      >
        Go Back
      </button>
    </div>
  );
}

