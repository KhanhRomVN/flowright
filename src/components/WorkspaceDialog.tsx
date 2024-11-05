import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { _GET } from '@/utils/auth_api';
import axios from 'axios';

interface Workspace {
    id: number;
    name: string;
    ownerId: number;
    createdAt: string | null;
    updatedAt: string | null;
}

interface WorkspaceDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const WorkspaceDialog: React.FC<WorkspaceDialogProps> = ({ isOpen, onClose }) => {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

    useEffect(() => {
        const fetchWorkspaces = async () => {
            try {
                const response = await _GET(`/workspace-service/workspaces`);
                setWorkspaces(response);
            } catch (error) {
                console.error('Error fetching workspaces:', error);
            }
        };

        if (isOpen) {
            fetchWorkspaces();
        }
    }, [isOpen]);

    const handleWorkspaceSelect = async (workspaceId: number) => {
        try {
            const response = await _GET(`/member-service/members/new-access-token/${workspaceId}`);
            console.log(response);
            if (response.access_token) {
                localStorage.setItem('access_token', response.access_token);
                window.location.href = '/';
            }

        } catch (error) {
            console.error('Error fetching new access token:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Select Workspace</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {workspaces.length === 0 ? (
                        <p>No workspaces found</p>
                    ) : (
                        workspaces.map((workspace) => (
                            <button
                                key={workspace.id}
                                className="p-4 text-left hover:bg-gray-100 rounded-lg transition-colors"
                                onClick={() => handleWorkspaceSelect(workspace.id)}
                            >
                                {workspace.name}
                            </button>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default WorkspaceDialog;