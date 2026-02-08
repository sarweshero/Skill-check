import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore, decodeToken } from '@/store/authStore';
import { authApi } from '@/services/api';
import { toast } from '@/hooks/useToast';

interface FormErrors {
    email?: string;
    password?: string;
}

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { setAuth } = useAuthStore();

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const response = await authApi.login(email, password);
            console.log('Login response:', response);
            console.log('Login data:', response.data);

            const { token, role } = response.data;
            let { user } = response.data;

            if (!token) {
                console.error('Invalid response structure: Missing token', response.data);
                throw new Error('Invalid response from server: Missing token');
            }

            // If user object is missing, try to construct it from token/role
            if (!user) {
                console.warn('User object missing in response, attempting to decode token...');
                const decoded = decodeToken(token);
                console.log('Decoded token:', decoded);

                if (decoded) {
                    user = {
                        id: decoded.id || 0, // Fallback ID
                        email: decoded.email || email, // Use input email if missing
                        name: decoded.name || email.split('@')[0], // Fallback name
                        role: role || decoded.role || 'STUDENT',
                    };
                } else {
                    // Last resort fallback
                    user = {
                        id: 0,
                        email: email,
                        name: email.split('@')[0],
                        role: role || 'STUDENT',
                    };
                }
            }

            setAuth(token, user);

            toast({
                title: 'Welcome back!',
                description: `Logged in as ${user.name}`,
                variant: 'success',
            });
            // Redirect based on role
            const redirectPath = user.role === 'ADMIN' ? '/admin' : '/student';
            navigate(from === '/' ? redirectPath : from, { replace: true });
        } catch (error: any) {
            console.error('Login Error details:', error);
            if (error.response) {
                console.error('Login Error Response:', error.response);
            }

            const message = error.response?.data?.message || 'Invalid email or password';
            toast({
                title: 'Login Failed',
                description: message,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
                <p className="text-muted-foreground">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        error={!!errors.email}
                        disabled={isLoading}
                    />
                    {errors.email && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-destructive"
                        >
                            {errors.email}
                        </motion.p>
                    )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link
                            to="/forgot-password"
                            className="text-sm text-primary hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (errors.password) setErrors({ ...errors, password: undefined });
                            }}
                            error={!!errors.password}
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-destructive"
                        >
                            {errors.password}
                        </motion.p>
                    )}
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="gradient"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        'Sign In'
                    )}
                </Button>

                {/* Register Link */}
                <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary hover:underline font-medium">
                        Create one
                    </Link>
                </p>
            </form>
        </>
    );
};

export default Login;
