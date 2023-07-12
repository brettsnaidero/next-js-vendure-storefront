'use client';

import React, { createContext } from 'react';
import useTheme, { Theme } from '@/utils/use-theme';

export { Theme };

export const ThemeContext = createContext<{
  theme?: Theme;
  toggleTheme: (theme: Theme) => void;
}>({
  theme: undefined,
  toggleTheme: () => {},
});

const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeWrapper;
