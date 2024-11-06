import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const fakeTeam = [
    { id: 1, name: 'Team 1', description: 'Team 1 description Team 1 description Team 1 description Team 1 description Team 1 description', leader_id: 1, leader_name: 'Leader 1', type: 'development', status: 'active', members: 145 },
    { id: 2, name: 'Team 2', description: 'Team 2 description', leader_id: 2, leader_name: 'Leader 2', type: 'design', status: 'active', members: 42 },
    { id: 3, name: 'Team 3', description: 'Team 3 description', leader_id: 3, leader_name: 'Leader 3', type: 'marketing', status: 'active', members: 97 },
    { id: 4, name: 'Team 4', description: 'Team 4 description', leader_id: 4, leader_name: 'Leader 4', type: 'marketing', status: 'inactive', members: 45 },
    { id: 5, name: 'Team 5', description: 'Team 5 description', leader_id: 5, leader_name: 'Leader 5', type: 'marketing', status: 'active', members: 10 },
    { id: 6, name: 'Team 6', description: 'Team 6 description', leader_id: 6, leader_name: 'Leader 6', type: 'marketing', status: 'inactive', members: 134 },
    { id: 7, name: 'Team 7', description: 'Team 7 description', leader_id: 7, leader_name: 'Leader 7', type: 'marketing', status: 'active', members: 56 },
    { id: 8, name: 'Team 8', description: 'Team 8 description', leader_id: 8, leader_name: 'Leader 8', type: 'marketing', status: 'inactive', members: 101 },
    { id: 9, name: 'Team 9', description: 'Team 9 description', leader_id: 9, leader_name: 'Leader 9', type: 'marketing', status: 'active', members: 24 },
    { id: 10, name: 'Team 10', description: 'Team 10 description', leader_id: 10, leader_name: 'Leader 10', type: 'marketing', status: 'inactive', members: 2001 },

];

const opacityColors = [
    "bg-button-blueOpacity",
    "bg-button-greenOpacity",
    "bg-button-redOpacity",
    "bg-button-yellowOpacity",
    "bg-button-purpleOpacity",
    "bg-button-orangeOpacity",
];

const TeamSetting: React.FC = () => {
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredTeams = fakeTeam.filter(team => {
        const typeMatch = typeFilter === 'all' || team.type === typeFilter;
        const statusMatch = statusFilter === 'all' || team.status === statusFilter;
        return typeMatch && statusMatch;
    });

    const handleAddTeam = () => {
        // Logic to add a new team
    };

    return (
        <div className="p-6 bg-background rounded-lg shadow-md overflow-y-auto max-h-screen custom-scrollbar"> {/* Added overflow-y-auto and max-h-screen */}
            <h1 className="text-2xl font-bold mb-4">Team Management</h1>
            <div className="mb-4 flex items-center space-x-4"> {/* Added space-x-4 for better spacing */}
                <label className="mr-2 font-semibold">Type:</label> {/* Made label bold */}
                <Select onValueChange={setTypeFilter} defaultValue="all">
                    <SelectTrigger className="border border-border rounded-lg p-2 hover:shadow-md transition duration-200"> {/* Added hover effect */}
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                </Select>

                <label className="mr-2 font-semibold">Status:</label> {/* Made label bold */}
                <Select onValueChange={setStatusFilter} defaultValue="all">
                    <SelectTrigger className="border border-border rounded-lg p-2 hover:shadow-md transition duration-200"> {/* Added hover effect */}
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                {filteredTeams.map(team => (
                    <Card key={team.id} className={'rounded-lg p-4 bg-sidebar-primary shadow-lg border border-gray-300 transition-transform transform hover:scale-105'}>
                        <div className="flex items-center mb-4 gap-4">
                            <Avatar
                                className="cursor-pointer hover:ring-2 hover:ring-gray-300 rounded-full w-12 h-12"
                            >
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-500">{team.name}</h2>
                                <p className="text-sm text-gray-500">{team.description}</p>
                                <p className="text-sm text-gray-400">Members: 100+</p>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            <p>Leader: <span className="font-medium">{team.leader_name}</span></p>
                            <p>Type: <span className="font-medium">{team.type}</span></p>
                            <p>Status: <span className={`font-medium ${team.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>{team.status}</span></p>
                        </div>
                        <Button className="mt-2 bg-secondary text-white py-1 px-2 rounded hover:bg-blue-600 transition duration-200">
                            View Details
                        </Button>
                    </Card>
                ))}
            </div>

            <Button onClick={handleAddTeam} className="mt-4 bg-primary text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                Add Team
            </Button>
        </div>
    );
};

export default TeamSetting;