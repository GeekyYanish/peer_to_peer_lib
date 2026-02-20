'use client';

import { useState, useEffect } from 'react';
import ResourceCard from '@/components/ResourceCard';
import UploadModal from '@/components/UploadModal';
import RatingModal from '@/components/RatingModal';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { Resource } from '@/lib/types';
import * as api from '@/lib/api';

const subjects = ['All', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Electronics', 'Other'];

export default function LibraryPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubject, setSelectedSubject] = useState('All');
    const [sortBy, setSortBy] = useState('downloads');
    const [showUpload, setShowUpload] = useState(false);
    const [ratingTarget, setRatingTarget] = useState<Resource | null>(null);

    const loadResources = async () => {
        try {
            const data = await api.getAllResources();
            setResources(data.results?.map(r => r.resource) || []);
        } catch {
            setResources([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadResources(); }, []);

    const filteredResources = resources
        .filter(r => selectedSubject === 'All' || r.subject === selectedSubject)
        .sort((a, b) => {
            if (sortBy === 'downloads') return b.download_count - a.download_count;
            if (sortBy === 'rating') return b.average_rating - a.average_rating;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

    const handleUpload = async (data: { filename: string; title: string; description: string; subject: string; tags: string[]; size: number }) => {
        try {
            const users = await api.getUsers();
            const userId = users[0]?.id || 'demo';
            await api.createResource(data, userId);
            await loadResources();
        } catch { /* error handled in modal */ }
    };

    const handleDownload = async (resource: Resource) => {
        try {
            await api.downloadResource(resource.id, 'demo-user');
        } catch { /* continue */ }
        setRatingTarget(resource);
    };

    const handleRate = async (rating: number, comment: string) => {
        if (ratingTarget) {
            try { await api.rateResource(ratingTarget.id, rating, comment); }
            catch { /* still close */ }
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">📚 Resource Library</h1>
                <p className="text-gray-600 mt-2">Browse and download academic resources shared by peers.</p>
            </div>

            {/* Go Concept */}
            <div className="card mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                <div className="flex items-start gap-4">
                    <div className="concept-number shrink-0">3</div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Go Concept: Arrays & Slices</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Resources are stored in <code className="bg-white/50 px-1 rounded">[]*Resource</code> slices.
                            Filtering demonstrates <code className="bg-white/50 px-1 rounded">range</code> loops and slice operations.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <div className="flex flex-wrap gap-2">
                        {subjects.map(subject => (
                            <button key={subject} onClick={() => setSelectedSubject(subject)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedSubject === subject
                                    ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                {subject}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="downloads">Most Downloads</option>
                        <option value="rating">Highest Rated</option>
                        <option value="date">Most Recent</option>
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600">
                    Showing <span className="font-semibold">{filteredResources.length}</span> resources
                    {selectedSubject !== 'All' && ` in ${selectedSubject}`}
                </p>
                <button className="btn btn-primary" onClick={() => setShowUpload(true)}>📤 Upload Resource</button>
            </div>

            {/* Resources */}
            {loading ? (
                <LoadingSkeleton type="card" count={4} />
            ) : (
                <div className="space-y-4">
                    {filteredResources.map(resource => (
                        <ResourceCard key={resource.id} resource={resource} onDownload={() => handleDownload(resource)} />
                    ))}
                    {filteredResources.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-4xl mb-4">📭</p>
                            <p>No resources found for the selected filters.</p>
                        </div>
                    )}
                </div>
            )}

            <UploadModal isOpen={showUpload} onClose={() => setShowUpload(false)} onUpload={handleUpload} />
            <RatingModal isOpen={!!ratingTarget} resourceTitle={ratingTarget?.title || ''} onClose={() => setRatingTarget(null)} onRate={handleRate} />
        </div>
    );
}
