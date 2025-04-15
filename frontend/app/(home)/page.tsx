"use client";

import React from "react";
import HomeHeader from "@/app/(home)/_components/HomeHeader";
import ImageGallery from "./_components/ImageGallery";
import Link from "next/link";
import Image from "next/image";
import TypeAnim from "@/app/(other)/browse/_components/typing-anim/TypeAnim";
import VideoBanner from "./_components/VideoBanner";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <VideoBanner>
          {/* <HomeHeader /> */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-40 md:pt-40 md:pb-48">
            <div className="flex flex-col items-center text-center gap-8 mx-auto max-w-3xl">
              <h1 className="ext-7xl md:text-6xl font-normal text-white leading-tight">
                <span className="text-7xl md:text-6xl font-normal text-white leading-tight">
                  Discover Your Next Adventure
                </span>
                <br></br>
                <TypeAnim
                  baseText="In "
                  texts={[
                    "Campus Life",
                    "Student Activities",
                    "Aggie Spirit",
                    "Traditions",
                  ]}
                  delay={2}
                  className="inline-flex text-7xl md:text-6xl font-normal text-white leading-tight"
                />
              </h1>
              <p className="text-xl text-white/90 max-w-2xl">
                Dive into the ultimate Aggie experience with AggieEvents!
                We specialize in connecting students with vibrant campus activities.
              </p>
              <div className="flex gap-4">
                <Link 
                  href="/browse"
                  className="bg-white text-maroon px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Explore Events
                </Link>
                <Link
                  href="/dashboard/events/create"
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Host Event
                </Link>
              </div>
            </div>
          </div>
        </VideoBanner>
      </section>
      
      {/* Image Gallery */}
      <section className="relative z-[2] bg-white">
        <ImageGallery />
      </section>

      {/* Features Section */}
      <section className="relative z-[2] py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need for campus events
            </h2>
            <p className="text-xl text-gray-600">
              From organization meetups to traditions, we've got you covered
            </p>
      </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-maroon/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Event Creation</h3>
              <p className="text-gray-600">Create and manage your events with our intuitive tools. Perfect for organizations and individual hosts.</p>
          </div>
          
            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-maroon/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect with Peers</h3>
              <p className="text-gray-600">Find like-minded Aggies and join organizations that match your interests and passions.</p>
              </div>
              
            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-maroon/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Track & Attend</h3>
              <p className="text-gray-600">Never miss an event with our tracking system. Get reminders and add events to your calendar.</p>
            </div>
              </div>
            </div>
          </section>
          
      {/* Popular Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Events by Category
                </h2>
            <p className="text-xl text-gray-600">
              Find exactly what you're looking for
            </p>
              </div>
              
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🎓", name: "Academic", count: 42 },
              { icon: "🏀", name: "Sports", count: 38 },
              { icon: "🎨", name: "Arts", count: 25 },
              { icon: "🤝", name: "Service", count: 31 },
              { icon: "🌍", name: "Cultural", count: 28 },
              { icon: "💼", name: "Professional", count: 35 },
              { icon: "🎉", name: "Social", count: 45 },
              { icon: "🏆", name: "Competition", count: 22 },
            ].map((category, index) => (
                  <Link 
                key={index}
                href={`/browse?category=${category.name.toLowerCase()}`}
                className="group bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
                  {category.icon}
                    </div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} events</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
          
      {/* CTA Section */}
      <section className="bg-maroon py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white max-w-2xl">
              <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-white/90 mb-6">
                Join thousands of Aggies creating and discovering amazing campus events every day.
              </p>
              <div className="flex gap-4">
                  <Link 
                  href="/browse"
                  className="bg-white text-maroon px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Browse Events
                  </Link>
                <Link 
                  href="/dashboard/events/create"
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Create Event
                </Link>
              </div>
            </div>
            <div className="relative w-full md:w-1/3 h-64">
            <Image 
              src="/tamufield.png" 
                alt="Texas A&M Events"
              fill
                className="object-cover rounded-xl"
            />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}