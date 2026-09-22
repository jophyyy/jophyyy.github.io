/* ==========================================================================
   DEPTHTHREAD WORKFLOW OS — MAIN JAVASCRIPT
   Aesthetic: Depththread Industrial Pixel Telemetry HUD
   ========================================================================== */

// Prevent browser from restoring previous scroll position on reload
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

document.addEventListener("DOMContentLoaded", () => {
  initParticleWave();
  initLivingInkWallpaper();
  initBootSequence();
  initHeroTypewriter();
  initWorkingSection();
  initShowcaseTimeline();
  initVerticalImageTrack();
  initCoordinatesTracker();
  initQueueAndFeedInteractions();
  initProjectFilters();
  initInteractiveCLI();
  initSequenceActions();
});

/* ==========================================================================
   1. PARTICLE WAVE CANVAS & LIVING INK SUMINAGASHI (Inspired by Suimen)
   ========================================================================== */
function initParticleWave() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.scale(dpr, dpr);
  }

  window.addEventListener("resize", resize);
  resize();

  // Mouse tracking for wave perturbation
  let mouseX = width * 0.5;
  let mouseY = height * 0.5;
  let targetMouseX = mouseX;
  let targetMouseY = mouseY;

  window.addEventListener("mousemove", (e) => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
  });

  // Generate continuous flowing particles along organic ribbon
  const PARTICLE_COUNT = 1600;
  const particles = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      u: Math.random(),
      speed: 0.00035 + Math.random() * 0.00065,
      // Tri-sample distribution for dense central core and soft feathered edge
      offset: (Math.random() + Math.random() + Math.random() - 1.5) * 0.75,
      layer: Math.random(),
      baseSize: Math.random() < 0.2 ? 2.0 : (Math.random() < 0.6 ? 1.4 : 1.0),
      alphaMultiplier: 0.4 + Math.random() * 0.6,
      amberProb: Math.random() < 0.09
    });
  }

  let time = 0;
  let wavePulse = 0;

  window.pulseWave = function() {
    wavePulse = 1.0;
  };

  function render() {
    ctx.clearRect(0, 0, width, height);

    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    if (wavePulse > 0) {
      wavePulse *= 0.94;
      if (wavePulse < 0.005) wavePulse = 0;
    }

    const mouseOffsetX = (mouseX / width - 0.5) * 60;
    const mouseOffsetY = (mouseY / height - 0.5) * 45;

    time += 0.012 + wavePulse * 0.025;

    // --- Subtle Suminagashi Living Ink Streamlines (Background Texture) ---
    const inkLines = 18;
    for (let k = 0; k < inkLines; k++) {
      const lineNorm = k / inkLines;
      const baseLineY = height * 0.2 + lineNorm * height * 0.6;
      ctx.beginPath();
      ctx.lineWidth = 0.8 + (k % 3 === 0 ? 0.8 : 0);
      ctx.strokeStyle = k % 2 === 0 ? "rgba(10, 26, 51, 0.065)" : "rgba(20, 28, 38, 0.05)";

      const segments = 40;
      for (let s = 0; s <= segments; s++) {
        const u = s / segments;
        const px = u * width;
        const undulation = Math.sin(u * 4.2 - time * 0.7 + lineNorm * 3.5) * 38
                         + Math.cos(u * 8.5 + time * 0.4) * 16;
        const py = baseLineY + undulation + mouseOffsetY * 0.3;
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    const horizonY = height * 0.46;

    // --- Carbon Particle Ribbon Cloud ---
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];
      p.u += p.speed + wavePulse * 0.001;
      if (p.u > 1.05) p.u = -0.05;

      const u = p.u;

      // Spine X coordinate across the viewport
      const spineX = u * (width * 1.25) - width * 0.12;

      // Undulating sinusoidal wave spine
      const wave1 = Math.sin(u * 3.6 - time * 1.1) * (60 + wavePulse * 45);
      const wave2 = Math.cos(u * 7.2 + time * 0.6) * (28 + wavePulse * 20);
      const waveTilt = (u - 0.5) * (height * 0.12);

      const spineY = horizonY + wave1 + wave2 + waveTilt;

      // Ribbon width expands on the right to match reference screenshot
      const ribbonWidth = (40 + u * 220) * (0.8 + p.layer * 0.4);

      const x = spineX + mouseOffsetX * (1 - p.layer);
      const y = spineY + p.offset * ribbonWidth + mouseOffsetY * p.layer;

      // Perspective and crest sizing
      const size = p.baseSize * (0.75 + p.layer * 0.55 + wavePulse * 0.4);
      const coreDensity = Math.max(0, 1 - Math.abs(p.offset * 1.4));
      const alpha = Math.min(0.88, coreDensity * p.alphaMultiplier * (0.35 + p.layer * 0.65));

      if (p.amberProb && p.layer > 0.5) {
        ctx.fillStyle = `rgba(217, 119, 6, ${alpha * 0.95})`;
      } else {
        ctx.fillStyle = `rgba(17, 17, 21, ${alpha * 0.75})`;
      }

      ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(size)), Math.max(1, Math.round(size)));
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/* ==========================================================================
   1B. SUMINAGASHI LIVING INK WALLPAPER (Suimen Organic Marbled Ink Flow)
   ========================================================================== */
