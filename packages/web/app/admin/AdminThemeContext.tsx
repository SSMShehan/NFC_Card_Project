"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminThemeContextType {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  isLight: boolean;
}

const AdminThemeContext = createContext<AdminThemeContextType>({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
  isLight: true,
});

export const AdminThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Optional: Load saved theme from localStorage
    try {
      const saved = localStorage.getItem("tagit_admin_theme") as "light" | "dark";
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const handleSetTheme = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    try {
      localStorage.setItem("tagit_admin_theme", newTheme);
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    handleSetTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <AdminThemeContext.Provider
      value={{
        theme,
        setTheme: handleSetTheme,
        toggleTheme,
        isLight: theme === "light",
      }}
    >
      {children}
    </AdminThemeContext.Provider>
  );
};

export const useAdminTheme = () => useContext(AdminThemeContext);
