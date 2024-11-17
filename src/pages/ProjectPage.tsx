import React, { useState } from 'react';
import { useProject } from '@/Context/ProjectContext';
import { motion } from 'framer-motion';
import CreateTaskDrawer from '@/components/Drawer/CreateTaskDrawer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TaskProjectBoard from '@/components/TaskProjectBoard';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Share2, Heart, MoreHorizontal } from 'lucide-react'

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
            <div className="flex items-center gap-2 pt-4 pl-4">
                <p>Project / </p>
                <p>{currentProject.name}</p>
            </div>
            <div className="flex justify-between items-center p-4">
                <div className="flex items-center gap-4">
                    <p className="text-2xl font-semibold">{currentProject.name}</p>
                    <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((_, index) => (
                            <Avatar key={index} className="border-2 border-background w-8 h-8">
                                <AvatarImage src={`https://i.pravatar.cc/150?img=${index + 1}`} />
                                <AvatarFallback>U{index + 1}</AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <Share2 className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                    </Button>
                    <Button
                        onClick={() => setIsProjectDrawerOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Create Task
                    </Button>
                </div>
            </div>
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