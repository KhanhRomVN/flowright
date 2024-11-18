import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Plus, Share, Heart, MoreHorizontal } from 'lucide-react';
import TaskContent from '../components/PageContent/TaskContent';
import { Button } from '@/components/ui/button';

const TaskPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex justify-between items-center px-4 py-2">
                <h1 className="text-2xl font-bold">Your Tasks</h1>
                <div className="flex gap-4">
                    <Plus className="w-5 h-5" />
                    <Share className="w-5 h-5" />
                    <Heart className="w-5 h-5" />
                    <MoreHorizontal className="w-5 h-5" />
                </div>
            </div>
            <Suspense fallback={
                <div className="flex items-center justify-center h-screen">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            }>
                <TaskContent />
            </Suspense>
        </motion.div>
    );
};

export default TaskPage;