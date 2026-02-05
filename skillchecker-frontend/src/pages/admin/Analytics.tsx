import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    TrendingUp,
    Users,
    Award,
    Download,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SkillPieChart } from '@/components/charts/SkillPieChart';
import { adminApi } from '@/services/api';
import { CHART_COLORS } from '@/utils/helpers';

export const Analytics: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [skillData, setSkillData] = useState<{ name: string; avg: number; students: number }[]>([]);
    const [trendData, setTrendData] = useState<{ month: string; score: number }[]>([]);
    const [distributionData, setDistributionData] = useState<{ name: string; value: number }[]>([]);

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            const response = await adminApi.getSkillSummary();
            // Process data from API
            console.log(response.data);
        } catch (error) {
            // Mock data for demo
            setSkillData([
                { name: 'JavaScript', avg: 78, students: 45 },
                { name: 'React', avg: 72, students: 38 },
                { name: 'TypeScript', avg: 68, students: 32 },
                { name: 'Node.js', avg: 65, students: 28 },
                { name: 'Python', avg: 70, students: 35 },
                { name: 'SQL', avg: 75, students: 40 },
            ]);

            setTrendData([
                { month: 'Sep', score: 65 },
                { month: 'Oct', score: 68 },
                { month: 'Nov', score: 71 },
                { month: 'Dec', score: 70 },
                { month: 'Jan', score: 74 },
                { month: 'Feb', score: 78 },
            ]);

            setDistributionData([
                { name: 'Expert (80-100)', value: 25 },
                { name: 'Proficient (60-79)', value: 45 },
                { name: 'Developing (40-59)', value: 20 },
                { name: 'Beginner (0-39)', value: 10 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const heatmapData = [
        { skill: 'JavaScript', beginner: 5, developing: 10, proficient: 20, expert: 10 },
        { skill: 'React', beginner: 8, developing: 12, proficient: 12, expert: 6 },
        { skill: 'TypeScript', beginner: 10, developing: 10, proficient: 8, expert: 4 },
        { skill: 'Node.js', beginner: 12, developing: 8, proficient: 6, expert: 2 },
        { skill: 'Python', beginner: 8, developing: 12, proficient: 10, expert: 5 },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
                    <p className="text-muted-foreground">
                        Insights into student performance and skill trends
                    </p>
                </div>
                <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Students', value: '156', icon: Users, trend: '+12%' },
                    { label: 'Avg Score', value: '72%', icon: TrendingUp, trend: '+5%' },
                    { label: 'Active Skills', value: '24', icon: Award, trend: '+3' },
                    { label: 'Evaluations', value: '342', icon: BarChart3, trend: '+28%' },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <stat.icon className="w-8 h-8 text-primary" />
                                    <span className="text-xs text-green-500 font-medium">
                                        {stat.trend}
                                    </span>
                                </div>
                                <div className="mt-3">
                                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="trends">Trends</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Skill Performance Bar Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Skill Performance</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={skillData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                                <XAxis
                                                    dataKey="name"
                                                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                                />
                                                <YAxis
                                                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: 'hsl(var(--card))',
                                                        border: '1px solid hsl(var(--border))',
                                                        borderRadius: '8px',
                                                    }}
                                                />
                                                <Bar
                                                    dataKey="avg"
                                                    fill="url(#colorGradient)"
                                                    radius={[4, 4, 0, 0]}
                                                />
                                                <defs>
                                                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#6366f1" />
                                                        <stop offset="100%" stopColor="#8b5cf6" />
                                                    </linearGradient>
                                                </defs>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Competency Distribution */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Competency Distribution</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <SkillPieChart data={distributionData} />
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </TabsContent>

                <TabsContent value="skills" className="space-y-6">
                    {/* Heatmap */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Competency Heatmap</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr>
                                                <th className="text-left py-3 px-4 font-medium">Skill</th>
                                                <th className="text-center py-3 px-4 font-medium">Beginner</th>
                                                <th className="text-center py-3 px-4 font-medium">Developing</th>
                                                <th className="text-center py-3 px-4 font-medium">Proficient</th>
                                                <th className="text-center py-3 px-4 font-medium">Expert</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {heatmapData.map((row) => (
                                                <tr key={row.skill} className="border-t">
                                                    <td className="py-3 px-4 font-medium">{row.skill}</td>
                                                    {['beginner', 'developing', 'proficient', 'expert'].map(
                                                        (level, idx) => {
                                                            const value = row[level as keyof typeof row] as number;
                                                            const maxValue = 20;
                                                            const intensity = Math.min(value / maxValue, 1);
                                                            return (
                                                                <td key={level} className="text-center py-3 px-4">
                                                                    <div
                                                                        className="mx-auto w-12 h-12 rounded-lg flex items-center justify-center text-white font-medium"
                                                                        style={{
                                                                            backgroundColor: `rgba(${idx === 0
                                                                                    ? '239, 68, 68'
                                                                                    : idx === 1
                                                                                        ? '234, 179, 8'
                                                                                        : idx === 2
                                                                                            ? '59, 130, 246'
                                                                                            : '34, 197, 94'
                                                                                }, ${0.3 + intensity * 0.7})`,
                                                                        }}
                                                                    >
                                                                        {value}
                                                                    </div>
                                                                </td>
                                                            );
                                                        }
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>

                <TabsContent value="trends" className="space-y-6">
                    {/* Trend Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Score Trends Over Time</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={trendData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                            <XAxis
                                                dataKey="month"
                                                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                            />
                                            <YAxis
                                                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                                domain={[50, 100]}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'hsl(var(--card))',
                                                    border: '1px solid hsl(var(--border))',
                                                    borderRadius: '8px',
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="score"
                                                stroke="#6366f1"
                                                strokeWidth={3}
                                                dot={{ fill: '#6366f1', strokeWidth: 2 }}
                                                activeDot={{ r: 8 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Analytics;
