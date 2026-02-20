'use client';

interface LoadingSkeletonProps {
    type?: 'card' | 'stat' | 'table-row' | 'text';
    count?: number;
}

function SkeletonPulse({ className }: { className: string }) {
    return <div className={`skeleton-pulse ${className}`} />;
}

export default function LoadingSkeleton({ type = 'card', count = 1 }: LoadingSkeletonProps) {
    const items = Array.from({ length: count });

    if (type === 'stat') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((_, i) => (
                    <div key={i} className="stat-card">
                        <SkeletonPulse className="h-4 w-20 rounded mb-3" />
                        <SkeletonPulse className="h-8 w-16 rounded mb-2" />
                        <SkeletonPulse className="h-3 w-24 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'table-row') {
        return (
            <>
                {items.map((_, i) => (
                    <tr key={i}>
                        <td><SkeletonPulse className="h-4 w-8 rounded" /></td>
                        <td><SkeletonPulse className="h-4 w-32 rounded" /></td>
                        <td><SkeletonPulse className="h-4 w-20 rounded" /></td>
                        <td><SkeletonPulse className="h-4 w-12 rounded" /></td>
                    </tr>
                ))}
            </>
        );
    }

    return (
        <div className="space-y-4">
            {items.map((_, i) => (
                <div key={i} className="file-card">
                    <SkeletonPulse className="w-12 h-12 rounded-xl" />
                    <div className="flex-1 space-y-2">
                        <SkeletonPulse className="h-4 w-3/4 rounded" />
                        <SkeletonPulse className="h-3 w-1/2 rounded" />
                    </div>
                    <SkeletonPulse className="h-8 w-20 rounded-lg" />
                </div>
            ))}
        </div>
    );
}
