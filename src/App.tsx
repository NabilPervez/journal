import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { DailyPage } from './components/journal/DailyPage';
import { TrackerPage } from './components/ibadah/TrackerPage';
import { QuranPage } from './components/quran/QuranPage';
import { GratitudePage } from './components/gratitude/GratitudePage';

// Placeholder components (Phase 4 & 5)
const Settings = () => <div className="p-8 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm shadow-xl">
  <h1 className="text-3xl font-heading mb-4 text-gold">Settings</h1>
  <p className="font-body text-slate-300">Manage your preferences and backup data. (Coming in Phase 5)</p>
</div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<DailyPage />} />
        <Route path="tracker" element={<TrackerPage />} />
        <Route path="quran" element={<QuranPage />} />
        <Route path="gratitude" element={<GratitudePage />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
