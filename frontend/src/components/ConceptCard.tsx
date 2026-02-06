'use client';

import { GoConcept } from '@/lib/types';

interface ConceptCardProps {
    concept: GoConcept;
    isActive?: boolean;
    onClick?: () => void;
}

export default function ConceptCard({ concept, isActive = false, onClick }: ConceptCardProps) {
    return (
        <div
            className={`concept-card cursor-pointer ${isActive ? 'active' : ''}`}
            onClick={onClick}
            id={`concept-${concept.id}`}
        >
            <div className="flex items-start gap-4">
                <div className="concept-number shrink-0">
                    {concept.id}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{concept.icon}</span>
                        <h3 className="font-semibold text-gray-900 text-lg">{concept.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{concept.description}</p>

                    {isActive && (
                        <div className="mt-4 animate-fade-in">
                            {/* Code Example */}
                            <div className="code-block mb-4">
                                <pre><code>{concept.codeExample}</code></pre>
                            </div>

                            {/* Explanation */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <p className="text-blue-800 text-sm">
                                    <span className="font-semibold">💡 Key Insight:</span> {concept.explanation}
                                </p>
                            </div>

                            {/* File Locations */}
                            <div className="flex flex-wrap gap-2">
                                <span className="text-xs text-gray-500">Found in:</span>
                                {concept.fileLocations.map((file, idx) => (
                                    <span
                                        key={idx}
                                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md font-mono"
                                    >
                                        {file}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
