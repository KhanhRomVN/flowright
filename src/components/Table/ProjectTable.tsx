import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useAutoAnimate } from '@formkit/auto-animate/react';

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

interface ProjectTableProps {
    projects: Project[];
}

const ProjectTable: React.FC<ProjectTableProps> = ({ projects }) => {
    const [parent] = useAutoAnimate();

    return (
        <div ref={parent} className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Creator</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Timeline</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <AnimatePresence>
                        {projects.map((project) => (
                            <motion.tr
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                <TableCell>
                                    <div>
                                        <p className="font-medium">{project.name}</p>
                                        <p className="text-gray-500 truncate max-w-xs">
                                            {project.description}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">
                                        @{project.ownerUsername}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">
                                        @{project.creatorUsername}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={
                                        project.status === 'completed' ? 'secondary' :
                                        project.status === 'in_progress' ? 'default' :
                                        'outline'
                                    }>
                                        {project.status.replace('_', ' ')}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        {format(new Date(project.startDate), 'MMM d, yyyy')} - 
                                        {format(new Date(project.endDate), 'MMM d, yyyy')}
                                    </div>
                                </TableCell>
                            </motion.tr>
                        ))}
                    </AnimatePresence>
                </TableBody>
            </Table>
        </div>
    );
};

export default ProjectTable;