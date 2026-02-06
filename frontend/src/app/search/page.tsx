'use client';

import { useState } from 'react';
import ResourceCard from '@/components/ResourceCard';
import { Resource } from '@/lib/types';

// Demo search results
const allResources: Resource[] = [
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
        filename: 'networking_basics.pdf',
        extension: '.pdf',
        size: 2100000,
        type: 'pdf',
        title: 'Computer Networks Basics',
        description: 'TCP/IP and networking protocols',
        subject: 'Computer Science',
        tags: ['networking', 'tcp', 'protocols'],
        uploaded_by: 'charlie',
        available_on: ['peer1'],
        total_ratings: 5,
        average_rating: 3.8,
        created_at: '2024-01-08',
        updated_at: '2024-01-08',
        download_count: 18
    }
];

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Resource[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = () => {
        if (!query.trim()) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        const q = query.toLowerCase();
        const filtered = allResources.filter(r =>
            r.title.toLowerCase().includes(q) ||
            r.subject.toLowerCase().includes(q) ||
            r.tags.some(t => t.toLowerCase().includes(q)) ||
            r.description.toLowerCase().includes(q)
        );

        // Sort by relevance (title match > subject match > tag match)
        filtered.sort((a, b) => {
            const aTitle = a.title.toLowerCase().includes(q) ? 3 : 0;
            const bTitle = b.title.toLowerCase().includes(q) ? 3 : 0;
            const aSubject = a.subject.toLowerCase().includes(q) ? 2 : 0;
            const bSubject = b.subject.toLowerCase().includes(q) ? 2 : 0;
            return (bTitle + bSubject) - (aTitle + aSubject);
        });

        setResults(filtered);
        setHasSearched(true);
    };

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">🔍 Search Resources</h1>
                <p className="text-gray-600 mt-2">
                    Find academic resources across the peer-to-peer network.
                </p>
            </div>

            {/* Go Concept Highlight */}
            <div className="card mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <div className="flex items-start gap-4">
                    <div className="concept-number shrink-0">2</div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Go Concept: Looping & Control Flow</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            The search functionality uses <code className="bg-white/50 px-1 rounded">for...range</code> loops
                            and <code className="bg-white/50 px-1 rounded">if</code> conditions to filter matching resources.
                        </p>
                        <pre className="mt-2 text-xs bg-white/70 p-2 rounded font-mono">
                            {`func Search(query string) []*Resource {
    results := make([]*Resource, 0)
    for _, resource := range allResources {
        if strings.Contains(resource.Title, query) {
            results = append(results, resource)
        }
    }
    return results
}`}
                        </pre>
                    </div>
                </div>
            </div>

            {/* Search Box */}
            <div className="relative mb-8">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                    🔍
                </span>
                <input
                    type="text"
                    placeholder="Search for resources (e.g., 'golang', 'calculus', 'algorithms')..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="search-input"
                />
                <button
                    onClick={handleSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-primary py-2"
                >
                    Search
                </button>
            </div>

            {/* Quick Tags */}
            <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Popular tags:</p>
                <div className="flex flex-wrap gap-2">
                    {['golang', 'programming', 'algorithms', 'math', 'physics', 'database'].map(tag => (
                        <button
                            key={tag}
                            onClick={() => { setQuery(tag); handleSearch(); }}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                        >
                            #{tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            {hasSearched && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-gray-600">
                            Found <span className="font-semibold">{results.length}</span> results for &quot;{query}&quot;
                        </p>
                    </div>

                    {results.length > 0 ? (
                        <div className="space-y-4">
                            {results.map(resource => (
                                <ResourceCard
                                    key={resource.id}
                                    resource={resource}
                                    onDownload={() => alert(`Downloading ${resource.title}...`)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500 card">
                            <p className="text-4xl mb-4">🔍</p>
                            <p className="text-lg font-medium">No resources found</p>
                            <p className="text-sm mt-2">Try different keywords or browse the library</p>
                        </div>
                    )}
                </div>
            )}

            {!hasSearched && (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-6xl mb-4">📚</p>
                    <p className="text-lg">Enter a search term to find resources</p>
                    <p className="text-sm mt-2">Search by title, subject, or tags</p>
                </div>
            )}
        </div>
    );
}
