import Image from 'next/image';
import Link from 'next/link';

export default function PopularEvents() {
  const events = [
    {
      id: 1,
      title: "MSC Open House",
      date: "Mar 15 • 7:00 PM",
      location: "MSC",
      price: "Free",
      image: "/tamufield.png"
    },
    {
      id: 2,
      title: "Ring Day Ceremony",
      date: "Mar 20 • 2:00 PM",
      location: "Reed Arena",
      price: "Free",
      image: "/tamufield.png"
    },
    {
      id: 3,
      title: "Career Fair",
      date: "Mar 22 • 9:00 AM",
      location: "Rudder Tower",
      price: "Free",
      image: "/tamufield.png"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Link 
          key={event.id} 
          href={`/events/${event.id}`}
          className="group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
        >
          <div className="relative h-48">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <div className="text-sm text-primary mb-2">{event.date}</div>
            <h3 className="font-semibold mb-2 group-hover:text-primary transition">
              {event.title}
            </h3>
            <p className="text-sm text-gray-600">{event.location} • {event.price}</p>
          </div>
        </Link>
      ))}
    </div>
  );
} 