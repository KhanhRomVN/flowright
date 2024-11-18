import React, { useEffect, useState } from 'react';
import { useTeam } from '@/Context/TeamContext';
import { _GET } from '@/utils/auth_api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { X, Filter, Search } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import TaskDetailsDialog from '@/components/Dialog/TaskDetailsDialog';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
interface TaskAssignment {
    assignmentMemberId: string;
    assigneeUsername: string;
}

interface Task {
    taskId: string;
    taskName: string;
    taskDescription: string;
    creatorId: string;
    creatorUsername: string;
    priority: string;
    projectId: string;
    projectName: string;
    nextTaskId: string | null;
    nextTaskName: string | null;
    previousTaskId: string | null;
    previousTaskName: string | null;
    startDate: string;
    endDate: string | null;
    status: string | null;
    taskAssignments: TaskAssignment[];
}

const TeamPage = () => {
    const { currentTeam } = useTeam();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [selectedTask, setSelectedTask] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [parent] = useAutoAnimate();


    useEffect(() => {
        const fetchTasks = async () => {
            if (!currentTeam) return;

            try {
                const response = await _GET(`/task/service/tasks/team?teamId=${currentTeam.id}`);
                setTasks(response.tasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [currentTeam]);

    if (!currentTeam) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-screen"
            >
                <div className="text-center text-gray-500">No team selected</div>
            </motion.div>
        );
    }

    if (loading) {
        return (
            <div className="p-4 space-y-4">
                <Skeleton height={40} width={200} />
                <Skeleton height={20} width={300} />
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <Skeleton height={30} />
                    <Skeleton height={30} />
                    <Skeleton height={30} />
                </div>
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} height={60} />
                    ))}
                </div>
            </div>
        );
    }

    const handleTaskSelect = (taskId: string) => {
        setSelectedTasks(prev =>
            prev.includes(taskId)
                ? prev.filter(id => id !== taskId)
                : [...prev, taskId]
        );
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedTasks(tasks.map(task => task.taskId));
        } else {
            setSelectedTasks([]);
        }
    };

    const handleClearSelection = () => {
        setSelectedTasks([]);
    };

    const filteredTasks = tasks.filter(task =>
        task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.taskDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.projectName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 h-screen overflow-y-auto custom-scrollbar p-4"
        >
            <motion.div className="flex items-center gap-2 pb-4">
                <Link to="/">
                    <p className="text-sm text-text-secondary">Home /</p>
                </Link>
                <Link to="/team/management">
                    <p className="text-sm text-text-secondary">Team Management /</p>
                </Link>
                <p className="text-sm text-text-secondary">{currentTeam.name}</p>
            </motion.div>
            {/* Header Section */}
            <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="mb-6"
            >
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-bold mb-2 text-text-primary">{currentTeam.name}</h1>
                        <p className="text-text-secondary truncate max-w-2xl">
                            {currentTeam.description}
                        </p>
                        <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-text-secondary">{currentTeam.type}</Badge>
                            <Badge variant="outline" className="text-text-secondary">{currentTeam.status}</Badge>
                        </div>
                    </div>
                    <div className="flex -space-x-2">
                        {[...Array(5)].map((_, i) => (
                            <Avatar key={i} className="border-2 border-background">
                                <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 1}`} />
                                <AvatarFallback>U{i + 1}</AvatarFallback>
                            </Avatar>
                        ))}
                        <Avatar className="border-2 border-background">
                            <AvatarFallback className="bg-muted">+3</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </motion.div>

            {/* Controls Section */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2 items-center">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search tasks..."
                            className="pl-8 w-[300px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </Button>
                </div>
            </div>

            {/* Table Section */}
            <div ref={parent} className="rounded-lg shadow">
                <Table>
                    <TableHeader className="bg-table-header">
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox
                                    checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
                                    onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                                />
                            </TableHead>
                            <TableHead>Task Name</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Assignees</TableHead>
                            <TableHead>Creator</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="bg-table-body ">
                        <AnimatePresence>
                            {filteredTasks.map((task) => (
                                <motion.tr
                                    key={task.taskId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="hover:bg-table-bodyHover"
                                >
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedTasks.includes(task.taskId)}
                                            onCheckedChange={() => handleTaskSelect(task.taskId)}
                                        />
                                    </TableCell>
                                    <TableCell onClick={() => setSelectedTask(task.taskId)} className="cursor-pointer">
                                        <div>
                                            <p className="font-medium">{task.taskName}</p>
                                            <p className="text-text-secondary truncate max-w-xs">
                                                {task.taskDescription}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{task.projectName}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            task.priority === 'high' ? 'destructive' :
                                                task.priority === 'medium' ? 'secondary' :
                                                    'outline'
                                        }>
                                            {task.priority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            task.status === 'completed' ? 'secondary' :
                                                task.status === 'in_progress' ? 'default' :
                                                    'outline'
                                        }>
                                            {task.status || 'Not Started'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {task.startDate ? format(new Date(task.startDate), 'MMM d, yyyy') : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {task.endDate ? format(new Date(task.endDate), 'MMM d, yyyy') : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {task.taskAssignments.map(assignment => (
                                                <Badge key={assignment.assignmentMemberId} variant="outline">
                                                    @{assignment.assigneeUsername}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            @{task.creatorUsername}
                                        </Badge>
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>

            {/* Selection Bar */}
            <AnimatePresence>
                {selectedTasks.length > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg px-4 py-2 flex items-center gap-4 border border-gray-200 dark:border-gray-700"
                    >
                        <X
                            className="w-4 h-4 cursor-pointer hover:text-primary"
                            onClick={handleClearSelection}
                        />
                        <span className="text-sm font-medium">
                            {selectedTasks.length} {selectedTasks.length === 1 ? 'task' : 'tasks'} selected
                        </span>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                Edit
                            </Button>
                            <Button variant="outline" size="sm">
                                Copy to Clipboard
                            </Button>
                            <Button variant="destructive" size="sm">
                                Delete
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Task Details Dialog */}
            <AnimatePresence>
                {selectedTask && (
                    <TaskDetailsDialog
                        open={!!selectedTask}
                        onOpenChange={(open) => !open && setSelectedTask(null)}
                        taskId={selectedTask}
                        teamId={currentTeam.id}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default TeamPage;