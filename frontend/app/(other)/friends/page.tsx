'use client';
import { useState } from 'react';
import Image from 'next/image';
import { MdPersonAdd, MdCheck, MdClose, MdSchool } from 'react-icons/md';

interface Friend {
  user_id: number;
  user_name: string;
  user_displayname: string;
  user_profile_img: string;
  user_major?: string;
  friendship_status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  is_incoming?: boolean;
}

export default function FriendsPage() {
  // This would come from your API in a real implementation
  const [friends] = useState<Friend[]>([
    {
      user_id: 1,
      user_name: "sarah_smith",
      user_displayname: "Sarah Smith",
      user_profile_img: "/cat.webp",
      user_major: "Computer Engineering",
      friendship_status: "accepted"
    },
    {
      user_id: 2,
      user_name: "mike_jones",
      user_displayname: "Mike Jones",
      user_profile_img: "/cat.webp",
      user_major: "Mechanical Engineering",
      friendship_status: "pending",
      is_incoming: true
    }
  ]);

  const pendingRequests = friends.filter(f => f.friendship_status === 'pending');
  const currentFriends = friends.filter(f => f.friendship_status === 'accepted');

  const FriendCard = ({ friend }: { friend: Friend }) => (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4">
      <div className="relative w-16 h-16">
        <Image
          src={friend.user_profile_img}
          alt={friend.user_displayname}
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold">{friend.user_displayname}</h3>
        <p className="text-gray-600 text-sm">@{friend.user_name}</p>
        {friend.user_major && (
          <span className="inline-flex items-center text-sm text-gray-600">
            <MdSchool className="mr-1" />
            {friend.user_major}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        {friend.friendship_status === 'pending' ? (
          friend.is_incoming ? (
            <>
              <button className="bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition">
                <MdCheck size={20} />
              </button>
              <button className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition">
                <MdClose size={20} />
              </button>
            </>
          ) : (
            <span className="text-sm text-gray-600">Pending...</span>
          )
        ) : (
          <button className="text-gray-600 hover:text-gray-800 transition">
            Message
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Friend Requests Section */}
      {pendingRequests.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Friend Requests</h2>
          <div className="grid gap-4">
            {pendingRequests.map(friend => (
              <FriendCard key={friend.user_id} friend={friend} />
            ))}
          </div>
        </section>
      )}

      {/* Current Friends Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Friends</h2>
        {currentFriends.length > 0 ? (
          <div className="grid gap-4">
            {currentFriends.map(friend => (
              <FriendCard key={friend.user_id} friend={friend} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 mb-4">You haven't added any friends yet!</p>
            <button className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 mx-auto hover:bg-primary/90 transition">
              <MdPersonAdd />
              Find Friends
            </button>
          </div>
        )}
      </section>

      {/* Friend Suggestions */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Suggested Friends</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">
            Friend suggestions will be based on your major and organizations.
          </p>
        </div>
      </section>
    </div>
  );
}
