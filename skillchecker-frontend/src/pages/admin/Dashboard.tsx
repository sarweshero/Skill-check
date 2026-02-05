import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Award,
    TrendingUp,
    BarChart3,
    Crown,
    Target,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SkillPieChart } from '@/components/charts/SkillPieChart';
import { DashboardSkeleton } from '@/components/common/LoadingSkeleton';
import { adminApi } from '@/services/api';
import { getInitials, getScoreColor } from '@/utils/helpers';

interface TopStudent {
    id: number;
    name: string;
    email: string;
    department?: string;
    totalScore: number;
    rank: number;
}

interface SkillDistribution {
    name: string;
    value: number;
}

const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    trendUp?: boolean;
    delay?: number;
}> = ({ title, value, icon, trend, trendUp = true, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
    >
        <Card className="card-hover">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-primary">
                        {icon}
                    </div>
                    {trend && (
                        <span
                            className={`text-xs font-medium flex items-center gap-1 ${trendUp ? 'text-green-500' : 'text-red-500'
                                }`}
                        >
                            <TrendingUp className={`w-3 h-3 ${!trendUp && 'rotate-180'}`} />
                            {trend}
                        </span>
                    )}
                </div>
                <div className="mt-4">
                    <h3 className="text-2xl font-bold">{value}</h3>
                    <p className="text-sm text-muted-foreground">{title}</p>
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

export const AdminDashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
    const [skillDistribution, setSkillDistribution] = useState<SkillDistribution[]>([]);
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalSkills: 0,
        avgScore: 0,
        evaluationsToday: 0,
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [topStudentsRes, skillSummaryRes] = await Promise.all([
                    adminApi.getTopStudents(10),
                    adminApi.getSkillSummary(),
                ]);

                setTopStudents(topStudentsRes.data || []);

                // Process skill summary for distribution
                const summary = skillSummaryRes.data || [];
                setSkillDistribution(
                    summary.map((s: any) => ({
                        name: s.skillName,
                        value: s.totalStudents,
                    }))
                );

                setStats({
                    totalStudents: topStudentsRes.data?.length || 0,
                    totalSkills: summary.length,
                    avgScore: 75,
                    evaluationsToday: 12,
                });
            } catch (error) {
                // Mock data for demo
                setTopStudents([
                    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', department: 'Engineering', totalScore: 92, rank: 1 },
                    { id: 2, name: 'Bob Smith', email: 'bob@example.com', department: 'Design', totalScore: 88, rank: 2 },
                    { id: 3, name: 'Carol White', email: 'carol@example.com', department: 'Engineering', totalScore: 85, rank: 3 },
                    { id: 4, name: 'David Brown', email: 'david@example.com', department: 'Marketing', totalScore: 82, rank: 4 },
                    { id: 5, name: 'Eva Garcia', email: 'eva@example.com', department: 'Engineering', totalScore: 80, rank: 5 },
                ]);

                setSkillDistribution([
                    { name: 'JavaScript', value: 45 },
                    { name: 'React', value: 38 },
                    { name: 'Python', value: 32 },
                    { name: 'Node.js', value: 28 },
                    { name: 'TypeScript', value: 25 },
                ]);

                setStats({
                    totalStudents: 156,
                    totalSkills: 24,
                    avgScore: 75,
                    evaluationsToday: 12,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of students and skill performance
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Students"
                    value={stats.totalStudents}
                    icon={<Users className="w-6 h-6" />}
                    trend="+12%"
                    delay={0}
                />
                <StatCard
                    title="Active Skills"
                    value={stats.totalSkills}
                    icon={<Award className="w-6 h-6" />}
                    trend="+3"
                    delay={0.1}
                />
                <StatCard
                    title="Avg Score"
                    value={`${stats.avgScore}%`}
                    icon={<Target className="w-6 h-6" />}
                    trend="+5%"
                    delay={0.2}
                />
                <StatCard
                    title="Evaluations Today"
                    value={stats.evaluationsToday}
                    icon={<BarChart3 className="w-6 h-6" />}
                    delay={0.3}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Students Leaderboard */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Crown className="w-5 h-5 text-yellow-500" />
                                Top Students
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topStudents.slice(0, 5).map((student, index) => (
                                    <motion.div
                                        key={student.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                                        className="flex items-center gap-4"
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === 0
                                                    ? 'bg-yellow-500 text-white'
                                                    : index === 1
                                                        ? 'bg-gray-400 text-white'
                                                        : index === 2
                                                            ? 'bg-amber-600 text-white'
                                                            : 'bg-muted text-muted-foreground'
                                                }`}
                                        >
                                            {student.rank}
                                        </div>
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="text-xs">
                                                {getInitials(student.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{student.name}</p>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {student.department || student.email}
                                            </p>
                                        </div>
                                        <div className={`font-bold ${getScoreColor(student.totalScore)}`}>
                                            {student.totalScore}%
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Skill Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-primary" />
                                Skill Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SkillPieChart data={skillDistribution} />
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Performance Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            Student Performance Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Rank</th>
                                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Student</th>
                                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Department</th>
                                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Score</th>
                                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topStudents.map((student) => (
                                        <tr key={student.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <span className="font-medium">#{student.rank}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="text-xs">
                                                            {getInitials(student.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{student.name}</p>
                                                        <p className="text-xs text-muted-foreground">{student.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-muted-foreground">
                                                {student.department || '-'}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`font-medium ${getScoreColor(student.totalScore)}`}>
                                                    {student.totalScore}%
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${student.totalScore >= 80
                                                            ? 'bg-green-500/10 text-green-500'
                                                            : student.totalScore >= 60
                                                                ? 'bg-yellow-500/10 text-yellow-500'
                                                                : 'bg-red-500/10 text-red-500'
                                                        }`}
                                                >
                                                    {student.totalScore >= 80
                                                        ? 'Excellent'
                                                        : student.totalScore >= 60
                                                            ? 'Good'
                                                            : 'Needs Work'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default AdminDashboard;
