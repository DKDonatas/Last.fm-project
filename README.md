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

## Scripts

- `npm run dev`: start dev server
- `npm run build`: production build
- `npm run preview`: preview build locally
- `npm run lint`: run ESLint

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
