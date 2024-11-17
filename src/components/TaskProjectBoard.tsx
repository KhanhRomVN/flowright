import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { _GET, _PUT } from "@/utils/auth_api";
import TaskBoardCard from './Card/TaskBoardCard';
import { toast } from 'react-toastify';

interface Task {
  taskId: string;
  taskName: string;
  priority: string;
  projectId: string;
  taskGroupId: string;
  taskGroupName: string;
  startDate: string;
  endDate: string;
  status: string;
  taskAssignments: any[];
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface TaskProjectBoardProps {
  projectId: string;
}

const TaskProjectBoard = ({ projectId }: TaskProjectBoardProps) => {
  const [tasks, setTasks] = useState<{ [key: string]: Task }>({});
  const [columns, setColumns] = useState<{ [key: string]: Column }>({});
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  
  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const response = await _GET(`/task/service/tasks/project?projectId=${projectId}`);
      
      const tasksById: { [key: string]: Task } = {};
      const columnsById: { [key: string]: Column } = {};
      const columnOrderSet = new Set<string>();

      response.forEach((task: Task) => {
        tasksById[task.taskId] = task;
        
        if (!columnsById[task.taskGroupId]) {
          columnsById[task.taskGroupId] = {
            id: task.taskGroupId,
            title: task.taskGroupName,
            taskIds: []
          };
          columnOrderSet.add(task.taskGroupId);
        }
        columnsById[task.taskGroupId].taskIds.push(task.taskId);
      });

      setTasks(tasksById);
      setColumns(columnsById);
      setColumnOrder(Array.from(columnOrderSet));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
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
        await _PUT(`/task/service/tasks/${draggableId}`, {
          taskGroupId: destination.droppableId
        });
        toast.success('Task moved successfully');
      } catch (error) {
        console.error('Error updating task group:', error);
        toast.error('Failed to update task group');
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 p-4 overflow-x-auto min-h-[calc(100vh-200px)">
        {columnOrder.map(columnId => {
          const column = columns[columnId];
          const columnTasks = column.taskIds.map(taskId => tasks[taskId]);

          return (
            <div key={column.id} className="w-80 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className=" dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{column.title}</h3>
                  <span className="text-xs text-muted-foreground">
                    {columnTasks.length} tasks
                  </span>
                </div>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-2"
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
                              <TaskBoardCard task={task} />
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
      </div>
    </DragDropContext>
  );
};

export default TaskProjectBoard;