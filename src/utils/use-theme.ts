import { useEffect, useState } from 'react';

// Need to match any updates to this with the noflash.js script

const THEME_LOCAL_STORAGE_KEY = 'theme';

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

const useTheme = () => {
  const [theme, setTheme] = useState<Theme | undefined>();

  const toggleTheme = (theme: Theme) => {
    window.localStorage.setItem(THEME_LOCAL_STORAGE_KEY, theme);
    setTheme(theme);
  };

  // On load, check local storage for stored theme
  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_LOCAL_STORAGE_KEY);
    if (storedTheme === Theme.Light || storedTheme === Theme.Dark) {
      setTheme(storedTheme);
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
    document.body.classList.remove(Theme.Light);
    document.body.classList.remove(Theme.Dark);

    if (theme) {
      document.body.classList.add(theme);
    }
  }, [theme]);

  return { theme, toggleTheme };
};

export default useTheme;
