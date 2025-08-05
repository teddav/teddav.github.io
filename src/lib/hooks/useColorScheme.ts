"use client";

import { useState, useEffect } from "react";

export function useColorScheme() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isManual, setIsManual] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    // Function to check if system prefers dark mode
    const checkDarkMode = () => {
      if (!isManual) {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDarkMode(prefersDark);

        // Set initial class
        if (typeof document !== "undefined") {
          if (prefersDark) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      }
    };

    // Check immediately
    checkDarkMode();

    // Listen for changes (only if not in manual mode)
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (!isManual) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [isManual]);

  const toggleDarkMode = () => {
    setIsManual(true);
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    // Update body class
    if (typeof document !== "undefined") {
      if (newDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  // Only return the actual value after component has mounted
  return { isDarkMode: hasMounted ? isDarkMode : false, toggleDarkMode };
}
