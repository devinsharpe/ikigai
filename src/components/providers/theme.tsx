import type React from "react";
import { useEffect } from "react";

const ThemeProvider: React.FC = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);
  return null;
};

export default ThemeProvider;
