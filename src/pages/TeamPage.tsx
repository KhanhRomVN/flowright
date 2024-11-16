import React from 'react';
import { useTeam } from '@/Context/TeamContext';

const TeamPage = () => {
    const { currentTeam } = useTeam();

    if (!currentTeam) {
        return <div>No team selected</div>;
    }

    return (
        <div className="flex-1 h-screen overflow-y-auto custom-scrollbar">
            {currentTeam.id}
            <h1>{currentTeam.name}</h1>
            <p>{currentTeam.description}</p>
            <div>Type: {currentTeam.type}</div>
            <div>Status: {currentTeam.status}</div>
        </div>
    );
};

export default TeamPage;