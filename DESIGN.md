---
name: Depththread Workflow OS Design System
description: Industrial pixel telemetry HUD with undulating particle wave canvas
colors:
  bg-void: "#050505"
  bg-surface: "#0c0c0e"
  bg-panel: "#121215"
  text-pixel: "#ebe8e1"
  text-bright: "#f4f4f5"
  text-muted: "#a1a1aa"
  text-dim: "#71717a"
  amber: "#f59e0b"
  amber-dim: "rgba(245, 158, 11, 0.25)"
  amber-glow: "rgba(245, 158, 11, 0.15)"
  border-line: "rgba(255, 255, 255, 0.08)"
  border-subtle: "#1f1f23"
typography:
  pixel:
    fontFamily: "'Pixelify Sans', 'Silkscreen', monospace"
    fontSize: "clamp(3.5rem, 8vw, 7rem)"
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  mono:
    fontFamily: "'JetBrains Mono', 'Space Mono', monospace"
    fontSize: "0.85rem"
    lineHeight: 1.6
rounded:
  none: "0px"
  xs: "2px"
  sm: "4px"
  md: "6px"
---

# Depththread Workflow OS Design System

## 1. Aesthetic Identity
- **Visual Tone**: Deep pitch black void with technical telemetry HUD, crisp chunky bitmap pixel typography, amber square accents, and an organic undulating particle wave canvas.
- **Reference**: Depththread Workflow OS interface created with Impeccable.

## 2. Color Palette
- **Void Canvas**: `#050505` (Deep absolute pitch black).
- **Pixel Headline**: `#ebe8e1` (Cream/bone off-white).
- **Industrial Accent**: `#f59e0b` (Amber / cadmium yellow).
- **Telemetry Muted**: `#71717a` (Neutral zinc 500 for labels, denominators, and timestamps).
- **Fine Rules**: `rgba(255, 255, 255, 0.08)` for razor-thin wireframe delimiters.

## 3. Typography
- **Hero Display**: `Pixelify Sans` / `Silkscreen` for `ship work with depth.■` (lowercase, tight line height, square amber period).
- **Telemetry & Interface**: `JetBrains Mono` / `Space Mono` for all data tables, queue rows, signal feeds, navigation links, and terminal logs.

## 4. Key Components
- **Top Navigation**: `DEPTHTHREAD ■` brand with inline amber block and small `WORKFLOW OS` sub-label; prompt-style navigation links (`> overview`).
- **Hero Telemetry Card**: Right-aligned status monitor with 5 signal strength bars and large pixel `03 /07` active layer counter.
- **Live Queue Table**: Monospace task list with `> #0421 align the layers`, metadata `depth 03 owner ryo status moving`, and 6-dot amber signal meters.
- **Signal Feed**: Continuous live telemetry log stream with timestamp and user status updates.
- **Particle Wave**: HTML5 Canvas rendering ~1500 points in an undulating sinusoidal ribbon that reacts subtly to cursor position.
- **CLI Drawer & Bootloader**: Industrial collapsible drawer and initial developer sequence.
