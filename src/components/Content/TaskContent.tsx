import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

interface Task {
    id: number;
    name: string;
    description: string;
    team_id: number;
    team_name: string;
    status: 'not_started' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    start_date: string;
    end_date: string;
}

const fakeMyListTaskData: Task[] = [
    { id: 1, name: 'Task 1', description: 'Description 1', team_id: 1, team_name: 'Team 1', status: 'not_started', priority: 'high', start_date: '2024-01-01', end_date: '2024-01-01' },
    { id: 2, name: 'Task 2', description: 'Description 2', team_id: 1, team_name: 'Team 1', status: 'in_progress', priority: 'medium', start_date: '2024-01-01', end_date: '2024-01-01' },
    { id: 3, name: 'Task 3', description: 'Description 3', team_id: 1, team_name: 'Team 1', status: 'completed', priority: 'low', start_date: '2024-01-01', end_date: '2024-01-01' },
    { id: 4, name: 'Task 4', description: 'Description 4', team_id: 1, team_name: 'Team 1', status: 'completed', priority: 'low', start_date: '2024-01-01', end_date: '2024-01-01' },
    { id: 5, name: 'Task 5', description: 'Description 5', team_id: 1, team_name: 'Team 1', status: 'completed', priority: 'low', start_date: '2024-01-01', end_date: '2024-01-01' },
];

const TaskContent: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(fakeMyListTaskData);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [teamFilter, setTeamFilter] = useState('all');

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = 
            task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
        const matchesTeam = teamFilter === 'all' || task.team_name === teamFilter;
        
        return matchesSearch && matchesStatus && matchesPriority && matchesTeam;
    });

    const handleDeleteTask = (taskId: number) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    return (
        <div className="p-4 space-y-4">
            {/* Header with Search and Filters */}
            <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <Input
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 w-64"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="not_started">Not Started</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Priority</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={teamFilter} onValueChange={setTeamFilter}>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Team" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Teams</SelectItem>
                            <SelectItem value="Team 1">Team 1</SelectItem>
                            <SelectItem value="Team 2">Team 2</SelectItem>
                            <SelectItem value="Team 3">Team 3</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button className="flex items-center gap-2">
                    <Plus size={16} />
                    Create Task
                </Button>
            </div>

            {/* Tasks Table */}
            <Card>
                <Table>
                    <TableHeader className="bg-table-headerBackground">
                        <TableRow>
                            <TableHead>Task Name</TableHead>
                            <TableHead>Team</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Timeline</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="bg-table-bodyBackground">
                        {filteredTasks.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell>
                                    <div>
                                        <div className="font-medium">{task.name}</div>
                                        <div className="text-sm text-gray-500">{task.description}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{task.team_name}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        task.status === 'completed' ? 'secondary' :
                                        task.status === 'in_progress' ? 'default' :
                                        'outline'
                                    }>
                                        {task.status.replace('_', ' ')}
                                    </Badge>
                                </TableCell>
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
                                    <div className="text-sm">
                                        {format(new Date(task.start_date), 'MMM d, yyyy')} - 
                                        {format(new Date(task.end_date), 'MMM d, yyyy')}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeleteTask(task.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
};

export default TaskContent;