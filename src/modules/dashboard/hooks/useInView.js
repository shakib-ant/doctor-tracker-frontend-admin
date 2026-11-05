"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Custom hook to detect when an element enters the viewport.
 * Triggers animations only when the user scrolls down to the chart.
 * @param {Object} options IntersectionObserver options
 * @returns {[React.RefObject, boolean]} [ref, isInView]
 */
export function useInView({ threshold = 0.2, rootMargin = "0px 0px -40px 0px" } = {}) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if IntersectionObserver is available
    if (typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element); // Only trigger once
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [threshold, rootMargin]);

  return [ref, isInView];
}

