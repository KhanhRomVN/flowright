import React from 'react';
import { format } from 'date-fns';
import { Calendar, LinkIcon, MessageSquare } from 'lucide-react';
import { Button } from '@mui/material';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import TaskDialog from './Dialog/TaskDialog';

interface TaskCardProps {
    task: {
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
    };
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    return (
        <>
            <Card
                key={task.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                    task.status === 'completed' ? 'bg-color-greenOpacity' :
                    task.status === 'in_progress' ? 'bg-color-blueOpacity' :
                    'bg-transparent'
                }`}
                onClick={() => setIsDialogOpen(true)}
            >
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
                            {task.members.map((member) => (
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

            <TaskDialog 
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                task={task}
            />
        </>
    );
};

export default TaskCard;