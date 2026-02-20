'use client';

import { useState, useEffect, useCallback } from 'react';
import ResourceCard from '@/components/ResourceCard';
import RatingModal from '@/components/RatingModal';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { Resource } from '@/lib/types';
import * as api from '@/lib/api';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Resource[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [ratingTarget, setRatingTarget] = useState<Resource | null>(null);

    const handleSearch = useCallback(async (q?: string) => {
        const searchQuery = q || query;
        if (!searchQuery.trim()) { setResults([]); setHasSearched(false); return; }
        setLoading(true);
        try {
            const data = await api.searchResources(searchQuery);
            setResults(data.results?.map(r => r.resource) || []);
        } catch {
            setResults([]);
        } finally {
            setHasSearched(true);
            setLoading(false);
        }
    }, [query]);

    // Auto-suggestions
    useEffect(() => {
        if (query.length < 2) { setSuggestions([]); return; }
        const timeout = setTimeout(async () => {
            try {
                const s = await api.getSearchSuggestions(query);
                setSuggestions(s || []);
            } catch { setSuggestions([]); }
        }, 300);
        return () => clearTimeout(timeout);
    }, [query]);

    const handleDownload = async (resource: Resource) => {
        try {
            await api.downloadResource(resource.id, 'demo-user');
            setRatingTarget(resource);
        } catch {
            alert('Download initiated for ' + resource.title);
            setRatingTarget(resource);
        }
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
                <h1 className="text-3xl font-bold text-gray-900">🔍 Search Resources</h1>
                <p className="text-gray-600 mt-2">Find academic resources across the peer-to-peer network.</p>
            </div>

            {/* Go Concept */}
            <div className="card mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <div className="flex items-start gap-4">
                    <div className="concept-number shrink-0">2</div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Go Concept: Looping & Control Flow</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Search uses <code className="bg-white/50 px-1 rounded">for...range</code> loops and
                            <code className="bg-white/50 px-1 rounded">if</code> conditions to filter resources.
                        </p>
                    </div>
                </div>
            </div>

            {/* Search Box */}
            <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
                <input
                    type="text"
                    placeholder="Search for resources (e.g., 'golang', 'calculus', 'algorithms')..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="search-input"
                />
                <button onClick={() => handleSearch()} className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-primary py-2">
                    Search
                </button>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && !hasSearched && (
                <div className="mb-4 flex flex-wrap gap-2">
                    {suggestions.map(s => (
                        <button key={s} onClick={() => { setQuery(s); handleSearch(s); }}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors">
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {/* Quick Tags */}
            <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Popular tags:</p>
                <div className="flex flex-wrap gap-2">
                    {['golang', 'programming', 'algorithms', 'math', 'physics', 'database', 'ml'].map(tag => (
                        <button key={tag} onClick={() => { setQuery(tag); handleSearch(tag); }}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
                            #{tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            {loading && <LoadingSkeleton type="card" count={3} />}

            {hasSearched && !loading && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-gray-600">
                            Found <span className="font-semibold">{results.length}</span> results for &quot;{query}&quot;
                        </p>
                    </div>
                    {results.length > 0 ? (
                        <div className="space-y-4">
                            {results.map(resource => (
                                <ResourceCard key={resource.id} resource={resource} onDownload={() => handleDownload(resource)} />
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

            {!hasSearched && !loading && (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-6xl mb-4">📚</p>
                    <p className="text-lg">Enter a search term to find resources</p>
                </div>
            )}

            <RatingModal
                isOpen={!!ratingTarget}
                resourceTitle={ratingTarget?.title || ''}
                onClose={() => setRatingTarget(null)}
                onRate={handleRate}
            />
        </div>
    );
}
