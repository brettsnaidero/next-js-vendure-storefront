import { useEffect, useState } from 'react';

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

const useTheme = () => {
  const [theme, setTheme] = useState<Theme | undefined>();

  const toggleTheme = (theme: Theme) => {
    window.localStorage.setItem('theme', theme);
    setTheme(theme);
  };

  // On load, check local storage for stored theme
  useEffect(() => {
    const storedTheme = window.localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme as Theme);
    } else {
      // If no stored theme, check system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? Theme.Dark
        : Theme.Light;
      setTheme(systemTheme);
    }
  }, []);

  useEffect(() => {
    // TODO: Better way to remove previous theme class
    document.body.classList.remove('light');
    document.body.classList.remove('dark');

    if (theme) {
      document.body.classList.add(theme);
    }
  }, [theme]);

  return { theme, toggleTheme };
};

export default useTheme;
