import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, UserCircle, Briefcase, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { _GET } from '@/utils/auth_api';

interface Member {
    id: number;
    userId: number;
    workspaceId: number;
    roleId: number;
    email: string;
    username: string;
    roleName: string;
    level: string;
    yearsOfExperience: number;
    specializationName: string;
    isDefault: boolean;
}

const MemberContent: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [newMember, setNewMember] = useState<Omit<Member, 'id' | 'userId' | 'workspaceId' | 'isDefault'>>({
        username: '',
        email: '',
        roleId: 1,
        roleName: 'Developer',
        yearsOfExperience: 0,
        level: 'junior',
        specializationName: ''
    });
    const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null); 

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await _GET('/member-service/roles/workspace/roles');
                setRoles(response.content);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

        fetchRoles();
    }, []);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await _GET('/member-service/members/workspace');
                console.log(response);
                setMembers(response);
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        };

        fetchMembers();
    }, []);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await _GET('/member-service/members/workspace/simple');
                setMembers(response);
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        };

        fetchMembers();
    }, []);

    const filteredMembers = members.filter(member => {
        const matchesSearch =
            member.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || member.roleName === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleAddMember = () => {
        // Add member logic here
    };

    const handleViewMember = (id: number) => {
        // Delete member logic here
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const email = e.target.value;
        setNewMember({ ...newMember, email });

        // Clear the previous timeout
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Set a new timeout
        debounceTimeoutRef.current = setTimeout(async () => {
            if (email) {
                try {
                    const response = await _GET(`/auth/search/${email}`);
                    const existingEmails = new Set(members.map(member => member.email));
                    const filteredResults = response.filter((user: any) => !existingEmails.has(user.email));
                    setSuggestions(filteredResults); // Update suggestions state
                } catch (error) {
                    console.error('Error searching for email:', error);
                }
            } else {
                setSuggestions([]); // Clear suggestions if input is empty
            }
        }, 500); // 500ms debounce
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header and Controls */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Team Members</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus size={16} />
                            Invite Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Invite Member</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">

                            <Input
                                placeholder="Email"
                                type="email"
                                value={newMember.email}
                                onChange={handleEmailChange}
                            />
                            {suggestions.length > 0 && (
                                <ul className="suggestions-list">
                                    {suggestions.map(user => (
                                        <li key={user.id} onClick={() => setNewMember({ ...newMember, email: user.email })}>
                                            {user.email} ({user.username})
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <Select
                                value={newMember.roleName}
                                onValueChange={(value) => setNewMember({ ...newMember, roleName: value })}>
                                <SelectTrigger>
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
                            <Input
                                placeholder="Years Worked"
                                type="number"
                                value={newMember.yearsOfExperience.toString()}
                                onChange={(e) => setNewMember({ ...newMember, yearsOfExperience: parseInt(e.target.value) })}
                            />
                            <Button onClick={handleAddMember} className="w-full">Add Member</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <Input
                            className="pl-10"
                            placeholder="Search members..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="Developer">Developer</SelectItem>
                            <SelectItem value="Designer">Designer</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            {/* Members Table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Member</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Specialization</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Years Worked</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMembers.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <UserCircle className="w-8 h-8" />
                                        <div>
                                            <div className="font-medium">{member.username}</div>
                                            <div className="text-sm text-gray-500">{member.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{member.roleName}</TableCell>
                                <TableCell>{member.specializationName}</TableCell>
                                <TableCell>{member.level}</TableCell>
                                <TableCell>{member.yearsOfExperience} years</TableCell>
                                <TableCell>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleViewMember(member.id)}
                                    >
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
};

export default MemberContent;