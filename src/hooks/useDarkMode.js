import { useEffect, useState } from "react";

const KEY = "theme-preference";

export function useDarkMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (stored !== null) {
      setDark(stored === "dark");
    } else {
      setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    const transition = () => {
      document.documentElement.classList.add("transition-colors");
      document.documentElement.classList.add("duration-500");

      window.setTimeout(() => {
        document.documentElement.classList.remove("transition-colors");
        document.documentElement.classList.remove("duration-500");
      }, 500);
    };

    transition();

    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem(KEY, dark ? "dark" : "light");
  }, [dark]);

  return [dark, setDark];
}
