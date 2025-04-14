"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function LoadingBar() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Quick jump to ~20%
    setProgress(20);

    // Slightly random progress
    const slowInterval = setInterval(() => {
      setProgress(prev => {
        // Small random movements
        const randomIncrement = Math.random() * 0.001;
        // Occasionally add a slightly larger jump
        const extraJump = Math.random() > 0.95 ? Math.random() * 0.5 : 0;
        
        return Math.min(prev + randomIncrement + extraJump, 90);
      });
    }, 10);

    return () => {
      clearInterval(slowInterval);
    };
  }, []);

  return (
    <motion.div 
      className="absolute top-0 left-0 w-full z-50 h-1 bg-maroon origin-left"
      initial={{ 
        opacity: 0,
        scaleX: progress / 100 
      }}
      animate={{ 
        opacity: 1,
        scaleX: progress / 100,
        transition: { 
          opacity: { duration: 0.2 },
          scaleX: { duration: 0.8, ease: "easeOut" }
        }
      }}
      exit={{ 
        opacity: 0,
        scaleX: 1,
        transition: { 
          opacity: { duration: 0.2, delay: 0.1 },
          scaleX: { duration: 0.2, ease: "easeOut" }
        }
      }}
    />
  );
} 