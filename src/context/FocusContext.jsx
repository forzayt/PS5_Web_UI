import React, { createContext, useContext, useState } from 'react';
import { setMusicTheme } from '../utils/AudioSystem';

const FocusContext = createContext();

export function useFocus() {
  return useContext(FocusContext);
}

export function FocusProvider({ children }) {
  const [activeScreen, setActiveScreen] = useState('BOOT');
  const [focusId, setFocusId] = useState('boot-start');
  const [currentTheme, setCurrentTheme] = useState('ps5');

  const applyTheme = (themeName) => {
    setCurrentTheme(themeName);
    setMusicTheme(themeName);
    document.body.className = `theme-${themeName}`;
  };

  const value = {
    activeScreen,
    setActiveScreen,
    focusId,
    setFocusId,
    currentTheme,
    applyTheme
  };

  return (
    <FocusContext.Provider value={value}>
      {children}
    </FocusContext.Provider>
  );
}
