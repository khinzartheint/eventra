import { useEffect, useState } from "react";

function DarkModeButton() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((currentMode) => !currentMode);
  };

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      aria-label={
        darkMode
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
    >
      {darkMode ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}

export default DarkModeButton;