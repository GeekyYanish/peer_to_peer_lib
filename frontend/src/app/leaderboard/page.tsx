'use client';

import { useState, useEffect } from 'react';
import ReputationBadge from '@/components/ReputationBadge';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { User, UserClassification } from '@/lib/types';
import * as api from '@/lib/api';

const getRankIcon = (rank: number) => {
    switch (rank) {
        case 1: return '🥇';
        case 2: return '🥈';
        case 3: return '🥉';
        default: return `#${rank}`;
    }
};

export default function LeaderboardPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const data = await api.getLeaderboard(20);
                setUsers(data || []);
            } catch { setUsers([]); }
            finally { setLoading(false); }
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto">
                <div className="mb-8"><div className="skeleton-pulse h-8 w-48 rounded" /></div>
                <LoadingSkeleton type="stat" count={3} />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">🏆 Leaderboard</h1>
                <p className="text-gray-600 mt-2">Top contributors in the P2P Academic Library network.</p>
            </div>

            {/* Go Concept */}
            <div className="card mb-6 bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200">
                <div className="flex items-start gap-4">
                    <div className="concept-number shrink-0">4</div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Go Concept: Maps & Structs</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Users are stored in a <code className="bg-white/50 px-1 rounded">map[UserID]*User</code>. Leaderboard sorts by reputation.
                        </p>
                    </div>
                </div>
            </div>

            {/* Top 3 Podium */}
            {users.length >= 3 && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {/* Second Place */}
                    <div className="card text-center pt-12 relative">
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-4xl">🥈</div>
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-gray-600">
                            {users[1]?.username.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="font-semibold text-gray-900">{users[1]?.username}</h3>
                        <p className="text-2xl font-bold text-gray-600 mt-1">{Number(users[1]?.reputation)}</p>
                        <ReputationBadge classification={users[1]?.classification as UserClassification} score={Number(users[1]?.reputation)} showScore={false} size="sm" />
                    </div>

                    {/* First Place */}
                    <div className="card text-center pt-8 relative bg-gradient-to-b from-yellow-50 to-white border-yellow-300">
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-5xl">🥇</div>
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 mx-auto mb-3 flex items-center justify-center text-3xl font-bold text-white mt-4">
                            {users[0]?.username.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="font-bold text-lg text-gray-900">{users[0]?.username}</h3>
                        <p className="text-3xl font-bold text-yellow-600 mt-1">{Number(users[0]?.reputation)}</p>
                        <ReputationBadge classification={users[0]?.classification as UserClassification} score={Number(users[0]?.reputation)} showScore={false} size="md" />
                    </div>

                    {/* Third Place */}
                    <div className="card text-center pt-12 relative">
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-4xl">🥉</div>
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-amber-800">
                            {users[2]?.username.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="font-semibold text-gray-900">{users[2]?.username}</h3>
                        <p className="text-2xl font-bold text-amber-600 mt-1">{Number(users[2]?.reputation)}</p>
                        <ReputationBadge classification={users[2]?.classification as UserClassification} score={Number(users[2]?.reputation)} showScore={false} size="sm" />
                    </div>
                </div>
            )}

            {/* Full Table */}
            <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Full Rankings</h2>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th className="w-16">Rank</th>
                                <th>User</th>
                                <th>Classification</th>
                                <th className="text-center">Uploads</th>
                                <th className="text-center">Downloads</th>
                                <th className="text-center">Avg Rating</th>
                                <th className="text-right">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, idx) => (
                                <tr key={user.id}>
                                    <td className="font-medium"><span className="text-xl">{getRankIcon(idx + 1)}</span></td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}>
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{user.username}</p>
                                                <p className="text-sm text-gray-500">{user.status === 'online' ? '🟢 Online' : '⚫ Offline'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <ReputationBadge classification={user.classification as UserClassification} score={Number(user.reputation)} showScore={false} size="sm" />
                                    </td>
                                    <td className="text-center font-medium text-green-600">↑ {user.total_uploads}</td>
                                    <td className="text-center font-medium text-blue-600">↓ {user.total_downloads}</td>
                                    <td className="text-center">
                                        <span className="text-yellow-500">{'★'.repeat(Math.round(user.average_rating))}</span>
                                        <span className="text-gray-300">{'★'.repeat(5 - Math.round(user.average_rating))}</span>
                                    </td>
                                    <td className="text-right">
                                        <span className={`font-bold text-lg ${Number(user.reputation) > 50 ? 'text-green-600' : Number(user.reputation) >= 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                                            {Number(user.reputation)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
