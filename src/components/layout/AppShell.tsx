import { Outlet } from 'react-router-dom';
import { NavigationRibbon } from './NavigationRibbon';

export function AppShell() {
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-midnight text-starlight transition-colors duration-500 font-body">
            <NavigationRibbon />
            <main className="flex-1 pb-24 md:pb-6 md:pl-24 px-4 py-6 w-full max-w-7xl mx-auto animate-[fadeIn_0.5s_ease-out]">
                <Outlet />
            </main>
        </div>
    );
}
