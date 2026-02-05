import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Award,
    Clock,
    Target,
    FileText,
    Lightbulb,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SkillRadarChart } from '@/components/charts/SkillRadarChart';
import { ProgressBars } from '@/components/charts/ProgressBars';
import { DashboardSkeleton } from '@/components/common/LoadingSkeleton';
import { studentApi, skillsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { formatDate } from '@/utils/helpers';

interface DashboardData {
    competencies: { skillName: string; score: number }[];
    recentEvidence: { id: number; skillName: string; submittedAt: string; status: string }[];
    overallScore: number;
}

const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    delay?: number;
}> = ({ title, value, icon, trend, delay = 0 }) => (
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
                        <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
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

export const StudentDashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [competencyRes] = await Promise.all([
                    studentApi.getCompetency(),
                ]);

                setDashboardData({
                    competencies: competencyRes.data?.competencies || [],
                    recentEvidence: competencyRes.data?.recentEvidence || [],
                    overallScore: competencyRes.data?.overallScore || 0,
                });
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                // Set mock data for demo
                setDashboardData({
                    competencies: [
                        { skillName: 'JavaScript', score: 85 },
                        { skillName: 'React', score: 78 },
                        { skillName: 'TypeScript', score: 72 },
                        { skillName: 'Node.js', score: 65 },
                        { skillName: 'Python', score: 60 },
                        { skillName: 'SQL', score: 70 },
                    ],
                    recentEvidence: [
                        { id: 1, skillName: 'React', submittedAt: '2026-02-01', status: 'APPROVED' },
                        { id: 2, skillName: 'TypeScript', submittedAt: '2026-01-28', status: 'PENDING' },
                        { id: 3, skillName: 'JavaScript', submittedAt: '2026-01-25', status: 'APPROVED' },
                    ],
                    overallScore: 72,
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

    const radarData = dashboardData?.competencies.map((c) => ({
        skill: c.skillName,
        value: c.score,
        fullMark: 100,
    })) || [];

    const progressData = dashboardData?.competencies.map((c) => ({
        name: c.skillName,
        value: c.score,
        max: 100,
    })) || [];

    const suggestions = [
        { skill: 'Python', tip: 'Complete advanced algorithms course to improve score' },
        { skill: 'Node.js', tip: 'Build a REST API project to demonstrate proficiency' },
        { skill: 'SQL', tip: 'Practice complex queries and database optimization' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
                <p className="text-muted-foreground">
                    Here's an overview of your skill progress
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Overall Score"
                    value={`${dashboardData?.overallScore || 0}%`}
                    icon={<Target className="w-6 h-6" />}
                    trend="+5%"
                    delay={0}
                />
                <StatCard
                    title="Skills Tracked"
                    value={dashboardData?.competencies.length || 0}
                    icon={<Award className="w-6 h-6" />}
                    delay={0.1}
                />
                <StatCard
                    title="Evidence Submitted"
                    value={dashboardData?.recentEvidence.length || 0}
                    icon={<FileText className="w-6 h-6" />}
                    delay={0.2}
                />
                <StatCard
                    title="Last Updated"
                    value="Today"
                    icon={<Clock className="w-6 h-6" />}
                    delay={0.3}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Radar Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <Card className="card-hover">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="w-5 h-5 text-primary" />
                                Skill Radar
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SkillRadarChart data={radarData} />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Progress Bars */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                >
                    <Card className="card-hover">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Competency Progress
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ProgressBars data={progressData} />
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Evidence Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                >
                    <Card className="card-hover">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                Recent Evidence
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {dashboardData?.recentEvidence.map((evidence, index) => (
                                    <div
                                        key={evidence.id}
                                        className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{evidence.skillName}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(evidence.submittedAt)}
                                            </p>
                                        </div>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full font-medium ${evidence.status === 'APPROVED'
                                                    ? 'bg-green-500/10 text-green-500'
                                                    : evidence.status === 'PENDING'
                                                        ? 'bg-yellow-500/10 text-yellow-500'
                                                        : 'bg-red-500/10 text-red-500'
                                                }`}
                                        >
                                            {evidence.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Improvement Suggestions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                >
                    <Card className="card-hover">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-primary" />
                                Improvement Suggestions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {suggestions.map((suggestion, index) => (
                                    <div
                                        key={suggestion.skill}
                                        className="p-4 rounded-lg border bg-gradient-to-r from-amber-500/5 to-orange-500/5 border-amber-500/20"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                                                {suggestion.skill}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {suggestion.tip}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default StudentDashboard;
