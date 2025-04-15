"use client";

import React from 'react';
import Image from 'next/image';

const images = [
  {
    src: "/event1.jpg",
    width: 170,
    height: 240,
    alt: "Campus Event 1"
  },
  {
    src: "/event2.jpg",
    width: 300,
    height: 200,
    alt: "Campus Event 2"
  },
  {
    src: "/event3.jpg",
    width: 250,
    height: 210,
    alt: "Campus Event 3"
  },
  {
    src: "/event4.jpg",
    width: 180,
    height: 200,
    alt: "Campus Event 4"
  },
  {
    src: "/event5.jpg",
    width: 280,
    height: 180,
    alt: "Campus Event 5"
  },
  {
    src: "/event6.jpg",
    width: 320,
    height: 200,
    alt: "Campus Event 6"
  }
];

export default function ImageGallery() {
  return (
    <div className="w-full overflow-hidden bg-gray-50 py-12">
      <div 
        className="flex gap-6 overflow-x-hidden whitespace-nowrap py-8 animate-scroll"
        style={{ 
          minWidth: 'max-content',
          position: 'relative',
          left: '-170px',
          animation: 'scroll 30s linear infinite'
        }}
      >
        {/* Double the images for seamless loop */}
        {[...images, ...images].map((image, index) => (
          <div
            key={index}
            className="relative inline-block transform hover:scale-105 transition-transform duration-300"
            style={{
              width: image.width,
              height: image.height,
              marginTop: index % 2 === 0 ? '30px' : '-30px',
              padding: '1px'
            }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-2xl">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes={`${image.width}px`}
                priority={index < 6}
              />
              <div className="absolute inset-0 bg-maroon/0 hover:bg-maroon/20 transition-colors duration-300" />
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
} 