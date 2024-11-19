import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { _GET, _POST } from '@/utils/auth_api';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Mail, Shield, Loader2 } from 'lucide-react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const InviteMemberDialog: React.FC = () => {
    const [newMember, setNewMember] = useState({ email: '', roleName: '' });
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [parent] = useAutoAnimate();
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [workspaceMembers, setWorkspaceMembers] = useState<any[]>([]);


    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [rolesResponse, membersResponse] = await Promise.all([
                    _GET('/member/service/roles'),
                    _GET('/member/service/members/workspace/simple')
                ]);
                setRoles(rolesResponse);
                setWorkspaceMembers(membersResponse);
            } catch (error) {
                console.error('Error fetching initial data:', error);
                setError('Failed to load initial data. Please try again.');
            }
        };

        fetchInitialData();
    }, []);

    const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const email = e.target.value;
        setNewMember({ ...newMember, email });
        setIsSearching(true);

        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = setTimeout(async () => {
            if (email) {
                try {
                    const response = await _GET(`/auth/search/${email}`);
                    // Filter out emails that are already workspace members
                    const filteredSuggestions = response.filter((user: any) =>
                        !workspaceMembers.some(member => member.email === user.email)
                    );
                    setSuggestions(filteredSuggestions);
                } catch (error) {
                    console.error('Error searching for email:', error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSuggestions([]);
                setIsSearching(false);
            }
        }, 500);
    };

    const handleAddMember = async () => {
        if (!newMember.email || !selectedRole) {
            setError('Please fill in all required fields');
            return;
        }

        setIsLoading(true);
        try {
            const inviteData = { email: newMember.email, roleId: selectedRole };
            await _POST('/workspace/service/invites', inviteData);
            setNewMember({ email: '', roleName: '' });
            setSuggestions([]);
            setSuccess('Member invited successfully!');
            setError(null);
            setSelectedRole(null);
        } catch (error) {
            setError('Error inviting member. Please try again.');
            console.error('Error adding member:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2 hover:scale-105 transition-transform">
                    <UserPlus className="w-4 h-4" />
                    Invite Member
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        Invite Member
                    </DialogTitle>
                </DialogHeader>
                <div ref={parent} className="space-y-4 pt-4">
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-3 rounded bg-gray-900 text-red-600 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-3 rounded bg-green-100 text-green-600 text-sm"
                            >
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                        <Input
                            placeholder="Email"
                            type="email"
                            value={newMember.email}
                            onChange={handleEmailChange}
                            className="pl-9"
                        />
                    </div>

                    <AnimatePresence>
                        {isSearching ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <Skeleton count={3} className="h-8 mb-1 bg-gray-900" />
                            </motion.div>
                        ) : suggestions.length > 0 && (
                            <motion.ul
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-background border rounded-md shadow-sm"
                            >
                                {suggestions.map(user => (
                                    <motion.li
                                        key={user.id}
                                        whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                                        className="p-2 cursor-pointer flex items-center gap-2"
                                        onClick={() => setNewMember({ ...newMember, email: user.email })}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            {user.username[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{user.email}</p>
                                            <p className="text-xs text-gray-500">{user.username}</p>
                                        </div>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        )}
                    </AnimatePresence>

                    <div className="relative">
                        <Shield className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                        <Select
                            value={selectedRole || ''}
                            onValueChange={(value) => {
                                setNewMember({ ...newMember, roleName: value });
                                const selectedRoleObj = roles.find(role => role.name === value);
                                if (selectedRoleObj) setSelectedRole(selectedRoleObj.id);
                            }}
                        >
                            <SelectTrigger className="pl-9">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map(role => (
                                    <SelectItem key={role.id} value={role.name}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        onClick={handleAddMember}
                        className="w-full"
                        disabled={isLoading || !newMember.email || !selectedRole}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Inviting...
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Invite Member
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InviteMemberDialog;