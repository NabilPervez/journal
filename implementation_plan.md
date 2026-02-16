# 📋 PHASED DEVELOPMENT TASK LIST
## The Deen Journal v2 - Production Ready PWA

### PHASE 1: Foundation & Core Infrastructure
**Goal:** Set up the project scaffold, design system, and local database foundation

- [x] **1.1 Project Initialization**
- [x] **1.2 File Structure Setup**
- [x] **1.3 Database Layer (Dexie.js)**
- [x] **1.4 Theme System & Global Styles**
- [x] **1.5 Routing & Layout Shell**

**Git Checkpoint:**
```bash
git add .
git commit -m "feat: initialize project foundation with routing, database, and theme system"
git push origin main
```

### PHASE 2: Services Layer & Data Management
**Goal:** Build the service layer that mediates between UI and database

- [x] **2.1 Journal Service**
  - [x] Create `services/journalService.ts`:
    - `saveEntry(dateString: string, content: string)` - Upsert entry with debounce
    - `getEntry(dateString: string)` - Retrieve specific entry
    - `getAllEntries()` - Get all entries for archive view
    - `searchEntries(query: string, tags?: string[])` - Full-text search
    - `sealEntry(dateString: string)` - Mark as read-only
    - `updateTags(dateString: string, tags: string[])` - Tag management
  - [x] Implement debounced save pipeline (2000ms) as per Section 7.1
  - [x] Add word count calculation logic
  - [x] Handle validation (minimum 10 words for sealing per Section 4.1)

- [x] **2.2 Tracker Service**
  - [x] Create `services/trackerService.ts`:
    - `logPrayer(dateString: string, prayer: string, status: 0|1|2)` - 3-state toggle
    - `getTrackerData(dateString: string)` - Get single day
    - `getWeekData(startDate: string)` - 7-day range query
    - `calculateSpiritualHealth(weekData)` - Percentage based on on-time performance
    - `logExtra(dateString: string, type: 'qiyam'|'duha', value: boolean)`
    - `logQuranPages(dateString: string, pages: number)`
    - `logFasting(dateString: string, type: 'ramadan'|'sunnah'|'makeup')`

- [x] **2.3 Backup & Restore Service**
  - [x] Create `services/backupService.ts`:
    - `exportData()` - Query all data, create JSON blob with metadata/checksum (Section 7.2)
    - `importData(file: File)` - Parse and validate with Zod schemas
    - `validateBackupFile(data)` - Check version, structure integrity
    - `mergeStrategy(existing, incoming)` - Smart conflict resolution
    - `overwriteStrategy(incoming)` - Destructive replace
  - [x] Implement file download with `file-saver`
  - [x] Build conflict resolution modal component
  - [x] Add checksum validation for data integrity

- [x] **2.4 Static Data Integration**
  - [x] Create `data/prompts.json`:
    - Categories: morning, evening, friday, ramadan
    - Minimum 10 prompts per category
    - Implement deterministic shuffle algorithm based on date (Section 6.2)
  - [x] Source and prepare `data/quran.json`:
    - Structure: `{surah_number, ayah_number, text_ar, text_en, search_tokens}`
    - Set up lazy loading (only load when Quran tab is accessed)
    - Consider chunking by Surah if file is too large

- [x] **2.5 Utility Hooks**
  - [x] Create `hooks/useHijriDate.ts`:
    - Convert Gregorian to Hijri with user offset adjustment
    - Use `hijri-date-converter` for manual day offsets
  - [x] Create `hooks/useJournalEntry.ts`:
    - Wrapper for journalService with loading states
    - Auto-save on keystroke with debounce
    - Return save status ("Saving..." / "Saved" indicator)
  - [x] Create `hooks/useDebounce.ts`:
    - Generic debounce hook for text inputs

**Git Checkpoint:**
```bash
git add .
git commit -m "feat: implement service layer with journal, tracker, and backup functionality"
git push origin main
```

### PHASE 3: Journal Feature - The Core Experience
**Goal:** Build the daily journaling experience with animations and UX polish

- [x] **3.1 UI Atomic Components**
  - [x] Create `components/ui/Button.tsx`:
    - Variants: primary (gold), secondary, destructive (crimson)
    - Loading states, disabled states
    - Haptic feedback integration (if supported)
  - [x] Create `components/ui/Modal.tsx`:
    - Backdrop with blur effect
    - Animation with Framer Motion
    - Focus trap and accessibility
  - [x] Create `components/ui/Input.tsx`:
    - Styled input with validation states
    - Error message display

- [x] **3.2 Journal Components**
  - [x] Create `components/journal/DualDateDisplay.tsx`:
    - Show Gregorian + Hijri (Section 4.2)
    - Tap to open date picker modal
    - Format with beautiful typography
  - [x] Create `components/journal/PromptBlock.tsx` (Section 4.2):
    - Bordered box with ornamental pattern
    - Refresh icon for cycling prompts
    - Category-based rotation logic
    - Smooth transition animations
  - [x] Create `components/journal/InkCanvas.tsx` (Section 4.2):
    - Use `react-textarea-autosize` for expanding text area
    - CSS lined paper background aligned to line-height
    - Character/word count display
    - Auto-save indicator (golden checkmark when saved)
    - Read-only mode when sealed
  - [x] Create `components/journal/MoodSelector.tsx`:
    - 4 options: peace, struggle, neutral, high-imaan
    - Icon-based selection with animations
  - [x] Create `components/journal/TagInput.tsx`:
    - Multi-tag input with autocomplete
    - Pill-style display with remove button

