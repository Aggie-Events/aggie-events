import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header";

import Link from "next/link";
import Image from "next/image";
import "./globals.css";

export default function PageNotFound() {
  return (
    <div className="flex flex-col min-h-[100vh]">
      <Header />
      <div className="relative w-full h-[400px]">
        <div className="absolute mt-3 w-full md:ml-32 md:mt-20 py-8 px-8 bg-white md:w-fit">
          <h1 className="text-4xl text-bold">Error 404: Page Not Found</h1>
          <h3 className="text-lg">Sorry, that page doesn't exist.</h3>
          <div className="mt-8">
            <Link href="/" className="bg-maroon p-3 text-white text-bold">
              Back to homepage
            </Link>
          </div>
        </div>
        {/* Background image and color filter */}
        <Image
          src="/tamufield.png"
          quality={100}
          fill={true}
          // placeholder='blur'
          alt="TAMU Campus"
          className="-z-[21] object-cover"
          priority={true}
        />
        <div className="absolute bg-black/40 w-full h-full -z-[20] top-0 left-0" />
      </div>
      <Footer />
    </div>
  );
}
