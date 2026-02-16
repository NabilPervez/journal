# **Product Requirements Document: The Deen Journal**

**Version:** 2.1 **Status:** Ready for Development **Platform:** Progressive Web App (Mobile First)

## **1\. Executive Summary**

**The Deen Journal** is a privacy-first, offline-capable Progressive Web App (PWA) designed to digitalize the concept of the Islamic "Book of Deeds." It bridges the gap between tactile physical journaling and modern convenience.  
By utilizing "Magic Book" 2D animations, local storage, and specific spiritual frameworks (SOAP, Muhasabah), it facilitates daily *Tazkiyah* (spiritual purification) without the distractions of the internet, social sharing, or AI data mining.

### **1.1 Success Metrics (KPIs)**

* **Day-1 to Day-7 Retention:** % of users who create an entry on day 7 after install.  
* **"Seal" Rate:** % of sessions that end with the "Seal Entry" button (completing the loop).  
* **Data Health:** % of users engaging with the "Backup" feature at least once a month.

## **2\. User Experience (UX) Strategy**

### **2.1 Core Philosophy: "The Digital Sanctuary"**

* **Local-First:** No login screens, no "Syncing..." spinners. The app is immediate and private.  
* **Tactile Feedback:** Every major interaction (sealing a page, checking a habit) must have visual or haptic weight.  
* **No Infinite Scroll:** The UI should feel finite, like a book, to reduce anxiety.

### **2.2 The "First Run" Experience (Onboarding)**

Since there is no auth, the onboarding must set the emotional tone immediately.

1. **Splash Screen:** Animated calligraphy (Bismillah) fades in/out.  
2. **The Covenant:** A simple modal: *"This journal is private. Your data lives on this device. We cannot see your sins or your prayers."* \-\> \[I Understand\].  
3. **Setup:**  
   * Input: Name (for personalized greetings).  
   * Input: Hijri Date Adjustment (+/- 1 day).  
   * Choice: Theme Preference (Moonlight/Midnight or Parchment/Day).  
4. **Tutorial:** A single "Ghost Hand" animation showing how to swipe the page or click "Seal."

## **3\. Brand Identity & Visual System**

### **3.1 Visual Direction: "Celestial Heritage"**

The aesthetic balances the solemnity of ancient manuscripts with the cleanliness of modern UI.  
**Color Palette:**

* **Midnight (Primary Background):** \#0F172A (Slate 900\) \- Represents the *Qiyam* (Night Prayer).  
* **Starlight (Text/Icons):** \#F8FAFC (Slate 50\) \- High contrast for legibility.  
* **Burnished Gold (Accent/Action):** \#D4AF37 (Metallic) \- Used *sparingly* for primary actions (Seal Button) and successful states.  
* **Crimson Ink (Error/Missed):** \#9F1239 (Rose 800\) \- For missed prayers or destructive actions.  
* **Parchment (Light Mode Background):** \#F5F5DC \- A subtle paper texture, not flat white.

**Typography:**

* **Headings (English):** *Cinzel* or *Libre Baskerville* (Evokes history/engraving).  
* **Headings (Arabic):** *Amiri* or *Scheherazade New* (Traditional Naskh script).  
* **Body Text:** *Inter* or *Lato* (Clean, sans-serif for long-form writing legibility).

**Sonic Branding (Sound FX):**

* *Toggle:* Sounds like a pen cap clicking.  
* *Page Turn:* A crisp paper rustle (must be high quality, not scratchy).  
* *Seal Entry:* A heavy "Thud" or "Stamp" sound followed by a subtle chime.

## **4\. Component Breakdown (Atomic Level)**

### **4.1 Global Components**

**The Navigation Ribbon:**

* **Visual:** A vertical bookmark tab on the right edge (desktop) or bottom tab bar (mobile).  
* **States:**  
  * *Active:* Gold, extended slightly.  
  * *Inactive:* Dimmed opacity.  
* **Icons:** Quill (Journal), Grid (Tracker), Book (Quran), Lamp (Gratitude).

**The "Seal" Button (Primary Action):**

