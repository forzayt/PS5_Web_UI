# Contributing to PlayStation®5 Console Dashboard UI Emulator 🚀

We are thrilled that you want to contribute to this open-source project! Together, we can make this the most beautiful, high-fidelity console dashboard on the web. 

Please take a moment to review the following guidelines before you get started.

---

## 🗺️ How to Contribute

### 1. Reporting Bugs & Visual Issues
*   Use the GitHub issues tab to file a report.
*   Clearly describe the bug, listing what active theme or screen was running.
*   Provide steps to reproduce the issue along with a screenshot or recording.

### 2. Suggesting Features
*   Open an issue stating what features you would like to see (e.g., "Add a PS5 Media player screen", "Add Xbox/Retro console switcher", "Integrate mini HTML5 games").
*   Discuss implementation approaches with the maintainers in the thread.

### 3. Code Contributions
1.  **Fork** the repository and create a branch from `main`:
    ```bash
    git checkout -b feature/my-amazing-feature
    ```
2.  **Make your changes**: Keep your code clean, modular, and performant.
3.  **Validate your code**: Run a local dev server with `npm run dev` to ensure no linting/visual breakage.
4.  **Commit your changes** with descriptive commit messages following conventional guidelines (e.g., `feat: add game base friend panel`, `fix: header alignment on mobile`).
5.  **Push** to your fork and submit a **Pull Request** targeting `main`.

---

## 🎨 Coding & Design Standards

To preserve the premium feel of this emulator, please adhere to these design principles:

### Core CSS Constraints (Vanilla Only)
*   **Do not use TailwindCSS or utility frameworks**. All design rules should reside inside `src/index.css` using custom properties/variables.
*   Maintain responsive layouts utilizing `flexbox` and `grid` structures.
*   Ensure focus highlights utilize smooth glowing borders (`box-shadow`), slight scale-up adjustments (`transform: scale()`), and transitioning durations.

### Component Guidelines
*   Keep components modular. Place UI segments inside `src/components/` and import them dynamically into `src/App.jsx`.
*   Ensure all new interactive buttons or grids register their layout nodes with the `FocusContext.jsx` to keep the arrow-key console navigation functioning.

---

## 📜 Code of Conduct

By participating in this project, you agree to treat everyone with respect, maintain a welcoming environment, and help build a collaborative and inclusive community. Please report any abusive behavior to the project maintainers.
