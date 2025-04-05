import { useState, useEffect } from "react";
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { User, Role, useAuth } from "@/components/auth/AuthProvider";
import { AccountsHeader } from "@/components/accounts/AccountsHeader";
import { AccountCard } from "@/components/accounts/AccountCard";
import { AccountForm } from "@/components/accounts/AccountForm";
import { RoleChangeDialog } from "@/components/accounts/RoleChangeDialog";
import { NotificationSettingsDialog } from "@/components/accounts/NotificationSettingsDialog";
import { LinkClientBrandingDialog } from "@/components/accounts/LinkClientBrandingDialog";
import { UserProfileDialog } from "@/components/accounts/UserProfileDialog";
import { ResetPasswordDialog } from "@/components/accounts/ResetPasswordDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { downloadCSV } from "@/utils/downloadUtils";
import { useShoots } from "@/context/ShootsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin' as Role,
    avatar: 'https://ui.shadcn.com/avatars/01.png',
    phone: '+1 (555) 123-4567',
    company: 'Real Estate Media Inc.',
    createdAt: '2023-01-15T08:30:00Z',
    lastLogin: '2023-06-12T14:45:00Z',
    bio: 'Admin User bio',
    username: 'adminuser',
    isActive: true
  },
  {
    id: '2',
    name: 'Photographer User',
    email: 'photographer@example.com',
    role: 'photographer' as Role,
    avatar: 'https://ui.shadcn.com/avatars/02.png',
    phone: '+1 (555) 987-6543',
    createdAt: '2023-02-10T10:15:00Z',
    lastLogin: '2023-06-10T09:20:00Z',
    bio: 'Photographer User bio',
    username: 'photographeruser',
    isActive: true
  },
  {
    id: '3',
    name: 'Client User',
    email: 'client@example.com',
    role: 'client' as Role,
    avatar: 'https://ui.shadcn.com/avatars/03.png',
    company: 'Premier Properties',
    createdAt: '2023-03-05T11:45:00Z',
    lastLogin: '2023-06-11T16:30:00Z',
    bio: 'Client User bio',
    username: 'clientuser',
    isActive: true
  },
  {
    id: '4',
    name: 'Editor User',
    email: 'editor@example.com',
    role: 'editor' as Role,
    avatar: 'https://ui.shadcn.com/avatars/04.png',
    createdAt: '2023-03-15T14:30:00Z',
    lastLogin: '2023-06-09T11:20:00Z',
    bio: 'Editor User bio',
    username: 'editoruser',
    isActive: false
  },
  {
    id: '5',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'photographer' as Role,
    avatar: 'https://ui.shadcn.com/avatars/05.png',
    phone: '+1 (555) 234-5678',
    createdAt: '2023-04-05T09:15:00Z',
    lastLogin: '2023-06-08T15:30:00Z',
    bio: 'Professional photographer with 10 years of experience',
    username: 'johnsmith',
    isActive: true
  },
  {
    id: '6',
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: 'client' as Role,
    avatar: 'https://ui.shadcn.com/avatars/06.png',
    company: 'Luxury Homes',
    phone: '+1 (555) 345-6789',
    createdAt: '2023-03-20T11:30:00Z',
    lastLogin: '2023-06-07T10:45:00Z',
    bio: 'Real estate agent specializing in luxury properties',
    username: 'janedoe',
    isActive: true
  }
];

