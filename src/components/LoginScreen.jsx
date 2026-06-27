import React, { useEffect, useState } from 'react';
import { playTick, playSelect, playBack, stopMusic } from '../utils/AudioSystem';
import { useFocus } from '../context/FocusContext';
import userData from '../data/users.json';

export default function LoginScreen() {
  const { setActiveScreen } = useFocus();
  const [isMounted, setIsMounted] = useState(false);
  const [focusCol, setFocusCol] = useState(0); // Default focused on first user
  const [timeStr, setTimeStr] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const users = userData.users;

  // Real-time Clock
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minStr = minutes < 10 ? '0' + minutes : minutes;
      setTimeStr(`${hours}:${minStr} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Mounting Animation trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleFocus = (col) => {
    if (col !== focusCol) {
      setFocusCol(col);
      playTick();
    }
  };

  const handleSelect = () => {
    // Profile selected
    playSelect();
    const user = users[focusCol];
    const name = user.username;

    setSelectedUser(name);
    setIsLoggingIn(true);
    
    // Simulate dashboard loading or login completion
    setTimeout(() => {
      setIsLoggingIn(false);
      alert(`Logged in as ${name}! (In a full build, this would load the PS5 Dashboard)`);
    }, 2500);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLoggingIn) return;

      if (e.key === 'F11') {
        e.preventDefault();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
          });
        } else {
          document.exitFullscreen();
        }
      }

      if (e.key === 'ArrowLeft') {
        const nextCol = Math.max(0, focusCol - 1);
        handleFocus(nextCol);
      } else if (e.key === 'ArrowRight') {
        const nextCol = Math.min(users.length - 1, focusCol + 1);
        handleFocus(nextCol);
      } else if (e.key === 'Enter') {
        handleSelect();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusCol, isLoggingIn, users.length]);

  // SVG Gamepad Icon
  const gamepadIcon = (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M22.5 8h-13C6.46 8 4 10.46 4 13.5v5c0 2.22 1.3 4.13 3.17 4.96C8 26.54 11 27 11 27l2.5-3.5h5l2.5 3.5s3-.46 3.83-3.54C26.7 22.63 28 20.72 28 18.5v-5C28 10.46 25.54 8 22.5 8zM9.5 17h-1.5v-1.5h-1v-1h1.5v-1.5h1v1.5h1.5v1h-1.5v1.5zm10.5-2.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" 
        fill="currentColor" 
      />
    </svg>
  );

  return (
    <div className={`login-screen-container ${isMounted ? 'active' : ''}`}>
      <div className="light-beam-overlay"></div>
      <div className="login-clock">{timeStr}</div>

      <div className="login-content">
        <div className="login-header">
          <h1>Welcome Back to PlayStation</h1>
          <p>Who's using this controller?</p>
        </div>

        <div className="login-profiles">
          {users.map((user, index) => (
            <div 
              key={index}
              className={`profile-card profile-card-${index + 1} ${focusCol === index ? 'focused' : ''}`}
              onMouseEnter={() => handleFocus(index)}
              onClick={handleSelect}
            >
              <div className="controller-indicator">
                {gamepadIcon}
                <span>1</span>
              </div>
              <div className="avatar-wrapper">
                <div className="avatar-image-container">
                  <img src={user.dp} alt={user.username} className="avatar-img" />
                </div>
              </div>
              <div className="profile-name">
                <span>{user.username}</span>
              </div>
              <div className="options-helper">
                <div className="options-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span>Options</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions Footer */}
      <div className="login-footer">
        <div className="footer-left">
          {/* Power button removed */}
        </div>
        <div className="footer-right">
          <div className="footer-helper">
            <span className="key-icon">F11</span>
            <span>Fullscreen</span>
          </div>
          <div className="footer-helper">
            <span className="key-icon">Arrows</span>
            <span>Navigate</span>
          </div>
          <div className="footer-helper">
            <span className="key-icon">Enter</span>
            <span>Select</span>
          </div>
        </div>
      </div>

      {/* Loading/Logging In Overlay */}
      {isLoggingIn && (
        <div className="login-loading-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          zIndex: 1000,
          color: '#fff',
          fontFamily: 'var(--font-primary)',
          backdropFilter: 'blur(10px)',
          animation: 'fadeIn 0.5s ease forwards'
        }}>
          <div className="spinner" style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: '3px solid rgba(255, 255, 255, 0.1)',
            borderTopColor: '#0043ff',
            animation: 'spin 1s linear infinite'
          }}></div>
          <div style={{ fontSize: '1.2rem', fontWeight: 300, letterSpacing: '0.5px' }}>
            Welcome back, {selectedUser}...
          </div>
          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          `}</style>
        </div>
      )}
    </div>
  );
}
