import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { cn, CHART_COLORS } from '@/utils/helpers';

interface PieChartData {
    name: string;
    value: number;
}

interface SkillPieChartProps {
    data: PieChartData[];
    className?: string;
}

export const SkillPieChart: React.FC<SkillPieChartProps> = ({
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
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Legend
                        formatter={(value) => (
                            <span style={{ color: 'hsl(var(--foreground))' }}>{value}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </motion.div>
    );
};

export default SkillPieChart;
