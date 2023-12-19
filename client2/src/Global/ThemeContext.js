import React, { createContext, useContext, useState, useEffect } from 'react';

const initialTheme = {
  primary: '#006bde',
  secondary: '#000',
  secondary2: '#222',
  font: '#fff',
  accent: '#ff8800',
  hover: '#333'
};

const darkTheme = {
  primary: '#005cbf',
  secondary: '#ededed',
  secondary2: '#d6d6d6',
  font: '#000',
  accent: '#ff8800',
  hover: '#999999'
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  const toggleTheme = () => {
    setCurrentTheme(prevTheme => prevTheme === initialTheme ? darkTheme : initialTheme);
  };

  useEffect(() => {
    const root = document.documentElement;

    for (const [variable, value] of Object.entries(currentTheme)) {
      root.style.setProperty(`--${variable}-color`, value);
    }
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
