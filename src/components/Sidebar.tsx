import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
  Calendar,
  Settings,
  LogOut
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { _GET } from '@/utils/auth_api';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    bgColor: 'from-blue-500/20 to-blue-600/10',
    iconColor: 'text-blue-500',
    link: '/',
    notification: 0
  },
  {
    title: 'Team',
    icon: Users,
    bgColor: 'from-green-500/20 to-green-600/10',
    iconColor: 'text-green-500',
    link: '/team/management',
    notification: 11
  },
  {
    title: 'Project',
    icon: FolderKanban,
    bgColor: 'from-yellow-500/20 to-yellow-600/10',
    iconColor: 'text-yellow-500',
    link: '/project/management',
    notification: 0
  },
  {
    title: 'Task',
    icon: CheckSquare,
    bgColor: 'from-red-500/20 to-red-600/10',
    iconColor: 'text-red-500',
    link: '/task',
    notification: 35
  },
  {
    title: 'Calendar',
    icon: Calendar,
    bgColor: 'from-purple-500/20 to-purple-600/10',
    iconColor: 'text-purple-500',
    link: '/calendar',
    notification: 0
  },
  {
    title: 'Setting',
    icon: Settings,
    bgColor: 'from-orange-500/20 to-orange-600/10',
    iconColor: 'text-orange-500',
    link: '/setting',
    notification: 0
  }
];

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('Dashboard');
  const [userData, setUserData] = useState<{ email: string; username: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await _GET('/member/service/members/member');
        setUserData({ email: response.email, username: response.username });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <aside
      className="w-64 bg-sidebar-primary border-r border-gray-800/50 px-2 py-2 flex flex-col justify-between h-[calc(100vh-3rem)]"
    >
      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2">
        <AnimatePresence mode="wait">
          {menuItems.map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to={item.link} className="block w-full">
                      <Button
                        variant="ghost"
                        className={`w-full justify-between group hover:bg-sidebar-itemHover transition-all duration-300 
                          ${activeItem === item.title ? 'bg-gradient-to-r ' + item.bgColor : ''}`}
                        onClick={() => setActiveItem(item.title)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-md transition-colors duration-300 
                            group-hover:bg-gradient-to-br ${item.bgColor}`}>
                            <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                          </div>
                          <span className="text-sm font-medium text-text-primary">
                            {item.title}
                          </span>
                        </div>
                        {item.notification > 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-red-500/20 text-red-400 rounded-full px-2 py-0.5 text-xs font-medium"
                          >
                            {item.notification}
                          </motion.div>
                        )}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Go to {item.title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          ))}
        </AnimatePresence>
      </nav>

      {/* User Profile Section */}
      <div className="mt-auto pt-4 border-t border-gray-800/50">
        <div className="p-2 hover:bg-sidebar-secondary rounded-lg space-y-4">
          <Link to="/profile" className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-itemHover transition-all duration-200">
            <Avatar className="h-10 w-10 border-2 border-blue-500/20">
              <AvatarImage src="/path/to/avatar.png" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-500">
                {userData?.username?.substring(0, 2).toUpperCase() || 'JD'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {userData?.username || 'John Doe'}
              </p>
              <p className="text-xs text-text-secondary truncate">
                {userData?.email || 'john.doe@example.com'}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;