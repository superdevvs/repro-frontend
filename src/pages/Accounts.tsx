import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  CameraIcon, 
  CheckIcon, 
  CopyIcon, 
  Download, 
  EditIcon, 
  FileIcon, 
  KeyIcon, 
  PlusIcon, 
  Printer, 
  SearchIcon, 
  Trash2Icon, 
  UploadIcon, 
  UserIcon, 
  UserPlusIcon, 
  UsersIcon 
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

// Mock data for accounts
const accountsData = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    company: 'ABC Properties',
    type: 'photographer',
    shootsCount: 124,
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    company: 'XYZ Realty',
    type: 'client',
    shootsCount: 45,
    status: 'active',
  },
  {
    id: '3',
    name: 'Mike Brown',
    email: 'mike.brown@example.com',
    phone: '(555) 456-7890',
    company: 'Photography Pro',
    type: 'photographer',
    shootsCount: 78,
    status: 'inactive',
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '(555) 789-0123',
    company: 'Johnson Media',
    type: 'editor',
    shootsCount: 0,
    status: 'active',
  },
  {
    id: '5',
    name: 'Robert Wilson',
    email: 'robert.wilson@example.com',
    phone: '(555) 234-5678',
    company: 'Wilson Realty',
    type: 'client',
    shootsCount: 12,
    status: 'active',
  },
];

// Mock branding info data
const brandingInfoData = [
  {
    id: '1',
    name: 'ABC Properties',
    companyName: 'ABC Properties LLC',
    phone: '(555) 123-7890',
    website: 'https://www.abcproperties.com',
    logo: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    name: 'XYZ Realty',
    companyName: 'XYZ Realty Group',
    phone: '(555) 987-1234',
    website: 'https://www.xyzrealty.com',
    logo: 'https://via.placeholder.com/150',
  },
  {
    id: '3',
    name: 'Wilson Realty',
    companyName: 'Wilson Realty & Associates',
    phone: '(555) 456-7890',
    website: 'https://www.wilsonrealty.com',
    logo: 'https://via.placeholder.com/150',
  },
];

// Mock client branding links data
const clientBrandingLinks = [
  {
    clientId: '2',
    clientName: 'Jane Smith',
    companyName: 'XYZ Realty',
    brandingId: '2',
    brandingName: 'XYZ Realty Group',
  },
  {
    clientId: '5',
    clientName: 'Robert Wilson',
    companyName: 'Wilson Realty',
    brandingId: '3',
    brandingName: 'Wilson Realty & Associates',
  },
];

