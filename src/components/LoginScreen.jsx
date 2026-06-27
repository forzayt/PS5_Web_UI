import React, { useEffect, useState } from 'react';
import { playTick, playSelect, playBack, stopMusic } from '../utils/AudioSystem';
import { useFocus } from '../context/FocusContext';
import userData from '../data/users.json';

export default function LoginScreen() {
  const { setActiveScreen } = useFocus();
  const [isMounted, setIsMounted] = useState(false);
  const [focusRow, setFocusRow] = useState(0); // Row 0 = profiles, Row 1 = bottom options
  const [focusCol, setFocusCol] = useState(0); // Default focused on first user
  const [timeStr, setTimeStr] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isShuttingDown, setIsShuttingDown] = useState(false);

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

  const handleFocus = (row, col) => {
    if (row !== focusRow || col !== focusCol) {
      setFocusRow(row);
      setFocusCol(col);
      playTick();
    }
  };

  const handleSelect = () => {
    if (focusRow === 0) {
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

    } else if (focusRow === 1 && focusCol === 0) {
      // Power button selected
      playBack();
      setIsShuttingDown(true);
      stopMusic();
      
      // Return to boot screen after shut down animation
      setTimeout(() => {
        setActiveScreen('BOOT');
      }, 1500);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLoggingIn || isShuttingDown) return;

      if (e.key === 'ArrowLeft') {
        if (focusRow === 0) {
          const nextCol = Math.max(0, focusCol - 1);
          handleFocus(0, nextCol);
        }
      } else if (e.key === 'ArrowRight') {
        if (focusRow === 0) {
          const nextCol = Math.min(users.length - 1, focusCol + 1);
          handleFocus(0, nextCol);
        }
      } else if (e.key === 'ArrowDown') {
        if (focusRow === 0) {
          handleFocus(1, 0); // Focus Power button
        }
      } else if (e.key === 'ArrowUp') {
        if (focusRow === 1) {
          handleFocus(0, 0); // Focus first user profile
        }
      } else if (e.key === 'Enter') {
        handleSelect();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusRow, focusCol, isLoggingIn, isShuttingDown, users.length]);

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
    <div className={`login-screen-container ${isMounted ? 'active' : ''} ${isShuttingDown ? 'fade-out' : ''}`}>
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
              className={`profile-card profile-card-${index + 1} ${focusRow === 0 && focusCol === index ? 'focused' : ''}`}
              onMouseEnter={() => handleFocus(0, index)}
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
          <button 
            className={`power-btn ${focusRow === 1 && focusCol === 0 ? 'focused' : ''}`}
            onMouseEnter={() => handleFocus(1, 0)}
            onClick={handleSelect}
            aria-label="Power Options"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.56 2.56c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41C17.62 6.4 19 9.04 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.96 1.38-5.6 3.85-8.03.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0C4.42 5.58 3 8.64 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-3.36-1.42-6.42-4.44-9.44zM12 2c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1s1-.45 1-1V3c0-.55-.45-1-1-1z" />
            </svg>
          </button>
        </div>
        <div className="footer-right">
          <div className="select-helper">
            <span className="cross-button-icon">X</span>
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
