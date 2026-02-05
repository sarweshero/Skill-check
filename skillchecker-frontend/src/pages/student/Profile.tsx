import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Building2, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/authStore';
import { studentApi } from '@/services/api';
import { toast } from '@/hooks/useToast';
import { getInitials } from '@/utils/helpers';

export const Profile: React.FC = () => {
    const { user, updateUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: '',
        bio: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const response = await studentApi.getProfile();
                const profile = response.data;
                setFormData({
                    name: profile.name || user?.name || '',
                    email: profile.email || user?.email || '',
                    department: profile.department || '',
                    bio: profile.bio || '',
                });
            } catch (error) {
                // Use current user data as fallback
                setFormData({
                    name: user?.name || '',
                    email: user?.email || '',
                    department: '',
                    bio: '',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await studentApi.updateProfile({
                name: formData.name,
                department: formData.department,
                bio: formData.bio,
            });

            updateUser({ name: formData.name });

            toast({
                title: 'Profile Updated',
                description: 'Your profile has been saved successfully',
                variant: 'success',
            });
        } catch (error) {
            toast({
                title: 'Update Failed',
                description: 'Failed to update profile. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your account information</p>
            </div>

            {/* Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Avatar Section */}
                            <div className="flex items-center gap-6">
                                <Avatar className="w-20 h-20">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="text-xl">
                                        {getInitials(formData.name || 'User')}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-medium">{formData.name || 'Your Name'}</h3>
                                    <p className="text-sm text-muted-foreground capitalize">
                                        {user?.role?.toLowerCase() || 'Student'}
                                    </p>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            className="pl-10"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                            placeholder="Enter your name"
                                            disabled={isSaving}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            className="pl-10"
                                            value={formData.email}
                                            disabled
                                            placeholder="Your email"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Email cannot be changed
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="department"
                                            className="pl-10"
                                            value={formData.department}
                                            onChange={(e) =>
                                                setFormData({ ...formData, department: e.target.value })
                                            }
                                            placeholder="Enter your department"
                                            disabled={isSaving}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <textarea
                                        id="bio"
                                        className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none"
                                        value={formData.bio}
                                        onChange={(e) =>
                                            setFormData({ ...formData, bio: e.target.value })
                                        }
                                        placeholder="Tell us about yourself..."
                                        disabled={isSaving}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <Button type="submit" variant="gradient" disabled={isSaving}>
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Profile;