- [x] **3.3 The Seal Button (Primary Action)**
  - [x] Create `components/journal/SealButton.tsx` (Section 4.1):
    - FAB (Floating Action Button) styled as wax seal
    - Disabled state when word count < 10
    - Pulsing animation after 30 seconds inactivity
    - Click triggers page flip animation
    - Sound effect: heavy "thud" + subtle chime
  - [x] Implement CSS page flip animation with Framer Motion:
    - 3D perspective transform
    - Duration: ~1 second
    - Reveal "sealed" visual state after flip

- [x] **3.4 Daily Journal Page Assembly**
  - [x] Create `components/journal/DailyPage.tsx`:
    - Compose: `DualDateDisplay`, `PromptBlock`, `InkCanvas`, `MoodSelector`, `TagInput`
    - Load entry for current date on mount
    - Handle save pipeline with debounce
    - Display `SealButton` at bottom
    - Show "Sealed" visual overlay when entry is sealed
  - [x] Implement navigation between dates:
    - Swipe gestures (left/right) for prev/next day
    - Keyboard shortcuts: Arrow keys
    - Smooth page transition animations

- [x] **3.5 Sound Effects Integration**
  - [x] Source high-quality sound files (Section 3.1):
    - `pen-click.mp3` (toggle sound)
    - `page-turn.mp3` (crisp paper rustle)
    - `seal-entry.mp3` (thud + chime)
  - [x] Create `hooks/useSound.ts`:
    - Preload audio files
    - Global mute toggle from settings
    - Play on specific actions
  - [x] Integrate sounds with user interactions

**Git Checkpoint:**
```bash
git add .
git commit -m "feat: implement daily journal feature with animations and seal mechanism"
git push origin main
```

### PHASE 4: Tracker & Extended Features
**Goal:** Build the Ibadah tracker, Quran study, and supporting features

- [ ] **4.1 Ibadah Tracker Components**
  - [ ] Create `components/ibadah/PrayerRow.tsx` (Section 4.3):
    - Prayer name display (Fajr, Dhuhr, Asr, Maghrib, Isha)
    - 3-state toggle: Empty circle → Gold check (on time) → Orange dash (late) → Red X (missed)
    - Visual feedback on state change
    - Sound effect on toggle
  - [ ] Create `components/ibadah/ExtraPrayerToggle.tsx`:
    - Checkboxes for: Qiyam, Duha
    - Input for Quran pages read
    - Fasting type selector
  - [ ] Create `components/ibadah/SevenDayGrid.tsx` (Section 4.3):
    - Heatmap-style grid for 7 days
    - Color coding: gold (on time), orange (late), red (missed), gray (no data)
    - Calculate and display "Spiritual Health" percentage
    - Animation on data update

- [ ] **4.2 Tracker Page Assembly**
  - [ ] Create `components/ibadah/TrackerPage.tsx`:
    - Daily view: All 5 prayers + extras for current day
    - Week view: `SevenDayGrid` component
    - Toggle between daily/weekly views
    - Date navigation controls
    - Fetch data from trackerService

- [ ] **4.3 Quran Study (SOAP Method)**
  - [ ] Create `components/quran/AyahPicker.tsx` (Section 4.4):
    - Dropdown 1: Select Surah (1-114)
    - Dropdown 2: Select Ayah (dependent on Surah selection)
    - Display selected verse in Arabic + English
    - Load from `quran.json` (lazy loaded)
  - [ ] Create `components/quran/SoapInput.tsx` (Section 4.4):
    - 4 collapsible sections:
      - **S**cripture: Display selected verse
      - **O**bservation: Text area for notes
      - **A**pplication: Text area for personal application
      - **P**rayer: Text area for dua/prayer
    - Auto-expand on focus, collapse on blur
    - Save to database as separate entry type (extend schema if needed)
  - [ ] Create `components/quran/QuranPage.tsx`:
    - Compose: `AyahPicker`, `SoapInput`
    - Search functionality for verses

- [ ] **4.4 Gratitude Feature**
  - [ ] Create `components/gratitude/GratitudeCard.tsx`:
    - Input for blessing description
    - Dropdown for connecting to Name of Allah (Al-Razzaq, Al-Wahhab, etc.)
    - Date stamp
  - [ ] Create `components/gratitude/GratitudeList.tsx`:
    - Display all gratitude entries
    - Filter by Name of Allah
    - Beautiful card-based layout
  - [ ] Add gratitude service methods to database layer

**Git Checkpoint:**
```bash
git add .
git commit -m "feat: implement ibadah tracker, Quran SOAP study, and gratitude features"
git push origin main
```

### PHASE 5: Polish, PWA Configuration & Production Readiness
**Goal:** Finalize UX, implement onboarding, PWA features, and prepare for deployment

