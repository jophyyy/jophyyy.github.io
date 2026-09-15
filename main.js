/* ==========================================================================
   jophyyy.github.io — MAIN JAVASCRIPT
   Interactive Behaviors:
   1. Terminal Boot Sequence & Skip Logic
   2. Dynamic Spotlight Tracker & Mouse Coordinates
   3. Dynamic Typewriter Role Cycler
   4. Draggable Horizontal Timeline
   5. Projects Filtering Engine
   6. Fullscreen Navigation Menu
   7. Interactive Easter-Egg Developer CLI
   8. Contact Form Dispatcher
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initBootSequence();
  initSpotlightAndCoordinates();
  initRoleCycler();
  initTimelineDrag();
  initProjectFilters();
  initNavigation();
  initInteractiveCLI();
  initContactForm();
});

/* ==========================================================================
   1. TERMINAL BOOT SEQUENCE (Inspired by ddaniel.dev)
   ========================================================================== */
function initBootSequence() {
  const bootTerminal = document.getElementById("boot-terminal");
  const skipBtn = document.getElementById("skip-boot-btn");
  const bootLinesContainer = document.getElementById("boot-lines");
  const currentTyping = document.getElementById("current-typing");

  if (!bootTerminal) return;

  // If user already visited in this session, provide swift boot or instant entrance
  const hasVisited = sessionStorage.getItem("boot_complete");
  if (hasVisited === "true") {
    bootTerminal.classList.add("finished");
    setTimeout(() => { bootTerminal.style.display = "none"; }, 400);
    return;
  }

  let isSkipped = false;

  function finishBoot() {
    if (isSkipped) return;
    isSkipped = true;
    sessionStorage.setItem("boot_complete", "true");
    bootTerminal.classList.add("finished");
    setTimeout(() => {
      bootTerminal.style.display = "none";
    }, 600);
  }

  skipBtn?.addEventListener("click", finishBoot);

  const scriptSteps = [
    { type: "cmd", text: "pwd", delayAfter: 350 },
    { type: "output", text: "/home/jophy/Developer", delayAfter: 300 },
    { type: "cmd", text: "cd portfolio && ls -la", delayAfter: 450 },
    { type: "output", text: "drwxr-xr-x . .. public/ src/ index.html style.css package.json vite.config.ts", delayAfter: 400 },
    { type: "cmd", text: "npm run dev", delayAfter: 500 },
    { type: "info", text: "> jophy-portfolio@2.0.0 dev", delayAfter: 250 },
    { type: "info", text: "> vite", delayAfter: 300 },
    { type: "success", text: "  VITE v5.4.2 ready in 164 ms", delayAfter: 200 },
    { type: "output", text: "  ➜ Local:   http://localhost:5173/", delayAfter: 200 },
    { type: "output", text: "  ➜ Network: use --host to expose", delayAfter: 500 }
  ];

  let stepIdx = 0;

  function runNextStep() {
    if (isSkipped) return;

    if (stepIdx >= scriptSteps.length) {
      setTimeout(finishBoot, 600);
      return;
    }

    const step = scriptSteps[stepIdx];
    stepIdx++;

    if (step.type === "cmd") {
      typeCommand(step.text, () => {
        if (isSkipped) return;
        const line = document.createElement("div");
        line.className = "boot-line command";
        line.innerHTML = `<span class="prompt-user">jophyyy@archlinux</span>:<span class="prompt-dir">~/portfolio</span>$ ${step.text}`;
        bootLinesContainer.appendChild(line);
        currentTyping.textContent = "";
        setTimeout(runNextStep, step.delayAfter || 200);
      });
    } else {
      const line = document.createElement("div");
      line.className = `boot-line ${step.type}`;
      line.textContent = step.text;
      bootLinesContainer.appendChild(line);
      const bootConsole = document.getElementById("boot-console");
      if (bootConsole) bootConsole.scrollTop = bootConsole.scrollHeight;
      setTimeout(runNextStep, step.delayAfter || 200);
    }
  }

  function typeCommand(text, callback) {
    let charIdx = 0;
    currentTyping.textContent = "";

    function typeChar() {
      if (isSkipped) return;
      if (charIdx < text.length) {
        currentTyping.textContent += text.charAt(charIdx);
        charIdx++;
        setTimeout(typeChar, 35 + Math.random() * 25);
      } else {
        setTimeout(callback, 100);
      }
    }
    typeChar();
  }

  // Start after subtle pause
  setTimeout(runNextStep, 400);
}

/* ==========================================================================
   2. DYNAMIC SPOTLIGHT TRACKER & COORDINATES DISPLAY
   ========================================================================== */
