"use client";

import type Lenis from "lenis";
import type { LenisOptions } from "lenis";
import { useSyncExternalStore } from "react";

/** Exponential ease-out: fast response to the wheel, long soft landing. */
export const expoOut = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

export const LENIS_OPTIONS: LenisOptions = {
  // With both `duration` and `easing` set, Lenis animates on this fixed curve
  // and ignores `lerp` (see Animate.advance in lenis.mjs).
  duration: 1.1,
  easing: expoOut,
  wheelMultiplier: 1,
  smoothWheel: true,
  syncTouch: false,
  autoRaf: true,
  // Leave in-page anchors to the browser: Lenis' anchor handling prevents the
  // default navigation, which stops focus moving to the target for keyboard
  // users (e.g. "Skip to content").
  anchors: false,
};

let instance: Lenis | null = null;
const listeners = new Set<() => void>();

export function setLenisInstance(next: Lenis | null) {
  instance = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The active Lenis instance, or null when smooth scroll is off. */
export function useLenisInstance() {
  return useSyncExternalStore(
    subscribe,
    () => instance,
    () => null,
  );
}
