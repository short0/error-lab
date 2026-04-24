
# Error Analysis Lab — Build Plan

A calm, minimalist web app that teaches and practices Andrew Ng-style error analysis through hands-on, mocked examples (with optional live LLM mode as a secondary path).

## Design language
- **Light mode default** + theme toggle (persisted in localStorage)
- Neutral palette: warm off-white background, near-black text, single muted accent (slate/indigo) for interactive states
- Generous spacing, hairline borders, soft shadows, no gradients
- Typography: clean sans (Inter) with clear hierarchy
- Subtle motion only (200ms ease for hover/active, no decorative animation)

## Routes (TanStack file-based)
- `/` — Home (hero, presets, "How it works", CTA)
- `/lab` — 3-panel lab workspace (reads `?preset=` query for selection)
- `/about` — Short page on why error analysis matters (links from home)

Each route has its own `head()` metadata.

## Home screen
- **Hero**: one-line definition of error analysis + 2-sentence "why it matters"
- **Preset cards** (4): Spam Classifier · Support Ticket Routing · OCR Extraction · Resume Screening — each card shows task, dataset size, error count, "Open lab →"
- **How it works** strip: 4 numbered steps — Review errors → Tag patterns → Count categories → Prioritize fixes
- **CTAs**: "Start with a preset" · "Open blank lab"
- Theme toggle + GitHub-style minimal header throughout

## Lab screen (3-panel desktop, stacked mobile)

**Left panel — Context & controls**
- Preset selector dropdown
- Task summary (objective, dataset, baseline accuracy)
- Mode toggle: **Simulated** (default, clearly labeled) ↔ **Live LLM** (advanced)
- Settings: sample size, show explanations, keyboard shortcuts hint
- Undo · Redo · Reset session buttons

**Center panel — Example queue**
- Card per misclassified example showing: input text/image-stub, **Prediction**, **True label**, confidence
- Inline tag chips (multi-select) from suggested categories + custom tag input
- "Explain this result" button → opens beginner-friendly inline explanation (mocked rationale)
- Prev/Next navigation, progress indicator (e.g., 7 / 24)
- Quick-action buttons (3–5 per preset): e.g., "Tag as ambiguous", "Mark as label noise", "Flag for retraining"

**Right panel — Insights**
- **Category summary**: bar list of tag counts, sorted by frequency
- **Impact estimate**: % of errors per category + projected accuracy lift if fixed
- **Overall vs subgroup metrics**: small comparison block showing where the model fails worst
- **Notes**: free-text scratchpad (autosaved)
- **Recommended next action**: dynamic suggestion based on top category (e.g., "Collect more short-message examples")

## Preset content (preloaded, mocked)
Each of the 4 presets ships with:
- Task description + baseline metrics
- 15–25 realistic misclassified examples (prediction, true label, brief rationale)
- 5–7 suggested category tags
- Pre-computed impact summary
- 2–3 recommended next actions
- 3–5 quick actions / example prompts

## State, persistence, undo/redo
- Single reducer-driven session store; every action pushes onto an undo stack
- Undo/Redo cover: preset change, tag edits, note edits, settings changes, session clear
- localStorage keys: theme, currentPresetId, mode, sessionState (tags/notes/index), customTags, recentNotes
- "Reset to home" clears active session but preserves built-in presets and theme

## Optional Live LLM mode
- Toggle in left panel; when enabled, shows a clear amber "Live mode" badge in header
- Uses Lovable AI Gateway (no key setup needed) to generate a rationale + suggested tags for a custom user-pasted example
- Mocked mode remains the polished default; live mode is additive and cleanly isolated behind the toggle

## Accessibility & responsiveness
- Full keyboard nav (Tab order, J/K for next/prev example, T to focus tag input, ⌘Z / ⌘⇧Z for undo/redo)
- Visible focus rings, AA contrast in both themes, ≥44px tap targets
- Desktop: 3 columns · Tablet: left collapses to top bar, center+right side-by-side · Mobile: vertical stack with sticky top action bar (Undo/Redo/Mode)

## Out of scope
- Authentication, accounts, server persistence
- File uploads or real dataset ingestion
- Charts library — use simple CSS bar visualizations to stay minimal
