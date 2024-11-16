import React, { useEffect, useState } from 'react';
import { useTeam } from '@/Context/TeamContext';
import { _GET } from '@/utils/auth_api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import TaskDetailsDialog from '@/components/TaskDetailsDialog';
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
    taskGroupId: string | null;
    taskGroupName: string | null;
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
        return <div>No team selected</div>;
    }

    if (loading) {
        return <div>Loading...</div>;
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

    return (
        <div className="flex-1 h-screen overflow-y-auto custom-scrollbar p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">{currentTeam.name}</h1>
                <p className="text-gray-500">{currentTeam.description}</p>
                <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{currentTeam.type}</Badge>
                    <Badge variant="outline">{currentTeam.status}</Badge>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                            <Checkbox
                                checked={selectedTasks.length === tasks.length && tasks.length > 0}
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
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow key={task.taskId}>
                            <TableCell>
                                <Checkbox
                                    checked={selectedTasks.includes(task.taskId)}
                                    onCheckedChange={() => handleTaskSelect(task.taskId)}
                                />
                            </TableCell>
                            <TableCell onClick={() => setSelectedTask(task.taskId)} className="cursor-pointer">
                                <div>
                                    <div className="font-medium">{task.taskName}</div>
                                    <div className="text-sm text-gray-500">{task.taskDescription}</div>
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
                                {task.taskAssignments.map(assignment =>
                                    `@${assignment.assigneeUsername} `
                                ).join(', ')}
                            </TableCell>
                            <TableCell>
                                {`@${task.creatorUsername}`}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* Navigation Bar */}
            {selectedTasks.length > 0 && (
                <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg px-4 py-1 flex items-center gap-4 border border-gray-200 dark:border-gray-700">
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
                        <Button variant="outline" size="sm">
                            Delete
                        </Button>
                    </div>
                </div>
            )}
            {selectedTask && (
                <TaskDetailsDialog
                    open={!!selectedTask}
                    onOpenChange={(open) => !open && setSelectedTask(null)}
                    taskId={selectedTask}
                />
            )}
        </div>
    );
};

export default TeamPage;