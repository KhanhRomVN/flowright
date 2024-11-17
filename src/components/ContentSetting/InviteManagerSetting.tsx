import React from 'react';
import InviteTable from '@/components/Table/InviteTable';
import InviteMemberDialog from '../Dialog/InviteMemberDialog';

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