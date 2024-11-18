import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, X, Check, Clock, Trash2 } from 'lucide-react';
import { format, isToday, isSameDay } from 'date-fns';
import * as Dialog from '@radix-ui/react-dialog';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { _GET } from '@/utils/auth_api';

// Utility function
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Types
interface Task {
    id: string;
    name: string;
    description: string;
    status: 'todo' | 'in_progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    projectId: string;
    projectName: string;
    startDate: string;
    endDate: string;
}

const getStatusColors = (status: Task['status']) => {
    switch (status) {
        case 'todo':
            return { start: 'bg-yellow-500', end: 'bg-orange-500' };
        case 'in_progress':
            return { start: 'bg-blue-500', end: 'bg-purple-500' };
        case 'done':
            return { start: 'bg-green-500', end: 'bg-emerald-500' };
        default:
            return { start: 'bg-gray-500', end: 'bg-gray-500' };
    }
};

// Task List Component
interface TaskListProps {
    tasks: Task[];
    date: Date;
}

const TaskList = ({ tasks, date }: TaskListProps) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const startingTasks = tasks.filter(task => task.startDate.startsWith(formattedDate));
    const endingTasks = tasks.filter(task => task.endDate.startsWith(formattedDate));

    return (
        <div className="space-y-4">
            <div>
                <h3 className="font-medium mb-2">Starting Tasks</h3>
                <div className="space-y-2">
                    {startingTasks.map((task) => (
                        <div
                            key={task.id}
                            className={cn(
                                "p-2 rounded-lg",
                                getStatusColors(task.status).start,
                                "text-white"
                            )}
                        >
                            <div className="font-medium">{task.name}</div>
                            <div className="text-sm opacity-90">{task.projectName}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-medium mb-2">Ending Tasks</h3>
                <div className="space-y-2">
                    {endingTasks.map((task) => (
                        <div
                            key={task.id}
                            className={cn(
                                "p-2 rounded-lg",
                                getStatusColors(task.status).end,
                                "text-white"
                            )}
                        >
                            <div className="font-medium">{task.name}</div>
                            <div className="text-sm opacity-90">{task.projectName}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Main Calendar Component
const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await _GET('/task/service/tasks/member');
                setTasks(response);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, []);

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const handleMonthChange = (increment: number) => {
        const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + increment));
        setCurrentDate(new Date(newDate));
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
        const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(
                <div key={`empty-${i}`} className="h-32 bg-gray-50/50 rounded-lg m-1" />
            );
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const formattedDate = format(date, 'yyyy-MM-dd');
            
            const startingTasks = tasks.filter(task => 
                task.startDate.startsWith(formattedDate)
            );
            const endingTasks = tasks.filter(task => 
                task.endDate.startsWith(formattedDate)
            );

            days.push(
                <motion.div
                    key={day}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn(
                        "h-32 rounded-lg m-1 p-3 relative group transition-colors",
                        "hover:bg-gray-50 cursor-pointer",
                        isToday(date) && "bg-blue-50 border-2 border-blue-200",
                        selectedDate && isSameDay(date, selectedDate) && "ring-2 ring-blue-500"
                    )}
                    onClick={() => handleDateClick(date)}
                >
                    <div className="flex justify-between items-start">
                        <span className={cn(
                            "font-medium",
                            isToday(date) && "text-blue-600"
                        )}>
                            {day}
                        </span>
                        <div className="flex gap-1">
                            {startingTasks.length > 0 && (
                                <div className={cn(
                                    "rounded-full w-6 h-6 flex items-center justify-center text-xs text-white",
                                    getStatusColors(startingTasks[0].status).start
                                )}>
                                    +{startingTasks.length}
                                </div>
                            )}
                            {endingTasks.length > 0 && (
                                <div className={cn(
                                    "rounded-full w-6 h-6 flex items-center justify-center text-xs text-white",
                                    getStatusColors(endingTasks[0].status).end
                                )}>
                                    +{endingTasks.length}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            );
        }

        return days;
    };

    return (
        <div className="flex h-screen">
            <div className="w-[70%] p-6 border-r h-screen overflow-y-auto custom-scrollbar">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="flex justify-between items-center">
                        <motion.h1 
                            className="text-2xl font-bold flex items-center gap-2"
                            layout
                        >
                            <CalendarIcon className="text-blue-500" />
                            {format(currentDate, 'MMMM yyyy')}
                        </motion.h1>
                        <div className="flex gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-full hover:bg-gray-100"
                                onClick={() => handleMonthChange(-1)}
                            >
                                <ChevronLeft size={20} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-full hover:bg-gray-100"
                                onClick={() => handleMonthChange(1)}
                            >
                                <ChevronRight size={20} />
                            </motion.button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <div className="grid grid-cols-7">
                            {renderCalendarDays()}
                        </div>
                    </AnimatePresence>
                </motion.div>
            </div>

            <div className="w-[30%] p-6">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-xl  p-6 h-full"
                >
                    <h2 className="text-xl font-semibold mb-4">Tasks</h2>
                    {selectedDate && <TaskList tasks={tasks} date={selectedDate} />}
                </motion.div>
            </div>
        </div>
    );
};

export default CalendarPage;