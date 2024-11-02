import React from 'react';
import MemberContent from '../components/Content/MemberContent';

const MemberPage = () => {
    return (
        <div className="flex-1 h-screen overflow-y-auto custom-scrollbar">
            <MemberContent />
        </div>
    );
};

export default MemberPage;

