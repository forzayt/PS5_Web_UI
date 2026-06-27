import React from 'react';
import { useFocus } from '../context/FocusContext';

// We will render beautiful SVGs for the avatars so they are crisp, modern, and load immediately.
function AstroAvatar() {
  return (
    <svg className="avatar-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="astroGrad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#D4E4FF" />
        </radialGradient>
        <linearGradient id="astroVisor" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E1E24" />
          <stop offset="100%" stopColor="#0B0B0C" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#astroGrad)" stroke="#3A7CFE" strokeWidth="2" />
      {/* Visor */}
      <rect x="20" y="32" width="60" height="28" rx="14" fill="url(#astroVisor)" />
      {/* Visor glowing blue eyes */}
      <ellipse cx="38" cy="46" rx="8" ry="5" fill="#00D2FF" className="astro-eye" />
      <ellipse cx="62" cy="46" rx="8" ry="5" fill="#00D2FF" className="astro-eye" />
      {/* Helmet line details */}
      <path d="M22,60 C35,68 65,68 78,60" stroke="#BACFEF" strokeWidth="2" fill="none" />
      <circle cx="50" cy="18" r="3" fill="#3A7CFE" />
    </svg>
  );
}

function SpidermanAvatar() {
  return (
    <svg className="avatar-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="spiderGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E21B23" />
          <stop offset="100%" stopColor="#8E060C" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#spiderGrad)" stroke="#111" strokeWidth="2" />
      {/* Spider webs */}
      <path d="M50,4 C50,96 M4,50 C96,50" stroke="#222" strokeWidth="1" />
      <path d="M18,18 L82,82 M18,82 L82,18" stroke="#222" strokeWidth="1" />
      <path d="M50,15 C40,25 30,35 20,50 C30,65 40,75 50,85 C60,75 70,65 80,50 C70,35 60,25 50,15 Z" fill="none" stroke="#222" strokeWidth="1.5" />
      <path d="M50,28 C43,35 37,42 32,50 C37,58 43,65 50,72 C57,65 63,58 68,50 C63,42 57,35 50,28 Z" fill="none" stroke="#222" strokeWidth="1" />
      {/* Eyes */}
      <path d="M22,46 L38,48 C38,48 40,40 38,36 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="3" />
      <path d="M78,46 L62,48 C62,48 60,40 62,36 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="3" />
    </svg>
  );
}

function AloyAvatar() {
  return (
    <svg className="avatar-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="aloyHair" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="100%" stopColor="#B33F10" />
        </linearGradient>
        <linearGradient id="aloySkin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F5D0A9" />
          <stop offset="100%" stopColor="#E2A9F3" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="#1C3E42" stroke="#00F0FF" strokeWidth="2" />
      {/* Hair backing */}
      <path d="M12,48 C5,20 95,20 88,48 C95,65 92,85 85,92 C70,75 30,75 15,92 C8,85 5,65 12,48 Z" fill="url(#aloyHair)" />
      {/* Face */}
      <path d="M30,35 C30,22 70,22 70,35 L70,55 C70,68 30,68 30,55 Z" fill="url(#aloySkin)" />
      {/* Focus device (glowing blue triangle near temple) */}
      <polygon points="25,32 18,36 22,42" fill="#00FFFF" stroke="#FFFFFF" strokeWidth="0.5" />
      <circle cx="21" cy="37" r="1.5" fill="#FFFFFF" />
      {/* Front Hair Strands */}
      <path d="M32,25 C35,32 38,45 35,62 M68,25 C65,32 62,45 65,62" stroke="url(#aloyHair)" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M50,18 C40,18 35,26 35,32" stroke="url(#aloyHair)" strokeWidth="3" fill="none" />
    </svg>
  );
}

function GuestAvatar() {
  return (
    <svg className="avatar-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#2E2E3A" stroke="#8E8E9F" strokeWidth="2" />
      <circle cx="50" cy="38" r="16" fill="#8E8E9F" />
      <path d="M22,74 C22,60 34,54 50,54 C66,54 78,60 78,74 L78,82 L22,82 Z" fill="#8E8E9F" />
    </svg>
  );
}

export default function UserSelectScreen() {
  const { focusId, userIndex, usersList, setSelectedUser, setActiveScreen, updateHomeFocus, setCurrentTheme } = useFocus();

  const getAvatarComponent = (name) => {
    switch (name) {
      case 'Astro': return <AstroAvatar />;
      case 'Peter Parker': return <SpidermanAvatar />;
      case 'Aloy': return <AloyAvatar />;
      case 'Guest': return <GuestAvatar />;
      default: return <GuestAvatar />;
    }
  };

  const handleSelectUser = (name, idx) => {
    setSelectedUser(name);
    
    // Choose starting theme based on selected character
    if (idx === 0) setCurrentTheme('astro');
    else if (idx === 1) setCurrentTheme('spiderman');
    else if (idx === 2) setCurrentTheme('horizon');
    else setCurrentTheme('ps5');

    setActiveScreen('HOME');
    updateHomeFocus('apps', 2); // default focus on Astro Playroom app launcher
  };

  return (
    <div className="user-select-container">
      <div className="user-select-content">
        <h1 className="user-select-title">Who is using this controller?</h1>
        
        <div className="users-row">
          {usersList.map((user, idx) => {
            const id = `user-${idx}`;
            const isFocused = focusId === id;
            return (
              <div
                key={user}
                id={id}
                className={`user-card ${isFocused ? 'focused' : ''}`}
                onClick={() => handleSelectUser(user, idx)}
              >
                <div className="user-avatar-wrapper">
                  {getAvatarComponent(user)}
                  {isFocused && <div className="avatar-glow-ring" />}
                </div>
                <div className="user-name">{user}</div>
              </div>
            );
          })}

          {/* Add User placeholder */}
          <div className="user-card disabled">
            <div className="user-avatar-wrapper add-user-wrapper">
              <svg className="avatar-svg add-user-svg" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="#555" strokeWidth="2" strokeDasharray="6 6" />
                <path d="M50,30 L50,70 M30,50 L70,50" stroke="#888" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
            <div className="user-name">Add User</div>
          </div>
        </div>

        <div className="navigation-help">
          <p>Use <span className="keyboard-key">←</span> <span className="keyboard-key">→</span> to change selection</p>
          <p>Press <span className="keyboard-key">Enter</span> to sign in</p>
        </div>
      </div>
    </div>
  );
}
