import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { _GET, _PUT } from '@/utils/auth_api';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from 'react-toastify';

interface Role {
    id: string;
    name: string;
    description: string;
    workspaceId: string;
}

interface ChangeRoleDialogProps {
    isOpen: boolean;
    onClose: () => void;
    currentRoleId: string;
    memberId: string;
}

const ChangeRoleDialog: React.FC<ChangeRoleDialogProps> = ({ isOpen, onClose, currentRoleId, memberId }) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await _GET('/member/service/roles/workspace/roles');
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

    const handleChangeRole = async (newRoleId: string) => {
        try {
            const response = await _PUT(`/member/service/members/role/${newRoleId}/${memberId}`, {});
            if (response) {
                toast.success('Role changed successfully');
                onClose();
            } else {
                toast.error('Failed to change role');
            }
        } catch (error) {
            toast.error('Error changing role');
            console.error('Error changing role:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Role</DialogTitle>
                </DialogHeader>
                <AnimatePresence>
                    {loading ? (
                        <Skeleton count={3} height={40} className="mb-2" />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {roles
                                .filter(role => role.id !== currentRoleId)
                                .map((role, index) => (
                                    <motion.div
                                        key={role.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ 
                                            opacity: 1, 
                                            x: 0,
                                            transition: { delay: index * 0.1 }
                                        }}
                                        className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <span>{role.name} - {role.description}</span>
                                        <Button 
                                            onClick={() => handleChangeRole(role.id)}
                                        >
                                            Change
                                        </Button>
                                    </motion.div>
                                ))
                            }
                        </motion.div>
                    )}
                </AnimatePresence>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ChangeRoleDialog;