import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { differenceInDays, format, isAfter } from 'date-fns';
import {
    MessageSquare,
    Paperclip,
    CheckCircle2,
    Clock,
    AlertCircle,
    Flag,
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TaskAssignment {
    assignmentMemberId: string;
    assigneeUsername: string;
    assigneeEmail: string | null;
}

interface TaskBoardCardProps {
    task: {
        taskId: string;
        taskName: string;
        description?: string;
        priority: string;
        startDate: string;
        endDate: string;
        status: string;
        taskAssignments: any[];
    };
    isLoading?: boolean;
    onClick?: () => void;
}

const getStatusColor = (status: string): string => {
    switch (status) {
        case 'done':
            return 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-600';
        case 'in_progress':
            return 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 dark:border-blue-600';
        case 'todo':
            return 'bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-500 dark:border-gray-600';
        default:
            return 'bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-500 dark:border-gray-600';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'completed':
            return <CheckCircle2 className="w-4 h-4 text-green-500" />;
        case 'in_progress':
            return <Clock className="w-4 h-4 text-blue-500" />;
        case 'todo':
            return <AlertCircle className="w-4 h-4 text-gray-500" />;
        default:
            return null;
    }
};

const getPriorityColor = (priority: string): string => {
    switch (priority.toLowerCase()) {
        case 'high':
            return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200';
        case 'medium':
            return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-200';
        case 'low':
            return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200';
        default:
            return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200';
    }
};

const getPriorityIcon = (priority: string) => {
    const className = cn(
        "w-3 h-3",
        priority === 'high' ? 'text-red-600' :
            priority === 'medium' ? 'text-yellow-600' : 'text-gray-600'
    );
    return <Flag className={className} />;
};

const fakeCommentsCount = 3;
const fakeAttachmentsCount = 2;

const TaskBoardCard: React.FC<TaskBoardCardProps> = ({
    task,
    isLoading = false,
    onClick
}) => {
    const remainingDays = differenceInDays(new Date(task.endDate), new Date());
    const isOverdue = isAfter(new Date(), new Date(task.endDate));
    const statusColor = getStatusColor(task.status);

    if (isLoading) {
        return (
            <Card className="p-3 border shadow-sm">
                <div className="space-y-3">
                    <Skeleton height={20} />
                    <div className="flex justify-between">
                        <Skeleton width={60} height={24} />
                        <Skeleton width={80} height={24} />
                    </div>
                    <Skeleton width={120} />
                    <div className="flex justify-between">
                        <Skeleton width={100} height={24} />
                        <Skeleton circle width={24} height={24} />
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.02 }}
                onClick={onClick}
            >
                <Card className={cn(
                    "p-3",
                    statusColor,
                    "border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                )}>
                    <div className="space-y-2"> {/* Giảm space-y từ 3 xuống 2 */}
                        {/* Header Row: Task Name + Status + Priority */}
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                                <h3 className="font-medium text-sm line-clamp-1 text-gray-800 dark:text-gray-200">
                                    {task.taskName}
                                </h3>
                            </div>
                            <div className="flex items-center gap-1.5"> {/* Giảm gap */}
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Badge className={cn(
                                        "px-1.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1",
                                        getPriorityColor(task.priority)
                                    )}>
                                        {getPriorityIcon(task.priority)}
                                        {task.priority}
                                    </Badge>
                                </motion.div>
                                {getStatusIcon(task.status)}
                            </div>
                        </div>

                        {/* Middle Row: Description (if exists) */}
                        {task.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                {task.description}
                            </p>
                        )}

                        {/* Bottom Row: Dates + Timeline + Assignees */}
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 dark:text-gray-400">
                                    {format(new Date(task.startDate), 'MMM d')} - {format(new Date(task.endDate), 'MMM d')}
                                </span>
                                <span className={cn(
                                    "px-1.5 py-0.5 rounded-full",
                                    isOverdue
                                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                        : remainingDays <= 2
                                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                )}>
                                    {isOverdue ? 'Overdue' : remainingDays === 0 ? 'Due today' : `${remainingDays}d`}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2 text-gray-500">
                                    {fakeCommentsCount !== undefined && (
                                        <div className="flex items-center gap-1">
                                            <MessageSquare className="w-3 h-3" />
                                            {fakeCommentsCount}
                                        </div>
                                    )}
                                    {fakeAttachmentsCount !== undefined && (
                                        <div className="flex items-center gap-1">
                                            <Paperclip className="w-3 h-3" />
                                            {fakeAttachmentsCount}
                                        </div>
                                    )}
                                </div>
                                <div className="flex -space-x-2">
                                    {task.taskAssignments.map((assignment, index) => (
                                        <TooltipProvider key={assignment.assignmentMemberId}>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Avatar className="w-5 h-5 border-2 border-white dark:border-gray-800">
                                                        <AvatarFallback>
                                                            {assignment.assigneeUsername.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{assignment.assigneeUsername}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
};

export default TaskBoardCard;