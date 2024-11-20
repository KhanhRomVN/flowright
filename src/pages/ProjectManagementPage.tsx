import React, { useEffect, useState } from 'react';
import { ArrowRight, Layers, Home, Activity, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { _GET } from '@/utils/auth_api';
import { motion, AnimatePresence } from 'framer-motion';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useProject } from '@/Context/ProjectContext';
import { Link } from '@tanstack/react-router';
import { Skeleton } from '@/components/ui/skeleton';

interface Project {
    id: string;
    name: string;
    description: string;
    ownerId: string;
    ownerUsername: string;
    creatorId: string;
    creatorUsername: string;
    startDate: string;
    endDate: string;
    status: string;
    totalTodo: number;
    totalInprogress: number;
    totalDone: number;
    totalOverdue: number;
    totalOverdone: number;
    totalCancel: number;
}

const ProjectManagementPage = () => {
    const [parent] = useAutoAnimate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const { setCurrentProject } = useProject();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await _GET('/project/service/projects/own');
                const projectsWithStats = data.map((project: Project) => ({
                    ...project,
                    totalTodo: Math.floor(Math.random() * 10),
                    totalInprogress: Math.floor(Math.random() * 15),
                    totalDone: Math.floor(Math.random() * 20),
                    totalOverdue: Math.floor(Math.random() * 5),
                    totalOverdone: Math.floor(Math.random() * 3),
                    totalCancel: Math.floor(Math.random() * 2),
                }));
                setProjects(projectsWithStats);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 h-screen overflow-y-auto custom-scrollbar p-4"
            >
                <Skeleton className="w-full h-20" />
                <Skeleton className="w-full h-20" />
                <Skeleton className="w-full h-20" />
                <Skeleton className="w-full h-20" />
                <Skeleton className="w-full h-20" />
                <Skeleton className="w-full h-20" />
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 h-screen overflow-y-auto custom-scrollbar p-4"
        >
            <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="flex justify-between items-center border-b border-gray-500 mb-4"
            >
                <p className="text-2xl font-semibold">Your Projects</p>

            </motion.div>

            <div ref={parent} className="grid grid-cols-3 gap-4">
                <AnimatePresence>
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
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
                                    {project.status}
                                </motion.div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <Home className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white/90">{project.name}</h3>
                                    <p className="text-sm text-white/60 line-clamp-2">{project.description}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <div className="bg-white/5 rounded-lg p-3 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-yellow-400" />
                                    <div>
                                        <p className="text-xs text-white/60">In Progress</p>
                                        <p className="text-sm font-semibold">{project.totalInprogress}</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                                    <div>
                                        <p className="text-xs text-white/60">Completed</p>
                                        <p className="text-sm font-semibold">{project.totalDone}</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-400" />
                                    <div>
                                        <p className="text-xs text-white/60">Todo</p>
                                        <p className="text-sm font-semibold">{project.totalTodo}</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3 flex items-center gap-2">
                                    <XCircle className="w-4 h-4 text-red-400" />
                                    <div>
                                        <p className="text-xs text-white/60">Overdone</p>
                                        <p className="text-sm font-semibold">{project.totalOverdone}</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3 flex items-center gap-2">
                                    <XCircle className="w-4 h-4 text-red-400" />
                                    <div>
                                        <p className="text-xs text-white/60">Canceled</p>
                                        <p className="text-sm font-semibold">{project.totalCancel}</p>
                                    </div>
                                </div>
                                {project.totalOverdue > 0 && (
                                    <div className="bg-red-500/10 rounded-lg p-3 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-red-400" />
                                        <div>
                                            <p className="text-xs text-white/60">Overdue</p>
                                            <p className="text-sm font-semibold text-red-400">{project.totalOverdue}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end mt-4">
                                <Link
                                    to="/project"
                                    onClick={() => setCurrentProject(project)}
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
        </motion.div>
    );
};

export default ProjectManagementPage;