import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Award,
    BarChart3,
    Users,
    TrendingUp,
    CheckCircle,
    ArrowRight,
    Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

const features = [
    {
        icon: <Award className="w-6 h-6" />,
        title: 'Skill Assessment',
        description: 'Comprehensive evaluation of technical and soft skills with detailed metrics.',
    },
    {
        icon: <BarChart3 className="w-6 h-6" />,
        title: 'Analytics Dashboard',
        description: 'Visual insights into competency levels and skill distribution.',
    },
    {
        icon: <Users className="w-6 h-6" />,
        title: 'Team Management',
        description: 'Manage students and track their progress effortlessly.',
    },
    {
        icon: <TrendingUp className="w-6 h-6" />,
        title: 'Progress Tracking',
        description: 'Monitor skill development over time with detailed reports.',
    },
];

const stats = [
    { value: '10K+', label: 'Students' },
    { value: '500+', label: 'Skills Tracked' },
    { value: '95%', label: 'Satisfaction' },
    { value: '50+', label: 'Organizations' },
];

export const Landing: React.FC = () => {
    const { isAuthenticated, user } = useAuthStore();

    const dashboardLink = isAuthenticated
        ? user?.role === 'ADMIN'
            ? '/admin'
            : '/student'
        : '/login';

    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                <Award className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gradient">SkillChecker</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            {isAuthenticated ? (
                                <Button asChild variant="gradient">
                                    <Link to={dashboardLink}>
                                        Go to Dashboard
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild variant="ghost">
                                        <Link to="/login">Sign In</Link>
                                    </Button>
                                    <Button asChild variant="gradient">
                                        <Link to="/register">Get Started</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            Modern Competency Management Platform
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                            Track Skills,{' '}
                            <span className="text-gradient">Measure Growth,</span>{' '}
                            Achieve Excellence
                        </h1>
                        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            A comprehensive platform for evaluating student competencies, tracking skill
                            development, and gaining actionable insights through beautiful analytics.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild size="lg" variant="gradient">
                                <Link to="/register">
                                    Start Free Trial
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <Link to="/login">View Demo</Link>
                            </Button>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {stats.map((stat, index) => (
                            <div key={stat.label} className="text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                                    className="text-4xl sm:text-5xl font-bold text-gradient mb-2"
                                >
                                    {stat.value}
                                </motion.div>
                                <div className="text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-muted/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Everything You Need to Succeed
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Powerful tools for comprehensive skill assessment and tracking.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="glass-card p-6 card-hover"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative rounded-3xl overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500" />
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoMnY0aC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
                        <div className="relative z-10 px-8 py-16 text-center text-white">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                                Ready to Get Started?
                            </h2>
                            <p className="text-lg text-white/80 mb-8 max-w-lg mx-auto">
                                Join thousands of organizations already using SkillChecker to transform
                                their competency management.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-white/90">
                                    <Link to="/register">
                                        Create Free Account
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Link>
                                </Button>
                            </div>
                            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-white/70">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    No credit card required
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Free 14-day trial
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                <Award className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-semibold">SkillChecker</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © 2026 SkillChecker. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
