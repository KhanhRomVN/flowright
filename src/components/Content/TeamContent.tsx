import React from 'react';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { format } from 'date-fns';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Calendar,
    Link as LinkIcon,
    MessageSquare,
    Search,
    UserPlus,
    LayoutGrid,
    List,
    MoreVertical,
    Info,
    CheckSquare
} from 'lucide-react';
import { Button } from '@mui/material';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Fake data for team members
const fakeTeamMembers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', avatar: '/avatars/01.png' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Member', avatar: '/avatars/02.png' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Member', avatar: '/avatars/03.png' },
];

const fakeTeamTasks = [
    { id: 1, name: 'Task 1', description: 'Description 1', team_id: 1, members: [{ member_id: 1, name: 'Member 1' }, { member_id: 2, name: 'Member 2' }], priority: 'High', start_date: '2024-01-01', end_date: '2024-01-05', status: 'not_started', group: null, link: null, logs: [{ log_id: 1, log_name: 'Log 1', log_description: 'Log description 1' }] },
    { id: 2, name: 'Task 2', description: 'Description 2', team_id: 1, members: [{ member_id: 3, name: 'Member 3' }, { member_id: 4, name: 'Member 4' }], priority: 'Medium', start_date: '2024-01-06', end_date: '2024-01-10', status: 'in_progress', group: "Group 1", link: [{ link_id: 1, link_name: 'Link 1', link_url: 'https://www.google.com' }], logs: [{ log_id: 1, log_name: 'Log 1', log_description: 'Log description 1' }, { log_id: 2, log_name: 'Log 2', log_description: 'Log description 2' }] },
    { id: 3, name: 'Task 3', description: 'Description 3', team_id: 1, members: [{ member_id: 5, name: 'Member 5' }, { member_id: 6, name: 'Member 6' }], priority: 'Low', start_date: '2024-01-11', end_date: '2024-01-15', status: 'completed', group: 'Group 2', link: [{ link_id: 1, link_name: 'Link 1', link_url: 'https://www.google.com' }], logs: [{ log_id: 1, log_name: 'Log 1', log_description: 'Log description 1' }, { log_id: 2, log_name: 'Log 2', log_description: 'Log description 2' }] },
];

