import React, { useEffect, useState } from 'react';
import { useFocus } from '../context/FocusContext';

// Import our copied reference screenshots to use as live high-res game backdrops!

const GAMES_DATA = {
  'app-psstore': {
    title: 'PlayStation™Store',
    subtitle: 'Discover the latest releases, sales and add-ons',
    backdrop: ss447,
    logoText: 'PS Store',
    accentColor: '#0043ff',
    hours: null,
    trophies: null,
    cards: [
      { id: 'store-card-1', title: 'Summer Sale', desc: 'Up to 75% off standard editions', img: ss448 },
      { id: 'store-card-2', title: 'New Releases', desc: 'Browse the newest additions this week', img: ss438 }
    ]
  },
  'app-explore': {
    title: 'Explore',
    subtitle: 'Latest updates and news from PlayStation Studios',
    backdrop: ss448,
    logoText: 'Explore',
    accentColor: '#ffffff',
    hours: null,
    trophies: null,
    cards: [
      { id: 'exp-card-1', title: 'State of Play', desc: 'Catch up on all the announcements', img: ss437 },
      { id: 'exp-card-2', title: 'PlayStation Plus', desc: 'Claim your monthly games today', img: ss442 }
    ]
  },
  'app-astro': {
    title: "Astro's Playroom",
    subtitle: 'Explore the internal components of the PS5 console!',
    backdrop: ss437,
    logoText: 'ASTRO',
    accentColor: '#00d2ff',
    hours: '14 Hours Played',
    trophies: '100% Completed',
    cards: [
      { id: 'astro-card-1', title: 'Memory Meadow', desc: 'CPU Plaza Speedrun Challenge', img: ss438 },
      { id: 'astro-card-2', title: 'GPU Jungle', desc: 'Collect all hidden artifacts', img: ss447 }
    ]
  },
  'app-spiderman': {
    title: "Marvel's Spider-Man 2",
    subtitle: 'Be Greater. Together. Swing through Queens, Brooklyn, and Manhattan.',
    backdrop: ss439,
    logoText: 'SPIDER-MAN 2',
    accentColor: '#e21b23',
    hours: '42 Hours Played',
    trophies: '84% Completed',
    cards: [
      { id: 'spidey-card-1', title: 'Resume: Main Quest', desc: 'A New Suit - 92% Completed', img: ss440 },
      { id: 'spidey-card-2', title: 'Photo Mode Capture', desc: 'Swinging over Central Park at sunset', img: ss445 }
    ]
  },
  'app-horizon': {
    title: 'Horizon Forbidden West',
    subtitle: 'Join Aloy as she braves the Forbidden West – a majestic but dangerous frontier.',
    backdrop: ss441,
    logoText: 'HORIZON',
    accentColor: '#00f0ff',
    hours: '68 Hours Played',
    trophies: '72% Completed',
    cards: [
      { id: 'horz-card-1', title: 'Resume: Side Quest', desc: 'The Drowned Hopes - Valley of the Fallen', img: ss442 },
      { id: 'horz-card-2', title: 'Arena Challenge', desc: 'Apex Clawstrider Hunter Battle', img: ss443 }
    ]
  },
  'app-gow': {
    title: 'God of War Ragnarök',
    subtitle: 'Embark on an epic journey with Kratos and Atreus as they search for answers.',
    backdrop: ss443,
    logoText: 'GOD OF WAR',
    accentColor: '#caaa60',
    hours: '53 Hours Played',
    trophies: '90% Completed',
    cards: [
      { id: 'gow-card-1', title: 'Resume: Muspelheim Trials', desc: 'Trial of Fire and Brimstone', img: ss444 },
      { id: 'gow-card-2', title: 'Vanaheim exploration', desc: 'Unlocks the Crater region hunts', img: ss439 }
    ]
  },
  'app-gta5': {
    title: 'Grand Theft Auto V',
    subtitle: 'Experience the story of Franklin, Michael and Trevor in Los Santos.',
    backdrop: ss445,
    logoText: 'GTA V',
    accentColor: '#1d8916',
    hours: '150 Hours Played',
    trophies: '65% Completed',
    cards: [
      { id: 'gta-card-1', title: 'Resume: Online Heist', desc: 'Cayo Perico Preparation', img: ss446 },
      { id: 'gta-card-2', title: 'Los Santos Customs', desc: 'Modified customized Supercar showcase', img: ss441 }
    ]
  },
  'app-mediagallery': {
    title: 'Media Gallery',
    subtitle: 'View, edit and share your gameplay screenshots and recordings.',
    backdrop: ss446,
    logoText: 'Media',
    accentColor: '#e0e0e0',
    hours: null,
    trophies: null,
    cards: [
      { id: 'media-card-1', title: 'Recent Captures', desc: 'Last recorded 4K HDR clip - 30 seconds', img: ss440 },
      { id: 'media-card-2', title: 'Shared Highlights', desc: 'Trophy capture automatically saved', img: ss444 }
    ]
  }
};

