import React from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { format } from "date-fns";
import { _GET } from "@/utils/auth_api";


interface Task {
    id: string;
    name: string;
    description: string;
    status: string;
    priority: string;
    projectId: string;
    projectName: string;
    startDate: string;
    endDate: string;
}

const TeamContent: React.FC = () => {
    const [tasks, setTasks] = React.useState<Task[]>([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [filterPriority, setFilterPriority] = React.useState<string>('all');
    const [filterProject, setFilterProject] = React.useState<string>('all');
    const [filterStatus, setFilterStatus] = React.useState<string>('all');
    const [filterDate, setFilterDate] = React.useState<string>('all');


    // Fetch tasks from API
    React.useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await _GET('/task/service/tasks/member');
                setTasks(response);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchTasks();
    }, []);

    const filteredTasks = React.useMemo(() => {
        return tasks.filter(task => {
            const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPriority = filterPriority === 'all' || task.priority.toLowerCase() === filterPriority.toLowerCase();
            const matchesProject = filterProject === 'all' || task.projectId === filterProject;
            const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
            const matchesDate = filterDate === 'all' || true;

            return matchesSearch && matchesPriority && matchesProject && matchesStatus && matchesDate;
        });
    }, [tasks, searchQuery, filterPriority, filterProject, filterStatus, filterDate]);

    const projectOptions = React.useMemo(() => {
        const uniqueProjects = Array.from(new Set(tasks.map(task => task.projectId)));
        return uniqueProjects;
    }, [tasks]);

    return (
        <div className="p-6">
            {/* Search and filters */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex items-center">
                    <div className="absolute left-3 text-gray-400">
                        <Search className="w-4 h-4" />
                    </div>
                    <Input
                        className="w-64 pl-9 pr-4 h-10 bg-sidebar-primary transition-colors border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-primary"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <Select value={filterPriority} onValueChange={setFilterPriority}>
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

                    <Select value={filterProject} onValueChange={setFilterProject}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Project" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Projects</SelectItem>
                            {projectOptions.map(projectId => (
                                <SelectItem key={projectId} value={projectId}>
                                    {tasks.find(t => t.projectId === projectId)?.projectName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="todo">To Do</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filterDate} onValueChange={setFilterDate}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Date Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Dates</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="this_week">This Week</SelectItem>
                            <SelectItem value="this_month">This Month</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Tasks Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-medium">Task Name</TableHead>
                        <TableHead className="font-medium">Project</TableHead>
                        <TableHead className="font-medium">Status</TableHead>
                        <TableHead className="font-medium">Priority</TableHead>
                        <TableHead className="font-medium">Start Date</TableHead>
                        <TableHead className="font-medium">End Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredTasks.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell className="flex items-center gap-2">
                                <div>
                                    <div className="font-medium">{task.name}</div>
                                    <div className="text-sm text-muted-foreground">{task.description}</div>
                                </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{task.projectName}</TableCell>
                            <TableCell>
                                <Badge variant={
                                    task.status === 'completed' ? 'outline' :
                                        task.status === 'in_progress' ? 'default' :
                                            'outline'
                                } className="bg-transparent">
                                    {task.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={
                                    task.priority === 'high' ? 'destructive' :
                                        task.priority === 'medium' ? 'outline' :
                                            'outline'
                                } className={task.priority !== 'high' ? 'bg-transparent' : ''}>
                                    {task.priority}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                {format(new Date(task.startDate), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                {format(new Date(task.endDate), 'MMM d, yyyy')}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default TeamContent;


