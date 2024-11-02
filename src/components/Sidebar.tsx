import React from 'react';
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, UserCircle, FolderKanban, CheckSquare, Calendar } from "lucide-react";
import { Link } from "@tanstack/react-router";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-sidebar-primary p-2 flex flex-col justify-between">
      {/* Top section */}
      <div>
        {[
          { title: 'Dashboard', icon: LayoutDashboard, bgColor: 'bg-blue-500', link: '/', notification: 0 },
          { title: 'Team', icon: Users, bgColor: 'bg-blue-500', link: '/team', notification: 11 },
          { title: 'Member', icon: UserCircle, bgColor: 'bg-green-500', link: '/member', notification: 0 },
          { title: 'Project', icon: FolderKanban, bgColor: 'bg-yellow-500', link: '/project', notification: 0,},
          { title: 'Task', icon: CheckSquare, bgColor: 'bg-red-500', link: '/task', notification: 35 },
          { title: 'Calendar', icon: Calendar, bgColor: 'bg-purple-500', link: '/calendar', notification: 0 },
        ].map((item) => (
          <Link
            key={item.title}
            to={item.link}
            className="block w-full"
          >
            <Button
              variant="ghost"
              className="w-full justify-between hover:bg-button-hover1 focus:bg-primary focus:text-white mb-2 pr-2.5"
            >
              <div className="text-white text-base flex items-center">
                <div className={`${item.bgColor} p-1 rounded-sm mr-2`}>
                  <item.icon className="h-4 w-4 text-white" />
                </div>
                {item.title}
              </div>
              {item.notification > 0 && (
                <div className="bg-red-500 text-white rounded-sm px-1 py-0.5 text-xs">
                  {item.notification}
                </div>
              )}
            </Button>
          </Link>
        ))}
      </div>

      {/* Bottom section */}
      <div className="mt-auto"></div>
    </aside>
  );
};

export default Sidebar;