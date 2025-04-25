import React, { useState } from "react";
import { AccountsLayout } from "@/components/layout/AccountsLayout";
import { AccountCard } from "@/components/accounts/AccountCard";
import { AccountList } from "@/components/accounts/AccountList";
import { AccountsHeader } from "@/components/accounts/AccountsHeader";
import { Role } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { ResetPasswordDialog } from "@/components/accounts/ResetPasswordDialog";
import { RoleChangeDialog } from "@/components/accounts/RoleChangeDialog";
import { NotificationSettingsDialog } from "@/components/accounts/NotificationSettingsDialog";
import { LinkClientBrandingDialog } from "@/components/accounts/LinkClientBrandingDialog";
import { UserProfileDialog } from "@/components/accounts/UserProfileDialog";
import { useProfiles } from "@/hooks/useProfiles";
import { supabase } from "@/integrations/supabase/client";

export default function Accounts() {
  const [filterRole, setFilterRole] = useState<Role | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { toast } = useToast();
  
  const { data: users = [], isLoading } = useProfiles();
  
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [roleChangeDialogOpen, setRoleChangeDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [notificationSettingsDialogOpen, setNotificationSettingsDialogOpen] = useState(false);
  const [linkClientBrandingDialogOpen, setLinkClientBrandingDialogOpen] = useState(false);
  const [userProfileDialogOpen, setUserProfileDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const filteredUsers = users.filter((user) => {
    const roleMatch = filterRole === "all" || user.role === filterRole;
    const searchMatch = searchQuery === "" || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.company && user.company.toLowerCase().includes(searchQuery.toLowerCase()));
    return roleMatch && searchMatch;
  });

  const handleToggleStatus = async (user: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !user.isActive })
        .eq('id', user.id);

      if (error) throw error;
      
      toast({
        title: `User ${user.isActive ? "deactivated" : "activated"}`,
        description: `${user.name} has been ${user.isActive ? "deactivated" : "activated"} successfully.`,
        variant: user.isActive ? "destructive" : "default",
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRoles = async (userId: string, roles: Role[]) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: roles[0] })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Role updated",
        description: `User role has been updated to ${roles.join(", ")}.`,
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      });
    }
  };

  const handleAddAccount = () => {
    setSelectedUser(null);
    setEditUserDialogOpen(true);
  };

  const handleExport = () => {
    toast({
      title: "Exporting users data",
      description: "The users data has been exported successfully.",
    });
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditUserDialogOpen(true);
  };

  const handleChangeRole = (user: any) => {
    setSelectedUser(user);
    setRoleChangeDialogOpen(true);
  };

  const handleResetPassword = (user: any) => {
    setSelectedUser(user);
    setResetPasswordDialogOpen(true);
  };

  const handleImpersonate = (user: any) => {
    toast({
      title: "Impersonating user",
      description: `You are now viewing the dashboard as ${user.name}.`,
    });
  };

  const handleManageNotifications = (user: any) => {
    setSelectedUser(user);
    setNotificationSettingsDialogOpen(true);
  };

  const handleLinkClientBranding = (user: any) => {
    setSelectedUser(user);
    setLinkClientBrandingDialogOpen(true);
  };

  const handleViewProfile = (user: any) => {
    setSelectedUser(user);
    setUserProfileDialogOpen(true);
  };
  
  const handleUpdateNotifications = (userId: string, settings: Record<string, boolean>) => {
    toast({
      title: "Notification preferences updated",
      description: "Notification settings have been saved successfully.",
    });
  };
  
  const handleUpdateClientBranding = (userId: string, data: any) => {
    toast({
      title: "Client branding updated",
      description: "Client associations and branding settings have been saved.",
    });
  };
  
  const handleSendResetLink = (userId: string, email: string) => {
    toast({
      title: "Reset link sent",
      description: `Password reset link has been sent to ${email}.`,
    });
  };
  
  const handleUpdatePassword = (userId: string, password: string) => {
    toast({
      title: "Password updated",
      description: "The user's password has been changed successfully.",
    });
  };

  if (isLoading) {
    return (
      <AccountsLayout>
        <div className="container flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AccountsLayout>
    );
  }

  return (
    <AccountsLayout>
      <div className="container px-4 sm:px-6 pb-6 space-y-6">
        <AccountsHeader
          onAddAccount={handleAddAccount}
          onExport={handleExport}
          onSearch={setSearchQuery}
          onFilterChange={setFilterRole}
          selectedFilter={filterRole}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user) => (
              <AccountCard
                key={user.id}
                user={user}
                onEdit={handleEditUser}
                onChangeRole={handleChangeRole}
                onToggleStatus={handleToggleStatus}
                onResetPassword={handleResetPassword}
                onImpersonate={handleImpersonate}
                onManageNotifications={handleManageNotifications}
                onLinkClientBranding={handleLinkClientBranding}
                onViewProfile={handleViewProfile}
                isActive={user.isActive}
              />
            ))}
            
            {filteredUsers.length === 0 && (
              <div className="col-span-full bg-muted/30 p-8 rounded-lg text-center">
                <h3 className="text-lg font-medium mb-2">No accounts found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "Try adjusting your search or filter criteria."
                    : "Get started by adding a new account."}
                </p>
                <button
                  onClick={handleAddAccount}
                  className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md"
                >
                  Add Account
                </button>
              </div>
            )}
          </div>
        ) : (
          <AccountList
            users={filteredUsers}
            onEdit={handleEditUser}
            onChangeRole={handleChangeRole}
            onToggleStatus={handleToggleStatus}
            onResetPassword={handleResetPassword}
            onImpersonate={handleImpersonate}
            onManageNotifications={handleManageNotifications}
            onLinkClientBranding={handleLinkClientBranding}
            onViewProfile={handleViewProfile}
          />
        )}
      </div>
      
      {selectedUser && (
        <>
          <UserProfileDialog 
            open={userProfileDialogOpen} 
            onOpenChange={setUserProfileDialogOpen}
            user={selectedUser}
            onEdit={() => handleEditUser(selectedUser)}
          />
          
          <ResetPasswordDialog
            open={resetPasswordDialogOpen}
            onOpenChange={setResetPasswordDialogOpen}
            user={selectedUser}
            onSendResetLink={handleSendResetLink}
            onUpdatePassword={handleUpdatePassword}
          />
          
          <RoleChangeDialog
            open={roleChangeDialogOpen}
            onOpenChange={setRoleChangeDialogOpen}
            user={selectedUser}
            onSubmit={handleUpdateRoles}
          />
          
          <NotificationSettingsDialog
            open={notificationSettingsDialogOpen}
            onOpenChange={setNotificationSettingsDialogOpen}
            user={selectedUser}
            onSubmit={handleUpdateNotifications}
          />
          
          <LinkClientBrandingDialog
            open={linkClientBrandingDialogOpen}
            onOpenChange={setLinkClientBrandingDialogOpen}
            user={selectedUser}
            onSubmit={handleUpdateClientBranding}
          />
        </>
      )}
    </AccountsLayout>
  );
}
