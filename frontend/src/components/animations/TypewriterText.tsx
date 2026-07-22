"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TypewriterTextProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  showCursor?: boolean;
}

export function TypewriterText({
  text,
  delay = 0,
  speed = 50,
  className = "",
  onComplete,
  showCursor = true,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // Start typing after initial delay
    const startTimeout = setTimeout(() => {
      setIsTyping(true);
      
      let i = 0;
      timeout = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        
        if (i >= text.length) {
          clearInterval(timeout);
          setIsTyping(false);
          if (onComplete) onComplete();
        }
      }, speed);
      
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (timeout) clearInterval(timeout);
    };
  }, [text, delay, speed, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && (
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="inline-block ml-[2px] font-light"
        >
          |
        </motion.span>
      )}
    </span>
  );
}
