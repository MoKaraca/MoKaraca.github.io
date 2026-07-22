"use client";

import { useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface CountUpNumberProps {
  end: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  className?: string;
}

export function CountUpNumber({
  end,
  duration = 2000,
  delay = 0,
  suffix = "",
  className = "",
}: CountUpNumberProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrameId: number;
    let startTimeout: NodeJS.Timeout;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      // Easing function (easeOutQuart)
      const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);
      
      const percentage = Math.min(progress / duration, 1);
      const easedProgress = easeOutQuart(percentage);
      
      const currentCount = Math.floor(easedProgress * end);
      setCount(currentCount);

      if (percentage < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    startTimeout = setTimeout(() => {
      animationFrameId = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [end, duration, delay, isInView]);

  return (
    <span ref={ref} className={className}>
      {count}
      {suffix}
    </span>
  );
}
