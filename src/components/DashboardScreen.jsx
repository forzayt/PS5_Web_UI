import React, { useEffect, useState, useRef } from 'react';
import { useFocus } from '../context/FocusContext';
import { playTick, playSelect, playBack, stopMusic } from '../utils/AudioSystem';
import gamesData from '../data/games.json';
import mediaData from '../data/media.json';

// ──────────────────────────────────────────────────────────────────────────────
// SVG Icon Components
// ──────────────────────────────────────────────────────────────────────────────
function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Dashboard
// ──────────────────────────────────────────────────────────────────────────────
export default function DashboardScreen() {
  const { activeUser, setActiveScreen } = useFocus();
  const [activeTab, setActiveTab] = useState('games');
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Hero crossfade state
  const [heroBgColor, setHeroBgColor]   = useState('#020308');
  const [heroAccent, setHeroAccent]     = useState('#ffffff');
  
  const [bg1, setBg1] = useState('');
  const [bg2, setBg2] = useState('');
  const [showBg2, setShowBg2] = useState(false);
  const [heroFading, setHeroFading]     = useState(false);

  const [screenshotIndex, setScreenshotIndex] = useState(0);

  const [timeStr, setTimeStr] = useState('');
  const tileRowRef = useRef(null);

  // Steam Game Fetching State
  const [fetchedGames, setFetchedGames] = useState([]);
  const [isLoadingGames, setIsLoadingGames] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      if (!gamesData || gamesData.length === 0) return;
      setIsLoadingGames(true);
      try {
        const games = await Promise.all(
          gamesData.map(async (id) => {
            try {
              const steamUrl = `/api/steam/appdetails?appids=${id}`;
              const response = await fetch(steamUrl);
              if (!response.ok) throw new Error('Network response was not ok');
              const data = await response.json();
              
              if (data && data[id]?.success) {
                 const game = data[id].data;
                 return {
                   id: id,
                   title: game.name,
                   cover: game.header_image,
                   heroBackground: game.background || game.header_image,
                   screenshots: game.screenshots ? game.screenshots.map(s => s.path_full) : [game.background || game.header_image],
                   tagline: game.short_description.replace(/<[^>]*>?/gm, ''), // Remove HTML tags
                   heroColor: '#0a0a0a', 
                   accentColor: '#ffffff',
                   badge: 'PS5'
                 };
               }
            } catch (err) {
              console.error(`Failed to fetch game ${id}:`, err);
            }
            return null;
          })
        );
        const validGames = games.filter(Boolean);
        if (validGames.length > 0) {
          setFetchedGames(validGames);
        }
      } catch (error) {
        console.error('Error fetching Steam games:', error);
      } finally {
        setIsLoadingGames(false);
      }
    };

    fetchGames();
  }, []);

  const items       = activeTab === 'games' ? (fetchedGames.length > 0 ? fetchedGames : []) : mediaData.media;
  const focusedItem = items[Math.min(focusedIndex, items.length - 1)];

  // ── Seed initial hero ────────────────────────────────────────────────────
  useEffect(() => {
    if (focusedItem) {
      const bg = (focusedItem.screenshots && focusedItem.screenshots.length > 0) 
        ? focusedItem.screenshots[0] 
        : (focusedItem.heroBackground || focusedItem.cover || '');
      setBg1(bg);
      setHeroBgColor(focusedItem.heroColor || '#020308');
      setHeroAccent(focusedItem.accentColor || '#ffffff');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Hero crossfade when selection changes ────────────────────────────────
  useEffect(() => {
    if (!focusedItem) return;
    setScreenshotIndex(0);
    setHeroFading(true);
    
    // Fade out text info
    const t1 = setTimeout(() => {
      const bg = (focusedItem.screenshots && focusedItem.screenshots.length > 0) 
        ? focusedItem.screenshots[0] 
        : (focusedItem.heroBackground || focusedItem.cover || '');
      
      // Update background with crossfade
      if (showBg2) {
        setBg1(bg);
        setShowBg2(false);
      } else {
        setBg2(bg);
        setShowBg2(true);
      }

      setHeroBgColor(focusedItem.heroColor || '#020308');
      setHeroAccent(focusedItem.accentColor || '#ffffff');
      setHeroFading(false);
    }, 260);
    
    return () => clearTimeout(t1);
  }, [focusedIndex, activeTab, focusedItem]);

  // ── Screenshot cycling ───────────────────────────────────────────────────
  useEffect(() => {
    if (!focusedItem || !focusedItem.screenshots || focusedItem.screenshots.length <= 1) return;

    const interval = setInterval(() => {
      setScreenshotIndex(prev => {
        const next = (prev + 1) % focusedItem.screenshots.length;
        const nextUrl = focusedItem.screenshots[next];
        
        if (showBg2) {
          setBg1(nextUrl);
          setShowBg2(false);
        } else {
          setBg2(nextUrl);
          setShowBg2(true);
        }
        
        return next;
      });
    }, 4000); // 2 seconds to show, 2 seconds to fade

    return () => clearInterval(interval);
  }, [focusedItem, showBg2]);

  // ── Scroll focused tile into view ────────────────────────────────────────
  useEffect(() => {
    if (!tileRowRef.current) return;
    const el = tileRowRef.current.children[focusedIndex];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [focusedIndex]);

  // ── Real-time clock ──────────────────────────────────────────────────────
  useEffect(() => {
    const fmt = () => {
      const d  = new Date();
      let h    = d.getHours();
      const m  = d.getMinutes();
      const ap = h >= 12 ? 'PM' : 'AM';
      h        = h % 12 || 12;
      const mm = m < 10 ? `0${m}` : m;
      setTimeStr(`${h}:${mm} ${ap}`);
    };
    fmt();
    const iv = setInterval(fmt, 30000);
    return () => clearInterval(iv);
  }, []);

  // ── Keyboard navigation ──────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') {
        const next = Math.max(0, focusedIndex - 1);
        if (next !== focusedIndex) { playTick(); setFocusedIndex(next); }
      } else if (e.key === 'ArrowRight') {
        const next = Math.min(items.length - 1, focusedIndex + 1);
        if (next !== focusedIndex) { playTick(); setFocusedIndex(next); }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        playTick();
        setActiveTab(t => t === 'games' ? 'media' : 'games');
        setFocusedIndex(0);
      } else if (e.key === 'Enter') {
        playSelect();
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        playBack();
        stopMusic();
        setActiveScreen('LOGIN');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focusedIndex, items.length, activeTab]);

  return (
    <div className="dashboard-container">

      {/* ── Background ─────────────────────────────────────── */}
      <div className="dashboard-hero-bg-layers">
        <div
          className="dashboard-hero-bg"
          style={{
            backgroundImage : bg1 ? `url(${bg1})` : 'none',
            backgroundColor : heroBgColor,
            opacity: showBg2 ? 0 : 1,
          }}
        />
        <div
          className="dashboard-hero-bg"
          style={{
            backgroundImage : bg2 ? `url(${bg2})` : 'none',
            backgroundColor : heroBgColor,
            opacity: showBg2 ? 1 : 0,
          }}
        />
      </div>
      
      {/* Dark readability gradients */}
      <div className="dashboard-hero-overlay-top" />
      <div className="dashboard-hero-overlay-bottom" />
      <div className="dashboard-hero-overlay-left" />

      {/* ── Top navigation bar ─────────────────────────────────────────────── */}
      <header className="dashboard-topbar">
        <nav className="dashboard-tabs" role="tablist">
          <button
            id="tab-games"
            role="tab"
            aria-selected={activeTab === 'games'}
            className={`dash-tab${activeTab === 'games' ? ' active' : ''}`}
            onClick={() => { setActiveTab('games'); setFocusedIndex(0); }}
          >
            Games
          </button>
          <button
            id="tab-media"
            role="tab"
            aria-selected={activeTab === 'media'}
            className={`dash-tab${activeTab === 'media' ? ' active' : ''}`}
            onClick={() => { setActiveTab('media'); setFocusedIndex(0); }}
          >
            Media
          </button>
        </nav>

        <div className="dashboard-topbar-right">
          <button className="topbar-icon-btn" aria-label="Search">
            <SearchIcon />
          </button>
          <button className="topbar-icon-btn" aria-label="Settings">
            <SettingsIcon />
          </button>
          {/* User avatar */}
          <div className="topbar-user" title={activeUser?.username || ''}>
            {activeUser?.dp
              ? <img src={activeUser.dp} alt={activeUser.username} className="topbar-avatar" />
              : <div className="topbar-avatar-placeholder">{activeUser?.username?.[0] || '?'}</div>
            }
          </div>
          <span className="topbar-clock" aria-live="polite">{timeStr}</span>
        </div>
      </header>

      {/* ── Main Content Area ───────────────────────────────────────────── */}
      <div className="dashboard-main-content">
        
        {/* Tile Row */}
        <div className="dashboard-row-wrapper">
          <div className="dashboard-tile-row" ref={tileRowRef} role="listbox">
            {isLoadingGames && activeTab === 'games' ? (
              <div className="loading-games">
                <div className="spinner"></div>
                <span>Fetching Steam Games...</span>
              </div>
            ) : (
              items.map((item, i) => (
                <div
                  key={item.id}
                  role="option"
                  aria-selected={i === focusedIndex}
                  className={`dashboard-tile${i === focusedIndex ? ' focused' : ''}`}
                  onClick={() => { if (i !== focusedIndex) { playTick(); setFocusedIndex(i); } }}
                  onMouseEnter={() => { if (i !== focusedIndex) { playTick(); setFocusedIndex(i); } }}
                >
                  {item.cover ? (
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="tile-cover-img"
                      onError={e => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <div
                      className="tile-media-bg"
                      style={{ background: `linear-gradient(135deg, ${item.heroColor} 0%, ${item.accentColor} 100%)` }}
                    >
                      <span className="tile-media-icon">{item.icon}</span>
                    </div>
                  )}
                  {item.badge && <span className="tile-badge">{item.badge}</span>}
                </div>
              ))
            )}
          </div>
          
          {focusedItem && (
            <div className="focused-item-info">
              <span className="focused-item-name">{focusedItem.title}</span>
              {focusedItem.badge === 'pre-installed' && (
                <span className="disc-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/></svg>
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Hero Game Info (Bottom Left) ─────────────────────────────────── */}
        <div className={`hero-details-container ${heroFading ? 'fading' : ''}`}>
          <div className="hero-game-logo">
             {/* Using title text as a fallback for logo image */}
             <h1 className="hero-title-text">{focusedItem?.title}</h1>
          </div>
          
          <p className="hero-tagline">{focusedItem?.tagline}</p>
          
          <div className="hero-actions">
            <button className="btn-play" onClick={playSelect}>
              Play
            </button>
            <button className="btn-more">
              <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard hint bar */}
      <div className="dashboard-hint-bar" aria-hidden="true">
        <span><kbd>← →</kbd> Navigate</span>
        <span><kbd>Tab</kbd> Switch Tab</span>
        <span><kbd>Enter</kbd> Play</span>
        <span><kbd>Esc</kbd> Back</span>
      </div>
    </div>
  );
}
