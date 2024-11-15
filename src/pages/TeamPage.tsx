import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { _GET, _POST } from '@/utils/auth_api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Team {
    id: string;
    name: string;
    description: string;
    type: string;
    status: string;
    leaderId: string;
    workspaceId: string;
}

const TeamPage = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newTeam, setNewTeam] = useState({ name: '', description: '', type: '', leaderId: '' });
    const [members, setMembers] = useState<any[]>([]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const data = await _GET('/team/service/teams/member');
                setTeams(data);
            } catch (error) {
                console.error('Error fetching teams:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchMembers = async () => {
            try {
                const memberData = await _GET('/member/service/members/workspace/simple');
                setMembers(memberData);
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        };

        fetchTeams();
        fetchMembers();
    }, []);

    const handleCreateTeam = async () => {
        try {
            await _POST('/team/service/teams', newTeam);
            setTeams([...teams, newTeam as Team]);
            setDialogOpen(false);
            setNewTeam({ name: '', description: '', type: '', leaderId: '' });
        } catch (error) {
            console.error('Error creating team:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex-1 h-screen overflow-y-auto custom-scrollbar p-4">
            <div className="flex justify-between items-center border-b border-gray-500 mb-4">
                <p className="text-2xl font-semibold">Your Teams</p>
                <Button className="mb-2" onClick={() => setDialogOpen(true)}>
                    <Plus />
                    Create Team
                </Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {teams.map((team) => (
                    <div className="relative bg-sidebar-primary rounded-lg p-4 space-y-2 group">
                        <h3 className="text-lg font-bold">{team.name}</h3>
                        <p className="text-sm text-gray-600 truncate">{team.description}</p>
                        <div className="absolute top-2 right-2 flex space-x-2">
                            <div className="text-xs bg-button-blueOpacity rounded-md px-2 py-1">{team.type}</div>
                        </div>
                        <p className="text-xs text-gray-500">ToDo: 7 | Doing: 3 | Done: 2</p>
                        <div className="flex space-x-[-10px]">
                            {members.slice(0, 3).map((member) => (
                                <Avatar key={member.id} className="w-6 h-6 rounded-full">
                                    <AvatarImage src="https://github.com/shadcn.png" alt={member.username} />
                                    <AvatarFallback>{member.username.charAt(0)}</AvatarFallback>
                                </Avatar>
                            ))}
                            <Avatar className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center">
                                <p className="text-xs">+1</p>
                            </Avatar>
                        </div>
                        <Button
                            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            size="sm"
                        >
                            Enter
                        </Button>
                    </div>
                ))}
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Team</DialogTitle>
                    </DialogHeader>
                    <Input
                        placeholder="Team Name"
                        value={newTeam.name}
                        onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    />
                    <Input
                        placeholder="Description"
                        value={newTeam.description}
                        onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                    />
                    <Input
                        placeholder="Type"
                        value={newTeam.type}
                        onChange={(e) => setNewTeam({ ...newTeam, type: e.target.value })}
                    />
                    <Select value={newTeam.leaderId} onValueChange={(value) => setNewTeam({ ...newTeam, leaderId: value })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Leader" />
                        </SelectTrigger>
                        <SelectContent>
                            {members.map((member) => (
                                <SelectItem key={member.id} value={member.id}>
                                    {member.username} ({member.email})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <DialogFooter>
                        <Button onClick={handleCreateTeam}>Create Team</Button>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TeamPage;