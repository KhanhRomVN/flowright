import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Plus, Search, Users, Building, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { _GET, _POST } from '@/utils/auth_api';
import { toast } from 'react-toastify';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Workspace {
    id: string;
    name: string;
    ownerId: string;
    ownerUsername: string;
    totalMembers: number;
    description?: string;
}

interface WorkspaceInvite {
    id: string;
    email: string;
    roleId: string;
    roleName: string;
    workspaceId: string;
    workspaceName: string;
    token: string;
    status: string;
    expiresAt: string;
}

const WorkspaceManagementPage: React.FC = () => {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [parent] = useAutoAnimate();
    const [newWorkspace, setNewWorkspace] = useState({
        name: '',
        description: ''
    });

    const [invites, setInvites] = useState<WorkspaceInvite[]>([]);
    const [isLoadingInvites, setIsLoadingInvites] = useState(true);

    useEffect(() => {
        fetchWorkspaces();
        fetchInvites();
    }, []);

    const fetchInvites = async () => {
        try {
            const response = await _GET('/workspace/service/invites');
            if (response) {
                setInvites(response);
            }
        } catch (error) {

        } finally {
            setIsLoadingInvites(false);
        }
    };


    const handleAcceptInvite = async (token: string) => {
        try {
            const invite = invites.find(inv => inv.token === token);
            if (!invite) {
                toast.error('Invite not found');
                return;
            }

            const inviteData = {
                email: invite.email,
                workspaceId: invite.workspaceId,
                token
            };

            await _POST(`/workspace/service/invites/accept`, inviteData);
            setInvites(invites.filter(invite => invite.token !== token));
            toast.success('Invitation accepted');
            await fetchWorkspaces(); // Refresh workspaces list
        } catch (error) {
            toast.error('Failed to accept invitation');
        }
    };

    const fetchWorkspaces = async () => {
        try {
            const ownerWorkspacesResponse = await _GET(`/workspace/service/workspaces`);
            const membersWorkspacesResponse = await _GET(`/workspace/service/workspace-members`);
            const combinedWorkspaces = [...ownerWorkspacesResponse, ...membersWorkspacesResponse];
            setWorkspaces(combinedWorkspaces);
        } catch (error) {
            toast.error('Failed to fetch workspaces');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateWorkspace = async () => {
        if (!newWorkspace.name.trim()) {
            toast.error('Workspace name is required');
            return;
        }

        try {
            const response = await _POST(`/workspace/service/workspaces`, newWorkspace);
            setWorkspaces([...workspaces, response]);
            setNewWorkspace({ name: '', description: '' });
            toast.success('Workspace created successfully');
        } catch (error) {
            toast.error('Failed to create workspace');
        }
    };

    const handleWorkspaceSelect = async (workspaceId: string) => {
        try {
            const response = await _GET(`/member/service/members/new/access-token?workspace_id=${workspaceId}`);
            if (response.access_token) {
                localStorage.setItem('access_token', response.access_token);
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Error fetching new access token:', error);
            toast.error('Failed to switch workspace');
        }
    };

    const filteredWorkspaces = workspaces.filter(workspace =>
        workspace.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen p-8 bg-background"
            >
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex justify-between items-center">
                        <Skeleton width={200} height={40} />
                        <Skeleton width={150} height={40} />
                    </div>
                    <Card>
                        <CardHeader>
                            <Skeleton width={200} height={24} />
                            <Skeleton width={300} height={20} />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton height={40} />
                            <Skeleton height={80} />
                            <Skeleton width={120} height={40} />
                        </CardContent>
                    </Card>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} height={120} />
                        ))}
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-screen p-8 bg-background overflow-y-auto custom-scrollbar"
        >
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    className="flex justify-between items-center mb-8"
                >
                    <div>
                        <h1 className="text-3xl font-bold">Workspace Management</h1>
                        <p className="text-muted-foreground mt-1">Create and manage your workspaces</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search workspaces..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 w-[250px]"
                        />
                    </div>
                </motion.div>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Create New Workspace</CardTitle>
                        <CardDescription>Set up a new workspace for your team</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Input
                                type="text"
                                placeholder="Workspace Name"
                                value={newWorkspace.name}
                                onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                            />
                            <Textarea
                                placeholder="Description (optional)"
                                value={newWorkspace.description}
                                onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
                                className="resize-none"
                                rows={3}
                            />
                            <Button
                                onClick={handleCreateWorkspace}
                                className="w-full sm:w-auto"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Workspace
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Workspace Invitations</CardTitle>
                        <CardDescription>Pending invitations to join workspaces</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-[300px] pr-2">
                            {isLoadingInvites ? (
                                <Skeleton height={100} />
                            ) : invites.length > 0 ? (
                                invites.map((invite) => (
                                    <Card key={invite.id} className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-semibold">{invite.workspaceName}</h4>
                                                <div className="text-sm text-muted-foreground">
                                                    Role: <Badge variant="secondary">{invite.roleName}</Badge>
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-1">
                                                    Expires: {new Date(invite.expiresAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <Button onClick={() => handleAcceptInvite(invite.token)}>
                                                Accept Invitation
                                            </Button>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground">No pending invitations</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div ref={parent} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] pr-2">
                    <AnimatePresence>
                        {filteredWorkspaces.map((workspace, index) => (
                            <motion.div
                                key={workspace.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <Card
                                    className="group cursor-pointer hover:shadow-lg transition-all duration-300"
                                    onClick={() => handleWorkspaceSelect(workspace.id)}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-center space-x-4">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={`https://avatar.vercel.sh/${workspace.id}.png`} />
                                                <AvatarFallback>{workspace.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-semibold">{workspace.name}</h3>
                                                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                                    <Users className="w-4 h-4 mr-1" />
                                                    <span>{workspace.totalMembers} members</span>
                                                    <Building className="w-4 h-4 ml-4 mr-1" />
                                                    <span>Owned by {`@${workspace.ownerUsername}`}</span>
                                                </div>
                                                {workspace.description && (
                                                    <p className="text-sm text-muted-foreground mt-2">
                                                        {workspace.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {filteredWorkspaces.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-2 text-center py-8"
                        >
                            <p className="text-muted-foreground">No workspaces found</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default WorkspaceManagementPage;