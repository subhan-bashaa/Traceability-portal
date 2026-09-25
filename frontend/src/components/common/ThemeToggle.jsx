import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ variant = 'pill', className = '' }) {
  const { theme, isDark, toggleTheme, setTheme } = useTheme();

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`p-2 rounded-full border transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand-500/30 ${
          isDark
            ? 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-750 hover:text-amber-300'
            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-xs'
        } ${className}`}
        title={isDark ? 'Switch to Bright mode' : 'Switch to Dark mode'}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    );
  }

  // Default 'pill' segmented switch: Sun (Bright) + Moon (Dark)
  return (
    <div
      role="group"
      aria-label="Theme toggle switch"
      className={`inline-flex items-center p-0.5 rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-xs transition-colors duration-200 ${className}`}
    >
      {/* Bright / Light mode button */}
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 focus:outline-none ${
          !isDark
            ? 'bg-white text-amber-600 shadow-xs font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        title="Switch to Bright mode"
        aria-pressed={!isDark}
        aria-label="Bright mode"
      >
        <Sun className={`w-3.5 h-3.5 ${!isDark ? 'text-amber-500 fill-amber-100' : 'text-slate-400'}`} />
        <span className="hidden sm:inline text-[11px] font-medium">Bright</span>
      </button>

      {/* Dark mode button */}
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 focus:outline-none ${
          isDark
            ? 'bg-slate-900 text-brand-400 shadow-xs font-semibold border border-slate-700/60'
            : 'text-slate-500 hover:text-slate-700'
        }`}
        title="Switch to Dark mode"
        aria-pressed={isDark}
        aria-label="Dark mode"
      >
        <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-brand-400 fill-brand-400/20' : 'text-slate-400'}`} />
        <span className="hidden sm:inline text-[11px] font-medium">Dark</span>
      </button>
    </div>
  );
}
