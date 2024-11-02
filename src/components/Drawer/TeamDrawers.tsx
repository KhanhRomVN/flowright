import React from 'react';
import Drawer from 'react-modern-drawer';
import { Button } from '@mui/material';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CheckSquare, Users, Calendar, ListTodo } from 'lucide-react';
import TaskCard from '@/components/TaskCard';

interface TeamMember {
    id: number;
    name: string;
    avatar?: string;
    role: string;
}

interface Task {
    id: number;
    name: string;
    description: string;
    status: string;
    priority: string;
    start_date: string;
    end_date: string;
    members: Array<{ member_id: number; name: string }>;
    link?: Array<{ link_id: number; link_name: string; link_url: string }>;
    logs?: Array<{ log_id: number; log_name: string; log_description: string }>;
}

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    tasks?: Task[];
    completedTasks?: Task[];
    teamMembers?: TeamMember[];
    onViewCompletedTasks?: () => void;
}

export const BoardInfoDrawer: React.FC<DrawerProps> = ({ 
    isOpen, 
    onClose, 
    tasks = [], 
    completedTasks = [], 
    teamMembers = [],
    onViewCompletedTasks 
}) => (
    <Drawer
        open={isOpen}
        onClose={onClose}
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
                    onClick={onClose}
                >
                    Close
                </Button>
            </div>

            <div className="space-y-4">
                {/* Team Members Section */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        <h3 className="font-semibold">Team Members</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {teamMembers.map(member => (
                            <div 
                                key={member.id}
                                className="flex items-center gap-2 p-2 rounded-lg border"
                            >
                                <Avatar className="w-8 h-8">
                                    {member.avatar ? (
                                        <AvatarImage src={member.avatar} />
                                    ) : (
                                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                                    )}
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{member.name}</span>
                                    <span className="text-xs text-muted-foreground">{member.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tasks Overview Section */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <ListTodo className="w-5 h-5" />
                        <h3 className="font-semibold">Tasks Overview</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 rounded-lg border">
                            <div className="text-2xl font-bold">{tasks.length}</div>
                            <div className="text-sm text-muted-foreground">Active Tasks</div>
                        </div>
                        <div 
                            className="p-3 rounded-lg border cursor-pointer hover:bg-secondary/50"
                            onClick={onViewCompletedTasks}
                        >
                            <div className="text-2xl font-bold">{completedTasks.length}</div>
                            <div className="text-sm text-muted-foreground">Completed Tasks</div>
                        </div>
                    </div>
                </div>

                {/* Timeline Section */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        <h3 className="font-semibold">Timeline</h3>
                    </div>
                    <div className="p-3 rounded-lg border">
                        {/* Add timeline visualization here */}
                        <div className="text-sm text-muted-foreground">Timeline visualization coming soon...</div>
                    </div>
                </div>
            </div>
        </div>
    </Drawer>
);

export const CompletedTasksDrawer: React.FC<DrawerProps> = ({ 
    isOpen, 
    onClose, 
    completedTasks = []
}) => (
    <Drawer
        open={isOpen}
        onClose={onClose}
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
                    onClick={onClose}
                >
                    Close
                </Button>
            </div>
            
            <div className="space-y-4">
                {completedTasks.map(task => <TaskCard key={task.id} task={task} />)}
            </div>
        </div>
    </Drawer>
);