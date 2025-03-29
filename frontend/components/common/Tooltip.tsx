"use client";
import React, { useState } from "react";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export default function Tooltip({ text, children, disabled = false }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative flex flex-row items-center"
      onMouseEnter={() => !disabled && setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <div 
        className={`absolute top-11 left-1/2 -translate-x-1/2 px-3 py-1 z-50 bg-gray-800/95 text-white text-sm rounded-md whitespace-nowrap transition-opacity duration-100 ${
          isVisible && !disabled ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {text}
      </div>
    </div>
  );
}