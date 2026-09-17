---
name: Jophy Test Website
description: Minimalist neutral dark design system for animation testing
colors:
  bg-black: "#09090b"
  bg-surface: "#111114"
  bg-card: "#16161a"
  bg-card-hover: "#1c1c22"
  bg-tertiary: "#22222a"
  text-main: "#f4f4f5"
  text-muted: "#a1a1aa"
  text-dim: "#71717a"
  border-subtle: "#232328"
  border-hover: "#383842"
  accent-white: "#ffffff"
  accent-subtle: "#27272a"
  accent-blue: "#6366f1"
  status-green: "#10b981"
typography:
  display:
    fontFamily: "'Inter', -apple-system, sans-serif"
    fontSize: "clamp(2.4rem, 5vw, 4rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "'Inter', -apple-system, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'Inter', -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  mono:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: "0.85rem"
    lineHeight: 1.7
rounded:
  xs: "3px"
  sm: "4px"
  md: "6px"
  lg: "8px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent-white}"
    textColor: "{colors.bg-black}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-outline:
    backgroundColor: "{colors.bg-card}"
    textColor: "{colors.text-main}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  card:
    backgroundColor: "{colors.bg-card}"
    textColor: "{colors.text-main}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System

## Overview
A sleek, modern neutral dark interface engineered for testing UI animations, micro-interactions, and motion physics. Built on modern sans-serif typography, clean zinc/slate tonal contrast, crisp 1px borders, and zero external runtime dependencies.

## Colors
- **Canvas**: `#09090b` (Deep Zinc 950) provides high contrast with reduced eye fatigue.
- **Surfaces**: Layered from `#111114` (elevated background) to `#16161a` (cards) and `#1c1c22` (card hover).
- **Text**: `#f4f4f5` (Primary), `#a1a1aa` (Secondary), `#71717a` (Muted/labels).
- **Accents**: Pure crisp white `#ffffff` for primary call-to-actions; `#10b981` (Emerald) for active status indicators; `#6366f1` (Indigo) used sparingly for interactive highlights.
- **Rule**: Never use blinding fluorescent saturated neons or glowing text shadows. Rely on border contrast and tonal shifts.

## Typography
- **Primary Font**: `Inter`, `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.
- **Monospace Font**: `JetBrains Mono` reserved strictly for the terminal bootloader, CLI drawer, code manifests, and coordinate tags.
- **Hierarchy**:
  - Hero Display: `clamp(2.4rem, 5vw, 4rem)` (800 weight, -0.03em tracking)
  - Section Title: `1.75rem` (700 weight, -0.02em tracking)
  - Section Tag: `0.75rem` (600 weight, uppercase, 0.08em tracking, text-dim)
  - Card Headings: `1.15rem` (600 weight)
  - Body Copy: `0.95rem` to `1.05rem` (400 weight, 1.65 line-height)

## Layout
- **Containers**: Max-width `1000px`, centered with `margin: 0 auto; padding: 0 24px`.
- **Vertical Rhythm**: Sections padded at `70px 24px` to avoid awkward empty stretches while giving components room to breathe.
- **Grids**: 2-column balanced layouts (`repeat(2, 1fr)`) collapsing cleanly to single-column below `860px`.
- **Horizontal Scroll Track**: Draggable track with uniform `280px` card widths and grab cursor states.

## Elevation & Depth
- **Borders**: 1px solid `#232328`, transitioning to `#383842` on hover.
- **Shadows**: Subtle, natural ambient shadows (`0 4px 20px rgba(0, 0, 0, 0.25)`).
- **Spotlight Shader**: Dynamic radial light following the cursor (`rgba(255, 255, 255, 0.035)`) over a subtle 32px background grid.

## Shapes
- **Corner Radii**:
  - `6px`: Buttons, form inputs, badges.
  - `8px`: Cards, terminal consoles, drawer containers.
  - `9999px`: Pills and ambient coordinate badges.

## Components
- **Buttons**:
  - `btn-primary`: Solid white background, `#09090b` text, hover `#e4e4e7` with 1px lift.
  - `btn-outline`: Surface `#16161a`, border `#232328`, hover `#1c1c22` with border highlight.
- **Cards**: Single-layer containers with clean 24px padding; never nest cards inside cards.
- **Terminal Consoles**: Clean dark panels with macOS-style window controls and responsive auto-scrolling log buffer.

## Do's and Don'ts
- **DO**:
  - Keep all copy minimal and focused on "Testing".
  - Use smooth, natural easing (`cubic-bezier(0.16, 1, 0.3, 1)`).
  - Test responsiveness across mobile and desktop.
  - Push changes to GitHub after every edit.
- **DON'T**:
  - Don't use bright neon lime/cyan glowing text shadows or border glows.
  - Don't nest cards inside cards.
  - Don't stretch card heights artificially with huge empty padding.
  - Don't introduce heavy external UI libraries or CSS frameworks.
