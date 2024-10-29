import React from 'react';
import { useContent } from '@/Context/ContentContext';
import AccountContent from '@/components/Content/AccountContent';
import CardContent from '@/components/Content/CardContent';
import IdentifyContent from '@/components/Content/IndentifyContent';
import GoogleContent from '@/components/Content/GoogleContent';
import CloneContent from '@/components/Content/CloneContent';
import NoteContent from '@/components/Content/NoteContent';
import { ContentType } from '@/Context/ContentContext';

const MainContent: React.FC = () => {
  const { currentTab, currentId } = useContent();

  const renderContent = () => {
    switch (currentTab) {
      case 'account':
        return <AccountContent id={currentId} />;
      case 'card':
        return <CardContent id={currentId} />;
      case 'identify':
        return <IdentifyContent id={currentId} />;
      case 'google':
        return <GoogleContent id={currentId} />;
      case 'clone':
        return <CloneContent id={currentId} />;
      case 'note':
        return <NoteContent id={currentId} />;
      default:
        return <AccountContent id={currentId} />;
    }
  };

  return (
    <div className="flex-1 h-full overflow-auto">
      {renderContent()}
    </div>
  );
};

export default MainContent;