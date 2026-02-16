import { Link, useLocation } from 'react-router-dom';
import { PenTool, Grid, BookOpen, Lamp, Settings } from 'lucide-react';

const navItems = [
    { path: '/', label: 'Journal', icon: PenTool },
    { path: '/tracker', label: 'Tracker', icon: Grid },
    { path: '/quran', label: 'Quran', icon: BookOpen },
    { path: '/gratitude', label: 'Gratitude', icon: Lamp },
    { path: '/settings', label: 'Settings', icon: Settings },
];

export function NavigationRibbon() {
    const location = useLocation();

    return (
        <nav className="fixed bottom-0 w-full md:w-20 md:h-screen md:left-0 bg-midnight/95 backdrop-blur border-t md:border-t-0 md:border-r border-slate-800 z-50 shadow-2xl">
            <div className="flex md:flex-col justify-around md:justify-center items-center h-16 md:h-full gap-4 md:gap-8">
                {navItems.map(({ path, label, icon: Icon }) => {
                    const isActive = location.pathname === path;
                    return (
                        <Link
                            key={path}
                            to={path}
                            className={`p-3 rounded-xl transition-all duration-300 group relative ${isActive
                                    ? 'text-gold bg-gold/10 scale-110 shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                }`}
                            title={label}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className="transition-transform group-hover:scale-105" />
                            {isActive && (
                                <span className="hidden md:block absolute left-full ml-4 px-2 py-1 bg-slate-800 text-starlight text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                    {label}
                                </span>
                            )}
                            <span className="sr-only">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
