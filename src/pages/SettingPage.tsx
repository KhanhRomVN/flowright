import React, { useState } from 'react';
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import RoleSetting from '@/components/ContentSetting/RoleSetting';
import SpecializationSetting from '@/components/ContentSetting/SpecializationSetting';
import TeamSetting from '@/components/ContentSetting/TeamSetting';
import InviteManagerSetting from '@/components/ContentSetting/InviteManagerSetting';
const SettingPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'role', label: 'Role' },
        { id: 'specialization', label: 'Specialization' },
        { id: 'team', label: 'Team' },
        { id: 'invite', label: 'Invite' },
    ];

    return (
        <div className="min-h-screen flex-col">
            <div className="sticky top-0 bg-background z-10">
                {/* Header */}
                <div className="p-2 border-b border-outline flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0" onClick={() => window.history.back()}>
                        <ArrowLeft className="size-4 cursor-pointer" />
                    </Button>
                    <p className="text-xl font-bold">Setting</p>
                </div>
                {/* TabUI */}
                <div className='px-4'>
                    <nav className='border-b border-outline'>
                        <div className='flex space-x-4'>
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 font-medium rounded-t-lg transition-colors duration-200 ease-in-out ${activeTab === tab.id
                                        ? 'text-primary border-b-2 border-primary'
                                        : 'text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50'
                                        }`}
                                    aria-selected={activeTab === tab.id}
                                    role="tab"
                                    tabIndex={activeTab === tab.id ? 0 : -1}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </nav>
                </div>
            </div>

            {/* TabUI Content */}
            <div className='p-4'>
                {activeTab === 'role' && <RoleSetting />}
                {activeTab === 'specialization' && <SpecializationSetting />}
                {activeTab === 'team' && <TeamSetting />}
                {activeTab === 'invite' && <InviteManagerSetting />}
            </div>
        </div>
    );
};

export default SettingPage;