import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Award,
    ClipboardCheck,
    BarChart3,
    User,
    FileText,
    TrendingUp,
    Menu,
    X,
    LogOut,
    Sun,
    Moon,
    Bell,
    ChevronDown,
} from 'lucide-react';
import { useAuthStore, useIsAdmin } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getInitials } from '@/utils/helpers';

interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
}

const adminNavItems: NavItem[] = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Students', path: '/admin/students', icon: <Users className="w-5 h-5" /> },
    { label: 'Skills', path: '/admin/skills', icon: <Award className="w-5 h-5" /> },
    { label: 'Evaluation', path: '/admin/evaluate', icon: <ClipboardCheck className="w-5 h-5" /> },
    { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="w-5 h-5" /> },
];

const studentNavItems: NavItem[] = [
    { label: 'Dashboard', path: '/student', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Profile', path: '/student/profile', icon: <User className="w-5 h-5" /> },
    { label: 'Evidence', path: '/student/evidence', icon: <FileText className="w-5 h-5" /> },
    { label: 'Competency', path: '/student/competency', icon: <TrendingUp className="w-5 h-5" /> },
];

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { theme, setTheme } = useThemeStore();
    const isAdmin = useIsAdmin();

    const navItems = isAdmin ? adminNavItems : studentNavItems;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const sidebarVariants = {
        open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
        closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                className="fixed top-0 left-0 z-50 h-full w-64 border-r bg-card hidden lg:block"
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                <Award className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-gradient">SkillChecker</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t">
                        <div className="flex items-center gap-3 px-2 py-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="" />
                                <AvatarFallback className="text-xs">
                                    {user?.name ? getInitials(user.name) : 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                                <p className="text-xs text-muted-foreground truncate capitalize">
                                    {user?.role?.toLowerCase() || 'user'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Mobile Sidebar */}
            <motion.aside
                initial={false}
                animate={sidebarOpen ? 'open' : 'closed'}
                variants={sidebarVariants}
                className="fixed top-0 left-0 z-50 h-full w-64 border-r bg-card lg:hidden"
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between h-16 px-6 border-b">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                <Award className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-gradient">SkillChecker</span>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabMobile"
                                            className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t">
                        <div className="flex items-center gap-3 px-2 py-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="" />
                                <AvatarFallback className="text-xs">
                                    {user?.name ? getInitials(user.name) : 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                                <p className="text-xs text-muted-foreground truncate capitalize">
                                    {user?.role?.toLowerCase() || 'user'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="lg:pl-64 flex flex-col min-h-screen">
                {/* Top Navigation */}
                <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b bg-background/80 backdrop-blur-xl">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="w-5 h-5" />
                    </Button>

                    <div className="flex-1" />

                    <div className="flex items-center gap-2">
                        {/* Theme Toggle */}
                        <Button variant="ghost" size="icon" onClick={toggleTheme}>
                            {theme === 'dark' ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </Button>

                        {/* Notifications */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80">
                                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <div className="p-4 text-sm text-center text-muted-foreground">
                                    No new notifications
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Profile Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2 px-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="" />
                                        <AvatarFallback className="text-xs">
                                            {user?.name ? getInitials(user.name) : 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <div>
                                        <p className="font-medium">{user?.name || 'User'}</p>
                                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate(isAdmin ? '/admin' : '/student/profile')}>
                                    <User className="w-4 h-4 mr-2" />
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children || <Outlet />}
                    </motion.div>
                </main>
            </div>
        </div >
    );
};

export default MainLayout;
