import React, { useEffect, useState } from 'react';
import { playBootSound } from '../utils/AudioSystem';
import { useFocus } from '../context/FocusContext';

export default function BootScreen() {
  const { setActiveScreen, setFocusId } = useFocus();
  const [bootPhase, setBootPhase] = useState('power-off'); // power-off, logo, press-button

  useEffect(() => {
    // Stage 1: Power-off state, transitions to Logo after 1s
    const timer1 = setTimeout(() => {
      setBootPhase('logo');
    }, 1000);

    // Stage 2: Logo fades out, showing press-button prompt after 3.5s
    const timer2 = setTimeout(() => {
      setBootPhase('press-button');
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleStart = () => {
    playBootSound();
    // Short delay so the chime starts before screen transition
    setTimeout(() => {
      setActiveScreen('USER_SELECT');
      setFocusId('user-0');
    }, 500);
  };

  return (
    <div className={`boot-container ${bootPhase}`} onClick={bootPhase === 'press-button' ? handleStart : undefined}>
      {bootPhase === 'logo' && (
        <div className="ps-logo-container">
          <svg className="ps-logo-svg" viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
            {/* PlayStation P shape */}
            <path
              className="logo-p"
              d="M38,5 C48,5 56,12 56,22 C56,32 48,39 38,39 L31,39 L31,65 L21,65 L21,5 L38,5 Z M38,15 L31,15 L31,29 L38,29 C42,29 46,26 46,22 C46,18 42,15 38,15 Z"
              fill="#FFFFFF"
            />
            {/* PlayStation S shape (skewed ground perspective) */}
            <path
              className="logo-s"
              d="M74,58 C85,58 92,62 92,67 C92,72 82,75 66,75 C42,75 14,71 14,64 L24,59 C24,62 38,65 58,65 C72,65 82,64 82,62 C82,60 76,59 66,59 C44,59 28,56 28,51 C28,46 44,43 66,43 C84,43 94,46 94,49 L84,54 C84,52 76,51 64,51 C50,51 38,52 38,54 C38,56 46,57 58,57 L74,58 Z"
              fill="#FFFFFF"
              opacity="0.7"
            />
          </svg>
          <div className="ps-brand-text">PLAYSTATION®5</div>
        </div>
      )}

      {bootPhase === 'press-button' && (
        <div className="boot-start-content">
          <div className="controller-icon-wrapper">
            <svg className="controller-svg" viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M20,15 C10,15 5,25 5,45 C5,65 15,75 25,75 C32,75 38,70 42,65 L58,65 C62,70 68,75 75,75 C85,75 95,65 95,45 C95,25 90,15 80,15 L20,15 Z"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="3"
              />
              <circle cx="20" cy="35" r="3" fill="#FFFFFF" />
              <circle cx="15" cy="40" r="3" fill="#FFFFFF" />
              <circle cx="25" cy="40" r="3" fill="#FFFFFF" />
              <circle cx="20" cy="45" r="3" fill="#FFFFFF" />
              
              <circle cx="80" cy="35" r="3" fill="#FFFFFF" />
              <circle cx="75" cy="40" r="3" fill="#FFFFFF" />
              <circle cx="85" cy="40" r="3" fill="#FFFFFF" />
              <circle cx="80" cy="45" r="3" fill="#FFFFFF" />
              
              <path d="M42,50 C45,47 55,47 58,50" stroke="#FFFFFF" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <h2 className="boot-prompt-title">Welcome Back to PlayStation</h2>
          <p className="boot-prompt-subtitle">Press <span className="keyboard-key">Enter</span> to start</p>
          <button className="boot-start-btn focused" onClick={handleStart}>
            Start Console
          </button>
        </div>
      )}
    </div>
  );
}
