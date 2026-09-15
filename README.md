# Jophy Chen — Developer Portfolio (`jophyyy.github.io`)

> Cyberpunk terminal-inspired personal portfolio engineered for **[jophyyy.github.io](https://jophyyy.github.io)**, inspired by the hacker aesthetic of `ddaniel.dev`.

---

## ⚡ Features

- **Terminal Boot Sequence**: Linux/Arch terminal simulation with typewriter commands, blinking carets, and an instant **Skip Animation** button.
- **Dynamic Spotlight Tracking**: Real-time radial flashlight gradient following cursor movements with live coordinate display (`[X, Y]`).
- **Code Bracket Framing**: Section layouts styled with structured code declarations (`ABOUT { ... }`, `SKILLS { ... }`).
- **Interactive Role Cycler**: Dynamic typewriter headline alternating between key specialties (Full Stack Developer, Roblox Systems Architect, etc.).
- **Horizontal Draggable Timeline**: Interactive track showcasing work experience and engineering milestones.
- **Project Showcase & Filter Tabs**: Categorized cards for games, web apps, and low-latency systems.
- **Interactive Easter-Egg Developer CLI**: Floating expandable terminal console supporting `help`, `neofetch`, `skills`, `projects`, `matrix`, `contact`, and `clear`.
- **Zero-Dependency Static Architecture**: Pure Vanilla HTML5, modern CSS custom properties, and ES6 JavaScript. Instant compatibility with GitHub Pages without build steps.

---

## 🚀 Local Development

To run locally and preview the website in your browser:

```bash
# Using Python 3 HTTP Server
python3 -m http.server 5173

# Or using Node.js 'serve'
npx serve . -l 5173
```

Open `http://localhost:5173` in your browser.

---

## 🌐 Deploying to GitHub Pages

Since this repository is named `jophyyy.github.io`, pushing to `main` deploys directly:

```bash
# From inside /Users/jophychen/.gemini/antigravity-ide/scratch/jophyyy.github.io:
git add .
git commit -m "feat: initialize cyber terminal portfolio inspired by ddaniel.dev"
git branch -M main
git push -u origin main
```

Your website will be live at:
🔗 **https://jophyyy.github.io**
