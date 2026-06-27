import React from 'react';
import { FocusProvider } from './context/FocusContext';
import BootScreen from './components/BootScreen';

function MainAppContent() {
  return (
    <div className="ps5-os-wrapper">
      <BootScreen />
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
