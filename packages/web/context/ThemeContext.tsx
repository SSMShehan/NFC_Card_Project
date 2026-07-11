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
    if (saved === "dark") {
      setThemeState("dark");
    } else {
      // Strictly default to Light Mode
      setThemeState("light");
      localStorage.setItem("tagit_theme", "light");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.style.backgroundColor = "#08080a";
        document.body.style.backgroundColor = "#08080a";
        document.body.style.color = "#f5f5f5";
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.style.backgroundColor = "#ffffff";
        document.body.style.backgroundColor = "#ffffff";
        document.body.style.color = "#0a0a0a";
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setThemeState(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("tagit_theme", next);
    }
  };

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    if (typeof window !== "undefined") {
      localStorage.setItem("tagit_theme", t);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isLight: theme === "light", toggleTheme, setTheme }}>
      <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-[#08080a] text-neutral-100 dark" : "bg-white text-neutral-950"}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
