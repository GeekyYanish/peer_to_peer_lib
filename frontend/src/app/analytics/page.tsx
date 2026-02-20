'use client';

import { useState, useEffect } from 'react';
import StatCard from '@/components/StatCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { User, NetworkStats } from '@/lib/types';
import * as api from '@/lib/api';

export default function AnalyticsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [users, stats] = await Promise.all([api.getUsers(), api.getNetworkStats()]);
                setUser(users[0] || null);
                setNetworkStats(stats);
            } catch { /* fallback handled */ }
            finally { setLoading(false); }
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto">
                <div className="mb-8"><div className="skeleton-pulse h-8 w-64 rounded" /></div>
                <LoadingSkeleton type="stat" count={4} />
            </div>
        );
    }

    const u = user || { reputation: 0, total_uploads: 0, total_downloads: 0, average_rating: 0, classification: 'Neutral' as const };
    const repScore = Number(u.reputation);
    const uploadScore = u.total_uploads * 2;
    const dlPenalty = u.total_downloads;
    const ratingBonus = Math.round(u.average_rating * 10);

    // Simulated history
    const reputationHistory = [
        { week: 'Week 1', score: Math.max(0, Math.round(repScore * 0.2)) },
        { week: 'Week 2', score: Math.max(0, Math.round(repScore * 0.35)) },
        { week: 'Week 3', score: Math.max(0, Math.round(repScore * 0.5)) },
        { week: 'Week 4', score: Math.max(0, Math.round(repScore * 0.65)) },
        { week: 'Week 5', score: Math.max(0, Math.round(repScore * 0.8)) },
        { week: 'Week 6', score: repScore },
    ];
    const maxScore = Math.max(...reputationHistory.map(h => h.score), 1);

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">📊 Analytics & Reputation</h1>
                <p className="text-gray-600 mt-2">Track your contribution metrics and understand the reputation system.</p>
            </div>

            {/* Go Concept */}
            <div className="card mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                <div className="flex items-start gap-4">
                    <div className="concept-number shrink-0">5</div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Go Concept: Functions & Error Handling</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Reputation uses a pure function <code className="bg-white/50 px-1 rounded">CalculateReputation()</code> with proper error returns.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard title="Reputation Score" value={repScore} icon="🏆" color="purple" />
                <StatCard title="Total Uploads" value={u.total_uploads} icon="📤" color="green" />
                <StatCard title="Total Downloads" value={u.total_downloads} icon="📥" color="blue" />
                <StatCard title="Average Rating" value={`${u.average_rating.toFixed(1)}⭐`} icon="⭐" color="yellow" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Reputation Trend */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Reputation Trend</h3>
                    <div className="space-y-3">
                        {reputationHistory.map((point, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <span className="text-sm text-gray-500 w-16">{point.week}</span>
                                <div className="flex-1">
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${(point.score / maxScore) * 100}%` }} />
                                    </div>
                                </div>
                                <span className="text-sm font-medium w-12 text-right">{point.score}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Score Calculation */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🧮 Score Calculation</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Uploads × 2</span>
                            <span className="font-mono font-medium text-green-600">+{uploadScore}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Downloads × -1</span>
                            <span className="font-mono font-medium text-red-600">-{dlPenalty}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Rating × 10</span>
                            <span className="font-mono font-medium text-blue-600">+{ratingBonus}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 bg-gray-50 -mx-4 px-4 rounded-lg">
                            <span className="font-semibold text-gray-900">Total Score</span>
                            <span className="font-mono font-bold text-purple-600 text-xl">{repScore}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Network Stats */}
            {networkStats && (
                <>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Network Statistics</h2>
                    <div className="card mb-8">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                            <div className="text-center"><p className="text-3xl font-bold text-gray-900">{networkStats.total_users}</p><p className="text-sm text-gray-500">Total Users</p></div>
                            <div className="text-center"><p className="text-3xl font-bold text-green-600">{networkStats.contributors}</p><p className="text-sm text-gray-500">Contributors</p></div>
                            <div className="text-center"><p className="text-3xl font-bold text-yellow-600">{networkStats.neutral}</p><p className="text-sm text-gray-500">Neutral</p></div>
                            <div className="text-center"><p className="text-3xl font-bold text-red-600">{networkStats.leechers}</p><p className="text-sm text-gray-500">Leechers</p></div>
                            <div className="text-center"><p className="text-3xl font-bold text-purple-600">{networkStats.average_score.toFixed(1)}</p><p className="text-sm text-gray-500">Avg Score</p></div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <p className="text-sm text-gray-500 mb-3">User Distribution</p>
                            <div className="flex rounded-full overflow-hidden h-4">
                                <div className="bg-green-500" style={{ width: `${(networkStats.contributors / networkStats.total_users) * 100}%` }} />
                                <div className="bg-yellow-500" style={{ width: `${(networkStats.neutral / networkStats.total_users) * 100}%` }} />
                                <div className="bg-red-500" style={{ width: `${(networkStats.leechers / networkStats.total_users) * 100}%` }} />
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-gray-500">
                                <span>⭐ Contributors ({Math.round((networkStats.contributors / networkStats.total_users) * 100)}%)</span>
                                <span>🔶 Neutral ({Math.round((networkStats.neutral / networkStats.total_users) * 100)}%)</span>
                                <span>⚠️ Leechers ({Math.round((networkStats.leechers / networkStats.total_users) * 100)}%)</span>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Throttling */}
            <div className="card bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Download Speed Throttling</h3>
                <p className="text-gray-600 mb-4">Your download speed is adjusted based on your classification.</p>
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Contributor', pct: '100%', color: 'green', cls: 'Contributor' },
                        { label: 'Neutral', pct: '70%', color: 'yellow', cls: 'Neutral' },
                        { label: 'Leecher', pct: '30%', color: 'red', cls: 'Leecher' },
                    ].map(t => (
                        <div key={t.cls} className={`p-4 rounded-lg text-center ${u.classification === t.cls ? `bg-${t.color}-100 ring-2 ring-${t.color}-500` : 'bg-white'}`}>
                            <p className={`text-2xl font-bold text-${t.color}-600`}>{t.pct}</p>
                            <p className="text-sm text-gray-600">{t.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
