import React from 'react';
import { cn } from '@/utils/helpers';

interface LoadingSkeletonProps {
    className?: string;
    variant?: 'card' | 'text' | 'avatar' | 'chart';
    count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
    className,
    variant = 'text',
    count = 1,
}) => {
    const renderSkeleton = () => {
        switch (variant) {
            case 'card':
                return (
                    <div className="rounded-xl border bg-card p-6 space-y-4">
                        <div className="skeleton h-4 w-1/3 rounded" />
                        <div className="skeleton h-8 w-2/3 rounded" />
                        <div className="skeleton h-4 w-full rounded" />
                        <div className="skeleton h-4 w-4/5 rounded" />
                    </div>
                );
            case 'avatar':
                return <div className="skeleton h-10 w-10 rounded-full" />;
            case 'chart':
                return (
                    <div className="rounded-xl border bg-card p-6">
                        <div className="skeleton h-4 w-1/4 rounded mb-4" />
                        <div className="skeleton h-48 w-full rounded" />
                    </div>
                );
            default:
                return <div className="skeleton h-4 w-full rounded" />;
        }
    };

    return (
        <div className={cn('space-y-3', className)}>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="animate-pulse">
                    {renderSkeleton()}
                </div>
            ))}
        </div>
    );
};

export const DashboardSkeleton: React.FC = () => (
    <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border bg-card p-6 animate-pulse">
                    <div className="flex items-center justify-between">
                        <div className="skeleton h-10 w-10 rounded-lg" />
                        <div className="skeleton h-4 w-16 rounded" />
                    </div>
                    <div className="mt-4 space-y-2">
                        <div className="skeleton h-8 w-24 rounded" />
                        <div className="skeleton h-4 w-32 rounded" />
                    </div>
                </div>
            ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LoadingSkeleton variant="chart" />
            <LoadingSkeleton variant="chart" />
        </div>

        {/* Table */}
        <div className="rounded-xl border bg-card p-6 animate-pulse">
            <div className="skeleton h-6 w-1/4 rounded mb-6" />
            <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <div className="skeleton h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <div className="skeleton h-4 w-1/3 rounded" />
                            <div className="skeleton h-3 w-1/4 rounded" />
                        </div>
                        <div className="skeleton h-8 w-20 rounded" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default LoadingSkeleton;
