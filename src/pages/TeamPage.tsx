import React, { useEffect, useState } from 'react';
import TeamContent from '../components/PageContent/TeamContent';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { _GET, _POST } from '@/utils/auth_api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

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
    const [members, setMembers] = useState<any[]>([]); // Adjust type as needed

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const data = await _GET('/team-service/teams');
                console.log(data);
                setTeams(data);
            } catch (error) {
                console.error('Error fetching teams:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchMembers = async () => {
            try {
                const memberData = await _GET('/member-service/members/workspace/simple');
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
            await _POST('/team-service/teams', newTeam);
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
            <Button className="mb-4" onClick={() => setDialogOpen(true)}>
                <Plus />
                Create Team
            </Button>
            <div className="grid grid-cols-4 gap-4">
                {teams.map((team) => (
                    <div key={team.id} className="bg-sidebar-primary p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-bold">{team.name}</h3>
                        <p className="text-sm text-gray-600">{team.description}</p>
                        <p className="text-xs text-gray-500">Type: {team.type}</p>
                        <p className="text-xs text-gray-500">Status: {team.status}</p>
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