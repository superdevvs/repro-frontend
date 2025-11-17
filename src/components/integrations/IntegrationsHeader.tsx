
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { PlugIcon } from 'lucide-react';

export function IntegrationsHeader() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
            Admin Settings
          </Badge>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-muted-foreground">
            Manage and configure all platform integrations
          </p>
        </div>

        {/* <ToggleGroup type="single" variant="outline" defaultValue="all">
          <ToggleGroupItem value="all" aria-label="All integrations">
            All
          </ToggleGroupItem>
          <ToggleGroupItem value="connected" aria-label="Connected integrations">
            Connected
          </ToggleGroupItem>
          <ToggleGroupItem value="available" aria-label="Available integrations">
            Available
          </ToggleGroupItem>
        </ToggleGroup> */}
      </div>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <PlugIcon className="h-4 w-4" />
        <span>Configure third-party services that integrate with your platform</span>
      </div>
    </div>
  );
}
