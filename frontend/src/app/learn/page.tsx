'use client';

import { useState } from 'react';
import ConceptCard from '@/components/ConceptCard';
import { GO_CONCEPTS } from '@/lib/types';

export default function LearnPage() {
    const [activeConcept, setActiveConcept] = useState<number | null>(1);

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">📖 Learn Go Programming</h1>
                <p className="text-gray-600 mt-2">
                    Explore all 8 Go programming concepts implemented in this P2P Academic Library project.
                    Click on any concept to see the code examples and explanations.
                </p>
            </div>

            {/* Learning Path Overview */}
            <div className="card mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">🎯 Learning Path Overview</h2>
                <div className="flex items-center justify-between overflow-x-auto pb-2">
                    {GO_CONCEPTS.map((concept, idx) => (
                        <div key={concept.id} className="flex items-center">
                            <button
                                onClick={() => setActiveConcept(concept.id)}
                                className={`flex flex-col items-center min-w-max px-4 py-2 rounded-lg transition-all ${activeConcept === concept.id
                                        ? 'bg-indigo-600 text-white'
                                        : 'hover:bg-indigo-100'
                                    }`}
                            >
                                <span className="text-2xl mb-1">{concept.icon}</span>
                                <span className="text-xs font-medium">Concept {concept.id}</span>
                            </button>
                            {idx < GO_CONCEPTS.length - 1 && (
                                <div className="w-8 h-0.5 bg-indigo-200 mx-1" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Concept Cards */}
            <div className="space-y-4 stagger">
                {GO_CONCEPTS.map((concept) => (
                    <ConceptCard
                        key={concept.id}
                        concept={concept}
                        isActive={activeConcept === concept.id}
                        onClick={() => setActiveConcept(activeConcept === concept.id ? null : concept.id)}
                    />
                ))}
            </div>

            {/* Summary Card */}
            <div className="mt-8 card bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">✅ Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white/50 rounded-lg">
                        <p className="text-3xl font-bold text-green-600">8</p>
                        <p className="text-sm text-gray-600">Go Concepts</p>
                    </div>
                    <div className="text-center p-4 bg-white/50 rounded-lg">
                        <p className="text-3xl font-bold text-green-600">15+</p>
                        <p className="text-sm text-gray-600">Go Files</p>
                    </div>
                    <div className="text-center p-4 bg-white/50 rounded-lg">
                        <p className="text-3xl font-bold text-green-600">3</p>
                        <p className="text-sm text-gray-600">Test Suites</p>
                    </div>
                    <div className="text-center p-4 bg-white/50 rounded-lg">
                        <p className="text-3xl font-bold text-green-600">Full</p>
                        <p className="text-sm text-gray-600">Documentation</p>
                    </div>
                </div>
            </div>

            {/* Project Structure */}
            <div className="mt-8 card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">📁 Project Structure</h2>
                <div className="code-block">
                    <pre><code>{`p2p-library/
├── main.go              # Entry point
├── go.mod               # Module definition
│
├── models/              # Go Concept 1, 3, 4
│   ├── types.go         # Type definitions & constants
│   ├── user.go          # User struct
│   ├── resource.go      # Resource struct with slices
│   ├── peer.go          # Peer management
│   └── rating.go        # Rating model
│
├── errors/              # Go Concept 5
│   └── errors.go        # Custom error types
│
├── interfaces/          # Go Concept 6
│   ├── storage.go       # Storage interface
│   └── reputation.go    # Service interfaces
│
├── store/               # Go Concept 4, 6, 7
│   └── memory.go        # Map-based storage
│
├── services/            # Go Concept 2, 5, 7
│   ├── user_service.go          # Pointer demos
│   ├── library_service.go       # Loops & slices
│   ├── reputation_service.go    # Control flow
│   ├── search_service.go        # Filtering
│   └── *_test.go                # Unit tests
│
├── handlers/            # Go Concept 8
│   └── api_handler.go   # JSON marshal/unmarshal
│
└── frontend/            # Next.js UI
    └── ...`}</code></pre>
                </div>
            </div>
        </div>
    );
}
