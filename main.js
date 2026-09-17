/* ==========================================================================
   Jophy Test Website — MAIN JAVASCRIPT
   Minimal animation & UI tests
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
   1. TERMINAL BOOT SEQUENCE
   ========================================================================== */
function initBootSequence() {
  const bootTerminal = document.getElementById("boot-terminal");
  const skipBtn = document.getElementById("skip-boot-btn");
  const bootLinesContainer = document.getElementById("boot-lines");
  const currentTyping = document.getElementById("current-typing");

  if (!bootTerminal) return;

  const hasVisited = sessionStorage.getItem("boot_complete");
  if (hasVisited === "true") {
    bootTerminal.classList.add("finished");
    setTimeout(() => { bootTerminal.style.display = "none"; }, 300);
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
    }, 400);
  }

  skipBtn?.addEventListener("click", finishBoot);

  const scriptSteps = [
    { type: "cmd", text: "test --init", delayAfter: 300 },
    { type: "output", text: "Initializing testing server...", delayAfter: 250 },
    { type: "cmd", text: "test --status", delayAfter: 300 },
    { type: "output", text: "Testing server active (60 FPS)", delayAfter: 200 },
    { type: "success", text: "Testing ready.", delayAfter: 300 }
  ];

  let stepIdx = 0;

  function runNextStep() {
    if (isSkipped) return;

    if (stepIdx >= scriptSteps.length) {
      setTimeout(finishBoot, 400);
      return;
    }

    const step = scriptSteps[stepIdx];
    stepIdx++;

    if (step.type === "cmd") {
      typeCommand(step.text, () => {
        if (isSkipped) return;
        const line = document.createElement("div");
        line.className = "boot-line command";
        line.innerHTML = `<span class="prompt-user">test</span>:<span class="prompt-dir">~/testing</span>$ ${step.text}`;
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
        setTimeout(typeChar, 30);
      } else {
        setTimeout(callback, 80);
      }
    }
    typeChar();
  }

  setTimeout(runNextStep, 250);
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
      coordsDisplay.textContent = `[${x}, ${y}]`;
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
    "TESTING",
    "ANIMATION TESTING",
    "TESTING SERVER",
    "UI TESTING"
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
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typeSpeed = 350;
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
    const walk = (x - startX) * 1.5;
    slider.scrollLeft = scrollLeft - walk;
  });
}

/* ==========================================================================
   5. MODULES FILTERING ENGINE
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
          }, 30);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(6px)";
          setTimeout(() => {
            card.style.display = "none";
          }, 150);
        }
      });
    });
  });
}

/* ==========================================================================
   6. NAVIGATION MENU
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
   7. CLI DRAWER
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

  const cmdHistoryList = [];
  let historyPointer = -1;

  cliInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const rawCmd = cliInput.value.trim();
      if (!rawCmd) return;

      cmdHistoryList.push(rawCmd);
      historyPointer = cmdHistoryList.length;

      appendHistoryLine(`test:~$ ${rawCmd}`, "cmd-echo");
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
    appendHistoryLine(`test:~$ ${cmd}`, "cmd-echo");
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
          Commands:<br>
          &nbsp;&nbsp;<span class="cmd-highlight">test</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Run test check<br>
          &nbsp;&nbsp;<span class="cmd-highlight">status</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Testing server status<br>
          &nbsp;&nbsp;<span class="cmd-highlight">clear</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Clear console<br>
          &nbsp;&nbsp;<span class="cmd-highlight">exit</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Close drawer
        `);
        break;

      case "test":
        appendHistoryLine(`
          <strong>Testing Status:</strong><br>
          • Boot animation: OK<br>
          • Cursor spotlight: OK<br>
          • Drag scroll: OK<br>
          • Drawer: OK
        `);
        break;

      case "status":
        appendHistoryLine(`
          Testing server: Active<br>
          Environment: Local sandbox<br>
          Framerate: 60 FPS
        `);
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
   8. CONTACT FORM SIMULATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");
  const submitBtn = document.getElementById("form-submit-btn");

  if (!form || !feedback) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Testing...</span>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Submit Test</span>`;
      
      feedback.className = "form-feedback success";
      feedback.innerHTML = `Testing submit successful.`;
      
      form.reset();

      setTimeout(() => {
        feedback.innerHTML = "";
      }, 5000);
    }, 600);
  });
}
