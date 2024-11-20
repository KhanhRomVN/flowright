import React, { useState } from 'react';
import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemText,
    LinearProgress,
    Tooltip as MuiTooltip
} from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { Button } from '../ui/button';
import {
    Users,
    Briefcase,
    Bell,
    Plus,
    Search,
    Calendar,
    Filter,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle,
    BarChart2
} from 'lucide-react';
import TaskDrawer from '@/components/Drawer/TaskDrawer';
import { motion, AnimatePresence } from 'framer-motion';

const workingHoursPerDayOfWeekData = [
    { day: 2, month: 8, year: 2024, hours: 9 },
    { day: 3, month: 8, year: 2024, hours: 7 },
    { day: 4, month: 8, year: 2024, hours: 8 },
    { day: 5, month: 8, year: 2024, hours: 10 },
    { day: 6, month: 8, year: 2024, hours: 12 },
    { day: 7, month: 8, year: 2024, hours: 0 },
    { day: 8, month: 8, year: 2024, hours: 0 },
];

const mySpecialTasksData = [
    {
        taskName: 'Design Website',
        startTime: '10:00',
        endTime: '12:00',
        description: 'Design the website',
    },
    {
        taskName: 'Meeting with client',
        startTime: '15:00',
        endTime: '16:00',
        description: 'Meeting with client',
    },
    {
        taskName: 'View Project',
        startTime: '13:00',
        endTime: '15:00',
        description: 'View the project',
    },
];

const teamOverviewData = {
    totalMembers: 12,
    activeProjects: 5,
    onLeaveToday: 2,
    newTasks: 8
};

const projectsData = [
    {
        name: 'Website Redesign',
        progress: 75,
        deadline: '2024-09-01',
        teamMembers: ['John', 'Anna', 'Mike'],
        status: 'in-progress',
        priority: 'high'
    },
    {
        name: 'Mobile App Development',
        progress: 45,
        deadline: '2024-10-15',
        teamMembers: ['Sarah', 'Tom'],
        status: 'in-progress',
        priority: 'medium'
    },
    {
        name: 'Database Migration',
        progress: 90,
        deadline: '2024-08-20',
        teamMembers: ['David', 'Emma', 'Chris'],
        status: 'in-progress',
        priority: 'high'
    }
];

const announcementsData = [
    {
        title: 'Team Meeting',
        date: '2024-08-10',
        priority: 'high',
        content: 'Meeting at 9:00 AM'
    },
    {
        title: 'Deadline Project',
        date: '2024-08-15',
        priority: 'medium',
        content: 'Deadline submit report for Website Redesign project'
    },
    {
        title: 'Training session',
        date: '2024-08-12',
        priority: 'low',
        content: 'Training at 2:00 PM'
    }
];

