import React from 'react';
import { motion } from 'framer-motion';
import { cn, getProgressColor } from '@/utils/helpers';

interface ProgressData {
    name: string;
    value: number;
    max: number;
    color?: string;
}

interface ProgressBarsProps {
    data: ProgressData[];
    className?: string;
    showPercentage?: boolean;
}

export const ProgressBars: React.FC<ProgressBarsProps> = ({
    data,
    className,
    showPercentage = true,
}) => {
    return (
        <div className={cn('space-y-4', className)}>
            {data.map((item, index) => {
                const percentage = Math.round((item.value / item.max) * 100);
                return (
                    <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="space-y-2"
                    >
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{item.name}</span>
                            {showPercentage && (
                                <span className="text-muted-foreground">{percentage}%</span>
                            )}
                        </div>
                        <div className="h-2 rounded-full bg-secondary overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                                className={cn(
                                    'h-full rounded-full',
                                    item.color || getProgressColor(percentage)
                                )}
                            />
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default ProgressBars;
