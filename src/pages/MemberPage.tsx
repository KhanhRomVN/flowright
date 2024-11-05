import React from 'react';
import MemberContent from '../components/PageContent/MemberContent';

const MemberPage = () => {
    return (
        <div className="flex-1 h-screen overflow-y-auto custom-scrollbar">
            <MemberContent />
        </div>
    );
};

export default MemberPage;

