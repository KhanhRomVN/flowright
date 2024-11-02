import React, { useState } from 'react';
import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemText,
    LinearProgress
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
    Filter
} from 'lucide-react';
import TaskDrawer from '@/components/Drawer/TaskDrawer';

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
        // Implement project creation logic
        console.log('Creating new project...');
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        // Implement search logic
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    return (
        <div className="flex flex-col gap-4 pt-4 px-4 mb-20">
            {/* Header with Search and Actions */}
            <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                    <div className="relative w-64">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full px-4 py-2 rounded-lg border bg-sidebar-primary text-white"
                        />
                        <Search className="absolute right-3 top-2.5 text-white" size={20} />
                    </div>
                    <Button
                        variant="outline"
                        onClick={toggleFilters}
                        className="flex items-center gap-2"
                    >
                        <Filter size={16} />
                        Filters
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={handleCreateTask}
                    >
                        <Plus size={16} />
                        Tạo task
                    </Button>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={handleCreateProject}
                    >
                        <Plus size={16} />
                        Tạo dự án
                    </Button>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <Card className="p-4 bg-sidebar-primary text-white">
                    <div className="grid grid-cols-4 gap-4">
                        {/* Add your filter controls here */}
                        <div>
                            <Typography variant="subtitle2">Trạng thái</Typography>
                            {/* Add status filter controls */}
                        </div>
                        <div>
                            <Typography variant="subtitle2">Độ ưu tiên</Typography>
                            {/* Add priority filter controls */}
                        </div>
                        <div>
                            <Typography variant="subtitle2">Thành viên</Typography>
                            {/* Add member filter controls */}
                        </div>
                        <div>
                            <Typography variant="subtitle2">Thời gian</Typography>
                            {/* Add date filter controls */}
                        </div>
                    </div>
                </Card>
            )}

            {/* Team Overview Cards */}
            <div className="grid grid-cols-4 gap-4">
                <Card>
                    <div className="flex items-center gap-2 bg-sidebar-primary p-4 text-white">
                        <Users size={24} />
                        <div>
                            <Typography variant="subtitle2">Total Members</Typography>
                            <Typography variant="h4">{teamOverviewData.totalMembers}</Typography>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-2 bg-sidebar-primary p-4 text-white">
                        <Briefcase size={24} />
                        <div>
                            <Typography variant="subtitle2">Active Projects</Typography>
                            <Typography variant="h4">{teamOverviewData.activeProjects}</Typography>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-2 bg-sidebar-primary p-4 text-white">
                        <Calendar size={24} />
                        <div>
                            <Typography variant="subtitle2">On Leave Today</Typography>
                            <Typography variant="h4">{teamOverviewData.onLeaveToday}</Typography>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-2 bg-sidebar-primary p-4 text-white">
                        <Bell size={24} />
                        <div>
                            <Typography variant="subtitle2">New Tasks</Typography>
                            <Typography variant="h4">{teamOverviewData.newTasks}</Typography>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Content */}
            <div className="flex gap-4">
                {/* Left Column - 60% */}
                <div className='w-[60%] flex flex-col gap-4'>
                    {/* Working Hours Chart */}
                    <Card>
                        <div className='flex justify-between items-center p-2 bg-sidebar-primary'>
                            <p className='text-lg text-white font-medium'>Activity</p>
                        </div>
                        <div style={{ height: '300px' }} className='bg-sidebar-primary'>
                            <ResponsiveBar
                                data={workingHoursPerDayOfWeekData}
                                keys={['hours']}
                                indexBy="day"
                                margin={{ top: 50, right: 30, bottom: 40, left: 40 }}
                                padding={0.3}
                                valueScale={{ type: 'linear' }}
                                colors={d => {
                                    switch (d.data.day) {
                                        case 2: return 'var(--blue-button-background)';
                                        case 3: return 'var(--green-button-background)';
                                        case 4: return 'var(--red-button-background)';
                                        case 5: return 'var(--yellow-button-background)';
                                        case 6: return 'var(--purple-button-background)';
                                        case 7: return '#ffffff';
                                        case 8: return '#000000';
                                        default: return '#ffffff';
                                    }
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
                    <Card>
                        <div className="flex justify-between items-center p-2 bg-sidebar-primary">
                            <p className='text-lg text-white font-medium'>Projects List</p>
                        </div>
                        <div className="space-y-4 p-4 bg-sidebar-primary">
                            {projectsData.map((project, index) => (
                                <div key={index} className="p-4 bg-sidebar-secondary rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-white font-medium">
                                            {project.name}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded text-xs ${project.priority === 'high'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {project.priority}
                                            </span>
                                            <p className="text-white">
                                                Deadline: {project.deadline}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <LinearProgress
                                            variant="determinate"
                                            value={project.progress}
                                            className="h-2 rounded"
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex -space-x-2">
                                            {project.teamMembers.map((member, i) => (
                                                <div
                                                    key={i}
                                                    className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm border-2 border-white"
                                                >
                                                    {member[0]}
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-white">
                                            {project.progress}% completed
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>


                </div>

                {/* Right Column - 40% */}
                <div className='w-[40%] flex flex-col gap-4'>
                    {/* Announcements */}
                    <Card>
                        <div className='flex justify-between items-center p-2 bg-sidebar-primary'>
                            <p className='text-lg text-white font-medium'>Thông báo</p>
                        </div>
                        <List className='bg-sidebar-primary'>
                            {announcementsData.map((announcement, index) => (
                                <ListItem key={index} className='bg-sidebar-primary text-white border-b border-outline'>
                                    <ListItemText
                                        primary={
                                            <div className="flex items-center gap-2">
                                                <span>{announcement.title}</span>
                                                <span className={`px-2 py-0.5 rounded text-xs ${announcement.priority === 'high'
                                                        ? 'bg-red-100 text-red-800'
                                                        : announcement.priority === 'medium'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {announcement.priority}
                                                </span>
                                            </div>
                                        }
                                        secondary={`${announcement.date}: ${announcement.content}`}
                                        secondaryTypographyProps={{ style: { color: 'white' } }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Card>

                    {/* Special Tasks */}
                    <Card>
                        <div className='flex justify-between items-center p-2 bg-sidebar-primary'>
                            <p className='text-lg text-white font-medium'>Special Tasks</p>
                        </div>
                        <List className='bg-sidebar-primary'>
                            {mySpecialTasksData.map((task, index) => (
                                <React.Fragment key={index}>
                                    <ListItem className='bg-sidebar-primary text-white border-b border-outline'>
                                        <ListItemText
                                            primary={task.taskName}
                                            secondary={`${task.startTime} - ${task.endTime}: ${task.description}`}
                                            secondaryTypographyProps={{ style: { color: 'white' } }}
                                        />
                                    </ListItem>
                                </React.Fragment>
                            ))}
                        </List>
                    </Card>
                </div>
            </div>
            <TaskDrawer 
                open={isTaskDrawerOpen} 
                onClose={() => setIsTaskDrawerOpen(false)} 
            />
        </div>
    );
};

export default DashboardContent;