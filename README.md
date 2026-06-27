# PlayStation®5 Console Dashboard UI Emulator 🎮

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

An ultra-premium, interactive web-based recreation of the **Sony PlayStation®5 Console Dashboard**. Built from scratch using **React.js** and **Vanilla CSS** (zero Tailwind/utility frameworks for maximum flex control), it features a procedural Web Audio API synthesizer, dynamic game launcher backdrops, custom settings, and full keyboard-controller simulation.

---

## 🚀 Key Features

*   **Chime Boot Sequence**: Plays the classic PlayStation console boot up logo animation and triggers the deep sub-bass boot chime.
*   **User Avatar Profiles**: Interactive login screen with custom-designed vector avatars for *Astro*, *Spider-Man*, and *Aloy*.
*   **Dynamic Theme Music & Wallpapers**: Custom visual systems that swap layouts, ambient accent colors, and background synthesized audio loops depending on your active theme (e.g., PS5 Standard, Spider-Man 2, Astro Bot, Horizon, or Classic PS4 Wave).
*   **Fully Functional Control Center**: Press `Esc` anywhere to slide up the PS Control Tray containing audio widgets, microphone mute banners, and power options.
*   **Interactive Settings Board**: View active SSD storage capacity graphs, network bandwidth mock measurements, and switch console themes dynamically.
*   **Immersive Game Player**: Select "Play" on any game to enter an overlay loading sequence followed by an interactive gameplay canvas. Control your character with arrows and hit `Enter` to trigger custom SFX moves (Jumps, Web swings, Axe slashes).

---

## ⌨️ Keyboard Controls Reference

This UI is designed to be fully navigable without a mouse, simulating a real console controller:

| Control | Function |
| :--- | :--- |
| **Arrow Keys** (`↑` `↓` `←` `→`) | Move Focus Grid / Navigate Menus / Move Game Character |
| **Enter** | Select / Apply / Trigger In-Game Action (Cross button) |
| **Backspace** | Back / Exit Active Game / Return to Home Dashboard (Circle button) |
| **Escape** | Toggle Control Center Overlay Tray (PS Button) |

---

## 🛠️ Installation & Setup

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/PS5_Web_UI.git
    cd PS5_Web_UI
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Start the Local Dev Server**:
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your web browser.

4.  **Production Build**:
    ```bash
    npm run build
    ```

---

## 🤝 Open Source & Contributing

We welcome contributions from the community! Whether you want to add new game launchers, integrate actual game web emulators, enhance the sound synthesizer, or fix visual alignments:

1.  Check out our [Contributing Guidelines](CONTRIBUTING.md) to get started.
2.  Adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).
3.  Join us in making this the ultimate web console emulator!

---

## 📜 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more details.

---

## ⚠️ Disclaimer

This project is a fan-made creation built for educational, portfolio, and design demonstration purposes. It is not affiliated with, authorized, or endorsed by Sony Interactive Entertainment or PlayStation. All trademark rights, copyrights, and game graphics belong to their respective owners.
