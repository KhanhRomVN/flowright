import React, { useState, useEffect } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { X, Plus, Calendar, Users, Link2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { _GET, _POST } from '@/utils/auth_api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';


const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
};

// Types and Interfaces
interface Project {
    id: string;
    name: string;
    description: string;
    ownerId: string;
    ownerUsername: string;
    creatorId: string;
    creatorUsername: string;
    startDate: string;
    endDate: string;
    status: string;
}

interface TaskGroup {
    id: string;
    name: string;
    description: string;
}

interface CreateTaskDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string | null;
    taskGroupId: string | null;
}

interface Team {
    id: string;
    name: string;
    description: string;
    type: string;
    status: string;
    leaderId: string;
    workspaceId: string;
}

interface TeamMember {
    id: string;
    teamId: string;
    memberId: string;
    memberUsername: string;
    memberEmail: string;
}

interface SelectedAssignment {
    teamId: string;
    memberId: string;
    memberUsername: string;
}

interface MiniTask {
    name: string;
    description: string;
    assignee?: SelectedAssignment;
}

interface FormData {
    taskName: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    startDate: string;
    endDate: string;
    selectedProject: string;
    selectedTaskGroup: string;
    selectedTeam: string;
}

interface Link {
    linkName: string;
    linkUrl: string;
}