function initSpotlightAndCoordinates() {
  const spotlightOverlay = document.getElementById("spotlight-overlay");
  const coordsDisplay = document.getElementById("coords-display");

  window.addEventListener("mousemove", (e) => {
    const x = e.clientX;
    const y = e.clientY;

    if (spotlightOverlay) {
      document.documentElement.style.setProperty("--mouse-x", `${x}px`);
      document.documentElement.style.setProperty("--mouse-y", `${y}px`);
    }

    if (coordsDisplay) {
      coordsDisplay.textContent = `[X: ${x}, Y: ${y}]`;
    }
  });
}

/* ==========================================================================
   3. DYNAMIC TYPEWRITER ROLE CYCLER
   ========================================================================== */
function initRoleCycler() {
  const roleCycler = document.getElementById("role-cycler");
  if (!roleCycler) return;

  const roles = [
    "FULL STACK DEVELOPER",
    "ROBLOX SYSTEMS ARCHITECT",
    "GAMEPLAY ENGINE SPECIALIST",
    "DISTRIBUTED NETWORK ENGINEER",
    "LINUX & OPEN SOURCE DEV"
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      roleCycler.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
    } else {
      roleCycler.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
    }

    let typeSpeed = isDeleting ? 30 : 60;

    if (!isDeleting && charIdx === currentRole.length) {
      typeSpeed = 2200; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typeSpeed = 400; // Pause before typing next word
    }

    setTimeout(typeLoop, typeSpeed);
  }

  typeLoop();
}

/* ==========================================================================
   4. DRAGGABLE HORIZONTAL TIMELINE
   ========================================================================== */
function initTimelineDrag() {
  const slider = document.getElementById("timeline-scroll-track");
  if (!slider) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
  });

  slider.addEventListener("mouseup", () => {
    isDown = false;
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag speed multiplier
    slider.scrollLeft = scrollLeft - walk;
  });
}

/* ==========================================================================
   5. PROJECTS FILTERING ENGINE
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const categories = card.getAttribute("data-category") || "";
        if (filter === "all" || categories.includes(filter)) {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 50);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(10px)";
          setTimeout(() => {
            card.style.display = "none";
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   6. FULLSCREEN NAVIGATION MENU
   ========================================================================== */
function initNavigation() {
  const menuToggle = document.getElementById("menu-toggle");
  const navOverlay = document.getElementById("nav-overlay");
  const overlayLinks = document.querySelectorAll(".overlay-nav-link");

  if (!menuToggle || !navOverlay) return;

  function toggleMenu() {
    const isOpen = navOverlay.classList.contains("open");
    if (isOpen) {
      navOverlay.classList.remove("open");
      menuToggle.classList.remove("active");
      document.body.style.overflow = "";
    } else {
      navOverlay.classList.add("open");
      menuToggle.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  menuToggle.addEventListener("click", toggleMenu);

  overlayLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navOverlay.classList.remove("open");
      menuToggle.classList.remove("active");
      document.body.style.overflow = "";
    });
  });
}

/* ==========================================================================
   7. INTERACTIVE EASTER-EGG DEVELOPER CLI (ddaniel.dev signature feature)
   ========================================================================== */
