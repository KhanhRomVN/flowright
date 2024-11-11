import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import InfoContent from '@/components/ProfileContent/InfoContent';
import TimeManagementContent from '@/components/ProfileContent/TimeManagementContent';
import TaskContent from '@/components/ProfileContent/TaskContent';

interface ProfilePageProps {
    member_id: string | null;
}

export default function ProfilePage({ member_id }: ProfilePageProps) {
    return (
        <div className="flex">
           
        </div>
    );
}