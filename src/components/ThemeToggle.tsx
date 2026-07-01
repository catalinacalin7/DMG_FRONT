"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

import { cn } from "@/utils/cn";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex w-fit items-center rounded-full bg-offwhite-200 p-1">
      <button
        className={cn(
          "flex items-center gap-2 rounded-full px-7 py-2 text-gray-500 transition-colors",
          theme === "light" && "bg-white",
        )}
        onClick={() => setTheme("light")}
      >
        <Sun />

        <span className="font-semibold">Light</span>
      </button>

      <button
        className={cn(
          "flex items-center gap-2 rounded-full px-7 py-2 text-gray-500 transition-colors",
          theme === "dark" && "bg-white",
        )}
        onClick={() => setTheme("dark")}
      >
        <Moon />

        <span className="font-semibold">Dark</span>
      </button>
    </div>
  );
};

export default ThemeToggle;
