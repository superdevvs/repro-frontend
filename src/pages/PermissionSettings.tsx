
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { RolePermissionsManager } from '@/components/permissions/RolePermissionsManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { usePermission } from '@/hooks/usePermission';
import { Navigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const PermissionSettingsPage = () => {
  const { can } = usePermission();
  const canManagePermissions = can('settings', 'update');
  
  // Redirect users without permission
  if (!canManagePermissions) {
    toast({
      title: "Access Denied",
      description: "You don't have permission to access permissions settings.",
      variant: "destructive",
    });
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6 p-6 pb-16">
          <div>
            <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              Settings
            </Badge>
            <h1 className="text-3xl font-bold">Permissions</h1>
            <p className="text-muted-foreground mt-2">
              Manage system permissions and roles
            </p>
          </div>
          
          <Tabs defaultValue="roles" className="w-full mt-6">
            <TabsList className="w-full max-w-md grid grid-cols-2">
              <TabsTrigger value="roles">Role Permissions</TabsTrigger>
              <TabsTrigger value="users">User Permissions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="roles" className="mt-6">
              <RolePermissionsManager />
            </TabsContent>
            
            <TabsContent value="users" className="mt-6">
              <div className="bg-muted rounded-lg p-6 text-center">
                <h3 className="font-medium text-lg mb-2">User-specific permissions coming soon</h3>
                <p className="text-muted-foreground">
                  This feature will allow assigning custom permissions to individual users.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default PermissionSettingsPage;