function initLivingInkWallpaper() {
  const canvas = document.getElementById("mac-wallpaper-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.scale(dpr, dpr);
  }

  window.addEventListener("resize", resize);
  resize();

  let time = 0;
  const STREAM_COUNT = 48;

  function render() {
    ctx.clearRect(0, 0, width, height);

    time += 0.008;

    // Vortex center on the right (inspired by Suimen sinkhole)
    const vx = width * 0.82;
    const vy = height * 0.42;

    // Draw Suminagashi living ink streamlines
    for (let i = 0; i < STREAM_COUNT; i++) {
      const norm = i / STREAM_COUNT;
      const baseStartY = height * 0.05 + norm * height * 0.92;
      const strokeAlpha = 0.08 + Math.sin(norm * Math.PI) * 0.28;

      ctx.beginPath();
      ctx.lineWidth = 1.0 + (i % 4 === 0 ? 1.4 : (i % 2 === 0 ? 0.8 : 0.4));

      // Alternate indigo depth and carbon dye
      if (i % 3 === 0) {
        ctx.strokeStyle = `rgba(10, 26, 51, ${strokeAlpha})`;
      } else if (i % 3 === 1) {
        ctx.strokeStyle = `rgba(28, 36, 48, ${strokeAlpha * 0.9})`;
      } else {
        ctx.strokeStyle = `rgba(75, 85, 99, ${strokeAlpha * 0.6})`;
      }

      const steps = 60;
      for (let s = 0; s <= steps; s++) {
        const u = s / steps;
        let px = u * (width * 1.1) - width * 0.05;

        // Base undulating waves
        const wave1 = Math.sin(u * 4.5 - time * 0.8 + norm * 4.2) * 45;
        const wave2 = Math.cos(u * 9.0 + time * 0.5 + norm * 2.0) * 22;
        const wave3 = Math.sin(u * 16.0 - time * 1.2) * 8;

        let py = baseStartY + wave1 + wave2 + wave3;

        // Vortex whirlpool pull towards (vx, vy)
        const dx = px - vx;
        const dy = py - vy;
        const dist = Math.hypot(dx, dy);

        if (dist < 340) {
          const influence = Math.pow((340 - dist) / 340, 2.0);
          const angle = Math.atan2(dy, dx);
          
          // Spiral curvature force
          const spiralAngle = angle + influence * 2.8 + time * 0.8;
          px -= Math.cos(spiralAngle) * influence * 60;
          py -= Math.sin(spiralAngle) * influence * 60;
          
          // Radial suction into center
          px += (vx - px) * influence * 0.4;
          py += (vy - py) * influence * 0.4;
        }

        if (s === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    }

    // Draw living ink sinkhole vortex core on the right
    const vortexGrad = ctx.createRadialGradient(vx, vy, 0, vx, vy, 48);
    vortexGrad.addColorStop(0, "rgba(10, 26, 51, 0.88)");
    vortexGrad.addColorStop(0.3, "rgba(10, 26, 51, 0.65)");
    vortexGrad.addColorStop(0.7, "rgba(10, 26, 51, 0.2)");
    vortexGrad.addColorStop(1, "rgba(10, 26, 51, 0)");

    ctx.fillStyle = vortexGrad;
    ctx.beginPath();
    ctx.arc(vx, vy, 48, 0, Math.PI * 2);
    ctx.fill();

    // Dark core droplet
    ctx.fillStyle = "#071120";
    ctx.beginPath();
    ctx.arc(vx, vy, 12, 0, Math.PI * 2);
    ctx.fill();

    // Subtle swirling filament ring around the vortex
    ctx.save();
    ctx.translate(vx, vy);
    ctx.rotate(time * 0.9);
    ctx.strokeStyle = "rgba(10, 26, 51, 0.45)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 1.5);
    ctx.stroke();
    ctx.restore();

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/* ==========================================================================
   2. MACBOOK DESKTOP & TERMINAL STARTUP SEQUENCE
   ========================================================================== */
function initBootSequence() {
  const macDesktop = document.getElementById("macbook-desktop-boot");
  const macCursor = document.getElementById("mac-cursor");
  const cursorRipple = document.getElementById("cursor-click-ripple");
  const macTerminalWindow = document.getElementById("mac-terminal-window");
  const dockTerminalApp = document.getElementById("dock-terminal-app");
  const macClock = document.getElementById("mac-clock");
  const skipBtn = document.getElementById("skip-boot-btn");
  const bootLinesContainer = document.getElementById("boot-lines");
  const currentTyping = document.getElementById("current-typing");
  const promptPrefix = document.getElementById("prompt-prefix");
  const bootConsole = document.getElementById("boot-console");

  if (!macDesktop) return;

  // Lock scroll during boot so movements/gestures don't scroll background page
  document.documentElement.classList.add("booting");
  document.body.classList.add("booting");
  window.scrollTo(0, 0);

  function preventScroll(e) {
    e.preventDefault();
  }

  function preventScrollKeys(e) {
    if (["Space", " ", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(e.key)) {
      e.preventDefault();
    }
  }

  macDesktop.addEventListener("wheel", preventScroll, { passive: false });
  macDesktop.addEventListener("touchmove", preventScroll, { passive: false });
  window.addEventListener("keydown", preventScrollKeys, { capture: true });

  // Live macOS Clock updater
  function updateClock() {
    if (!macClock) return;
    const now = new Date();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const day = days[now.getDay()];
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    macClock.textContent = `${day} ${hours}:${minutes} ${ampm}`;
  }
  updateClock();

  let isSkipped = false;
  let activeTimeouts = [];

  function safeTimeout(fn, ms) {
    if (isSkipped) return null;
    const id = setTimeout(() => {
      if (!isSkipped) fn();
    }, ms);
    activeTimeouts.push(id);
    return id;
  }

  function finishBoot() {
    if (isSkipped) return;
    isSkipped = true;
    activeTimeouts.forEach(clearTimeout);
    activeTimeouts = [];

    // Detach boot scroll event preventers
    macDesktop.removeEventListener("wheel", preventScroll);
    macDesktop.removeEventListener("touchmove", preventScroll);
    window.removeEventListener("keydown", preventScrollKeys, { capture: true });

    // Lock position firmly to top before unlocking
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Release boot scroll lock
    document.documentElement.classList.remove("booting");
    document.body.classList.remove("booting");

    // Force scroll position to 0 again after class removal
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    macDesktop.classList.add("finished");
    if (window.startHeroTypewriter) {
      window.startHeroTypewriter();
    }
    setTimeout(() => {
      macDesktop.style.display = "none";
    }, 550);
  }

  skipBtn?.addEventListener("click", finishBoot);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") finishBoot();
  });

  const scriptSteps = [
    { type: "cmd", text: "jophy --init --portfolio", delayAfter: 300 },
    { type: "output", text: "[kernel] loading portfolio primitives: CIS 1600, CIS 1200, personal projects... ok", delayAfter: 200 },
    { type: "cmd", text: "jophy status", delayAfter: 320 },
    { type: "info", text: "> JOPHY'S PERSONAL v4.3.0", delayAfter: 160 },
    { type: "info", text: "> 03 active layers detected: CIS 1600, CIS 1200, Roblox & Projects.", delayAfter: 200 },
    { type: "prompt-question", prompt: "Initialize telemetry signal feed and queue daemon? (Y/n)", answer: "Y", delayAfter: 300 },
    { type: "success", text: "✔ Telemetry feed connected at 60 FPS (all systems nominal).", delayAfter: 200 },
    { type: "prompt-question", prompt: "Stream particle wave point cloud across Layer 03? (Y/n)", answer: "y", delayAfter: 300 },
    { type: "output", text: "  [wave-compositor] 1600 carbon points calibrated on GPU raster canvas.", delayAfter: 180 },
    { type: "prompt-question", prompt: "Run layer sync verification sequence? (Y/n)", answer: "y", delayAfter: 280 },
    { type: "output", text: "  ├── #0421 [discrete] CIS 1600 algorithms ... synced", delayAfter: 140 },
    { type: "output", text: "  ├── #0417 [systems]  CIS 1200 runtime    ... synced", delayAfter: 140 },
    { type: "output", text: "  ├── #0412 [projects] roblox game engine  ... synced", delayAfter: 140 },
    { type: "output", text: "  └── #0409 [personal] interactive portfolio ... ready", delayAfter: 180 },
    { type: "prompt-question", prompt: "Ready to mount HUD telemetry interface? (Y/n)", answer: "y", delayAfter: 320 },
    { type: "success", text: "  JOPHY'S PERSONAL online. All systems nominal.", delayAfter: 200 },
    { type: "output", text: "  ➜ Protocol: https://jophyyy.github.io", delayAfter: 150 },
    { type: "info", text: "  ➜ Launching Jophy's Personal...", delayAfter: 550 }
  ];

  let stepIdx = 0;

  function scrollConsole() {
    if (bootConsole) {
      bootConsole.scrollTop = bootConsole.scrollHeight;
    }
  }

  function runNextStep() {
    if (isSkipped) return;

    if (stepIdx >= scriptSteps.length) {
      safeTimeout(finishBoot, 350);
      return;
    }

    const step = scriptSteps[stepIdx];
    stepIdx++;

    if (step.type === "cmd") {
      if (promptPrefix) {
        promptPrefix.innerHTML = '<span class="mac-prompt-user">jophy@macbook</span>:<span class="mac-prompt-dir">~/jophy-personal</span>$&nbsp;';
      }
      typeCommand(step.text, () => {
        if (isSkipped) return;
        const line = document.createElement("div");
        line.className = "boot-line command";
        line.innerHTML = `<span class="mac-prompt-user">jophy@macbook</span>:<span class="mac-prompt-dir">~/jophy-personal</span>$ ${step.text}`;
        bootLinesContainer.appendChild(line);
        currentTyping.textContent = "";
        scrollConsole();
        safeTimeout(runNextStep, step.delayAfter || 200);
      }, 20);
    } else if (step.type === "prompt-question") {
      if (promptPrefix) {
        promptPrefix.innerHTML = '<span class="q-icon">?</span>&nbsp;';
      }
      currentTyping.textContent = step.prompt + " ";
      scrollConsole();

      safeTimeout(() => {
        if (isSkipped) return;
        typeCommand(step.answer, () => {
          if (isSkipped) return;
          const line = document.createElement("div");
          line.className = "boot-line question";
          line.innerHTML = `<span class="q-icon">?</span> ${step.prompt} <span class="q-ans">${step.answer}</span>`;
          bootLinesContainer.appendChild(line);
          currentTyping.textContent = "";
          scrollConsole();
          safeTimeout(runNextStep, step.delayAfter || 200);
        }, 25);
      }, 160);
    } else {
      const line = document.createElement("div");
      line.className = `boot-line ${step.type}`;
      line.textContent = step.text;
      bootLinesContainer.appendChild(line);
      scrollConsole();
      safeTimeout(runNextStep, step.delayAfter || 140);
    }
  }

  function typeCommand(text, onComplete, speed = 20) {
    let charIdx = 0;
    function nextChar() {
      if (isSkipped) {
        onComplete();
        return;
      }
      if (charIdx < text.length) {
        currentTyping.textContent += text[charIdx];
        charIdx++;
        safeTimeout(nextChar, speed);
      } else {
        safeTimeout(onComplete, 70);
      }
    }
    nextChar();
  }

  function startDesktopSequence() {
    // Initial desktop state
    macTerminalWindow?.classList.add("dock-collapsed");
    dockTerminalApp?.classList.remove("dock-hover", "app-press", "bounce", "launching-bounce");
    macCursor?.classList.remove("clicking");
    cursorRipple?.classList.remove("active");
    bootLinesContainer.innerHTML = "";
    if (currentTyping) currentTyping.textContent = "";

    // 1. Position cursor initially near the upper-center
    if (macCursor) {
      macCursor.style.opacity = "1";
      macCursor.style.transform = `translate(${window.innerWidth * 0.48}px, ${window.innerHeight * 0.35}px)`;
    }

    // Helper: compute target coordinates centered on the Terminal dock icon
    function getDockTarget() {
      if (!dockTerminalApp) return { x: window.innerWidth * 0.5, y: window.innerHeight * 0.92 };
      const iconBox = dockTerminalApp.querySelector(".dock-icon-box") || dockTerminalApp;
      const rect = iconBox.getBoundingClientRect();
      // Arrow tip is at (x + 2, y + 2), so target tip precisely to the center of the icon
      return {
        x: rect.left + rect.width * 0.5 - 2,
        y: rect.top + rect.height * 0.5 - 2
      };
    }

    // 2. Cursor glides smoothly down to the Terminal dock icon
    safeTimeout(() => {
      if (!macCursor) return;
      const target = getDockTarget();
      macCursor.style.transform = `translate(${target.x}px, ${target.y}px)`;
    }, 400);

    // 3. Hover state triggers as cursor arrives, elevating the icon
    safeTimeout(() => {
      dockTerminalApp?.classList.add("dock-hover");
      // Keep cursor tip locked to icon center during hover elevation (-8px)
      if (macCursor) {
        const target = getDockTarget();
        macCursor.style.transform = `translate(${target.x}px, ${target.y - 8}px)`;
      }
    }, 1450);

    // 4. Mouse click sequence: cursor clicks first, then orange circle blooms right after
    safeTimeout(() => {
      // Step A: Cursor clicks down (mousedown)
      macCursor?.classList.add("clicking");
      dockTerminalApp?.classList.add("app-press");

      // Step B: Right after the cursor clicks (110ms later) -> orange circle blooms & app launches into bounce
      safeTimeout(() => {
        macCursor?.classList.remove("clicking");
        cursorRipple?.classList.remove("active");
        void cursorRipple?.offsetWidth; // trigger reflow for clean animation replay
        cursorRipple?.classList.add("active");

        dockTerminalApp?.classList.remove("app-press", "dock-hover");
        dockTerminalApp?.classList.add("launching-bounce");
      }, 110);
    }, 1680);

    // 5. Terminal window launches and zooms open from dock during the bounce apex
    safeTimeout(() => {
      macTerminalWindow?.classList.remove("dock-collapsed");
      
      // Move cursor aside smoothly out of the way of the terminal
      if (macCursor) {
        macCursor.style.transform = `translate(${window.innerWidth * 0.76}px, ${window.innerHeight * 0.68}px)`;
        macCursor.style.opacity = "0.25";
      }
    }, 2200);

    // 6. Clean up bounce classes after animation finishes
    safeTimeout(() => {
      dockTerminalApp?.classList.remove("launching-bounce", "bounce");
    }, 2600);

    // 7. Begin code execution inside the opened Terminal window
    safeTimeout(() => {
      stepIdx = 0;
      runNextStep();
    }, 2750);
  }

  // Reboot hook for CLI drawer and buttons
  window.rebootSequence = function() {
    isSkipped = false;
    activeTimeouts.forEach(clearTimeout);
    activeTimeouts = [];

    window.scrollTo(0, 0);
    document.documentElement.classList.add("booting");
    document.body.classList.add("booting");

    macDesktop.addEventListener("wheel", preventScroll, { passive: false });
    macDesktop.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventScrollKeys, { capture: true });

    if (window.resetWorkingSection) {
      window.resetWorkingSection();
    }
    if (window.resetScrollCue) {
      window.resetScrollCue();
    }

    macDesktop.style.display = "flex";
    macDesktop.classList.remove("finished");
    startDesktopSequence();
  };

  startDesktopSequence();
}

/* ==========================================================================
   3. COORDINATES TRACKER
   ========================================================================== */
function initCoordinatesTracker() {
  const coordsDisplay = document.getElementById("coords-display");
  if (!coordsDisplay) return;

  window.addEventListener("mousemove", (e) => {
    const x = String(e.clientX).padStart(3, "0");
    const y = String(e.clientY).padStart(3, "0");
    coordsDisplay.textContent = `[X: ${x}, Y: ${y}]`;
  });
}

/* ==========================================================================
   4. QUEUE & SIGNAL FEED INTERACTIONS
   ========================================================================== */
function initQueueAndFeedInteractions() {
  const queueRows = document.querySelectorAll(".queue-row");
  const feedList = document.getElementById("feed-list");

  function getTimestamp() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  window.pushSignal = function(customMsg) {
    if (!feedList) return;
    const time = getTimestamp();
    const row = document.createElement("div");
    row.className = "feed-row";
    row.innerHTML = customMsg || `<span class="f-time">${time}</span> <span class="f-user">operator</span> injected <span class="f-sys">signal pulse</span>`;
    
    // Insert before the streaming indicator
    const streamingEl = feedList.querySelector(".feed-streaming");
    if (streamingEl) {
      feedList.insertBefore(row, streamingEl);
    } else {
      feedList.appendChild(row);
    }

    if (window.pulseWave) window.pulseWave();

    // Limit feed history
    const allRows = feedList.querySelectorAll(".feed-row:not(.feed-streaming)");
    if (allRows.length > 9) {
      allRows[0].remove();
    }
  };

  // Interactivity on clicking queue rows
  queueRows.forEach((row) => {
    row.addEventListener("click", () => {
      const qId = row.querySelector(".queue-id")?.textContent || "#0421";
      const qTitle = row.querySelector(".queue-title")?.textContent || "task";
      const qDepth = row.dataset.depth || "03";

      // Toggle signal dots
      const sigDots = row.querySelector(".sig-dots.active-amber");
      if (sigDots) {
        sigDots.style.opacity = "0.4";
        setTimeout(() => { sigDots.style.opacity = "1"; }, 300);
      }

      window.pushSignal(`<span class="f-time">${getTimestamp()}</span> <span class="f-user">user</span> synced <span class="f-id">${qId}</span> to <span class="f-target">depth ${qDepth}</span>`);
    });
  });

  // Ambient feed stream generator
  const ambientActions = [
    { user: "ryo", act: "verified", target: "#0421", dest: "nominal" },
    { user: "ina", act: "promoted", target: "#0417", dest: "depth 03" },
    { user: "kai", act: "clocked", target: "#0412", dest: "0.4ms drift" },
    { user: "sys", act: "drift", target: "signal", dest: "nominal" }
  ];
  let ambientIdx = 0;

  setInterval(() => {
    if (document.hidden) return;
    const item = ambientActions[ambientIdx % ambientActions.length];
    ambientIdx++;
    window.pushSignal(`<span class="f-time">${getTimestamp()}</span> <span class="f-user">${item.user}</span> ${item.act} <span class="f-id">${item.target}</span> <span class="f-target">${item.dest}</span>`);
  }, 14000);
}

/* ==========================================================================
   5. BENCHMARK MODULE FILTERS
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll("#project-filters .pill-btn");
  const moduleCards = document.querySelectorAll("#projects-grid .module-card");

  if (!filterBtns.length || !moduleCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      moduleCards.forEach((card) => {
        const cat = card.dataset.category;
        if (filter === "all" || cat === filter) {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 20);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(4px)";
          setTimeout(() => {
            card.style.display = "none";
          }, 150);
        }
      });
    });
  });
}

/* ==========================================================================
   6. INTERACTIVE CLI DRAWER
   ========================================================================== */
function initInteractiveCLI() {
  const cliDrawer = document.getElementById("cli-drawer");
  const cliToggleBtn = document.getElementById("cli-toggle-btn");
  const cliMinimizeBtn = document.getElementById("cli-minimize-btn");
  const navCliToggle = document.getElementById("nav-cli-toggle");
  const cliInput = document.getElementById("cli-input");
  const cliHistory = document.getElementById("cli-history");

  if (!cliDrawer || !cliInput) return;

  function toggleDrawer(open) {
    if (typeof open === "boolean") {
      if (open) {
        cliDrawer.classList.remove("closed");
        cliInput.focus();
      } else {
        cliDrawer.classList.add("closed");
      }
    } else {
      cliDrawer.classList.toggle("closed");
      if (!cliDrawer.classList.contains("closed")) {
        cliInput.focus();
      }
    }
  }

  cliToggleBtn?.addEventListener("click", () => toggleDrawer());
  cliMinimizeBtn?.addEventListener("click", () => toggleDrawer(false));
  navCliToggle?.addEventListener("click", () => toggleDrawer(true));

  const cmdHistoryList = [];
  let historyPointer = -1;

  cliInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const rawCmd = cliInput.value.trim();
      if (!rawCmd) return;

      cmdHistoryList.push(rawCmd);
      historyPointer = cmdHistoryList.length;

      appendHistoryLine(`boopbot:~$ ${rawCmd}`, "cmd-echo");
      cliInput.value = "";

      processCLICommand(rawCmd.toLowerCase());
    } else if (e.key === "ArrowUp") {
      if (historyPointer > 0) {
        historyPointer--;
        cliInput.value = cmdHistoryList[historyPointer];
      }
    } else if (e.key === "ArrowDown") {
      if (historyPointer < cmdHistoryList.length - 1) {
        historyPointer++;
        cliInput.value = cmdHistoryList[historyPointer];
      } else {
        historyPointer = cmdHistoryList.length;
        cliInput.value = "";
      }
    }
  });

  window.cliExecute = function(cmd) {
    toggleDrawer(true);
    appendHistoryLine(`boopbot:~$ ${cmd}`, "cmd-echo");
    processCLICommand(cmd.toLowerCase());
  };

  function appendHistoryLine(htmlContent, className = "") {
    const line = document.createElement("div");
    line.className = `cli-line ${className}`;
    line.innerHTML = htmlContent;
    cliHistory.appendChild(line);
    cliHistory.scrollTop = cliHistory.scrollHeight;
  }

  function processCLICommand(cmd) {
    switch (cmd) {
      case "help":
        appendHistoryLine(`
          <strong>boopbot Commands:</strong><br>
          &nbsp;&nbsp;<span class="cmd-highlight">contact</span>&nbsp;&nbsp;&nbsp;&nbsp;- Email & socials (LinkedIn, GitHub)<br>
          &nbsp;&nbsp;<span class="cmd-highlight">status</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Print system status<br>
          &nbsp;&nbsp;<span class="cmd-highlight">wave</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Trigger particle wave pulse<br>
          &nbsp;&nbsp;<span class="cmd-highlight">reboot</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Re-run bootloader sequence<br>
          &nbsp;&nbsp;<span class="cmd-highlight">clear</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Clear console buffer<br>
          &nbsp;&nbsp;<span class="cmd-highlight">exit</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Close drawer
        `);
        break;

      case "boop":
      case "boopbot":
        appendHistoryLine("🤖 *boop!* boopbot is online and listening.");
        break;

      case "contact":
      case "email":
      case "links":
        appendHistoryLine(`
          <strong>Contact Jophy:</strong><br>
          • Email: <a href="mailto:jophyc@engineering.upenn.edu" style="color: var(--amber); text-decoration: underline;">jophyc@engineering.upenn.edu</a><br>
          • LinkedIn: <a href="https://www.linkedin.com/in/jophy-chen/" target="_blank" rel="noopener noreferrer" style="color: var(--amber); text-decoration: underline;">https://www.linkedin.com/in/jophy-chen/</a><br>
          • GitHub: <a href="https://github.com/jophyyy" target="_blank" rel="noopener noreferrer" style="color: var(--amber); text-decoration: underline;">https://github.com/jophyyy</a>
        `);
        break;

      case "linkedin":
        appendHistoryLine(`LinkedIn: <a href="https://www.linkedin.com/in/jophy-chen/" target="_blank" rel="noopener noreferrer" style="color: var(--amber); text-decoration: underline;">https://www.linkedin.com/in/jophy-chen/</a>`);
        break;

      case "github":
        appendHistoryLine(`GitHub: <a href="https://github.com/jophyyy" target="_blank" rel="noopener noreferrer" style="color: var(--amber); text-decoration: underline;">https://github.com/jophyyy</a>`);
        break;

      case "wave":
      case "pulse":
        if (window.pulseWave) window.pulseWave();
        appendHistoryLine("Particle wave perturbation injected.");
        break;

      case "status":
        appendHistoryLine(`
          <strong>Jophy's Personal Status:</strong><br>
          • Courses: CIS 1600 (Discrete Math), CIS 1200 (Prog Lang & Data Structures)<br>
          • Projects: Roblox Game, Interactive Web OS<br>
          • Particle buffer: 2100 points @ 60 FPS<br>
          • Status: All systems nominal (5/5 bars)
        `);
        break;

      case "reboot":
      case "boot":
        toggleDrawer(false);
        if (window.rebootSequence) window.rebootSequence();
        break;

      case "clear":
        cliHistory.innerHTML = "";
        break;

      case "exit":
      case "quit":
        toggleDrawer(false);
        break;

      default:
        appendHistoryLine(`Command not found: ${cmd}. Type <span class="cmd-highlight">help</span> for commands.`, "cmd-error");
        break;
    }
  }
}

