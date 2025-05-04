
import React, { useState } from 'react';
import { AccountsLayout } from '@/components/layout/AccountsLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { AccountsHeader } from '@/components/accounts/AccountsHeader';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { UserProfileDialog } from '@/components/accounts/UserProfileDialog';
import { ResetPasswordDialog } from '@/components/accounts/ResetPasswordDialog';
import { RoleChangeDialog } from '@/components/accounts/RoleChangeDialog';
import { NotificationSettingsDialog } from '@/components/accounts/NotificationSettingsDialog';
import { AccountForm } from '@/components/accounts/AccountForm';
import { AccountBox } from '@/components/accounts/AccountBox'; // Import our new component
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockAccounts = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'admin',
    phone: '(555) 123-4567',
    avatar: 'https://ui.shadcn.com/avatars/01.png',
    location: 'New York, NY',
    joinDate: 'Jan 15, 2023',
    status: 'active' as const,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    role: 'client',
    avatar: 'https://ui.shadcn.com/avatars/02.png',
    location: 'Los Angeles, CA',
    joinDate: 'Mar 3, 2023',
    status: 'active' as const,
  },
  {
    id: '3',
    name: 'Michael Wong',
    email: 'michael.w@example.com',
    role: 'photographer',
    phone: '(555) 987-6543',
    avatar: 'https://ui.shadcn.com/avatars/03.png',
    location: 'Chicago, IL',
    joinDate: 'Feb 12, 2023',
    status: 'active' as const,
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    role: 'editor',
    avatar: 'https://ui.shadcn.com/avatars/04.png',
    location: 'Seattle, WA',
    joinDate: 'Apr 22, 2023',
    status: 'inactive' as const,
  },
];

const Accounts = () => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNewAccountOpen, setIsNewAccountOpen] = useState(false);

  const filteredAccounts = mockAccounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          account.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || account.role === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleAccountSelect = (account: any) => {
    setSelectedAccount(account);
    setIsProfileOpen(true);
  };

  return (
    <AccountsLayout>
      <PageTransition>
        <AccountsHeader />
        
        <div className="mb-6">
          <div className={`flex ${isMobile ? 'flex-col gap-4' : 'flex-row justify-between'} mb-4`}>
            <div className={`relative ${isMobile ? 'w-full' : 'w-1/3'}`}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
              
              <Button className="gap-2" onClick={() => setIsNewAccountOpen(true)}>
                <Plus className="h-4 w-4" />
                <span>New Account</span>
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Accounts</TabsTrigger>
              <TabsTrigger value="admin">Admins</TabsTrigger>
              <TabsTrigger value="client">Clients</TabsTrigger>
              <TabsTrigger value="photographer">Photographers</TabsTrigger>
              <TabsTrigger value="editor">Editors</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'} gap-4`}>
                {filteredAccounts.map((account) => (
                  <AccountBox
                    key={account.id}
                    account={account}
                    onSelect={handleAccountSelect}
                    isSelected={selectedAccount?.id === account.id}
                  />
                ))}
                
                {filteredAccounts.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-lg font-medium">No accounts found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
      
      {/* Dialogs */}
      {selectedAccount && (
        <>
          <UserProfileDialog
            open={isProfileOpen}
            onOpenChange={setIsProfileOpen}
            account={selectedAccount}
            onResetPassword={() => {
              setIsProfileOpen(false);
              setIsResetOpen(true);
            }}
            onChangeRole={() => {
              setIsProfileOpen(false);
              setIsRoleOpen(true);
            }}
            onNotificationSettings={() => {
              setIsProfileOpen(false);
              setIsNotificationsOpen(true);
            }}
          />
          
          <ResetPasswordDialog
            open={isResetOpen}
            onOpenChange={setIsResetOpen}
            account={selectedAccount}
          />
          
          <RoleChangeDialog
            open={isRoleOpen}
            onOpenChange={setIsRoleOpen}
            account={selectedAccount}
          />
          
          <NotificationSettingsDialog
            open={isNotificationsOpen}
            onOpenChange={setIsNotificationsOpen}
            account={selectedAccount}
          />
        </>
      )}
      
      <AccountForm
        open={isNewAccountOpen}
        onOpenChange={setIsNewAccountOpen}
      />
    </AccountsLayout>
  );
};

export default Accounts;
