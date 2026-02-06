'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
    { name: 'Dashboard', href: '/', icon: '🏠' },
    { name: 'Learn Go', href: '/learn', icon: '📖' },
    { name: 'Library', href: '/library', icon: '📚' },
    { name: 'Search', href: '/search', icon: '🔍' },
    { name: 'Analytics', href: '/analytics', icon: '📊' },
    { name: 'Leaderboard', href: '/leaderboard', icon: '🏆' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside className={`sidebar fixed left-0 top-0 z-40 transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`}>
            <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xl">
                            📚
                        </div>
                        {!collapsed && (
                            <div className="animate-fade-in">
                                <h1 className="font-bold text-lg text-white">Knowledge Exchange</h1>
                                <p className="text-xs text-white/60">P2P Academic Library</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    <p className={`text-xs text-white/40 uppercase tracking-wider mb-4 ${collapsed ? 'text-center' : 'px-3'}`}>
                        {collapsed ? '•••' : 'Navigation'}
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
                                {!collapsed && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Go Concepts Quick Access */}
                {!collapsed && (
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
                )}

                {/* Collapse Button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-4 border-t border-white/10 hover:bg-white/5 transition-colors text-white/60 hover:text-white"
                >
                    {collapsed ? '→' : '← Collapse'}
                </button>
            </div>
        </aside>
    );
}
