import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Target, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SkillRadarChart } from '@/components/charts/SkillRadarChart';
import { ProgressBars } from '@/components/charts/ProgressBars';
import { studentApi } from '@/services/api';
import { getProgressColor } from '@/utils/helpers';

interface CompetencyItem {
    skillId: number;
    skillName: string;
    level: number;
    score: number;
    previousScore?: number;
    category?: string;
}

export const Competency: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [competencies, setCompetencies] = useState<CompetencyItem[]>([]);
    const [overallScore, setOverallScore] = useState(0);

    useEffect(() => {
        const fetchCompetency = async () => {
            try {
                const response = await studentApi.getCompetency();
                setCompetencies(response.data?.competencies || []);
                setOverallScore(response.data?.overallScore || 0);
            } catch (error) {
                // Mock data for demo
                setCompetencies([
                    { skillId: 1, skillName: 'JavaScript', level: 4, score: 85, previousScore: 80, category: 'Frontend' },
                    { skillId: 2, skillName: 'React', level: 3, score: 78, previousScore: 75, category: 'Frontend' },
                    { skillId: 3, skillName: 'TypeScript', level: 3, score: 72, previousScore: 72, category: 'Frontend' },
                    { skillId: 4, skillName: 'Node.js', level: 2, score: 65, previousScore: 68, category: 'Backend' },
                    { skillId: 5, skillName: 'Python', level: 2, score: 60, previousScore: 55, category: 'Backend' },
                    { skillId: 6, skillName: 'SQL', level: 3, score: 70, previousScore: 65, category: 'Database' },
                ]);
                setOverallScore(72);
            } finally {
                setLoading(false);
            }
        };

        fetchCompetency();
    }, []);

    const radarData = competencies.map((c) => ({
        skill: c.skillName,
        value: c.score,
        fullMark: 100,
    }));

    const getTrendIcon = (current: number, previous?: number) => {
        if (!previous) return <Minus className="w-4 h-4 text-muted-foreground" />;
        if (current > previous) return <ArrowUp className="w-4 h-4 text-green-500" />;
        if (current < previous) return <ArrowDown className="w-4 h-4 text-red-500" />;
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    };

    const categories = [...new Set(competencies.map((c) => c.category).filter(Boolean))];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Competency Progress</h1>
                <p className="text-muted-foreground">
                    Track your skill levels and competency growth
                </p>
            </div>

            {/* Overall Score */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Card className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-primary/20">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                                <div className="text-center">
                                    <div className="text-3xl font-bold">{overallScore}%</div>
                                    <div className="text-sm opacity-80">Overall</div>
                                </div>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-2xl font-bold mb-2">Great Progress!</h2>
                                <p className="text-muted-foreground mb-4">
                                    You're tracking {competencies.length} skills with an average competency of{' '}
                                    {overallScore}%. Keep up the excellent work!
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm">
                                        {competencies.filter((c) => c.score >= 80).length} Expert Level
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-sm">
                                        {competencies.filter((c) => c.score >= 60 && c.score < 80).length} Proficient
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-sm">
                                        {competencies.filter((c) => c.score < 60).length} Developing
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Radar Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-primary" />
                                Skill Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SkillRadarChart data={radarData} />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Category Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Category Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {categories.map((category) => {
                                    const categorySkills = competencies.filter((c) => c.category === category);
                                    const avgScore = Math.round(
                                        categorySkills.reduce((acc, c) => acc + c.score, 0) / categorySkills.length
                                    );
                                    return (
                                        <div key={category} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{category}</span>
                                                <span className="text-sm text-muted-foreground">{avgScore}%</span>
                                            </div>
                                            <Progress value={avgScore} />
                                            <div className="flex flex-wrap gap-2">
                                                {categorySkills.map((skill) => (
                                                    <span
                                                        key={skill.skillId}
                                                        className="text-xs px-2 py-1 rounded-full bg-muted"
                                                    >
                                                        {skill.skillName}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Detailed Skills */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-primary" />
                            Detailed Competencies
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {competencies.map((comp, index) => (
                                <motion.div
                                    key={comp.skillId}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="p-4 rounded-lg border bg-card"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h4 className="font-medium">{comp.skillName}</h4>
                                            <p className="text-xs text-muted-foreground">
                                                Level {comp.level} • {comp.category}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getTrendIcon(comp.score, comp.previousScore)}
                                            <span className="text-lg font-bold">{comp.score}%</span>
                                        </div>
                                    </div>
                                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${comp.score}%` }}
                                            transition={{ duration: 0.8, delay: 0.2 + index * 0.05 }}
                                            className={`h-full rounded-full ${getProgressColor(comp.score)}`}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Competency;
