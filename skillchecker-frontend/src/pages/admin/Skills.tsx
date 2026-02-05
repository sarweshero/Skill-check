import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Award,
    Plus,
    Search,
    Edit,
    Trash2,
    Loader2,
    Tag,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { adminApi, skillsApi } from '@/services/api';
import { toast } from '@/hooks/useToast';
import { Skill } from '@/types';

export const Skills: React.FC = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        maxLevel: 5,
    });

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const response = await skillsApi.getAll();
            setSkills(response.data || []);
        } catch (error) {
            // Mock data for demo
            setSkills([
                { id: 1, name: 'JavaScript', description: 'Web programming language', category: 'Frontend', maxLevel: 5 },
                { id: 2, name: 'React', description: 'Frontend framework', category: 'Frontend', maxLevel: 5 },
                { id: 3, name: 'TypeScript', description: 'Typed JavaScript', category: 'Frontend', maxLevel: 5 },
                { id: 4, name: 'Node.js', description: 'Backend runtime', category: 'Backend', maxLevel: 5 },
                { id: 5, name: 'Python', description: 'General programming', category: 'Backend', maxLevel: 5 },
                { id: 6, name: 'SQL', description: 'Database queries', category: 'Database', maxLevel: 5 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredSkills = skills.filter(
        (skill) =>
            skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            skill.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            skill.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const categories = [...new Set(skills.map((s) => s.category).filter(Boolean))];

    const handleOpenModal = (skill?: Skill) => {
        if (skill) {
            setIsEditing(true);
            setSelectedSkill(skill);
            setFormData({
                name: skill.name,
                description: skill.description || '',
                category: skill.category || '',
                maxLevel: skill.maxLevel || 5,
            });
        } else {
            setIsEditing(false);
            setSelectedSkill(null);
            setFormData({ name: '', description: '', category: '', maxLevel: 5 });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSkill(null);
        setFormData({ name: '', description: '', category: '', maxLevel: 5 });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            if (isEditing && selectedSkill) {
                await adminApi.updateSkill(selectedSkill.id, formData);
                setSkills((prev) =>
                    prev.map((s) =>
                        s.id === selectedSkill.id ? { ...s, ...formData } : s
                    )
                );
                toast({
                    title: 'Skill Updated',
                    description: 'Skill has been updated successfully',
                    variant: 'success',
                });
            } else {
                await adminApi.createSkill(formData);
                setSkills((prev) => [
                    ...prev,
                    { id: Date.now(), ...formData },
                ]);
                toast({
                    title: 'Skill Created',
                    description: 'New skill has been added',
                    variant: 'success',
                });
            }
            handleCloseModal();
        } catch (error) {
            toast({
                title: 'Error',
                description: isEditing ? 'Failed to update skill' : 'Failed to create skill',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Skill Management</h1>
                    <p className="text-muted-foreground">Manage skills and competency domains</p>
                </div>
                <Button variant="gradient" onClick={() => handleOpenModal()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search skills..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
                <Button
                    variant={!searchQuery ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSearchQuery('')}
                >
                    All
                </Button>
                {categories.map((category) => (
                    <Button
                        key={category}
                        variant={searchQuery === category ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSearchQuery(category || '')}
                    >
                        {category}
                    </Button>
                ))}
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSkills.map((skill, index) => (
                    <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                        <Card className="card-hover h-full">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                                            <Award className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{skill.name}</h3>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Tag className="w-3 h-3" />
                                                {skill.category || 'Uncategorized'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleOpenModal(skill)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                                    {skill.description || 'No description provided'}
                                </p>
                                <div className="mt-4 flex items-center gap-2">
                                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                        Max Level: {skill.maxLevel || 5}
                                    </span>
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
                            {isEditing ? 'Edit Skill' : 'Add New Skill'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Skill Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    placeholder="Enter skill name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    placeholder="Describe the skill"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({ ...formData, category: e.target.value })
                                    }
                                    placeholder="e.g., Frontend, Backend, Database"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maxLevel">Max Level</Label>
                                <Input
                                    id="maxLevel"
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={formData.maxLevel}
                                    onChange={(e) =>
                                        setFormData({ ...formData, maxLevel: parseInt(e.target.value) || 5 })
                                    }
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

export default Skills;
