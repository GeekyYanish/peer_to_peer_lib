'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StatCard from '@/components/StatCard';
import ReputationBadge from '@/components/ReputationBadge';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { GO_CONCEPTS, User, Resource, NetworkStats } from '@/lib/types';
import * as api from '@/lib/api';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [recentResources, setRecentResources] = useState<Resource[]>([]);
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [users, recent, stats] = await Promise.all([
          api.getUsers(),
          api.getRecentResources(5),
          api.getNetworkStats(),
        ]);
        // Use first user (alice) as the current user
        setUser(users[0] || null);
        setRecentResources(recent || []);
        setNetworkStats(stats);
      } catch {
        // Fallback to demo data if API unavailable
        setUser({
          id: 'demo', username: 'alice', email: 'alice@university.edu',
          reputation: 95, classification: 'Contributor',
          total_uploads: 25, total_downloads: 15, average_rating: 4.5,
          created_at: '', last_active_at: '', peer_id: '', status: 'online'
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8"><div className="skeleton-pulse h-8 w-64 rounded" /></div>
        <LoadingSkeleton type="stat" count={4} />
      </div>
    );
  }

  if (!user) return null;

  const repScore = Number(user.reputation);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.username}! 👋</h1>
        <p className="text-gray-600 mt-2">Track your contributions and explore the P2P network</p>
      </div>

      {/* User Status Card */}
      <div className="card mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <ReputationBadge
              classification={user.classification}
              score={repScore}
              size="lg"
            />
            <p className="text-gray-600 mt-3">
              {user.classification === 'Contributor'
                ? 'Keep contributing to maintain your Contributor status!'
                : user.classification === 'Leecher'
                  ? 'Upload more resources to improve your status!'
                  : 'Share resources and receive good ratings to level up!'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Reputation Formula:</p>
            <p className="font-mono text-sm bg-white/70 px-3 py-2 rounded-lg mt-1">
              (Uploads × 2) - Downloads + (Rating × 10)
            </p>
            <p className="font-mono text-sm text-blue-600 mt-1">
              ({user.total_uploads} × 2) - {user.total_downloads} + ({user.average_rating.toFixed(1)} × 10) = {repScore}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger">
        <StatCard title="Total Uploads" value={user.total_uploads} icon="📤" color="green" trend={{ value: 12, isPositive: true }} />
        <StatCard title="Total Downloads" value={user.total_downloads} icon="📥" color="blue" />
        <StatCard title="Average Rating" value={user.average_rating.toFixed(1) + ' ⭐'} icon="⭐" color="yellow" />
        <StatCard title="Reputation Score" value={repScore} icon="🏆" color="purple" trend={{ value: 8, isPositive: true }} />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Go Concepts */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">🎓 Go Concepts</h2>
            <Link href="/learn" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All →</Link>
          </div>
          <div className="space-y-3">
            {GO_CONCEPTS.slice(0, 4).map((concept) => (
              <Link key={concept.id} href={`/learn#concept-${concept.id}`}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="concept-number shrink-0">{concept.id}</div>
                <div>
                  <p className="font-medium text-gray-900">{concept.icon} {concept.title}</p>
                  <p className="text-sm text-gray-500">{concept.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center">+ {GO_CONCEPTS.length - 4} more concepts</p>
          </div>
        </div>

        {/* Recent Resources */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">📋 Recent Resources</h2>
            <Link href="/library" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All →</Link>
          </div>
          <div className="space-y-4">
            {recentResources.slice(0, 5).map((resource, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">📄</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{resource.title || resource.filename}</p>
                  <p className="text-sm text-gray-500">{resource.subject} • ⬇️ {resource.download_count}</p>
                </div>
                <div className="text-sm text-yellow-500">
                  {'★'.repeat(Math.round(resource.average_rating))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Network Stats Bar */}
      {networkStats && (
        <div className="mt-8 card bg-gradient-to-r from-slate-50 to-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🌐 Network Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{networkStats.total_users}</p>
              <p className="text-xs text-gray-500">Total Users</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{networkStats.contributors}</p>
              <p className="text-xs text-gray-500">Contributors</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{networkStats.neutral}</p>
              <p className="text-xs text-gray-500">Neutral</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{networkStats.leechers}</p>
              <p className="text-xs text-gray-500">Leechers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{networkStats.average_score.toFixed(0)}</p>
              <p className="text-xs text-gray-500">Avg Score</p>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-8 card bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Ready to Learn Go?</h3>
            <p className="text-blue-100">Explore all 8 Go programming concepts implemented in this P2P Library project.</p>
          </div>
          <Link href="/learn" className="btn bg-white text-blue-600 hover:bg-blue-50">Start Learning →</Link>
        </div>
      </div>
    </div>
  );
}
