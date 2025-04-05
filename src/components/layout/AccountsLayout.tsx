
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useShoots } from '@/context/ShootsContext';
import { useAuth } from '@/components/auth/AuthProvider';

interface AccountsLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
}

export function AccountsLayout({ children, activeTab = "photographers" }: AccountsLayoutProps) {
  const { getUniquePhotographers, getUniqueEditors, getUniqueClients } = useShoots();
  const { user } = useAuth();

  const photographers = getUniquePhotographers();
  const editors = getUniqueEditors();
  const clients = getUniqueClients();

  return (
    <DashboardLayout>
      <div className="container py-6">
        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="photographers">Photographers</TabsTrigger>
            <TabsTrigger value="editors">Editors</TabsTrigger>
            <TabsTrigger value="clients">Clients & Branding</TabsTrigger>
          </TabsList>

          <TabsContent value="photographers">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Photographers</h2>
              <div className="space-y-4">
                {photographers.length > 0 ? (
                  photographers.map((photographer, index) => (
                    <div key={index} className="flex justify-between border-b pb-2">
                      <span>{photographer.name}</span>
                      <span className="text-muted-foreground">{photographer.shootCount} shoots</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No photographers found.</p>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="editors">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Editors</h2>
              <div className="space-y-4">
                {editors.length > 0 ? (
                  editors.map((editor, index) => (
                    <div key={index} className="flex justify-between border-b pb-2">
                      <span>{editor.name}</span>
                      <span className="text-muted-foreground">{editor.shootCount} shoots</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No editors found in the system.</p>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="clients">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Clients & Branding</h2>
              <div className="space-y-4">
                {clients.length > 0 ? (
                  clients.map((client, index) => (
                    <div key={index} className="border-b pb-4 mb-4">
                      <div className="flex justify-between">
                        <span className="font-medium">{client.name}</span>
                        <span className="text-muted-foreground">{client.shootCount} shoots</span>
                      </div>
                      {client.email && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Email: {client.email}
                        </div>
                      )}
                      {client.company && (
                        <div className="text-sm text-muted-foreground">
                          Company: {client.company}
                        </div>
                      )}
                      {client.phone && (
                        <div className="text-sm text-muted-foreground">
                          Phone: {client.phone}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No clients found.</p>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
