import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { _GET } from '@/utils/auth_api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Workspace {
    id: string;
    name: string;
    ownerId: string;
    ownerUsername: string;
    totalMembers: number;
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
                const ownerWorkspacesResponse = await _GET(`/workspace-service/workspaces`);
                const membersWorkspacesResponse = await _GET(`/workspace-service/workspace-members`);
               
                const combinedWorkspaces = [...ownerWorkspacesResponse, ...membersWorkspacesResponse];

                console.log(combinedWorkspaces);

                setWorkspaces(combinedWorkspaces);
            } catch (error) {
                console.error('Error fetching workspaces:', error);
            }
        };

        if (isOpen) {
            fetchWorkspaces();
        }
    }, [isOpen]);

    const handleWorkspaceSelect = async (workspaceId: string) => {
        try {
            const response = await _GET(`/member-service/members/new/access-token?workspace_id=${workspaceId}`);
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
                        <p className="text-center text-gray-500">No workspaces found</p>
                    ) : (
                        workspaces.map((workspace) => (
                            <button
                                key={workspace.id}
                                className="flex items-center p-4 text-left bg-sidebar-primary shadow-md hover:shadow-lg rounded-lg transition-shadow duration-200"
                                onClick={() => handleWorkspaceSelect(workspace.id)}
                            >
                                <Avatar className="mr-3">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>
                                        {workspace.ownerUsername.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-lg">{workspace.name}</span>
                                    <span className="text-sm text-gray-500">{workspace.totalMembers} members</span>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default WorkspaceDialog;