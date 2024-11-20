import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { _GET, _POST } from '@/utils/auth_api';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, UserPlus, Users, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from 'react-toastify';

interface TeamMember {
    id: string;
    teamId: string;
    memberId: string;
    memberUsername: string;
    memberEmail: string;
}

interface WorkspaceMember {
    id: string;
    email: string;
    username: string;
}

interface AddMemberTeamDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    teamId: string;
}

const AddMemberTeamDialog: React.FC<AddMemberTeamDialogProps> = ({
    open,
    onOpenChange,
    teamId
}) => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [workspaceMembers, setWorkspaceMembers] = useState<WorkspaceMember[]>([]);
    const [filteredMembers, setFilteredMembers] = useState<WorkspaceMember[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            fetchMembers();
        }
    }, [open, teamId]);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const [teamResponse, workspaceResponse] = await Promise.all([
                _GET(`/team/service/teams/members?teamId=${teamId}`),
                _GET('/member/service/members/workspace/simple')
            ]);

            setTeamMembers(teamResponse);
            
            // Filter out members who are already in the team
            const teamMemberIds = new Set(teamResponse.map((member: TeamMember) => member.memberId));
            const availableMembers = workspaceResponse.filter(
                (member: WorkspaceMember) => !teamMemberIds.has(member.id)
            );
            
            setWorkspaceMembers(availableMembers);
            setFilteredMembers(availableMembers);
        } catch (error) {
            console.error('Error fetching members:', error);
            toast.error('Failed to load members');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        const filtered = workspaceMembers.filter(member =>
            member.username.toLowerCase().includes(term.toLowerCase()) ||
            member.email.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredMembers(filtered);
    };

    const handleAddMember = async (memberId: string) => {
        try {
            await _POST('/team/service/teams/members', {
                memberId,
                teamId
            });
            
            // Refresh the member lists
            await fetchMembers();
            toast.success('Member added successfully');
        } catch (error) {
            console.error('Error adding member:', error);
            toast.error('Failed to add member');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Team Members
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Current Team Members */}
                    <div>
                        <h3 className="text-sm font-medium mb-2">Current Members</h3>
                        <ScrollArea className="h-[150px] rounded-md border p-2">
                            <div className="space-y-2">
                                {teamMembers.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center justify-between p-2 rounded-lg bg-secondary/10"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.memberUsername}`} />
                                                <AvatarFallback>{member.memberUsername[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">{member.memberUsername}</p>
                                                <p className="text-xs text-muted-foreground">{member.memberEmail}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Add New Members Section */}
                    <div>
                        <h3 className="text-sm font-medium mb-2">Add New Members</h3>
                        <div className="relative mb-4">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search members..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-8"
                            />
                        </div>

                        <ScrollArea className="h-[200px] rounded-md border p-2">
                            <div className="space-y-2">
                                {filteredMembers.map((member) => (
                                    <motion.div
                                        key={member.id}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/10"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.username}`} />
                                                <AvatarFallback>{member.username[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">{member.username}</p>
                                                <p className="text-xs text-muted-foreground">{member.email}</p>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleAddMember(member.id)}
                                            className="flex items-center gap-1"
                                        >
                                            <UserPlus className="h-4 w-4" />
                                            Add
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddMemberTeamDialog;