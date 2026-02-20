'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
    { name: 'Dashboard', href: '/', icon: '🏠' },
    { name: 'Library', href: '/library', icon: '📚' },
    { name: 'Search', href: '/search', icon: '🔍' },
    { name: 'Peers', href: '/peers', icon: '🌐' },
    { name: 'Analytics', href: '/analytics', icon: '📊' },
    { name: 'Leaderboard', href: '/leaderboard', icon: '🏆' },
    { name: 'Learn Go', href: '/learn', icon: '📖' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="sidebar fixed left-0 top-0 z-40 w-72">
            <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xl">
                            📚
                        </div>
                        <div>
                            <h1 className="font-bold text-lg text-white">Knowledge Exchange</h1>
                            <p className="text-xs text-white/60">P2P Academic Library</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-4 px-3">
                        Navigation
                    </p>
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`sidebar-link ${isActive ? 'active' : ''}`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.name}</span>
                                {isActive && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Go Concepts Quick Access */}
                <div className="p-4 border-t border-white/10">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-3 px-3">
                        Go Concepts
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <Link
                                key={num}
                                href={`/learn#concept-${num}`}
                                className="concept-number hover:scale-110 transition-transform"
                                title={`Concept ${num}`}
                            >
                                {num}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* User Info */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                            A
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">alice</p>
                            <p className="text-xs text-white/50">⭐ Contributor</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
