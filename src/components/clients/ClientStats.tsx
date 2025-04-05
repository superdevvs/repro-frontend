
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateSafe, ensureDate } from '@/utils/formatters';

interface ClientStatsProps {
  clients: any[];
  shoots: any[];
}

export function ClientStats({ clients, shoots }: ClientStatsProps) {
  const activeClientsCount = clients.filter(c => c.status === 'active').length;
  
  // Get most recent shoot date
  const sortedShoots = [...shoots].sort((a, b) => {
    const dateA = ensureDate(a.scheduledDate);
    const dateB = ensureDate(b.scheduledDate);
    return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
  });
  
  const mostRecentShoot = sortedShoots[0];
  
  // Find clients with most shoots
  const clientShootCounts: Record<string, number> = {};
  shoots.forEach(shoot => {
    const clientEmail = shoot.client.email;
    if (!clientShootCounts[clientEmail]) {
      clientShootCounts[clientEmail] = 0;
    }
    clientShootCounts[clientEmail]++;
  });
  
  const topClients = clients
    .map(client => ({
      ...client,
      shootCount: clientShootCounts[client.email] || 0
    }))
    .sort((a, b) => b.shootCount - a.shootCount)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{clients.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {activeClientsCount} active clients
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Shoots</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{shoots.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Latest on {mostRecentShoot ? formatDateSafe(mostRecentShoot.scheduledDate) : 'N/A'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Shoots per Client</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {clients.length ? (shoots.length / clients.length).toFixed(1) : '0'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Total across all clients
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Clients by Shoot Count</CardTitle>
        </CardHeader>
        <CardContent>
          {topClients.length > 0 ? (
            <div className="space-y-2">
              {topClients.map((client, index) => (
                <div key={client.email} className="flex justify-between items-center p-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-xs text-muted-foreground">{client.email}</p>
                  </div>
                  <div className="text-lg font-semibold">{client.shootCount}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-6">No client data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
