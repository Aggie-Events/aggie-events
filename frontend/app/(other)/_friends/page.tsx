'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  MdPersonAdd, 
  MdCheck, 
  MdClose, 
  MdSchool, 
  MdPerson, 
  MdPersonSearch, 
  MdMessage, 
  MdMoreVert
} from 'react-icons/md';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface Friend {
  user_id: number;
  user_name: string;
  user_displayname: string;
  user_profile_img: string;
  user_major?: string;
  user_year?: number;
  friendship_status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  is_incoming?: boolean;
  date_added?: string;
}

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'requests'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate API fetch delay
    const loadFriends = async () => {
      setIsLoading(true);
      try {
        // This would be replaced with an actual API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        setFriends([
          {
            user_id: 1,
            user_name: "sarah_smith",
            user_displayname: "Sarah Smith",
            user_profile_img: "/cat.webp",
            user_major: "Computer Engineering",
            user_year: 3,
            friendship_status: "accepted",
            date_added: "2023-01-15T10:30:00Z"
          },
          {
            user_id: 2,
            user_name: "mike_jones",
            user_displayname: "Mike Jones",
            user_profile_img: "/cat.webp",
            user_major: "Mechanical Engineering",
            user_year: 2,
            friendship_status: "pending",
            is_incoming: true,
            date_added: "2023-03-20T14:15:00Z"
          },
          {
            user_id: 3,
            user_name: "alex_williams",
            user_displayname: "Alex Williams",
            user_profile_img: "/cat.webp",
            user_major: "Biology",
            user_year: 4,
            friendship_status: "accepted",
            date_added: "2022-11-05T09:45:00Z"
          },
          {
            user_id: 4,
            user_name: "jamie_rodriguez",
            user_displayname: "Jamie Rodriguez",
            user_profile_img: "/cat.webp",
            user_major: "Computer Science",
            user_year: 3,
            friendship_status: "pending",
            is_incoming: false,
            date_added: "2023-04-02T16:20:00Z"
          },
          {
            user_id: 5,
            user_name: "taylor_johnson",
            user_displayname: "Taylor Johnson",
            user_profile_img: "/cat.webp",
            user_major: "Electrical Engineering",
            user_year: 2,
            friendship_status: "accepted",
            date_added: "2023-02-10T11:30:00Z"
          }
        ]);
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFriends();
  }, []);

  // Filter functions
  const pendingRequests = friends.filter(f => 
    f.friendship_status === 'pending' && f.is_incoming
  );
  
  const outgoingRequests = friends.filter(f => 
    f.friendship_status === 'pending' && !f.is_incoming
  );
  
  const currentFriends = friends.filter(f => 
    f.friendship_status === 'accepted'
  );

  // Search filter
  const filteredFriends = currentFriends.filter(friend =>
    friend.user_displayname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (friend.user_major && friend.user_major.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Action handlers
  const acceptFriendRequest = (userId: number) => {
    setFriends(friends.map(friend => 
      friend.user_id === userId 
        ? { ...friend, friendship_status: 'accepted', is_incoming: undefined } 
        : friend
    ));
  };

  const rejectFriendRequest = (userId: number) => {
    setFriends(friends.map(friend => 
      friend.user_id === userId 
        ? { ...friend, friendship_status: 'rejected', is_incoming: undefined } 
        : friend
    ));
  };

  const cancelFriendRequest = (userId: number) => {
    setFriends(friends.filter(friend => friend.user_id !== userId));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const FriendRequestCard = ({ friend }: { friend: Friend }) => (
    <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
      <div className="relative w-14 h-14 flex-shrink-0">
        <Image
          src={friend.user_profile_img || "/placeholder-profile.jpg"}
          alt={friend.user_displayname}
          fill
          className="rounded-full object-cover border border-gray-200"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{friend.user_displayname}</h3>
        <p className="text-gray-600 text-sm">@{friend.user_name}</p>
        {friend.user_major && (
          <div className="inline-flex items-center text-sm text-gray-600 mt-1">
            <MdSchool className="mr-1" />
            {friend.user_major}
            {friend.user_year && <span className="ml-1">(Year {friend.user_year})</span>}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => acceptFriendRequest(friend.user_id)}
          className="bg-maroon text-white p-2 rounded-full hover:bg-maroon/90 transition"
          title="Accept request"
        >
          <MdCheck size={20} />
        </button>
        <button 
          onClick={() => rejectFriendRequest(friend.user_id)}
          className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition"
          title="Reject request"
        >
          <MdClose size={20} />
        </button>
      </div>
    </div>
  );

  const OutgoingRequestCard = ({ friend }: { friend: Friend }) => (
    <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
      <div className="relative w-14 h-14 flex-shrink-0">
        <Image
          src={friend.user_profile_img || "/placeholder-profile.jpg"}
          alt={friend.user_displayname}
          fill
          className="rounded-full object-cover border border-gray-200"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{friend.user_displayname}</h3>
        <p className="text-gray-600 text-sm">@{friend.user_name}</p>
        {friend.user_major && (
          <div className="inline-flex items-center text-sm text-gray-600 mt-1">
            <MdSchool className="mr-1" />
            {friend.user_major}
          </div>
        )}
      </div>
      <div className="flex items-center">
        <span className="text-amber-600 text-sm mr-3">Request sent</span>
        <button 
          onClick={() => cancelFriendRequest(friend.user_id)}
          className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition"
          title="Cancel request"
        >
          <MdClose size={20} />
        </button>
      </div>
    </div>
  );

  const FriendCard = ({ friend }: { friend: Friend }) => (
    <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
      <div className="relative w-14 h-14 flex-shrink-0">
        <Image
          src={friend.user_profile_img || "/placeholder-profile.jpg"}
          alt={friend.user_displayname}
          fill
          className="rounded-full object-cover border border-gray-200"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{friend.user_displayname}</h3>
        <p className="text-gray-600 text-sm">@{friend.user_name}</p>
        <div className="flex flex-wrap gap-x-4 mt-1">
          {friend.user_major && (
            <div className="inline-flex items-center text-sm text-gray-600">
              <MdSchool className="mr-1" />
              {friend.user_major}
              {friend.user_year && <span className="ml-1">(Year {friend.user_year})</span>}
            </div>
          )}
          {friend.date_added && (
            <div className="text-xs text-gray-500">
              Friends since {formatDate(friend.date_added)}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <button 
          className="bg-maroon text-white p-2 rounded-full hover:bg-maroon/90 transition"
          title="Send message"
        >
          <MdMessage size={20} />
        </button>
        <button 
          className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition"
          title="More options"
        >
          <MdMoreVert size={20} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MdPerson className="text-maroon" />
          Friends
        </h1>
        
        <button className="flex items-center gap-1 px-3 py-1 text-sm bg-maroon text-white rounded-md hover:bg-maroon/90 transition-colors">
          <MdPersonAdd size={16} />
          Add Friend
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button 
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            activeTab === 'all' 
              ? 'border-maroon text-maroon' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          All Friends
        </button>
        <button 
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 border-b-2 font-medium text-sm flex items-center gap-1 ${
            activeTab === 'requests' 
              ? 'border-maroon text-maroon' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Friend Requests
          {pendingRequests.length > 0 && (
            <span className="ml-1 bg-maroon text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {pendingRequests.length}
            </span>
          )}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner />
        </div>
      ) : activeTab === 'all' ? (
        <>
          {/* Search */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdPersonSearch className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search friends by name or major..."
              className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-maroon focus:border-maroon transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Friends Count */}
          <div className="mb-4 text-sm text-gray-500">
            {filteredFriends.length > 0 ? (
              <p>Showing {filteredFriends.length} friend{filteredFriends.length !== 1 ? 's' : ''}</p>
            ) : searchQuery ? (
              <p>No friends match your search</p>
            ) : (
              <p>You haven't added any friends yet</p>
            )}
          </div>

          {/* Friends List */}
          {filteredFriends.length > 0 ? (
            <div className="space-y-4">
              {filteredFriends.map(friend => (
                <FriendCard key={friend.user_id} friend={friend} />
              ))}
            </div>
          ) : !searchQuery ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="bg-gray-100 p-3 rounded-full">
                  <MdPersonAdd className="text-maroon" size={36} />
                </div>
              </div>
              <h3 className="text-lg font-medium mb-2">Add friends to get started</h3>
              <p className="text-gray-600 mb-4">
                Connect with your classmates and organization members to see their events and activities.
              </p>
              <button className="bg-maroon text-white px-4 py-2 rounded-md flex items-center gap-2 mx-auto hover:bg-maroon/90 transition">
                <MdPersonAdd />
                Find Friends
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <>
          {/* Incoming Friend Requests */}
          {pendingRequests.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Incoming Requests</h2>
              <div className="space-y-4">
                {pendingRequests.map(friend => (
                  <FriendRequestCard key={friend.user_id} friend={friend} />
                ))}
              </div>
            </section>
          )}

          {/* Outgoing Friend Requests */}
          {outgoingRequests.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Outgoing Requests</h2>
              <div className="space-y-4">
                {outgoingRequests.map(friend => (
                  <OutgoingRequestCard key={friend.user_id} friend={friend} />
                ))}
              </div>
            </section>
          )}
          
          {pendingRequests.length === 0 && outgoingRequests.length === 0 && (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-600 mb-2">No pending friend requests</p>
              <button className="text-maroon hover:underline">Find people to connect with</button>
            </div>
          )}
        </>
      )}

      {/* Friend Suggestions */}
      {activeTab === 'all' && filteredFriends.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-4">People You May Know</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">
              Friend suggestions based on your major, courses, and organizations will appear here.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
