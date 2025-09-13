import { useEffect, useState } from 'react';

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
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded-lg shadow bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
    >
      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
