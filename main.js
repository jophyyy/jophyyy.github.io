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
      window.scrollTo(0, 0);
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
  const leadTarget = document.getElementById("hero-lead-type-target");
  const leadCaret = document.querySelector(".hero-lead-type-caret");

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

  let leadCharIdx = 0;
  let leadTimer = null;
  let typedLeadHTML = "";

  function typeLeadChar() {
    if (leadCharIdx < leadText.length) {
      typedLeadHTML += leadText[leadCharIdx];
      if (leadTarget) leadTarget.innerHTML = typedLeadHTML;
      leadCharIdx++;
      leadTimer = setTimeout(typeLeadChar, 24 + Math.random() * 20);
    } else {
      // Subtitle finished typing -> make orange caret disappear
      if (leadCaret) {
        leadCaret.classList.remove("waiting");
        leadCaret.classList.add("finished");
      }
    }
  }

  function startLeadTyping() {
    if (!leadTarget) return;
    if (leadCaret) {
      leadCaret.classList.remove("waiting");
      leadCaret.classList.remove("finished");
    }
    leadCharIdx = 0;
    typedLeadHTML = "";
    leadTarget.innerHTML = "";
    leadTimer = setTimeout(typeLeadChar, 200);
  }

  function typeHeadlineChar() {
    if (segmentIdx >= headlineSegments.length) {
      // Headline finished typing -> make headline caret disappear
      if (headlineCaret) headlineCaret.classList.add("finished");
      // Now start subtitle typewriter
      setTimeout(startLeadTyping, 280);
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
    clearTimeout(leadTimer);

    typedHeadlineHTML = "";
    headlineTarget.innerHTML = "";
    segmentIdx = 0;
    charIdx = 0;

    if (headlineCaret) headlineCaret.classList.remove("finished");

    if (leadTarget) {
      leadTarget.innerHTML = "";
      if (leadCaret) {
        leadCaret.classList.add("waiting");
        leadCaret.classList.remove("finished");
      }
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
    }
    window.addEventListener("scroll", handleScrollCueCheck, { passive: true });
  };
}

/* ==========================================================================
   5b. SHOWCASE TITLE & NUMBER LINE ANIMATION (2008 -> 2026 -> my dream is...)
   ========================================================================== */
