
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Phone, MapPin, Building } from 'lucide-react';
import { formatDateSafe } from '@/utils/formatters';

interface ClientDetailProps {
  client: any;
  onClose: () => void;
}

export function ClientDetail({ client, onClose }: ClientDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={onClose} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">{client.name}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{client.email}</span>
            </div>
            {client.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{client.phone}</span>
              </div>
            )}
            {client.address && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{client.address}</span>
              </div>
            )}
            {client.company && (
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{client.company}</span>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Last active: {formatDateSafe(client.lastActivity)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Total shoots:</span>
              <span className="font-medium">{client.shootsCount || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Last activity:</span>
              <span className="font-medium">{formatDateSafe(client.lastActivity)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No recent activity to display</p>
        </CardContent>
      </Card>
    </div>
  );
}