const DashboardContent: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);


    const workingHoursData = [{
        id: "working hours",
        data: workingHoursPerDayOfWeekData.map(item => ({
            x: item.day,
            y: item.hours
        }))
    }];

    const handleCreateTask = () => {
        setIsTaskDrawerOpen(true);
    };

    const handleCreateProject = () => {
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        // Implement search logic
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-4 pt-4 px-4 mb-20"
        >
            {/* Header with Search and Actions */}
            <motion.div 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="flex justify-between items-center"
            >
                <div className="flex gap-4 items-center">
                    <div className="relative w-64">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-sidebar-primary text-text-primary 
                                     focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
                    </div>
                    <Button
                        variant="outline"
                        onClick={toggleFilters}
                        className="flex items-center gap-2 hover:bg-gray-700/50 transition-colors duration-200"
                    >
                        <Filter size={16} />
                        Filters
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 hover:bg-blue-500/20 transition-colors duration-200"
                        onClick={handleCreateTask}
                    >
                        <Plus size={16} className="text-blue-400" />
                        Tạo task
                    </Button>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 hover:bg-green-500/20 transition-colors duration-200"
                        onClick={handleCreateProject}
                    >
                        <Plus size={16} className="text-green-400" />
                        Tạo dự án
                    </Button>
                </div>
            </motion.div>

            {/* Filters Panel with Animation */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card className="p-4 bg-sidebar-primary text-text-primary border border-gray-600">
                            <div className="grid grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Typography variant="subtitle2" className="flex items-center gap-2">
                                        <CheckCircle size={16} className="text-blue-400" />
                                        Trạng thái
                                    </Typography>
                                    {/* Add status filter controls */}
                                </div>
                                <div className="space-y-2">
                                    <Typography variant="subtitle2" className="flex items-center gap-2">
                                        <AlertCircle size={16} className="text-yellow-400" />
                                        Độ ưu tiên
                                    </Typography>
                                    {/* Add priority filter controls */}
                                </div>
                                <div className="space-y-2">
                                    <Typography variant="subtitle2" className="flex items-center gap-2">
                                        <Users size={16} className="text-green-400" />
                                        Thành viên
                                    </Typography>
                                    {/* Add member filter controls */}
                                </div>
                                <div className="space-y-2">
                                    <Typography variant="subtitle2" className="flex items-center gap-2">
                                        <Calendar size={16} className="text-purple-400" />
                                        Thời gian
                                    </Typography>
                                    {/* Add date filter controls */}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Team Overview Cards */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { 
                        icon: <Users size={24} className="text-blue-400" />,
                        title: "Total Members",
                        value: teamOverviewData.totalMembers,
                        color: "from-blue-500/20 to-blue-600/10"
                    },
                    {
                        icon: <Briefcase size={24} className="text-green-400" />,
                        title: "Active Projects",
                        value: teamOverviewData.activeProjects,
                        color: "from-green-500/20 to-green-600/10"
                    },
                    {
                        icon: <Calendar size={24} className="text-yellow-400" />,
                        title: "On Leave Today",
                        value: teamOverviewData.onLeaveToday,
                        color: "from-yellow-500/20 to-yellow-600/10"
                    },
                    {
                        icon: <Bell size={24} className="text-purple-400" />,
                        title: "New Tasks",
                        value: teamOverviewData.newTasks,
                        color: "from-purple-500/20 to-purple-600/10"
                    }
                ].map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className={` ${item.color} border border-gray-600/50 hover:shadow-lg transition-all duration-300`}>
                            <div className="flex items-center gap-3 p-4 bg-sidebar-primary">
                                {item.icon}
                                <div>
                                    <Typography variant="subtitle2" className="text-gray-400">
                                        {item.title}
                                    </Typography>
                                    <Typography variant="h4" className="text-text-primary font-bold">
                                        {item.value}
                                    </Typography>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="flex gap-4">
                {/* Left Column - 60% */}
                <div className="w-[60%] flex flex-col gap-4">
                    {/* Activity Chart */}
                    <Card className="border border-gray-600/50 hover:shadow-lg transition-all duration-300">
                        <div className="flex justify-between items-center p-4 bg-sidebar-primary border-b border-gray-600/50">
                            <div className="flex items-center gap-2">
                                <BarChart2 className="text-blue-400" size={20} />
                                <p className="text-lg text-text-primary font-medium">Activity Overview</p>
                            </div>
                        </div>
                        <div style={{ height: '300px' }} className="bg-sidebar-primary p-4">
                            <ResponsiveBar
                                data={workingHoursPerDayOfWeekData}
                                keys={['hours']}
                                indexBy="day"
                                margin={{ top: 50, right: 30, bottom: 40, left: 40 }}
                                padding={0.3}
                                valueScale={{ type: 'linear' }}
                                colors={d => {
                                    const colors = {
                                        2: 'var(--blue)',
                                        3: 'var(--green)',
                                        4: 'var(--purple)',
                                        5: 'var(--yellow)',
                                        6: 'var(--red)',
                                        7: 'var(--gray)',
                                        8: 'var(--blue)'
                                    };
                                    return colors[d.data.day as keyof typeof colors] || '#ffffff';
                                }}
                                borderRadius={8}
                                axisBottom={{
                                    tickSize: 0,
                                    tickPadding: 10,
                                    tickRotation: 0,
                                    format: (value) => {
                                        const dataPoint = workingHoursPerDayOfWeekData.find(d => d.day === value);
                                        return dataPoint ? `${value.toString().padStart(2, '0')}/${dataPoint.month}` : '';
                                    }
                                }}
                                axisLeft={null}
                                enableGridY={false}
                                labelSkipWidth={0}
                                labelSkipHeight={0}
                                theme={{
                                    text: { fill: '#ffffff' },
                                    axis: {
                                        ticks: {
                                            text: { fill: '#ffffff' }
                                        }
                                    },
                                    grid: {
                                        line: { stroke: '#ffffff33' }
                                    }
                                }}
                                enableLabel={true}
                                label={d => `${d.value}h`}
                                labelTextColor="#ffffff"
                            />
                        </div>
                    </Card>

                    {/* Projects List */}
                    <Card className="border border-gray-600/50 hover:shadow-lg transition-all duration-300">
                        <div className="flex justify-between items-center p-4 bg-sidebar-primary border-b border-gray-600/50">
                            <div className="flex items-center gap-2">
                                <Briefcase className="text-green-400" size={20} />
                                <p className="text-lg text-text-primary font-medium">Projects Overview</p>
                            </div>
                        </div>
                        <div className="space-y-4 p-4 bg-sidebar-primary">
                            {projectsData.map((project, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-4 bg-sidebar-secondary rounded-lg border border-gray-600/50 
                                             hover:shadow-md transition-all duration-300"
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-2">
                                            <p className="text-text-primary font-medium">
                                                {project.name}
                                            </p>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                                                ${project.priority === 'high' 
                                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                                                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                }`}>
                                                {project.priority}
                                            </span>
                                        </div>
                                        <MuiTooltip title="Project Deadline">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Clock size={16} />
                                                <p className="text-sm">{project.deadline}</p>
                                            </div>
                                        </MuiTooltip>
                                    </div>
                                    <div className="mb-3">
                                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                                            <span>Progress</span>
                                            <span>{project.progress}%</span>
                                        </div>
                                        <LinearProgress
                                            variant="determinate"
                                            value={project.progress}
                                            className="h-2 rounded-full"
                                            sx={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: project.progress >= 80 ? '#10B981' : '#3B82F6'
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex -space-x-2">
                                            {project.teamMembers.map((member, i) => (
                                                <MuiTooltip key={i} title={member}>
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 
                                                                  flex items-center justify-center text-white text-sm 
                                                                  border-2 border-gray-800 hover:scale-110 transition-transform duration-200">
                                                        {member[0]}
                                                    </div>
                                                </MuiTooltip>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp size={16} className="text-green-400" />
                                            <p className="text-text-primary text-sm">
                                                On Track
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Right Column - 40% */}
                <div className="w-[40%] flex flex-col gap-4">
                    {/* Announcements */}
                    <Card className="border border-gray-600/50 hover:shadow-lg transition-all duration-300">
                        <div className="flex justify-between items-center p-4 bg-sidebar-primary border-b border-gray-600/50">
                            <div className="flex items-center gap-2">
                                <Bell className="text-yellow-400" size={20} />
                                <p className="text-lg text-text-primary font-medium">Thông báo</p>
                            </div>
                        </div>
                        <List className="bg-sidebar-primary divide-y divide-gray-600/50">
                            {announcementsData.map((announcement, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <ListItem className="hover:bg-gray-700/30 transition-colors duration-200">
                                        <ListItemText
                                            primary={
                                                <div className="flex items-center gap-2">
                                                    <span className="text-text-primary">{announcement.title}</span>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                                                        ${announcement.priority === 'high' 
                                                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                            : announcement.priority === 'medium'
                                                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                                : 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                        }`}>
                                                        {announcement.priority}
                                                    </span>
                                                </div>
                                            }
                                            secondary={
                                                <div className="flex items-center gap-2 text-gray-400 mt-1">
                                                    <Calendar size={14} />
                                                    <span>{announcement.date}</span>
                                                    <span>•</span>
                                                    <span>{announcement.content}</span>
                                                </div>
                                            }
                                        />
                                    </ListItem>
                                </motion.div>
                            ))}
                        </List>
                    </Card>

                    {/* Special Tasks */}
                    <Card className="border border-gray-600/50 hover:shadow-lg transition-all duration-300">
                        <div className="flex justify-between items-center p-4 bg-sidebar-primary border-b border-gray-600/50">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="text-green-400" size={20} />
                                <p className="text-lg text-text-primary font-medium">Special Tasks</p>
                            </div>
                        </div>
                        <List className="bg-sidebar-primary divide-y divide-gray-600/50">
                            {mySpecialTasksData.map((task, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <ListItem className="hover:bg-gray-700/30 transition-colors duration-200">
                                        <ListItemText
                                            primary={
                                                <div className="flex items-center gap-2 text-text-primary">
                                                    <span>{task.taskName}</span>
                                                </div>
                                            }
                                            secondary={
                                                <div className="flex items-center gap-2 text-gray-400 mt-1">
                                                    <Clock size={14} />
                                                    <span>{task.startTime} - {task.endTime}</span>
                                                    <span>•</span>
                                                    <span>{task.description}</span>
                                                </div>
                                            }
                                        />
                                    </ListItem>
                                </motion.div>
                            ))}
                        </List>
                    </Card>
                </div>
            </div>
            
            <TaskDrawer 
                open={isTaskDrawerOpen} 
                onClose={() => setIsTaskDrawerOpen(false)} 
            />
        </motion.div>
    );
};

export default DashboardContent;