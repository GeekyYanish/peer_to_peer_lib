'use client';

import { useState, useEffect } from 'react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import * as api from '@/lib/api';

interface Peer {
    id: string;
    user_id: string;
    username: string;
    status: string;
    reputation: number;
    classification: string;
    shared_resources: number;
    ip_address: string;
}

const nodeColors: Record<string, string> = {
    'Contributor': 'bg-gradient-to-br from-green-400 to-emerald-600 text-white',
    'Neutral': 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white',
    'Leecher': 'bg-gradient-to-br from-red-400 to-rose-600 text-white',
};

export default function PeersPage() {
    const [peers, setPeers] = useState<Peer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const data = await api.getPeers();
                setPeers(data || []);
            } catch { setPeers([]); }
            finally { setLoading(false); }
        }
        loadData();
    }, []);

    const onlinePeers = peers.filter(p => p.status === 'online');
    const offlinePeers = peers.filter(p => p.status !== 'online');

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
                <h1 className="text-3xl font-bold text-gray-900">🌐 Peer Network</h1>
                <p className="text-gray-600 mt-2">View connected peers in the P2P network.</p>
            </div>

            {/* Go Concept */}
            <div className="card mb-6 bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
                <div className="flex items-start gap-4">
                    <div className="concept-number shrink-0">7</div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Go Concept: Pointers & Call by Reference</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Peers are managed via <code className="bg-white/50 px-1 rounded">*Peer</code> pointers, enabling shared state updates across the network.
                        </p>
                    </div>
                </div>
            </div>

            {/* Network Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="stat-card">
                    <p className="text-sm text-gray-500">Total Peers</p>
                    <p className="text-3xl font-bold text-gray-900">{peers.length}</p>
                </div>
                <div className="stat-card">
                    <p className="text-sm text-gray-500">Online</p>
                    <p className="text-3xl font-bold text-green-600">{onlinePeers.length}</p>
                </div>
                <div className="stat-card">
                    <p className="text-sm text-gray-500">Offline</p>
                    <p className="text-3xl font-bold text-gray-400">{offlinePeers.length}</p>
                </div>
            </div>

            {/* Visual Network Map */}
            <div className="card mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Network Topology</h2>
                <div className="flex flex-wrap justify-center gap-8 py-8 relative">
                    {/* Center hub */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs border-4 border-white shadow-xl z-10">
                        HUB
                    </div>
                    {peers.map((peer, idx) => {
                        const angle = (idx / peers.length) * 2 * Math.PI - Math.PI / 2;
                        const radius = 140;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;
                        return (
                            <div key={peer.id} className="relative" style={{
                                position: 'absolute',
                                left: `calc(50% + ${x}px - 40px)`,
                                top: `calc(50% + ${y}px - 40px)`,
                            }}>
                                <div className={`peer-node ${nodeColors[peer.classification] || nodeColors['Neutral']}`}
                                    title={`${peer.username} - ${peer.classification} (${peer.reputation})`}>
                                    {peer.username.charAt(0).toUpperCase()}
                                    <div className={`status-dot ${peer.status === 'online' ? 'online' : 'offline'} absolute -top-1 -right-1`} />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div style={{ height: `${300}px` }} />
            </div>

            {/* Peer List */}
            <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Connected Peers</h2>
                <div className="space-y-3">
                    {peers.map(peer => (
                        <div key={peer.id} className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${peer.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}>
                                {peer.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-gray-900">{peer.username}</h3>
                                    <span className={`status-dot ${peer.status === 'online' ? 'online' : 'offline'}`} />
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${peer.classification === 'Contributor'
                                        ? 'bg-green-100 text-green-700'
                                        : peer.classification === 'Leecher'
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {peer.classification}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Peer ID: {peer.id} • IP: {peer.ip_address}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-gray-900">{peer.reputation}</p>
                                <p className="text-sm text-gray-500">📤 {peer.shared_resources} shared</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
