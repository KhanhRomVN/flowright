import React, { useState, useEffect } from 'react';
import RoleContent from '@/components/Content/RoleContent';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Plus, 
    Search, 
    Users, 
    Shield,
    Settings2,
    AlertCircle,
    UserPlus,
    ChevronRight
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { _GET, _POST } from '@/utils/auth_api';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from 'react-toastify';

interface Role {
    id: string;
    name: string;
    description: string;
    workspaceId: string;
}

const roleCardColors = {
    selected: 'bg-blue-500/20 border border-blue-500/30',
    default: 'bg-gray-800/50 hover:bg-gray-800/80 border border-transparent',
    avatar: {
        border: 'border-blue-500/20',
        fallback: 'bg-blue-500/10 text-blue-400'
    }
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const roleCardVariants = {
    hidden: { 
        opacity: 0, 
        x: -20,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 20
        }
    },
    hover: {
        scale: 1.02,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10
        }
    }
};

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
            } catch (error) {
                toast.error('Failed to fetch roles');
                console.error('Error fetching roles:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRoles();
    }, []);

    const handleAddRole = async () => {
        if (!newRoleName.trim()) {
            toast.warning('Please enter a role name');
            return;
        }

        try {
            const response = await _POST('/member/service/roles', {
                name: newRoleName,
                description: newRoleDescription,
            });
            setRoles([...roles, response]);
            setIsDialogOpen(false);
            setNewRoleName('');
            setNewRoleDescription('');
            toast.success('Role created successfully');
        } catch (error) {
            toast.error('Failed to create role');
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
                <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between mb-6">
                        <Skeleton width={120} height={24} className="rounded-md" />
                        <Skeleton width={100} height={36} className="rounded-md" />
                    </div>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg">
                            <Skeleton circle width={40} height={40} />
                            <div className="flex-1">
                                <Skeleton width={150} height={20} className="mb-2" />
                                <Skeleton width={200} height={16} />
                            </div>
                        </div>
                    ))}
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
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-400" />
                                <h2 className="text-lg font-semibold text-white">Roles</h2>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 hover:bg-blue-500/20 transition-colors"
                                onClick={() => setIsDialogOpen(true)}
                            >
                                <UserPlus className="w-4 h-4 text-blue-400" />
                                Add Role
                            </Button>
                        </motion.div>

                        {/* Add Role Dialog */}
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogContent className="sm:max-w-[425px] bg-sidebar-primary border-gray-700">
                                <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-white">
                                    <Shield className="w-5 h-5 text-blue-400" />
                                    Add New Role
                                </DialogTitle>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Input
                                            id="name"
                                            placeholder="Role Name"
                                            className="w-full bg-gray-800/50 border-gray-700 focus:border-blue-500"
                                            value={newRoleName}
                                            onChange={(e) => setNewRoleName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Input
                                            id="description"
                                            placeholder="Role Description"
                                            className="w-full bg-gray-800/50 border-gray-700 focus:border-blue-500"
                                            value={newRoleDescription}
                                            onChange={(e) => setNewRoleDescription(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                        className="mr-2 border-gray-700 hover:bg-gray-800"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleAddRole}
                                        className="bg-blue-500 hover:bg-blue-600"
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
                            className="relative mb-4 group"
                        >
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 
                                           text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                            <Input
                                placeholder="Search roles..."
                                className="pl-10 bg-gray-800/30 border-gray-700 focus:border-blue-500 
                                          focus:ring-2 focus:ring-blue-500/20 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </motion.div>

                        {/* Role List */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-2 overflow-y-auto custom-scrollbar h-[calc(100vh-240px)]"
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredRoles.map((role, index) => (
                                    <motion.div
                                        key={role.id}
                                        variants={roleCardVariants}
                                        layout
                                        whileHover="hover"
                                        onClick={() => setSelectedRole(role)}
                                        className={`
                                            p-3 rounded-lg cursor-pointer
                                            transition-all duration-200
                                            ${selectedRole?.id === role.id
                                                ? roleCardColors.selected
                                                : roleCardColors.default
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className={`w-10 h-10 border-2 ${roleCardColors.avatar.border}`}>
                                                <AvatarImage
                                                    src={`https://avatar.vercel.sh/${role.name}.png`}
                                                    alt={role.name}
                                                />
                                                <AvatarFallback className={roleCardColors.avatar.fallback}>
                                                    {role.name[0].toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-white truncate flex items-center gap-2">
                                                    {role.name}
                                                    <ChevronRight className="w-4 h-4 text-gray-400" />
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
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-12 px-4"
                                >
                                    <div className="bg-gray-800/30 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                                        <AlertCircle className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-300 mb-2">No roles found</h3>
                                    <p className="text-gray-500 text-sm">
                                        Try adjusting your search or create a new role
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    </Card>

                    {/* Right - Role Content */}
                    <AnimatePresence mode="wait">
                        {selectedRole ? (
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
                        ) : (
                            <motion.div
                                className="flex-1 flex items-center justify-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="text-center text-gray-500">
                                    <Settings2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <h3 className="text-xl font-medium mb-2">No Role Selected</h3>
                                    <p>Select a role from the list to view and manage its details</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </div>
    );
};

export default RoleSetting;