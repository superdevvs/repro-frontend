
import React, { useState } from 'react';
import { IntegrationCard } from '../IntegrationCard';
import { FolderIcon, HardDriveIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export function StorageSection() {
  const [autoSync, setAutoSync] = useState(true);
  
  const handleConnect = (service: string) => {
    toast({
      title: "Connecting to " + service,
      description: "Redirecting to authentication page...",
    });
  };
  
  const handleDisconnect = (service: string) => {
    toast({
      title: "Disconnected " + service,
      description: "The service has been disconnected successfully.",
    });
  };
  
  const handleConfigure = (service: string) => {
    toast({
      title: "Configure " + service,
      description: "Opening configuration options...",
    });
  };
  
  const handleAutoSync = (enabled: boolean) => {
    setAutoSync(enabled);
    toast({
      title: `Auto Sync ${enabled ? 'Enabled' : 'Disabled'}`,
      description: `Files will ${enabled ? 'now' : 'no longer'} be automatically synchronized.`,
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Storage</h2>
      
      <div className="space-y-3">
        <IntegrationCard
          title="Dropbox"
          description="Cloud storage for photos and videos"
          status="connected"
          icon={<FolderIcon className="h-4 w-4" />}
          toggleOption={{
            label: "Auto Sync",
            enabled: autoSync,
            onChange: handleAutoSync
          }}
          onDisconnect={() => handleDisconnect('Dropbox')}
          onConfigure={() => handleConfigure('Dropbox')}
        />
        
        <IntegrationCard
          title="Google Drive"
          description="Google cloud storage integration"
          status="not_connected"
          icon={<HardDriveIcon className="h-4 w-4" />}
          onConnect={() => handleConnect('Google Drive')}
        />
      </div>
    </div>
  );
}
