import React, { useState, useEffect } from 'react';
import RoleContent from '@/components/Content/RoleContent';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { _GET } from '@/utils/auth_api';

interface Role {
    id: number;
    name: string;
    description: string;
    workspaceId: number;
    isDefault: boolean;
}

const RoleSetting: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setIsLoading(true);
                const response = await _GET('/member-service/roles/workspace/roles');
                console.log(response);
                setRoles(response.content);
                if (response.content.length > 0) {
                    setSelectedRole(response.content[0]);
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

        fetchRoles();
    }, []);

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-full gap-4"> 
            {isLoading ? (
                <div className="flex-1 flex justify-center items-center">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            ) : (
                <>
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
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                selectedRole?.id === role.id
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
                        <RoleContent selectedRoleId={selectedRole?.id ?? 0} />
                    </div>
                </>
            )}
        </div>
    );
};

export default RoleSetting;