import React, { useEffect, useState } from 'react';
import { useFocus } from '../context/FocusContext';

// Import game screenshots for high-quality background
import ss438 from '../assets/screenshots/Screenshot (438).png';
import ss440 from '../assets/screenshots/Screenshot (440).png';
import ss442 from '../assets/screenshots/Screenshot (442).png';
import ss444 from '../assets/screenshots/Screenshot (444).png';
import ss446 from '../assets/screenshots/Screenshot (446).png';

const GAME_METADATA = {
  'app-astro': { name: "Astro's Playroom", bg: ss438, color: '#00d2ff', action: 'Jump', sound: 'jump' },
  'app-spiderman': { name: "Marvel's Spider-Man 2", bg: ss440, color: '#e21b23', action: 'Swing Web', sound: 'web' },
  'app-horizon': { name: 'Horizon Forbidden West', bg: ss442, color: '#00f0ff', action: 'Shoot Bow', sound: 'bow' },
  'app-gow': { name: 'God of War Ragnarök', bg: ss444, color: '#caaa60', action: 'Axe Slash', sound: 'axe' },
  'app-gta5': { name: 'Grand Theft Auto V', bg: ss446, color: '#1d8916', action: 'Rev Engine', sound: 'car' }
};

export default function GamePlayerScreen() {
  const { selectedGame, setActiveScreen, setIsPlayingGame, updateHomeFocus } = useFocus();
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [actionPulse, setActionPulse] = useState(false);
  const [spritePos, setSpritePos] = useState({ x: 50, y: 60 });

  const meta = GAME_METADATA[selectedGame] || GAME_METADATA['app-astro'];

  // Simulate loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Synthesize game-specific SFX using Web Audio API
  const playSFX = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      
      if (type === 'jump') {
        // Sliding pitch up
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.15);
        osc.start();
        osc.stop(now + 0.15);
      } else if (type === 'web') {
        // High frequency white-noise-like click & sweep
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2000, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.12);
        osc.start();
        osc.stop(now + 0.12);
      } else if (type === 'bow') {
        // Quick high to low click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.linearRampToValueAtTime(400, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
        osc.start();
        osc.stop(now + 0.08);
      } else if (type === 'axe') {
        // Low distorted rumble sweep
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.25);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.25);
        osc.start();
        osc.stop(now + 0.25);
      } else {
        // Engine rev (modulated frequencies)
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.linearRampToValueAtTime(320, now + 0.35);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.35);
        osc.start();
        osc.stop(now + 0.35);
      }
    } catch (e) {}
  };

  // Capture local keystrokes for simulated gameplay
  useEffect(() => {
    if (loading) return;

    const handleGameInput = (e) => {
      if (e.key === 'Backspace' || e.key === 'Escape') return; // Handled by global listener

      if (e.key === 'Enter') {
        playSFX(meta.sound);
        setScore(prev => prev + 100);
        setActionPulse(true);
        setTimeout(() => setActionPulse(false), 200);
      }

      // Move player character sprite on screen
      let { x, y } = spritePos;
      if (e.key === 'ArrowLeft') x = Math.max(10, x - 5);
      if (e.key === 'ArrowRight') x = Math.min(90, x + 5);
      if (e.key === 'ArrowUp') y = Math.max(20, y - 5);
      if (e.key === 'ArrowDown') y = Math.min(80, y + 5);
      
      if (x !== spritePos.x || y !== spritePos.y) {
        setSpritePos({ x, y });
      }
    };

    window.addEventListener('keydown', handleGameInput);
    return () => window.removeEventListener('keydown', handleGameInput);
  }, [loading, spritePos, meta]);

  const handleExit = () => {
    setIsPlayingGame(false);
    setActiveScreen('HOME');
    updateHomeFocus('apps', selectedGame === 'app-astro' ? 2 : 3);
  };

  if (loading) {
    return (
      <div className="game-player-loading-container" style={{ backgroundColor: meta.color }}>
        <div className="game-loading-logo">
          <h1>{meta.name}</h1>
          <p className="loading-sub">Loading Game Assets...</p>
        </div>
        <div className="ps5-loading-spinner" />
      </div>
    );
  }

  return (
    <div className="game-player-screen-container" style={{ backgroundImage: `url(${meta.bg})` }}>
      <div className="game-overlay-vignette" />
      
      {/* Game HUD Header */}
      <div className="game-hud-header">
        <div className="hud-score">
          <span className="label">SCORE:</span>
          <span className="value">{score}</span>
        </div>
        <div className="hud-title">{meta.name}</div>
        <div className="hud-lives">
          <span className="label">HEALTH:</span>
          <div className="health-bar-bg">
            <div className="health-bar-fill" style={{ width: '85%' }} />
          </div>
        </div>
      </div>

      {/* Simulated Player Character Sprite */}
      <div
        className={`game-player-sprite ${actionPulse ? 'action-pulse' : ''}`}
        style={{
          left: `${spritePos.x}%`,
          top: `${spritePos.y}%`,
          borderColor: meta.color,
          boxShadow: `0 0 20px ${meta.color}`
        }}
      >
        <span className="character-indicator">★</span>
      </div>

      {/* Interactive Controls Overlay */}
      <div className="game-controls-helper">
        <div className="controls-box">
          <div className="control-instruction">
            <span className="keyboard-key">←</span>
            <span className="keyboard-key">→</span>
            <span className="keyboard-key">↑</span>
            <span className="keyboard-key">↓</span> Move Character
          </div>
          <div className="control-instruction">
            <span className="keyboard-key">Enter</span> {meta.action}
          </div>
          <div className="control-instruction">
            <span className="keyboard-key">Backspace</span> Exit Game
          </div>
        </div>
      </div>

      <button className="game-exit-btn-top-right" onClick={handleExit}>
        Exit to PS5 Dashboard
      </button>
    </div>
  );
}
