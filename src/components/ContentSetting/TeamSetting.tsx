import React, { useState, useEffect } from 'react';
import CreateTeamDialog from '@/components/Dialog/CreateTeamDialog';
import { Button } from "@/components/ui/button";
import { Plus, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { motion } from 'framer-motion';
import { _GET } from '@/utils/auth_api';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface Team {
    id: string;
    name: string;
    description: string;
    leaderId: string;
    leaderUsername: string;
    totalMember: number;
    status: string;
}

const TeamSetting = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [parent] = useAutoAnimate();

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const response = await _GET('/team/service/teams');
            setTeams(response);
        } catch (error) {
            console.error('Error fetching teams:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTeams = teams.filter(team =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.leaderUsername.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton height={40} />
                <Skeleton height={40} count={5} />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
        >
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search teams..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 w-[300px]"
                        />
                    </div>
                </div>
                <Button
                    onClick={() => setDialogOpen(true)}
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Create Team
                </Button>
            </div>

            {/* Teams Table */}
            <div ref={parent} className="rounded-lg shadow-sm">
                <Table>
                    <TableHeader className="bg-table-header hover:bg-table-headerHover">
                        <TableRow>
                            <TableHead className="font-semibold">Team Name</TableHead>
                            <TableHead className="font-semibold">Description</TableHead>
                            <TableHead className="font-semibold">Leader</TableHead>
                            <TableHead className="font-semibold">Members</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="bg-table-body">
                        {filteredTeams.map((team) => (
                            <TableRow key={team.id} className="hover:bg-muted/50 hover:bg-table-bodyHover">
                                <TableCell className="font-medium">{team.name}</TableCell>
                                <TableCell>{team.description}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">
                                        @{team.leaderUsername}
                                    </Badge>
                                </TableCell>
                                <TableCell>{team.totalMember}</TableCell>
                                <TableCell>
                                    <Badge variant={team.status === 'active' ? 'default' : 'secondary'}>
                                        {team.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Create Team Dialog */}
            <CreateTeamDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onTeamCreated={fetchTeams}
            />
        </motion.div>
    );
};

export default TeamSetting;