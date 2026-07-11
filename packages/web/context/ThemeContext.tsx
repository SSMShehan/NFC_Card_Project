"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  theme: ThemeMode;
  isLight: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  isLight: true,
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("tagit_theme") as ThemeMode;
    if (saved === "dark" || saved === "light") {
      setThemeState(saved);
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      // Default to light
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setThemeState(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("tagit_theme", next);
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    if (typeof window !== "undefined") {
      localStorage.setItem("tagit_theme", t);
      if (t === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isLight: theme === "light", toggleTheme, setTheme }}>
      <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-neutral-950 text-neutral-100 dark" : "bg-white text-neutral-950"}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
