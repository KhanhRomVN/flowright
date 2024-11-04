import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Save } from 'lucide-react';

// Types
interface RoleDetail {
    id: number;
    name: string;
    description: string;
}

interface Member {
    id: number;
    name: string;
    email: string;
}

// Constants - Role Details
const fakeRoleDetail: RoleDetail = {
    id: 1,
    name: 'Developer',
    description: 'Standard developer role with access to development features.',
};

// Constants - Permissions
const workspacePermissions = [
    "change_workspace_name",
    "view_workspace_info",
    "manage_workspace_settings",
    "delete_workspace"
]

const memberPermissions = [
    "view_member_info",
    "edit_member_info",
    "invite_member",
    "remove_member",
    "manage_member_roles",
    "manage_member_specializations"
]

const teamPermissions = [
    "create_team",
    "view_team_info",
    "edit_team_info",
    "delete_team",
    "add_team_member",
    "remove_team_member",
    "manage_team_leader",
    "view_team_logs"
]

const projectPermissions = [
    "create_project",
    "view_project_info",
    "edit_project_info",
    "delete_project",
    "manage_project_members",
    "manage_project_teams",
    "view_project_logs",
    "change_project_status"
]

const taskPermissions = [
    "create_task",
    "view_task_info",
    "edit_task_info",
    "delete_task",
    "assign_task",
    "change_task_status",
    "change_task_priority",
    "manage_task_links",
    "add_task_comment",
    "view_task_logs",
    "manage_task_dependencies"
]

const allPermissions = [
    ...workspacePermissions,
    ...memberPermissions,
    ...teamPermissions,
    ...projectPermissions,
    ...taskPermissions,
]

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

// Developer role default permissions
const fakeDeveloperRolePermission = [
    // Task related
    "view_task_info",
    "edit_task_info",
    "change_task_status",
    "add_task_comment",

    // Project related
    "view_project_info",

    // Team related
    "view_team_info",

    // Member related
    "view_member_info",
    "edit_member_info",

    // Workspace related
    "view_workspace_info"
];

const fakeRoleMembers: Member[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

// Helper function to format permission display name
const formatPermissionName = (permission: string): string => {
    return permission
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const RoleContent: React.FC = () => {
    const [roleDetails, setRoleDetails] = useState<RoleDetail>(fakeRoleDetail);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(fakeDeveloperRolePermission);
    const [members] = useState<Member[]>(fakeRoleMembers);

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
        console.log('Saving role details:', roleDetails);
    };

    const handleSavePermissions = () => {
        console.log('Saving permissions:', selectedPermissions);
    };

    const handleAddMember = () => {
        console.log('Adding new member');
    };

    const handleRemoveMember = (memberId: number) => {
        console.log('Removing member:', memberId);
    };

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
                                                {formatPermissionName(permission)}
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
                            <Button variant="outline" className="w-full" onClick={handleAddMember}>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Add Member
                            </Button>

                            <div className="space-y-2">
                                {members.map((member) => (
                                    <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={`https://avatar.vercel.sh/${member.name}.png`} />
                                                <AvatarFallback>{member.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{member.name}</p>
                                                <p className="text-sm text-gray-400">{member.email}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleRemoveMember(member.id)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>

    );
};

export default RoleContent;