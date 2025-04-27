
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/AuthProvider';
import { Navigate } from 'react-router-dom';
import { ServicesTab } from '@/components/scheduling/ServicesTab';
import { ServiceGroupsTab } from '@/components/scheduling/ServiceGroupsTab';
import { ClientSchedulingTab } from '@/components/scheduling/ClientSchedulingTab';
import { AdditionalFieldsTab } from '@/components/scheduling/AdditionalFieldsTab';

const SchedulingSettings = () => {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState("services");
  
  // Only allow admin and superadmin to access this page
  if (!['admin', 'superadmin'].includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6">
          <div className="space-y-2">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              Settings
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Scheduling</h1>
            <p className="text-muted-foreground">
              Manage services, scheduling options, and related settings
            </p>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="space-y-4"
          >
            <TabsList className="grid grid-cols-4 w-full max-w-3xl">
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="serviceGroups">Service Groups</TabsTrigger>
              <TabsTrigger value="clientScheduling">Client Scheduling</TabsTrigger>
              <TabsTrigger value="additionalFields">Additional Fields</TabsTrigger>
            </TabsList>
            
            <TabsContent value="services" className="space-y-4">
              <ServicesTab />
            </TabsContent>
            
            <TabsContent value="serviceGroups" className="space-y-4">
              <ServiceGroupsTab />
            </TabsContent>
            
            <TabsContent value="clientScheduling" className="space-y-4">
              <ClientSchedulingTab />
            </TabsContent>
            
            <TabsContent value="additionalFields" className="space-y-4">
              <AdditionalFieldsTab />
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default SchedulingSettings;
