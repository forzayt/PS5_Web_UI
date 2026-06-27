import React, { useEffect, useState } from 'react';
import { useFocus } from '../context/FocusContext';
import { playTick, playSelect, playBack } from '../utils/AudioSystem';

export default function GameDetailsScreen() {
  const { selectedGame, setActiveScreen } = useFocus();
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    if (!selectedGame) {
      setActiveScreen('DASHBOARD');
      return;
    }

    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        playBack();
        setActiveScreen('DASHBOARD');
      } else if (e.key === 'Enter') {
        playSelect();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedGame, setActiveScreen]);

  if (!selectedGame) return null;

  return (
    <div className="details-container">
      {/* Background with crossfade (reusing the screenshots) */}
      <div className="details-bg" style={{ backgroundImage: `url(${selectedGame.screenshots?.[bgIndex] || selectedGame.heroBackground})` }} />
      <div className="details-overlay" />

      {/* Top Header */}
      <header className="details-header">
        <div className="details-game-mini">
          <img src={selectedGame.cover} alt="" className="details-mini-icon" />
          <span className="details-mini-title">{selectedGame.title}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="details-main">
        <div className="details-left">
          <div className="details-edition">Standard Edition</div>
          <h1 className="details-title">{selectedGame.title}</h1>
          
          <div className="details-actions">
            <button className="details-btn-buy focused" onClick={playSelect}>
              {selectedGame.price || 'Free'}
            </button>
            <button className="details-btn-wishlist" onClick={playSelect}>
              <span className="heart-icon">❤</span> Wishlist +
            </button>
            <button className="details-btn-more" onClick={playSelect}>...</button>
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
            <div key={i} className="details-media-tile">
              <img src={ss} alt="" />
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
