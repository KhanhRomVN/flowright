import React, { useState, useEffect } from 'react';
import RoleContent from '@/components/Content/RoleContent';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { _GET, _POST } from '@/utils/auth_api';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

interface Role {
    id: string;
    name: string;
    description: string;
    workspaceId: string;
}

const RoleSetting: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newRoleName, setNewRoleName] = useState('');
    const [newRoleDescription, setNewRoleDescription] = useState('');

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setIsLoading(true);
                const response = await _GET('/member/service/roles');
                const rolesWithDefault = response.map((role: Role) => ({
                    ...role,
                    isDefault: false
                }));
                setRoles(rolesWithDefault);
                if (rolesWithDefault.length > 0) {
                    setSelectedRole(rolesWithDefault[0]);
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

        fetchRoles();
    }, []);

    const handleAddRole = async () => {
        try {
            const response = await _POST('/member/service/roles', {
                name: newRoleName,
                description: newRoleDescription,
            });
            setRoles([...roles, response]);
            setIsDialogOpen(false);
            setNewRoleName('');
            setNewRoleDescription('');
        } catch (error) {
            console.error('Error adding role:', error);
        }
    };

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-full gap-4">
            {isLoading ? (
                <div className="flex-1 flex justify-center items-center">
                    <Skeleton className="w-full h-full mb-2" />
                </div>
            ) : (
                <>
                    {/* Left - List Role */}
                    <Card className="w-1/3 p-4 bg-sidebar-primary h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-white">Roles</h2>
                            <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => setIsDialogOpen(true)}>
                                <Plus className="w-4 h-4" />
                                Add Role
                            </Button>
                        </div>

                        {/* Dialog for adding a new role */}

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogContent>
                                <DialogTitle>Add New Role</DialogTitle>
                                <DialogDescription>
                                    <Input
                                        placeholder="Role Name"
                                        value={newRoleName}
                                        onChange={(e) => setNewRoleName(e.target.value)}
                                    />
                                    <Input
                                        placeholder="Role Description"
                                        value={newRoleDescription}
                                        onChange={(e) => setNewRoleDescription(e.target.value)}
                                    />
                                </DialogDescription>
                                <DialogFooter>
                                    <Button onClick={handleAddRole}>Submit</Button>
                                    <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Search */}
                        {isLoading ? (
                            <Skeleton className="h-10 mb-2" />
                        ) : (
                            <div className="relative mb-4">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Search roles..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        )}

                        {/* List Role */}
                        <div className="space-y-2 overflow-y-auto custom-scrollbar h-80">
                            {filteredRoles.map((role) => (
                                <div
                                    key={role.id}
                                    className={` p-3 rounded-lg cursor-pointer transition-colors ${selectedRole?.id === role.id
                                        ? 'bg-primary text-white'
                                        : 'hover:bg-gray-700 text-gray-200'
                                        }`

                                    }
                                    onClick={() => {
                                        setSelectedRole(role);
                                    }}
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
                        <RoleContent
                            selectedRoleId={selectedRole?.id ?? ''}
                            roleDetailsProps={selectedRole || { id: '', name: '', description: '', workspaceId: '' }}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default RoleSetting;