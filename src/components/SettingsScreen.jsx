import React from 'react';
import { useFocus } from '../context/FocusContext';

export default function SettingsScreen() {
  const { focusId, settingsIndex, settingsList, setCurrentTheme, currentTheme, setActiveScreen, updateHomeFocus } = useFocus();

  const handleSelectTheme = (themeName) => {
    setCurrentTheme(themeName);
  };

  const getSettingDetails = () => {
    const activeSetting = settingsList[settingsIndex];

    if (activeSetting.startsWith('theme-')) {
      const themeName = activeSetting.split('-')[1];
      const themeLabels = {
        ps5: 'Default PlayStation 5 Theme with glowing blue particle waveforms.',
        spiderman: 'Insomniac\'s Spider-Man 2 Dark Theme with custom web pattern overlays.',
        astro: 'Bubbly sky-blue theme inspired by Team ASOBI\'s Astro Bot.',
        horizon: 'Teal/copper theme styled after Guerilla Games\' Horizon Forbidden West.',
        ps4: 'Classic PlayStation 4 theme with flowing geometric abstract waves.'
      };
      
      return (
        <div className="setting-details-panel">
          <h3>Console Theme Selection</h3>
          <p className="detail-desc">{themeLabels[themeName]}</p>
          <div className="theme-preview-box">
            <div className={`theme-preview-bg theme-preview-${themeName}`} />
            <div className="preview-label-card">
              <span className="active-badge">{currentTheme === themeName ? 'Active Theme' : 'Press Enter to Apply'}</span>
            </div>
          </div>
        </div>
      );
    }

    if (activeSetting === 'setting-network') {
      return (
        <div className="setting-details-panel">
          <h3>Network Connection</h3>
          <div className="network-details">
            <div className="network-row">
              <span>Status</span>
              <span className="net-val status-connected">Connected</span>
            </div>
            <div className="network-row">
              <span>SSID</span>
              <span className="net-val">PlayStation_5G_Home</span>
            </div>
            <div className="network-row">
              <span>IP Address</span>
              <span className="net-val">192.168.1.144</span>
            </div>
            <div className="network-row">
              <span>Connection Speed (Download)</span>
              <span className="net-val speed-highlight">645.8 Mbps</span>
            </div>
            <div className="network-row">
              <span>Connection Speed (Upload)</span>
              <span className="net-val speed-highlight">112.4 Mbps</span>
            </div>
          </div>
        </div>
      );
    }

    if (activeSetting === 'setting-storage') {
      return (
        <div className="setting-details-panel">
          <h3>Console Storage</h3>
          <p className="detail-desc">Internal High-Speed Custom SSD</p>
          <div className="storage-meter-container">
            <div className="storage-bar">
              <div className="storage-segment games" style={{ width: '58%' }}></div>
              <div className="storage-segment media" style={{ width: '12%' }}></div>
              <div className="storage-segment system" style={{ width: '8%' }}></div>
            </div>
            <div className="storage-stats">
              <div className="storage-stat-item">
                <span className="dot games-dot"></span> Games & Apps (478.2 GB)
              </div>
              <div className="storage-stat-item">
                <span className="dot media-dot"></span> Media Gallery (99.0 GB)
              </div>
              <div className="storage-stat-item">
                <span className="dot system-dot"></span> System Reserved (65.0 GB)
              </div>
              <div className="storage-stat-item free-space">
                <span className="dot free-dot"></span> Free Space (182.8 GB)
              </div>
            </div>
            <div className="storage-total">
              <strong>642.2 GB / 825.0 GB Used</strong>
            </div>
          </div>
        </div>
      );
    }

    if (activeSetting === 'setting-about') {
      return (
        <div className="setting-details-panel">
          <h3>About Console</h3>
          <div className="about-details">
            <div className="about-row">
              <span>Console Model</span>
              <span className="about-val">PlayStation®5 Digital Edition (CFI-1200B)</span>
            </div>
            <div className="about-row">
              <span>System Software</span>
              <span className="about-val">26.06.27.00.01-Release</span>
            </div>
            <div className="about-row">
              <span>Hardware Platform</span>
              <span className="about-val">AMD Zen 2 8-Core / Custom RDNA 2 GPU</span>
            </div>
            <div className="about-row">
              <span>Memory Capacity</span>
              <span className="about-val">16 GB GDDR6 Unified System RAM</span>
            </div>
            <div className="about-row">
              <span>Developer Team</span>
              <span className="about-val">Antigravity AI Agent & Forza</span>
            </div>
          </div>
        </div>
      );
    }

    if (activeSetting === 'setting-back') {
      return (
        <div className="setting-details-panel back-details">
          <h3>Return to Dashboard</h3>
          <p>Press Enter to close Settings and go back to the Main Home Dashboard.</p>
          <div className="back-arrow-graphic">
            <svg viewBox="0 0 24 24" className="back-svg">
              <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" fill="#FFF" />
            </svg>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <div className="settings-title-row">
          <svg viewBox="0 0 24 24" className="settings-title-icon">
            <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.47,5.34 14.86,5.08L14.47,2.42C14.43,2.18 14.22,2 13.97,2H9.97C9.72,2 9.51,2.18 9.47,2.42L9.08,5.08C8.47,5.34 7.9,5.66 7.38,6.05L4.89,5.05C4.67,4.96 4.4,5.05 4.28,5.27L2.28,8.73C2.16,8.95 2.21,9.22 2.4,9.37L4.51,11C4.47,11.34 4.5,11.67 4.5,12C4.5,12.33 4.47,12.65 4.51,12.97L2.4,14.63C2.21,14.78 2.16,15.05 2.28,15.27L4.28,18.73C4.4,18.95 4.67,19.04 4.89,18.95L7.38,17.95C7.9,18.34 8.47,18.66 9.08,18.92L9.47,21.58C9.51,21.82 9.72,22 9.97,22H13.97C14.22,22 14.43,21.82 14.47,21.58L14.86,18.92C15.47,18.66 16.04,18.34 16.56,17.95L19.05,18.95C19.27,19.04 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" fill="#FFF" />
          </svg>
          <h1>Settings</h1>
        </div>
        <p className="settings-subtitle">System Configuration & Styling Options</p>
      </div>

      <div className="settings-grid">
        <div className="settings-list">
          {settingsList.map((itemId, idx) => {
            const isFocused = focusId === itemId;
            let displayLabel = '';
            
            if (itemId.startsWith('theme-')) {
              const themeName = itemId.split('-')[1];
              const displayThemes = {
                ps5: 'Theme: PS5 Dynamic (Default)',
                spiderman: 'Theme: Spider-Man 2 Red/Black',
                astro: 'Theme: Astro Bot Cheerful',
                horizon: 'Theme: Horizon Forbidden West Teal',
                ps4: 'Theme: Classic PS4 Wave'
              };
              displayLabel = displayThemes[themeName];
            } else {
              const labels = {
                'setting-network': 'Network Settings',
                'setting-storage': 'Storage Capacity',
                'setting-about': 'About Console',
                'setting-back': 'Back to Dashboard'
              };
              displayLabel = labels[itemId];
            }

            return (
              <div
                key={itemId}
                id={itemId}
                className={`settings-item-card ${isFocused ? 'focused' : ''} ${itemId === 'setting-back' ? 'back-item' : ''}`}
                onClick={() => {
                  if (itemId.startsWith('theme-')) {
                    handleSelectTheme(itemId.split('-')[1]);
                  } else if (itemId === 'setting-back') {
                    setActiveScreen('HOME');
                    updateHomeFocus('header', 1);
                  }
                }}
              >
                <div className="settings-item-left">
                  {itemId.startsWith('theme-') && (
                    <div className={`theme-circle-indicator theme-indicator-${itemId.split('-')[1]} ${currentTheme === itemId.split('-')[1] ? 'selected' : ''}`} />
                  )}
                  <span>{displayLabel}</span>
                </div>
                <div className="settings-item-arrow">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" fill="#FFF" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        <div className="settings-details-section">
          {getSettingDetails()}
        </div>
      </div>

      <div className="settings-footer-help">
        <span className="keyboard-key">↑</span>
        <span className="keyboard-key">↓</span> Navigate List
        <span className="keyboard-key">Enter</span> Select / Apply Theme
        <span className="keyboard-key">Backspace</span> Return
      </div>
    </div>
  );
}
