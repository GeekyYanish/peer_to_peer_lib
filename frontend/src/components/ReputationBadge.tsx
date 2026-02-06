'use client';

import { UserClassification } from '@/lib/types';

interface ReputationBadgeProps {
    classification: UserClassification;
    score: number;
    showScore?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export default function ReputationBadge({
    classification,
    score,
    showScore = true,
    size = 'md'
}: ReputationBadgeProps) {
    const getBadgeClass = () => {
        switch (classification) {
            case 'Contributor':
                return 'badge-contributor';
            case 'Neutral':
                return 'badge-neutral';
            case 'Leecher':
                return 'badge-leecher';
            default:
                return 'badge-neutral';
        }
    };

    const getIcon = () => {
        switch (classification) {
            case 'Contributor':
                return '⭐';
            case 'Neutral':
                return '🔶';
            case 'Leecher':
                return '⚠️';
            default:
                return '🔶';
        }
    };

    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base'
    };

    return (
        <div className={`inline-flex items-center gap-2 rounded-full font-medium ${getBadgeClass()} ${sizeClasses[size]}`}>
            <span>{getIcon()}</span>
            <span>{classification}</span>
            {showScore && (
                <span className="opacity-70">({score})</span>
            )}
        </div>
    );
}