/* ==========================================================================
   7. SEQUENCE ACTIONS
   ========================================================================== */
function initSequenceActions() {
  const startBtn = document.getElementById("start-sequence-btn");
  if (!startBtn) return;

  startBtn.addEventListener("click", () => {
    if (window.pulseWave) window.pulseWave();
    if (window.pushSignal) {
      window.pushSignal(`<span class="f-time">SEQUENCE</span> <span class="f-user">operator</span> started sequence on <span class="f-target">layer 03</span>`);
    }
    startBtn.style.transform = "scale(0.97)";
    setTimeout(() => {
      startBtn.style.transform = "";
    }, 150);
  });
}

/* ==========================================================================
   8. HERO TYPEWRITER ANIMATION ("hello! welcome to jophy's home...")
   ========================================================================== */
function initHeroTypewriter() {
  const headlineTarget = document.getElementById("hero-type-target");
  const headlineCaret = document.querySelector(".hero-type-caret");
  const leadElement = document.getElementById("hero-lead") || document.querySelector(".hero-lead");
  const leadTarget = document.getElementById("hero-lead-type-target");
  const heroScrollCue = document.getElementById("hero-scroll-cue") || document.querySelector(".hero-scroll-cue");

  if (!headlineTarget) return;

  const headlineSegments = [
    { text: "hello", pauseAfter: 420, newline: true },
    { text: "welcome to", pauseAfter: 380, newline: true },
    { text: "jophy's home...", pauseAfter: 0, newline: false }
  ];

  const leadText = "student at upenn • exploring software systems, game design, and living interfaces.";

  let segmentIdx = 0;
  let charIdx = 0;
  let isTyping = false;
  let typeTimer = null;
  let typedHeadlineHTML = "";
  let popTimer = null;
  let scrollCueTimer = null;

  function popInScrollCue() {
    if (heroScrollCue && !heroScrollCue.classList.contains("scrolled-hidden")) {
      heroScrollCue.classList.add("popped-in");
    }
  }

  function popInLead() {
    if (leadElement) {
      if (leadTarget && !leadTarget.textContent.trim()) {
        leadTarget.textContent = leadText;
      }
      leadElement.classList.add("popped-in");
    }
    // Pop in the scroll down cue a little after the subtitle text pops in
    scrollCueTimer = setTimeout(popInScrollCue, 320);
  }

  function typeHeadlineChar() {
    if (segmentIdx >= headlineSegments.length) {
      // Headline finished typing -> make headline caret disappear
      if (headlineCaret) headlineCaret.classList.add("finished");
      // Pop in the subtitle with a crisp, snappy entrance
      popTimer = setTimeout(popInLead, 240);
      return;
    }

    const currentSegment = headlineSegments[segmentIdx];
    if (charIdx < currentSegment.text.length) {
      typedHeadlineHTML += currentSegment.text[charIdx];
      headlineTarget.innerHTML = typedHeadlineHTML;
      charIdx++;
      typeTimer = setTimeout(typeHeadlineChar, 38 + Math.random() * 26);
    } else {
      segmentIdx++;
      charIdx = 0;
      if (currentSegment.newline) {
        typedHeadlineHTML += "<br>";
        headlineTarget.innerHTML = typedHeadlineHTML;
      }
      typeTimer = setTimeout(typeHeadlineChar, currentSegment.pauseAfter);
    }
  }

  function startTyping() {
    if (isTyping) return;
    isTyping = true;
    clearTimeout(typeTimer);
    clearTimeout(popTimer);
    clearTimeout(scrollCueTimer);

    typedHeadlineHTML = "";
    headlineTarget.innerHTML = "";
    segmentIdx = 0;
    charIdx = 0;

    if (headlineCaret) headlineCaret.classList.remove("finished");

    if (leadElement) {
      leadElement.classList.remove("popped-in");
      if (leadTarget && !leadTarget.textContent.trim()) {
        leadTarget.textContent = leadText;
      }
    }

    if (heroScrollCue && !heroScrollCue.classList.contains("scrolled-hidden")) {
      heroScrollCue.classList.remove("popped-in");
    }

    setTimeout(typeHeadlineChar, 320);
  }

  window.startHeroTypewriter = function() {
    isTyping = false;
    startTyping();
  };

  const macDesktop = document.getElementById("macbook-desktop-boot");
  if (!macDesktop || macDesktop.style.display === "none" || macDesktop.classList.contains("finished")) {
    startTyping();
  }
}

