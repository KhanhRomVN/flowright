import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveCalendar } from '@nivo/calendar';
import { Card, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { Button } from '../ui/button';


const workingHoursPerDayOfWeekData = [
    // day, month, year, hours
    // day: 2 = Monday
    { day: 2, month: 8, year: 2024, hours: 9 },
    { day: 3, month: 8, year: 2024, hours: 7 },
    { day: 4, month: 8, year: 2024, hours: 8 },
    { day: 5, month: 8, year: 2024, hours: 10 },
    { day: 6, month: 8, year: 2024, hours: 12 },
    { day: 7, month: 8, year: 2024, hours: 0 },
    { day: 8, month: 8, year: 2024, hours: 0 },
];

const entireWorkPlanForTheWeekData = [
    { date: '02/08/2024', startTime: '10:00', endTime: '12:00', task: 'Design Website' },
    { date: '02/08/2024', startTime: '15:00', endTime: '16:00', task: 'Meeting with client' },
    { date: '03/08/2024', startTime: '13:00', endTime: '15:00', task: 'View Project' },
    { date: '04/08/2024', startTime: '09:00', endTime: '11:00', task: 'Increase Productivity' },
    { date: '05/08/2024', startTime: '10:00', endTime: '12:00', task: 'Design Filter' },
    { date: '06/08/2024', startTime: '13:00', endTime: '15:00', task: 'Meeting with client' },
    { date: '06/08/2024', startTime: '19:00', endTime: '20:00', task: 'Meeting with boss' },
    { date: '07/08/2024', startTime: '09:00', endTime: '11:00', task: 'Design Website' },
    { date: '08/08/2024', startTime: '10:00', endTime: '12:00', task: 'Meeting with client' },
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

const myLogData = [
    { id: 1, log_time: '02/08/2024', log_description: 'I worked 9 hours', created_at: '2024-08-02' },
    { id: 2, log_time: '03/08/2024', log_description: 'I worked 7 hours', created_at: '2024-08-03' },
    { id: 3, log_time: '04/08/2024', log_description: 'I worked 8 hours', created_at: '2024-08-04' },
];

const monthlyAttendanceData = [
    // day, month, year, is_attendance = true or false
    { day: 1, month: 8, year: 2024, is_attendance: true },
    { day: 2, month: 8, year: 2024, is_attendance: false },
    { day: 3, month: 8, year: 2024, is_attendance: true },
    { day: 4, month: 8, year: 2024, is_attendance: false },
    { day: 5, month: 8, year: 2024, is_attendance: true },
    { day: 6, month: 8, year: 2024, is_attendance: true },
    { day: 7, month: 8, year: 2024, is_attendance: true },
    { day: 8, month: 8, year: 2024, is_attendance: true },
];

const DashboardContent: React.FC = () => {
    const workingHoursData = [{
        id: "working hours",
        data: workingHoursPerDayOfWeekData.map(item => ({
            x: item.day,
            y: item.hours
        }))
    }];

    const attendanceData = monthlyAttendanceData.map(item => ({
        day: `${item.year}-${String(item.month).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`,
        value: item.is_attendance ? 1 : 0
    }));

    

    return (
        <div className="flex gap-4 p-4 ">
            {/* Left - 60% */}
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
                                text: {
                                    fill: '#ffffff',
                                },
                                axis: {
                                    ticks: {
                                        text: {
                                            fill: '#ffffff'
                                        }
                                    }
                                },
                                grid: {
                                    line: {
                                        stroke: '#ffffff33'
                                    }
                                }
                            }}
                            enableLabel={true}
                            label={d => `${d.value}h`}
                            labelTextColor="#ffffff"
                        />
                    </div>
                </Card>

                {/* Work Plan Grid */}
                <Card className="p-4">
                    <Typography variant="h6">Work Plan</Typography>
                    <div className="mt-4">
                        {entireWorkPlanForTheWeekData.map((event, index) => (
                            <div
                                key={index}
                                className="mb-3 p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                            >
                                <Typography variant="subtitle1" className="font-medium">
                                    {event.task}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {event.date} | {event.startTime} - {event.endTime}
                                </Typography>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Right - 40% */}
            <div className='w-[40%] flex flex-col gap-4'>
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

                {/* Attendance Calendar */}
                <Card className="p-4">
    <Typography variant="h6">Monthly Attendance</Typography>
    <div style={{ height: '200px' }}>
        <ResponsiveCalendar
            data={attendanceData}
            from={`2024-08-01`}
            to={`2024-08-31`}
            emptyColor="#eeeeee"
            colors={['#61cdbb']}
            margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
            monthSpacing={0}
            daySpacing={3}
            dayBorderWidth={2}
            dayBorderColor="#ffffff"
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'row',
                    translateY: 36,
                    itemCount: 2,
                    itemWidth: 42,
                    itemHeight: 36,
                    itemsSpacing: 14,
                    itemDirection: 'right-to-left'
                }
            ]}
        />
    </div>
</Card>

                {/* Logs */}
                <Card className="p-4">
                    <Typography variant="h6">My Logs</Typography>
                    <List>
                        {myLogData.map((log) => (
                            <ListItem key={log.id}>
                                <ListItemText
                                    primary={log.log_description}
                                    secondary={log.log_time}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Card>
            </div>
        </div>
    );
};

export default DashboardContent;