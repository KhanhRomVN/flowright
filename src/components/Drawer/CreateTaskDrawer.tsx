import React, { useState } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { X, Plus, Calendar, Users, Link2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { _POST } from '@/utils/auth_api';
import { toast } from 'react-toastify';

interface CreateTaskDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateTaskDrawer({
    isOpen,
    onClose,
}: CreateTaskDrawerProps) {
    // States
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('low');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [link, setLink] = useState<{ linkName: string; linkUrl: string }>({ linkName: '', linkUrl: '' });
    const [miniTasks, setMiniTasks] = useState<Array<{ name: string; description: string }>>([]);
    const [newMiniTask, setNewMiniTask] = useState({ name: '', description: '' });
    const [showMiniTaskForm, setShowMiniTaskForm] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!taskName.trim() || !description.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await _POST('/task/service/tasks', {
                name: taskName,
                description,
                priority,
                startDate,
                endDate,
                taskAssignments: selectedMembers.map(memberId => ({
                    memberId,
                    teamId: null
                })),
                miniTasks: [],
                taskLinks: link.linkName && link.linkUrl ? [{
                    title: link.linkName,
                    link: link.linkUrl
                }] : []
            });

            toast.success('Task created successfully');
            onClose();
            resetForm();
        } catch (error) {
            console.error('Error creating task:', error);
            toast.error('Failed to create task');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddMiniTask = () => {
        if (newMiniTask.name.trim()) {
            setMiniTasks([...miniTasks, { ...newMiniTask }]);
            setNewMiniTask({ name: '', description: '' });
            setShowMiniTaskForm(false);
        }
    };

    const handleRemoveMiniTask = (index: number) => {
        setMiniTasks(miniTasks.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        setTaskName('');
        setDescription('');
        setPriority('low');
        setStartDate('');
        setEndDate('');
        setSelectedMembers([]);
        setLink({ linkName: '', linkUrl: '' });
        setMiniTasks([]);
        setNewMiniTask({ name: '', description: '' });
        setShowMiniTaskForm(false);
    };

    return (
        <Drawer
            open={isOpen}
            onClose={onClose}
            direction="right"
            size={450}
            className="p-0"
        >
            <div className="h-full bg-background flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">Create New Task</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                Task Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                placeholder="Enter task name"
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                placeholder="Enter task description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                required
                            />
                        </div>
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="text-sm font-medium mb-1 block">Priority</label>
                        <Select value={priority} onValueChange={setPriority}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low Priority</SelectItem>
                                <SelectItem value="medium">Medium Priority</SelectItem>
                                <SelectItem value="high">High Priority</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Start Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">End Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mini Tasks */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Mini Tasks</label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setShowMiniTaskForm(true)}
                                className="flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Mini Task
                            </Button>
                        </div>

                        {showMiniTaskForm && (
                            <div className="space-y-4 p-4 border rounded-lg">
                                <Input
                                    placeholder="Mini Task Name"
                                    value={newMiniTask.name}
                                    onChange={(e) => setNewMiniTask({ ...newMiniTask, name: e.target.value })}
                                />
                                <Textarea
                                    placeholder="Mini Task Description"
                                    value={newMiniTask.description}
                                    onChange={(e) => setNewMiniTask({ ...newMiniTask, description: e.target.value })}
                                    rows={2}
                                />
                                <div className="flex gap-2">
                                    <Button type="button" onClick={handleAddMiniTask}>
                                        Add
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setShowMiniTaskForm(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            {miniTasks.map((task, index) => (
                                <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                                    <div>
                                        <p className="font-medium">{task.name}</p>
                                        <p className="text-sm text-gray-500">{task.description}</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveMiniTask(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Task Assignments */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Task Assignments</label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <Users className="h-4 w-4" />
                                Add Members
                            </Button>
                        </div>
                        {/* Member selection will be implemented later when we have the team members data */}
                    </div>
                    {/* Links */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium mb-1 block">Links</label>
                        <Input
                            placeholder="Link Title"
                            name="linkName"
                            value={link.linkName}
                            onChange={(e) => setLink({ ...link, linkName: e.target.value })}
                        />
                        <Input
                            placeholder="URL"
                            name="linkUrl"
                            value={link.linkUrl}
                            onChange={(e) => setLink({ ...link, linkUrl: e.target.value })}
                        />
                    </div>
                </form>

                {/* Footer */}
                <div className="border-t p-4">
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Task'}
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}