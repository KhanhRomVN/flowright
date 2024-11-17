import React from 'react';
import InviteTable from '@/components/InviteTable';
import InviteMemberDialog from '../InviteMemberDialog';

const InviteManagerSetting: React.FC = () => {

    const handleMemberAdded = (email: string, roleId: string) => {

    };

    return (
        <div>
            <InviteMemberDialog />
            <InviteTable />
        </div>
    );
};

export default InviteManagerSetting;