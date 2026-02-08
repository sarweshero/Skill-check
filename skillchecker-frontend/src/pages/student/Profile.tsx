import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    User, Mail, Building2, Save, Loader2,
    Github, Linkedin, Globe, FileText,
    GraduationCap, School, Calculator, Camera
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/authStore';
import { studentApi, adminApi } from '@/services/api';
import { toast } from '@/hooks/useToast';
import { getInitials } from '@/utils/helpers';

export const Profile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user, updateUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        dept: '',
        bio: '',
        githubUrl: '',
        linkedinUrl: '',
        portfolioUrl: '',
        resumeUrl: '',
        cgpa: '',
        graduationYear: '',
        yearOfStudy: '',
        profilePictureUrl: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                // If ID is provided, it's an admin viewing a student profile
                const response = id
                    ? await adminApi.getStudentProfile(id)
                    : await studentApi.getProfile();

                const profile = response.data;
                setFormData({
                    name: profile.name || '',
                    email: profile.email || '',
                    dept: profile.dept || '',
                    bio: profile.bio || '',
                    githubUrl: profile.githubUrl || '',
                    linkedinUrl: profile.linkedinUrl || '',
                    portfolioUrl: profile.portfolioUrl || '',
                    resumeUrl: profile.resumeUrl || '',
                    cgpa: profile.cgpa?.toString() || '',
                    graduationYear: profile.graduationYear?.toString() || '',
                    yearOfStudy: profile.yearOfStudy?.toString() || '',
                    profilePictureUrl: profile.profilePictureUrl || '',
                });

                // Only update global user state if viewing own profile
                if (!id) {
                    // We don't really need to update global user here on fetch, 
                    // but if we were syncing, we would do it here. 
                    // The original code was relying on fallbacks to `user` object.
                }
            } catch (error) {
                if (!id) {
                    // Fallback to current user data only if viewing own profile
                    setFormData(prev => ({
                        ...prev,
                        name: user?.name || '',
                        email: user?.email || '',
                    }));
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [user, id]);

    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "Profile photos");

        try {
            const res = await fetch(
                "https://api.cloudinary.com/v1_1/dl4oklidn/image/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await res.json();

            if (data.secure_url) {
                return data.secure_url;
            } else {
                throw new Error("Failed to get secure URL");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            throw new Error("Failed to upload image");
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const imageUrl = await uploadImage(file);
            setFormData(prev => ({ ...prev, profilePictureUrl: imageUrl }));

            // Immediately update profile with new image
            await studentApi.updateProfile({
                profilePictureUrl: imageUrl
            });

            // Update global user state
            updateUser({ profilePictureUrl: imageUrl });

            toast({
                title: 'Image Uploaded',
                description: 'Profile picture uploaded successfully',
                variant: 'success',
            });
        } catch (error) {
            console.error("Upload error:", error);
            toast({
                title: 'Upload Failed',
                description: 'Failed to upload profile picture',
                variant: 'destructive',
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await studentApi.updateProfile({
                name: formData.name,
                dept: formData.dept,
                bio: formData.bio,
                githubUrl: formData.githubUrl || null,
                linkedinUrl: formData.linkedinUrl || null,
                portfolioUrl: formData.portfolioUrl || null,
                resumeUrl: formData.resumeUrl || null,
                cgpa: formData.cgpa ? parseFloat(formData.cgpa) : null,
                graduationYear: formData.graduationYear ? parseInt(formData.graduationYear) : null,
                yearOfStudy: formData.yearOfStudy ? parseInt(formData.yearOfStudy) : null,
                profilePictureUrl: formData.profilePictureUrl || null,
            });

            updateUser({ name: formData.name });

            toast({
                title: 'Profile Updated',
                description: 'Your profile has been saved successfully',
                variant: 'success',
            });

        } catch (error: any) {
            const validationErrors = error.response?.data?.errors;
            const errorMessage = validationErrors
                ? Object.entries(validationErrors)
                    .map(([field, message]) => `${field} ${message}`)
                    .join(', ')
                : error.response?.data?.message || 'Failed to update profile. Please try again.';

            toast({
                title: 'Update Failed',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">
                    {id ? 'Student Profile' : 'Profile Settings'}
                </h1>
                <p className="text-muted-foreground">
                    {id ? 'View student details and information' : 'Manage your account information'}
                </p>
            </div>

            {id && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.history.back()}
                >
                    &larr; Back to Students
                </Button>
            )}

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
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-6 border-b">
                                <div className="relative group shrink-0">
                                    <Avatar className="w-24 h-24 md:w-28 md:h-28 border-4 border-background shadow-lg group-hover:border-primary transition-colors">
                                        <AvatarImage src={formData.profilePictureUrl} className="object-cover" />
                                        <AvatarFallback className="text-3xl bg-muted">
                                            {getInitials(formData.name || 'User')}
                                        </AvatarFallback>
                                    </Avatar>
                                    {!id && (
                                        <label
                                            htmlFor="profile-upload"
                                            className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer backdrop-blur-[2px]"
                                        >
                                            {isUploading ? (
                                                <Loader2 className="w-8 h-8 animate-spin" />
                                            ) : (
                                                <Camera className="w-8 h-8" />
                                            )}
                                            <input
                                                type="file"
                                                id="profile-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={isUploading || isSaving}
                                            />
                                        </label>
                                    )}
                                </div>
                                <div className="space-y-2 text-center md:text-left flex-1">
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-bold">{formData.name || 'Your Name'}</h3>
                                        <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 text-sm">
                                            <span className="capitalize font-medium">{user?.role?.toLowerCase() || 'Student'}</span>
                                            {formData.dept && (
                                                <>
                                                    <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                                                    <span>{formData.dept}</span>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                        {formData.githubUrl && (
                                            <a href={formData.githubUrl} target="_blank" rel="noreferrer" className="text-xs border px-2 py-1 rounded-full hover:bg-muted transition-colors flex items-center gap-1">
                                                <Github className="w-3 h-3" /> GitHub
                                            </a>
                                        )}
                                        {formData.linkedinUrl && (
                                            <a href={formData.linkedinUrl} target="_blank" rel="noreferrer" className="text-xs border px-2 py-1 rounded-full hover:bg-muted transition-colors flex items-center gap-1">
                                                <Linkedin className="w-3 h-3" /> LinkedIn
                                            </a>
                                        )}
                                        {formData.portfolioUrl && (
                                            <a href={formData.portfolioUrl} target="_blank" rel="noreferrer" className="text-xs border px-2 py-1 rounded-full hover:bg-muted transition-colors flex items-center gap-1">
                                                <Globe className="w-3 h-3" /> Portfolio
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground pt-1">
                                        Click profile picture to update
                                    </p>
                                </div>
                            </div>


                            {/* Form Fields */}
                            <div className="grid gap-6">
                                {/* Basic Info Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                disabled={!!id || isSaving}
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
                                    </div>
                                </div>

                                {/* Academic Info Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="dept">Department</Label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="dept"
                                                className="pl-10"
                                                value={formData.dept}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, dept: e.target.value })
                                                }
                                                placeholder="e.g. CS"
                                                disabled={!!id || isSaving}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="yearOfStudy">Year of Study</Label>
                                        <div className="relative">
                                            <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="yearOfStudy"
                                                type="number"
                                                className="pl-10"
                                                value={formData.yearOfStudy}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, yearOfStudy: e.target.value })
                                                }
                                                placeholder="e.g. 3"
                                                disabled={!!id || isSaving}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="graduationYear">Graduation Year</Label>
                                        <div className="relative">
                                            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="graduationYear"
                                                type="number"
                                                className="pl-10"
                                                value={formData.graduationYear}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, graduationYear: e.target.value })
                                                }
                                                placeholder={`e.g. ${new Date().getFullYear() + 4}`}
                                                disabled={!!id || isSaving}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="cgpa">CGPA</Label>
                                        <div className="relative">
                                            <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="cgpa"
                                                type="number"
                                                step="0.01"
                                                className="pl-10"
                                                value={formData.cgpa}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, cgpa: e.target.value })
                                                }
                                                placeholder="e.g. 8.5"
                                                disabled={!!id || isSaving}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Social Links Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="githubUrl">GitHub URL</Label>
                                        <div className="relative">
                                            <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="githubUrl"
                                                className="pl-10"
                                                value={formData.githubUrl}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, githubUrl: e.target.value })
                                                }
                                                placeholder="github.com/username"
                                                disabled={!!id || isSaving}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                                        <div className="relative">
                                            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="linkedinUrl"
                                                className="pl-10"
                                                value={formData.linkedinUrl}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, linkedinUrl: e.target.value })
                                                }
                                                placeholder="linkedin.com/in/username"
                                                disabled={!!id || isSaving}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="portfolioUrl"
                                                className="pl-10"
                                                value={formData.portfolioUrl}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, portfolioUrl: e.target.value })
                                                }
                                                placeholder="yourportfolio.com"
                                                disabled={!!id || isSaving}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="resumeUrl">Resume URL</Label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="resumeUrl"
                                                className="pl-10"
                                                value={formData.resumeUrl}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, resumeUrl: e.target.value })
                                                }
                                                placeholder="Link to your resume"
                                                disabled={!!id || isSaving}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <textarea
                                        id="bio"
                                        className="flex min-h-[120px] w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none"
                                        value={formData.bio}
                                        onChange={(e) =>
                                            setFormData({ ...formData, bio: e.target.value })
                                        }
                                        placeholder="Tell us about your academic interests, skills, and career goals..."
                                        disabled={!!id || isSaving}
                                        maxLength={2000}
                                    />
                                    <p className="text-[10px] text-muted-foreground text-right">
                                        {formData.bio?.length || 0}/2000 characters
                                    </p>
                                </div>
                            </div>

                            {/* Submit Button */}
                            {!id && (
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
                            )}
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div >
    );
};

export default Profile;
