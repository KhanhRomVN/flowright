import React, { useState } from 'react';
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import RoleSetting from '@/components/ContentSetting/RoleSetting';

const SettingPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'role', label: 'Role' },
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
                    <div className='border-b border-outline'>
                        <div className='flex space-x-4'>
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 font-medium rounded-t-lg ${activeTab === tab.id
                                        ? 'text-primary border-b-2 border-primary'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* TabUI Content */}
            <div className='p-4'>
                {activeTab === 'role' && <RoleSetting />}
            </div>
        </div>
    );
};

export default SettingPage;