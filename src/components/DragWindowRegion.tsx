import { closeWindow, maximizeWindow, minimizeWindow } from "@/helpers/window_helpers";
import React, { useEffect, useState, useCallback, memo } from "react";
import { Minus, Maximize2, X, User, Settings, LogOut, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { _GET } from "@/utils/auth_api";
import { motion, AnimatePresence } from "framer-motion";
import ToggleTheme from "@/components/ToggleTheme";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Types
interface DragWindowRegionProps {
    title?: React.ReactNode;
}

interface Notification {
    id: string;
    workspaceId: string;
    memberId: string;
    uri: string;
    title: string;
    detail: string;
    createdAt: string;
}

// Animation variants
const dropdownVariants = {
    hidden: { opacity: 0, y: -5, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30
        }
    },
    exit: {
        opacity: 0,
        y: 5,
        scale: 0.95,
        transition: { duration: 0.2 }
    }
};

// Memoized Components
const NotificationItem = memo(({ notification }: { notification: Notification }) => (
    <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        className="px-4 py-3 hover:bg-neutral-700/50 transition-colors cursor-pointer"
        onClick={() => window.location.href = notification.uri}
    >
        <p className="text-sm font-medium text-neutral-100">{notification.title}</p>
        <p className="text-sm text-neutral-400 mt-0.5">{notification.detail}</p>
        <p className="text-xs text-neutral-500 mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
                locale: vi
            })}
        </p>
    </motion.div>
));

const WindowControl = memo(({ onClick, icon: Icon, tooltip, hoverColor }: {
    onClick: () => void;
    icon: typeof Minus;
    tooltip: string;
    hoverColor: string;
}) => (
    <button
        onClick={onClick}
        className={cn(
            "p-1.5 rounded-full transition-all duration-200",
            `hover:bg-${hoverColor}-500/20 hover:text-${hoverColor}-500`,
            "focus:outline-none focus:ring-2 focus:ring-neutral-300/50"
        )}
        title={tooltip}
    >
        <Icon className="w-3.5 h-3.5" />
    </button>
));

const ProfileMenu = memo(() => {
    const menuItems = [
        { icon: User, label: "Hồ sơ", color: "text-neutral-200" },
        { icon: Settings, label: "Cài đặt", color: "text-neutral-200" },
        { icon: LogOut, label: "Đăng xuất", color: "text-red-400" }
    ];

    return (
        <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 mt-2 w-56 bg-neutral-800 rounded-lg shadow-lg py-2 z-50"
        >
            <div className="px-4 py-3 border-b border-neutral-700">
                <p className="font-medium text-neutral-100">John Doe</p>
                <p className="text-sm text-neutral-400">john@example.com</p>
            </div>
            {menuItems.map(({ icon: Icon, label, color }) => (
                <button
                    key={label}
                    className={cn(
                        "w-full px-4 py-2.5 text-sm text-left",
                        "hover:bg-neutral-700/50 transition-colors",
                        "flex items-center gap-2",
                        color
                    )}
                >
                    <Icon className="w-4 h-4" />
                    {label}
                </button>
            ))}
        </motion.div>
    );
});

// Main Component
export default function DragWindowRegion({ title }: DragWindowRegionProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const fetchNotifications = useCallback(async () => {
        try {
            const response = await _GET('/other/service/notifications?page=0');
            setNotifications(response);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();

        // Optional: Set up polling for notifications
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    return (
        <div className="flex w-full items-center justify-between px-2 sm:px-4 py-1 bg-background border-b border-neutral-200 dark:border-neutral-800">
            {/* Logo */}
            <div className="flex items-center gap-2 pl-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-bold">F</span>
                </div>
                <span className="text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Flowright
                </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <ToggleTheme />

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 
                                 transition-colors relative"
                    >
                        <Bell className="w-4 h-4" />
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 
                                         text-xs flex items-center justify-center text-white">
                                {notifications.length}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                variants={dropdownVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="absolute right-0 mt-2 w-72 bg-neutral-800 rounded-lg shadow-lg py-2 z-50"
                            >
                                {notifications.length === 0 ? (
                                    <div className="px-4 py-2 text-sm text-neutral-400">
                                        Không có thông báo mới
                                    </div>
                                ) : (
                                    notifications.map(notif => (
                                        <NotificationItem key={notif.id} notification={notif} />
                                    ))
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* User Profile */}
                <div className="relative">
                    <Avatar
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="cursor-pointer hover:ring-2 hover:ring-neutral-300 dark:hover:ring-neutral-600 
                                 rounded-sm w-6 h-6 transition-all duration-200"
                    >
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>

                    <AnimatePresence>
                        {isProfileOpen && <ProfileMenu />}
                    </AnimatePresence>
                </div>

                {/* Window Controls */}
                <div className="flex items-center space-x-1">
                    <WindowControl
                        onClick={minimizeWindow}
                        icon={Minus}
                        tooltip="Minimize"
                        hoverColor="blue"
                    />
                    <WindowControl
                        onClick={maximizeWindow}
                        icon={Maximize2}
                        tooltip="Maximize"
                        hoverColor="green"
                    />
                    <WindowControl
                        onClick={closeWindow}
                        icon={X}
                        tooltip="Close"
                        hoverColor="red"
                    />
                </div>
            </div>
        </div>
    );
}