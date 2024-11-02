import { nextDay } from 'date-fns';
import React from 'react';

const fakeTasksProjectData = [
    // id, name, team_id, team_name, status, start_date, start_time, end_date, end_time, nexttask_id (null if no next task)
    { id: 1, name: 'Project 1', team_id: 1, team_name: 'Team 1', status: 'Active', start_date: '2024-01-01', start_time: '09:00', end_date: '2024-01-01', end_time: '10:00', nexttask_id: 2 },
    { id: 2, name: 'Project 2', team_id: 2, team_name: 'Team 2', status: 'Active', start_date: '2024-01-01', start_time: '09:00', end_date: '2024-01-01', end_time: '10:00', nexttask_id: null },
    { id: 3, name: 'Project 3', team_id: 3, team_name: 'Team 3', status: 'Active', start_date: '2024-01-01', start_time: '09:00', end_date: '2024-01-01', end_time: '10:00', nexttask_id: 5 },
    { id: 4, name: 'Project 4', team_id: 4, team_name: 'Team 4', status: 'Active', start_date: '2024-01-01', start_time: '09:00', end_date: '2024-01-01', end_time: '10:00', nexttask_id: null },
    { id: 5, name: 'Project 5', team_id: 5, team_name: 'Team 5', status: 'Active', start_date: '2024-01-01', start_time: '09:00', end_date: '2024-01-01', end_time: '10:00', nexttask_id: null },
    { id: 6, name: 'Project 6', team_id: 6, team_name: 'Team 6', status: 'Active', start_date: '2024-01-01', start_time: '09:00', end_date: '2024-01-01', end_time: '10:00', nexttask_id: null },
    { id: 7, name: 'Project 7', team_id: 7, team_name: 'Team 7', status: 'Active', start_date: '2024-01-01', start_time: '09:00', end_date: '2024-01-01', end_time: '10:00', nexttask_id: 7 },
]

const ProjectContent: React.FC = () => {
    return <div>
    </div>;
};

export default ProjectContent;
