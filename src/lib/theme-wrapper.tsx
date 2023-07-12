'use client';

import React, { createContext } from 'react';
import { ThemeProvider } from 'next-themes';
import { useTheme } from 'next-themes';

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export const ThemeContext = createContext<{
  theme?: Theme;
  toggleTheme: (theme: Theme) => void;
}>({
  theme: undefined,
  toggleTheme: () => {},
});

const ThemeInnerWrapper = ({ children }: { children: React.ReactNode }) => {
  const { theme, setTheme } = useTheme();

  return (
    <ThemeContext.Provider
      value={{
        theme: theme as Theme | undefined,
        toggleTheme: setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

const ThemeWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider
    attribute="class"
    defaultTheme={Theme.Light}
    enableSystem={true}
    themes={[Theme.Light, Theme.Dark]}
  >
    <ThemeInnerWrapper>{children}</ThemeInnerWrapper>
  </ThemeProvider>
);

export default ThemeWrapper;
