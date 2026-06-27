import React, { createContext, useContext, useState, useEffect } from 'react';
import { playTick, playSelect, playBack, setMusicTheme } from '../utils/AudioSystem';

const FocusContext = createContext();

export function useFocus() {
  return useContext(FocusContext);
}

// Define the focus maps for each screen.
// A screen map defines: rows, and what elements are in each row.
// We can dynamically compute the next focus ID on Up/Down/Left/Right arrow presses.
const HOME_ROWS = {
  // We have 4 main focus zones on the Home Screen
  tabs: ['tab-games', 'tab-media'],
  header: ['header-search', 'header-settings', 'header-profile', 'header-power'],
  apps: ['app-psstore', 'app-explore', 'app-astro', 'app-spiderman', 'app-horizon', 'app-gow', 'app-gta5', 'app-mediagallery'],
  details: ['btn-play', 'card-trophy', 'card-news']
};

const CONTROL_CENTER_ROWS = {
  cards: ['cc-card-1', 'cc-card-2', 'cc-card-3'],
  quickbar: ['cc-home', 'cc-switcher', 'cc-notif', 'cc-gamebase', 'cc-music', 'cc-mic', 'cc-sound', 'cc-power']
};

export function FocusProvider({ children }) {
  const [activeScreen, setActiveScreen] = useState('BOOT'); // BOOT, USER_SELECT, HOME, SETTINGS, CONTROL_CENTER, GAME_PLAY
  const [prevScreen, setPrevScreen] = useState('BOOT'); // To resume after closing overlay
  const [focusId, setFocusId] = useState('boot-start'); // Initial focus
  
  // Console state
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('ps5'); // ps5, spiderman, astro, horizon, ps4
  const [homeTab, setHomeTab] = useState('games'); // games, media
  const [selectedGame, setSelectedGame] = useState('app-astro'); // currently selected game/app in the launcher row
  const [isPlayingGame, setIsPlayingGame] = useState(false);
  const [currentGameData, setCurrentGameData] = useState(null);

  // Home Screen Layout Position Tracker
  // Home focus zones: 'tabs', 'header', 'apps', 'details'
  const [homeZone, setHomeZone] = useState('apps');
  const [homeIndex, setHomeIndex] = useState(2); // Start focused on Astro's Playroom (index 2 in apps)

  // Control Center Layout Position Tracker
  // CC focus zones: 'cards', 'quickbar'
  const [ccZone, setCcZone] = useState('quickbar');
  const [ccIndex, setCcIndex] = useState(0); // Start on Home

  // User Select Screen index
  const [userIndex, setUserIndex] = useState(0);
  const usersList = ['Astro', 'Peter Parker', 'Aloy', 'Guest'];

  // Settings screen index
  const [settingsIndex, setSettingsIndex] = useState(0);
  const settingsList = ['theme-ps5', 'theme-spiderman', 'theme-astro', 'theme-horizon', 'theme-ps4', 'setting-network', 'setting-storage', 'setting-about', 'setting-back'];

  // Update theme music and CSS variables when theme changes
  const applyTheme = (themeName) => {
    setCurrentTheme(themeName);
    setMusicTheme(themeName);
    // Apply theme class to document body to let CSS handle background, glows, colors
    document.body.className = `theme-${themeName}`;
  };

  // Keyboard navigation logic
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Audio context might need resume
      if (activeScreen === 'BOOT' && e.key === 'Enter') {
        playSelect();
        setActiveScreen('USER_SELECT');
        setFocusId('user-0');
        return;
      }

      // Escape key toggle Control Center (PS Button)
      if (e.key === 'Escape') {
        if (activeScreen === 'CONTROL_CENTER') {
          playBack();
          setActiveScreen(prevScreen);
          // Restore focus
          if (prevScreen === 'HOME') {
            updateHomeFocus(homeZone, homeIndex);
          } else if (prevScreen === 'SETTINGS') {
            setFocusId(settingsList[settingsIndex]);
          } else if (prevScreen === 'USER_SELECT') {
            setFocusId(`user-${userIndex}`);
          }
        } else if (activeScreen !== 'BOOT') {
          playSelect();
          setPrevScreen(activeScreen);
          setActiveScreen('CONTROL_CENTER');
          setCcZone('quickbar');
          setCcIndex(0);
          setFocusId(CONTROL_CENTER_ROWS.quickbar[0]);
        }
        return;
      }

      switch (activeScreen) {
        case 'USER_SELECT':
          handleUserSelectNavigation(e);
          break;
        case 'HOME':
          handleHomeNavigation(e);
          break;
        case 'SETTINGS':
          handleSettingsNavigation(e);
          break;
        case 'CONTROL_CENTER':
          handleControlCenterNavigation(e);
          break;
        case 'GAME_PLAY':
          handleGamePlayNavigation(e);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeScreen, focusId, homeZone, homeIndex, ccZone, ccIndex, userIndex, settingsIndex, prevScreen, selectedGame]);

  // Navigation: USER_SELECT
  const handleUserSelectNavigation = (e) => {
    let nextIdx = userIndex;
    if (e.key === 'ArrowLeft') {
      nextIdx = Math.max(0, userIndex - 1);
    } else if (e.key === 'ArrowRight') {
      nextIdx = Math.min(usersList.length - 1, userIndex + 1);
    } else if (e.key === 'Enter') {
      playSelect();
      setSelectedUser(usersList[userIndex]);
      setActiveScreen('HOME');
      // Set theme based on selected profile for extra cool touch!
      if (userIndex === 0) applyTheme('astro');
      else if (userIndex === 1) applyTheme('spiderman');
      else if (userIndex === 2) applyTheme('horizon');
      else applyTheme('ps5');
      
      updateHomeFocus('apps', 2); // Focus on Astro game card first
      return;
    }

    if (nextIdx !== userIndex) {
      playTick();
      setUserIndex(nextIdx);
      setFocusId(`user-${nextIdx}`);
    }
  };

  // Helper to sync home state and focus ID
  const updateHomeFocus = (zone, index) => {
    setHomeZone(zone);
    setHomeIndex(index);
    const newFocusId = HOME_ROWS[zone][index];
    setFocusId(newFocusId);

    // If we focus on an app, update the selected game state
    if (zone === 'apps') {
      setSelectedGame(newFocusId);
    }
  };

  // Navigation: HOME
  const handleHomeNavigation = (e) => {
    if (e.key === 'ArrowLeft') {
      const rowItems = HOME_ROWS[homeZone];
      if (homeIndex > 0) {
        playTick();
        updateHomeFocus(homeZone, homeIndex - 1);
      }
    } else if (e.key === 'ArrowRight') {
      const rowItems = HOME_ROWS[homeZone];
      if (homeIndex < rowItems.length - 1) {
        playTick();
        updateHomeFocus(homeZone, homeIndex + 1);
      }
    } else if (e.key === 'ArrowUp') {
      if (homeZone === 'apps') {
        playTick();
        // Go to tabs or header based on last index.
        // Left side goes to tabs, right side goes to header
        if (homeIndex < 2) {
          updateHomeFocus('tabs', 0);
        } else {
          updateHomeFocus('header', 1); // settings gear
        }
      } else if (homeZone === 'details') {
        playTick();
        // Return to apps row, focusing on the selected game
        const appIdx = HOME_ROWS.apps.indexOf(selectedGame);
        updateHomeFocus('apps', appIdx !== -1 ? appIdx : 2);
      }
    } else if (e.key === 'ArrowDown') {
      if (homeZone === 'tabs' || homeZone === 'header') {
        playTick();
        const appIdx = HOME_ROWS.apps.indexOf(selectedGame);
        updateHomeFocus('apps', appIdx !== -1 ? appIdx : 2);
      } else if (homeZone === 'apps') {
        playTick();
        updateHomeFocus('details', 0); // Focus Play Button
      }
    } else if (e.key === 'Enter') {
      playSelect();
      // Handle selections
      if (focusId === 'header-settings') {
        setActiveScreen('SETTINGS');
        setSettingsIndex(0);
        setFocusId(settingsList[0]);
      } else if (focusId === 'header-power') {
        setActiveScreen('BOOT');
        setFocusId('boot-start');
      } else if (focusId === 'tab-games') {
        setHomeTab('games');
      } else if (focusId === 'tab-media') {
        setHomeTab('media');
      } else if (focusId === 'btn-play' || homeZone === 'apps') {
        // Play the focused game/app!
        setIsPlayingGame(true);
        setActiveScreen('GAME_PLAY');
        setFocusId('game-screen');
      }
    } else if (e.key === 'Backspace') {
      // Go back to profile select
      playBack();
      setActiveScreen('USER_SELECT');
      setFocusId(`user-${userIndex}`);
    }
  };

  // Navigation: SETTINGS
  const handleSettingsNavigation = (e) => {
    let nextIdx = settingsIndex;
    if (e.key === 'ArrowUp') {
      nextIdx = Math.max(0, settingsIndex - 1);
    } else if (e.key === 'ArrowDown') {
      nextIdx = Math.min(settingsList.length - 1, settingsIndex + 1);
    } else if (e.key === 'Backspace' || (e.key === 'Enter' && focusId === 'setting-back')) {
      playBack();
      setActiveScreen('HOME');
      updateHomeFocus('header', 1); // settings gear
      return;
    } else if (e.key === 'Enter') {
      playSelect();
      if (focusId.startsWith('theme-')) {
        const themeName = focusId.split('-')[1];
        applyTheme(themeName);
      }
      return;
    }

    if (nextIdx !== settingsIndex) {
      playTick();
      setSettingsIndex(nextIdx);
      setFocusId(settingsList[nextIdx]);
    }
  };

  // Navigation: CONTROL_CENTER
  const handleControlCenterNavigation = (e) => {
    if (e.key === 'ArrowLeft') {
      const rowItems = CONTROL_CENTER_ROWS[ccZone];
      if (ccIndex > 0) {
        playTick();
        setCcIndex(ccIndex - 1);
        setFocusId(rowItems[ccIndex - 1]);
      }
    } else if (e.key === 'ArrowRight') {
      const rowItems = CONTROL_CENTER_ROWS[ccZone];
      if (ccIndex < rowItems.length - 1) {
        playTick();
        setCcIndex(ccIndex + 1);
        setFocusId(rowItems[ccIndex + 1]);
      }
    } else if (e.key === 'ArrowUp') {
      if (ccZone === 'quickbar') {
        playTick();
        setCcZone('cards');
        setCcIndex(0);
        setFocusId(CONTROL_CENTER_ROWS.cards[0]);
      }
    } else if (e.key === 'ArrowDown') {
      if (ccZone === 'cards') {
        playTick();
        setCcZone('quickbar');
        setCcIndex(0);
        setFocusId(CONTROL_CENTER_ROWS.quickbar[0]);
      }
    } else if (e.key === 'Enter') {
      playSelect();
      if (focusId === 'cc-home') {
        setActiveScreen('HOME');
        updateHomeFocus('apps', 2);
      } else if (focusId === 'cc-power') {
        setActiveScreen('BOOT');
        setFocusId('boot-start');
      } else if (focusId === 'cc-sound') {
        // Toggle theme settings directly
        setActiveScreen('SETTINGS');
        setSettingsIndex(2); // focus on astro theme or sound setting
        setFocusId(settingsList[2]);
      } else {
        // Just return to home for other dummy icons
        setActiveScreen(prevScreen);
      }
    } else if (e.key === 'Backspace') {
      playBack();
      setActiveScreen(prevScreen);
    }
  };

  // Navigation: GAME_PLAY
  const handleGamePlayNavigation = (e) => {
    if (e.key === 'Backspace' || e.key === 'Escape') {
      playBack();
      setIsPlayingGame(false);
      setActiveScreen('HOME');
      updateHomeFocus('apps', HOME_ROWS.apps.indexOf(selectedGame));
    }
  };

  return (
    <FocusContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        focusId,
        setFocusId,
        selectedUser,
        setSelectedUser,
        currentTheme,
        setCurrentTheme: applyTheme,
        homeTab,
        setHomeTab,
        selectedGame,
        setSelectedGame,
        isPlayingGame,
        setIsPlayingGame,
        updateHomeFocus,
        usersList,
        userIndex,
        settingsIndex,
        settingsList,
        ccZone,
        ccIndex
      }}
    >
      {children}
    </FocusContext.Provider>
  );
}
