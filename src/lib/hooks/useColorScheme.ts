"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "theme";

export function useColorScheme() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    // The pre-paint script in the document head has already applied the correct class;
    // reflect that decision in state so the toggle icon matches.
    setIsDarkMode(document.documentElement.classList.contains("dark"));

    // Follow the OS preference only while the user hasn't made an explicit choice.
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setIsDarkMode(e.matches);
        document.documentElement.classList.toggle("dark", e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    try {
      localStorage.setItem(STORAGE_KEY, newDarkMode ? "dark" : "light");
    } catch {
      // Ignore storage failures (e.g. private mode); the class is still applied for this session.
    }
  };

  // Only expose the resolved value after mount to avoid a hydration mismatch.
  return { isDarkMode: hasMounted ? isDarkMode : false, toggleDarkMode };
}
