import { useEffect, useState } from "react";

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // Apply theme + save
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");

    localStorage.setItem("theme", theme);

    // ✅ tell other components (same tab) to update their state
    window.dispatchEvent(new Event("themechange"));
  }, [theme]);

  // ✅ when any component changes theme, sync this component too
  useEffect(() => {
    const syncTheme = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };

    window.addEventListener("themechange", syncTheme);

    // (optional but good) sync if theme changed in another tab
    const onStorage = (e) => {
      if (e.key === "theme") syncTheme();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("themechange", syncTheme);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, toggleTheme, setTheme };
}
