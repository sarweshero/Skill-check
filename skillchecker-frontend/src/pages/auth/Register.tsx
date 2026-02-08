import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAuthStore, decodeToken } from '@/store/authStore';
import { authApi } from '@/services/api';
import { toast } from '@/hooks/useToast';

interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
}

const passwordRequirements = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { label: 'Contains a number', test: (p: string) => /\d/.test(p) },
    { label: 'Contains uppercase', test: (p: string) => /[A-Z]/.test(p) },
];

export const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { setAuth } = useAuthStore();

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Name is required';
        } else if (name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!role) {
            newErrors.role = 'Please select a role';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            await authApi.register({ name, email, password, role });

            toast({
                title: 'Account created!',
                description: 'Registration successful. Please log in to continue.',
                variant: 'success',
            });

            navigate('/login', { replace: true });
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
            toast({
                title: 'Registration Failed',
                description: message,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = (field: keyof FormErrors) => {
        if (errors[field]) {
            setErrors({ ...errors, [field]: undefined });
        }
    };

    return (
        <>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Create an account</h2>
                <p className="text-muted-foreground">Get started with SkillChecker today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            clearError('name');
                        }}
                        error={!!errors.name}
                        disabled={isLoading}
                    />
                    {errors.name && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-destructive"
                        >
                            {errors.name}
                        </motion.p>
                    )}
                </div>

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
                            clearError('email');
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

                {/* Role Select */}
                <div className="space-y-2">
                    <Label htmlFor="role">I am a</Label>
                    <Select
                        value={role}
                        onValueChange={(value) => {
                            setRole(value);
                            clearError('role');
                        }}
                        disabled={isLoading}
                    >
                        <SelectTrigger className={errors.role ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="STUDENT">Student</SelectItem>
                            <SelectItem value="ADMIN">Administrator</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.role && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-destructive"
                        >
                            {errors.role}
                        </motion.p>
                    )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                clearError('password');
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

                    {/* Password Requirements */}
                    {password && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-1 mt-2"
                        >
                            {passwordRequirements.map((req) => (
                                <div
                                    key={req.label}
                                    className={`flex items-center gap-2 text-xs ${req.test(password) ? 'text-green-500' : 'text-muted-foreground'
                                        }`}
                                >
                                    <Check
                                        className={`w-3 h-3 ${req.test(password) ? 'opacity-100' : 'opacity-30'
                                            }`}
                                    />
                                    {req.label}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            clearError('confirmPassword');
                        }}
                        error={!!errors.confirmPassword}
                        disabled={isLoading}
                    />
                    {errors.confirmPassword && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-destructive"
                        >
                            {errors.confirmPassword}
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
                            Creating account...
                        </>
                    ) : (
                        'Create Account'
                    )}
                </Button>

                {/* Login Link */}
                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
            </form>
        </>
    );
};

export default Register;