function initShowcaseTimeline() {
  const titleSection = document.getElementById("showcase-title-section");
  const header = document.getElementById("showcase-timeline-header");
  const track = document.getElementById("timeline-track");
  if (!titleSection || !header || !track) return;

  // Years from 2008 to 2026
  const years = [];
  for (let y = 2008; y <= 2026; y++) {
    years.push(y);
  }

  track.innerHTML = `
    <div class="number-line-axis-bg"></div>
    <div class="number-line-axis-fill" id="number-line-axis-fill"></div>
  `;
  const axisFill = track.querySelector("#number-line-axis-fill");
  const nodes = [];

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

  // Finale node: "my dream is..."
  const dreamNode = document.createElement("div");
  dreamNode.className = "number-line-node number-line-node-dream";
  dreamNode.dataset.index = years.length;
  dreamNode.innerHTML = `
    <div class="number-line-tick-dream">
      <svg class="number-line-arrow" width="8" height="10" viewBox="0 0 8 10" fill="none">
        <path d="M1 1L6 5L1 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="number-line-dream-badge">my dream is...</div>
  `;
  track.appendChild(dreamNode);
  nodes.push(dreamNode);

  const totalMilestones = nodes.length; // 20

  let animStartTime = null;
  const animDuration = 2400; // 2.4s smooth fade progression
  let hasStartedAnim = false;
  let isAnimComplete = false;
  let animRafId = null;

  function renderAnim(now) {
    if (!animStartTime) animStartTime = now;
    const elapsed = now - animStartTime;
    const animProgress = Math.min(elapsed / animDuration, 1.0);

    // Active milestone index (0 to 19)
    const activeIndex = Math.min(Math.floor(animProgress * (totalMilestones - 0.001)), totalMilestones - 1);

    // Fade in nodes sequentially up to activeIndex
    for (let i = 0; i < totalMilestones; i++) {
      const node = nodes[i];
      if (i <= activeIndex) {
        node.classList.add("is-revealed");
        if (i === activeIndex && !isAnimComplete) {
          node.classList.add("is-active");
        } else {
          node.classList.remove("is-active");
        }
      } else {
        node.classList.remove("is-revealed", "is-active");
      }
    }

    // Number line axis fill advances smoothly from left to right
    if (axisFill) {
      axisFill.style.width = `${(animProgress * 100).toFixed(1)}%`;
    }

    if (animProgress < 1.0) {
      animRafId = requestAnimationFrame(renderAnim);
    } else {
      isAnimComplete = true;
      animRafId = null;
      nodes.forEach((n) => n.classList.add("is-revealed"));
      nodes.forEach((n) => n.classList.remove("is-active"));
      nodes[nodes.length - 1].classList.add("is-active");
      if (axisFill) axisFill.style.width = "100%";
    }
  }

  function startAnimation() {
    if (hasStartedAnim) return;
    hasStartedAnim = true;
    header.style.opacity = "1";
    animStartTime = null;
    if (animRafId) cancelAnimationFrame(animRafId);
    animRafId = requestAnimationFrame(renderAnim);
  }

  function resetTimeline() {
    if (animRafId) cancelAnimationFrame(animRafId);
    animRafId = null;
    animStartTime = null;
    hasStartedAnim = false;
    isAnimComplete = false;
    nodes.forEach((n) => {
      n.classList.remove("is-revealed", "is-active");
    });
    if (axisFill) axisFill.style.width = "0%";
    header.style.opacity = "0";
  }

  // Scroll check for when titleSection enters view
  function checkTitleVisibility() {
    const rect = titleSection.getBoundingClientRect();
    const vh = window.innerHeight;

    // When titleSection enters within 85% of viewport from bottom
    if (rect.top <= vh * 0.85 && rect.bottom >= 0) {
      startAnimation();
    } else if (rect.top > vh) {
      // Scrolled back above the section
      resetTimeline();
    }
  }

  window.addEventListener("scroll", checkTitleVisibility, { passive: true });

  // Initial check
  checkTitleVisibility();
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
  const bgText = document.getElementById("showcase-bg-text");

  if (!trackMid || !stage || !showcaseSection) return;

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
    const scrollDistance = rect.height - vh;

    // rect.top is the distance from viewport top to showcaseSection top.
    // When rect.top > 0, the user is above the showcase (e.g. in #working-on).
    // When rect.top <= 0 and rect.bottom >= vh, the showcase is pinned sticky!
    let progress = 0;
    if (scrollDistance > 0) {
      progress = Math.min(Math.max(-rect.top / scrollDistance, 0), 1);
    }

    // Entrance Opacity:
    // Before you start scrolling into the grid (or when above it):
    // If rect.top > 0: user is above the showcase -> entranceOpacity = 0 (100% invisible).
    // When user enters the showcase and starts scrolling:
    // From progress = 0.0 to progress = 0.12 (first ~12% of scroll, ~120px):
    // Smoothly fades in from 0.0 to 1.0!
    // For progress >= 0.12: entranceOpacity = 1.0.
    let entranceOpacity = 0;
    if (rect.top <= 0) {
      if (progress < 0.12) {
        entranceOpacity = Math.max(0, progress / 0.12);
      } else {
        entranceOpacity = 1.0;
      }
    } else {
      entranceOpacity = 0;
    }

    return { progress, entranceOpacity };
  }

  function applyTrackState(progress, entranceOpacity) {
    const clampedProgress = Math.min(Math.max(progress, 0), 1);
    const percentage = -clampedProgress * 100;
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

    // 3. Dynamic Grid Scale & Spotlight Dimming
    const { min: minScale, max: maxScale } = getTrackScaleRange();
    const currentScale = minScale + clampedProgress * (maxScale - minScale);

    let spotlightOpacity = 1.0;
    if (clampedProgress >= 0.32 && clampedProgress <= 0.68) {
      const distFromCenter = Math.abs(clampedProgress - 0.50);
      const fadeFactor = 1 - (distFromCenter / 0.18);
      spotlightOpacity = 1.0 - (fadeFactor * 0.46); // dips from 1.0 down to ~0.54 at center
    }

    const effectiveColumnsOpacity = entranceOpacity * spotlightOpacity;

    if (trackColumns) {
      trackColumns.style.transform = `scale(${currentScale.toFixed(4)})`;
      trackColumns.style.opacity = effectiveColumnsOpacity.toFixed(3);
    }

    // 4. Parallax Background Text (Pops out darker when centered, fades as pictures return, disappears at end)
    if (bgText) {
      const xTravel = (clampedProgress - 0.5) * 62;

      let textOpacity = 0;
      if (clampedProgress < 0.14) {
        textOpacity = 0;
      } else if (clampedProgress < 0.32) {
        textOpacity = ((clampedProgress - 0.14) / 0.18) * 0.35;
      } else if (clampedProgress <= 0.50) {
        const t = (clampedProgress - 0.32) / 0.18;
        textOpacity = 0.35 + t * 0.60;
      } else if (clampedProgress <= 0.68) {
        const t = (clampedProgress - 0.50) / 0.18;
        textOpacity = 0.95 - t * 0.63;
      } else if (clampedProgress <= 0.84) {
        const t = (clampedProgress - 0.68) / 0.16;
        textOpacity = 0.32 - t * 0.17;
      } else {
        const t = Math.min((clampedProgress - 0.84) / 0.16, 1);
        textOpacity = Math.max(0, 0.15 - t * 0.15);
      }

      const effectiveTextOpacity = textOpacity * entranceOpacity;
      const textPopScale = 0.96 + (textOpacity / 0.95) * 0.08;

      bgText.style.transform = `translateX(${xTravel.toFixed(2)}vw) scale(${textPopScale.toFixed(3)})`;
      bgText.style.opacity = effectiveTextOpacity.toFixed(3);
    }
  }

  // Smooth lerp state
  let targetProgress = 0;
  let currentProgress = 0;
  let targetEntrance = 0;
  let currentEntrance = 0;
  let isAnimating = false;

  function renderFrame() {
    const pDiff = targetProgress - currentProgress;
    const eDiff = targetEntrance - currentEntrance;

    if (Math.abs(pDiff) > 0.0003 || Math.abs(eDiff) > 0.002) {
      currentProgress += pDiff * 0.18;
      currentEntrance += eDiff * 0.18;
      isAnimating = true;
      requestAnimationFrame(renderFrame);
    } else {
      currentProgress = targetProgress;
      currentEntrance = targetEntrance;
      isAnimating = false;
    }

    applyTrackState(currentProgress, currentEntrance);
  }

  function updateOnScroll(immediate = false) {
    const { progress, entranceOpacity } = calculateState();
    targetProgress = progress;
    targetEntrance = entranceOpacity;

    if (immediate) {
      currentProgress = progress;
      currentEntrance = entranceOpacity;
      applyTrackState(currentProgress, currentEntrance);
      return;
    }

    if (!isAnimating) {
      isAnimating = true;
      requestAnimationFrame(renderFrame);
    }
  }

  // Initial update
  updateOnScroll(true);

  // 1. Natural page scroll listener
  window.addEventListener(
    "scroll",
    () => {
      updateOnScroll(false);
    },
    { passive: true }
  );

  // 2. Mouse Dragging on Stage scrolls window
  let isDragging = false;
  let dragStartY = 0;

  stage.addEventListener("mousedown", (e) => {
    isDragging = true;
    dragStartY = e.clientY;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const deltaY = dragStartY - e.clientY;
    dragStartY = e.clientY;
    window.scrollBy({ top: deltaY * 1.5, behavior: "auto" });
  });

  // 3. Keep layout in sync across window resize
  window.addEventListener(
    "resize",
    () => {
      updateOnScroll(true);
    },
    { passive: true }
  );
}





