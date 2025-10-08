"use client";

import { useEffect, useState } from "react";

function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(initial);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) {
        setState(JSON.parse(raw));
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [key, state]);

  return [state, setState] as const;
}

export type ReaderTheme = "system" | "light" | "dark" | "sepia";
export type ReaderFont = "serif" | "sans";

export type ReadingSettings = {
  fontSize: number; // in px
  lineHeight: number; // in percent, e.g., 160 => 1.6
  theme: ReaderTheme;
  font: ReaderFont;
  maxWidth: "narrow" | "wide";
};

export function useReadingSettings() {
  return useLocalStorage<ReadingSettings>("reader:settings", {
    fontSize: 18,
    lineHeight: 160,
    theme: "system",
    font: "serif",
    maxWidth: "narrow",
  });
}
