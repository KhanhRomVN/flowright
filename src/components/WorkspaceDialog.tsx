import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiUrl } from '@/api';
import { _GET } from '@/utils/auth_api';

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
                console.log(response);
                setWorkspaces(response);
            } catch (error) {
                console.error('Error fetching workspaces:', error);
            }
        };

        if (isOpen) {
            fetchWorkspaces();
        }
    }, [isOpen]);

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
                                onClick={() => {
                                    // Handle workspace selection here
                                    window.location.href = '/';
                                }}
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