const DropdownButton = ({
    label,
    value,
    isOpen,
    onClick,
    disabled = false
}: {
    label: string;
    value: string;
    isOpen: boolean;
    onClick: () => void;
    disabled?: boolean;
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="w-full px-3 py-2 text-left bg-white dark:bg-sidebar-secondary border rounded-md flex justify-between items-center"
    >
        <span className="text-sm">{value}</span>
        <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    </button>
);

const DropdownList = ({
    items,
    onSelect,
    renderItem,
    emptyMessage = "No items available"
}: {
    items: any[];
    onSelect: (item: any) => void;
    renderItem: (item: any) => string;
    emptyMessage?: string;
}) => (
    <AnimatePresence>
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeIn}
            className="absolute z-10 w-full mt-1 bg-white dark:bg-sidebar-secondary border rounded-md shadow-lg"
        >
            {items.length > 0 ? (
                <div className="max-h-48 overflow-y-auto">
                    {items.map((item, index) => (
                        <motion.button
                            key={item.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            type="button"
                            onClick={() => onSelect(item)}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 
                                     dark:hover:bg-sidebar-primary transition-colors duration-200"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {renderItem(item)}
                        </motion.button>
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-3 py-2 text-sm text-gray-500"
                >
                    {emptyMessage}
                </motion.div>
            )}
        </motion.div>
    </AnimatePresence>
);

const PrioritySelector = ({
    priority,
    onChange
}: {
    priority: string;
    onChange: (value: string) => void;
}) => (
    <div className="flex gap-2">
        {['low', 'medium', 'high'].map((value) => (
            <Button
                key={value}
                type="button"
                variant={priority === value ? 'default' : 'outline'}
                onClick={() => onChange(value)}
                className={`flex-1 ${priority === value
                    ? `bg-${value === 'low' ? 'green' : value === 'medium' ? 'yellow' : 'red'}-500 
                           hover:bg-${value === 'low' ? 'green' : value === 'medium' ? 'yellow' : 'red'}-600`
                    : `hover:bg-${value === 'low' ? 'green' : value === 'medium' ? 'yellow' : 'red'}-100`
                    }`}
            >
                {value.charAt(0).toUpperCase() + value.slice(1)}
            </Button>
        ))}
    </div>
);

const DateInput = ({
    label,
    value,
    onChange
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) => (
    <div>
        <label className="text-sm font-medium mb-1.5 block">{label}</label>
        <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-10 bg-white dark:bg-sidebar-secondary"
            />
        </div>
    </div>
);

const MemberItem = ({
    member,
    team,
    onRemove
}: {
    member: SelectedAssignment;
    team: Team | undefined;
    onRemove: () => void;
}) => (
    <div className="flex items-center justify-between p-2 bg-white dark:bg-sidebar-secondary rounded-lg border">
        <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <div>
                <p className="text-sm font-medium">{member.memberUsername}</p>
                <p className="text-xs text-gray-500">{team?.name}</p>
            </div>
        </div>
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="hover:bg-sidebar-primary hover:text-white"
        >
            <X className="h-4 w-4" />
        </Button>
    </div>
);

export default function CreateTaskDrawer({
    isOpen,
    onClose,
    projectId,
    taskGroupId
}: CreateTaskDrawerProps) {
    // Form Data State
    const [formData, setFormData] = useState<FormData>({
        taskName: '',
        description: '',
        priority: 'low',
        startDate: '',
        endDate: '',
        selectedProject: projectId || '',
        selectedTaskGroup: taskGroupId || '',
        selectedTeam: '',
    });

    // UI States
    const [dropdownStates, setDropdownStates] = useState({
        project: false,
        taskGroup: false,
        team: false,
        member: false,
    });

    const [uiState, setUiState] = useState({
        isSubmitting: false,
        showMiniTaskForm: false,
        showLinkForm: false,
        showTaskAssignmentForm: false,
        showMiniTaskAssignee: false,
    });

    // Data States
    const [projects, setProjects] = useState<Project[]>([]);
    const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [selectedAssignments, setSelectedAssignments] = useState<SelectedAssignment[]>([]);
    const [miniTasks, setMiniTasks] = useState<MiniTask[]>([]);
    const [links, setLinks] = useState<Link[]>([]);

    // Form States
    const [newMiniTask, setNewMiniTask] = useState<MiniTask>({
        name: '',
        description: '',
    });
    const [newLink, setNewLink] = useState<Link>({
        linkName: '',
        linkUrl: '',
    });

    const [openForms, setOpenForms] = useState({
        assignment: false,
        miniTask: false,
        link: false
    });

    // Utility Functions
    const updateFormData = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleDropdown = (dropdown: keyof typeof dropdownStates) => {
        setDropdownStates(prev => Object.keys(prev).reduce((acc, key) => ({
            ...acc,
            [key]: key === dropdown ? !prev[key as keyof typeof dropdownStates] : false
        }), {} as typeof dropdownStates));
    };

    const toggleUiState = (key: keyof typeof uiState) => {
        setUiState(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Reset Functions
    const resetForm = () => {
        setFormData({
            taskName: '',
            description: '',
            priority: 'low',
            startDate: '',
            endDate: '',
            selectedProject: '',
            selectedTaskGroup: '',
            selectedTeam: '',
        });
        setSelectedAssignments([]);
        setLinks([]);
        setMiniTasks([]);
        setNewMiniTask({ name: '', description: '' });
        setNewLink({ linkName: '', linkUrl: '' });
        Object.keys(uiState).forEach(key => {
            setUiState(prev => ({ ...prev, [key]: false }));
        });
    };

    // API Calls and Effects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await _GET('/project/service/projects');
                setProjects(response);
                if (projectId && response.some((project: Project) => project.id === projectId)) {
                    updateFormData('selectedProject', projectId);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
                toast.error('Failed to load projects');
            }
        };

        fetchProjects();
    }, [projectId]);

    useEffect(() => {
        const fetchTaskGroups = async () => {
            if (!formData.selectedProject) return;
            try {
                const response = await _GET(`/task/service/task-groups?projectId=${formData.selectedProject}`);
                console.log('Task groups response:', response);
                setTaskGroups(response);
                if (taskGroupId && response.some((group: TaskGroup) => group.id === taskGroupId)) {
                    updateFormData('selectedTaskGroup', taskGroupId);
                }
            } catch (error) {
                console.error('Error fetching task groups:', error);
                toast.error('Failed to load task groups');
            }
        };

        fetchTaskGroups();
    }, [formData.selectedProject, taskGroupId]);

    useEffect(() => {
        const fetchTeams = async () => {
            if (!formData.selectedProject) return;
            try {
                const response = await _GET(`/team/service/teams`);
                setTeams(response);
            } catch (error) {
                console.error('Error fetching teams:', error);
                toast.error('Failed to load teams');
            }
        };

        fetchTeams();
    }, [formData.selectedProject]);

    useEffect(() => {
        const fetchTeamMembers = async () => {
            if (!formData.selectedTeam) return;
            try {
                const response = await _GET(`/team/service/teams/members?teamId=${formData.selectedTeam}`);
                setTeamMembers(response);
            } catch (error) {
                console.error('Error fetching team members:', error);
                toast.error('Failed to load team members');
            }
        };

        fetchTeamMembers();
    }, [formData.selectedTeam]);

    // Event Handlers
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.taskName.trim() || !formData.description.trim() || !formData.selectedProject) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setUiState(prev => ({ ...prev, isSubmitting: true }));
            const taskData = {
                name: formData.taskName,
                description: formData.description,
                priority: formData.priority,
                startDate: formData.startDate ? `${formData.startDate}T00:00:00` : null,
                endDate: formData.endDate ? `${formData.endDate}T00:00:00` : null,
                projectId: formData.selectedProject,
                taskGroupId: formData.selectedTaskGroup,
                previousTaskId: null,
                nextTaskId: null,
                taskAssignments: selectedAssignments.map(assignment => ({
                    memberId: assignment.memberId,
                    teamId: assignment.teamId
                })),
                miniTasks: miniTasks.map(task => ({
                    name: task.name,
                    description: task.description,
                    memberId: task.assignee ? task.assignee.memberId : null,
                })),
                taskLinks: links.map(l => ({
                    title: l.linkName,
                    link: l.linkUrl
                }))
            };

            await _POST('/task/service/tasks', taskData);
            toast.success('Task created successfully');
            onClose();
            resetForm();
        } catch (error) {
            console.error('Error creating task:', error);
            toast.error('Failed to create task');
        } finally {
            setUiState(prev => ({ ...prev, isSubmitting: false }));
        }
    };
    return (
        <Drawer
            open={isOpen}
            onClose={onClose}
            direction="right"
            size={450}
            className="p-0"
        >
            <form onSubmit={handleSubmit} className="h-full flex flex-col bg-sidebar-primary">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Create Task</h2>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Task Name */}
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">
                            Task Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={formData.taskName}
                            onChange={(e) => updateFormData('taskName', e.target.value)}
                            className="bg-white dark:bg-sidebar-secondary"
                            placeholder="Enter task name"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => updateFormData('description', e.target.value)}
                            className="bg-white dark:bg-sidebar-secondary min-h-[100px]"
                            placeholder="Enter task description"
                        />
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Priority</label>
                        <PrioritySelector
                            priority={formData.priority}
                            onChange={(value) => updateFormData('priority', value)}
                        />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <DateInput
                            label="Start Date"
                            value={formData.startDate}
                            onChange={(value) => updateFormData('startDate', value)}
                        />
                        <DateInput
                            label="End Date"
                            value={formData.endDate}
                            onChange={(value) => updateFormData('endDate', value)}
                        />
                    </div>

                    {/* Project Selection */}
                    <div className="relative">
                        <label className="text-sm font-medium mb-1.5 block">
                            Project <span className="text-red-500">*</span>
                        </label>
                        <DropdownButton
                            label="Project"
                            value={projects.find(p => p.id === formData.selectedProject)?.name || "Select project"}
                            isOpen={dropdownStates.project}
                            onClick={() => toggleDropdown('project')}
                        />
                        {dropdownStates.project && (
                            <DropdownList
                                items={projects}
                                onSelect={(project) => {
                                    updateFormData('selectedProject', project.id);
                                    toggleDropdown('project');
                                }}
                                renderItem={(project) => project.name}
                            />
                        )}
                    </div>

                    {/* Task Group Selection */}
                    <div className="relative">
                        <label className="text-sm font-medium mb-1.5 block">Task Group</label>
                        <DropdownButton
                            label="Task Group"
                            value={taskGroups.find(g => g.id === formData.selectedTaskGroup)?.name || "Select task group"}
                            isOpen={dropdownStates.taskGroup}
                            onClick={() => toggleDropdown('taskGroup')}
                            disabled={!formData.selectedProject}
                        />
                        {dropdownStates.taskGroup && (
                            <DropdownList
                                items={taskGroups}
                                onSelect={(group) => {
                                    updateFormData('selectedTaskGroup', group.id);
                                    toggleDropdown('taskGroup');
                                }}
                                renderItem={(group) => group.name}
                            />
                        )}
                    </div>

                    {/* Assignments Section */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium">Assignments</label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setOpenForms(prev => ({ ...prev, assignment: true }))}
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                            </Button>
                        </div>
                        <AssignmentForm
                            isOpen={openForms.assignment}
                            onClose={() => setOpenForms(prev => ({ ...prev, assignment: false }))}
                            teams={teams}
                            teamMembers={teamMembers}
                            selectedTeam={formData.selectedTeam}
                            onTeamSelect={(teamId) => updateFormData('selectedTeam', teamId)}
                            onAssignmentAdd={(assignment) => {
                                setSelectedAssignments(prev => [...prev, assignment]);
                            }}
                        />
                        <div className="space-y-2">
                            {selectedAssignments.map((assignment, index) => (
                                <MemberItem
                                    key={`${assignment.teamId}-${assignment.memberId}`}
                                    member={assignment}
                                    team={teams.find(t => t.id === assignment.teamId)}
                                    onRemove={() => {
                                        setSelectedAssignments(prev =>
                                            prev.filter((_, i) => i !== index)
                                        );
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Mini Tasks Section */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium">Mini Tasks</label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setOpenForms(prev => ({ ...prev, miniTask: true }))}
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                            </Button>
                        </div>
                        <MiniTaskForm
                            isOpen={openForms.miniTask}
                            onClose={() => setOpenForms(prev => ({ ...prev, miniTask: false }))}
                            onAdd={(task) => setMiniTasks(prev => [...prev, task])}
                            teams={teams}
                            teamMembers={teamMembers}
                            selectedTeam={formData.selectedTeam}
                            onTeamSelect={(teamId) => updateFormData('selectedTeam', teamId)}
                        />
                        <div className="space-y-2">
                            {miniTasks.map((task, index) => (
                                <div key={index} className="p-2 bg-white dark:bg-sidebar-secondary rounded-lg border">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium">{task.name}</p>
                                            <p className="text-xs text-gray-500">{task.description}</p>
                                            {task.assignee && (
                                                <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                                    <Users className="h-3 w-3" />
                                                    <span>{task.assignee.memberUsername}</span>
                                                </div>
                                            )}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setMiniTasks(prev =>
                                                    prev.filter((_, i) => i !== index)
                                                );
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Links Section */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium">Links</label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setOpenForms(prev => ({ ...prev, link: true }))}
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                            </Button>
                        </div>
                        <LinkForm
                            isOpen={openForms.link}
                            onClose={() => setOpenForms(prev => ({ ...prev, link: false }))}
                            onAdd={(link) => setLinks(prev => [...prev, link])}
                        />
                        <div className="space-y-2">
                            {links.map((link, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-sidebar-secondary rounded-lg border">
                                    <div className="flex items-center gap-2">
                                        <Link2 className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium">{link.linkName}</p>
                                            <p className="text-xs text-gray-500">{link.linkUrl}</p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setLinks(prev =>
                                                prev.filter((_, i) => i !== index)
                                            );
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t">
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={uiState.isSubmitting}
                    >
                        {uiState.isSubmitting ? 'Creating...' : 'Create Task'}
                    </Button>
                </div>
            </form>
        </Drawer>
    );
}


const AssignmentForm = ({
    isOpen,
    onClose,
    teams,
    teamMembers,
    selectedTeam,
    onTeamSelect,
    onAssignmentAdd
}: {
    isOpen: boolean;
    onClose: () => void;
    teams: Team[];
    teamMembers: TeamMember[];
    selectedTeam: string;
    onTeamSelect: (teamId: string) => void;
    onAssignmentAdd: (assignment: SelectedAssignment) => void;
}) => {
    if (!isOpen) return null;

    return (
        <div className="mt-2 p-3 bg-white dark:bg-sidebar-secondary rounded-lg border">
            <div className="space-y-3">
                {/* Team Selection */}
                <div>
                    <label className="text-sm font-medium mb-1.5 block">Select Team</label>
                    <select
                        value={selectedTeam}
                        onChange={(e) => onTeamSelect(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-sidebar-secondary border rounded-md"
                    >
                        <option value="">Select a team</option>
                        {teams.map(team => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                    </select>
                </div>

                {/* Team Members */}
                {selectedTeam && (
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Select Member</label>
                        <div className="space-y-2">
                            {teamMembers.map(member => (
                                <button
                                    key={member.id}
                                    type="button"
                                    className="w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-sidebar-primary rounded-md"
                                    onClick={() => {
                                        onAssignmentAdd({
                                            teamId: selectedTeam,
                                            memberId: member.memberId,
                                            memberUsername: member.memberUsername
                                        });
                                        onClose();
                                    }}
                                >
                                    {member.memberUsername}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const MiniTaskForm = ({
    isOpen,
    onClose,
    onAdd,
    teams,
    teamMembers,
    selectedTeam,
    onTeamSelect,
}: {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (task: MiniTask) => void;
    teams: Team[];
    teamMembers: TeamMember[];
    selectedTeam: string;
    onTeamSelect: (teamId: string) => void;
}) => {
    const [newTask, setNewTask] = useState<MiniTask>({
        name: '',
        description: '',
    });
    const [showAssignee, setShowAssignee] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="mt-2 p-3 bg-white dark:bg-sidebar-secondary rounded-lg border">
            <div className="space-y-3">
                {/* Task Details */}
                <Input
                    placeholder="Task name"
                    value={newTask.name}
                    onChange={(e) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
                />
                <Textarea
                    placeholder="Task description"
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                />

                {/* Assignee Section */}
                <div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAssignee(!showAssignee)}
                        className="w-full justify-between"
                    >
                        <span>
                            {newTask.assignee ? newTask.assignee.memberUsername : 'Add Assignee'}
                        </span>
                        <Users className="h-4 w-4 ml-2" />
                    </Button>

                    {showAssignee && (
                        <div className="mt-2 space-y-2">
                            {/* Team Selection */}
                            <select
                                value={selectedTeam}
                                onChange={(e) => onTeamSelect(e.target.value)}
                                className="w-full px-3 py-2 bg-white dark:bg-sidebar-secondary border rounded-md"
                            >
                                <option value="">Select a team</option>
                                {teams.map(team => (
                                    <option key={team.id} value={team.id}>{team.name}</option>
                                ))}
                            </select>

                            {/* Team Members */}
                            {selectedTeam && (
                                <div className="max-h-32 overflow-y-auto border rounded-md">
                                    {teamMembers.map(member => (
                                        <button
                                            key={member.id}
                                            type="button"
                                            className="w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-sidebar-primary"
                                            onClick={() => {
                                                setNewTask(prev => ({
                                                    ...prev,
                                                    assignee: {
                                                        teamId: selectedTeam,
                                                        memberId: member.memberId,
                                                        memberUsername: member.memberUsername
                                                    }
                                                }));
                                                setShowAssignee(false);
                                            }}
                                        >
                                            {member.memberUsername}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Selected Assignee Display */}
                {newTask.assignee && (
                    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-sidebar-secondary rounded-md">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{newTask.assignee.memberUsername}</span>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setNewTask(prev => ({ ...prev, assignee: undefined }))}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            onClose();
                            setNewTask({ name: '', description: '' });
                            setShowAssignee(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => {
                            if (newTask.name.trim()) {
                                onAdd(newTask);
                                setNewTask({ name: '', description: '' });
                                setShowAssignee(false);
                                onClose();
                            }
                        }}
                    >
                        Add
                    </Button>
                </div>
            </div>
        </div>
    );
};

const LinkForm = ({
    isOpen,
    onClose,
    onAdd
}: {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (link: Link) => void;
}) => {
    const [newLink, setNewLink] = useState<Link>({
        linkName: '',
        linkUrl: ''
    });

    if (!isOpen) return null;

    return (
        <div className="mt-2 p-3 bg-white dark:bg-sidebar-secondary rounded-lg border">
            <div className="space-y-3">
                <Input
                    placeholder="Link name"
                    value={newLink.linkName}
                    onChange={(e) => setNewLink(prev => ({ ...prev, linkName: e.target.value }))}
                />
                <Input
                    placeholder="URL"
                    value={newLink.linkUrl}
                    onChange={(e) => setNewLink(prev => ({ ...prev, linkUrl: e.target.value }))}
                />
                <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
                    <Button
                        size="sm"
                        onClick={() => {
                            if (newLink.linkName.trim() && newLink.linkUrl.trim()) {
                                onAdd(newLink);
                                setNewLink({ linkName: '', linkUrl: '' });
                                onClose();
                            }
                        }}
                    >
                        Add
                    </Button>
                </div>
            </div>
        </div>
    );
};