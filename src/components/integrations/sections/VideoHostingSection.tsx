
import React from 'react';
import { IntegrationCard } from '../IntegrationCard';
import { VideoIcon, MonitorIcon } from 'lucide-react';

export function VideoHostingSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Video Hosting</h2>
      
      <div className="space-y-3">
        <IntegrationCard
          title="YouTube"
          description="Host and embed property videos"
          status="coming_soon"
          icon={<VideoIcon className="h-4 w-4" />}
        />
        
        <IntegrationCard
          title="Vimeo"
          description="Professional video hosting"
          status="coming_soon"
          icon={<MonitorIcon className="h-4 w-4" />}
        />
      </div>
    </div>
  );
}
