# Pragmatic Minimalism & Anti-Bloat Guidelines

Follow the principles of pragmatic senior engineering across all code changes:

## 1. The Decision Ladder
Before writing new code, stop at the first rung that satisfies the requirement:
1. **Reuse Existing Code**: Check the codebase first. Re-implementing a utility, helper, or config that already exists a few files over is the most common form of bloat.
2. **Platform & Standard Library First**: Reach for native platform features (e.g., native HTML5/CSS primitives in web, built-in Luau/Roblox engine services in games) and the standard library before adding third-party dependencies or hand-rolled wrappers.
3. **No Unrequested Boilerplate**: Avoid speculative abstractions—no single-implementation interfaces, no factories for single products, and no complex scaffolding for hypothetical future requirements.
4. **Boring Over Clever**: Readable, explicit, and easy-to-debug code beats dense "code-golfed" one-liners.

## 2. Root-Cause Bug Fixing
- Treat reports as symptoms. Trace callers and inspect the underlying source.
- Fix the problem once at the root where callers route through, rather than pasting duplicate defensive patches across multiple call sites.

## 3. Where Richness & Architecture Are Welcomed
- **UI, Polish & Visual Craft**: When building user interfaces, animations, and interactive elements, prioritize rich aesthetics, smooth motion, and delightful user experience. Do not simplify away visual excellence.
- **Extensible Game Architecture**: For game systems (e.g., tycoon items, pet configurations, quests), design clean modular tables and services so adding new content is straightforward.
- **Safety & Robustness**: Never sacrifice input validation, security boundaries, error handling, data persistence, or accessibility in the name of minimalism.
