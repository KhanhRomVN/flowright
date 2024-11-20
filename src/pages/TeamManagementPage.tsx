import React, { useEffect, useState } from 'react';
import { AlertCircle, ArrowRight, Home, Layers, Users, Activity, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { _GET, _POST } from '@/utils/auth_api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link } from '@tanstack/react-router';
import { useTeam } from '@/Context/TeamContext';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface Team {
    id: string;
    name: string;
    description: string;
    type: string;
    status: string;
    leaderId: string;
    workspaceId: string;
    totalTodo: number;
    totalInprogress: number;
    totalOverdue: number;
    totalDone: number;
    totalOverdone: number;
    totalCancel: number;
}

const TeamManagementPage = () => {
    const [parent] = useAutoAnimate();
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newTeam, setNewTeam] = useState({ name: '', description: '', type: '', leaderId: '' });
    const [members, setMembers] = useState<any[]>([]);
    const { setCurrentTeam } = useTeam();

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const data = await _GET('/team/service/teams/member');
                setTeams(data);
            } catch (error) {
                console.error('Error fetching teams:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchMembers = async () => {
            try {
                const memberData = await _GET('/member/service/members/workspace/simple');
                setMembers(memberData);
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        };

        fetchTeams();
        fetchMembers();
    }, []);

    const handleCreateTeam = async () => {
        try {
            await _POST('/team/service/teams', newTeam);
            const newTeamWithId = { ...newTeam, id: Date.now().toString() } as Team;
            setTeams([...teams, newTeamWithId]);
            setDialogOpen(false);
            setNewTeam({ name: '', description: '', type: '', leaderId: '' });
        } catch (error) {
            console.error('Error creating team:', error);
        }
    };

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 h-screen overflow-y-auto custom-scrollbar p-4"
            >
                <div className="flex justify-between items-center border-b border-gray-500 mb-4">
                    <Skeleton
                        width={200}
                        height={32}
                        baseColor="#2a2a2a"
                        highlightColor="#3a3a3a"
                    />
                    <Skeleton
                        width={120}
                        height={40}
                        baseColor="#2a2a2a"
                        highlightColor="#3a3a3a"
                    />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                        <div key={i} className="bg-sidebar-primary rounded-lg p-4 space-y-2">
                            <Skeleton
                                height={24}
                                baseColor="#2a2a2a"
                                highlightColor="#3a3a3a"
                            />
                            <Skeleton
                                count={2}
                                baseColor="#2a2a2a"
                                highlightColor="#3a3a3a"
                            />
                            <div className="flex space-x-2 mt-4">
                                <Skeleton
                                    circle
                                    width={24}
                                    height={24}
                                    baseColor="#2a2a2a"
                                    highlightColor="#3a3a3a"
                                />
                                <Skeleton
                                    circle
                                    width={24}
                                    height={24}
                                    baseColor="#2a2a2a"
                                    highlightColor="#3a3a3a"
                                />
                                <Skeleton
                                    circle
                                    width={24}
                                    height={24}
                                    baseColor="#2a2a2a"
                                    highlightColor="#3a3a3a"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 h-screen overflow-y-auto custom-scrollbar p-4"
        >
            <motion.div className="flex items-center gap-2 pb-4">
                <Link to="/">
                    <p className="text-sm text-text-secondary">Home /</p>
                </Link>
                <p className="text-sm text-text-secondary">Team Management</p>
            </motion.div>
            <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="flex justify-between items-center border-b border-gray-500 mb-4"
            >
                <p className="text-2xl font-semibold">Your Teams</p>
            </motion.div>

            <div ref={parent} className="grid grid-cols-3 gap-4">
                <AnimatePresence>
                    {teams.map((team, index) => (
                        <motion.div
                            key={team.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="relative bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 rounded-xl p-6 space-y-4 group hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/5"
                        >
                            <div className="absolute top-4 right-4 flex items-center gap-2">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="text-xs bg-blue-500/20 text-blue-400 rounded-lg px-3 py-1.5 font-medium flex items-center gap-1"
                                >
                                    <Layers className="w-3 h-3" />
                                    {team.type}
                                </motion.div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <Users className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white/90">{team.name}</h3>
                                    <p className="text-sm text-white/60 line-clamp-2">{team.description}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <div className="bg-white/5 rounded-lg p-3 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-yellow-400" />
                                    <div>
                                        <p className="text-xs text-white/60">In Progress</p>
                                        <p className="text-sm font-semibold">{team.totalInprogress}</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                                    <div>
                                        <p className="text-xs text-white/60">Completed</p>
                                        <p className="text-sm font-semibold">{team.totalDone}</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-400" />
                                    <div>
                                        <p className="text-xs text-white/60">Todo</p>
                                        <p className="text-sm font-semibold">{team.totalTodo}</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3 flex items-center gap-2">
                                    <XCircle className="w-4 h-4 text-red-400" />
                                    <div>
                                        <p className="text-xs text-white/60">Overdone</p>
                                        <p className="text-sm font-semibold">{team.totalOverdone}</p>
                                    </div>
                                </div>
                                {team.totalOverdue > 0 && (
                                    <div className="bg-red-500/10 rounded-lg p-3 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-red-400" />
                                        <div>
                                            <p className="text-xs text-white/60">Overdue</p>
                                            <p className="text-sm font-semibold text-red-400">{team.totalOverdue}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <div className="flex -space-x-2">
                                    {members.slice(0, 3).map((member) => (
                                        <motion.div
                                            key={member.id}
                                            whileHover={{ scale: 1.1, zIndex: 10 }}
                                        >
                                            <Avatar className="w-8 h-8 border-2 border-sidebar-primary ring-2 ring-blue-500/20">
                                                <AvatarImage src="https://github.com/shadcn.png" alt={member.username} />
                                                <AvatarFallback className="bg-blue-500/20 text-blue-400">
                                                    {member.username.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </motion.div>
                                    ))}
                                    <motion.div whileHover={{ scale: 1.1 }}>
                                        <Avatar className="w-8 h-8 bg-blue-500/20 border-2 border-sidebar-primary ring-2 ring-blue-500/20">
                                            <div className="text-xs text-blue-400 font-medium">+1</div>
                                        </Avatar>
                                    </motion.div>
                                </div>

                                <Link
                                    to="/team/detail"
                                    onClick={() => setCurrentTeam(team)}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            size="sm"
                                            className="bg-blue-500 hover:bg-blue-600 text-white gap-2 px-4"
                                        >
                                            Enter <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </motion.div>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {dialogOpen && (
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogContent asChild>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-background p-6 rounded-lg"
                            >
                                <DialogHeader>
                                    <DialogTitle>Create New Team</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 my-4">
                                    <Input
                                        placeholder="Team Name"
                                        value={newTeam.name}
                                        onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                                        className="transition-all duration-300 focus:scale-[1.02]"
                                    />
                                    <Input
                                        placeholder="Description"
                                        value={newTeam.description}
                                        onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                                        className="transition-all duration-300 focus:scale-[1.02]"
                                    />
                                    <Input
                                        placeholder="Type"
                                        value={newTeam.type}
                                        onChange={(e) => setNewTeam({ ...newTeam, type: e.target.value })}
                                        className="transition-all duration-300 focus:scale-[1.02]"
                                    />
                                    <Select
                                        value={newTeam.leaderId}
                                        onValueChange={(value) => setNewTeam({ ...newTeam, leaderId: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Leader" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {members.map((member) => (
                                                <SelectItem key={member.id} value={member.id}>
                                                    {member.username} ({member.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <DialogFooter className="space-x-2">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button onClick={handleCreateTeam}>Create Team</Button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                    </motion.div>
                                </DialogFooter>
                            </motion.div>
                        </DialogContent>
                    </Dialog>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default TeamManagementPage;