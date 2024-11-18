import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { _GET } from '@/utils/auth_api';
import { motion, AnimatePresence } from 'framer-motion';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useProject } from '@/Context/ProjectContext';
import { Link } from '@tanstack/react-router';

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
                setProjects(data);
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
                {/* Same loading skeleton as TeamManagementPage */}
                {/* ... */}
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
                            className="relative bg-sidebar-primary rounded-lg p-4 space-y-2 group hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-opacity-90"
                        >
                            <div className="absolute top-2 right-2 flex space-x-2">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="text-xs bg-color-blueOpacity rounded-md px-2 py-1"
                                >
                                    {project.status}
                                </motion.div>
                            </div>

                            <h3 className="text-lg font-bold">{project.name}</h3>
                            <p className="text-sm text-gray-600 truncate">{project.description}</p>

                            <div className="text-xs text-gray-500">
                                <div>Owner: {project.ownerUsername}</div>
                                <div>Start: {new Date(project.startDate).toLocaleDateString()}</div>
                                <div>End: {new Date(project.endDate).toLocaleDateString()}</div>
                            </div>

                            <Link
                                to="/project"
                                onClick={() => setCurrentProject(project)}
                                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                            >
                                <Button size="sm">
                                    Enter
                                </Button>
                            </Link>

                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default ProjectManagementPage;