// Member Management Dialog Component
const MemberManagementDialog: React.FC = () => {
    const [members, setMembers] = React.useState(fakeTeamMembers);
    const [newMember, setNewMember] = React.useState({ name: '', email: '', role: 'Member' });

    const handleAddMember = () => {
        if (newMember.name && newMember.email) {
            setMembers([...members, {
                id: members.length + 1,
                ...newMember,
                avatar: `/avatars/0${(members.length % 3) + 1}.png`
            }]);
            setNewMember({ name: '', email: '', role: 'Member' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Add New Member</h3>
                <div className="space-y-4">
                    <div>
                        <Input
                            placeholder="Name"
                            value={newMember.name}
                            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <Input
                            placeholder="Email"
                            type="email"
                            value={newMember.email}
                            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <Select
                            value={newMember.role}
                            onValueChange={(value) => setNewMember({ ...newMember, role: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Member">Member</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddMember}
                        fullWidth
                    >
                        Add Member
                    </Button>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-4">Team Members</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Member</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell className="flex items-center gap-2">
                                    <Avatar className="w-6 h-6">
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                                    </Avatar>
                                    {member.name}
                                </TableCell>
                                <TableCell>{member.email}</TableCell>
                                <TableCell>{member.role}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={() => setMembers(members.filter(m => m.id !== member.id))}
                                    >
                                        Remove
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

const TeamContent: React.FC = () => {
    const [tasks, setTasks] = React.useState(fakeTeamTasks);
    const [viewMode, setViewMode] = React.useState<'trello' | 'list'>('trello');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [filterPriority, setFilterPriority] = React.useState<string>('all');
    const [isInfoDrawerOpen, setIsInfoDrawerOpen] = React.useState(false);
    const [isCompletedTasksDrawerOpen, setIsCompletedTasksDrawerOpen] = React.useState(false);

    const groups = React.useMemo(() => {
        const uniqueGroups = new Set(tasks.map(task => task.group || 'Ungrouped'));
        return Array.from(uniqueGroups);
    }, [tasks]);

    // Get completed tasks
    const completedTasks = React.useMemo(() => {
        return tasks.filter(task => task.status === 'completed');
    }, [tasks]);

    const filteredTasks = React.useMemo(() => {
        return tasks.filter(task => {
            const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPriority = filterPriority === 'all' || task.priority.toLowerCase() === filterPriority.toLowerCase();
            return matchesSearch && matchesPriority;
        });
    }, [tasks, searchQuery, filterPriority]);

    const renderTaskCard = (task: typeof fakeTeamTasks[0]) => (
        <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm">{task.name}</CardTitle>
                <CardDescription className="text-xs">
                    {task.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex items-center gap-2 mb-2">
                    <Badge variant={
                        task.status === 'completed' ? 'secondary' :
                            task.status === 'in_progress' ? 'default' :
                                'outline'
                    }>
                        {task.status === 'not_started' ? 'To Do' :
                            task.status === 'in_progress' ? 'In Progress' :
                                'Completed'}
                    </Badge>
                    <Badge variant={
                        task.priority === 'High' ? 'destructive' :
                            task.priority === 'Medium' ? 'secondary' :
                                'secondary'
                    }>
                        {task.priority}
                    </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(task.start_date), 'MMM d')} - {format(new Date(task.end_date), 'MMM d')}</span>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <div className="flex -space-x-2">
                        {task.members.map((member, index) => (
                            <Avatar key={member.member_id} className="w-6 h-6 border-2 border-background">
                                <AvatarFallback>{member.name[0]}</AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        {task.link && (
                            <Button variant="outlined" size="small" startIcon={<LinkIcon size={14} />}>
                                {task.link.length}
                            </Button>
                        )}
                        {task.logs && (
                            <Button variant="outlined" size="small" startIcon={<MessageSquare size={14} />}>
                                {task.logs.length}
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const BoardInfoDrawer = () => (
        <Drawer
            open={isInfoDrawerOpen}
            onClose={() => setIsInfoDrawerOpen(false)}
            direction="right"
            className="p-4"
            size={400}
        >
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Board Information</h2>
                    <Button 
                        variant="outlined"
                        size="small"
                        onClick={() => setIsInfoDrawerOpen(false)}
                    >
                        Close
                    </Button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium mb-2">Statistics</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-secondary p-3 rounded-lg">
                                <p className="text-sm text-muted-foreground">Total Tasks</p>
                                <p className="text-2xl font-bold">{tasks.length}</p>
                            </div>
                            <div className="bg-secondary p-3 rounded-lg">
                                <p className="text-sm text-muted-foreground">Completed</p>
                                <p className="text-2xl font-bold">{completedTasks.length}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium mb-2">Team Members</h3>
                        <div className="space-y-2">
                            {fakeTeamMembers.map(member => (
                                <div key={member.id} className="flex items-center gap-2">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">{member.name}</p>
                                        <p className="text-xs text-muted-foreground">{member.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        variant="outlined"
                        startIcon={<CheckSquare size={16} />}
                        onClick={() => {
                            setIsCompletedTasksDrawerOpen(true);
                            setIsInfoDrawerOpen(false);
                        }}
                        fullWidth
                    >
                        View Completed Tasks
                    </Button>
                </div>
            </div>
        </Drawer>
    );

    const CompletedTasksDrawer = () => (
        <Drawer
            open={isCompletedTasksDrawerOpen}
            onClose={() => setIsCompletedTasksDrawerOpen(false)}
            direction="right"
            className="p-4"
            size={400}
        >
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Completed Tasks</h2>
                    <Button 
                        variant="outlined"
                        size="small"
                        onClick={() => setIsCompletedTasksDrawerOpen(false)}
                    >
                        Close
                    </Button>
                </div>
                
                <div className="space-y-4">
                    {completedTasks.map(task => renderTaskCard(task))}
                </div>
            </div>
        </Drawer>
    );

    return (
        <div className="p-6">
            {/* First row: Title, Members, Add buttons */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">Team Tasks</h1>
                    <div className="flex items-center gap-2">
                        {fakeTeamMembers.slice(0, 3).map((member) => (
                            <Avatar key={member.id} className="w-8 h-8">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>{member.name[0]}</AvatarFallback>
                            </Avatar>
                        ))}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outlined" startIcon={<UserPlus size={16} />}>
                                    Manage Members
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[800px]">
                                <DialogHeader>
                                    <DialogTitle>Team Members</DialogTitle>
                                </DialogHeader>
                                <MemberManagementDialog />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="contained" color="primary">Add Task</Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outlined" size="small">
                                <MoreVertical size={16} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setIsInfoDrawerOpen(true)}>
                                <Info className="mr-2 h-4 w-4" />
                                <span>Board Information</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsCompletedTasksDrawerOpen(true)}>
                                <CheckSquare className="mr-2 h-4 w-4" />
                                <span>View Completed Tasks</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Second row: Search and filters */}
            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 bg-secondary rounded-lg p-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                        className="border-0 bg-transparent w-40"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
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
                <Button
                    variant="outlined"
                    onClick={() => setViewMode(viewMode === 'trello' ? 'list' : 'trello')}
                    startIcon={viewMode === 'trello' ? <List size={16} /> : <LayoutGrid size={16} />}
                >
                    {viewMode === 'trello' ? 'List View' : 'Board View'}
                </Button>
            </div>

            {/* Tasks content */}
            {viewMode === 'trello' ? (
                <div className="flex gap-4 overflow-x-auto">
                    {groups.map(groupName => (
                        <div 
                            key={groupName}
                            className="flex-shrink-0 w-80"
                        >
                            <div className="bg-secondary p-4 rounded-lg">
                                <h2 className="font-semibold mb-4">{groupName}</h2>
                                <div className="flex flex-col gap-3">
                                    {filteredTasks
                                        .filter(task => (task.group || 'Ungrouped') === groupName)
                                        .filter(task => task.status !== 'completed')
                                        .map(renderTaskCard)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filteredTasks
                        .filter(task => task.status !== 'completed')
                        .map(renderTaskCard)}
                </div>
            )}

            {/* Drawers */}
            <BoardInfoDrawer />
            <CompletedTasksDrawer />
        </div>
    );
};

export default TeamContent;