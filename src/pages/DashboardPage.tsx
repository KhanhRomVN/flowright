import React from 'react';
import DashboardContent from '../components/PageContent/DashboardContent';

const DashboardPage = () => {
  return (
    <div className="flex-1 h-screen overflow-y-auto custom-scrollbar">
      <DashboardContent />
    </div>
  );
};

export default DashboardPage;