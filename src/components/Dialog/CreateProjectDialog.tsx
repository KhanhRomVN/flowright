import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CalendarRange, User, FileText, FolderPlus, AlignLeft } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { _POST, _GET } from '@/utils/auth_api';
import { toast } from 'react-toastify';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface Member {
    id: string;
    email: string;
    username: string;
}

const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({
    open,
    onOpenChange
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        ownerId: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [members, setMembers] = useState<Member[]>([]);

    useEffect(() => {
        const fetchMembers = async () => {
            setIsLoading(true);
            try {
                const response = await _GET('/member/service/members/workspace/simple');
                setMembers(response);
            } catch (error) {
                console.error('Error fetching members:', error);
                toast.error('Failed to load members');
            } finally {
                setIsLoading(false);
            }
        };

        if (open) {
            fetchMembers();
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.description || !formData.startDate || !formData.ownerId) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setIsSubmitting(true);
            const requestBody = {
                ...formData,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
            };
            await _POST('/project/service/projects', requestBody);
            toast.success('Project created successfully');
            onOpenChange(false);
            setFormData({
                name: '',
                description: '',
                startDate: '',
                endDate: '',
                ownerId: ''
            });
        } catch (error) {
            console.error('Error creating project:', error);
            toast.error('Failed to create project');
        } finally {
            setIsSubmitting(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-4"
                >
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                            <FolderPlus className="w-6 h-6 text-primary" />
                            Create New Project
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <motion.div variants={itemVariants}>
                            <label className="text-sm font-medium mb-1 block flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" />
                                Project Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                placeholder="Enter project name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="transition-all duration-200 hover:border-primary/50 focus:border-primary"
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="text-sm font-medium mb-1 block flex items-center gap-2">
                                <AlignLeft className="w-4 h-4 text-primary" />
                                Description <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                placeholder="Enter project description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                required
                                className="transition-all duration-200 hover:border-primary/50 focus:border-primary resize-none"
                            />
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div>
                                <label className="text-sm font-medium mb-1 block flex items-center gap-2">
                                    <CalendarRange className="w-4 h-4 text-primary" />
                                    Start Date <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    required
                                    className="transition-all duration-200 hover:border-primary/50 focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1 block flex items-center gap-2">
                                    <CalendarRange className="w-4 h-4 text-primary" />
                                    End Date
                                </label>
                                <Input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className="transition-all duration-200 hover:border-primary/50 focus:border-primary"
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="text-sm font-medium mb-1 block flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                Project Owner <span className="text-red-500">*</span>
                            </label>
                            {isLoading ? (
                                <Skeleton height={40} className="rounded-md" />
                            ) : (
                                <Select
                                    value={formData.ownerId}
                                    onValueChange={(value) => setFormData({ ...formData, ownerId: value })}
                                >
                                    <SelectTrigger className="w-full transition-all duration-200 hover:border-primary/50">
                                        <SelectValue placeholder="Select project owner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {members.map((member) => (
                                            <SelectItem
                                                key={member.id}
                                                value={member.id}
                                                className="transition-colors duration-200 hover:bg-primary/10"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <User className="w-4 h-4" />
                                                    {member.username} ({member.email})
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="pt-2"
                        >
                            <Button
                                type="submit"
                                className="w-full relative bg-primary hover:bg-primary/90 text-white transition-all duration-200"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Creating...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <FolderPlus className="w-4 h-4" />
                                        Create Project
                                    </span>
                                )}
                            </Button>
                        </motion.div>
                    </form>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateProjectDialog;