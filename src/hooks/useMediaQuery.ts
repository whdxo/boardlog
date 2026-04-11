"use client";

import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
  const getServerSnapshot = () => false;
  const getClientSnapshot = () => window.matchMedia(query).matches;

  const subscribe = (callback: () => void) => {
    const media = window.matchMedia(query);
    const listener = () => callback();
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  };

  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
