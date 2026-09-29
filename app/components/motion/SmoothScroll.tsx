"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";
import { LENIS_OPTIONS, setLenisInstance } from "@/app/lib/motion/lenis";
import { useMotionCapabilities } from "@/app/lib/motion/useMotionCapabilities";

/**
 * Inertial wheel scrolling for the whole document. Renders nothing and wraps
 * nothing, so switching it on or off (reduced motion, touch) never remounts
 * the page.
 */
export default function SmoothScroll() {
  const { smoothScroll } = useMotionCapabilities();

  useEffect(() => {
    if (!smoothScroll) return;

    const lenis = new Lenis(LENIS_OPTIONS);
    setLenisInstance(lenis);

    return () => {
      lenis.destroy();
      setLenisInstance(null);
    };
  }, [smoothScroll]);

  return null;
}
