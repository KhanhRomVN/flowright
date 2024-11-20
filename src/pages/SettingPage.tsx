import React, { useState, useEffect } from 'react';
import RoleSetting from '@/components/ContentSetting/RoleSetting';
import SpecializationSetting from '@/components/ContentSetting/SpecializationSetting';
import TeamSetting from '@/components/ContentSetting/TeamSetting';
import InviteManagerSetting from '@/components/ContentSetting/InviteManagerSetting';
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { cn } from "@/lib/utils";
import ProjectSetting from '@/components/ContentSetting/ProjectSetting';
import { 
    UserCog, 
    Briefcase, 
    Users, 
    UserPlus, 
    FolderKanban,
    Settings2
} from 'lucide-react';

interface Tab {
    id: string;
    label: string;
    icon: React.ReactNode;
    component: React.ReactNode;
    color: string;
    gradient: string;
}

const SettingPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('role');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, [activeTab]);

    const tabs: Tab[] = [
        {
            id: 'role',
            label: 'Role',
            icon: <UserCog className="w-4 h-4" />,
            component: <RoleSetting />,
            color: 'text-blue-500',
            gradient: 'from-blue-500/20 to-blue-600/10'
        },
        {
            id: 'specialization',
            label: 'Specialization',
            icon: <Briefcase className="w-4 h-4" />,
            component: <SpecializationSetting />,
            color: 'text-purple-500',
            gradient: 'from-purple-500/20 to-purple-600/10'
        },
        {
            id: 'team',
            label: 'Team',
            icon: <Users className="w-4 h-4" />,
            component: <TeamSetting />,
            color: 'text-green-500',
            gradient: 'from-green-500/20 to-green-600/10'
        },
        {
            id: 'invite',
            label: 'Invite',
            icon: <UserPlus className="w-4 h-4" />,
            component: <InviteManagerSetting />,
            color: 'text-yellow-500',
            gradient: 'from-yellow-500/20 to-yellow-600/10'
        },
        {
            id: 'project',
            label: 'Project',
            icon: <FolderKanban className="w-4 h-4" />,
            component: <ProjectSetting />,
            color: 'text-red-500',
            gradient: 'from-red-500/20 to-red-600/10'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" }
        },
        exit: {
            opacity: 0,
            y: 10,
            transition: { duration: 0.3, ease: "easeIn" }
        }
    };

    const contentVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            scale: 0.95,
            transition: {
                duration: 0.3,
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
            <div className="px-4 pt-4">
                <div className="flex items-center gap-2 mb-6">
                    <Settings2 className="w-5 h-5 text-primary" />
                    <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
                </div>
                <nav className="border-b border-border">
                    <div className="flex space-x-4">
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "px-4 py-3 font-medium relative transition-all duration-200",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                    "rounded-t-lg flex items-center gap-2",
                                    activeTab === tab.id
                                        ? `${tab.color} bg-gradient-to-br ${tab.gradient}`
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                aria-selected={activeTab === tab.id}
                                role="tab"
                            >
                                {tab.icon}
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        className={cn(
                                            "absolute bottom-0 left-0 right-0 h-0.5",
                                            tab.color.replace('text', 'bg')
                                        )}
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
                                className="rounded-lg"
                            />
                            <Skeleton 
                                height={120} 
                                baseColor="#27272a" 
                                highlightColor="#3f3f46"
                                className="rounded-lg"
                            />
                            <Skeleton 
                                height={90} 
                                baseColor="#27272a" 
                                highlightColor="#3f3f46"
                                className="rounded-lg"
                            />
                            <Skeleton 
                                height={60} 
                                count={3} 
                                baseColor="#27272a" 
                                highlightColor="#3f3f46"
                                className="rounded-lg"
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key={activeTab}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={contentVariants}
                            className="min-h-[400px] p-4 bg-card rounded-lg border border-border"
                        >
                            {tabs.find(tab => tab.id === activeTab)?.component}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default SettingPage;