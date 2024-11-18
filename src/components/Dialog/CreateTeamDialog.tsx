import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { _GET, _POST } from '@/utils/auth_api';
import { motion } from 'framer-motion';
import { Users, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface CreateTeamDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onTeamCreated: () => void;
}

interface Member {
    id: string;
    email: string;
    username: string;
}

const CreateTeamDialog: React.FC<CreateTeamDialogProps> = ({
    open,
    onOpenChange,
    onTeamCreated
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: '',
        leaderId: ''
    });
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await _GET('/member/service/members/workspace/simple');
                setMembers(response);
            } catch (error) {
                console.error('Error fetching members:', error);
                toast.error('Failed to load members');
            }
        };

        if (open) {
            fetchMembers();
        }
    }, [open]);

    const handleSubmit = async () => {
        if (!formData.name || !formData.type || !formData.leaderId) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsLoading(true);
        try {
            await _POST('/team/service/teams', formData);
            toast.success('Team created successfully');
            onTeamCreated();
            onOpenChange(false);
            setFormData({ name: '', description: '', type: '', leaderId: '' });
        } catch (error) {
            console.error('Error creating team:', error);
            toast.error('Failed to create team');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Create New Team
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 my-4">
                    <Input
                        placeholder="Team Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="transition-all duration-300 focus:scale-[1.02]"
                    />
                    <Input
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="transition-all duration-300 focus:scale-[1.02]"
                    />
                    <Input
                        placeholder="Type"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="transition-all duration-300 focus:scale-[1.02]"
                    />
                    <Select
                        value={formData.leaderId}
                        onValueChange={(value) => setFormData({ ...formData, leaderId: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Team Leader" />
                        </SelectTrigger>
                        <SelectContent>
                            {members.map((member) => (
                                <SelectItem key={member.id} value={member.id}>
                                    {member.username} ({member.email})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Team'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateTeamDialog;