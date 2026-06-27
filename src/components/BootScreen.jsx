import React, { useEffect, useState } from 'react';
import { playBootSound, startMusic } from '../utils/AudioSystem';
import { useFocus } from '../context/FocusContext';
import psLogo from '../assets/logos/main_black.png';

export default function BootScreen() {
  const { setActiveScreen } = useFocus();
  const [isReady, setIsReady] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Fade in text and button after a short startup delay
    const timer = setTimeout(() => setIsReady(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    if (isExiting) return;
    setIsPressed(true);
    
    // Synthesize the PlayStation 5 boot audio
    playBootSound();
    
    // Start ambient background music after sound starts peaking
    setTimeout(() => {
      startMusic('ps5');
    }, 400);

    // Trigger exit animation and screen switch
    setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setActiveScreen('LOGIN');
      }, 1200); // duration matches index.css boot-container-new.fade-out transition
    }, 200);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        handleStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExiting]);

  return (
    <div className={`boot-container-new ${isExiting ? 'fade-out' : ''}`}>
      <div className={`boot-content-wrapper ${isReady ? 'visible' : ''}`}>
        <div className="boot-top-text">
          Press the Enter button on your keyboard.
        </div>

        <div 
          className={`ps-button-wrapper ${isPressed ? 'pressed' : ''}`} 
          onClick={handleStart}
        >
          <div className="ps-button-outer-ring">
            <div className="ps-button-inner-ring">
              <div className="ps-button-core">
                <img src={psLogo} alt="PlayStation Logo" className="ps-icon-img" />
              </div>
            </div>
          </div>
          <div className="ps-button-glow"></div>
        </div>
      </div>
    </div>
  );
}