const LAUNCHER_APPS = [
  { id: 'app-psstore', name: 'PlayStation Store', isStore: true },
  { id: 'app-explore', name: 'Explore', isExplore: true },
  { id: 'app-astro', name: "Astro's Playroom" },
  { id: 'app-spiderman', name: "Spider-Man 2" },
  { id: 'app-horizon', name: "Horizon Forbidden West" },
  { id: 'app-gow', name: "God of War Ragnarök" },
  { id: 'app-gta5', name: "Grand Theft Auto V" },
  { id: 'app-mediagallery', name: "Media Gallery" }
];

export default function HomeScreen() {
  const {
    focusId,
    selectedUser,
    homeTab,
    setHomeTab,
    selectedGame,
    setSelectedGame,
    setIsPlayingGame,
    setActiveScreen,
    updateHomeFocus,
    userIndex
  } = useFocus();

  const [timeStr, setTimeStr] = useState('');

  // Update clock time
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12
      setTimeStr(`${hours}:${minutes} ${ampm}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeGameInfo = GAMES_DATA[selectedGame] || GAMES_DATA['app-astro'];

  const getAppIcon = (app) => {
    if (app.isStore) {
      return (
        <div className="app-icon-inner store-icon">
          <svg viewBox="0 0 100 100">
            <path d="M78,82 L22,82 L22,46 L78,46 L78,82 Z M50,18 C62,18 70,26 70,38 L70,46 L30,46 L30,38 C30,26 38,18 50,18 Z" fill="none" stroke="#FFF" strokeWidth="6" />
            <circle cx="50" cy="62" r="8" fill="#FFF" />
          </svg>
        </div>
      );
    }
    if (app.isExplore) {
      return (
        <div className="app-icon-inner explore-icon">
          <svg viewBox="0 0 100 100">
            <polygon points="50,12 80,45 80,82 20,82 20,45" fill="none" stroke="#FFF" strokeWidth="6" />
            <circle cx="50" cy="52" r="10" fill="#FFF" />
          </svg>
        </div>
      );
    }
    
    // Customize icons based on game ID
    const icons = {
      'app-astro': '#00b3ff',
      'app-spiderman': '#cc1111',
      'app-horizon': '#009b9e',
      'app-gow': '#ab945a',
      'app-gta5': '#2c692c',
      'app-mediagallery': '#4f4f4f'
    };
    const iconColors = {
      'app-astro': '#FFFFFF',
      'app-spiderman': '#FFFFFF',
      'app-horizon': '#FFFFFF',
      'app-gow': '#FFFFFF',
      'app-gta5': '#FFFFFF',
      'app-mediagallery': '#FFFFFF'
    };

    return (
      <div className="app-icon-inner game-icon" style={{ backgroundColor: icons[app.id] || '#222' }}>
        <div className="game-icon-letter" style={{ color: iconColors[app.id] }}>
          {app.name.charAt(0)}
        </div>
        <div className="game-icon-banner">{app.name}</div>
      </div>
    );
  };

  const handleAppClick = (appId) => {
    setSelectedGame(appId);
    // Enter details row/play
    const activeIdx = LAUNCHER_APPS.findIndex(a => a.id === appId);
    updateHomeFocus('apps', activeIdx);
    setIsPlayingGame(true);
    setActiveScreen('GAME_PLAY');
  };

  const handleSettingsClick = () => {
    setActiveScreen('SETTINGS');
  };

  return (
    <div className="home-dashboard-container">
      {/* Background Wallpaper with overlay shadow grids */}
      <div className="dynamic-backdrop-container">
        <img
          key={activeGameInfo.backdrop}
          src={activeGameInfo.backdrop}
          className="dynamic-backdrop-img active"
          alt="backdrop"
        />
        <div className="dynamic-backdrop-overlay" style={{
          background: `radial-gradient(circle at 80% 20%, transparent 10%, rgba(0,0,0,0.85) 80%),
                       linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 100%)`
        }} />
      </div>

      {/* Top Header Row */}
      <header className="home-header">
        <div className="header-left">
          <div className="ps5-logo-header">
            <svg viewBox="0 0 100 80" className="header-logo-svg">
              <path d="M38,5 C48,5 56,12 56,22 C56,32 48,39 38,39 L31,39 L31,65 L21,65 L21,5 L38,5 Z M38,15 L31,15 L31,29 L38,29 C42,29 46,26 46,22 C46,18 42,15 38,15 Z" fill="#FFFFFF" />
              <path d="M74,58 C85,58 92,62 92,67 C92,72 82,75 66,75 C42,75 14,71 14,64 L24,59 C24,62 38,65 58,65 C72,65 82,64 82,62 C82,60 76,59 66,59 C44,59 28,56 28,51 C28,46 44,43 66,43 C84,43 94,46 94,49 L84,54 C84,52 76,51 64,51 C50,51 38,52 38,54 C38,56 46,57 58,57 L74,58 Z" fill="#FFFFFF" opacity="0.8" />
            </svg>
          </div>
          <nav className="header-tabs">
            <span
              id="tab-games"
              className={`header-tab ${homeTab === 'games' ? 'active' : ''} ${focusId === 'tab-games' ? 'focused' : ''}`}
              onClick={() => setHomeTab('games')}
            >
              Games
            </span>
            <span
              id="tab-media"
              className={`header-tab ${homeTab === 'media' ? 'active' : ''} ${focusId === 'tab-media' ? 'focused' : ''}`}
              onClick={() => setHomeTab('media')}
            >
              Media
            </span>
          </nav>
        </div>

        <div className="header-right">
          <div className="header-icons">
            <span id="header-search" className={`header-icon-wrapper ${focusId === 'header-search' ? 'focused' : ''}`}>
              <svg viewBox="0 0 24 24" className="header-icon"><path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" fill="#FFF" /></svg>
            </span>
            <span
              id="header-settings"
              className={`header-icon-wrapper ${focusId === 'header-settings' ? 'focused' : ''}`}
              onClick={handleSettingsClick}
            >
              <svg viewBox="0 0 24 24" className="header-icon"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.47,5.34 14.86,5.08L14.47,2.42C14.43,2.18 14.22,2 13.97,2H9.97C9.72,2 9.51,2.18 9.47,2.42L9.08,5.08C8.47,5.34 7.9,5.66 7.38,6.05L4.89,5.05C4.67,4.96 4.4,5.05 4.28,5.27L2.28,8.73C2.16,8.95 2.21,9.22 2.4,9.37L4.51,11C4.47,11.34 4.5,11.67 4.5,12C4.5,12.33 4.47,12.65 4.51,12.97L2.4,14.63C2.21,14.78 2.16,15.05 2.28,15.27L4.28,18.73C4.4,18.95 4.67,19.04 4.89,18.95L7.38,17.95C7.9,18.34 8.47,18.66 9.08,18.92L9.47,21.58C9.51,21.82 9.72,22 9.97,22H13.97C14.22,22 14.43,21.82 14.47,21.58L14.86,18.92C15.47,18.66 16.04,18.34 16.56,17.95L19.05,18.95C19.27,19.04 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" fill="#FFF" /></svg>
            </span>
            <span id="header-profile" className={`header-icon-wrapper profile-tab ${focusId === 'header-profile' ? 'focused' : ''}`}>
              <div className="header-avatar-circle" style={{
                backgroundColor: selectedUser === 'Astro' ? '#e1f5fe' : selectedUser === 'Peter Parker' ? '#ffebee' : selectedUser === 'Aloy' ? '#e0f2f1' : '#eceff1'
              }}>
                <span className="profile-initial">{selectedUser ? selectedUser.charAt(0) : 'U'}</span>
              </div>
              <span className="profile-name-text">{selectedUser || 'User'}</span>
            </span>
            <span id="header-power" className={`header-icon-wrapper ${focusId === 'header-power' ? 'focused' : ''}`}>
              <svg viewBox="0 0 24 24" className="header-icon"><path d="M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.18,7.16 3.75,9.91 3.75,13A8.25,8.25 0 0,0 12,21.25A8.25,8.25 0 0,0 20.25,13C20.25,9.91 18.82,7.16 16.56,5.44M11.25,3H12.75V13H11.25V3Z" fill="#FFF" /></svg>
            </span>
          </div>
          <div className="header-clock">{timeStr}</div>
        </div>
      </header>

      {/* Main Apps Launcher Row */}
      <section className="home-launcher-section">
        <div className="home-launcher-row">
          {LAUNCHER_APPS.map((app, idx) => {
            const appId = app.id;
            const isFocused = focusId === appId;
            const isSelected = selectedGame === appId;
            
            return (
              <div
                key={appId}
                id={appId}
                className={`app-icon-card ${isFocused ? 'focused' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => handleAppClick(appId)}
                onMouseEnter={() => {
                  setSelectedGame(appId);
                  updateHomeFocus('apps', idx);
                }}
              >
                {getAppIcon(app)}
                {isFocused && <div className="app-icon-glow" style={{ borderColor: activeGameInfo.accentColor }} />}
              </div>
            );
          })}
        </div>
      </section>

      {/* Game Details Overlay (Play Button, Stats, Activity Cards) */}
      <section className="home-details-section">
        <div className="details-header-anim" key={selectedGame}>
          <h2 className="game-detail-title">{activeGameInfo.title}</h2>
          <p className="game-detail-subtitle">{activeGameInfo.subtitle}</p>

          <div className="detail-meta-row">
            {activeGameInfo.hours && (
              <span className="game-meta-item hours-played">
                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" fill="#FFF" /></svg>
                {activeGameInfo.hours}
              </span>
            )}
            {activeGameInfo.trophies && (
              <span className="game-meta-item trophies-progress">
                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M18,2H16V4H13V9C13,11.03 11.5,12.72 9.61,12.96C10.5,14 11.23,15.28 11.66,16.72C14.73,15.65 17,12.63 17,9V4H16V2M11,2H9V4H6V9C6,11.03 7.5,12.72 9.39,12.96C8.5,14 7.77,15.28 7.34,16.72C4.27,15.65 2,12.63 2,9V4H3V2M9.66,16.3C9.88,16.12 10.12,16 10.38,15.93C9.81,14.78 9.5,13.5 9.5,12.16C9.5,10.66 9.88,9.25 10.55,8C9,8.5 7.6,9.5 6.64,10.8C6.1,11.53 5.72,12.38 5.56,13.3C7.03,14.88 8.44,15.9 9.66,16.3Z" fill="#FFF" /></svg>
                {activeGameInfo.trophies}
              </span>
            )}
          </div>
        </div>

        <div className="details-actions-row">
          <button
            id="btn-play"
            className={`play-game-btn ${focusId === 'btn-play' ? 'focused' : ''}`}
            onClick={() => {
              setIsPlayingGame(true);
              setActiveScreen('GAME_PLAY');
            }}
          >
            Play
          </button>
          
          <div className="activity-cards-row">
            {activeGameInfo.cards.map((card, idx) => {
              const cardId = card.id;
              const isFocused = focusId === (idx === 0 ? 'card-trophy' : 'card-news');
              return (
                <div
                  key={cardId}
                  id={idx === 0 ? 'card-trophy' : 'card-news'}
                  className={`activity-card ${isFocused ? 'focused' : ''}`}
                >
                  <div className="card-image-wrapper">
                    <img src={card.img} alt={card.title} className="card-thumb" />
                    <div className="card-image-gradient" />
                  </div>
                  <div className="card-content">
                    <span className="card-category">{idx === 0 ? 'ACTIVITY' : 'OFFICIAL NEWS'}</span>
                    <h4 className="card-title">{card.title}</h4>
                    <p className="card-desc">{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer Navigation Hints */}
      <footer className="home-footer-nav">
        <div className="footer-control-helper">
          Press <span className="keyboard-key">Esc</span> to open Control Center (PS Menu)
        </div>
        <div className="footer-buttons-helper">
          <span className="keyboard-key">Enter</span> Select &bull; <span className="keyboard-key">Backspace</span> Log Out &bull; <span className="keyboard-key">↑</span> <span className="keyboard-key">↓</span> <span className="keyboard-key">←</span> <span className="keyboard-key">→</span> Navigate
        </div>
      </footer>
    </div>
  );
}
