import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

export default function ThemeSwitcher({ theme, onToggle }) {
    return (
        <button
            onClick={onToggle}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <SunIcon className="w-6 h-6" />
            ) : (
                <MoonIcon className="w-6 h-6" />
            )}
        </button>
    );
}