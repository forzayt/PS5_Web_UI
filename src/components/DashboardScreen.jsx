import React, { useEffect, useState, useRef } from 'react';
import { useFocus } from '../context/FocusContext';
import { playTick, playSelect, playBack, stopMusic } from '../utils/AudioSystem';
import gamesData from '../data/games.json';
import mediaData from '../data/media.json';
import quickActionsData from '../data/quickActions.json';

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

// PlayStation Plus badge
function PsPlus() {
  return (
    <span className="topbar-ps-plus" title="PlayStation Plus">
      <svg viewBox="0 0 20 20" fill="none">
        <rect width="20" height="20" rx="4" fill="#f1bf00"/>
        <text x="10" y="15" textAnchor="middle" fill="#000" fontSize="12" fontWeight="900" fontFamily="Arial">+</text>
      </svg>
    </span>
  );
}

// Quick-action SVG icons
function QuickActionIcon({ type }) {
  if (type === 'bag') return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
  if (type === 'controller') return (
    <svg viewBox="0 0 32 32" fill="currentColor">
      <path d="M22.5 8h-13C6.46 8 4 10.46 4 13.5v5c0 2.22 1.3 4.13 3.17 4.96C8 26.54 11 27 11 27l2.5-3.5h5l2.5 3.5s3-.46 3.83-3.54C26.7 22.63 28 20.72 28 18.5v-5C28 10.46 25.54 8 22.5 8zM9.5 17h-1.5v-1.5h-1v-1h1.5v-1.5h1v1.5h1.5v1H9.5V17zm10.5-2.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
    </svg>
  );
  if (type === 'grid') return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
  if (type === 'trophy') return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 21 16 21"/><line x1="12" y1="17" x2="12" y2="21"/>
      <path d="M7 4H2v4c0 2.76 2.24 5 5 5h.5M17 4h5v4c0 2.76-2.24 5-5 5h-.5"/>
      <path d="M7 4h10v8a5 5 0 01-10 0V4z"/>
    </svg>
  );
  return null;
}

// ──────────────────────────────────────────────────────────────────────────────
// Dashboard
// ──────────────────────────────────────────────────────────────────────────────
export default function DashboardScreen() {
  const { activeUser, setActiveScreen } = useFocus();
  const [activeTab, setActiveTab] = useState('games');
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Hero crossfade state
  const [heroCover, setHeroCover]       = useState('');
  const [heroBgColor, setHeroBgColor]   = useState('#020308');
  const [heroAccent, setHeroAccent]     = useState('#ffffff');
  const [heroFading, setHeroFading]     = useState(false);

  const [timeStr, setTimeStr] = useState('');
  const tileRowRef = useRef(null);

  const items       = activeTab === 'games' ? gamesData.games : mediaData.media;
  const focusedItem = items[Math.min(focusedIndex, items.length - 1)];

  // ── Seed initial hero ────────────────────────────────────────────────────
  useEffect(() => {
    if (focusedItem) {
      setHeroCover(focusedItem.cover || '');
      setHeroBgColor(focusedItem.heroColor || '#020308');
      setHeroAccent(focusedItem.accentColor || '#ffffff');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Hero crossfade when selection changes ────────────────────────────────
  useEffect(() => {
    if (!focusedItem) return;
    setHeroFading(true);
    const t = setTimeout(() => {
      setHeroCover(focusedItem.cover || '');
      setHeroBgColor(focusedItem.heroColor || '#020308');
      setHeroAccent(focusedItem.accentColor || '#ffffff');
      setHeroFading(false);
    }, 260);
    return () => clearTimeout(t);
  }, [focusedIndex, activeTab]);

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

      {/* ── Ambient blurred background ─────────────────────────────────────── */}
      <div
        className="dashboard-hero-bg"
        style={{
          backgroundImage : heroCover ? `url(${heroCover})` : 'none',
          backgroundColor : heroBgColor,
        }}
      />
      {/* Colour-tinted radial glow from the right */}
      <div
        className="dashboard-hero-tint"
        style={{ '--accent': heroAccent }}
      />
      {/* Dark left-side readability gradient */}
      <div className="dashboard-hero-overlay" />

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

      {/* ── Game / Media tile row ───────────────────────────────────────────── */}
      <div className="dashboard-row-wrapper">
        <div className="dashboard-tile-row" ref={tileRowRef} role="listbox">
          {items.map((item, i) => (
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
          ))}

          {/* Quick-action system tiles (circular buttons) */}
          {quickActionsData.quickActions.map(action => (
            <div
              key={action.id}
              className="dashboard-tile quick-action-tile"
              title={action.label}
              aria-label={action.label}
            >
              <QuickActionIcon type={action.icon} />
            </div>
          ))}
        </div>

        {/* Label row below focused tile */}
        <div className="dashboard-tile-label">
          <span className="tile-label-title">{focusedItem?.title}</span>
          <button className="tile-label-more" aria-label="More options">•••</button>
        </div>
      </div>

      {/* ── Hero character art — right side ────────────────────────────────── */}
      {focusedItem?.cover && (
        <div className={`dashboard-hero-cover${heroFading ? ' fading' : ''}`}>
          <img
            src={focusedItem.cover}
            alt={focusedItem.title}
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      )}

      {/* ── Hero text + actions — bottom left ─────────────────────────────── */}
      <div
        className={`dashboard-hero-content${heroFading ? ' fading' : ''}`}
        style={{ '--hero-accent': heroAccent }}
      >
        {focusedItem?.subtitle ? (
          <div className="hero-logo-lockup">
            <span className="hero-game-brand">{focusedItem.shortTitle}</span>
            <span className="hero-game-subtitle">{focusedItem.subtitle}</span>
          </div>
        ) : (
          <p className="hero-game-title">{focusedItem?.title}</p>
        )}

        <p className="hero-tagline">{focusedItem?.tagline}</p>

        <div className="hero-actions">
          <button id="btn-play" className="hero-btn-play" onClick={playSelect}>
            Play
          </button>
          <button id="btn-more" className="hero-btn-more" aria-label="More options">
            •••
          </button>
        </div>
      </div>

      {/* ── Keyboard hint bar ──────────────────────────────────────────────── */}
      <div className="dashboard-hint-bar" aria-hidden="true">
        <span><kbd>← →</kbd> Navigate</span>
        <span><kbd>Tab</kbd> Switch Tab</span>
        <span><kbd>Enter</kbd> Play</span>
        <span><kbd>Esc</kbd> Back</span>
      </div>
    </div>
  );
}
