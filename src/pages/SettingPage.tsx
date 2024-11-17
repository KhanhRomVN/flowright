import React, { useState, useEffect } from 'react';
import RoleSetting from '@/components/ContentSetting/RoleSetting';
import SpecializationSetting from '@/components/ContentSetting/SpecializationSetting';
import TeamSetting from '@/components/ContentSetting/TeamSetting';
import InviteManagerSetting from '@/components/ContentSetting/InviteManagerSetting';
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useAutoAnimate from '@formkit/auto-animate/react';
import { cn } from "@/lib/utils";
import ProjectSetting from '@/components/ContentSetting/ProjectSetting';
interface Tab {
    id: string;
    label: string;
    icon?: React.ReactNode;
    component: React.ReactNode;
}

const SettingPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('role');
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading when switching tabs
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, [activeTab]);

    const tabs: Tab[] = [
        {
            id: 'role',
            label: 'Role',
            component: <RoleSetting />
        },
        {
            id: 'specialization',
            label: 'Specialization',
            component: <SpecializationSetting />
        },
        {
            id: 'team',
            label: 'Team',
            component: <TeamSetting />
        },
        {
            id: 'invite',
            label: 'Invite',
            component: <InviteManagerSetting />
        },
        {
            id: 'project',
            label: 'Project',
            component: <ProjectSetting />
        }
    ];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.3 }
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.2 }
        }
    };

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: {
                duration: 0.2,
                ease: "easeIn"
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className="min-h-screen flex-col bg-background"
        >
            <div className="px-4">
                <nav className="border-b border-border">
                    <div className="flex space-x-4">
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "px-4 py-3 font-medium relative transition-colors duration-200",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                    "rounded-t-lg",
                                    activeTab === tab.id
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                aria-selected={activeTab === tab.id}
                                role="tab"
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                        layoutId="activeTab"
                                        transition={{
                                            type: "spring",
                                            stiffness: 380,
                                            damping: 30
                                        }}
                                    />
                                )}
                            </motion.button>
                        ))}
                    </div>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="p-4">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            <Skeleton 
                                height={60} 
                                baseColor="#27272a" 
                                highlightColor="#3f3f46"
                            />
                            <Skeleton 
                                height={120} 
                                baseColor="#27272a" 
                                highlightColor="#3f3f46"
                            />
                            <Skeleton 
                                height={90} 
                                baseColor="#27272a" 
                                highlightColor="#3f3f46"
                            />
                            <Skeleton 
                                height={60} 
                                count={3} 
                                baseColor="#27272a" 
                                highlightColor="#3f3f46"
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key={activeTab}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={contentVariants}
                            className="min-h-[400px]"
                        >
                            {tabs.find(tab => tab.id === activeTab)?.component}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div >
    );
};

export default SettingPage;