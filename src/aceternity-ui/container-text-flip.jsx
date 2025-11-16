"use client";
import React, { useState, useEffect, useId } from "react";

import { motion } from "motion/react";
import { cn } from "../lib/utils";

export function ContainerTextFlip({
  words = ["Badge"],
  interval = 3000,
  className,
  textClassName,
  animationDuration = 700,
}) {
  const id = useId();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [widths, setWidths] = useState({});
  const textRef = React.useRef(null);

  // Pre-calculate all widths on mount
  useEffect(() => {
    const calculateAllWidths = () => {
      const newWidths = {};
      words.forEach((word, index) => {
        // Estimate width based on character count
        newWidths[index] = Math.max(word.length * 8 + 30, 60); // fallback width calculation
      });
      setWidths(newWidths);
    };

    calculateAllWidths();
  }, [words]);

  // Get current width (with fallback)
  const currentWidth = widths[currentWordIndex] || 80;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(intervalId);
  }, [words, interval]);

  return (
    <motion.div
      animate={{ width: currentWidth }}
      transition={{
        duration: animationDuration / 2000,
        ease: "easeInOut",
      }}
      className={cn("inline-block overflow-hidden", className)}
      style={{ willChange: "width" }}
    >
      <motion.div
        key={words[currentWordIndex]}
        transition={{
          duration: animationDuration / 1000,
          ease: "easeInOut",
        }}
        className={cn("inline-block whitespace-nowrap", textClassName)}
        ref={textRef}
      >
        <motion.div className="inline-block">
          {words[currentWordIndex].split("").map((letter, index) => (
            <motion.span
              key={index}
              initial={{
                opacity: 0,
                filter: "blur(10px)",
              }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
              }}
              transition={{
                delay: index * 0.02,
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
