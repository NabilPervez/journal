import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';

// Placeholder components
const Journal = () => <div className="p-8 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm shadow-xl animate-pulse">
  <h1 className="text-3xl font-heading mb-4 text-gold">Journal Page</h1>
  <p className="font-body text-slate-300">Start your daily reflection here. (Phase 3)</p>
</div>;

const Tracker = () => <div className="p-8 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm shadow-xl">
  <h1 className="text-3xl font-heading mb-4 text-gold">Ibadah Tracker</h1>
  <p className="font-body text-slate-300">Track your prayers and habits. (Phase 4)</p>
</div>;

const Quran = () => <div className="p-8 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm shadow-xl">
  <h1 className="text-3xl font-heading mb-4 text-gold">Quran Study</h1>
  <p className="font-body text-slate-300">Reflect on the words of Allah. (Phase 4)</p>
</div>;

const Gratitude = () => <div className="p-8 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm shadow-xl">
  <h1 className="text-3xl font-heading mb-4 text-gold">Gratitude Log</h1>
  <p className="font-body text-slate-300">Count your blessings. (Phase 4)</p>
</div>;

const Settings = () => <div className="p-8 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm shadow-xl">
  <h1 className="text-3xl font-heading mb-4 text-gold">Settings</h1>
  <p className="font-body text-slate-300">Manage your preferences and data. (Phase 5)</p>
</div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<Journal />} />
        <Route path="tracker" element={<Tracker />} />
        <Route path="quran" element={<Quran />} />
        <Route path="gratitude" element={<Gratitude />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
