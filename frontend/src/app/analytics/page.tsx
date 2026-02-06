'use client';

import StatCard from '@/components/StatCard';

// Demo analytics data
const userStats = {
    reputation: 95,
    classification: 'Contributor',
    uploads: 25,
    downloads: 15,
    averageRating: 4.5,
    throttle: 1.0
};

const networkStats = {
    totalUsers: 156,
    contributors: 42,
    neutral: 89,
    leechers: 25,
    averageScore: 28.5
};

const reputationHistory = [
    { week: 'Week 1', score: 20 },
    { week: 'Week 2', score: 35 },
    { week: 'Week 3', score: 45 },
    { week: 'Week 4', score: 60 },
    { week: 'Week 5', score: 75 },
    { week: 'Week 6', score: 95 },
];

export default function AnalyticsPage() {
    const maxScore = Math.max(...reputationHistory.map(h => h.score));

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">📊 Analytics & Reputation</h1>
                <p className="text-gray-600 mt-2">
                    Track your contribution metrics and understand the reputation system.
                </p>
            </div>

            {/* Go Concept Highlight */}
            <div className="card mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                <div className="flex items-start gap-4">
                    <div className="concept-number shrink-0">5</div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Go Concept: Functions & Error Handling</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            The reputation calculation is a pure function that returns the score.
                            Services use error returns for proper error handling.
                        </p>
                        <pre className="mt-2 text-xs bg-white/70 p-2 rounded font-mono">
                            {`func CalculateReputation(uploads, downloads int, rating float64) int {
    score := (uploads * 2) - downloads + int(rating * 10)
    if score < MinReputation {
        return MinReputation
    }
    return score
}`}
                        </pre>
                    </div>
                </div>
            </div>

            {/* Your Stats */}
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard title="Reputation Score" value={userStats.reputation} icon="🏆" color="purple" />
                <StatCard title="Total Uploads" value={userStats.uploads} icon="📤" color="green" />
                <StatCard title="Total Downloads" value={userStats.downloads} icon="📥" color="blue" />
                <StatCard title="Average Rating" value={`${userStats.averageRating}⭐`} icon="⭐" color="yellow" />
            </div>

            {/* Reputation Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Reputation Trend</h3>
                    <div className="space-y-3">
                        {reputationHistory.map((point, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <span className="text-sm text-gray-500 w-16">{point.week}</span>
                                <div className="flex-1">
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${(point.score / maxScore) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                <span className="text-sm font-medium w-12 text-right">{point.score}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🧮 Score Calculation</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Uploads × 2</span>
                            <span className="font-mono font-medium text-green-600">+{userStats.uploads * 2}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Downloads × -1</span>
                            <span className="font-mono font-medium text-red-600">-{userStats.downloads}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Rating × 10</span>
                            <span className="font-mono font-medium text-blue-600">+{Math.round(userStats.averageRating * 10)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 bg-gray-50 -mx-4 px-4 rounded-lg">
                            <span className="font-semibold text-gray-900">Total Score</span>
                            <span className="font-mono font-bold text-purple-600 text-xl">{userStats.reputation}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Network Stats */}
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Network Statistics</h2>
            <div className="card mb-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-gray-900">{networkStats.totalUsers}</p>
                        <p className="text-sm text-gray-500">Total Users</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">{networkStats.contributors}</p>
                        <p className="text-sm text-gray-500">Contributors</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-yellow-600">{networkStats.neutral}</p>
                        <p className="text-sm text-gray-500">Neutral</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-red-600">{networkStats.leechers}</p>
                        <p className="text-sm text-gray-500">Leechers</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-purple-600">{networkStats.averageScore.toFixed(1)}</p>
                        <p className="text-sm text-gray-500">Avg Score</p>
                    </div>
                </div>

                {/* Classification Distribution */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-3">User Distribution</p>
                    <div className="flex rounded-full overflow-hidden h-4">
                        <div
                            className="bg-green-500"
                            style={{ width: `${(networkStats.contributors / networkStats.totalUsers) * 100}%` }}
                            title={`Contributors: ${networkStats.contributors}`}
                        />
                        <div
                            className="bg-yellow-500"
                            style={{ width: `${(networkStats.neutral / networkStats.totalUsers) * 100}%` }}
                            title={`Neutral: ${networkStats.neutral}`}
                        />
                        <div
                            className="bg-red-500"
                            style={{ width: `${(networkStats.leechers / networkStats.totalUsers) * 100}%` }}
                            title={`Leechers: ${networkStats.leechers}`}
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>⭐ Contributors ({Math.round((networkStats.contributors / networkStats.totalUsers) * 100)}%)</span>
                        <span>🔶 Neutral ({Math.round((networkStats.neutral / networkStats.totalUsers) * 100)}%)</span>
                        <span>⚠️ Leechers ({Math.round((networkStats.leechers / networkStats.totalUsers) * 100)}%)</span>
                    </div>
                </div>
            </div>

            {/* Throttling Info */}
            <div className="card bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Download Speed Throttling</h3>
                <p className="text-gray-600 mb-4">
                    Your download speed is adjusted based on your classification to encourage fair contribution.
                </p>
                <div className="grid grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg text-center ${userStats.classification === 'Contributor' ? 'bg-green-100 ring-2 ring-green-500' : 'bg-white'}`}>
                        <p className="text-2xl font-bold text-green-600">100%</p>
                        <p className="text-sm text-gray-600">Contributor</p>
                    </div>
                    <div className={`p-4 rounded-lg text-center ${userStats.classification === 'Neutral' ? 'bg-yellow-100 ring-2 ring-yellow-500' : 'bg-white'}`}>
                        <p className="text-2xl font-bold text-yellow-600">70%</p>
                        <p className="text-sm text-gray-600">Neutral</p>
                    </div>
                    <div className={`p-4 rounded-lg text-center ${userStats.classification === 'Leecher' ? 'bg-red-100 ring-2 ring-red-500' : 'bg-white'}`}>
                        <p className="text-2xl font-bold text-red-600">30%</p>
                        <p className="text-sm text-gray-600">Leecher</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
