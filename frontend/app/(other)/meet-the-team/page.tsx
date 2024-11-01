"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function TeamPage() {
  return (
    <>
      <div className="bg-maroon min-h-screen text-white w-screen overflow-hidden">
        {/* Header Section */}
        <section className="text-center pt-10 pb-12">
          <motion.div
            className="card"
            initial={{
              opacity: 0,
              y: 50,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 1, // Animation duration
              },
            }}
            viewport={{ once: true }}
          >
            <h1 className="text-8xl font-light mt-0 mb-10">Meet Our Team</h1>
            <h2 className="text-3xl font-light mt-0">
              “Connecting Aggies, One Event at a Time!"
            </h2>
            <div className="w-10/12 h-0.5 bg-white mt-10 mb-20 mx-auto"></div>
            <div className="relative w-full h-[60rem] flex justify-center">
              <Image
                src="/test.jpg"
                alt="Campus view"
                fill
                style={{ objectFit: "contain" }}
                className="filter brightness-100"
              />
              <div className="absolute inset-0 bg-maroon opacity-30"></div>
            </div>
          </motion.div>
          <motion.div
            className="card"
            initial={{
              opacity: 0,
              y: 50,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 1, // Animation duration
              },
            }}
            viewport={{ once: true }}
          >
            <h1 className="text-6xl font-light mt-20 mb-10">Our Story</h1>
            <h2 className="text-xl font-light mt-0 mx-96 mb-20">
              “I want more free food” -Sean
              <br />
              <br />
              We are a group of students passionate about connecting Aggies with
              events and organizations on campus. Our goal is to create a
              platform that makes it easy for students to find and participate
              in events that interest them.
            </h2>
          </motion.div>
        </section>

        {/* Team Members Section */}
        <section className="grid grid-cols-1 font-satoshi sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-24 px-24 pb-20">
          <p></p>
          <TeamCard name="Jadon Lee" imageSrc="/meet-the-team/jadon.jpg" />
          <TeamCard name="Alex Bui" imageSrc="/meet-the-team/alex.jpg" />
        </section>
        <section className="grid grid-cols-1 font-satoshi sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-24 px-80 pb-20">
          <TeamCard name="Sean Hau Goh" imageSrc="/meet-the-team/sean.gif" />
          <TeamCard name="Angela Yue" imageSrc="/meet-the-team/angela.jpg" />
          <TeamCard
            name="Another Teammate"
            imageSrc="/meet-the-team/blank.webp"
          />
          <TeamCard
            name="Another Teammate"
            imageSrc="/meet-the-team/blank.webp"
          />
          <TeamCard
            name="Another Teammate"
            imageSrc="/meet-the-team/blank.webp"
          />
          <TeamCard
            name="Another Teammate"
            imageSrc="/meet-the-team/blank.webp"
          />
        </section>
      </div>
    </>
  );
}

// TeamCard Component
function TeamCard({ name, imageSrc }) {
  return (
    <motion.div
      className="card"
      initial={{
        opacity: 0,
        y: 50,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 1, // Animation duration
        },
      }}
      viewport={{ once: true }}
    >
      <div className="bg-maroon text-white overflow-hidden transform transition hover:scale-105 text-center">
        <div>
          <Image
            src={imageSrc}
            alt={name}
            width={300}
            height={300}
            className="w-full object-cover"
          />
          <div className="absolute inset-0 bg-maroon opacity-10"></div>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold">{name}</h3>
        </div>
      </div>
    </motion.div>
  );
}
