import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from 'framer-motion';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import CreateProjectDialog from '@/components/Dialog/CreateProjectDialog';
import ProjectTable from '@/components/Table/ProjectTable';
import { _GET } from '@/utils/auth_api';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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

const ProjectSetting: React.FC = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [parent] = useAutoAnimate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await _GET('/project/service/projects');
                setProjects(data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="p-4 space-y-4">
                <Skeleton height={40} />
                <Skeleton height={300} />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 space-y-4"
        >
            {/* Controls Section */}
            <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search projects..."
                            className="pl-8 w-[300px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </Button>
                </div>
                <Button 
                    onClick={() => setDialogOpen(true)}
                    className="flex items-center gap-2"
                >
                    <Plus size={16} />
                    Create Project
                </Button>
            </div>

            {/* Projects Table */}
            <div ref={parent}>
                <ProjectTable projects={filteredProjects} />
            </div>

            {/* Create Project Dialog */}
            <CreateProjectDialog 
                open={dialogOpen} 
                onOpenChange={setDialogOpen}
            />
        </motion.div>
    );
};

export default ProjectSetting;