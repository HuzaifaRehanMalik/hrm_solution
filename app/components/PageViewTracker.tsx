"use client";

import { useEffect } from "react";
import { track } from "@/app/lib/track";

export default function PageViewTracker() {
  useEffect(() => {
    track("page_view");
  }, []);

  return null;
}
