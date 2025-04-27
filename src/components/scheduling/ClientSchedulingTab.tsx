
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ClientSchedulingTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Scheduling</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Configure how clients can schedule appointments and services.</p>
        <div className="h-48 flex items-center justify-center border-2 border-dashed rounded-md mt-4">
          <span className="text-muted-foreground">Client scheduling options will be implemented here</span>
        </div>
      </CardContent>
    </Card>
  );
}
