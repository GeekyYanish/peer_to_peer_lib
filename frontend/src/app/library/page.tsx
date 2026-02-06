'use client';

import { useState } from 'react';
import ResourceCard from '@/components/ResourceCard';
import { Resource } from '@/lib/types';

// Demo resources
const demoResources: Resource[] = [
    {
        id: 'res-001',
        filename: 'golang_tutorial.pdf',
        extension: '.pdf',
        size: 2500000,
        type: 'pdf',
        title: 'Go Programming Fundamentals',
        description: 'Complete guide to Go programming',
        subject: 'Computer Science',
        tags: ['golang', 'programming', 'tutorial'],
        uploaded_by: 'alice',
        available_on: ['peer1', 'peer2', 'peer3'],
        total_ratings: 15,
        average_rating: 4.7,
        created_at: '2024-01-15',
        updated_at: '2024-01-15',
        download_count: 45
    },
    {
        id: 'res-002',
        filename: 'data_structures.pdf',
        extension: '.pdf',
        size: 3200000,
        type: 'pdf',
        title: 'Data Structures and Algorithms',
        description: 'DSA comprehensive notes',
        subject: 'Computer Science',
        tags: ['algorithms', 'dsa', 'programming'],
        uploaded_by: 'alice',
        available_on: ['peer1', 'peer2'],
        total_ratings: 22,
        average_rating: 4.9,
        created_at: '2024-01-10',
        updated_at: '2024-01-10',
        download_count: 78
    },
    {
        id: 'res-003',
        filename: 'calculus_notes.pdf',
        extension: '.pdf',
        size: 1800000,
        type: 'pdf',
        title: 'Calculus Complete Notes',
        description: 'Full calculus course notes',
        subject: 'Mathematics',
        tags: ['calculus', 'math', 'notes'],
        uploaded_by: 'bob',
        available_on: ['peer2', 'peer3'],
        total_ratings: 8,
        average_rating: 4.2,
        created_at: '2024-01-12',
        updated_at: '2024-01-12',
        download_count: 32
    },
    {
        id: 'res-004',
        filename: 'physics_mechanics.pdf',
        extension: '.pdf',
        size: 4100000,
        type: 'pdf',
        title: 'Classical Mechanics',
        description: 'Physics fundamentals',
        subject: 'Physics',
        tags: ['physics', 'mechanics'],
        uploaded_by: 'alice',
        available_on: ['peer1'],
        total_ratings: 12,
        average_rating: 4.5,
        created_at: '2024-01-08',
        updated_at: '2024-01-08',
        download_count: 28
    },
    {
        id: 'res-005',
        filename: 'database_design.pdf',
        extension: '.pdf',
        size: 2800000,
        type: 'pdf',
        title: 'Database Design Principles',
        description: 'SQL and database design',
        subject: 'Computer Science',
        tags: ['database', 'sql', 'design'],
        uploaded_by: 'bob',
        available_on: ['peer1', 'peer2', 'peer3'],
        total_ratings: 18,
        average_rating: 4.6,
        created_at: '2024-01-05',
        updated_at: '2024-01-05',
        download_count: 56
    }
];

const subjects = ['All', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry'];

export default function LibraryPage() {
    const [selectedSubject, setSelectedSubject] = useState('All');
    const [sortBy, setSortBy] = useState('downloads');

    const filteredResources = demoResources
        .filter(r => selectedSubject === 'All' || r.subject === selectedSubject)
        .sort((a, b) => {
            if (sortBy === 'downloads') return b.download_count - a.download_count;
            if (sortBy === 'rating') return b.average_rating - a.average_rating;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">📚 Resource Library</h1>
                <p className="text-gray-600 mt-2">
                    Browse and download academic resources shared by peers in the network.
                </p>
            </div>

            {/* Go Concept Highlight */}
            <div className="card mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                <div className="flex items-start gap-4">
                    <div className="concept-number shrink-0">3</div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Go Concept: Arrays & Slices</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            This page displays resources stored in a <code className="bg-white/50 px-1 rounded">[]Resource</code> slice.
                            The filtering below demonstrates <code className="bg-white/50 px-1 rounded">range</code> loops and slice operations.
                        </p>
                        <pre className="mt-2 text-xs bg-white/70 p-2 rounded font-mono">
                            {`for _, resource := range resources {
    if resource.Subject == selectedSubject {
        filtered = append(filtered, resource)
    }
}`}
                        </pre>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <div className="flex flex-wrap gap-2">
                        {subjects.map(subject => (
                            <button
                                key={subject}
                                onClick={() => setSelectedSubject(subject)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedSubject === subject
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {subject}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    >
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
                <button className="btn btn-primary">
                    📤 Upload Resource
                </button>
            </div>

            {/* Resources List */}
            <div className="space-y-4">
                {filteredResources.map(resource => (
                    <ResourceCard
                        key={resource.id}
                        resource={resource}
                        onDownload={() => alert(`Downloading ${resource.title}...`)}
                    />
                ))}
            </div>

            {filteredResources.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-4xl mb-4">📭</p>
                    <p>No resources found for the selected filters.</p>
                </div>
            )}
        </div>
    );
}
