import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Save } from 'lucide-react';

const fakeRoleDetail = {
    id: 1,
    name: 'Admin',
    description: 'Administrator role with full access to all features and settings.',
};

const fakeRolePermission = {
    tasks: {
        createTask: true,
        editTask: true,
        deleteTask: true,
        viewTask: true,
    },
    members: {
        inviteMember: true,
        editMember: true,
        deleteMember: true,
        viewMember: true,
    }
};

const fakeRoleMembers = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

const RoleContent: React.FC = () => {
    const [roleDetails, setRoleDetails] = useState(fakeRoleDetail);
    const [permissions, setPermissions] = useState(fakeRolePermission);
    const [members] = useState(fakeRoleMembers);

    return (
        <Card className="p-4 bg-sidebar-primary h-full">
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
                    <Button className="w-full" variant="outline">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </TabsContent>

                <TabsContent value="permissions" className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Task Permissions</h3>
                        <div className="space-y-2">
                            {Object.entries(permissions.tasks).map(([key, value]) => (
                                <div key={key} className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={value}
                                        onCheckedChange={(checked: boolean  ) => {
                                            setPermissions({
                                                ...permissions,
                                                tasks: { ...permissions.tasks, [key]: checked }
                                            });
                                        }}
                                    />
                                    <label className="text-sm">{key}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-3">Member Permissions</h3>
                        <div className="space-y-2">
                            {Object.entries(permissions.members).map(([key, value]) => (
                                <div key={key} className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={value}
                                        onCheckedChange={(checked: boolean) => {
                                            setPermissions({
                                                ...permissions,
                                                members: { ...permissions.members, [key]: checked }
                                            });
                                        }}
                                    />
                                    <label className="text-sm">{key}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button className="w-full" variant="outline">
                        <Save className="w-4 h-4 mr-2" />
                        Save Permissions
                    </Button>
                </TabsContent>

                <TabsContent value="members">
                    <div className="space-y-4">
                        <Button variant="outline" className="w-full">
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
                                    <Button variant="destructive" size="sm">Remove</Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </Card>
    );
};

export default RoleContent;