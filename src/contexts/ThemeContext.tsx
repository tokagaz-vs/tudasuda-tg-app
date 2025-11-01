import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import type { Theme } from '../constants/theme';
import { themes } from '../constants/theme';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(
    WebApp.colorScheme === 'dark'
  );

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(WebApp.colorScheme === 'dark');
    };

    WebApp.onEvent('themeChanged', updateTheme);
    
    return () => {
      WebApp.offEvent('themeChanged', updateTheme);
    };
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? themes.dark : themes.light;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};