function initInteractiveCLI() {
  const cliDrawer = document.getElementById("cli-drawer");
  const cliToggleBtn = document.getElementById("cli-toggle-btn");
  const cliMinimizeBtn = document.getElementById("cli-minimize-btn");
  const quickCliTrigger = document.getElementById("quick-cli-trigger");
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
  quickCliTrigger?.addEventListener("click", () => toggleDrawer(true));

  // Command History Navigation
  const cmdHistoryList = [];
  let historyPointer = -1;

  cliInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const rawCmd = cliInput.value.trim();
      if (!rawCmd) return;

      cmdHistoryList.push(rawCmd);
      historyPointer = cmdHistoryList.length;

      // Echo command
      appendHistoryLine(`guest@jophy.dev:~$ ${rawCmd}`, "cmd-echo");
      cliInput.value = "";

      // Process command
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
    appendHistoryLine(`guest@jophy.dev:~$ ${cmd}`, "cmd-echo");
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
          Available Commands:<br>
          &nbsp;&nbsp;<span class="cmd-highlight">neofetch</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Print system specifications & ASCII badge<br>
          &nbsp;&nbsp;<span class="cmd-highlight">whoami</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Developer bio & identity<br>
          &nbsp;&nbsp;<span class="cmd-highlight">skills</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Overview of core tech stack<br>
          &nbsp;&nbsp;<span class="cmd-highlight">projects</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- List featured projects<br>
          &nbsp;&nbsp;<span class="cmd-highlight">matrix</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Initialize digital rain effect<br>
          &nbsp;&nbsp;<span class="cmd-highlight">contact</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Show email and communication endpoints<br>
          &nbsp;&nbsp;<span class="cmd-highlight">clear</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Clear the console history<br>
          &nbsp;&nbsp;<span class="cmd-highlight">exit</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Close the terminal drawer
        `);
        break;

      case "neofetch":
        appendHistoryLine(`
<pre style="color: #00f0ff; line-height: 1.2; font-size: 0.75rem;">
       /\\         <span style="color:#d4ff32;">jophyyy@archlinux</span>
      /  \\        -----------------
     /\\   \\       <span style="color:#8be9fd;">OS:</span> Arch Linux x86_64
    /      \\      <span style="color:#8be9fd;">Host:</span> Developer Rig (Custom Kernel)
   /   ,,   \\     <span style="color:#8be9fd;">Kernel:</span> 6.10.9-arch1-1
  /   |  |  -\\    <span style="color:#8be9fd;">Uptime:</span> 7+ years coding
 /_-''    ''-_\\   <span style="color:#8be9fd;">Packages:</span> 1240 (pacman), 42 (wally)
                  <span style="color:#8be9fd;">Shell:</span> zsh 5.9
                  <span style="color:#8be9fd;">Terminal:</span> Alacritty / Web CLI
                  <span style="color:#8be9fd;">Editor:</span> Neovim & VS Code
                  <span style="color:#8be9fd;">Theme:</span> Cyber Obsidian Neon
</pre>
        `);
        break;

      case "whoami":
        appendHistoryLine(`
          <strong>Jophy Chen</strong> — Full Stack & Game Systems Engineer.<br>
          Passionate about low-latency network architectures, custom game engines (Roblox/Luau),
          and modern high-performance web applications.
        `);
        break;

      case "skills":
        appendHistoryLine(`
          <strong>⚡ Core Languages:</strong> Luau/Lua, TypeScript, JavaScript, Python, C/C++, HTML/CSS, SQL.<br>
          <strong>🛠️ Technologies:</strong> Roblox Studio, React, Next.js, Node.js, Git, Linux (Arch), Wally/Rojo.
        `);
        break;

      case "projects":
        appendHistoryLine(`
          1. <a href="https://github.com/jophyyy" target="_blank" style="color: #d4ff32;">Roblox Tycoon Simulator Engine</a> (Luau, BossService, Drops)<br>
          2. <a href="#projects" style="color: #00f0ff;">Personal Developer Portfolio</a> (Interactive Cyber UI)<br>
          3. <a href="https://github.com/jophyyy" target="_blank" style="color: #d4ff32;">Audio Sort Visualizer</a> (TypeScript, Web Audio)<br>
          4. <a href="https://github.com/jophyyy" target="_blank" style="color: #00f0ff;">Delta-Compression Buffer Sync</a> (Spatial entity replication)
        `);
        break;

      case "matrix":
        appendHistoryLine(`<span style="color: #89ff69;">Wake up, Neo... The Matrix has you. Follow the white rabbit. 🐇</span>`);
        break;

      case "contact":
        appendHistoryLine(`
          📫 Email: <a href="mailto:jophychen.dev@gmail.com" style="color: #d4ff32;">jophychen.dev@gmail.com</a><br>
          🐙 GitHub: <a href="https://github.com/jophyyy" target="_blank" style="color: #00f0ff;">github.com/jophyyy</a>
        `);
        break;

      case "clear":
        cliHistory.innerHTML = "";
        break;

      case "sudo":
        appendHistoryLine(`<span style="color: #ff5555;">guest is not in the sudoers file. This incident will be reported.</span>`);
        break;

      case "exit":
      case "quit":
        toggleDrawer(false);
        break;

      default:
        appendHistoryLine(`zsh: command not found: ${cmd}. Type <span class="cmd-highlight">help</span> for a list of valid commands.`, "cmd-error");
        break;
    }
  }
}

/* ==========================================================================
   8. CONTACT FORM SIMULATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");
  const submitBtn = document.getElementById("form-submit-btn");

  if (!form || !feedback) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("contact-name").value;
    const email = document.getElementById("contact-email").value;
    const subject = document.getElementById("contact-subject").value;
    const message = document.getElementById("contact-message").value;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Transmitting Packet...</span>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Dispatch Transmission</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>`;
      
      feedback.className = "form-feedback success";
      feedback.innerHTML = `✓ TRANSMISSION CONFIRMED: Thank you, ${name}! Your packet has been received. I'll get back to you at ${email} shortly.`;
      
      form.reset();

      setTimeout(() => {
        feedback.innerHTML = "";
      }, 7000);
    }, 900);
  });
}
