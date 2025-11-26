"use client";

import { motion } from 'framer-motion';

export default function InfiniteScrollText() {
  const text = "Rejuvenation Retreat • Forest Therapy • ";
  
  // Repeat the text multiple times to ensure seamless loop
  const repeatedText = text.repeat(20);
  
  return (
    <div className="w-full py-8 overflow-hidden">
      <motion.div
        className="text-display text-(--typography-color-secondary-850) whitespace-nowrap"
        animate={{
          x: [0, -1920], // Adjust based on text length
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
      >
        {repeatedText}
      </motion.div>
    </div>
  );
}