import React from 'react';
import { FocusProvider, useFocus } from './context/FocusContext';
import BootScreen from './components/BootScreen';
import UserSelectScreen from './components/UserSelectScreen';
import HomeScreen from './components/HomeScreen';
import SettingsScreen from './components/SettingsScreen';
import ControlCenter from './components/ControlCenter';
import GamePlayerScreen from './components/GamePlayerScreen';

function MainAppContent() {
  const { activeScreen } = useFocus();

  // Helper to render the background screen when Control Center overlay is active
  const renderUnderlayScreen = () => {
    // If control center is up, render the screen underneath it
    if (activeScreen === 'CONTROL_CENTER') {
      // In a real console, the control center overlays home/settings/user select
      return <HomeScreen />;
    }
    return null;
  };

  return (
    <div className="ps5-os-wrapper">
      {/* Keyboard guide overlay (helps the user know how to navigate the console) */}
      <div className="keyboard-navigation-guide-overlay">
        <span className="guide-title font-bold">PS5 KEYBOARD CONTROLS</span>
        <span className="guide-item"><span className="key-cap">Arrows</span> Navigate</span>
        <span className="guide-item"><span className="key-cap">Enter</span> Select / Confirm</span>
        <span className="guide-item"><span className="key-cap">Esc</span> PS Button (Control Center)</span>
        <span className="guide-item"><span className="key-cap">Backspace</span> Back / Exit</span>
      </div>

      {activeScreen === 'BOOT' && <BootScreen />}
      
      {activeScreen === 'USER_SELECT' && <UserSelectScreen />}
      
      {activeScreen === 'HOME' && <HomeScreen />}
      
      {activeScreen === 'SETTINGS' && <SettingsScreen />}
      
      {activeScreen === 'GAME_PLAY' && <GamePlayerScreen />}
      
      {activeScreen === 'CONTROL_CENTER' && (
        <>
          {renderUnderlayScreen()}
          <ControlCenter />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <FocusProvider>
      <MainAppContent />
    </FocusProvider>
  );
}
