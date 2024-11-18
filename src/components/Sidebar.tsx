import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, UserCircle, FolderKanban, CheckSquare, Calendar, Settings } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { _GET } from '@/utils/auth_api';

const Sidebar: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [userData, setUserData] = useState<{ email: string; username: string } | null>(null); // New state for user data

  const toggleExpand = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await _GET('/member/service/members/member');
      setUserData({ email: response.email, username: response.username });
    };

    fetchUserData();
  }, []);

  return (
    <aside className="w-64 bg-sidebar-primary px-2 pt-2 pb-24 flex flex-col justify-between h-screen">
      {/* Top section */}
      <div>
        {[
          { title: 'Dashboard', icon: LayoutDashboard, bgColor: 'bg-color-blue', link: '/', notification: 0 },
          {
            title: 'Team', icon: Users, bgColor: 'bg-color-blue', link: '/team/management', notification: 11,
          },
          { title: 'Member', icon: UserCircle, bgColor: 'bg-color-green', link: '/member', notification: 0 },
          {
            title: 'Project', icon: FolderKanban, bgColor: 'bg-color-yellow', link: '/project/management', notification: 0
          },
          { title: 'Task', icon: CheckSquare, bgColor: 'bg-color-red', link: '/task', notification: 35 },
          { title: 'Calendar', icon: Calendar, bgColor: 'bg-color-purple', link: '/calendar', notification: 0 },
        ].map((item) => (
          <div key={item.title}>
            <Link
              to={item.link}
              className="block w-full"
            >
              <Button
                variant="ghost"
                className="w-full justify-between hover:bg-sidebar-itemHover focus:bg-gradient-to-r from-primary to-transparent mb-1 pr-2 focus:text-text-primary text-sm"
              >
                <div className="text-text-secondary text-base flex items-center">
                  <div className={`${item.bgColor} p-1 rounded-sm mr-2`}>
                    <item.icon className="h-4 w-4 text-text-primary" />
                  </div>
                  {item.title}
                </div>
                {item.notification > 0 && (
                  <div className="bg-color-redOpacity text-white rounded-sm px-1 py-0.5 text-xs">
                    {item.notification}
                  </div>
                )}
              </Button>
            </Link>
          </div>
        ))}
      </div>

      {/* Bottom section */}
      <div className="mt-auto p-2 hover:bg-sidebar-secondary rounded-lg flex items-center justify-between">
        <Link to="/profile" className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-color-blue p-1 rounded-sm">JD</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="text-white font-medium">{userData?.username || 'John Doe'}</p> {/* Updated to use username */}
            <p className="text-gray-400 text-xs">{userData?.email || 'john.doe@example.com'}</p> {/* Updated to use email */}
          </div>
        </Link>
        <Link to="/setting">
          <Button variant="ghost" size="icon" className="hover:bg-button-backgroundHover">
            <Settings className="h-5 w-5 text-text-primary" />
          </Button>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;