/* ==========================================================================
   9. WORKING ON SECTION TYPEWRITER & POP-UP BOXES
   ========================================================================== */
function initWorkingSection() {
  const section = document.getElementById("working-on");
  const target = document.getElementById("working-type-target");
  const caret = document.querySelector(".working-type-caret");
  const boxesContainer = document.getElementById("working-boxes");
  if (!section || !target) return;

  let hasTriggered = false;

  function typeWorkingText() {
    if (hasTriggered) return;
    hasTriggered = true;

    const text = "what am i working on right now?";
    let charIdx = 0;
    target.textContent = "";
    if (caret) {
      caret.classList.remove("finished");
      caret.classList.add("typing");
    }

    function typeNext() {
      if (charIdx < text.length) {
        target.textContent = text.slice(0, charIdx + 1);
        charIdx++;
        setTimeout(typeNext, 34 + Math.random() * 24);
      } else {
        if (caret) {
          caret.classList.remove("typing");
          caret.classList.add("finished");
        }
        setTimeout(() => {
          if (boxesContainer) {
            boxesContainer.classList.add("boxes-revealed");
          }
        }, 180);
      }
    }
    setTimeout(typeNext, 180);
  }

  function handleScrollCheck() {
    if (hasTriggered) return;
    const rect = section.getBoundingClientRect();
    // When the top of the working-on section has scrolled comfortably into the viewport
    if (rect.top <= window.innerHeight * 0.82 && window.scrollY > 30) {
      typeWorkingText();
      window.removeEventListener("scroll", handleScrollCheck);
    }
  }

  window.addEventListener("scroll", handleScrollCheck, { passive: true });

  const targetHeadline = document.querySelector(".working-header") || section;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasTriggered && window.scrollY > 30) {
        typeWorkingText();
      }
    });
  }, { rootMargin: "0px 0px -60px 0px", threshold: 0.15 });

  observer.observe(targetHeadline);

  // Make scroll down cue disappear permanently once user first scrolls down
  const heroScrollCue = document.getElementById("hero-scroll-cue") || document.querySelector(".hero-scroll-cue");
  let scrollCueDismissed = false;

  function dismissScrollCue() {
    if (scrollCueDismissed) return;
    scrollCueDismissed = true;
    if (heroScrollCue) {
      heroScrollCue.classList.add("scrolled-hidden");
    }
    window.removeEventListener("scroll", handleScrollCueCheck);
  }

  function handleScrollCueCheck() {
    if (window.scrollY > 25) {
      dismissScrollCue();
    }
  }

  window.addEventListener("scroll", handleScrollCueCheck, { passive: true });
  if (window.scrollY > 25) {
    dismissScrollCue();
  }

  // If user clicks the scroll down cue directly, dismiss permanently and trigger typing
  const scrollCue = document.querySelector(".hero-scroll-cue a");
  if (scrollCue) {
    scrollCue.addEventListener("click", () => {
      dismissScrollCue();
      setTimeout(() => {
        if (!hasTriggered) typeWorkingText();
      }, 350);
    });
  }

  window.resetWorkingSection = function() {
    hasTriggered = false;
    target.textContent = "";
    if (caret) {
      caret.classList.remove("typing");
      caret.classList.add("finished");
    }
    if (boxesContainer) boxesContainer.classList.remove("boxes-revealed");
    window.addEventListener("scroll", handleScrollCheck, { passive: true });
  };

  window.resetScrollCue = function() {
    scrollCueDismissed = false;
    if (heroScrollCue) {
      heroScrollCue.classList.remove("scrolled-hidden");
      heroScrollCue.classList.add("popped-in");
    }
    window.addEventListener("scroll", handleScrollCueCheck, { passive: true });
  };
}

