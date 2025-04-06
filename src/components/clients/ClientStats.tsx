
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UsersIcon, UserIcon, CameraIcon, BarChart3Icon } from 'lucide-react';

interface ClientStatsProps {
  totalClients: number;
  activeClients: number;
  totalShoots: number;
  averageShootsPerClient: number;
}

export const ClientStats: React.FC<ClientStatsProps> = ({
  totalClients,
  activeClients,
  totalShoots,
  averageShootsPerClient
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
              <h3 className="text-2xl font-bold mt-1">{totalClients}</h3>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <UsersIcon className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
              <h3 className="text-2xl font-bold mt-1">{activeClients}</h3>
            </div>
            <div className="bg-green-500/10 p-3 rounded-full">
              <UserIcon className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Shoots</p>
              <h3 className="text-2xl font-bold mt-1">{totalShoots}</h3>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-full">
              <CameraIcon className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Shoots per Client</p>
              <h3 className="text-2xl font-bold mt-1">{averageShootsPerClient}</h3>
            </div>
            <div className="bg-purple-500/10 p-3 rounded-full">
              <BarChart3Icon className="h-5 w-5 text-purple-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
