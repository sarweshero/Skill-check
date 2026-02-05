import React from 'react';
import { motion } from 'framer-motion';
import { Link, Outlet } from 'react-router-dom';
import { Award } from 'lucide-react';

export const AuthLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex">
            {/* Left Side - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">
                {/* Animated shapes */}
                <div className="absolute inset-0">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            rotate: [90, 0, 90],
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                        className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            y: [0, 50, 0],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-1/2 left-1/3 w-48 h-48 bg-white/5 rounded-full blur-2xl"
                    />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <div className="flex items-center justify-center gap-3 mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
                                <Award className="w-8 h-8 text-white" />
                            </div>
                            <span className="text-3xl font-bold">SkillChecker</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-4">
                            Track & Evaluate Skills
                        </h1>
                        <p className="text-lg text-white/80 max-w-md">
                            A modern platform for competency tracking, skill evaluation, and
                            professional development insights.
                        </p>
                    </motion.div>

                    {/* Features */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-12 grid grid-cols-2 gap-4"
                    >
                        {[
                            'Skill Assessment',
                            'Progress Tracking',
                            'Competency Analytics',
                            'Performance Insights',
                        ].map((feature) => (
                            <div
                                key={feature}
                                className="flex items-center gap-2 text-white/80"
                            >
                                <div className="w-2 h-2 rounded-full bg-white/60" />
                                <span className="text-sm">{feature}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-6 bg-background">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile Logo */}
                    <Link to="/" className="flex items-center justify-center gap-2 mb-8 lg:hidden">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                            <Award className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gradient">SkillChecker</span>
                    </Link>

                    {/* Form Content from child routes */}
                    <Outlet />
                </motion.div>
            </div>
        </div>
    );
};

export default AuthLayout;
