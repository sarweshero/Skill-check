import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Plus,
    Search,
    Edit,
    Trash2,
    Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { adminApi } from '@/services/api';
import { toast } from '@/hooks/useToast';
import { getInitials } from '@/utils/helpers';
import { Student } from '@/types';

export const Students: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        department: '',
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            // In real app, fetch from API
            setStudents([
                { id: 1, name: 'Alice Johnson', email: 'alice@example.com', department: 'Engineering', competencyScore: 92 },
                { id: 2, name: 'Bob Smith', email: 'bob@example.com', department: 'Design', competencyScore: 88 },
                { id: 3, name: 'Carol White', email: 'carol@example.com', department: 'Engineering', competencyScore: 85 },
                { id: 4, name: 'David Brown', email: 'david@example.com', department: 'Marketing', competencyScore: 82 },
                { id: 5, name: 'Eva Garcia', email: 'eva@example.com', department: 'Engineering', competencyScore: 80 },
                { id: 6, name: 'Frank Lee', email: 'frank@example.com', department: 'Sales', competencyScore: 78 },
            ]);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch students',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(
        (student) =>
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.department?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = (student?: Student) => {
        if (student) {
            setIsEditing(true);
            setSelectedStudent(student);
            setFormData({
                name: student.name,
                email: student.email,
                password: '',
                department: student.department || '',
            });
        } else {
            setIsEditing(false);
            setSelectedStudent(null);
            setFormData({ name: '', email: '', password: '', department: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
        setFormData({ name: '', email: '', password: '', department: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            if (isEditing && selectedStudent) {
                await adminApi.updateStudent(selectedStudent.id, {
                    name: formData.name,
                    department: formData.department,
                });
                setStudents((prev) =>
                    prev.map((s) =>
                        s.id === selectedStudent.id
                            ? { ...s, name: formData.name, department: formData.department }
                            : s
                    )
                );
                toast({
                    title: 'Student Updated',
                    description: 'Student information has been updated',
                    variant: 'success',
                });
            } else {
                await adminApi.createStudent(formData);
                // Add new student to list (in real app, refresh from API)
                setStudents((prev) => [
                    ...prev,
                    {
                        id: Date.now(),
                        name: formData.name,
                        email: formData.email,
                        department: formData.department,
                        competencyScore: 0,
                    },
                ]);
                toast({
                    title: 'Student Created',
                    description: 'New student has been added',
                    variant: 'success',
                });
            }
            handleCloseModal();
        } catch (error) {
            toast({
                title: 'Error',
                description: isEditing ? 'Failed to update student' : 'Failed to create student',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (studentId: number) => {
        if (!confirm('Are you sure you want to delete this student?')) return;

        try {
            await adminApi.deleteStudent(studentId);
            setStudents((prev) => prev.filter((s) => s.id !== studentId));
            toast({
                title: 'Student Deleted',
                description: 'Student has been removed',
                variant: 'success',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete student',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Student Management</h1>
                    <p className="text-muted-foreground">Manage and track student information</p>
                </div>
                <Button variant="gradient" onClick={() => handleOpenModal()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Student
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search students..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStudents.map((student, index) => (
                    <motion.div
                        key={student.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                        <Card className="card-hover">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold truncate">{student.name}</h3>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {student.email}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {student.department || 'No department'}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <span
                                        className={`text-sm font-medium ${(student.competencyScore || 0) >= 80
                                                ? 'text-green-500'
                                                : (student.competencyScore || 0) >= 60
                                                    ? 'text-yellow-500'
                                                    : 'text-red-500'
                                            }`}
                                    >
                                        Score: {student.competencyScore || 0}%
                                    </span>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleOpenModal(student)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600"
                                            onClick={() => handleDelete(student.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? 'Edit Student' : 'Add New Student'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    placeholder="Enter student name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    placeholder="Enter email address"
                                    disabled={isEditing}
                                    required={!isEditing}
                                />
                            </div>
                            {!isEditing && (
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({ ...formData, password: e.target.value })
                                        }
                                        placeholder="Enter password"
                                        required
                                    />
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Input
                                    id="department"
                                    value={formData.department}
                                    onChange={(e) =>
                                        setFormData({ ...formData, department: e.target.value })
                                    }
                                    placeholder="Enter department"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="gradient" disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : isEditing ? (
                                    'Update'
                                ) : (
                                    'Create'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Students;
