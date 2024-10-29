import React from 'react';

const ImportSettings: React.FC = () => {
  const passwordManagers = [
    { name: '1Password', formats: '1pux, 1pif', icon: '/src/assets/logos/1Password-logo.png' },
    { name: 'Bitwarden', formats: 'json', icon: '/src/assets/logos/Bitwarden-logo.png' },
    { name: 'Brave', formats: 'csv', icon: '/src/assets/logos/Brave-logo.png' },
    { name: 'Chrome', formats: 'csv', icon: '/src/assets/logos/Chorme-logo.png' },
    { name: 'Edge', formats: 'csv', icon: '/src/assets/logos/Edge-logo.png' },
    { name: 'Enpass', formats: 'json', icon: '/src/assets/logos/Enpass-logo.png' },
    { name: 'Firefox', formats: 'csv', icon: '/src/assets/logos/Firefox-logo.png' },
    { name: 'NordPass', formats: 'xml', icon: '/src/assets/logos/Nordpass-logo.png' },
    { name: 'Proton', formats: 'csv', icon: '/src/assets/logos/proton-pass-logo.png' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-2">Import</h2>
        <p className="text-sm text-muted-foreground mb-4">
          To transfer data from another password manager, go to that password manager, export your data, and upload it to
          Soladal Pass. When your data has been imported, delete the exported file.
        </p>
      </div>

      <h3 className="text-lg font-medium">Select your password manager</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {passwordManagers.map((manager) => (
          <div 
            key={manager.name}
            className="flex flex-col items-center justify-center p-6 border border-outline rounded-lg cursor-pointer hover:bg-accent"
          >
            <div className="w-12 h-12 mb-4">
              <img
                src={manager.icon}
                alt={manager.name}
                width={48}
                height={48}
              />
            </div>
            <h4 className="font-medium mb-1">{manager.name}</h4>
            <p className="text-sm text-muted-foreground">{manager.formats}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImportSettings;