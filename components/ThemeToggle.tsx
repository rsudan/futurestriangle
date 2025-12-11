
import React from 'react';
import { Theme } from '../types';
import { SunIcon, MoonIcon } from './icons';

interface ThemeToggleProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    const newTheme = theme === Theme.Light ? Theme.Dark : Theme.Light;
    setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-light-bg dark:bg-dark-card hover:bg-light-border dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent transition-colors"
      aria-label="Toggle theme"
    >
      {theme === Theme.Light ? (
        <MoonIcon className="h-6 w-6 text-light-text" />
      ) : (
        <SunIcon className="h-6 w-6 text-dark-text" />
      )}
    </button>
  );
};
