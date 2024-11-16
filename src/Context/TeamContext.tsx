import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Team {
    id: string;
    name: string;
    description: string;
    type: string;
    status: string;
    leaderId: string;
    workspaceId: string;
}

interface TeamContextType {
    currentTeam: Team | null;
    setCurrentTeam: (team: Team | null) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

interface TeamProviderProps {
    children: ReactNode;
}

export const TeamProvider: React.FC<TeamProviderProps> = ({ children }) => {
    const [currentTeam, setCurrentTeam] = useState<Team | null>(null);

    return (
        <TeamContext.Provider value={{ currentTeam, setCurrentTeam }}>
            {children}
        </TeamContext.Provider>
    );
};

export const useTeam = () => {
    const context = useContext(TeamContext);
    if (context === undefined) {
        throw new Error('useTeam must be used within a TeamProvider');
    }
    return context;
};