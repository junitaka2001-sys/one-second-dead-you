# TODO.md

## Future Improvements

- **More Events & Statistics**: Add detailed statistical data per occupation, age group, and situation. Replace the hard‑coded `events` array with an external `events.json` fetched at runtime.
- **Occupation / Situation Modifiers**: Implement separate modifier tables (e.g., `occupationMod`, `situationMod`) for finer‑grained weighting.
- **Visual Enhancements**: Replace the placeholder pixel avatar with actual 16‑bit style sprites (SVG or PNG). Add animation frames for the "1秒後" countdown.
- **Audio**: Add retro chiptune sound effects for button clicks and the fate reveal.
- **Internationalisation**: Support English UI alongside Japanese via a language toggle.
- **Accessibility**: Improve contrast, add ARIA labels, and ensure keyboard navigation works.
- **Unit Tests**: Extract the weight calculation and candidate filtering into separate modules and write Jest tests (or similar) to validate the logic.
- **Persist Settings**: Store the last used character configuration in `localStorage` so returning players can continue where they left off.
- **GitHub Actions CI**: Automated linting, build verification, and deployment to GitHub Pages on push.
- **Progressive Web App**: Add a manifest and service worker to allow offline play and installable experience on mobile.

These items are prioritized based on gameplay impact and development effort. Feel free to pick any for the next iteration.
