
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ServiceGroupsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Groups</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Manage service groups and categories to organize your services.</p>
        <div className="h-48 flex items-center justify-center border-2 border-dashed rounded-md mt-4">
          <span className="text-muted-foreground">Service groups management will be implemented here</span>
        </div>
      </CardContent>
    </Card>
  );
}