/* ==========================================================================
   5b. SHOWCASE NUMBER LINE ANIMATION (Full Bleed, 5x Scale, Continuous Travel)
   ========================================================================== */
/* ==========================================================================
   5b. SCROLL NUMBER LINE (2026 -> 2040, 7 Years View, Scroll-Driven)
   ========================================================================== */
function initShowcaseTimeline() {
  const header = document.getElementById("showcase-timeline-header");
  const track = document.getElementById("timeline-track");
  if (!header || !track) return null;

  // Years from 2026 to 2040 (15 years)
  const years = [];
  for (let y = 2026; y <= 2040; y++) {
    years.push(y);
  }

  let tickSpacing = 220;
  let dreamExtraGap = 330;
  let dreamPosition = 0;
  let totalTrackWidth = 0;
  let nodePositions = [];
  const nodes = [];

  track.innerHTML = `
    <div class="number-line-axis-bg" id="number-line-axis-bg"></div>
    <div class="number-line-axis-fill" id="number-line-axis-fill"></div>
  `;
  const axisFill = track.querySelector("#number-line-axis-fill");
  const axisBg = track.querySelector("#number-line-axis-bg");

  // Generate Year Nodes (2026 to 2040)
  years.forEach((year, index) => {
    const node = document.createElement("div");
    node.className = "number-line-node";
    node.dataset.index = index;
    node.innerHTML = `
      <div class="number-line-tick"></div>
      <div class="number-line-year">${year}</div>
    `;
    track.appendChild(node);
    nodes.push(node);
  });

  // Finale node: "my dream is..." (extends past 2040)
  const dreamNode = document.createElement("div");
  dreamNode.className = "number-line-node number-line-node-dream";
  dreamNode.dataset.index = years.length;
  dreamNode.innerHTML = `
    <div class="number-line-tick-dream">
      <svg class="number-line-arrow" width="22" height="28" viewBox="0 0 26 32" fill="none">
        <path d="M4 4L20 16L4 28" stroke="#111115" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="number-line-dream-badge">my dream is...</div>
  `;
  track.appendChild(dreamNode);
  nodes.push(dreamNode);

  const totalMilestones = nodes.length; // 16 milestones

  // Layout computation: ensures ~7 years are visible across the screen at any time
  function computeLayout() {
    const vw = window.innerWidth;
    // Tick spacing sized so exactly ~7 years fit across the viewport width
    tickSpacing = Math.round(Math.max(vw / 6.8, 120));
    dreamExtraGap = Math.round(tickSpacing * 1.5);

    nodePositions = [];
    years.forEach((_, i) => {
      nodePositions.push(i * tickSpacing);
    });
    dreamPosition = (years.length - 1) * tickSpacing + dreamExtraGap;
    nodePositions.push(dreamPosition);
    totalTrackWidth = dreamPosition + Math.round(tickSpacing * 1.8);

    if (axisBg) axisBg.style.width = `${totalTrackWidth}px`;

    nodes.forEach((node, i) => {
      node.style.left = `${nodePositions[i]}px`;
    });
  }

  computeLayout();

  window.addEventListener("resize", () => {
    computeLayout();
  }, { passive: true });

  // Pure scroll-driven timeline update:
  // progress represents the scroll progress of #vertical-showcase (0.0 to 1.0)
  function updateTimeline(progress) {
    // 1. Number line opacity & graceful upward drift:
    let timelineOpacity = 0;
    let timelineY = 0;

    if (progress <= 0) {
      timelineOpacity = 0;
      timelineY = 0;
    } else if (progress < 0.04) {
      timelineOpacity = progress / 0.04;
      timelineY = 0;
    } else if (progress < 0.16) {
      timelineOpacity = 1.0;
      timelineY = 0;
    } else if (progress < 0.30) {
      const tOut = (progress - 0.16) / 0.14;
      timelineOpacity = Math.max(0, 1.0 - tOut);
      timelineY = -tOut * 28;
    } else {
      timelineOpacity = 0;
      timelineY = -28;
    }

    header.style.opacity = timelineOpacity.toFixed(3);
    header.style.transform = `translateY(${timelineY.toFixed(1)}px)`;
    header.style.visibility = timelineOpacity > 0 ? "visible" : "hidden";
    header.style.pointerEvents = timelineOpacity > 0.1 ? "auto" : "none";

    // 2. Progression of milestones across timeline:
    // Maps progress 0.02 to 0.32 into timelineProgress 0.0 to 1.0
    let timelineProgress = 0;
    if (progress > 0.02) {
      timelineProgress = Math.min(Math.max((progress - 0.02) / 0.30, 0), 1.0);
    }

    const exactIndex = timelineProgress * (totalMilestones - 0.001);
    const activeIndex = Math.min(Math.floor(exactIndex), totalMilestones - 1);

    // Reveal nodes up to activeIndex (pure opacity fade-in)
    for (let i = 0; i < totalMilestones; i++) {
      const node = nodes[i];
      if (i <= activeIndex) {
        node.classList.add("is-revealed");
        if (i === activeIndex) {
          node.classList.add("is-active");
        } else {
          node.classList.remove("is-active");
        }
      } else {
        node.classList.remove("is-revealed", "is-active");
      }
    }

    // Number line axis fill advances smoothly from left to right
    const activeNodeX = nodePositions[activeIndex];
    const nextNodeX = activeIndex < totalMilestones - 1 ? nodePositions[activeIndex + 1] : totalTrackWidth;
    const subProgress = exactIndex - activeIndex;
    const currentFillX = activeNodeX + (nextNodeX - activeNodeX) * subProgress;

    if (axisFill) {
      axisFill.style.width = `${currentFillX.toFixed(1)}px`;
    }

    // Dynamic horizontal travel:
    // Starts anchored at left margin (translateX = 0) with 2026 at x = 0.
    // The first 7 years (2026 to 2032) are visible across the screen.
    // As currentFillX advances past year 7 (nodePositions[6]), track glides smoothly left,
    // sliding 2026, 2027, etc. off-screen to the left!
    const initialLead = nodePositions[6] || window.innerWidth * 0.85;
    const finalLead = window.innerWidth * 0.72;
    let focalLead = initialLead;
    if (currentFillX > initialLead) {
      const travelProgress = Math.min((currentFillX - initialLead) / (dreamPosition - initialLead), 1.0);
      focalLead = initialLead + (finalLead - initialLead) * travelProgress;
    }
    const targetTrackX = Math.min(0, focalLead - currentFillX);
    track.style.transform = `translateX(${targetTrackX.toFixed(1)}px)`;
  }

  window.updateShowcaseTimeline = updateTimeline;
  return updateTimeline;
}

