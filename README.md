# Collab release notes website

An interactive web release-notes experience for the latest OpenTeams Collab release.

## Local preview

Run any static file server from this directory:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Deploy to Vercel

Import this repository into Vercel. No build command or framework preset is required; the site is plain HTML, CSS, and JavaScript.

## Project structure

- `index.html` — page content and accessible structure
- `styles.css` — visual system, responsive layouts, and motion
- `script.js` — one-time brand reveal, feature switching, platform detection, and scroll effects
- `assets/` — official vector logo mark and favicon
