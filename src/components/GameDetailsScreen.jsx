import React, { useEffect, useState } from 'react';
import { useFocus } from '../context/FocusContext';
import { playTick, playSelect, playBack } from '../utils/AudioSystem';

export default function GameDetailsScreen() {
  const { selectedGame, setActiveScreen } = useFocus();
  const [bgIndex, setBgIndex] = useState(0);
  
  // Navigation State
  const [focusedSection, setFocusedSection] = useState('MAIN_ACTIONS'); // 'HEADER', 'MAIN_ACTIONS', 'MEDIA'
  const [mainActionIndex, setMainActionIndex] = useState(0); // 0: Buy, 1: Wishlist, 2: More
  const [mediaIndex, setMediaIndex] = useState(0);

  useEffect(() => {
    if (!selectedGame) {
      setActiveScreen('DASHBOARD');
      return;
    }

    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        playBack();
        setActiveScreen('DASHBOARD');
      } else if (focusedSection === 'HEADER') {
        if (e.key === 'ArrowDown') {
          playTick();
          setFocusedSection('MAIN_ACTIONS');
        } else if (e.key === 'Enter') {
          playBack();
          setActiveScreen('DASHBOARD');
        }
      } else if (focusedSection === 'MAIN_ACTIONS') {
        if (e.key === 'ArrowUp') {
          playTick();
          setFocusedSection('HEADER');
        } else if (e.key === 'ArrowDown') {
          playTick();
          setFocusedSection('MEDIA');
        } else if (e.key === 'ArrowLeft') {
          const next = Math.max(0, mainActionIndex - 1);
          if (next !== mainActionIndex) { playTick(); setMainActionIndex(next); }
        } else if (e.key === 'ArrowRight') {
          const next = Math.min(2, mainActionIndex + 1);
          if (next !== mainActionIndex) { playTick(); setMainActionIndex(next); }
        } else if (e.key === 'Enter') {
          playSelect();
        }
      } else if (focusedSection === 'MEDIA') {
        if (e.key === 'ArrowUp') {
          playTick();
          setFocusedSection('MAIN_ACTIONS');
        } else if (e.key === 'ArrowLeft') {
          const next = Math.max(0, mediaIndex - 1);
          if (next !== mediaIndex) { playTick(); setMediaIndex(next); }
        } else if (e.key === 'ArrowRight') {
          const next = Math.min((selectedGame.screenshots?.length || 1) - 1, mediaIndex + 1);
          if (next !== mediaIndex) { playTick(); setMediaIndex(next); }
        } else if (e.key === 'Enter') {
          playSelect();
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedGame, setActiveScreen, focusedSection, mainActionIndex, mediaIndex]);

  if (!selectedGame) return null;

  return (
    <div className="details-container">
      {/* Background with crossfade (reusing the screenshots) */}
      <div className="details-bg" style={{ backgroundImage: `url(${selectedGame.screenshots?.[bgIndex] || selectedGame.heroBackground})` }} />
      <div className="details-overlay" />

      {/* Top Header */}
      <header className="details-header">
        <button 
          className={`details-back-btn ${focusedSection === 'HEADER' ? 'focused' : ''}`}
          onClick={() => { playBack(); setActiveScreen('DASHBOARD'); }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div className="details-game-mini">
          <img src={selectedGame.cover} alt="" className="details-mini-icon" />
          <span className="details-mini-title">{selectedGame.title}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="details-main">
        <div className="details-left">
          <div className="details-edition">Standard Edition</div>
          {selectedGame.logo ? (
            <img src={selectedGame.logo} alt={selectedGame.title} className="details-logo-img" />
          ) : (
            <h1 className="details-title">{selectedGame.title}</h1>
          )}
          
          <div className="details-actions">
            <button 
              className={`details-btn-buy ${focusedSection === 'MAIN_ACTIONS' && mainActionIndex === 0 ? 'focused' : ''}`} 
              onClick={playSelect}
            >
              {selectedGame.price || 'Free'}
            </button>
            <button 
              className={`details-btn-wishlist ${focusedSection === 'MAIN_ACTIONS' && mainActionIndex === 1 ? 'focused' : ''}`} 
              onClick={playSelect}
            >
              <span className="heart-icon">❤</span> Wishlist +
            </button>
            <button 
              className={`details-btn-more ${focusedSection === 'MAIN_ACTIONS' && mainActionIndex === 2 ? 'focused' : ''}`} 
              onClick={playSelect}
            >
              ...
            </button>
          </div>

          <div className="details-rating-row">
            <div className="rating-box">M</div>
            <div className="rating-text">
              Blood and Gore, Drug Reference, Intense Violence, Sexual Themes, Strong Language, Use of Alcohol
            </div>
          </div>
          <div className="details-sub-info">In-Game Purchases, Users Interact</div>
        </div>

        <div className="details-right">
          <div className="details-info-card">
            <div className="info-publisher">{selectedGame.publisher}</div>
            <div className="info-item">
              <span className="info-icon">🕒</span>
              <span>Release: {selectedGame.releaseDate}</span>
            </div>
            <div className="info-item">
              <span className="info-icon">✚</span>
              <span>PS Plus required for online play</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🎮</span>
              <span>In-game purchases optional</span>
            </div>
            <div className="info-item">
              <span className="info-icon">💾</span>
              <span>50 GB minimum</span>
            </div>
            <div className="info-item">
              <span className="info-icon">📳</span>
              <span>Vibration function and trigger effect required</span>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Media Section */}
      <footer className="details-footer">
        <h2 className="footer-label">Media</h2>
        <div className="details-media-row">
          {selectedGame.screenshots?.slice(0, 4).map((ss, i) => (
            <div 
              key={i} 
              className={`details-media-tile ${focusedSection === 'MEDIA' && mediaIndex === i ? 'focused' : ''}`}
            >
              <img src={ss} alt="" />
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
