import React, { createContext, useContext, useState, useEffect } from 'react';

const darkTheme = {
  primary: '#006bde',
  secondary: '#000',
  secondary2: '#222',
  font: 'white',
  accent: '#ff8800',
  hover: '#333',
  heading1: '#ff4f76'
};

const initialTheme = {
  primary: '#005cbf',
  secondary: '#ededed',
  secondary2: '#d6d6d6',
  font: '#000',
  accent: 'black',
  hover: '#999999',
  heading1: '#c9002c'
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
