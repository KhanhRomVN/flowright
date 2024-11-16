import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { _GET, _POST } from '@/utils/auth_api';

interface InviteMemberDialogProps {
    onMemberAdded: (email: string, roleId: string) => void;
}

const InviteMemberDialog: React.FC<InviteMemberDialogProps> = ({ onMemberAdded }) => {
    const [newMember, setNewMember] = useState({ email: '', roleName: '' });
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const rolesResponse = await _GET('/member/service/roles/workspace/roles');
                setRoles(rolesResponse.content);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

        fetchRoles();
    }, []);

    const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const email = e.target.value;
        setNewMember({ ...newMember, email });
        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = setTimeout(async () => {
            if (email) {
                try {
                    const response = await _GET(`/auth/search/${email}`);
                    setSuggestions(response);
                } catch (error) {
                    console.error('Error searching for email:', error);
                }
            } else {
                setSuggestions([]);
            }
        }, 500);
    };

    const handleAddMember = async () => {
        try {
            const inviteData = { email: newMember.email, roleId: selectedRole };
            await _POST('/workspace/service/invites', inviteData);
            onMemberAdded(newMember.email, selectedRole!);
            setNewMember({ email: '', roleName: '' });
            setSuggestions([]);
            setSuccess('Member added successfully!');
            setError(null);
        } catch (error) {
            setError('Error adding member. Please try again.');
            console.error('Error adding member:', error);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    Invite Member
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                    {error && <div className="text-red-500">{error}</div>}
                    {success && <div className="text-green-500">{success}</div>}
                    <Input placeholder="Email" type="email" value={newMember.email} onChange={handleEmailChange} />
                    {suggestions.length > 0 && (
                        <ul className="suggestions-list">
                            {suggestions.map(user => (
                                <li key={user.id} onClick={() => setNewMember({ ...newMember, email: user.email })}>
                                    {user.email} ({user.username})
                                </li>
                            ))}
                        </ul>
                    )}
                    <Select value={selectedRole || ''} onValueChange={(value) => {
                        setNewMember({ ...newMember, roleName: value });
                        const selectedRoleObj = roles.find(role => role.name === value);
                        if (selectedRoleObj) setSelectedRole(selectedRoleObj.id);
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map(role => (
                                <SelectItem key={role.id} value={role.name}>
                                    {role.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleAddMember} className="w-full">Add Member</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InviteMemberDialog;