/* ==========================================================================
   VERTICAL SLIDING IMAGE TRACK (3 Simultaneous Counter-Scrolling Columns)
   ========================================================================== */
function initVerticalImageTrack() {
  const trackMid = document.getElementById("image-track-mid");
  const trackLeft = document.getElementById("image-track-left");
  const trackRight = document.getElementById("image-track-right");
  const stage = document.getElementById("track-stage");
  const showcaseSection = document.getElementById("vertical-showcase");

  const trackColumns = document.getElementById("track-columns") || (stage ? stage.querySelector(".track-columns") : null);
  const textWrap = document.getElementById("showcase-bg-text-wrap");
  const bannerFlag = document.getElementById("banner-flag");
  const flagCanvas = document.getElementById("flag-canvas");
  const bannerTowCable = document.getElementById("banner-tow-cable");
  const bannerAirplane = document.getElementById("banner-airplane");
  const skySmokeLoop = document.getElementById("sky-smoke-loop");
  const smokeCirclePath = document.getElementById("smoke-circle-path");
  const bgText = document.getElementById("showcase-bg-text");
  const worldMap = document.getElementById("world-map-backdrop");
  if (!trackMid || !stage || !showcaseSection) return;

  // Initialize timeline and get scroll updater
  const updateTimeline = window.updateShowcaseTimeline || initShowcaseTimeline();

  const imagesMid = Array.from(trackMid.getElementsByClassName("image"));
  const imagesLeft = trackLeft ? Array.from(trackLeft.getElementsByClassName("image")) : [];
  const imagesRight = trackRight ? Array.from(trackRight.getElementsByClassName("image")) : [];
  const imagesSides = [...imagesLeft, ...imagesRight];

  // Responsive scale bounds: starts at an expansive 0.92-0.94 and gracefully scales up to 1.12-1.15
  function getTrackScaleRange() {
    const width = window.innerWidth;
    if (width <= 640) {
      return { min: 0.90, max: 1.05 };
    } else if (width <= 1024) {
      return { min: 0.91, max: 1.09 };
    } else if (width <= 1440) {
      return { min: 0.92, max: 1.12 };
    } else {
      return { min: 0.94, max: 1.15 };
    }
  }

  function calculateState() {
    const rect = showcaseSection.getBoundingClientRect();
    const vh = window.innerHeight;
    const stickyScrollDistance = rect.height - vh;

    // Trigger offset: the pixel mark before the stage pins sticky.
    // When the top of showcaseSection enters within 65% of viewport height (as you pass the post-it notes),
    // the timeline scroll starts! Users can scroll from anywhere on the page without entering a specific hitbox.
    const triggerOffset = Math.round(vh * 0.65);
    const totalScrollRange = triggerOffset + stickyScrollDistance;
    const currentScrolled = triggerOffset - rect.top;

    let progress = 0;
    if (totalScrollRange > 0 && currentScrolled > 0) {
      progress = Math.min(Math.max(currentScrolled / totalScrollRange, 0), 1.0);
    }

    return { progress };
  }

  function applyTrackState(progress) {
    // 1. Update Scroll-Driven Number Line (2026 -> 2040)
    if (updateTimeline) {
      updateTimeline(progress);
    }

    // 2. Continuous Grid Motion (Progress 0.18 -> 0.64)
    const gridProgress = Math.min(Math.max((progress - 0.18) / 0.46, 0), 1.0);
    const percentage = -gridProgress * 100;
    const sidePercentage = -100 - percentage;

    trackMid.dataset.percentage = percentage;
    if (trackLeft) trackLeft.dataset.percentage = sidePercentage;
    if (trackRight) trackRight.dataset.percentage = sidePercentage;

    const trackY_mid = -5.8 + (percentage * 0.884);
    const trackY_side = -5.8 + (sidePercentage * 0.884);

    // 1. Move Middle Track
    trackMid.style.transform = `translate(-50%, ${trackY_mid.toFixed(3)}%)`;
    const midPos = (100 + percentage).toFixed(2);
    for (let i = 0; i < imagesMid.length; i++) {
      imagesMid[i].style.objectPosition = `center ${midPos}%`;
    }

    // 2. Move Side Tracks (Counter-motion)
    if (trackLeft) {
      trackLeft.style.transform = `translate(-50%, ${trackY_side.toFixed(3)}%)`;
    }
    if (trackRight) {
      trackRight.style.transform = `translate(-50%, ${trackY_side.toFixed(3)}%)`;
    }
    const sidePos = (100 + sidePercentage).toFixed(2);
    for (let i = 0; i < imagesSides.length; i++) {
      imagesSides[i].style.objectPosition = `center ${sidePos}%`;
    }

    // 3. Dynamic Grid Scale
    const { min: minScale, max: maxScale } = getTrackScaleRange();
    const gridScale = minScale + gridProgress * (maxScale - minScale);

    // 4. Staged Opacity & Aerial Finale Sequence:
    // A. Grid Columns Fade In (progress 0.15 -> 0.25)
    // B. Text Slides in from Left toward Center (progress 0.54 -> 0.64)
    // C. Grid Columns Fade OUT FIRST (progress 0.64 -> 0.70) while Text locks centered at full scale
    // D. Airplane Finale (progress 0.70 -> 0.889) — commands exactly 2.2k px of dedicated scroll:
    //    Phase 1 (0.70 -> 0.73): Text shrinks smoothly in size (1.00 -> 0.58)
    //    Phase 2 (0.72 -> 0.82): Vintage airplane arrives from lower-left, performs 360° air-circle with smoke loop, and swoops up to text (takes ~1,165px of scroll!)
    //    Phase 3 (0.815 -> 0.835): Canvas banner flag unfurls around text & tow cable attaches (~230px)
    //    Phase 4 (0.835 -> 0.889): Airplane accelerates and tows banner & text across the sky and completely disappears to the right (~630px of scroll!)
    // E. World Map Finale (progress 0.885 -> 1.000):
    //    After plane flies away and disappears with the text, the world map fades in (0.885 -> 0.925) and stays fully visible

    // A & C: Grid Columns Opacity & Soft Vertical Parallax Drift
    let columnsOpacity = 0;
    let columnsY = 0;

    if (progress < 0.15) {
      columnsOpacity = 0;
      columnsY = 28;
    } else if (progress < 0.25) {
      const tIn = (progress - 0.15) / 0.10;
      columnsOpacity = tIn;
      columnsY = 28 * (1.0 - tIn);
    } else if (progress <= 0.64) {
      columnsOpacity = 1.0;
      columnsY = 0;
    } else if (progress <= 0.70) {
      // Grid fades out FIRST before the text, floating gently upward
      const tOut = (progress - 0.64) / 0.06;
      columnsOpacity = Math.max(0, 1.0 - tOut);
      columnsY = -tOut * 24;
    } else {
      columnsOpacity = 0;
      columnsY = -24;
    }

    // B: Background Text Entry & Center Locking
    let textOpacity = 0;
    let xTravel = -22;
    let textPopScale = 0.96;

    if (progress < 0.54) {
      textOpacity = 0;
      xTravel = -22;
      textPopScale = 0.96;
    } else if (progress < 0.64) {
      // Slides in smoothly from left toward center
      const tSlide = (progress - 0.54) / 0.10;
      xTravel = -22 * (1.0 - tSlide); // -22vw up to 0vw
      textOpacity = tSlide * 0.70;
      textPopScale = 0.96 + tSlide * 0.04;
    } else if (progress <= 0.70) {
      // Centers at 0vw and finishes popping out to full 1.0 as grid fades away!
      const tPop = (progress - 0.64) / 0.06;
      xTravel = 0;
      textOpacity = 0.70 + tPop * 0.30; // reaches 1.0 at 0.70
      textPopScale = 1.00;
    } else {
      xTravel = 0;
      textOpacity = 1.0;
      textPopScale = 1.00;
    }

    // D: 4-Phase Airplane Tow Finale (progress 0.70 -> 0.889) — delivers 2.2k px of dedicated scroll!
    // Phase 1: Text Shrink (0.70 -> 0.73)
    let bannerScale = textPopScale;
    if (progress >= 0.70) {
      const tShrink = Math.min((progress - 0.70) / 0.03, 1.0);
      const easeShrink = 0.5 - 0.5 * Math.cos(tShrink * Math.PI);
      bannerScale = 1.00 - easeShrink * 0.42; // shrinks from 1.00 down to 0.58
    }

    // Phase 2: Airplane Stunt Entrance & Air-Circle (progress 0.72 -> 0.82)
    // Takes longer to get there, comes from lower down, loops a 360° air-circle with skywriter smoke, and swoops up to the text
    let planeX = 0;
    let planeY = 0;
    let planePitch = 0;
    let planeOpacity = 0;
    let smokeOpacity = 0;
    let smokeOffset = 452.4;

    const isMobile = window.innerWidth <= 640;
    const loopRadius = isMobile ? 48 : 72;
    const loopCenterY = isMobile ? 95 : 120;
    const loopCenterX = isMobile ? -(window.innerWidth * 0.38 + 50) : -(window.innerWidth * 0.32 + 130);
    const loopBottomY = loopCenterY + loopRadius; // low altitude!

    if (progress < 0.72) {
      planeOpacity = 0;
      planeX = -(window.innerWidth * 1.25 + 400);
      planeY = loopBottomY + 15;
      smokeOpacity = 0;
    } else if (progress < 0.82) {
      const tPlane = (progress - 0.72) / 0.10; // 0.10 scroll span

      if (tPlane < 0.32) {
        // Sub-phase A: Low Approach from far left
        const uA = tPlane / 0.32;
        const easeA = 1.0 - Math.pow(1.0 - uA, 2.0);
        const startX = -(window.innerWidth * 1.25 + 400);
        const startY = loopBottomY + 15;

        planeX = startX + (loopCenterX - startX) * easeA;
        planeY = startY + (loopBottomY - startY) * easeA;
        planePitch = -3.5;
        planeOpacity = Math.min(uA * 4.0, 1.0);
        smokeOpacity = 0;
        smokeOffset = 452.4;
      } else if (tPlane < 0.72) {
        // Sub-phase B: The 360° Aerobatic Air-Circle!
        const uB = (tPlane - 0.32) / 0.40;
        const angle = uB * 2.0 * Math.PI;

        planeX = loopCenterX + loopRadius * Math.sin(angle);
        planeY = loopCenterY + loopRadius * Math.cos(angle);
        planePitch = -(uB * 360.0);
        planeOpacity = 1.0;

        // Skywriter smoke trail renders around circle in sync
        smokeOpacity = Math.min(uB * 2.5, 0.85);
        smokeOffset = 452.4 * (1.0 - uB);
      } else {
        // Sub-phase C: Pull out of loop, climb up to text & dock
        const uC = (tPlane - 0.72) / 0.28;
        const easeC = 1.0 - Math.pow(1.0 - uC, 2.4);

        planeX = loopCenterX * (1.0 - easeC);
        planeY = loopBottomY * (1.0 - easeC);
        planePitch = Math.sin(uC * Math.PI) * -16.0;
        planeOpacity = 1.0;

        // Smoke ring lingers and slowly dissolves
        smokeOpacity = Math.max(0, 0.85 * (1.0 - uC * 1.5));
        smokeOffset = 0;
      }
    } else {
      // Docked at tow hitch position
      planeOpacity = 1.0;
      planeX = 0;
      planeY = 0;
      planePitch = 0;
      smokeOpacity = 0;
    }

    // Phase 3: Flag forms around the text & tow cable attaches (0.815 -> 0.835)
    let flagT = 0;
    if (progress < 0.815) {
      flagT = 0;
    } else if (progress < 0.835) {
      flagT = (progress - 0.815) / 0.020;
    } else {
      flagT = 1.0;
    }

    // Phase 4: Airplane tows the flag & text off to the right (0.835 -> 0.889)
    let towX = 0;
    let towY = 0;
    let towPitch = 0;
    let finalAlpha = 1.0;

    if (progress >= 0.835) {
      const tTow = Math.min((progress - 0.835) / 0.054, 1.0);
      const easeTow = Math.pow(tTow, 1.35);
      towX = easeTow * 135; // 135vw to completely clear screen
      towY = -easeTow * 32; // gentle climbing path
      towPitch = -easeTow * 3.5; // slight nose-up climb attitude

      if (tTow > 0.90) {
        finalAlpha = Math.max(0, 1.0 - (tTow - 0.90) / 0.10);
      }
    }

    // Apply styles to grid columns
    if (trackColumns) {
      trackColumns.style.transform = `translateY(${columnsY.toFixed(1)}px) scale(${gridScale.toFixed(4)})`;
      trackColumns.style.opacity = columnsOpacity.toFixed(3);
      trackColumns.style.visibility = columnsOpacity > 0 ? "visible" : "hidden";
      trackColumns.style.pointerEvents = columnsOpacity > 0.1 ? "auto" : "none";
    }

    // Apply styles to banner flag (contains text, canvas, and tow rig)
    const activeBanner = bannerFlag || bgText;
    if (activeBanner) {
      const bannerX = (progress < 0.70) ? xTravel : towX;
      const bannerY = (progress < 0.70) ? 0 : towY;
      const bannerOpacity = (progress < 0.70) ? textOpacity : (textOpacity * finalAlpha);

      activeBanner.style.transform = `translate(${bannerX.toFixed(2)}vw, ${bannerY.toFixed(1)}px) scale(${bannerScale.toFixed(3)})`;
      activeBanner.style.opacity = bannerOpacity.toFixed(3);
      activeBanner.style.visibility = bannerOpacity > 0 ? "visible" : "hidden";
    }

    // Skywriter smoke loop trail
    if (skySmokeLoop) {
      skySmokeLoop.style.left = `${loopCenterX.toFixed(1)}px`;
      skySmokeLoop.style.top = `${loopCenterY.toFixed(1)}px`;
      skySmokeLoop.style.opacity = smokeOpacity.toFixed(3);
      skySmokeLoop.style.visibility = smokeOpacity > 0 ? "visible" : "hidden";
    }
    if (smokeCirclePath) {
      smokeCirclePath.style.strokeDashoffset = smokeOffset.toFixed(1);
    }

    // Unfurl flag canvas around text from right to left
    if (flagCanvas) {
      flagCanvas.style.opacity = flagT.toFixed(3);
      flagCanvas.style.clipPath = (flagT > 0.001 && flagT < 0.999)
        ? `inset(0 0 0 ${((1.0 - flagT) * 100).toFixed(1)}%)`
        : "none";
    }

    // Tow cable attachment
    if (bannerTowCable) {
      bannerTowCable.style.opacity = flagT.toFixed(3);
      bannerTowCable.style.transform = `scaleX(${Math.max(0.08, flagT).toFixed(3)})`;
    }

    // Airplane flight and attitude
    if (bannerAirplane) {
      const netPitch = planePitch + towPitch;
      bannerAirplane.style.opacity = (planeOpacity * finalAlpha).toFixed(3);
      bannerAirplane.style.transform = `translate(${planeX.toFixed(1)}px, ${planeY.toFixed(1)}px) rotate(${netPitch.toFixed(1)}deg)`;
      bannerAirplane.style.visibility = (planeOpacity * finalAlpha) > 0.001 ? "visible" : "hidden";
    }

    // Layering: bring text and aerial rig above fading grid
    if (textWrap) {
      textWrap.style.zIndex = progress >= 0.64 ? "10" : "1";
    }

    // 5. World Map Finale: Fades in after the plane flies away and disappears with the text (0.885 -> 1.000)
    if (worldMap) {
      let mapOpacity = 0;
      let mapScale = 0.97;

      if (progress < 0.885) {
        mapOpacity = 0;
        mapScale = 0.97;
      } else if (progress < 0.925) {
        const tMap = (progress - 0.885) / 0.040;
        mapOpacity = tMap;
        mapScale = 0.97 + 0.03 * tMap;
      } else {
        mapOpacity = 1.0;
        mapScale = 1.00;
      }

      worldMap.style.opacity = mapOpacity.toFixed(3);
      worldMap.style.transform = `scale(${mapScale.toFixed(3)})`;
      worldMap.style.visibility = mapOpacity > 0 ? "visible" : "hidden";
      worldMap.style.pointerEvents = mapOpacity > 0.4 ? "auto" : "none";
    }
  }

  // Smooth lerp state
  let targetProgress = 0;
  let currentProgress = 0;
  let isAnimating = false;

  function renderFrame() {
    const pDiff = targetProgress - currentProgress;

    if (Math.abs(pDiff) > 0.0003) {
      currentProgress += pDiff * 0.18;
      isAnimating = true;
      requestAnimationFrame(renderFrame);
    } else {
      currentProgress = targetProgress;
      isAnimating = false;
    }

    applyTrackState(currentProgress);
  }

  function updateOnScroll(immediate = false) {
    const { progress } = calculateState();
    targetProgress = progress;

    if (immediate) {
      currentProgress = progress;
      applyTrackState(currentProgress);
      return;
    }

    if (!isAnimating) {
      isAnimating = true;
      requestAnimationFrame(renderFrame);
    }
  }

  // Initial update
  updateOnScroll(true);

  // 1. Natural page scroll listener on the entire window
  window.addEventListener(
    "scroll",
    () => {
      updateOnScroll(false);
    },
    { passive: true }
  );

  // 2. Keep layout in sync across window resize
  window.addEventListener(
    "resize",
    () => {
      updateOnScroll(true);
    },
    { passive: true }
  );
}





