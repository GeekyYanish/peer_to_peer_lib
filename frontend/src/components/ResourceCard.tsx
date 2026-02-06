'use client';

import { Resource } from '@/lib/types';

interface ResourceCardProps {
    resource: Resource;
    onDownload?: () => void;
}

const typeIcons: Record<string, string> = {
    'pdf': '📄',
    'document': '📝',
    'presentation': '📊',
    'spreadsheet': '📈',
    'other': '📁'
};

const typeColors: Record<string, string> = {
    'pdf': 'bg-red-100 text-red-600',
    'document': 'bg-blue-100 text-blue-600',
    'presentation': 'bg-orange-100 text-orange-600',
    'spreadsheet': 'bg-green-100 text-green-600',
    'other': 'bg-gray-100 text-gray-600'
};

export default function ResourceCard({ resource, onDownload }: ResourceCardProps) {
    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="file-card">
            {/* File Icon */}
            <div className={`file-icon ${typeColors[resource.type] || typeColors.other}`}>
                <span className="text-2xl">{typeIcons[resource.type] || '📁'}</span>
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{resource.title || resource.filename}</h3>
                <p className="text-sm text-gray-500 mt-1">{resource.subject} • {formatSize(resource.size)}</p>

                {/* Tags */}
                {resource.tags && resource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {resource.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                {tag}
                            </span>
                        ))}
                        {resource.tags.length > 3 && (
                            <span className="text-xs text-gray-400">+{resource.tags.length - 3} more</span>
                        )}
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="text-right shrink-0">
                <div className="flex items-center gap-1 justify-end">
                    {renderStars(resource.average_rating)}
                    <span className="text-sm text-gray-500 ml-1">
                        ({resource.total_ratings})
                    </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                    ⬇️ {resource.download_count} downloads
                </p>
                {onDownload && (
                    <button
                        onClick={onDownload}
                        className="btn btn-primary mt-2 text-sm py-1.5 px-3"
                    >
                        Download
                    </button>
                )}
            </div>
        </div>
    );
}
