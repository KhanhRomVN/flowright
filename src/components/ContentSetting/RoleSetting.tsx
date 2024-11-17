import React, { useState, useEffect } from 'react';
import RoleContent from '@/components/Content/RoleContent';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Users } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { _GET, _POST } from '@/utils/auth_api';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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

    const listItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.1,
            },
        }),
    };


    return (
        <div className="flex h-full gap-4">
            {isLoading ? (
                <div className="flex-1">
                    <Skeleton count={5} height={60} className="mb-2" />
                </div>
            ) : (
                <>
                    {/* Left - List Role */}
                    <Card className="w-1/3 p-4 bg-sidebar-primary h-full">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-between items-center mb-4"
                        >
                            <h2 className="text-lg font-semibold text-white">Roles</h2>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 hover:bg-primary/10 transition-colors"
                                onClick={() => setIsDialogOpen(true)}
                            >
                                <Plus className="w-4 h-4" />
                                Add Role
                            </Button>
                        </motion.div>

                        {/* Add Role Dialog */}
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogTitle className="text-lg font-semibold">Add New Role</DialogTitle>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Input
                                            id="name"
                                            placeholder="Role Name"
                                            className="w-full"
                                            value={newRoleName}
                                            onChange={(e) => setNewRoleName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Input
                                            id="description"
                                            placeholder="Role Description"
                                            className="w-full"
                                            value={newRoleDescription}
                                            onChange={(e) => setNewRoleDescription(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                        className="mr-2"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleAddRole}
                                        className="bg-primary hover:bg-primary/90"
                                    >
                                        Create Role
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Search Bar */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative mb-4"
                        >
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search roles..."
                                className="pl-8 bg-background/5 border-gray-700 focus:border-primary"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </motion.div>

                        {/* Role List */}
                        <motion.div
                            className="space-y-2 overflow-y-auto custom-scrollbar h-[calc(100vh-240px)]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredRoles.map((role, index) => (
                                    <motion.div
                                        key={role.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                            transition: { delay: index * 0.1 }
                                        }}
                                        exit={{ opacity: 0, x: -20 }}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => setSelectedRole(role)}
                                        className={`
                                            p-3 rounded-lg cursor-pointer
                                            transition-colors duration-200
                                            ${selectedRole?.id === role.id
                                                ? 'bg-primary/20 border border-primary/30'
                                                : 'bg-gray-800/50 hover:bg-gray-800/80 border border-transparent'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-10 h-10 border-2 border-primary/20">
                                                <AvatarImage
                                                    src={`https://avatar.vercel.sh/${role.name}.png`}
                                                    alt={role.name}
                                                />
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {role.name[0].toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-white truncate">
                                                    {role.name}
                                                </h3>
                                                <p className="text-sm text-gray-400 truncate">
                                                    {role.description.length > 50
                                                        ? `${role.description.substring(0, 35)}...`
                                                        : role.description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {filteredRoles.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-8 text-gray-500"
                                >
                                    <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No roles found</p>
                                </motion.div>
                            )}
                        </motion.div>
                    </Card>

                    {/* Right - Role Content */}
                    <AnimatePresence mode="wait">
                        {selectedRole && (
                            <motion.div
                                key={selectedRole.id}
                                className="flex-1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30
                                }}
                            >
                                <RoleContent
                                    selectedRoleId={selectedRole.id}
                                    roleDetailsProps={selectedRole}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!selectedRole && (
                        <motion.div
                            className="flex-1 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className="text-center text-gray-500">
                                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <h3 className="text-xl font-medium mb-2">No Role Selected</h3>
                                <p>Select a role from the list to view its details</p>
                            </div>
                        </motion.div>
                    )}
                </>
            )}
        </div>
    );
};

export default RoleSetting;