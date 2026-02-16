# The Deen Journal v2

A focused, distraction-free Islamic journaling app designed to integrate spiritual reflection into daily life. Privacy-focused, offline-first, and beautiful.

## Features

### 1. Daily Journal
- Distraction-free writing experience with "Ink Canvas".
- Daily prompts for Morning, Evening, Friday, and Ramadan.
- "Sealing" mechanism to commit entries.
- Mood tracking and tagging.
- Native Hijri date support.

### 2. Ibadah Tracker
- Track obligatory prayers (Fajr, Dhuhr, Asr, Maghrib, Isha).
- Log Sunnah prayers (Qiyam, Duha).
- Track Quran pages read and fasting status.
- Weekly heatmap and "Spiritual Health" score.

### 3. Quran Study (S.O.A.P. Method)
- Search Quran verses (Ayah).
- Structure reflections using S.O.A.P. (Scripture, Observation, Application, Prayer).
- View past reflections in a beautiful card list.

### 4. Gratitude Log
- Log daily blessings.
- Connect blessings to Names of Allah (e.g., Al-Razzaq).
- Visual gratitude jar/grid.

### 5. Daily Inspirations
- Rotating "Name of Allah" card with reflection prompts.

### 6. Privacy & Settings
- **Local-First**: All data stored in browser (IndexedDB via Dexie.js).
- **Encrypted**: (Planned feature).
- **Backup**: Export/Import your data as JSON.
- **PWA**: Installable on mobile and desktop. Works offline.

## Tech Stack
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Framer Motion (Animations)
- **Database**: Dexie.js (IndexedDB wrapper)
- **Icons**: Lucide React
- **PWA**: Vite PWA Plugin

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/NabilPervez/journal.git
   cd journal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run local server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Installation (PWA)
- **Mobile**: Open in Safari (iOS) or Chrome (Android) -> "Add to Home Screen".
- **Desktop**: Click the install icon in Chrome address bar.

## Contributing
This project is personal but open to suggestions.

## License
MIT
