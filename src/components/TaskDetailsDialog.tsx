import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, Share2, MoreHorizontal, X, Link as LinkIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { Checkbox } from "@/components/ui/checkbox";
import { _GET } from '@/utils/auth_api';

interface MiniTask {
  miniTaskId: string;
  miniTaskName: string;
  miniTaskDescription: string;
  miniTaskStatus: string;
  miniTaskMemberId: string;
  miniTaskMemberUsername: string;
  miniTaskMemberEmail: string;
  taskId: string;
}

interface TaskAssignment {
  assignmentMemberId: string;
  assigneeUsername: string;
  assigneeEmail: string;
}

interface TaskLink {
  taskLinkId: string;
  taskId: string;
  title: string;
  link: string;
}

interface TaskComment {
  commentId: string;
  taskId: string;
  memberId: string;
  memberUsername: string;
  memberEmail: string;
  comment: string;
  createdAt: string;
}

interface TaskLog {
  taskLogId: string;
  taskLogTitle: string;
  taskLogDescription: string;
  taskLogDate: string;
}

interface TaskDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
}

export default function TaskDetailsDialog({ open, onOpenChange, taskId }: TaskDetailsDialogProps) {
  const [task, setTask] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await _GET(`/task/service/tasks?taskId=${taskId}`);
        setTask(response);
      } catch (error) {
        console.error('Error fetching task:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open && taskId) {
      fetchTask();
    }
  }, [taskId, open]);

  if (!task || loading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[80vh] flex flex-col p-0">
        {/* Header */}
        <div className="flex justify-between items-center py-1 px-4 border-b">
          <div className="flex items-center gap-2">
            <Badge variant={
              task.priority === 'high' ? 'destructive' :
                task.priority === 'medium' ? 'secondary' :
                  'outline'
            }>
              {task.priority}
            </Badge>
            <h2 className="text-xl font-semibold">{task.taskName}</h2>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Section - 60% */}
          <div className="w-[60%] pl-6 pr-4 overflow-y-auto border-r custom-scrollbar">
            <div className="space-y-6">
              {/* Task Name */}
              <div>
                <h2 className="text-2xl font-semibold mb-2">{task.taskName}</h2>
              </div>
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{task.taskDescription}</p>
              </div>

              {/* Links */}
              {task.taskLinks && task.taskLinks.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Links</h3>
                  <div className="space-y-2">
                    {task.taskLinks.map((link: TaskLink) => (
                      <div key={link.taskLinkId} className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" />
                        <a href={link.link} target="_blank" rel="noopener noreferrer"
                          className="text-blue-500 hover:underline">
                          {link.title}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mini tasks */}
              {task.miniTasks && task.miniTasks.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Mini tasks</h3>
                  <div className="space-y-2">
                    {task.miniTasks.map((miniTask: MiniTask) => (
                      <div key={miniTask.miniTaskId} className="flex items-center gap-2">
                        <Checkbox checked={miniTask.miniTaskStatus === 'completed'} />
                        <div>
                          <p className="font-medium">{miniTask.miniTaskName} - {`@${miniTask.miniTaskMemberUsername}`}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments and Logs Tabs */}
              <Tabs defaultValue="comments" className="w-full">
                <TabsList>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="logs">Activity Logs</TabsTrigger>
                </TabsList>
                <TabsContent value="comments">
                  {task.taskComments && task.taskComments.length > 0 ? (
                    <div className="space-y-4">
                      {task.taskComments.map((comment: TaskComment) => (
                        <div key={comment.commentId} className="flex gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>{comment.memberUsername[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{comment.memberUsername}</span>
                              <span className="text-sm text-gray-500">
                                {format(new Date(comment.createdAt), 'MMM d, yyyy HH:mm')}
                              </span>
                            </div>
                            <p>{comment.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No comments yet</p>
                  )}
                </TabsContent>
                <TabsContent value="logs">
                  {task.taskLogs && task.taskLogs.length > 0 ? (
                    <div className="space-y-4">
                      {task.taskLogs.map((log: TaskLog) => (
                        <div key={log.taskLogId} className="border-l-2 border-gray-200 pl-4">
                          <div className="font-medium">{log.taskLogTitle}</div>
                          <p className="text-sm text-gray-600">{log.taskLogDescription}</p>
                          <span className="text-sm text-gray-500">
                            {format(new Date(log.taskLogDate), 'MMM d, yyyy HH:mm')}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No activity logs yet</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Section - 40% */}
          <div className="w-[40%] pl-6 pr-4 overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              {/* Status */}
              <div>
                <Badge variant={
                  task.status === 'todo' ? 'default' :
                    task.status === 'in_progress' ? 'secondary' :
                      'outline'
                } className="rounded-lg">
                  <p className="text-xl">{task.status}</p>
                </Badge>
              </div>
              {/* Dates */}
              <div>
                <h3 className="text-base mb-2">Timeline</h3>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 text-gray-500">Start Date:</td>
                      <td className="py-2">
                        {task.startDate ? format(new Date(task.startDate), 'MMM d, yyyy') : 'Not set'}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-500">End Date:</td>
                      <td className="py-2">
                        {task.endDate ? format(new Date(task.endDate), 'MMM d, yyyy') : 'Not set'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Assignments and Creator */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Task Members</h3>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 text-gray-500 align-top">Assigned To:</td>
                      <td className="py-2">
                        <div className="space-y-2">
                          {task.taskAssignments.map((assignment: TaskAssignment) => (
                            <div key={assignment.assignmentMemberId} className="flex items-center gap-2">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>{assignment.assigneeUsername[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{assignment.assigneeUsername}</div>
                                <div className="text-sm text-gray-500">{assignment.assigneeEmail}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-500">Created By:</td>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>{task.creatorUsername[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{task.creatorUsername}</div>
                            <div className="text-sm text-gray-500">{task.creatorEmail}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Task Dependencies */}
              {(task.previousTaskId || task.nextTaskId) && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Task Dependencies</h3>
                  {task.previousTaskId && (
                    <div className="mb-2">
                      <span className="text-gray-500">Previous Task:</span>
                      <span className="ml-2">{task.previousTaskName}</span>
                    </div>
                  )}
                  {task.nextTaskId && (
                    <div>
                      <span className="text-gray-500">Next Task:</span>
                      <span className="ml-2">{task.nextTaskName}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}