import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Save } from 'lucide-react';
import { _GET } from '@/utils/auth_api';
import { Search } from 'lucide-react';
import ChangeRoleDialog from '@/components/ChangeRoleDialog';

// Types
interface RoleDetail {
    id: number;
    name: string;
    description: string;
}

interface Member {
    id: number;
    username: string;
    email: string;
}

const workspacePermissions = [
    "change_workspace_name",
    "view_workspace_info",
    "manage_workspace_settings",
    "delete_workspace"
];

const memberPermissions = [
    "view_member_info",
    "edit_member_info",
    "invite_member",
    "remove_member",
    "manage_member_roles",
    "manage_member_specializations"
];

const teamPermissions = [
    "create_team",
    "view_team_info",
    "edit_team_info",
    "delete_team",
    "add_team_member",
    "remove_team_member",
    "manage_team_leader",
    "view_team_logs"
];

const projectPermissions = [
    "create_project",
    "view_project_info",
    "edit_project_info",
    "delete_project",
    "manage_project_members",
    "manage_project_teams",
    "view_project_logs",
    "change_project_status"
];

const taskPermissions = [
    "create_task",
    "view_task",
    "edit_task_info",
    "delete_task",
    "assign_task",
    "change_task_status",
    "change_task_priority",
    "manage_task_links",
    "add_task_comment",
    "view_task_logs",
    "manage_task_dependencies"
];

// Grouped permissions for UI display
const groupedPermissions = {
    workspace: {
        title: "Workspace Permissions",
        permissions: workspacePermissions
    },
    member: {
        title: "Member Permissions",
        permissions: memberPermissions
    },
    team: {
        title: "Team Permissions",
        permissions: teamPermissions
    },
    project: {
        title: "Project Permissions",
        permissions: projectPermissions
    },
    task: {
        title: "Task Permissions",
        permissions: taskPermissions
    }
};

// Helper function to format permission display name
const formatPermissionName = (permission: string): string => {
    return permission
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const RoleContent: React.FC<{ selectedRoleId: number; roleDetailsProps: RoleDetail }> = ({ selectedRoleId, roleDetailsProps }) => {
    const [roleDetails, setRoleDetails] = useState<RoleDetail>(roleDetailsProps);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [isChangeRoleDialogOpen, setChangeRoleDialogOpen] = useState(false);
    const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

    const openChangeRoleDialog = (memberId: number) => {
        setSelectedMemberId(memberId);
        setChangeRoleDialogOpen(true);
    };

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await _GET(`/member-service/role-permissions/roles/${selectedRoleId}/permissions`);
                const responseMembers = await _GET(`/member-service/members/role/${selectedRoleId}`);
                console.log(responseMembers);
                const permissions = response.map((perm: { name: string }) => perm.name);
                const members = responseMembers.map((member: { id: number, username: string, email: string }) => ({ id: member.id, username: member.username, email: member.email }));
                setSelectedPermissions(permissions);
                setMembers(members);
            } catch (error) {
                console.error('Error fetching permissions:', error);
            }
        };

        fetchPermissions();
    }, [selectedRoleId]);

    const handlePermissionChange = (permission: string, checked: boolean) => {
        setSelectedPermissions(prev => {
            if (checked) {
                return [...prev, permission];
            } else {
                return prev.filter(p => p !== permission);
            }
        });
    };

    const handleSaveDetails = () => {
    };

    const handleSavePermissions = () => {
    };

    // Filter members based on search query
    const filteredMembers = members.filter(member =>
        member.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-screen overflow-y-auto custom-scrollbar pb-56">
            <Card className="p-4 bg-sidebar-primary h-auto ">
                <Tabs defaultValue="details">
                    <TabsList className="mb-4">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="permissions">Permissions</TabsTrigger>
                        <TabsTrigger value="members">Members</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-400">Role Name</label>
                            <Input
                                value={roleDetails.name}
                                onChange={(e) => setRoleDetails({ ...roleDetails, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Description</label>
                            <Input
                                value={roleDetails.description}
                                onChange={(e) => setRoleDetails({ ...roleDetails, description: e.target.value })}
                            />
                        </div>
                        <Button className="w-full" variant="outline" onClick={handleSaveDetails}>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </Button>
                    </TabsContent>

                    <TabsContent value="permissions" className="space-y-6">
                        {Object.entries(groupedPermissions).map(([key, group]) => (
                            <div key={key}>
                                <h3 className="text-lg font-semibold mb-3">{group.title}</h3>
                                <div className="space-y-2">
                                    {group.permissions.map((permission) => (
                                        <div key={permission} className="flex items-center space-x-2">
                                            <Checkbox
                                                checked={selectedPermissions.includes(permission)}
                                                onCheckedChange={(checked) =>
                                                    handlePermissionChange(permission, checked as boolean)
                                                }
                                            />
                                            <label className="text-sm">
                                                {permission}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <Button className="w-full" variant="outline" onClick={handleSavePermissions}>
                            <Save className="w-4 h-4 mr-2" />
                            Save Permissions
                        </Button>
                    </TabsContent>

                    <TabsContent value="members">
                        <div className="space-y-4">
                            <div className="relative mb-4">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Search by username or email..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                {filteredMembers.map((member) => (
                                    <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={`https://avatar.vercel.sh/${member.username}.png`} />
                                                <AvatarFallback>{member.username}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{member.username}</p>
                                                <p className="text-sm text-gray-400">{member.email}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openChangeRoleDialog(member.id)} // Open dialog with member ID
                                        >
                                            Change Role
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </Card>
            <ChangeRoleDialog
                isOpen={isChangeRoleDialogOpen}
                onClose={() => setChangeRoleDialogOpen(false)}
                currentRoleId={selectedRoleId} // Pass the current role ID
                memberId={selectedMemberId!} // Pass the selected member ID
            />
        </div>
    );
};

export default RoleContent;