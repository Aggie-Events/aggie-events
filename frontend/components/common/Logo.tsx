import React from "react";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

export default function Logo({
  width = 40,
  height = 40,
  className = "",
  showText = true,
  textClassName = "text-lg font-bold italic leading-none",
}: LogoProps) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/logo/logo4.png"
        alt="logo"
        width={width}
        height={height}
        priority={true}
        className={className}
      />
      {showText && (
        <div className={textClassName}>
          <div>Aggie</div>
          <div>Events</div>
        </div>
      )}
    </Link>
  );
} 