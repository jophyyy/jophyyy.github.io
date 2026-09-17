/* ==========================================================================
   DEPTHTHREAD WORKFLOW OS — MAIN JAVASCRIPT
   Aesthetic: Depththread Industrial Pixel Telemetry HUD
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initParticleWave();
  initBootSequence();
  initCoordinatesTracker();
  initQueueAndFeedInteractions();
  initProjectFilters();
  initInteractiveCLI();
  initSequenceActions();
});

/* ==========================================================================
   1. PARTICLE WAVE CANVAS (Signature Depththread 2.5D Point Cloud Ribbon)
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

    const horizonY = height * 0.46;

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
   2. TERMINAL BOOT SEQUENCE
   ========================================================================== */
function initBootSequence() {
  const bootTerminal = document.getElementById("boot-terminal");
  const skipBtn = document.getElementById("skip-boot-btn");
  const bootLinesContainer = document.getElementById("boot-lines");
  const currentTyping = document.getElementById("current-typing");
  const promptPrefix = document.getElementById("prompt-prefix");
  const bootConsole = document.getElementById("boot-console");

  if (!bootTerminal) return;

  bootTerminal.style.display = "flex";
  bootTerminal.classList.remove("finished");

  let isSkipped = false;

  function finishBoot() {
    if (isSkipped) return;
    isSkipped = true;
    bootTerminal.classList.add("finished");
    setTimeout(() => {
      bootTerminal.style.display = "none";
    }, 400);
  }

  skipBtn?.addEventListener("click", finishBoot);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") finishBoot();
  });

  window.rebootSequence = function() {
    isSkipped = false;
    bootTerminal.style.display = "flex";
    bootTerminal.classList.remove("finished");
    bootLinesContainer.innerHTML = "";
    stepIdx = 0;
    runNextStep();
  };

  const scriptSteps = [
    { type: "cmd", text: "depththread --init --layer 03", delayAfter: 320 },
    { type: "output", text: "[kernel] loading workflow primitives: layers, signals, drift buffers... ok", delayAfter: 240 },
    { type: "cmd", text: "depth status", delayAfter: 350 },
    { type: "info", text: "> DEPTHTHREAD WORKFLOW OS v4.3.0", delayAfter: 180 },
    { type: "info", text: "> 03 active layers detected across 07 allocated partitions.", delayAfter: 240 },
    { type: "prompt-question", prompt: "Initialize telemetry signal feed and queue daemon? (Y/n)", answer: "Y", delayAfter: 320 },
    { type: "success", text: "✔ Telemetry feed connected at 60 FPS (all systems nominal).", delayAfter: 220 },
    { type: "prompt-question", prompt: "Stream particle wave point cloud across Layer 03? (Y/n)", answer: "y", delayAfter: 320 },
    { type: "output", text: "  [wave-compositor] 2100 points calibrated on GPU raster canvas.", delayAfter: 200 },
    { type: "prompt-question", prompt: "Run layer sync verification sequence? (Y/n)", answer: "y", delayAfter: 300 },
    { type: "output", text: "  ├── #0421 [depth 03] align the layers ... synced", delayAfter: 160 },
    { type: "output", text: "  ├── #0417 [depth 02] push the line    ... synced", delayAfter: 160 },
    { type: "output", text: "  ├── #0412 [depth 01] sync the drift   ... waiting", delayAfter: 160 },
    { type: "output", text: "  └── #0409 [depth 00] light the signal ... ready", delayAfter: 200 },
    { type: "prompt-question", prompt: "Ready to mount HUD telemetry interface? (Y/n)", answer: "y", delayAfter: 350 },
    { type: "success", text: "  DEPTHTHREAD OS online. All systems nominal.", delayAfter: 200 },
    { type: "output", text: "  ➜ Protocol: http://localhost:5173/workflow-os", delayAfter: 150 },
    { type: "info", text: "  ➜ Entering workspace...", delayAfter: 600 }
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
      setTimeout(finishBoot, 350);
      return;
    }

    const step = scriptSteps[stepIdx];
    stepIdx++;

    if (step.type === "cmd") {
      if (promptPrefix) {
        promptPrefix.innerHTML = '<span class="prompt-user">depth</span>:<span class="prompt-dir">~/workflow</span>$&nbsp;';
      }
      typeCommand(step.text, () => {
        if (isSkipped) return;
        const line = document.createElement("div");
        line.className = "boot-line command";
        line.innerHTML = `<span class="prompt-user">depth</span>:<span class="prompt-dir">~/workflow</span>$ ${step.text}`;
        bootLinesContainer.appendChild(line);
        currentTyping.textContent = "";
        scrollConsole();
        setTimeout(runNextStep, step.delayAfter || 200);
      }, 22);
    } else if (step.type === "prompt-question") {
      if (promptPrefix) {
        promptPrefix.innerHTML = '<span class="q-icon">?</span>&nbsp;';
      }
      currentTyping.textContent = step.prompt + " ";
      scrollConsole();

      setTimeout(() => {
        if (isSkipped) return;
        typeCommand(step.answer, () => {
          if (isSkipped) return;
          const line = document.createElement("div");
          line.className = "boot-line question";
          line.innerHTML = `<span class="q-icon">?</span> ${step.prompt} <span class="q-ans">${step.answer}</span>`;
          bootLinesContainer.appendChild(line);
          currentTyping.textContent = "";
          scrollConsole();
          setTimeout(runNextStep, step.delayAfter || 200);
        }, 30);
      }, 180);
    } else {
      const line = document.createElement("div");
      line.className = `boot-line ${step.type}`;
      line.textContent = step.text;
      bootLinesContainer.appendChild(line);
      scrollConsole();
      setTimeout(runNextStep, step.delayAfter || 150);
    }
  }

  function typeCommand(text, onComplete, speed = 25) {
    let charIdx = 0;
    function nextChar() {
      if (isSkipped) {
        onComplete();
        return;
      }
      if (charIdx < text.length) {
        currentTyping.textContent += text[charIdx];
        charIdx++;
        setTimeout(nextChar, speed);
      } else {
        setTimeout(onComplete, 80);
      }
    }
    nextChar();
  }

  setTimeout(runNextStep, 350);
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

      appendHistoryLine(`depth:~$ ${rawCmd}`, "cmd-echo");
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
    appendHistoryLine(`depth:~$ ${cmd}`, "cmd-echo");
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
          <strong>Depththread Commands:</strong><br>
          &nbsp;&nbsp;<span class="cmd-highlight">wave</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Trigger particle wave pulse<br>
          &nbsp;&nbsp;<span class="cmd-highlight">signal</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Push live telemetry signal<br>
          &nbsp;&nbsp;<span class="cmd-highlight">status</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Print system status<br>
          &nbsp;&nbsp;<span class="cmd-highlight">reboot</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Re-run bootloader sequence<br>
          &nbsp;&nbsp;<span class="cmd-highlight">clear</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Clear console buffer<br>
          &nbsp;&nbsp;<span class="cmd-highlight">exit</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Close drawer
        `);
        break;

      case "wave":
      case "pulse":
        if (window.pulseWave) window.pulseWave();
        appendHistoryLine("Particle wave perturbation injected.");
        break;

      case "signal":
      case "push":
        if (window.pushSignal) window.pushSignal();
        appendHistoryLine("Telemetry signal emitted to Signal Feed.");
        break;

      case "status":
        appendHistoryLine(`
          <strong>Depththread Telemetry:</strong><br>
          • System status: all systems nominal (5/5 bars)<br>
          • Active layers: 03 / 07<br>
          • Particle buffer: 2100 points @ 60 FPS<br>
          • Queue depth: 4 tasks tracking
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
