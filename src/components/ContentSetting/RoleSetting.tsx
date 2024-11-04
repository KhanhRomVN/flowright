import React, { useState } from 'react';
import RoleContent from '@/components/Content/RoleContent';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const fakeDataRoles = [
    {
        id: 1,
        name: 'Admin',
        description: 'Administrator role with full access to all features and settings.',
        workspaceId: 5,
    },
    {
        id: 2,
        name: 'Developer',
        description: 'Developer role with limited access to features and settings.',
        workspaceId: 5,
    }
];

const RoleSetting: React.FC = () => {
    const [roles] = useState(fakeDataRoles);
    const [selectedRole, setSelectedRole] = useState(roles[0]);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-full gap-4">
            {/* Left - List Role */}
            <Card className="w-1/3 p-4 bg-sidebar-primary h-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-white">Roles</h2>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Role
                    </Button>
                </div>

                <div className="relative mb-4">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search roles..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    {filteredRoles.map((role) => (
                        <div
                            key={role.id}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedRole.id === role.id
                                    ? 'bg-primary text-white'
                                    : 'hover:bg-gray-700 text-gray-200'
                                }`}
                            onClick={() => setSelectedRole(role)}
                        >
                            <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={`https://avatar.vercel.sh/${role.name}.png`} />
                                    <AvatarFallback>{role.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-medium">{role.name}</h3>
                                    <p className="text-sm text-gray-400 truncate">
                                        {role.description.length > 50
                                            ? `${role.description.substring(0, 35)}...`
                                            : role.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Right - Role Content with tabUI */}
            <div className="flex-1">
                <RoleContent />
            </div>
        </div>
    );
};

export default RoleSetting;