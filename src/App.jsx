import React from 'react';
import { FocusProvider, useFocus } from './context/FocusContext';
import BootScreen from './components/BootScreen';
import LoginScreen from './components/LoginScreen';
import DashboardScreen from './components/DashboardScreen';
import BackgroundCanvas from './components/BackgroundCanvas';

function MainAppContent() {
  const { activeScreen } = useFocus();

  return (
    <div className="ps5-os-wrapper">
      {/* Shared animated particle background */}
      <BackgroundCanvas />
      
      {activeScreen === 'BOOT' && <BootScreen />}
      {activeScreen === 'LOGIN' && <LoginScreen />}
      {activeScreen === 'DASHBOARD' && <DashboardScreen />}
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

