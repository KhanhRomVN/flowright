import React from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { format } from "date-fns";
import {
    CheckCircle2,
    Clock,
    AlertCircle,
    XCircle,
    Circle,
    Timer,
    ArrowUpCircle,
    MinusCircle,
    ArrowDownCircle
} from "lucide-react";
import { _GET } from "@/utils/auth_api";

const getStatusConfig = (status: string) => {
    const configs = {
        'done': {
            color: 'text-color-green',
            bgColor: 'bg-color-greenOpacity',
            icon: <CheckCircle2 className="w-4 h-4 text-color-green" />
        },
        'in_progress': {
            color: 'text-color-blue',
            bgColor: 'bg-color-blueOpacity',
            icon: <Clock className="w-4 h-4 text-color-blue" />
        },
        'todo': {
            color: 'text-color-gray',
            bgColor: 'bg-color-grayOpacity',
            icon: <Circle className="w-4 h-4 text-color-gray" />
        },
        'overdue': {
            color: 'text-color-red',
            bgColor: 'bg-color-redOpacity',
            icon: <AlertCircle className="w-4 h-4 text-color-red" />
        },
        'overdone': {
            color: 'text-color-purple',
            bgColor: 'bg-color-purpleOpacity',
            icon: <Timer className="w-4 h-4 text-color-purple" />
        },
        'cancel': {
            color: 'text-color-gray',
            bgColor: 'bg-color-grayOpacity',
            icon: <XCircle className="w-4 h-4 text-color-gray" />
        }
    };
    return configs[status as keyof typeof configs] || configs['todo'];
};

const getPriorityConfig = (priority: string) => {
    const configs = {
        'high': {
            color: 'text-color-red',
            bgColor: 'bg-color-redOpacity',
            icon: <ArrowUpCircle className="w-4 h-4 text-color-red" />
        },
        'medium': {
            color: 'text-color-yellow',
            bgColor: 'bg-color-yellowOpacity',
            icon: <MinusCircle className="w-4 h-4 text-color-yellow" />
        },
        'low': {
            color: 'text-color-green',
            bgColor: 'bg-color-greenOpacity',
            icon: <ArrowDownCircle className="w-4 h-4 text-color-green" />
        }
    };
    return configs[priority as keyof typeof configs] || configs['low'];
};

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
    const [taskStats, setTaskStats] = React.useState({
        totalTodo: 0,
        totalInProgress: 0,
        totalDone: 0,
        totalOverdue: 0
    });

    React.useEffect(() => {
        const fetchTaskStats = async () => {
            try {
                const response = await _GET('/task/service/tasks/total-status/member');
                setTaskStats(response);
            } catch (error) {
                console.error('Error fetching task stats:', error);
            }
        };
        fetchTaskStats();
    }, []);

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
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-sidebar-primary rounded-lg p-4 flex items-center gap-3">
                    <div className="bg-blue-500/10 p-2 rounded-full">
                        <Circle className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">To Do</p>
                        <p className="text-2xl font-semibold">{taskStats.totalTodo}</p>
                    </div>
                </div>

                <div className="bg-sidebar-primary rounded-lg p-4 flex items-center gap-3">
                    <div className="bg-yellow-500/10 p-2 rounded-full">
                        <Clock className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">In Progress</p>
                        <p className="text-2xl font-semibold">{taskStats.totalInProgress}</p>
                    </div>
                </div>

                <div className="bg-sidebar-primary rounded-lg p-4 flex items-center gap-3">
                    <div className="bg-green-500/10 p-2 rounded-full">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Completed</p>
                        <p className="text-2xl font-semibold">{taskStats.totalDone}</p>
                    </div>
                </div>

                <div className="bg-sidebar-primary rounded-lg p-4 flex items-center gap-3">
                    <div className="bg-red-500/10 p-2 rounded-full">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Overdue</p>
                        <p className="text-2xl font-semibold">{taskStats.totalOverdue}</p>
                    </div>
                </div>
            </div>
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
                <TableHeader className="bg-table-header">
                    <TableRow>
                        <TableHead className="font-medium">Task Name</TableHead>
                        <TableHead className="font-medium">Project</TableHead>
                        <TableHead className="font-medium">Status</TableHead>
                        <TableHead className="font-medium">Priority</TableHead>
                        <TableHead className="font-medium">Start Date</TableHead>
                        <TableHead className="font-medium">End Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="bg-table-body">
                    {filteredTasks.map((task) => (
                        <TableRow key={task.id} className="hover:bg-table-bodyHover">
                            <TableCell className="flex items-center gap-2">
                                <div>
                                    <div className="font-medium">{task.name}</div>
                                    <div className="text-sm text-muted-foreground">{task.description}</div>
                                </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{task.projectName}</TableCell>
                            <TableCell>
                                {/* Status với icon và màu sắc mới */}
                                <div className="flex">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getStatusConfig(task.status).bgColor}`}>
                                        {getStatusConfig(task.status).icon}
                                        <span className={`text-sm font-medium ${getStatusConfig(task.status).color}`}>
                                            {task.status}
                                        </span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getPriorityConfig(task.priority).bgColor}`}>
                                        {getPriorityConfig(task.priority).icon}
                                        <span className={`text-sm font-medium ${getPriorityConfig(task.priority).color}`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                </div>
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


