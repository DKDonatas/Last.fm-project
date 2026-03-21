# Last.fm Music Dashboard

A modern music dashboard built with **Vite + React** that uses the **Last.fm API** for music discovery and the **YouTube Data API** to play tracks directly in-app.

## Features

- **Home**: trending artists + tracks (Last.fm global charts)
- **Search**: artist search + top tracks
- **Playback**: click any track to play (YouTube embed), with **queue** + **prev/next**
- **Favorites**: save artists/tracks to a local collection (persisted in `localStorage`)
- **My Stats**: enter a Last.fm username to view top artists, top tracks, and recent scrobbles
- **Theme toggle**: light/dark
- **Search polish**: debounced search + recent-search suggestions

## Tech stack

- **Frontend**: React, Vite
- **Data**: Last.fm REST API
- **Playback**: YouTube Data API (search) + YouTube embed player
- **Persistence**: `localStorage` (no database)

## Getting started

### 1) Install dependencies

```bash
npm install
```

### 2) Create env file

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Fill in your keys:

- `VITE_LASTFM_API_KEY`
- `VITE_YOUTUBE_API_KEY`

### 3) Run the app

```bash
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`).

## Notes

- **No DB is required**: favorites, theme, username, and search history are stored in `localStorage`.
- **YouTube quota**: playback relies on searching YouTube for a matching video ID; your API key quota applies.

## Deploying (Netlify)

Vite reads `VITE_*` variables **when Netlify runs the build**, not from your machine.

1. In Netlify: **Site configuration → Environment variables**, add:
   - `VITE_LASTFM_API_KEY`
   - `VITE_YOUTUBE_API_KEY`
2. **Trigger a new deploy** (Deploys → Clear cache and deploy site) after saving env vars.
3. Build settings (also in repo `netlify.toml`):
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

If charts load but **playback fails**, open the browser **Console** on the live site. If you see `403` / API errors from Google, your YouTube key is likely restricted: in Google Cloud → **APIs & Services → Credentials → your key → Application restrictions**, either allow **HTTP referrers** and add `https://YOUR-SITE.netlify.app/*` (and `http://localhost:5173/*` for local dev), or temporarily use **None** while testing.

## Scripts

- `npm run dev`: start dev server
- `npm run build`: production build
- `npm run preview`: preview build locally
- `npm run lint`: run ESLint
