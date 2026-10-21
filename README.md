# rohanreddy79.github.io

Personal site of Rohan Reddy Jakkam, served by GitHub Pages at https://rohanreddy79.github.io/.

Hand-written HTML, CSS and a small progressive-enhancement script: no framework, no build step,
no tracking. Fonts from Google Fonts; everything else is in this repository.

- `index.html` — the page; project cards carry inline SVG visuals drawn from the real benchmark
  numbers in each repository's README.
- `styles.css` — design tokens, dark and light themes, layout, motion (honours `prefers-reduced-motion`).
- `main.js` — theme toggle, section spy, scroll reveal, counters, pointer-aware spotlights, copy-email.
- `assets/` — favicon and the social preview image.

Run locally with any static server, for example `python3 -m http.server 8000`.