* **Visual:** Floating Action Button (FAB) or fixed bottom bar. Styled like a wax seal or a signet ring.  
* **Behavior:**  
  * *Disabled:* If entry word count \< 10\.  
  * *Active:* Pulses slowly after 30 seconds of inactivity.  
  * *Click:* Triggers the CSS Page Flip animation.

### **4.2 Feature: Daily Journal (The Open Book)**

**The Date Header:**

* **Component:** DualDateDisplay  
* **Logic:** Gregorian Date (System) \+ Hijri Date (Algorithm \+ User Offset).  
* **Interaction:** Tapping opens the Date Picker calendar.

**The Prompt Card:**

* **Component:** PromptBlock  
* **UI:** A bordered box with an ornamental pattern.  
* **Sub-element:** RefreshIcon. Tapping generates a new random index from prompts.json.  
* **Logic:** Cycles through categories (Self, World, Deen) to prevent repetition.

**The Editor:**

* **Component:** InkCanvas  
* **Type:** contentEditable div or textarea.  
* **Styling:** CSS lines (background-image: linear-gradient) that align perfectly with the line-height of the font.  
* **Auto-save:** Debounced save to IndexedDB every 3000ms.

### **4.3 Feature: Ibadah Tracker (The Grid)**

**The Prayer Row:**

* **Component:** SalahRow  
* **Props:** prayerName (Fajr, Dhuhr...), timeWindow.  
* **State Manager:** 3-state toggle.  
  1. *Null:* Empty Circle (No data).  
  2. *Done:* Gold Check (On time).  
  3. *Late:* Orange Dash (Qada).  
  4. *Missed:* Red X.

**The Week View:**

* **Component:** SevenDayGrid  
* **Visual:** A heatmap style grid.  
* **Logic:** Calculates a "Spiritual Health" percentage for the week based on on-time performance.

### **4.4 Feature: Quran Study (SOAP)**

**The Verse Selector:**

* **Component:** AyahPicker  
* **Logic:** Two dependent dropdowns.  
  1. Select Surah (1-114).  
  2. Select Ayah (1-Max).  
* **Performance:** Queries quran.json. *Optimization:* If the JSON is too large, chunk it by Surah.

**The Reflection Input:**

* **Component:** SoapInput  
* **Props:** label (Scripture, Observation, Application, Prayer).  
* **UI:** Each section expands when focused to allow deep work, collapses when done.

## **5\. Data Schema & Architecture**

**Database:** Dexie.js (IndexedDB wrapper). **Store Name:** DeenJournalDB\_v1

### **5.1 Tables**

**Table: entries** (Primary Journaling)  
`interface JournalEntry {`  
  `id?: number;          // Auto-increment primary key`  
  `dateString: string;   // "2023-10-27" (Indexable)`  
  `hijriDate: string;    // "1445-04-12"`  
  `content: string;      // HTML/Markdown string of the journal entry`  
  `promptId: number;     // Reference to the prompt answered`  
  `mood: 'sun' | 'cloud' | 'storm' | 'moon';`  
  `tags: string[];       // ["Ramadan", "Jummah", "Reflective"]`  
  `createdAt: number;    // Timestamp`  
  `updatedAt: number;    // Timestamp`  
`}`

**Table: tracker** (Ibadah Logging)  
`interface DailyTracker {`  
  `dateString: string;   // Primary Key "2023-10-27"`  
  `fajr: 'on_time' | 'late' | 'missed' | null;`  
  `dhuhr: 'on_time' | 'late' | 'missed' | null;`  
  `asr: 'on_time' | 'late' | 'missed' | null;`  
  `maghrib: 'on_time' | 'late' | 'missed' | null;`  
  `isha: 'on_time' | 'late' | 'missed' | null;`  
  `extraPrayers: string[]; // ["Duha", "Witr"]`  
`}`

**Table: gratitude**  
`interface GratitudeItem {`  
  `id?: number;`  
  `dateString: string;`  
  `blessing: string;`  
  `connectedNameOfAllah: string; // e.g., "Al-Razzaq"`  
`}`

