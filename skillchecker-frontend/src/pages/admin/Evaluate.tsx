import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ClipboardCheck,
    Search,
    User,
    Award,
    Save,
    Loader2,
    Star,
} from 'lucide-react';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { adminApi, skillsApi } from '@/services/api';
import { toast } from '@/hooks/useToast';
import { getInitials } from '@/utils/helpers';
import { Student, Skill } from '@/types';

export const Evaluate: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [evaluations, setEvaluations] = useState<{ skillId: number; score: number; feedback: string }[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const skillsRes = await skillsApi.getAll();
            setSkills(skillsRes.data || []);
        } catch (error) {
            // Mock data
            setSkills([
                { id: 1, name: 'JavaScript', category: 'Frontend' },
                { id: 2, name: 'React', category: 'Frontend' },
                { id: 3, name: 'TypeScript', category: 'Frontend' },
                { id: 4, name: 'Node.js', category: 'Backend' },
                { id: 5, name: 'Python', category: 'Backend' },
            ]);
        }

        // Mock students
        setStudents([
            { id: 1, name: 'Alice Johnson', email: 'alice@example.com', department: 'Engineering' },
            { id: 2, name: 'Bob Smith', email: 'bob@example.com', department: 'Design' },
            { id: 3, name: 'Carol White', email: 'carol@example.com', department: 'Engineering' },
            { id: 4, name: 'David Brown', email: 'david@example.com', department: 'Marketing' },
        ]);

        setLoading(false);
    };

    const filteredStudents = students.filter(
        (student) =>
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectStudent = (student: Student) => {
        setSelectedStudent(student);
        // Initialize evaluations for all skills
        setEvaluations(
            skills.map((skill) => ({
                skillId: skill.id,
                score: 0,
                feedback: '',
            }))
        );
    };

    const handleScoreChange = (skillId: number, score: number) => {
        setEvaluations((prev) =>
            prev.map((e) => (e.skillId === skillId ? { ...e, score } : e))
        );
    };

    const handleFeedbackChange = (skillId: number, feedback: string) => {
        setEvaluations((prev) =>
            prev.map((e) => (e.skillId === skillId ? { ...e, feedback } : e))
        );
    };

    const handleSubmit = async () => {
        if (!selectedStudent) return;

        setIsSubmitting(true);

        try {
            // Submit evaluations for each skill
            for (const evaluation of evaluations) {
                if (evaluation.score > 0) {
                    await adminApi.evaluateStudent(selectedStudent.id, {
                        skillId: evaluation.skillId,
                        score: evaluation.score,
                        feedback: evaluation.feedback,
                    });
                }
            }

            toast({
                title: 'Evaluation Submitted',
                description: `Successfully evaluated ${selectedStudent.name}`,
                variant: 'success',
            });

            // Reset selection
            setSelectedStudent(null);
            setEvaluations([]);
        } catch (error) {
            toast({
                title: 'Submission Failed',
                description: 'Failed to submit evaluation. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const ScoreSelector: React.FC<{ skillId: number; currentScore: number }> = ({
        skillId,
        currentScore,
    }) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((score) => (
                <button
                    key={score}
                    type="button"
                    onClick={() => handleScoreChange(skillId, score)}
                    className={`p-1 rounded transition-colors ${score <= currentScore
                            ? 'text-yellow-500'
                            : 'text-muted-foreground hover:text-yellow-400'
                        }`}
                >
                    <Star
                        className={`w-6 h-6 ${score <= currentScore ? 'fill-current' : ''}`}
                    />
                </button>
            ))}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Student Evaluation</h1>
                <p className="text-muted-foreground">
                    Evaluate student competencies and provide feedback
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Student Selection */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Select Student
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Search */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search students..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Student List */}
                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                {filteredStudents.map((student) => (
                                    <button
                                        key={student.id}
                                        onClick={() => handleSelectStudent(student)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${selectedStudent?.id === student.id
                                                ? 'bg-primary/10 border-2 border-primary'
                                                : 'hover:bg-muted border-2 border-transparent'
                                            }`}
                                    >
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{student.name}</p>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {student.department || student.email}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Evaluation Form */}
                <div className="lg:col-span-2">
                    {selectedStudent ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <ClipboardCheck className="w-5 h-5 text-primary" />
                                            Evaluate {selectedStudent.name}
                                        </CardTitle>
                                        <Button
                                            variant="gradient"
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Submit Evaluation
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {skills.map((skill) => {
                                            const evaluation = evaluations.find(
                                                (e) => e.skillId === skill.id
                                            );
                                            return (
                                                <div
                                                    key={skill.id}
                                                    className="p-4 rounded-lg border bg-card space-y-3"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                                <Award className="w-5 h-5 text-primary" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium">{skill.name}</h4>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {skill.category || 'General'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <ScoreSelector
                                                            skillId={skill.id}
                                                            currentScore={evaluation?.score || 0}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`feedback-${skill.id}`} className="text-xs">
                                                            Feedback (Optional)
                                                        </Label>
                                                        <textarea
                                                            id={`feedback-${skill.id}`}
                                                            className="mt-1 flex min-h-[60px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none"
                                                            value={evaluation?.feedback || ''}
                                                            onChange={(e) =>
                                                                handleFeedbackChange(skill.id, e.target.value)
                                                            }
                                                            placeholder="Provide feedback..."
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center h-[400px] text-center">
                                <ClipboardCheck className="w-16 h-16 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">
                                    Select a Student to Evaluate
                                </h3>
                                <p className="text-muted-foreground max-w-sm">
                                    Choose a student from the list to start evaluating their skills
                                    and competencies.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Evaluate;
