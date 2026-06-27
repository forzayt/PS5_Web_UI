// Web Audio API Synthesizer for PS5 Console UI
// Synthesizes startup chimes, navigation clicks, selections, and looping ambient themes.

import bootClickSound from '../assets/sfx/boot_logo_click_sound.ogg';

let audioCtx = null;
let ambientOscs = [];
let ambientGains = [];
let ambientFilter = null;
let currentThemeName = 'ps5';
let ambientInterval = null;
let bootClickBuffer = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Pre-load the OGG file
async function loadBootClick() {
  if (bootClickBuffer) return bootClickBuffer;
  try {
    const ctx = getAudioContext();
    const response = await fetch(bootClickSound);
    const arrayBuffer = await response.arrayBuffer();
    bootClickBuffer = await ctx.decodeAudioData(arrayBuffer);
    return bootClickBuffer;
  } catch (e) {
    console.error("Failed to load boot click sound", e);
    return null;
  }
}

// Initialize loading
loadBootClick();

// Play the OGG boot click sound
export async function playBootClick() {
  try {
    const ctx = getAudioContext();
    const buffer = await loadBootClick();
    if (!buffer) return;

    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    
    source.buffer = buffer;
    gain.gain.value = 0.5; // Adjust volume as needed

    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(0);
  } catch (e) {
    console.error("Failed to play boot click sound", e);
  }
}

// Synthesize PlayStation-like startup chime
export function playBootSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Sub-bass sweep
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(40, now);
    bassOsc.frequency.exponentialRampToValueAtTime(80, now + 3);
    
    bassGain.gain.setValueAtTime(0, now);
    bassGain.gain.linearRampToValueAtTime(0.6, now + 1);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + 5);
    
    bassOsc.connect(bassGain);
    bassGain.connect(ctx.destination);
    bassOsc.start(now);
    bassOsc.stop(now + 5.5);

    // Warm pad layer
    const midOsc = ctx.createOscillator();
    const midGain = ctx.createGain();
    midOsc.type = 'triangle';
    midOsc.frequency.setValueAtTime(220, now); // A3
    midOsc.frequency.linearRampToValueAtTime(330, now + 2); // E4
    
    midGain.gain.setValueAtTime(0, now);
    midGain.gain.linearRampToValueAtTime(0.3, now + 1.5);
    midGain.gain.exponentialRampToValueAtTime(0.001, now + 6);
    
    midOsc.connect(midGain);
    midGain.connect(ctx.destination);
    midOsc.start(now);
    midOsc.stop(now + 6.5);

    // High sparkling bells
    const bellFrequencies = [523.25, 659.25, 783.99, 987.77, 1318.51]; // C5, E5, G5, B5, E6
    bellFrequencies.forEach((freq, idx) => {
      const delay = idx * 0.15;
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      
      oscGain.gain.setValueAtTime(0, now + delay);
      oscGain.gain.linearRampToValueAtTime(0.15, now + delay + 0.05);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 2.5);

      if (panner) {
        panner.pan.setValueAtTime((idx / (bellFrequencies.length - 1)) * 2 - 1, now + delay);
        osc.connect(oscGain);
        oscGain.connect(panner);
        panner.connect(ctx.destination);
      } else {
        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
      }

      osc.start(now + delay);
      osc.stop(now + delay + 3);
    });
  } catch (e) {
    console.error("Audio failed to boot", e);
  }
}

// Navigation Tick (soft digital click)
export function playTick() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(1.0, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  } catch (e) {
    // Ignore audio context errors
  }
}

// Selection Sound (high pitched double chime)
export function playSelect() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Chime 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.setValueAtTime(880, now + 0.06); // A5
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.12, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.4);

    // Chime 2 (harmonized octave offset)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1174.66, now + 0.06); // D6
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.06, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now);
    osc2.stop(now + 0.5);
  } catch (e) {}
}

// Back/Error sound
export function playBack() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(329.63, now); // E4
    osc.frequency.setValueAtTime(261.63, now + 0.08); // C4

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  } catch (e) {}
}

// System theme sounds
const THEME_PITCHES = {
  ps5: [110, 165, 220, 293.66, 330], // A2, E3, A3, D4, E4 - floating warm chord
  spiderman: [98, 146.83, 196, 233.08, 293.66], // G2, D3, G3, Bb3, D4 - dark heroic minor
  astro: [130.81, 196, 261.63, 329.63, 392], // C3, G3, C4, E4, G4 - happy major chord
  horizon: [116.54, 174.61, 233.08, 311.13, 349.23], // Bb2, F3, Bb3, Eb4, F4 - ethnic epic teal
  ps4: [146.83, 220, 293.66, 369.99, 440] // D3, A3, D4, F#4, A4 - airy ocean wave
};

// Start a looping ambient chord (re-synthesizes sounds dynamically so no bandwidth is used)
export function startMusic(theme = 'ps5') {
  try {
    const ctx = getAudioContext();
    stopMusic();
    currentThemeName = theme;
    
    const freqs = THEME_PITCHES[theme] || THEME_PITCHES.ps5;
    
    // Create filter to make it soft
    ambientFilter = ctx.createBiquadFilter();
    ambientFilter.type = 'lowpass';
    ambientFilter.frequency.setValueAtTime(theme === 'astro' ? 1200 : 700, ctx.currentTime);
    ambientFilter.Q.setValueAtTime(1.0, ctx.currentTime);
    ambientFilter.connect(ctx.destination);

    // Create 4-5 oscillators playing notes of the chord
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Different themes have different waveforms
      if (theme === 'spiderman') {
        osc.type = 'sawtooth';
      } else if (theme === 'astro') {
        osc.type = 'triangle';
      } else {
        osc.type = 'sine';
      }

      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      // Detune slightly for chorus effect
      osc.detune.setValueAtTime((Math.random() - 0.5) * 8, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      
      osc.connect(gain);
      gain.connect(ambientFilter);
      
      osc.start();
      
      ambientOscs.push(osc);
      ambientGains.push(gain);
    });

    // Animate the gains to fade in and sway like an atmospheric ocean
    const driftGains = () => {
      if (!ctx || ctx.state === 'suspended') return;
      const now = ctx.currentTime;
      
      ambientGains.forEach((gainNode, idx) => {
        // Base volume is extremely quiet (0.01 to 0.04) for ambient background
        const targetVol = (theme === 'spiderman' ? 0.005 : 0.015) + Math.random() * 0.012;
        gainNode.gain.linearRampToValueAtTime(targetVol, now + 3 + Math.random() * 2);
      });
      
      // Gently sweep the filter cutoff frequency
      const cutoff = (theme === 'astro' ? 800 : 400) + Math.random() * 400;
      if (ambientFilter) {
        ambientFilter.frequency.exponentialRampToValueAtTime(cutoff, now + 4);
      }
    };

    // Initial fade in
    const now = ctx.currentTime;
    ambientGains.forEach((g, idx) => {
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(idx === 0 ? 0.02 : 0.01, now + 2);
    });
    
    driftGains();
    // Run the sweep every 5 seconds
    ambientInterval = setInterval(driftGains, 5000);
  } catch (e) {
    console.error("Could not start ambient music", e);
  }
}

export function stopMusic() {
  if (ambientInterval) {
    clearInterval(ambientInterval);
    ambientInterval = null;
  }
  ambientOscs.forEach(o => {
    try { o.stop(); } catch (e) {}
  });
  ambientOscs = [];
  ambientGains = [];
  ambientFilter = null;
}

export function setMusicTheme(theme) {
  if (currentThemeName !== theme) {
    startMusic(theme);
  }
}