export default function Accounts() {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [selectedFilter, setSelectedFilter] = useState<Role | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { getUniqueClients } = useShoots();
  const clients = getUniqueClients();
  
  // State for all dialogs
  const [addEditDialogOpen, setAddEditDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [linkClientBrandingDialogOpen, setLinkClientBrandingDialogOpen] = useState(false);
  const [userProfileDialogOpen, setUserProfileDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState('user-accounts');
  
  useEffect(() => {
    if (!hasPermission(['admin', 'superadmin'])) {
      toast.error("You don't have permission to access account management");
    }
  }, [hasPermission]);
  
  useEffect(() => {
    let filtered = users;
    
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(user => user.role === selectedFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query) ||
        (user.company && user.company.toLowerCase().includes(query)) ||
        (user.username && user.username.toLowerCase().includes(query))
      );
    }
    
    setFilteredUsers(filtered);
  }, [users, selectedFilter, searchQuery]);
  
  const handleAddAccount = () => {
    setSelectedUser(null);
    setAddEditDialogOpen(true);
  };
  
  const handleEditAccount = (user: User) => {
    setSelectedUser(user);
    setAddEditDialogOpen(true);
  };
  
  const handleChangeRole = (user: User) => {
    setSelectedUser(user);
    setRoleDialogOpen(true);
  };
  
  const handleToggleStatus = (user: User) => {
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { ...u, isActive: !u.isActive };
      }
      return u;
    });
    
    setUsers(updatedUsers);
    toast.success(`User ${user.name} ${!user.isActive ? 'activated' : 'deactivated'} successfully`);
  };
  
  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setResetPasswordDialogOpen(true);
  };
  
  const handleImpersonate = (user: User) => {
    toast.info(`Impersonating ${user.name}...`);
    // Implement impersonation logic here
  };
  
  const handleManageNotifications = (user: User) => {
    setSelectedUser(user);
    setNotificationDialogOpen(true);
  };
  
  const handleLinkClientBranding = (user: User) => {
    setSelectedUser(user);
    setLinkClientBrandingDialogOpen(true);
  };
  
  const handleViewProfile = (user: User) => {
    setSelectedUser(user);
    setUserProfileDialogOpen(true);
  };
  
  const handleSubmitAccount = (data: any) => {
    if (selectedUser) {
      // Edit existing user
      const updatedUsers = users.map(user => {
        if (user.id === selectedUser.id) {
          return { ...user, ...data };
        }
        return user;
      });
      setUsers(updatedUsers);
      toast.success(`User ${data.name} updated successfully`);
    } else {
      // Add new user
      const newUser = {
        id: (users.length + 1).toString(),
        ...data,
        createdAt: new Date().toISOString(),
        lastLogin: null,
      };
      setUsers([...users, newUser]);
      toast.success(`User ${data.name} created successfully`);
    }
    
    setAddEditDialogOpen(false);
  };
  
  const handleSubmitRoleChange = (userId: string, roles: Role[]) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, role: roles[0] }; // Currently we only support one role
      }
      return user;
    });
    
    setUsers(updatedUsers);
    toast.success(`User role updated successfully`);
  };
  
  const handleSubmitNotificationSettings = (userId: string, settings: Record<string, boolean>) => {
    // Implementation for saving notification settings
    toast.success("Notification settings updated successfully");
  };
  
  const handleSubmitLinkClientBranding = (userId: string, data: any) => {
    // Implementation for saving client and branding links
    toast.success("Client and branding settings updated successfully");
  };
  
  const handleSendResetLink = (userId: string, email: string) => {
    // Implementation for sending password reset link
    console.log(`Send reset link to ${email} for user ${userId}`);
  };
  
  const handleUpdatePassword = (userId: string, password: string) => {
    // Implementation for manually updating password
    console.log(`Update password for user ${userId}`);
  };
  
  const handleExport = () => {
    // Prepare data for export
    const exportData = filteredUsers.map(user => ({
      Name: user.name,
      Email: user.email,
      Role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
      Company: user.company || '',
      Phone: user.phone || '',
      Status: user.isActive ? 'Active' : 'Inactive',
      'Last Login': user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '',
      'Created On': user.createdAt ? new Date(user.createdAt).toLocaleString() : ''
    }));
    
    // Download as CSV
    downloadCSV(exportData, 'users-export.csv');
    toast.success("User data exported successfully");
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 max-w-7xl">
        <AccountsHeader
          onAddAccount={handleAddAccount}
          onExport={handleExport}
          onSearch={handleSearch}
          onFilterChange={setSelectedFilter}
          selectedFilter={selectedFilter}
        />
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
            <TabsTrigger value="user-accounts">User Accounts</TabsTrigger>
            <TabsTrigger value="client-branding">Client & Branding</TabsTrigger>
          </TabsList>
          
          <TabsContent value="user-accounts">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <AccountCard
                    key={user.id}
                    user={user}
                    onEdit={() => handleEditAccount(user)}
                    onChangeRole={() => handleChangeRole(user)}
                    onToggleStatus={() => handleToggleStatus(user)}
                    onResetPassword={() => handleResetPassword(user)}
                    onImpersonate={() => handleImpersonate(user)}
                    onManageNotifications={() => handleManageNotifications(user)}
                    onLinkClientBranding={() => handleLinkClientBranding(user)}
                    onViewProfile={() => handleViewProfile(user)}
                    isActive={user.isActive}
                  />
                ))
              ) : (
                <div className="col-span-3 py-10 text-center">
                  <p className="text-muted-foreground">No users found matching your criteria</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="client-branding">
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Client & Branding Management</h2>
              <p className="text-muted-foreground mb-6">
                Manage client associations and customize branding settings for your property tours.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {clients.length > 0 ? (
                  clients.map((client, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-semibold">{client.name}</CardTitle>
                          <Badge>{client.shootCount} shoots</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {client.email && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Email</p>
                              <p className="text-sm">{client.email}</p>
                            </div>
                          )}
                          
                          {client.company && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Company</p>
                              <p className="text-sm">{client.company}</p>
                            </div>
                          )}
                          
                          <div className="pt-3 flex justify-end">
                            <Button size="sm" variant="outline">Edit Branding</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-muted-foreground">
                      No client data available. Add clients to see them here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <AccountForm
          open={addEditDialogOpen}
          onOpenChange={setAddEditDialogOpen}
          onSubmit={handleSubmitAccount}
          initialData={selectedUser}
        />
        
        <RoleChangeDialog
          open={roleDialogOpen}
          onOpenChange={setRoleDialogOpen}
          user={selectedUser}
          onSubmit={handleSubmitRoleChange}
        />
        
        <NotificationSettingsDialog
          open={notificationDialogOpen}
          onOpenChange={setNotificationDialogOpen}
          user={selectedUser}
          onSubmit={handleSubmitNotificationSettings}
        />
        
        <LinkClientBrandingDialog
          open={linkClientBrandingDialogOpen}
          onOpenChange={setLinkClientBrandingDialogOpen}
          user={selectedUser}
          onSubmit={handleSubmitLinkClientBranding}
        />
        
        <UserProfileDialog
          open={userProfileDialogOpen}
          onOpenChange={setUserProfileDialogOpen}
          user={selectedUser}
          onEdit={() => {
            setUserProfileDialogOpen(false);
            setTimeout(() => {
              if (selectedUser) handleEditAccount(selectedUser);
            }, 100);
          }}
        />
        
        <ResetPasswordDialog
          open={resetPasswordDialogOpen}
          onOpenChange={setResetPasswordDialogOpen}
          user={selectedUser}
          onSendResetLink={handleSendResetLink}
          onUpdatePassword={handleUpdatePassword}
        />
      </div>
    </DashboardLayout>
  );
}
