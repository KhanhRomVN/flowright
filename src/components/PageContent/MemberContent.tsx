import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UserCircle } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { _GET } from '@/utils/auth_api';
import InviteMemberDialog from '@/components/InviteMemberDialog';

interface Member {
    id: number;
    username: string;
    email: string;
    roleName: string;
    specializationName: string;
    level: string;
    yearsOfExperience: number;
}

const MemberContent: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const membersResponse = await _GET('/member/service/members/workspace/simple');
                setMembers(membersResponse);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredMembers = members.filter(member => {
        const matchesSearch = member.username.toLowerCase().includes(searchQuery.toLowerCase()) || member.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || member.roleName === roleFilter;
        return matchesSearch && matchesRole;
    });



    return (
        <div className="p-6 space-y-6">
            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <>
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Team Members</h1>

                    </div>

                    <Card className="p-4">
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <Input className="pl-10" placeholder="Search members..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </div>
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Filter by role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </Card>

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
                                            <Button variant="destructive" size="sm">View</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </>
            )}
        </div>
    );
};

export default MemberContent;