`I have significantly expanded the Data & Backend portion of your PRD. Since you are building a Local-First PWA, the "Backend" effectively runs inside the user's browser using IndexedDB.`  
`Here is the expanded technical specification. You can drop these sections directly into your PRD, replacing the previous "Data Schema" section.`  
`5. Data Architecture & Schema`  
`Philosophy: The app uses a Repository Pattern. The UI never talks directly to the database. Instead, it calls a JournalService or TrackerService which handles the logic, validation, and communication with Dexie.js.`  
`5.1 Database Configuration (Dexie.js)`  
 `* Database Name: DeenJournal_Local_DB`  
 `* Version Strategy: Strict versioning must be used.`  
   `* v1: Initial Schema.`  
   `* v2 (Future): Adding 'Ramadan Mode' specific tables.`  
`5.2 Core Data Models (TypeScript Interfaces)`  
`Table: entries (The Daily Pages)`  
 `* Primary Key: dateString (Format: "YYYY-MM-DD"). Crucial: Do not use ISO timestamps for the key to avoid timezone shifting bugs.`  
`<!-- end list -->`  
`interface JournalEntry {`  
  `dateString: string;       // PK: "2023-10-27"`  
  `hijriDate: string;        // "1445-04-12" (Snapshot at time of creation)`  
    
  `// Content`  
  `contentRaw: string;       // The raw text content`  
  `contentHtml: string;      // Sanitized HTML (if using rich text) or Markdown`  
    
  `// Metadata`  
  `promptId?: string;        // ID of the prompt answered (if any)`  
  `tags: string[];           // ["Gratitude", "Anxiety", "Dua"]`  
  `mood: 'peace' | 'struggle' | 'neutral' | 'high-imaan';`  
    
  `// System`  
  `wordCount: number;        // For analytics`  
  `isSealed: boolean;        // True = "Read Only" mode (visual wax seal)`  
  `lastModified: number;     // Unix Timestamp`  
  `syncedToBackup: boolean;  // False if modified since last export`  
`}`

`Table: ibadah_log (The Tracker)`  
 `* Primary Key: dateString ("YYYY-MM-DD")`  
`<!-- end list -->`  
`interface IbadahLog {`  
  `dateString: string;       // PK`  
    
  `// Salah (0=Missed, 1=Late, 2=OnTime, null=NoData)`  
  `fajr: 0 | 1 | 2 | null;`  
  `dhuhr: 0 | 1 | 2 | null;`  
  `asr: 0 | 1 | 2 | null;`  
  `maghrib: 0 | 1 | 2 | null;`  
  `isha: 0 | 1 | 2 | null;`  
    
  `// Extras`  
  `qiyam: boolean;           // Night prayer`  
  `duha: boolean;            // Morning prayer`  
  `quranPagesRead: number;   // Integer`  
    
  `// Fasting`  
  `fastingType: 'none' | 'ramadan' | 'sunnah' | 'makeup';`  
`}`

`Table: user_settings (The Preferences)`  
 `* Type: Key-Value pair storage (Single row or strictly defined keys).`  
`<!-- end list -->`  
`interface UserSettings {`  
  `key: string;              // PK (e.g., "theme", "hijri_offset")`  
  `value: any;`  
`}`  
`/*`  
  `Expected Keys:`  
  `- "hijri_offset": number (-2 to +2)`  
  `- "theme_mode": "light" | "dark" | "system"`  
  `- "font_scale": number (1.0 to 1.5)`  
  `- "daily_reminder_time": string ("21:00")`  
`*/`

`6. Static Data Management (The "Library")`  
`Since there is no API to fetch data from, the "Library" must be bundled efficiently.`  
`6.1 The Quran Data (quran.json)`  
 `* Strategy: Lazy Loading. Do not load the Quran JSON into the main bundle. It should be a separate chunk fetched only when the user opens the "Quran/SOAP" tab.`  
 `* Structure:`  
   `[`  
  `{`  
    `"surah_number": 1,`  
    `"ayah_number": 1,`  
    `"text_ar": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",`  
    `"text_en": "In the name of Allah, the Entirely Merciful, the Especially Merciful.",`  
    `"search_tokens": ["mercy", "name", "allah"] // Pre-computed for faster search`  
  `}`  
  `// ... 6236 entries`  
