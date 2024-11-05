import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { _GET, _PUT } from '@/utils/auth_api';

interface Role {
    id: number;
    name: string;
    description: string;
    workspaceId: number;
}

interface ChangeRoleDialogProps {
    isOpen: boolean;
    onClose: () => void;
    currentRoleId: number;
    memberId: number; // Assuming you need memberId to change the role
}

const ChangeRoleDialog: React.FC<ChangeRoleDialogProps> = ({ isOpen, onClose, currentRoleId, memberId }) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await _GET('/member-service/roles/workspace/roles');
                setRoles(response.content);
            } catch (error) {
                console.error('Error fetching roles:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchRoles();
        }
    }, [isOpen]);

    const handleChangeRole = async (newRoleId: number) => {
        try {
            const response = await _PUT(`/member-service/members/role/${newRoleId}/${memberId}`, {});
            if (response) {
                console.log(`Changed member ${memberId} role to ${newRoleId}`);
                onClose();
            } else {
                console.error('Failed to change role:', response.message);
            }
        } catch (error) {
            console.error('Error changing role:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Role</DialogTitle>
                </DialogHeader>
                <div>
                    {loading ? (
                        <p>Loading roles...</p>
                    ) : (
                        roles
                            .filter(role => role.id !== currentRoleId) // Exclude current role
                            .map(role => (
                                <div key={role.id} className="flex justify-between items-center p-2">
                                    <span>{role.name} - {role.description}</span>
                                    <Button onClick={() => handleChangeRole(role.id)}>Change</Button>
                                </div>
                            ))
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ChangeRoleDialog;