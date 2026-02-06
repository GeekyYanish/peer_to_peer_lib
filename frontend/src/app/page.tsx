'use client';

import Link from 'next/link';
import StatCard from '@/components/StatCard';
import ReputationBadge from '@/components/ReputationBadge';
import { GO_CONCEPTS } from '@/lib/types';

// Demo data
const currentUser = {
  username: 'alice',
  reputation: 95,
  classification: 'Contributor' as const,
  total_uploads: 25,
  total_downloads: 15,
  average_rating: 4.5
};

const recentActivity = [
  { type: 'upload', title: 'Go Programming Fundamentals', time: '2 hours ago' },
  { type: 'download', title: 'Data Structures and Algorithms', time: '5 hours ago' },
  { type: 'rating', title: 'Received 5★ on Calculus Notes', time: '1 day ago' },
  { type: 'upload', title: 'Database Design Principles', time: '2 days ago' },
];

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {currentUser.username}! 👋</h1>
        <p className="text-gray-600 mt-2">Track your contributions and explore Go programming concepts</p>
      </div>

      {/* User Status Card */}
      <div className="card mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <ReputationBadge
              classification={currentUser.classification}
              score={currentUser.reputation}
              size="lg"
            />
            <p className="text-gray-600 mt-3">
              Keep contributing to maintain your Contributor status!
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Reputation Formula:</p>
            <p className="font-mono text-sm bg-white/70 px-3 py-2 rounded-lg mt-1">
              (Uploads × 2) - Downloads + (Rating × 10)
            </p>
            <p className="font-mono text-sm text-blue-600 mt-1">
              ({currentUser.total_uploads} × 2) - {currentUser.total_downloads} + ({currentUser.average_rating.toFixed(1)} × 10) = {currentUser.reputation}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger">
        <StatCard
          title="Total Uploads"
          value={currentUser.total_uploads}
          icon="📤"
          color="green"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Downloads"
          value={currentUser.total_downloads}
          icon="📥"
          color="blue"
        />
        <StatCard
          title="Average Rating"
          value={currentUser.average_rating.toFixed(1) + ' ⭐'}
          icon="⭐"
          color="yellow"
        />
        <StatCard
          title="Reputation Score"
          value={currentUser.reputation}
          icon="🏆"
          color="purple"
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Go Concepts Quick Overview */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">🎓 Go Concepts in This Project</h2>
            <Link href="/learn" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {GO_CONCEPTS.slice(0, 4).map((concept) => (
              <Link
                key={concept.id}
                href={`/learn#concept-${concept.id}`}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="concept-number shrink-0">{concept.id}</div>
                <div>
                  <p className="font-medium text-gray-900">{concept.icon} {concept.title}</p>
                  <p className="text-sm text-gray-500">{concept.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              + {GO_CONCEPTS.length - 4} more concepts to explore
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">📋 Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'upload' ? 'bg-green-100 text-green-600' :
                    activity.type === 'download' ? 'bg-blue-100 text-blue-600' :
                      'bg-yellow-100 text-yellow-600'
                  }`}>
                  {activity.type === 'upload' ? '📤' :
                    activity.type === 'download' ? '📥' : '⭐'}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-8 card bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Ready to Learn Go?</h3>
            <p className="text-blue-100">
              Explore all 8 Go programming concepts implemented in this P2P Library project.
            </p>
          </div>
          <Link
            href="/learn"
            className="btn bg-white text-blue-600 hover:bg-blue-50"
          >
            Start Learning →
          </Link>
        </div>
      </div>
    </div>
  );
}
