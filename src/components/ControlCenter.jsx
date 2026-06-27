import React, { useState } from 'react';
import { useFocus } from '../context/FocusContext';
import { stopMusic, startMusic } from '../utils/AudioSystem';

import ss440 from '../assets/screenshots/Screenshot (440).png';
import ss442 from '../assets/screenshots/Screenshot (442).png';
import ss444 from '../assets/screenshots/Screenshot (444).png';

export default function ControlCenter() {
  const {
    focusId,
    setActiveScreen,
    setFocusId,
    currentTheme,
    selectedUser,
    updateHomeFocus
  } = useFocus();

  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);

  const toggleMic = () => {
    setIsMicMuted(!isMicMuted);
  };

  const toggleMusic = () => {
    if (isMusicPlaying) {
      stopMusic();
    } else {
      startMusic(currentTheme);
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  // Render quick bar items
  const quickBarItems = [
    { id: 'cc-home', label: 'Home', icon: <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" fill="#FFF" /> },
    { id: 'cc-switcher', label: 'Switcher', icon: <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" fill="#FFF" /> },
    { id: 'cc-notif', label: 'Notifications', icon: <path d="M12,2A2,2 0 0,0 10,4A2,2 0 0,0 10,4.17C7.06,4.84 5,7.46 5,10.5V16L3,18V19H21V18L19,16V10.5C19,7.46 16.94,4.84 14,4.17A2,2 0 0,0 14,4A2,2 0 0,0 12,2M10,21A2,2 0 0,0 12,23A2,2 0 0,0 14,21H10Z" fill="#FFF" /> },
    { id: 'cc-gamebase', label: 'Game Base', icon: <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8A2.5,2.5 0 0,1 7.5,10.5A2.5,2.5 0 0,1 5,13A2.5,2.5 0 0,1 2.5,10.5A2.5,2.5 0 0,1 5,8M19,8A2.5,2.5 0 0,1 21.5,10.5A2.5,2.5 0 0,1 19,13A2.5,2.5 0 0,1 16.5,10.5A2.5,2.5 0 0,1 19,8M12,14C16,14 20,15.5 20,18V20H4V18C4,15.5 8,14 12,14M5,14.7C7.3,14.7 9,15.5 9.7,16.7L9.2,18H2V17C2,15.8 4,14.7 5,14.7M19,14.7C20,14.7 22,15.8 22,17V18H14.8L14.3,16.7C15,15.5 16.7,14.7 19,14.7Z" fill="#FFF" /> },
    { id: 'cc-music', label: 'Music', icon: <path d="M21,3V15.5A3.5,3.5 0 0,1 17.5,19A3.5,3.5 0 0,1 14,15.5A3.5,3.5 0 0,1 17.5,12C18.06,12 18.58,12.15 19,12.4V7H9V16.5A3.5,3.5 0 0,1 5.5,20A3.5,3.5 0 0,1 2,16.5A3.5,3.5 0 0,1 5.5,13C6.06,13 6.58,13.15 7,13.4V5H21V3Z" fill="#FFF" />, active: isMusicPlaying, toggle: toggleMusic },
    { id: 'cc-mic', label: 'Mic', icon: isMicMuted ? <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19M19.92,4.92L4.92,19.92L3.5,18.5L18.5,3.5L19.92,4.92Z" fill="#FF5252" /> : <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" fill="#FFF" />, active: !isMicMuted, toggle: toggleMic },
    { id: 'cc-sound', label: 'Sound', icon: <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18.07,19.86 21,16.28 21,12C21,7.72 18.07,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16.02C15.5,15.29 16.5,13.77 16.5,12M3,9V15H7L12,20V4L7,9H3Z" fill="#FFF" /> },
    { id: 'cc-power', label: 'Power', icon: <path d="M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.18,7.16 3.75,9.91 3.75,13A8.25,8.25 0 0,0 12,21.25A8.25,8.25 0 0,0 20.25,13C20.25,9.91 18.82,7.16 16.56,5.44M11.25,3H12.75V13H11.25V3Z" fill="#FFF" /> }
  ];

  const handleAction = (item) => {
    if (item.toggle) {
      item.toggle();
    } else if (item.id === 'cc-home') {
      setActiveScreen('HOME');
      updateHomeFocus('apps', 2);
    } else if (item.id === 'cc-power') {
      setActiveScreen('BOOT');
      setFocusId('boot-start');
    } else if (item.id === 'cc-sound') {
      setActiveScreen('SETTINGS');
      setFocusId('theme-ps5');
    }
  };

  return (
    <div className="cc-overlay-container">
      <div className="cc-tint" />
      <div className="cc-content-slide">
        
        {/* CC Cards Section (News, Activities, Music player) */}
        <div className="cc-cards-row">
          <div id="cc-card-1" className={`cc-card ${focusId === 'cc-card-1' ? 'focused' : ''}`}>
            <div className="cc-card-bg" style={{ backgroundImage: `url(${ss440})` }} />
            <div className="cc-card-overlay" />
            <div className="cc-card-header">
              <span className="badge">TROPHY EARNED</span>
            </div>
            <div className="cc-card-body">
              <h4>Platinum Champion</h4>
              <p>{selectedUser || 'User'} unlocked 'Be Greater'</p>
            </div>
          </div>

          <div id="cc-card-2" className={`cc-card ${focusId === 'cc-card-2' ? 'focused' : ''}`}>
            <div className="cc-card-bg" style={{ backgroundImage: `url(${ss442})` }} />
            <div className="cc-card-overlay" />
            <div className="cc-card-header">
              <span className="badge">GAME BASE</span>
            </div>
            <div className="cc-card-body">
              <h4>Astro is Online</h4>
              <p>Playing Astro's Playroom (1/8 friends online)</p>
            </div>
          </div>

          <div id="cc-card-3" className={`cc-card ${focusId === 'cc-card-3' ? 'focused' : ''}`}>
            <div className="cc-card-bg" style={{ backgroundImage: `url(${ss444})` }} />
            <div className="cc-card-overlay" />
            <div className="cc-card-header">
              <span className="badge">MUSIC SYNTH</span>
            </div>
            <div className="cc-card-body">
              <h4>{currentTheme.toUpperCase()} Ambience</h4>
              <p>{isMusicPlaying ? 'Synthesizing Live Pad' : 'Synthesizer Paused'}</p>
            </div>
          </div>
        </div>

        {/* CC Quick Action Row */}
        <div className="cc-quickbar-row">
          {quickBarItems.map(item => {
            const isFocused = focusId === item.id;
            return (
              <div key={item.id} className="cc-quick-item-container">
                <button
                  id={item.id}
                  className={`cc-quick-btn ${isFocused ? 'focused' : ''} ${item.active === false ? 'toggled-off' : ''} ${item.id === 'cc-mic' && isMicMuted ? 'muted-btn' : ''}`}
                  onClick={() => handleAction(item)}
                >
                  <svg viewBox="0 0 24 24" className="cc-btn-svg">
                    {item.icon}
                  </svg>
                </button>
                {isFocused && <span className="cc-quick-label">{item.label}</span>}
              </div>
            );
          })}
        </div>

        {/* CC Mute Indicator Pop */}
        {isMicMuted && (
          <div className="cc-microphone-muted-banner">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19M19.92,4.92L4.92,19.92L3.5,18.5L18.5,3.5L19.92,4.92Z" fill="#FF5252" />
            </svg>
            <span>Microphone Muted</span>
          </div>
        )}

      </div>
    </div>
  );
}