const Accounts = () => {
  const { role } = useAuth();
  const { toast } = useToast();
  
  // State for accounts tab
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [accountFormOpen, setAccountFormOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [accountFormData, setAccountFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    type: 'client',
    password: '',
    confirmPassword: '',
  });
  
  // State for branding info tab
  const [brandingSearchTerm, setBrandingSearchTerm] = useState('');
  const [brandingFormOpen, setBrandingFormOpen] = useState(false);
  const [selectedBranding, setSelectedBranding] = useState<any>(null);
  const [brandingFormData, setBrandingFormData] = useState({
    name: '',
    companyName: '',
    phone: '',
    website: '',
    logo: 'https://via.placeholder.com/150',
  });
  
  // State for client branding links tab
  const [linkFormOpen, setLinkFormOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<any>(null);
  const [linkFormData, setLinkFormData] = useState({
    clientId: '',
    brandingId: '',
  });
  
  // Filter accounts based on search term and active tab
  const filteredAccounts = accountsData.filter(account => {
    const matchesSearch = 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'photographers') return matchesSearch && account.type === 'photographer';
    if (activeTab === 'clients') return matchesSearch && account.type === 'client';
    if (activeTab === 'editors') return matchesSearch && account.type === 'editor';
    if (activeTab === 'inactive') return matchesSearch && account.status === 'inactive';
    
    return matchesSearch;
  });
  
  // Filter branding info based on search term
  const filteredBrandingInfo = brandingInfoData.filter(branding => 
    branding.name.toLowerCase().includes(brandingSearchTerm.toLowerCase()) ||
    branding.companyName.toLowerCase().includes(brandingSearchTerm.toLowerCase())
  );
  
  // Handle account form input changes
  const handleAccountFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountFormData({
      ...accountFormData,
      [name]: value,
    });
  };
  
  // Handle account type select change
  const handleAccountTypeChange = (value: string) => {
    setAccountFormData({
      ...accountFormData,
      type: value,
    });
  };
  
  // Handle branding form input changes
  const handleBrandingFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBrandingFormData({
      ...brandingFormData,
      [name]: value,
    });
  };
  
  // Create or edit account
  const handleSubmitAccount = () => {
    // Validate passwords match
    if (accountFormData.password !== accountFormData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }
    
    // In a real application, this would send data to the server
    toast({
      title: selectedAccount ? 'Account Updated' : 'Account Created',
      description: `${accountFormData.name}'s account has been ${selectedAccount ? 'updated' : 'created'} successfully.`,
    });
    
    resetAccountForm();
    setAccountFormOpen(false);
  };
  
  // Create or edit branding info
  const handleSubmitBranding = () => {
    // In a real application, this would send data to the server
    toast({
      title: selectedBranding ? 'Branding Updated' : 'Branding Created',
      description: `${brandingFormData.name}'s branding has been ${selectedBranding ? 'updated' : 'created'} successfully.`,
    });
    
    resetBrandingForm();
    setBrandingFormOpen(false);
  };
  
  // Create or edit client branding link
  const handleSubmitLink = () => {
    // In a real application, this would send data to the server
    toast({
      title: selectedLink ? 'Link Updated' : 'Link Created',
      description: 'Client branding link has been updated successfully.',
    });
    
    resetLinkForm();
    setLinkFormOpen(false);
  };
  
  // Reset account form
  const resetAccountForm = () => {
    setAccountFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      type: 'client',
      password: '',
      confirmPassword: '',
    });
    setSelectedAccount(null);
  };
  
  // Reset branding form
  const resetBrandingForm = () => {
    setBrandingFormData({
      name: '',
      companyName: '',
      phone: '',
      website: '',
      logo: 'https://via.placeholder.com/150',
    });
    setSelectedBranding(null);
  };
  
  // Reset link form
  const resetLinkForm = () => {
    setLinkFormData({
      clientId: '',
      brandingId: '',
    });
    setSelectedLink(null);
  };
  
  // Edit account
  const handleEditAccount = (account: any) => {
    setAccountFormData({
      name: account.name,
      email: account.email,
      phone: account.phone,
      company: account.company,
      type: account.type,
      password: '',
      confirmPassword: '',
    });
    setSelectedAccount(account);
    setAccountFormOpen(true);
  };
  
  // Edit branding
  const handleEditBranding = (branding: any) => {
    setBrandingFormData({
      name: branding.name,
      companyName: branding.companyName,
      phone: branding.phone,
      website: branding.website,
      logo: branding.logo,
    });
    setSelectedBranding(branding);
    setBrandingFormOpen(true);
  };
  
  // Edit link
  const handleEditLink = (link: any) => {
    setLinkFormData({
      clientId: link.clientId,
      brandingId: link.brandingId,
    });
    setSelectedLink(link);
    setLinkFormOpen(true);
  };
  
  // Delete account
  const handleDeleteAccount = (id: string) => {
    // In a real application, this would send a delete request to the server
    toast({
      title: 'Account Deleted',
      description: 'The account has been deleted successfully.',
    });
  };
  
  // Delete branding
  const handleDeleteBranding = (id: string) => {
    // In a real application, this would send a delete request to the server
    toast({
      title: 'Branding Deleted',
      description: 'The branding information has been deleted successfully.',
    });
  };
  
  // Delete link
  const handleDeleteLink = (clientId: string) => {
    // In a real application, this would send a delete request to the server
    toast({
      title: 'Link Removed',
      description: 'The client branding link has been removed successfully.',
    });
  };
  
  // Export data
  const handleExport = (format: 'print' | 'csv' | 'copy') => {
    switch (format) {
      case 'print':
        toast({
          title: 'Print',
          description: 'Preparing document for printing...',
        });
        break;
      case 'csv':
        toast({
          title: 'CSV Export',
          description: 'Exporting data to CSV...',
        });
        break;
      case 'copy':
        toast({
          title: 'Copied',
          description: 'Data copied to clipboard.',
        });
        break;
    }
  };
  
  // Reset password
  const handleResetPassword = (id: string) => {
    toast({
      title: 'Password Reset',
      description: 'A password reset email has been sent.',
    });
  };
  
  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              Accounts
            </Badge>
            <h1 className="text-3xl font-bold">Account Management</h1>
            <p className="text-muted-foreground">
              Manage user accounts and branding in the REPro Dashboard
            </p>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="accounts">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
              <TabsTrigger value="branding">Tour Branding Info</TabsTrigger>
              <TabsTrigger value="links">Link Client/Branding</TabsTrigger>
            </TabsList>
            
            {/* Accounts Tab */}
            <TabsContent value="accounts" className="space-y-4 pt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="relative flex-1">
                      <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search accounts..." 
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex gap-2 flex-wrap">
                        <Button 
                          variant={activeTab === 'all' ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setActiveTab('all')}
                        >
                          All
                        </Button>
                        <Button 
                          variant={activeTab === 'photographers' ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setActiveTab('photographers')}
                        >
                          Photographers
                        </Button>
                        <Button 
                          variant={activeTab === 'clients' ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setActiveTab('clients')}
                        >
                          Clients
                        </Button>
                        <Button 
                          variant={activeTab === 'editors' ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setActiveTab('editors')}
                        >
                          Editors
                        </Button>
                        <Button 
                          variant={activeTab === 'inactive' ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setActiveTab('inactive')}
                        >
                          Inactive
                        </Button>
                      </div>
                      
                      <div className="flex gap-2 ml-auto">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <FileIcon className="h-4 w-4 mr-2" />
                              Export
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleExport('print')}>
                              <Printer className="h-4 w-4 mr-2" />
                              Print
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport('csv')}>
                              <Download className="h-4 w-4 mr-2" />
                              Export CSV
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport('copy')}>
                              <CopyIcon className="h-4 w-4 mr-2" />
                              Copy to Clipboard
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        
                        <Button onClick={() => {
                          resetAccountForm();
                          setAccountFormOpen(true);
                        }}>
                          <UserPlusIcon className="h-4 w-4 mr-2" />
                          Create Account
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Shoots</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAccounts.length > 0 ? (
                          filteredAccounts.map((account) => (
                            <TableRow key={account.id}>
                              <TableCell className="font-medium">{account.name}</TableCell>
                              <TableCell>{account.email}</TableCell>
                              <TableCell>{account.phone}</TableCell>
                              <TableCell>{account.company}</TableCell>
                              <TableCell className="capitalize">{account.type}</TableCell>
                              <TableCell>{account.shootsCount}</TableCell>
                              <TableCell>
                                <Badge className={account.status === 'active' 
                                  ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                  : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                                }>
                                  {account.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      Actions
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditAccount(account)}>
                                      <EditIcon className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleResetPassword(account.id)}>
                                      <KeyIcon className="h-4 w-4 mr-2" />
                                      Reset Password
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDeleteAccount(account.id)} className="text-destructive">
                                      <Trash2Icon className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center h-24">
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <UsersIcon className="h-8 w-8 mb-2 opacity-20" />
                                <p>No accounts found</p>
                                <p className="text-sm">Try adjusting your filters</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Tour Branding Tab */}
            <TabsContent value="branding" className="space-y-4 pt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                    <div className="relative flex-1">
                      <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search branding info..." 
                        className="pl-9"
                        value={brandingSearchTerm}
                        onChange={(e) => setBrandingSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <Button onClick={() => {
                      resetBrandingForm();
                      setBrandingFormOpen(true);
                    }}>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Create Branding Info
                    </Button>
                  </div>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Logo</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Company Name</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Website</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBrandingInfo.length > 0 ? (
                          filteredBrandingInfo.map((branding) => (
                            <TableRow key={branding.id}>
                              <TableCell>
                                <div className="h-10 w-10 rounded-md overflow-hidden">
                                  <img 
                                    src={branding.logo} 
                                    alt={branding.name} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">{branding.name}</TableCell>
                              <TableCell>{branding.companyName}</TableCell>
                              <TableCell>{branding.phone}</TableCell>
                              <TableCell>{branding.website}</TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      Actions
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditBranding(branding)}>
                                      <EditIcon className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDeleteBranding(branding.id)} className="text-destructive">
                                      <Trash2Icon className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center h-24">
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <UsersIcon className="h-8 w-8 mb-2 opacity-20" />
                                <p>No branding info found</p>
                                <p className="text-sm">Try adjusting your search or add new branding</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Link Client/Branding Tab */}
            <TabsContent value="links" className="space-y-4 pt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-end mb-4">
                    <Button onClick={() => {
                      resetLinkForm();
                      setLinkFormOpen(true);
                    }}>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Link Client to Branding
                    </Button>
                  </div>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client</TableHead>
                          <TableHead>Client Company</TableHead>
                          <TableHead>Branding</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientBrandingLinks.length > 0 ? (
                          clientBrandingLinks.map((link) => (
                            <TableRow key={link.clientId}>
                              <TableCell className="font-medium">{link.clientName}</TableCell>
                              <TableCell>{link.companyName}</TableCell>
                              <TableCell>{link.brandingName}</TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      Actions
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditLink(link)}>
                                      <EditIcon className="h-4 w-4 mr-2" />
                                      Change Branding
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDeleteLink(link.clientId)} className="text-destructive">
                                      <Trash2Icon className="h-4 w-4 mr-2" />
                                      Remove Link
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center h-24">
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <UsersIcon className="h-8 w-8 mb-2 opacity-20" />
                                <p>No client/branding links found</p>
                                <p className="text-sm">Create a new link to connect clients with branding</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
      
      {/* Account Form Dialog */}
      <Dialog open={accountFormOpen} onOpenChange={setAccountFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedAccount ? 'Edit Account' : 'Create Account'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                value={accountFormData.name}
                onChange={handleAccountFormChange}
                placeholder="Enter full name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={accountFormData.email}
                onChange={handleAccountFormChange}
                placeholder="Enter email address"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                value={accountFormData.phone}
                onChange={handleAccountFormChange}
                placeholder="Enter phone number"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium">
                Company
              </label>
              <Input
                id="company"
                name="company"
                value={accountFormData.company}
                onChange={handleAccountFormChange}
                placeholder="Enter company name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Account Type
              </label>
              <Select 
                value={accountFormData.type} 
                onValueChange={handleAccountTypeChange}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="photographer">Photographer</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  {role === 'superadmin' && (
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                {selectedAccount ? 'New Password (leave blank to keep current)' : 'Password'}
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={accountFormData.password}
                onChange={handleAccountFormChange}
                placeholder={selectedAccount ? 'Enter new password' : 'Enter password'}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={accountFormData.confirmPassword}
                onChange={handleAccountFormChange}
                placeholder="Confirm password"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetAccountForm();
              setAccountFormOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSubmitAccount}>
              {selectedAccount ? 'Update Account' : 'Create Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Branding Form Dialog */}
      <Dialog open={brandingFormOpen} onOpenChange={setBrandingFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedBranding ? 'Edit Branding Info' : 'Create Branding Info'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-md overflow-hidden border border-border">
                  <img 
                    src={brandingFormData.logo} 
                    alt="Branding Logo" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="absolute bottom-0 right-0 h-8 w-8 p-0 rounded-full"
                >
                  <UploadIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Branding Name
              </label>
              <Input
                id="name"
                name="name"
                value={brandingFormData.name}
                onChange={handleBrandingFormChange}
                placeholder="Enter branding name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="companyName" className="text-sm font-medium">
                Company Name
              </label>
              <Input
                id="companyName"
                name="companyName"
                value={brandingFormData.companyName}
                onChange={handleBrandingFormChange}
                placeholder="Enter company name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                value={brandingFormData.phone}
                onChange={handleBrandingFormChange}
                placeholder="Enter phone number"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="website" className="text-sm font-medium">
                Website URL
              </label>
              <Input
                id="website"
                name="website"
                value={brandingFormData.website}
                onChange={handleBrandingFormChange}
                placeholder="Enter website URL"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetBrandingForm();
              setBrandingFormOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSubmitBranding}>
              {selectedBranding ? 'Update Branding' : 'Create Branding'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Link Form Dialog */}
      <Dialog open={linkFormOpen} onOpenChange={setLinkFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedLink ? 'Edit Client Branding Link' : 'Link Client to Branding'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="clientId" className="text-sm font-medium">
                Select Client
              </label>
              <Select 
                value={linkFormData.clientId} 
                onValueChange={(value) => setLinkFormData({...linkFormData, clientId: value})}
                disabled={!!selectedLink}
              >
                <SelectTrigger id="clientId">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {accountsData
                    .filter(account => account.type === 'client')
                    .map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} ({client.company})
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="brandingId" className="text-sm font-medium">
                Select Branding
              </label>
              <Select 
                value={linkFormData.brandingId} 
                onValueChange={(value) => setLinkFormData({...linkFormData, brandingId: value})}
              >
                <SelectTrigger id="brandingId">
                  <SelectValue placeholder="Select branding" />
                </SelectTrigger>
                <SelectContent>
                  {brandingInfoData.map(branding => (
                    <SelectItem key={branding.id} value={branding.id}>
                      {branding.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetLinkForm();
              setLinkFormOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSubmitLink}>
              {selectedLink ? 'Update Link' : 'Create Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Accounts;

