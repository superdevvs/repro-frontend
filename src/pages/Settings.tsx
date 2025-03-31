import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { ImportShootsDialog } from '@/components/dashboard/ImportShootsDialog';
import { UploadIcon } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  
  const handleImportClick = () => {
    setIsImportDialogOpen(true);
  };
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your changes have been successfully saved.",
    });
  };
  
  return (
    <DashboardLayout>
      <PageTransition>
        <div className="container mx-auto py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account settings and preferences.
              </p>
            </div>
            <Button variant="outline" onClick={handleImportClick}>
              <UploadIcon className="mr-2 h-4 w-4" />
              Import Shoots
            </Button>
          </div>
          
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4 mt-4">
              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-medium mb-4">Profile Settings</h3>
                {/* Profile settings content would go here */}
                <div className="flex justify-end mt-4">
                  <Button onClick={handleSaveSettings}>Save Changes</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="account" className="space-y-4 mt-4">
              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-medium mb-4">Account Settings</h3>
                {/* Account settings content would go here */}
                <div className="flex justify-end mt-4">
                  <Button onClick={handleSaveSettings}>Save Changes</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4 mt-4">
              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                {/* Notification settings content would go here */}
                <div className="flex justify-end mt-4">
                  <Button onClick={handleSaveSettings}>Save Changes</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-4 mt-4">
              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-medium mb-4">Appearance Settings</h3>
                {/* Appearance settings content would go here */}
                <div className="flex justify-end mt-4">
                  <Button onClick={handleSaveSettings}>Save Changes</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <ImportShootsDialog 
          isOpen={isImportDialogOpen}
          onClose={() => setIsImportDialogOpen(false)}
        />
      </PageTransition>
    </DashboardLayout>
  );
};

export default Settings;
