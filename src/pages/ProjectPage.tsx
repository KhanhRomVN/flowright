import React, { useState } from 'react';
import { useProject } from '@/Context/ProjectContext';
import { motion } from 'framer-motion';
import CreateTaskDrawer from '@/components/Drawer/CreateTaskDrawer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TaskProjectBoard from '@/components/TaskProjectBoard';

const ProjectPage = () => {
    const { currentProject } = useProject();
    const [isProjectDrawerOpen, setIsProjectDrawerOpen] = useState(false);


    if (!currentProject) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-screen"
            >
                <div className="text-center text-gray-500">No project selected</div>
            </motion.div>
        );
    }

    return (
        <div>
            <h1>{currentProject.id}</h1>
            <Button
                onClick={() => setIsProjectDrawerOpen(true)}
                className="flex items-center gap-2"
            >
                <Plus className="h-4 w-4" />
                Create Task With Already ProjectID
            </Button>
            <CreateTaskDrawer
                isOpen={isProjectDrawerOpen}
                onClose={() => setIsProjectDrawerOpen(false)}
                projectId={currentProject.id}
                taskGroupId={null}
            />
            <TaskProjectBoard projectId={currentProject.id} />
        </div>
    );
};

export default ProjectPage;