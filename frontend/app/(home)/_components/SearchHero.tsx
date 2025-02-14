import { MdSearch } from 'react-icons/md';

export default function SearchHero() {
  return (
    <div className="relative h-[600px] bg-gradient-to-r from-purple-600 to-blue-600">
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center text-white">
        <h1 className="text-5xl font-bold mb-8 text-center">
          Discover Amazing Events
        </h1>
        <div className="w-full max-w-2xl">
          <div className="flex gap-2 bg-white rounded-lg p-2">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search events..."
                className="w-full px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none"
              />
            </div>
            <button className="bg-primary px-6 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition">
              <MdSearch size={20} />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 