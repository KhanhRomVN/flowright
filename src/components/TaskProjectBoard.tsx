import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { _GET, _PUT } from "@/utils/auth_api";
import TaskBoardCard from './Card/TaskBoardCard';
import { toast } from 'react-toastify';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import TaskDetailsDialog from './Dialog/TaskDetailsDialog';

interface Task {
    taskId: string;
    taskName: string;
    priority: 'low' | 'medium' | 'high';
    projectId: string;
    taskGroupId: string;
    taskGroupName: string;
    startDate: string;
    endDate: string;
    status: 'todo' | 'in_progress' | 'done';
    taskAssignments: {
        assignmentMemberId: string;
        assigneeUsername: string;
        assigneeEmail: string | null;
    }[];
}

interface Column {
    id: string;
    title: string;
    taskIds: string[];
}

interface TaskGroup {
    id: string;
    name: string;
    description: string;
}

interface TaskProjectBoardProps {
    projectId: string;
}

const TaskProjectBoard = ({ projectId }: TaskProjectBoardProps) => {
    const [tasks, setTasks] = useState<{ [key: string]: Task }>({});
    const [columns, setColumns] = useState<{ [key: string]: Column }>({});
    const [columnOrder, setColumnOrder] = useState<string[]>([]);
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);


    useEffect(() => {
        fetchTaskGroups();
        fetchTasks();
    }, [projectId]);

    const fetchTaskGroups = async () => {
        try {
            const taskGroups: TaskGroup[] = await _GET(`/task/service/task-groups?projectId=${projectId}`);

            const columnsById: { [key: string]: Column } = {};
            const columnOrderSet = new Set<string>();

            // Initialize columns for all task groups, even if they have no tasks
            taskGroups.forEach((group) => {
                columnsById[group.id] = {
                    id: group.id,
                    title: group.name,
                    taskIds: []
                };
                columnOrderSet.add(group.id);
            });

            setColumns(columnsById);
            setColumnOrder(Array.from(columnOrderSet));
        } catch (error) {
            console.error('Error fetching task groups:', error);
            toast.error('Failed to load task groups');
        }
    };

    const fetchTasks = async () => {
        try {
            const response: Task[] = await _GET(`/task/service/tasks/project?projectId=${projectId}`);

            const tasksById: { [key: string]: Task } = {};
            const columnsById: { [key: string]: Column } = { ...columns }; // Preserve existing columns

            // Group tasks by taskGroupId
            response.forEach((task: Task) => {
                tasksById[task.taskId] = task;

                if (!columnsById[task.taskGroupId]) {
                    columnsById[task.taskGroupId] = {
                        id: task.taskGroupId,
                        title: task.taskGroupName,
                        taskIds: []
                    };
                }
                columnsById[task.taskGroupId].taskIds.push(task.taskId);
            });

            setTasks(tasksById);
            setColumns(columnsById);
            setColumnOrder(Object.keys(columnsById));
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Failed to load tasks');
        }
    };

    const createNewTaskGroup = async () => {
        if (!newGroupName.trim()) {
            toast.error('Group name cannot be empty');
            return;
        }

        try {
            await _PUT('/task/service/task-groups', {
                name: newGroupName,
                description: newGroupName,
                projectId: projectId
            });

            // Refresh task groups after creation
            await fetchTaskGroups();

            // Reset form
            setNewGroupName('');
            setIsCreatingGroup(false);
            toast.success('Task group created successfully');
        } catch (error) {
            console.error('Error creating task group:', error);
            toast.error('Failed to create task group');
        }
    };

    const onDragEnd = async (result: any) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const start = columns[source.droppableId];
        const finish = columns[destination.droppableId];

        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...start,
                taskIds: newTaskIds,
            };

            setColumns({
                ...columns,
                [newColumn.id]: newColumn,
            });
        } else {
            const startTaskIds = Array.from(start.taskIds);
            startTaskIds.splice(source.index, 1);
            const newStart = {
                ...start,
                taskIds: startTaskIds,
            };

            const finishTaskIds = Array.from(finish.taskIds);
            finishTaskIds.splice(destination.index, 0, draggableId);
            const newFinish = {
                ...finish,
                taskIds: finishTaskIds,
            };

            setColumns({
                ...columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            });

            try {
                await _PUT(`/task/service/tasks/group-task-id`, {
                    taskId: draggableId,
                    taskGroupId: destination.droppableId
                });
            } catch (error) {
                console.error('Error updating task group:', error);
                toast.error('Failed to update task group');

                setColumns({
                    ...columns,
                    [start.id]: start,
                    [finish.id]: finish,
                });
            }
        }
    };

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4 p-4 overflow-x-auto h-[calc(100vh-200px)] w-[calc(100vw-250px)] custom-scrollbar">
                    {columnOrder.map(columnId => {
                        const column = columns[columnId];
                        const columnTasks = column.taskIds.map(taskId => tasks[taskId]);

                        return (
                            <div key={column.id} className="w-80 flex-shrink-0">
                                <div className="bg-card-background rounded-lg p-4 h-full flex flex-col">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold">{column.title}</h3>
                                        <span className="text-xs text-text-secondary">
                                            {columnTasks.length} tasks
                                        </span>
                                    </div>
                                    <Droppable droppableId={column.id} type="TASK">
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className="space-y-2 min-h-[100px] overflow-y-auto flex-1 custom-scrollbar pr-2 bg-card-background"
                                            >
                                                {columnTasks.map((task, index) => (
                                                    <Draggable
                                                        key={task.taskId}
                                                        draggableId={task.taskId}
                                                        index={index}
                                                    >
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <TaskBoardCard
                                                                    task={task}
                                                                    onClick={() => {
                                                                        setSelectedTaskId(task.taskId);
                                                                        setIsTaskDetailsOpen(true);
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            </div>
                        );
                    })}

                    {/* Add New Column Button */}
                    <div className="w-80 flex-shrink-0">
                        {isCreatingGroup ? (
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                                <input
                                    type="text"
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    placeholder="Enter group name"
                                    className="w-full p-2 mb-2 rounded border dark:bg-gray-700 dark:border-gray-600"
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <Button
                                        onClick={createNewTaskGroup}
                                        className="flex-1"
                                    >
                                        Create
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsCreatingGroup(false);
                                            setNewGroupName('');
                                        }}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={() => setIsCreatingGroup(true)}
                                className="w-full h-full min-h-[100px] flex items-center justify-center"
                            >
                                <Plus className="mr-2" />
                                Add New Group
                            </Button>
                        )}
                    </div>
                </div>
            </DragDropContext>
            {selectedTaskId && (
                <TaskDetailsDialog
                    open={isTaskDetailsOpen}
                    onOpenChange={setIsTaskDetailsOpen}
                    taskId={selectedTaskId}
                    teamId={projectId}
                    onTaskUpdate={fetchTasks}
                />
            )}
        </>
    );
};

export default TaskProjectBoard;