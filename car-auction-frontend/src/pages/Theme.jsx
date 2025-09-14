import { useEffect, useState } from 'react';
import carLogoWhite from '../assets/Pi7_high-speed.png';
import carLogoBlack from '../assets/high-speed.png';

export default function Theme() {
  const getInitialTheme = () => {
    const saved = localStorage.getItem('theme');
    return saved ? saved : 'dark'; // default = dark
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <section className="p-3 space-y-4 self-center">
      <p className="text-3xl text-center text-stone-700 flex items-center justify-center gap-2">
        <span className="text-nowrap">Theme</span>{' '}
        <span className="w-full">
          <img
            src={carLogoWhite}
            alt="Car Auction Logo"
            className="h-17 hidden dark:block"
          />
          <img
            src={carLogoBlack}
            alt="Car Auction Logo"
            className="h-17 dark:hidden block"
          />
        </span>
      </p>{' '}
      <button
        onClick={toggleTheme}
        className="px-7 py-2 rounded-lg shadow bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
      >
        {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </section>
  );
}
