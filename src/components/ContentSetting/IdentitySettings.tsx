import React from 'react';

const IdentitySettings: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Language Section */}
      <div className='border border-outline p-4'>
        <div className='flex items-center justify-between border-b border-outline mb-4'>
          <h3 className="text-lg font-medium mb-2">Alias Management</h3>
        </div>
        <div className='px-8 py-6 bg-sidebar-primary rounded-lg'>
          <p className='text-sm text-muted-foreground'>Feature not available! It will be available in the next version.</p>
        </div>


      </div>
    </div>
  );
};

export default IdentitySettings;