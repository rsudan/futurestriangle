
import React from 'react';
import { Theme } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { LightbulbIcon, CogIcon } from './icons';

interface HeaderProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, setTheme, onOpenSettings }) => {
  return (
    <header className="py-4 px-6 md:px-8 bg-light-card dark:bg-dark-card border-b border-light-border dark:border-dark-border shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <LightbulbIcon className="h-8 w-8 text-light-accent dark:text-dark-accent" />
          <h1 className="text-xl md:text-2xl font-bold text-light-text dark:text-dark-text">
            Futures Triangle Analyst
          </h1>
        </div>
        <div className="flex items-center space-x-2">
            <button
                onClick={onOpenSettings}
                className="p-2 rounded-full bg-light-bg dark:bg-dark-card hover:bg-light-border dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent transition-colors"
                aria-label="Open Settings"
                title="Settings"
            >
                <CogIcon className="h-6 w-6 text-light-text dark:text-dark-text" />
            </button>
            <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </header>
  );
};
