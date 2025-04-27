
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AdditionalFieldsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Fields</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Configure additional fields for service scheduling and management.</p>
        <div className="h-48 flex items-center justify-center border-2 border-dashed rounded-md mt-4">
          <span className="text-muted-foreground">Additional fields configuration will be implemented here</span>
        </div>
      </CardContent>
    </Card>
  );
}
