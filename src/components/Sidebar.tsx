import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, Settings } from "lucide-react";
import { _GET } from "@/utils/auth_api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as LucideIcons from 'lucide-react';
import { useContent } from '@/Context/ContentContext';
import { ContentType } from '@/Context/ContentContext';
import parse from 'html-react-parser';
import CreateGroupDrawer from '@/components/Drawer/AddDrawer/CreateGroupDrawer';
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from 'lucide-react';


interface AppGroup {
  id: number;
  title: string;
  lucideIcon: string;
  type: ContentType;
  bgColor: string;
}

interface Group {
  id: number;
  userId: number;
  title: string;
  lucideIcon: string;
  canDelete: boolean;
  type: ContentType;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

const Sidebar: React.FC = () => {
  const { setCurrentContent } = useContent();
  const [groups, setGroups] = useState<Group[]>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(groups.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const visibleGroups = groups.slice(startIndex, startIndex + itemsPerPage);


  const [isDrawerOpen, setIsDrawerOpen] = useState(false);


  const appGroups: AppGroup[] = [
    { id: 1, title: 'Account', lucideIcon: 'User', type: 'account', bgColor: 'bg-blue-500' },
    { id: 2, title: 'Card', lucideIcon: 'CreditCard', type: 'card', bgColor: 'bg-green-500' },
    { id: 3, title: 'Identify', lucideIcon: 'Fingerprint', type: 'identify', bgColor: 'bg-yellow-500' },
    { id: 4, title: 'Google', lucideIcon: 'Search', type: 'google', bgColor: 'bg-red-500' },
    { id: 5, title: 'Clone', lucideIcon: 'Copy', type: 'clone', bgColor: 'bg-purple-500' },
    { id: 6, title: 'Note', lucideIcon: 'FileText', type: 'note', bgColor: 'bg-pink-500' },
  ];

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  const fetchGroups = async () => {
    try {
      const data = await _GET('/group');
      setGroups(data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const getIconComponent = (iconName: string, bgColor: string) => {
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ElementType;
    return IconComponent ? (
      <div className={`${bgColor} p-1 rounded-sm mr-2`}>
        <IconComponent className="h-4 w-4 text-white" />
      </div>
    ) : (
      <div className={`${bgColor} p-1 rounded-sm mr-2`}>
        <LucideIcons.File className="h-4 w-4 text-white" />
      </div>
    );
  };

  const getUserGroupIcon = (lucideIcon: string) => {
    return (
      <div className="bg-gray-600 p-1 rounded-sm mr-2">
        {parse(lucideIcon)}
      </div>
    );
  };

  const handleTabClick = (type: ContentType, id: number | null) => {
    setCurrentContent(type, id);
  };

  return (
    <aside className="w-80 bg-sidebar-primary p-2 flex flex-col justify-between">
      {/* Top */}
      <div>
        <Button
          variant="ghost"
          className="w-full justify-between hover:bg-button-hover1"
          onClick={toggleDrawer}
        >
          <span className="text-primary text-base">Create Group</span>
          <Plus className="h-5 w-5 text-primary" />
        </Button>
        {/* Group[App] list */}
        <div className="mt-2 pb-2 border-b border-gray-700">
          {appGroups.map((group) => (
            <Button
              key={group.id}
              variant="ghost"
              className="w-full justify-between hover:bg-button-hover1 focus:bg-primary focus:text-white mb-2 pr-2.5"
              onClick={() => handleTabClick(group.type as ContentType, null)}
            >
              <Link 
                to="/"
                className="text-white text-base flex items-center"
              >
                {getIconComponent(group.lucideIcon, group.bgColor)}
                {group.title}
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4 text-icon-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Edit Group</DropdownMenuItem>
                  <DropdownMenuItem>Share Group</DropdownMenuItem>
                  <DropdownMenuItem>Export</DropdownMenuItem>
                  <DropdownMenuItem>Import</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Button>
          ))}
        </div>
        {/* Group[User] list */}
        {groups.length > 0 && (
          <div className="mt-2">
            {groups.length > itemsPerPage && (
              <div className="flex justify-between items-center mb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4 text-white" />
              </Button>
              {/* Add page number display */}
              <span className="text-white">
                {currentPage + 1} / {totalPages}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4 text-white" />
              </Button>
            </div>
            )}
            {visibleGroups.map((group) => (
              <Button
                key={group.id}
                variant="ghost"
                className="w-full justify-between hover:bg-button-hover1 focus:bg-primary focus:text-white mb-2 pr-2.5"
                onClick={() => handleTabClick(group.type as ContentType, group.id)}
              >
                <Link 
                  to="/"
                  className="text-white text-base flex items-center"
                >
                  {getUserGroupIcon(group.lucideIcon)}
                  {group.title}
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4 text-white" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Edit Group</DropdownMenuItem>
                    <DropdownMenuItem>Share Group</DropdownMenuItem>
                    {group.canDelete && <DropdownMenuItem>Delete Group</DropdownMenuItem>}
                    <DropdownMenuItem>Export</DropdownMenuItem>
                    <DropdownMenuItem>Import</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Button>
            ))}
          </div>
        )}
      </div>
      {/* Bottom */}
      <div className="mt-auto">
        <Button variant="ghost" className="w-full justify-between hover:bg-button-hover1 text-white">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-sm bg-purple-600 flex items-center justify-center mr-2">
              K
            </div>
            <span>khanpromvn@gmail.com</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem><Link to="/setting">Setting</Link></DropdownMenuItem>
              <DropdownMenuItem><Link to="/switch">Logout</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Button>
      </div>

      <CreateGroupDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </aside>
  );
};

export default Sidebar;