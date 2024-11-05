import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, UserCircle, FolderKanban, CheckSquare, Calendar, Settings } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';

const Sidebar: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  return (
    <aside className="w-64 bg-sidebar-primary px-2 pt-2 pb-24 flex flex-col justify-between h-screen">
      {/* Top section */}
      <div>
        {[
          { title: 'Dashboard', icon: LayoutDashboard, bgColor: 'bg-blue-500', link: '/', notification: 0 },
          {
            title: 'Team', icon: Users, bgColor: 'bg-blue-500', link: '/team', notification: 11, teams: [
              { name: 'Team 1', link: '/team', member: 10 },
              { name: 'Team 2', link: '/team', member: 15 },
              { name: 'Team 3', link: '/team', member: 20 },
            ]
          },
          { title: 'Member', icon: UserCircle, bgColor: 'bg-green-500', link: '/member', notification: 0 },
          {
            title: 'Project', icon: FolderKanban, bgColor: 'bg-yellow-500', link: '/project', notification: 0, project: [
              { name: 'Project 1', link: '/project', progress: 50 },
              { name: 'Project 2', link: '/project', progress: 30 },
              { name: 'Project 3', link: '/project', progress: 70 },
            ]
          },
          { title: 'Task', icon: CheckSquare, bgColor: 'bg-red-500', link: '/task', notification: 35 },
          { title: 'Calendar', icon: Calendar, bgColor: 'bg-purple-500', link: '/calendar', notification: 0 },
        ].map((item) => (
          <div key={item.title}>
            <Link
              to={item.link}
              className="block w-full"
            >
              <Button
                variant="ghost"
                className="w-full justify-between hover:bg-button-hover1 focus:bg-primary focus:text-white mb-2 pr-2.5"
                onClick={(e) => {
                  if (item.teams || item.project) {
                    e.preventDefault(); // Prevent navigation for items with sub-menu
                    toggleExpand(item.title);
                  }
                }}
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

            {/* Teams sub-menu */}
            {expandedItems.includes(item.title) && item.teams && (
              <div className="ml-8 mb-2">
                {item.teams.map((team) => (
                  <Link key={team.name} to={team.link} className="block">
                    <Button variant="ghost" className="w-full text-white text-sm py-1 justify-between">
                      {team.name}
                      <span className="text-xs text-gray-400">{team.member}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            )}

            {/* Projects sub-menu */}
            {expandedItems.includes(item.title) && item.project && (
              <div className="ml-8 mb-2">
                {item.project.map((proj) => (
                  <Link key={proj.name} to={proj.link} className="block">
                    <Button variant="ghost" className="w-full text-white text-sm py-1 justify-between">
                      {proj.name}
                      <span className="text-xs text-gray-400">{proj.progress}%</span>
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom section */}
      <div className="mt-auto p-2 hover:bg-sidebar-secondary rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-blue-500 p-1 rounded-sm" >JD</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="text-white font-medium">John Doe</p>
            <p className="text-gray-400 text-xs">john.doe@example.com</p>
          </div>
        </div>
        <Link to="/setting">
          <Button variant="ghost" size="icon" className="hover:bg-button-hover1">
            <Settings className="h-5 w-5 text-white" />
          </Button>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;