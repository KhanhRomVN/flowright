import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  Share2,
  MoreHorizontal,
  X,
  Link as LinkIcon,
  Check,
  Save,
  XCircle,
  Plus,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  CircleDashed,
  Users,
  UserPlus,
  Link2,
  MessageSquare,
  Activity,
  ChevronRight,
  ChevronLeft,
  Edit,
  Trash2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { Checkbox } from "@/components/ui/checkbox";
import { _GET, _POST, _PUT, _DELETE } from '@/utils/auth_api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from 'framer-motion';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'react-toastify';
import { ScrollArea } from "@/components/ui/scroll-area";


// Interfaces
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
  assigneeAvatar?: string;
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
  memberAvatar?: string;
  comment: string;
  createdAt: string;
}

interface TaskLog {
  taskLogId: string;
  taskLogTitle: string;
  taskLogDescription: string;
  taskLogDate: string;
  logType: 'create' | 'update' | 'delete' | 'complete';
}

interface TeamMember {
  id: string;
  teamId: string;
  memberId: string;
  memberUsername: string;
  memberEmail: string;
}

interface WorkspaceMember {
  id: string;
  email: string;
  username: string;
}

interface TaskDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  teamId: string | null;
  onTaskUpdate?: () => void;
}

// Main Component
export default function TaskDetailsDialog({
  open,
  onOpenChange,
  taskId,
  onTaskUpdate
}: TaskDetailsDialogProps) {
  // States
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
  const [isAddingMiniTask, setIsAddingMiniTask] = useState(false);
  const [newMiniTaskName, setNewMiniTaskName] = useState("");
  const [newMiniTaskDescription, setNewMiniTaskDescription] = useState("");
  const [newComment, setNewComment] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isAddingMembers, setIsAddingMembers] = useState(false);

  // Refs for animations
  const [parentRef] = useAutoAnimate<HTMLDivElement>();
  const [linksRef] = useAutoAnimate<HTMLDivElement>();
  const [miniTasksRef] = useAutoAnimate<HTMLDivElement>();
  const [commentsRef] = useAutoAnimate<HTMLDivElement>();

  // Fetch task data
  React.useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
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

  React.useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await _GET(`/member/service/members/workspace/simple`);
        console.log(response);
        const existingMemberIds = task.taskAssignments.map(
          (assignment: TaskAssignment) => assignment.assignmentMemberId
        );
        const availableMembers = response.filter(
          (member: WorkspaceMember) => !existingMemberIds.includes(member.id)
        );
        // Transform the data to match the existing TeamMember interface
        const transformedMembers = availableMembers.map((member: WorkspaceMember) => ({
          id: member.id,
          teamId: '', // No longer needed
          memberId: member.id,
          memberUsername: member.username,
          memberEmail: member.email
        }));
        setTeamMembers(transformedMembers);
      } catch (error) {
        console.error('Error fetching workspace members:', error);
      }
    };

    if (showMemberDropdown) {
      fetchTeamMembers();
    }
  }, [showMemberDropdown, task]);

  // Loading state
  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[90vw] max-h-[80vh] flex flex-col p-0">
          <LoadingTaskDialog />
        </DialogContent>
      </Dialog>
    );
  }

  if (!task) {
    return null;
  }

  const handleAddMembers = async () => {
    try {
      setIsAddingMembers(true);
      await _POST(`/task/service/task-assignments?taskId=${taskId}`, {
        memberIds: selectedMembers
      });

      // Update local state with new assignments
      const newAssignments = selectedMembers.map(memberId => {
        const member = teamMembers.find(m => m.memberId === memberId);
        return {
          assignmentMemberId: memberId,
          assigneeUsername: member?.memberUsername,
          assigneeEmail: member?.memberEmail
        };
      });

      setTask({
        ...task,
        taskAssignments: [...task.taskAssignments, ...newAssignments]
      });

      // Reset states
      setSelectedMembers([]);
      setShowMemberDropdown(false);
      toast.success('Members added successfully');
    } catch (error) {
      console.error('Error adding members:', error);
      toast.error('Failed to add members');
    } finally {
      setIsAddingMembers(false);
    }
  };

  // Handlers
  const handleUpdateTaskName = async () => {
    try {
      setIsSaving(true);
      await _PUT(`/task/service/tasks/name`, {
        taskId: taskId,
        name: newTaskName
      });
      setTask({ ...task, taskName: newTaskName });
      setIsEditingName(false);
      onTaskUpdate?.();
      toast.success('Task name updated successfully');
    } catch (error) {
      console.error('Error updating task name:', error);
    } finally {
      setIsSaving(false);
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
      toast.success('Task description updated successfully');
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
      toast.success('Task priority updated successfully');
    } catch (error) {
      console.error('Error updating task priority:', error);
    }
  };

  const handleUpdateStatus = async (status: 'done' | 'cancel') => {
    try {
      await _PUT(`/task/service/tasks/status`, {
        taskId: taskId,
        status: status
      });

      toast.success(`Task marked as ${status}`);

    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
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
      toast.success('Task end date updated successfully');
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
      toast.success('Link added successfully');
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
      toast.success('Link deleted successfully');
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const handleAddMiniTask = async () => {
    try {
      await _POST(`/task/service/mini-tasks?taskId=${taskId}`, {
        name: newMiniTaskName,
        description: newMiniTaskDescription
      });

      // Update the task state with the new mini task
      setTask({
        ...task,
        miniTasks: [...task.miniTasks, {
          miniTaskId: Date.now().toString(), // Temporary ID until refresh
          miniTaskName: newMiniTaskName,
          miniTaskDescription: newMiniTaskDescription,
          miniTaskStatus: 'in_progress',
          miniTaskMemberId: '', // These will be updated when the page refreshes
          miniTaskMemberUsername: '',
          miniTaskMemberEmail: '',
          taskId: taskId
        }]
      });

      // Reset form
      setNewMiniTaskName("");
      setNewMiniTaskDescription("");
      setIsAddingMiniTask(false);
      toast.success('Mini task added successfully');
    } catch (error) {
      console.error('Error adding mini task:', error);
    }
  };

  const handleDeleteMiniTask = async (miniTaskId: string) => {
    try {
      await _DELETE(`/task/service/mini-tasks?miniTaskId=${miniTaskId}`);

      setTask({
        ...task,
        miniTasks: task.miniTasks.filter((miniTask: MiniTask) => miniTask.miniTaskId !== miniTaskId)
      });
      toast.success('Mini task deleted successfully');
    } catch (error) {
      console.error('Error deleting mini task:', error);
    }
  };

  const handleMiniTaskStatusChange = async (miniTaskId: string, isChecked: boolean) => {
    try {
      console.log(miniTaskId);
      const newStatus = isChecked ? 'done' : 'in_progress';
      await _PUT(`/task/service/mini-tasks?miniTaskId=${miniTaskId}`, {
        status: newStatus
      });

      // Cập nhật state local
      setTask({
        ...task,
        miniTasks: task.miniTasks.map((miniTask: MiniTask) =>
          miniTask.miniTaskId === miniTaskId
            ? { ...miniTask, miniTaskStatus: newStatus }
            : miniTask
        )
      });
      toast.success('Mini task status updated successfully');
    } catch (error) {
      console.error('Error updating mini task status:', error);
    }
  };

  const handleAddComment = async () => {
    try {
      await _POST(`/task/service/task-comments?taskId=${taskId}`, {
        comment: newComment
      });

      // Update local state with new comment
      setTask({
        ...task,
        taskComments: [...task.taskComments, {
          commentId: Date.now().toString(), // Temporary ID until refresh
          taskId: taskId,
          memberId: '', // These will be updated when the page refreshes
          memberUsername: 'You', // Temporary username
          memberEmail: '',
          comment: newComment,
          createdAt: new Date().toISOString()
        }]
      });

      // Clear input
      setNewComment("");
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-[90vw] max-h-[80vh] flex flex-col p-0 rounded-lg shadow-lg`}>
        {task.status === 'cancel' || task.status === 'done' && (
          <div className="absolute inset-0 bg-background/50 z-10 rounded-lg" />
        )}
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex justify-between items-center py-3 px-4 border-b ${task.status === 'done' ? 'bg-green-500/10' :
            task.status === 'todo' ? 'bg-gray-500/10' :
              task.status === 'in_progress' ? 'bg-blue-500/10' :
                task.status === 'overdue' ? 'bg-red-500/10' :
                  task.status === 'overdone' ? 'bg-orange-500/10' :
                    task.status === 'cancel' ? 'bg-purple-500/10' :
                      'bg-gradient-to-r from-primary/5 to-primary/10'
            }`}
        >
          {/* Task Name with Task Status */}
          <div className="flex items-center gap-3">
            <motion.h2
              className="text-xl font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {task.taskName}
            </motion.h2>
            {/* Task Status */}
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`px-3 py-1 text-sm font-medium ${task.status === 'todo' ? 'bg-gray-100 text-gray-700 border-gray-300' :
                  task.status === 'in_progress' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                    task.status === 'done' ? 'bg-green-100 text-green-700 border-green-300' :
                      task.status === 'overdue' ? 'bg-red-100 text-red-700 border-red-300' :
                        task.status === 'overdone' ? 'bg-orange-100 text-orange-700 border-orange-300' :
                          'bg-purple-100 text-purple-700 border-purple-300' // for cancel
                  }`}
              >
                <div className="flex items-center gap-1.5">
                  {task.status === 'todo' && <CircleDashed className="w-3.5 h-3.5" />}
                  {task.status === 'in_progress' && <Clock className="w-3.5 h-3.5" />}
                  {task.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {task.status === 'overdue' && <AlertCircle className="w-3.5 h-3.5" />}
                  {task.status === 'overdone' && <AlertCircle className="w-3.5 h-3.5" />}
                  {task.status === 'cancel' && <XCircle className="w-3.5 h-3.5" />}
                  {task.status === 'todo' && 'To Do'}
                  {task.status === 'in_progress' && 'In Progress'}
                  {task.status === 'done' && 'Done'}
                  {task.status === 'overdue' && 'Overdue'}
                  {task.status === 'overdone' && 'Overdue Done'}
                  {task.status === 'cancel' && 'Cancelled'}
                </div>
              </Badge>
              {(task.status === 'overdue' || task.status === 'overdone') && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="text-sm text-red-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {format(new Date(task.endDate), 'MMM d, yyyy')}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Due date has passed</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>



          {/* Task Actions */}
          <div className="flex items-center gap-2">
            {task.status !== 'done' && task.status !== 'cancel' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 text-green-600 hover:bg-green-100"
                      onClick={() => handleUpdateStatus('done')}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Done
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mark task as done</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {task.status !== 'cancel' && task.status !== 'done' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 text-red-600 hover:bg-red-100"
                      onClick={() => handleUpdateStatus('cancel')}
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cancel task</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}


            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="ghost" size="icon" onClick={() => { }}>
                    <Heart className={`w-5 h-5 ${task.isFavorite ? 'text-red-500 fill-current' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{task.isFavorite ? 'Remove from favorites' : 'Add to favorites'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="ghost" size="icon">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share task</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Task
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden pb-4">
          {/* Left Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-[60%] pl-4 pr-2 overflow-y-auto border-r custom-scrollbar"
            ref={parentRef}
          >
            <div className="space-y-4">
              {/* Priority Section */}
              <div className="bg-sidebar-primary rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  Priority
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant={task.priority === 'high' ? 'default' : 'outline'}
                    className={`flex-1 ${task.priority === 'high' ? 'bg-red-500 hover:bg-red-600' : 'hover:bg-red-500/10'}`}
                    onClick={() => handleUpdatePriority('high')}
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    High
                  </Button>
                  <Button
                    variant={task.priority === 'medium' ? 'default' : 'outline'}
                    className={`flex-1 ${task.priority === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' : 'hover:bg-yellow-500/10'}`}
                    onClick={() => handleUpdatePriority('medium')}
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Medium
                  </Button>
                  <Button
                    variant={task.priority === 'low' ? 'default' : 'outline'}
                    className={`flex-1 ${task.priority === 'low' ? 'bg-green-500 hover:bg-green-600' : 'hover:bg-green-500/10'}`}
                    onClick={() => handleUpdatePriority('low')}
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Low
                  </Button>
                </div>
              </div>
              {/* Description Section */}
              <motion.div
                className="bg-sidebar-primary rounded-lg p-4 transition-all hover:shadow-md"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <p className="text-base font-semibold">Description</p>
                </div>

                {isEditingDescription ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="w-full p-2 text-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      rows={4}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleUpdateDescription}
                        className="flex items-center gap-1"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <CircleDashed className="w-4 h-4" />
                          </motion.div>
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingDescription(false)}
                        className="flex items-center gap-1"
                        disabled={isSaving}
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p
                    className="text-gray-600 text-sm cursor-pointer hover:text-primary"
                    onClick={() => {
                      setIsEditingDescription(true);
                      setNewDescription(task.taskDescription);
                    }}
                  >
                    {task.taskDescription || 'Add a description...'}
                  </p>
                )}
              </motion.div>

              {/* Links Section */}
              <motion.div
                className="bg-sidebar-primary rounded-lg p-4 transition-all hover:shadow-md"
                whileHover={{ scale: 1.01 }}
                ref={linksRef}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-primary" />
                    <p className="text-base font-semibold">Links</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddingLink(true)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Link
                  </Button>
                </div>

                <AnimatePresence>
                  {isAddingLink && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 space-y-2"
                    >
                      <input
                        type="text"
                        placeholder="Link Title"
                        value={newLinkTitle}
                        onChange={(e) => setNewLinkTitle(e.target.value)}
                        className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-primary bg-background"
                      />
                      <input
                        type="url"
                        placeholder="URL"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-primary bg-background"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddLink}
                          className="flex items-center gap-1"
                          disabled={isSaving}
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
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  {task.taskLinks.map((link: TaskLink) => (
                    <motion.div
                      key={link.taskLinkId}
                      className="flex items-center gap-2 group p-2 rounded-md hover:bg-background"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <LinkIcon className="w-4 h-4 text-primary" />
                      <a
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline flex-grow"
                      >
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
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Mini Tasks Section */}
              <motion.div
                className="bg-sidebar-primary rounded-lg p-4 transition-all hover:shadow-md"
                whileHover={{ scale: 1.01 }}
                ref={miniTasksRef}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <p className="text-base font-semibold">Mini Tasks</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddingMiniTask(true)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Mini Task
                  </Button>
                </div>

                <AnimatePresence>
                  {isAddingMiniTask && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 space-y-2"
                    >
                      <input
                        type="text"
                        placeholder="Mini Task Name"
                        value={newMiniTaskName}
                        onChange={(e) => setNewMiniTaskName(e.target.value)}
                        className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-primary bg-background"
                      />
                      <textarea
                        placeholder="Mini Task Description"
                        value={newMiniTaskDescription}
                        onChange={(e) => setNewMiniTaskDescription(e.target.value)}
                        className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-primary bg-background"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddMiniTask}
                          className="flex items-center gap-1"
                          disabled={isSaving}
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsAddingMiniTask(false)}
                          className="flex items-center gap-1"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  {task.miniTasks.map((miniTask: MiniTask) => (
                    <motion.div
                      key={miniTask.miniTaskId}
                      className="flex items-center gap-2 group p-2 rounded-md hover:bg-background"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Checkbox
                        checked={miniTask.miniTaskStatus === 'done'}
                        onCheckedChange={(checked) =>
                          handleMiniTaskStatusChange(miniTask.miniTaskId, checked as boolean)
                        }
                      />
                      <div className="flex flex-col flex-grow">
                        <div className="flex items-center gap-2">
                          <p className={`font-medium ${miniTask.miniTaskStatus === 'done'
                            ? 'text-gray-400 line-through'
                            : ''
                            }`}>
                            {miniTask.miniTaskName}
                          </p>
                          {miniTask.miniTaskMemberUsername && (
                            <Badge variant="outline" className="text-xs">
                              @{miniTask.miniTaskMemberUsername}
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm ${miniTask.miniTaskStatus === 'done'
                          ? 'text-gray-400 line-through'
                          : 'text-gray-500'
                          }`}>
                          {miniTask.miniTaskDescription}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMiniTask(miniTask.miniTaskId)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Comments and Logs Section */}
              <Tabs defaultValue="comments" className="w-full">
                <TabsList className="w-full justify-start bg-sidebar-primary p-1 rounded-lg">
                  <TabsTrigger value="comments" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Comments
                  </TabsTrigger>
                  <TabsTrigger value="logs" className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Activity Logs
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="comments">
                  <div className="mt-4 space-y-4" ref={commentsRef}>
                    <div className="space-y-2">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-primary min-h-[100px] bg-background"
                      />
                      <Button
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || isSaving}
                        className="w-full"
                      >
                        {isSaving ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <CircleDashed className="w-4 h-4 mr-2" />
                          </motion.div>
                        ) : (
                          <MessageSquare className="w-4 h-4 mr-2" />
                        )}
                        Add Comment
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {task.taskComments.map((comment: TaskComment) => (
                        <motion.div
                          key={comment.commentId}
                          className="flex gap-3 p-3 rounded-lg hover:bg-background"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <Avatar className="w-8 h-8">
                            {comment.memberAvatar ? (
                              <AvatarImage src={comment.memberAvatar} />
                            ) : (
                              <AvatarFallback>
                                {comment.memberUsername[0].toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-grow">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {comment.memberUsername}
                              </span>
                              <span className="text-sm text-gray-500">
                                {format(new Date(comment.createdAt), 'MMM d, yyyy HH:mm')}
                              </span>
                            </div>
                            <p className="mt-1 text-gray-700">{comment.comment}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="logs">
                  <div className="mt-4 space-y-4">
                    {task.taskLogs.map((log: TaskLog) => (
                      <motion.div
                        key={log.taskLogId}
                        className="border-l-2 border-gray-200 pl-4 py-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <div className="font-medium flex items-center gap-2">
                          {log.logType === 'create' && (
                            <Plus className="w-4 h-4 text-green-500" />
                          )}
                          {log.logType === 'update' && (
                            <Edit className="w-4 h-4 text-blue-500" />
                          )}
                          {log.logType === 'delete' && (
                            <Trash2 className="w-4 h-4 text-red-500" />
                          )}
                          {log.logType === 'complete' && (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          )}
                          {log.taskLogTitle}
                        </div>
                        <p className="text-sm text-gray-600">
                          {log.taskLogDescription}
                        </p>
                        <span className="text-sm text-gray-500">
                          {format(new Date(log.taskLogDate), 'MMM d, yyyy HH:mm')}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>

          {/* Right Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-[40%] pl-4 pr-2 overflow-y-auto custom-scrollbar"
          >
            <div className="space-y-4">
              {/* Timeline Section */}
              <div className="bg-sidebar-primary rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Timeline
                </h3>
                <table className="w-full">
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
                              className="border rounded p-1 bg-background"
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

              {/* Assignments Section */}
              <div className="bg-sidebar-primary rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Task Members
                </h3>
                <div className="space-y-4">
                  {/* Assignees */}
                  <div>
                    <label className="text-sm text-gray-500">Assigned To:</label>
                    <div className="mt-2 space-y-2">
                      {task.taskAssignments.map((assignment: TaskAssignment) => (
                        <motion.div
                          key={assignment.assignmentMemberId}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-background"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <Avatar className="w-8 h-8">
                            {assignment.assigneeAvatar ? (
                              <AvatarImage src={assignment.assigneeAvatar} />
                            ) : (
                              <AvatarFallback>
                                {assignment.assigneeUsername[0].toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-grow">
                            <p className="font-medium">{assignment.assigneeUsername}</p>
                            <p className="text-sm text-gray-500">{assignment.assigneeEmail}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full flex items-center gap-2"
                      onClick={() => setShowMemberDropdown(!showMemberDropdown)}
                    >
                      <UserPlus className="w-4 h-4" />
                      Add Member
                    </Button>

                    <AnimatePresence>
                      {showMemberDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-2 border rounded-lg bg-background shadow-lg"
                        >
                          <ScrollArea className="h-[200px] p-2">
                            {teamMembers.map((member) => (
                              <div
                                key={member.memberId}
                                className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md"
                              >
                                <Checkbox
                                  checked={selectedMembers.includes(member.memberId)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedMembers([...selectedMembers, member.memberId]);
                                    } else {
                                      setSelectedMembers(selectedMembers.filter(id => id !== member.memberId));
                                    }
                                  }}
                                />
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>
                                    {member.memberUsername[0].toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{member.memberUsername}</p>
                                  <p className="text-xs text-gray-500">{member.memberEmail}</p>
                                </div>
                              </div>
                            ))}
                          </ScrollArea>
                          {selectedMembers.length > 0 && (
                            <div className="p-2 border-t">
                              <Button
                                size="sm"
                                className="w-full"
                                onClick={handleAddMembers}
                                disabled={isAddingMembers}
                              >
                                {isAddingMembers ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                  >
                                    <CircleDashed className="w-4 h-4 mr-2" />
                                  </motion.div>
                                ) : (
                                  <UserPlus className="w-4 h-4 mr-2" />
                                )}
                                Add {selectedMembers.length} {selectedMembers.length === 1 ? 'Member' : 'Members'}
                              </Button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Creator */}
                  <div>
                    <label className="text-sm text-gray-500">Created By:</label>
                    <div className="mt-2 flex items-center gap-2 p-2 rounded-lg bg-background">
                      <Avatar className="w-8 h-8">
                        {task.creatorAvatar ? (
                          <AvatarImage src={task.creatorAvatar} />
                        ) : (
                          <AvatarFallback>
                            {task.creatorUsername[0].toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-medium">{task.creatorUsername}</p>
                        <p className="text-sm text-gray-500">{task.creatorEmail}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task Dependencies */}
              {(task.previousTaskId || task.nextTaskId) && (
                <div className="bg-sidebar-primary rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-primary" />
                    Task Dependencies
                  </h3>
                  <div className="space-y-3">
                    {task.previousTaskId && (
                      <div className="flex items-center gap-2">
                        <ChevronLeft className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Previous Task</p>
                          <p className="font-medium">{task.previousTaskName}</p>
                        </div>
                      </div>
                    )}
                    {task.nextTaskId && (
                      <div className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Next Task</p>
                          <p className="font-medium">{task.nextTaskName}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Loading Component
function LoadingTaskDialog() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-64" />
      </div>
      <div className="flex gap-6">
        <div className="w-[60%] space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="w-[40%] space-y-6">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}