"use client";
import { useEffect } from "react";

export function DocsThemeHandler() {
  useEffect(() => {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    document.documentElement.classList.remove('dark');
    const themeToggle = document.querySelector('[data-fumadocs-theme-toggle]');
    if (themeToggle) {
      (themeToggle as HTMLElement).style.display = 'none';
    }
    const cleanup = () => {
      if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      if (themeToggle) {
        (themeToggle as HTMLElement).style.display = '';
      }
    };
    window.addEventListener('beforeunload', cleanup);
    return () => {
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
    };
  }, []);

  return null;
} 