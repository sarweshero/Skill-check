import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Loader2, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { studentApi, skillsApi } from '@/services/api';
import { toast } from '@/hooks/useToast';
import { formatDate } from '@/utils/helpers';
import { Skill, Evidence } from '@/types';

export const EvidenceSubmission: React.FC = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [evidence, setEvidence] = useState<Evidence[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        skillId: '',
        description: '',
        file: null as File | null,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const skillsRes = await skillsApi.getAll();
                setSkills(skillsRes.data || []);
            } catch (error) {
                // Mock data for demo
                setSkills([
                    { id: 1, name: 'JavaScript', description: 'Web development' },
                    { id: 2, name: 'React', description: 'Frontend framework' },
                    { id: 3, name: 'TypeScript', description: 'Typed JavaScript' },
                    { id: 4, name: 'Node.js', description: 'Backend runtime' },
                    { id: 5, name: 'Python', description: 'General programming' },
                ]);
            }

            // Mock evidence history
            setEvidence([
                { id: 1, skillId: 1, skillName: 'React', description: 'Built a todo app', submittedAt: '2026-02-01', status: 'APPROVED' },
                { id: 2, skillId: 2, skillName: 'TypeScript', description: 'Migrated project to TS', submittedAt: '2026-01-28', status: 'PENDING' },
                { id: 3, skillId: 3, skillName: 'JavaScript', description: 'Completed algorithm challenges', submittedAt: '2026-01-25', status: 'APPROVED' },
            ]);

            setIsLoading(false);
        };

        fetchData();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, file: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.skillId || !formData.description) {
            toast({
                title: 'Missing Fields',
                description: 'Please select a skill and provide a description',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const data = new FormData();
            data.append('skillId', formData.skillId);
            data.append('description', formData.description);
            if (formData.file) {
                data.append('file', formData.file);
            }

            await studentApi.submitEvidence(data);

            toast({
                title: 'Evidence Submitted',
                description: 'Your evidence has been submitted for review',
                variant: 'success',
            });

            // Reset form
            setFormData({ skillId: '', description: '', file: null });
        } catch (error) {
            toast({
                title: 'Submission Failed',
                description: 'Failed to submit evidence. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'PENDING':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'REJECTED':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Evidence Submission</h1>
                <p className="text-muted-foreground">
                    Submit evidence of your skills for evaluation
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Submission Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="w-5 h-5 text-primary" />
                                Submit New Evidence
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Select Skill</Label>
                                    <Select
                                        value={formData.skillId}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, skillId: value })
                                        }
                                        disabled={isSubmitting}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a skill" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {skills.map((skill) => (
                                                <SelectItem key={skill.id} value={skill.id.toString()}>
                                                    {skill.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <textarea
                                        id="description"
                                        className="flex min-h-[120px] w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                        placeholder="Describe how you demonstrated this skill..."
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="file">Attachment (Optional)</Label>
                                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                                        <input
                                            type="file"
                                            id="file"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                            disabled={isSubmitting}
                                        />
                                        <label htmlFor="file" className="cursor-pointer">
                                            <FileText className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                                            {formData.file ? (
                                                <p className="text-sm font-medium">{formData.file.name}</p>
                                            ) : (
                                                <>
                                                    <p className="text-sm font-medium">
                                                        Click to upload a file
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        PDF, DOC, or images up to 10MB
                                                    </p>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    variant="gradient"
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 mr-2" />
                                            Submit Evidence
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Submission History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                Submission History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {evidence.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-start gap-4 p-4 rounded-lg bg-muted/50"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                            <FileText className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-medium">{item.skillName}</h4>
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${item.status === 'APPROVED'
                                                            ? 'bg-green-500/10 text-green-500'
                                                            : item.status === 'PENDING'
                                                                ? 'bg-yellow-500/10 text-yellow-500'
                                                                : 'bg-red-500/10 text-red-500'
                                                        }`}
                                                >
                                                    {getStatusIcon(item.status)}
                                                    {item.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {item.description}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatDate(item.submittedAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default EvidenceSubmission;