`]`

`6.2 The Prompt Engine (prompts.json)`  
 `* Logic: The app does not pick randomly every time (which causes repeats). It uses a Deterministic Shuffle based on the date.`  
 `* Structure:`  
   `{`  
  `"morning": ["What is one intention for today?", ...],`  
  `"evening": ["How did you see Allah's mercy today?", ...],`  
  `"friday": ["Reflect on Surah Kahf...", ...],`  
  `"ramadan": ["What hunger did you feel today?", ...]`  
`}`

`7. Data Lifecycle & Service Layer`  
`7.1 The "Save" Pipeline (Debounce Strategy)`  
`To prevent database thrashing (writing to disk on every keystroke), the editor uses a specialized pipeline:`  
 `* User Types: Event fires in UI.`  
 `* Local State: React state updates immediately (UI is responsive).`  
 `* Debounce Timer: A 2000ms timer starts.`  
   `* If user keeps typing: Timer resets.`  
   `* If user stops: Timer fires.`  
 `* Service Call: JournalService.saveEntry(date, content).`  
 `* Write: Data is written to IndexedDB.`  
 `* Visual Cue: A small "Saving..." indicator turns to "Saved" (Golden checkmark).`  
`7.2 The Backup & Restore System (JSON Protocol)`  
`This is the only way data leaves the browser.`  
 `* Export Flow:`  
   `* BackupService queries entries.toArray() and ibadah_log.toArray().`  
   `* Metadata is added: version, exportDate, checksum.`  
   `* A Blob is created with MIME type application/json.`  
   `* The browser triggers a download: deen_journal_backup_2023-10-27.json.`  
 `* Import Flow:`  
   `* User selects file.`  
   `* Validation: App checks if version matches and if entries is an array.`  
   `* Conflict Resolution Modal:`  
     `* Option A: Merge (Smart) - Adds missing entries, keeps local version if conflict exists.`  
     `* Option B: Overwrite (Destructive) - Wipes DB, replaces with file data.`  
`8. Privacy & Security Specifications`  
`8.1 Data Persistence & "Wipe" Risk`  
 `* Risk: Browsers (especially Safari on iOS) may auto-delete IndexedDB data if the device runs low on space or if the user doesn't visit the site for 7 days (WebKit restriction).`  
 `* Mitigation:`  
   `* Persistence API: On first load, call navigator.storage.persist(). This requests the browser to mark this site as "Persistent" (not to be auto-cleaned).`  
   `* Nag Screen: If storage persistence is denied, show a non-blocking warning: "Your journal is in Temporary Mode. Please Backup regularly."`  
`8.2 Content Sanitization`  
 `* Although local, we must sanitize inputs to prevent self-XSS (e.g., if a user pastes a malicious script into their own journal, or imports a malicious backup file).`  
 `* Rule: All HTML rendering must pass through DOMPurify before being displayed in the "Read" view.`  
`8.3 Local Encryption (Optional/Phase 2)`  
 `* Context: If a user hands their phone to someone else unlocked.`  
 `* Mechanism: Offer a "Blur Mode." A CSS filter (blur(5px)) is applied to the journal text area by default until the user taps a "Reveal" eye icon. This prevents shoulder-surfing.`

`Here is the Technology Stack & Library Recommendations section. You can add this to the end of your PRD (Section 9) or integrate it into the "Technical Requirements" section.`  
`This stack is chosen specifically for a Local-First PWA: it prioritizes small bundle sizes, offline capability, and robust local data handling.`  
`9. Recommended Technology Stack`  
`9.1 Core Framework & Build`  
 `* Language: TypeScript (Strict Mode).`  
   `* Why: Essential for defining the complex data shapes (Journal Entries, Tracker Logs) and preventing "undefined" errors in a database-heavy app.`  
 `* Framework: React (v18+).`  
   `* Why: The component-based architecture is perfect for the "Atomic" breakdown (Seal Button, Prayer Row) defined in Section 4.`  
 `* Build Tool: Vite.`  
   `* Why: Extremely fast builds and has excellent native support for PWA generation.`  
 `* PWA Plugin: vite-plugin-pwa.`  
   `* Why: Handles the manifest.json generation and Service Worker (offline caching) logic automatically with minimal configuration.`  
