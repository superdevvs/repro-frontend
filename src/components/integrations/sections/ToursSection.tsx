
import React, { useState } from 'react';
import { IntegrationCard } from '../IntegrationCard';
import { Cube, Boxes, HomeIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export function ToursSection() {
  const [autoPublish, setAutoPublish] = useState(true);
  const [clientAccess, setClientAccess] = useState(false);
  
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
  
  const handleToggleOption = (service: string, option: string, enabled: boolean) => {
    if (service === 'iGUIDE' && option === 'Auto Publish') {
      setAutoPublish(enabled);
    } else if (service === 'CubiCasa' && option === 'Client Access') {
      setClientAccess(enabled);
    }
    
    toast({
      title: `${option} ${enabled ? 'Enabled' : 'Disabled'} for ${service}`,
      description: `The setting has been updated successfully.`,
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">3D Tours</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <IntegrationCard
          title="iGUIDE"
          description="3D virtual tours and floor plans"
          status="connected"
          icon={<Cube className="h-4 w-4" />}
          toggleOption={{
            label: "Auto Publish",
            enabled: autoPublish,
            onChange: (enabled) => handleToggleOption('iGUIDE', 'Auto Publish', enabled)
          }}
          onDisconnect={() => handleDisconnect('iGUIDE')}
          onConfigure={() => handleConfigure('iGUIDE')}
        />
        
        <IntegrationCard
          title="CubiCasa"
          description="Floor plan generation service"
          status="connected"
          icon={<HomeIcon className="h-4 w-4" />}
          toggleOption={{
            label: "Client Access",
            enabled: clientAccess,
            onChange: (enabled) => handleToggleOption('CubiCasa', 'Client Access', enabled)
          }}
          onDisconnect={() => handleDisconnect('CubiCasa')}
          onConfigure={() => handleConfigure('CubiCasa')}
        />
        
        <IntegrationCard
          title="Matterport"
          description="3D space capture and virtual tours"
          status="not_connected"
          icon={<Boxes className="h-4 w-4" />}
          onConnect={() => handleConnect('Matterport')}
        />
      </div>
    </div>
  );
}
