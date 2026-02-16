import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { DailyPage } from './components/journal/DailyPage';
import { TrackerPage } from './components/ibadah/TrackerPage';
import { QuranPage } from './components/quran/QuranPage';
import { GratitudePage } from './components/gratitude/GratitudePage';
import { SettingsPage } from './components/settings/SettingsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<DailyPage />} />
        <Route path="tracker" element={<TrackerPage />} />
        <Route path="quran" element={<QuranPage />} />
        <Route path="gratitude" element={<GratitudePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
