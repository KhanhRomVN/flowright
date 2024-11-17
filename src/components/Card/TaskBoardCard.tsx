import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { differenceInDays, format } from 'date-fns';

interface TaskBoardCardProps {
  task: {
    taskId: string;
    taskName: string;
    priority: string;
    startDate: string;
    endDate: string;
    status: string;
    taskAssignments: any[];
  };
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'bg-green-50 dark:bg-green-900/20';
    case 'in_progress':
      return 'bg-blue-50 dark:bg-blue-900/20';
    case 'todo':
      return 'bg-gray-50 dark:bg-gray-800/50';
    default:
      return 'bg-gray-50 dark:bg-gray-800/50';
  }
};

const getPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'secondary';
    default:
      return 'outline';
  }
};

const TaskBoardCard: React.FC<TaskBoardCardProps> = ({ task }) => {
  const remainingDays = differenceInDays(new Date(task.endDate), new Date(task.startDate));
  const statusColor = getStatusColor(task.status);

  return (
    <Card className={`p-3 ${statusColor} border shadow-sm hover:shadow-md transition-shadow`}>
      <div className="space-y-2">
        {/* Task Name */}
        <h3 className="font-medium text-sm line-clamp-2">
          {task.taskName}
        </h3>

        {/* Priority and Timeline */}
        <div className="flex items-center justify-between gap-2">
          <Badge variant={getPriorityColor(task.priority) as any}>
            {task.priority}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {remainingDays > 0 ? `${remainingDays} days` : 'Due today'}
          </span>
        </div>

        {/* Dates */}
        <div className="text-xs text-muted-foreground">
          {format(new Date(task.startDate), 'MMM d')} - {format(new Date(task.endDate), 'MMM d')}
        </div>
      </div>
    </Card>
  );
};

export default TaskBoardCard;