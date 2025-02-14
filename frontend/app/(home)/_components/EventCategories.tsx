import { MdMusicNote, MdTheaterComedy, MdRestaurant, MdBusiness, MdFavorite, MdPalette } from 'react-icons/md';
import Link from 'next/link';

const categories = [
  { icon: MdMusicNote, label: 'Music', href: '/events/music' },
  { icon: MdTheaterComedy, label: 'Performing Arts', href: '/events/performing-arts' },
  { icon: MdRestaurant, label: 'Food & Drink', href: '/events/food-drink' },
  { icon: MdBusiness, label: 'Business', href: '/events/business' },
  { icon: MdFavorite, label: 'Lifestyle', href: '/events/lifestyle' },
  { icon: MdPalette, label: 'Arts', href: '/events/arts' },
];

export default function EventCategories() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Link
          key={category.label}
          href={category.href}
          className="flex flex-col items-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
        >
          <category.icon size={32} className="mb-3 text-primary" />
          <span className="font-medium">{category.label}</span>
        </Link>
      ))}
    </div>
  );
} 