
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleUser, Briefcase, Building, CameraIcon } from 'lucide-react';
import { ShootData } from '@/types/shoots';

interface ClientStatsProps {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  totalShoots: number;
}

export function ClientStats({ 
  totalClients, 
  activeClients, 
  inactiveClients,
  totalShoots 
}: ClientStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          <CircleUser className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalClients}</div>
          <p className="text-xs text-muted-foreground">All registered clients</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeClients}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((activeClients / totalClients) * 100)}% of all clients
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Inactive Clients</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inactiveClients}</div>
          <p className="text-xs text-muted-foreground">No recent activity</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Shoots</CardTitle>
          <CameraIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalShoots}</div>
          <p className="text-xs text-muted-foreground">
            Avg {Math.round(totalShoots / totalClients)} per client
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