`9.2 Frontend Libraries (UI & UX)`  
 `* Styling: Tailwind CSS.`  
   `* Why: Utility-first classes make it easy to build the "Dark Mode" and "Gold Accent" themes without writing massive custom CSS files.`  
   `* Plugin: @tailwindcss/typography (essential for making the journal text look like a real document).`  
 `* Animations: Framer Motion.`  
   `* Why: The "Seal Entry" and "Page Flip" animations need to be physics-based to feel tactile. Framer Motion handles complex 2D transforms smoother than raw CSS.`  
 `* Icons: Lucide React or Phosphor Icons.`  
   `* Why: Clean, stroke-based icons that match the "Ink & Paper" aesthetic. They are tree-shakeable (won't bloat the app).`  
 `* Routing: React Router (v6).`  
   `* Why: Standard for handling navigation between "Journal," "Calendar," and "Settings" views without reloading the page.`  
`9.3 "Local Backend" & Data Layer`  
 `* Database: Dexie.js.`  
   `* Why: The industry standard wrapper for IndexedDB. It makes querying data (e.g., “Find all entries with tag ‘Ramadan’”) simple and readable compared to raw SQL or native IndexedDB API.`  
 `* Schema Validation: Zod.`  
   `* Why: Critical for Backups. When a user imports a JSON backup file, Zod validates the file structure to ensure it hasn't been tampered with or corrupted before saving it to the database.`  
 `* State Management: Zustand.`  
   `* Why: A lightweight alternative to Redux. Use this to handle "Session State" (e.g., Is the settings modal open? Is the audio muted?) that doesn't need to be saved to the database.`  
`9.4 Utilities & Helpers`  
 `* Date Management: date-fns.`  
   `* Why: Lighter than Moment.js. Essential for calculating streaks and formatting timestamps.`  
 `* Hijri Dates: Intl.DateTimeFormat (Native Browser API) or hijri-date-converter.`  
   `* Recommendation: Use the native Intl API first for performance, but if you need the "+/- 1 Day Adjustment" feature (essential for moon sighting), use hijri-date-converter as it allows manual day offsets.`  
 `* Text Handling: react-textarea-autosize.`  
   `* Why: The journal input should expand vertically as the user types, just like a real page, rather than having a fixed scrollbar.`  
 `* File Export: file-saver.`  
   `* Why: Reliably triggers the "Download" prompt across all browsers (iOS Safari, Chrome, Firefox) when the user clicks "Backup Data."`  
`9.5 Development Tools (Quality Assurance)`  
 `* Linter: ESLint (with plugin:react-hooks).`  
 `* Formatter: Prettier (configured for tailwind class sorting).`  
 `* Mock Data: Faker.js (optional).`  
   `* Use Case: Generating 100 fake journal entries to test if the "Search" or "Calendar Heatmap" slows down with a lot of data.`  
`10. File Structure Proposal (src/)`  
`Suggested organization to keep the project clean:`  
`src/`  
`├── assets/            # Static images (Paper textures, decorative SVGs)`  
`├── components/`  
`│   ├── ui/            # Generic atoms (Buttons, Modals, Inputs)`  
`│   ├── journal/       # Journal-specific (DailyPage, InkCanvas)`  
`│   ├── ibadah/        # Tracker-specific (PrayerRow, Grid)`  
`│   └── layout/        # AppShell, NavigationRibbon`  
`├── data/              # Static JSONs`  
`│   ├── quran.json     # (Lazy loaded)`  
`│   └── prompts.json   # Reflection prompts`  
`├── db/`  
`│   ├── db.ts          # Dexie database definition`  
`│   └── schema.ts      # TypeScript interfaces for data`  
`├── hooks/             # Custom logic (useHijriDate, useJournalEntry)`  
`├── services/`  
`│   ├── backup.ts      # Import/Export logic`  
`│   └── analytics.ts   # Streak calculation logic`  
`└── styles/            # Global Tailwind directives`

