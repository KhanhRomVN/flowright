import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, Share2, MoreHorizontal, X, Link as LinkIcon, Check, Save, XCircle, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { Checkbox } from "@/components/ui/checkbox";
import { _GET, _POST, _PUT, _DELETE } from '@/utils/auth_api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


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
  const [isEditingName, setIsEditingName] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [isEditingEndDate, setIsEditingEndDate] = useState(false);
  const [newEndDate, setNewEndDate] = useState("");
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

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

  const handleUpdateTaskName = async () => {
    try {
      await _PUT(`/task/service/tasks/name`, {
        taskId: taskId,
        name: newTaskName
      });
      setTask({ ...task, taskName: newTaskName });
      setIsEditingName(false);
    } catch (error) {
      console.error('Error updating task name:', error);
    }
  };

  const handleUpdateDescription = async () => {
    try {
      await _PUT(`/task/service/tasks/description`, {
        taskId: taskId,
        description: newDescription
      });
      setTask({ ...task, taskDescription: newDescription });
      setIsEditingDescription(false);
    } catch (error) {
      console.error('Error updating task description:', error);
    }
  };

  const handleUpdatePriority = async (newPriority: string) => {
    try {
      await _PUT(`/task/service/tasks/priority`, {
        taskId: taskId,
        priority: newPriority
      });
      setTask({ ...task, priority: newPriority });
    } catch (error) {
      console.error('Error updating task priority:', error);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      await _PUT(`/task/service/tasks/status`, {
        taskId: taskId,
        status: newStatus
      });
      setTask({ ...task, status: newStatus });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleUpdateEndDate = async () => {
    try {
      await _PUT(`/task/service/tasks/endDate`, {
        taskId: taskId,
        endDate: newEndDate
      });
      setTask({ ...task, endDate: newEndDate });
      setIsEditingEndDate(false);
    } catch (error) {
      console.error('Error updating end date:', error);
    }
  };

  const handleAddLink = async () => {
    try {
      await _POST(`/task/service/task-links?taskId=${taskId}`, {
        title: newLinkTitle,
        link: newLinkUrl
      });

      // Update the task state with the new link
      setTask({
        ...task,
        taskLinks: [...task.taskLinks, {
          taskLinkId: Date.now().toString(), // Temporary ID until refresh
          taskId: taskId,
          title: newLinkTitle,
          link: newLinkUrl
        }]
      });

      // Reset form
      setNewLinkTitle("");
      setNewLinkUrl("");
      setIsAddingLink(false);
    } catch (error) {
      console.error('Error adding link:', error);
    }
  };

  const handleDeleteLink = async (taskLinkId: string) => {
    try {
      await _DELETE(`/task/service/task-links?taskLinkId=${taskLinkId}`);

      // Update the local state by filtering out the deleted link
      setTask({
        ...task,
        taskLinks: task.taskLinks.filter((link: TaskLink) => link.taskLinkId !== taskLinkId)
      });
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[80vh] flex flex-col p-0">
        {/* Header */}
        <div className="flex justify-between items-center py-1 px-4 border-b">
          <div className="flex items-center gap-2">
            <div>
              <Select
                value={task.priority}
                onValueChange={handleUpdatePriority}
              >
                <SelectTrigger>
                  <Badge variant={
                    task.priority === 'high' ? 'destructive' :
                      task.priority === 'medium' ? 'secondary' :
                        'outline'
                  }>
                    {task.priority}
                  </Badge>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      className="text-2xl font-semibold mb-2 bg-transparent border-b border-gray-300 focus:outline-none focus:border-primary"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleUpdateTaskName}
                      className="mb-2"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <h2
                    className="text-2xl font-semibold mb-2 cursor-pointer hover:text-primary"
                    onClick={() => {
                      setIsEditingName(true);
                      setNewTaskName(task.taskName);
                    }}
                  >
                    {task.taskName}
                  </h2>
                )}
              </div>
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                {isEditingDescription ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="w-full p-2 text-gray-600 border rounded-md focus:outline-none focus:border-primary"
                      rows={4}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleUpdateDescription}
                        className="flex items-center gap-1"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingDescription(false)}
                        className="flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p
                    className="text-gray-600 cursor-pointer hover:text-primary"
                    onClick={() => {
                      setIsEditingDescription(true);
                      setNewDescription(task.taskDescription);
                    }}
                  >
                    {task.taskDescription}
                  </p>
                )}
              </div>

              {/* Links */}
              {task.taskLinks && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Links</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAddingLink(true)}
                      className="flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {isAddingLink && (
                    <div className="mb-4 space-y-2">
                      <input
                        type="text"
                        placeholder="Title"
                        value={newLinkTitle}
                        onChange={(e) => setNewLinkTitle(e.target.value)}
                        className="w-full p-2 text-sm border rounded-md"
                      />
                      <input
                        type="url"
                        placeholder="URL"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        className="w-full p-2 text-sm border rounded-md"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddLink}
                          className="flex items-center gap-1"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsAddingLink(false)}
                          className="flex items-center gap-1"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {task.taskLinks.map((link: TaskLink) => (
                      <div key={link.taskLinkId} className="flex items-center gap-2 group">
                        <LinkIcon className="w-4 h-4" />
                        <a href={link.link} target="_blank" rel="noopener noreferrer"
                          className="text-blue-500 hover:underline flex-grow">
                          {link.title}
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteLink(link.taskLinkId)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                        </Button>
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
                <Select
                  value={task.status}
                  onValueChange={handleUpdateStatus}
                >
                  <SelectTrigger>
                    <Badge variant={
                      task.status === 'todo' ? 'default' :
                        task.status === 'in_progress' ? 'secondary' :
                          'outline'
                    } className="rounded-lg">
                      <p className="text-xl">{task.status}</p>
                    </Badge>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">Todo</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Dates */}
              <div>
                <h3 className="text-base mb-2">Timeline</h3>
                <table className="w-full border-collapse">
                  <tbody>
                    {/* Start Date */}
                    <tr className="border-b">
                      <td className="py-2 text-gray-500">Start Date:</td>
                      <td className="py-2">
                        {task.startDate ? format(new Date(task.startDate), 'MMM d, yyyy') : 'Not set'}
                      </td>
                    </tr>
                    {/* End Date */}
                    <tr className="border-b">
                      <td className="py-2 text-gray-500">End Date:</td>
                      <td className="py-2">
                        {isEditingEndDate ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="date"
                              value={newEndDate}
                              onChange={(e) => setNewEndDate(e.target.value)}
                              className="border rounded p-1"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleUpdateEndDate}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <span
                            className="cursor-pointer hover:text-primary"
                            onClick={() => {
                              setIsEditingEndDate(true);
                              setNewEndDate(task.endDate);
                            }}
                          >
                            {task.endDate ? format(new Date(task.endDate), 'MMM d, yyyy') : 'Not set'}
                          </span>
                        )}
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