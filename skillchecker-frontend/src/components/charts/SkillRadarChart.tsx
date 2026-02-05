import React from 'react';
import { motion } from 'framer-motion';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from 'recharts';
import { cn } from '@/utils/helpers';

interface RadarChartData {
    skill: string;
    value: number;
    fullMark: number;
}

interface SkillRadarChartProps {
    data: RadarChartData[];
    className?: string;
}

export const SkillRadarChart: React.FC<SkillRadarChartProps> = ({
    data,
    className,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={cn('w-full h-[300px]', className)}
        >
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis
                        dataKey="skill"
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    />
                    <Radar
                        name="Skills"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                        strokeWidth={2}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </motion.div>
    );
};

export default SkillRadarChart;
