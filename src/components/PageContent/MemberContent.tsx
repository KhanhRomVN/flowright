import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Mail, Phone, MapPin, UserCircle, Briefcase, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Member {
    id: number;
    name: string;
    email: string;
    role: string;
    years_worked: number;
    phone: string;
    address: string;
}

const fakeMemberData: Member[] = [
    { id: 1, name: 'Member 1', email: 'member1@example.com', role: 'Developer', years_worked: 2, phone: '0901234567', address: '123 Main St, Anytown, USA' },
    { id: 2, name: 'Member 2', email: 'member2@example.com', role: 'Designer', years_worked: 3, phone: '0901234568', address: '456 Main St, Anytown, USA' },
    { id: 3, name: 'Member 3', email: 'member3@example.com', role: 'Manager', years_worked: 5, phone: '0901234569', address: '789 Main St, Anytown, USA' },
    { id: 4, name: 'Member 4', email: 'member4@example.com', role: 'Developer', years_worked: 1, phone: '0901234570', address: '101 Main St, Anytown, USA' },
    { id: 5, name: 'Member 5', email: 'member5@example.com', role: 'Designer', years_worked: 4, phone: '0901234571', address: '102 Main St, Anytown, USA' },
    { id: 6, name: 'Member 6', email: 'member6@example.com', role: 'Developer', years_worked: 2, phone: '0901234572', address: '103 Main St, Anytown, USA' },
    { id: 7, name: 'Member 7', email: 'member7@example.com', role: 'Manager', years_worked: 6, phone: '0901234573', address: '104 Main St, Anytown, USA' },
    { id: 8, name: 'Member 8', email: 'member8@example.com', role: 'Developer', years_worked: 3, phone: '0901234574', address: '105 Main St, Anytown, USA' },
    { id: 9, name: 'Member 9', email: 'member9@example.com', role: 'Designer', years_worked: 5, phone: '0901234575', address: '106 Main St, Anytown, USA' },
    { id: 10, name: 'Member 10', email: 'member10@example.com', role: 'Manager', years_worked: 7, phone: '0901234576', address: '107 Main St, Anytown, USA' },
    { id: 11, name: 'Member 11', email: 'member11@example.com', role: 'Developer', years_worked: 4, phone: '0901234577', address: '108 Main St, Anytown, USA' },
    { id: 12, name: 'Member 12', email: 'member12@example.com', role: 'Designer', years_worked: 2, phone: '0901234578', address: '109 Main St, Anytown, USA' },
    { id: 13, name: 'Member 13', email: 'member13@example.com', role: 'Manager', years_worked: 8, phone: '0901234579', address: '110 Main St, Anytown, USA' },
    { id: 14, name: 'Member 14', email: 'member14@example.com', role: 'Developer', years_worked: 3, phone: '0901234580', address: '111 Main St, Anytown, USA' },
];

const MemberContent: React.FC = () => {
    const [members, setMembers] = useState<Member[]>(fakeMemberData);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [newMember, setNewMember] = useState<Omit<Member, 'id'>>({
        name: '',
        email: '',
        role: 'Developer',
        years_worked: 0,
        phone: '',
        address: ''
    });

    const filteredMembers = members.filter(member => {
        const matchesSearch = 
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || member.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleAddMember = () => {
        const newId = Math.max(...members.map(m => m.id)) + 1;
        setMembers([...members, { id: newId, ...newMember }]);
        setNewMember({
            name: '',
            email: '',
            role: 'Developer',
            years_worked: 0,
            phone: '',
            address: ''
        });
    };

    const handleDeleteMember = (id: number) => {
        setMembers(members.filter(member => member.id !== id));
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
                            Add Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Member</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <Input
                                placeholder="Name"
                                value={newMember.name}
                                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                            />
                            <Input
                                placeholder="Email"
                                type="email"
                                value={newMember.email}
                                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                            />
                            <Select
                                value={newMember.role}
                                onValueChange={(value) => setNewMember({ ...newMember, role: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Developer">Developer</SelectItem>
                                    <SelectItem value="Designer">Designer</SelectItem>
                                    <SelectItem value="Manager">Manager</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                placeholder="Years Worked"
                                type="number"
                                value={newMember.years_worked.toString()}
                                onChange={(e) => setNewMember({ ...newMember, years_worked: parseInt(e.target.value) })}
                            />
                            <Input
                                placeholder="Phone"
                                value={newMember.phone}
                                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                            />
                            <Input
                                placeholder="Address"
                                value={newMember.address}
                                onChange={(e) => setNewMember({ ...newMember, address: e.target.value })}
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
                            <SelectItem value="all">All Roles</SelectItem>
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
                            <TableHead>Contact</TableHead>
                            <TableHead>Role</TableHead>
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
                                            <div className="font-medium">{member.name}</div>
                                            <div className="text-sm text-gray-500">{member.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Phone size={16} className="text-gray-400" />
                                            <span>{member.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} className="text-gray-400" />
                                            <span>{member.address}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Briefcase size={16} className="text-gray-400" />
                                        {member.role}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-gray-400" />
                                        {member.years_worked} years
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeleteMember(member.id)}
                                    >
                                        Delete
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