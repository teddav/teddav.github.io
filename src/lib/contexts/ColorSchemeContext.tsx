"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useColorScheme } from "@/lib/hooks/useColorScheme";

interface ColorSchemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(undefined);

export function ColorSchemeProvider({ children }: { children: ReactNode }) {
  const { isDarkMode, toggleDarkMode } = useColorScheme();
  return <ColorSchemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>{children}</ColorSchemeContext.Provider>;
}

export function useColorSchemeContext() {
  const context = useContext(ColorSchemeContext);
  if (context === undefined) {
    throw new Error("useColorSchemeContext must be used within a ColorSchemeProvider");
  }
  return context;
}