- [ ] **5.1 Onboarding Flow** (Section 2.2)
  - [ ] Create `components/onboarding/SplashScreen.tsx`:
    - Animated Bismillah calligraphy (fade in/out)
    - Duration: 2-3 seconds
  - [ ] Create `components/onboarding/CovenantModal.tsx`:
    - Privacy statement: "This journal is private..."
    - Single "I Understand" button
    - Stores acceptance in `user_settings`
  - [ ] Create `components/onboarding/SetupWizard.tsx`:
    - Input: User name
    - Input: Hijri offset adjustment (-2 to +2)
    - Theme preference selector
    - Save to `user_settings` table
  - [ ] Create `components/onboarding/Tutorial.tsx`:
    - "Ghost hand" animation showing swipe gesture
    - Show how to seal an entry
    - Skippable, one-time display
  - [ ] Orchestrate onboarding flow on first launch

- [ ] **5.2 Settings & Preferences**
  - [ ] Create `components/settings/SettingsPage.tsx`:
    - Theme toggle (light/dark/system)
    - Hijri offset adjustment
    - Font scale slider (1.0 to 1.5)
    - Sound effects toggle
    - Daily reminder time picker (future notification integration)
    - Data management section
  - [ ] Create `components/settings/BackupSection.tsx`:
    - Export button → triggers `backupService.exportData()`
    - Import button → file picker → validation → conflict resolution modal
    - Display last backup date
    - "Wipe Data" button (with confirmation modal)

- [ ] **5.3 Data Persistence & Security** (Section 8)
  - [ ] Implement Storage Persistence API:
    - Call `navigator.storage.persist()` on first load
    - Display warning if persistence is denied
    - Add persistent reminder in settings
  - [ ] Integrate DOMPurify:
    - Sanitize all HTML content before rendering in read mode
    - Apply to imported backup data
  - [ ] Implement "Blur Mode" (optional):
    - CSS `blur(5px)` on journal content by default
    - Eye icon to reveal content
    - Toggle in settings

- [ ] **5.4 PWA Configuration** (Section 9)
  - [ ] Configure `vite-plugin-pwa`:
    - Generate `manifest.json`:
      - App name: "The Deen Journal"
      - Short name: "Deen Journal"
      - Theme color: `#0F172A` (Midnight)
      - Background color: `#0F172A`
      - Display: standalone
      - Icons: 192x192, 512x512 (create with appropriate Islamic geometric patterns)
    - Service Worker strategy: `NetworkFirst` for assets, `CacheFirst` for static
    - Offline fallback page
  - [ ] Create app icons (multiple sizes):
    - Use Islamic geometric patterns or calligraphy
    - Export as PNG in required sizes
  - [ ] Test offline functionality:
    - Airplane mode test
    - Network throttling test
    - Verify data persists after offline session

- [ ] **5.5 Performance Optimization**
  - [ ] Code splitting:
    - Lazy load `quran.json` only when Quran tab is opened
    - Lazy load onboarding components (only on first launch)
    - Route-based code splitting with `React.lazy()`
  - [ ] Bundle size analysis:
    - Run `vite build` and analyze chunks
    - Ensure total JS < 200KB gzipped
  - [ ] Lighthouse audit:
    - Target: 90+ on Performance, Accessibility, Best Practices, PWA
    - Fix any issues identified

- [ ] **5.6 Final UX Polish**
  - [ ] Add loading skeletons for async operations
  - [ ] Implement error boundaries for graceful error handling
  - [ ] Add empty states for:
    - No journal entries yet
    - No tracker data
    - No gratitude entries
  - [ ] Verify all animations are smooth (60fps)
  - [ ] Test on multiple devices:
    - iOS Safari (critical for PWA)
    - Android Chrome
    - Desktop browsers
  - [ ] Accessibility audit:
    - Keyboard navigation
    - Screen reader compatibility
    - Focus indicators
    - ARIA labels

- [ ] **5.7 Documentation & Deployment**
  - [ ] Create `README.md`:
    - Project overview
    - Installation instructions
    - Development commands
    - Technology stack
    - Architecture overview
  - [ ] Create `.env.example` if any environment variables are needed
  - [ ] Configure production build:
    - Set proper base URL
    - Configure deployment platform (Netlify, Vercel, or Firebase Hosting)
  - [ ] Create deployment workflow (GitHub Actions or manual instructions)

### 🎯 Success Criteria Per Phase
**Phase 1:** Can navigate between empty routes, theme switches correctly, database initializes without errors.

**Phase 2:** Can manually test CRUD operations via browser console, backup export creates valid JSON file.

**Phase 3:** Can write a journal entry, see it auto-save, seal it with animation, and reload without data loss.

**Phase 4:** Can log prayers with 3-state toggle, view weekly heatmap, select a Quran verse and write SOAP reflection.

**Phase 5:** App works completely offline, passes Lighthouse PWA audit, onboarding shows on first launch, data persists after 7 days.

### 📦 Estimated Bundle Targets
- **Initial Load (JS):** < 150KB gzipped
- **quran.json (lazy):** < 500KB gzipped
- **Total Assets:** < 1MB
