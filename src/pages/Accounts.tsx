import React, { useState, useRef, useEffect } from 'react';
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
  UsersIcon,
  X 
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Initial mock data for accounts
const initialAccountsData = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    type: 'admin',
    status: 'active',
    avatar: 'https://ui.shadcn.com/avatars/01.png',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    type: 'photographer',
    status: 'active',
    avatar: 'https://ui.shadcn.com/avatars/02.png',
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    type: 'client',
    status: 'inactive',
    avatar: 'https://ui.shadcn.com/avatars/03.png',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    type: 'editor',
    status: 'active',
    avatar: 'https://ui.shadcn.com/avatars/04.png',
  },
  {
    id: '5',
    name: 'Michael Wilson',
    email: 'michael.wilson@example.com',
    type: 'photographer',
    status: 'active',
    avatar: 'https://ui.shadcn.com/avatars/05.png',
  },
];

// Mock branding info data
const initialBrandingInfoData = [
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
    id: '1',
    clientId: '3',
    clientName: 'Robert Johnson',
    brandingId: '1',
    brandingName: 'ABC Properties',
  },
  {
    id: '2',
    clientId: '3',
    clientName: 'Robert Johnson',
    brandingId: '2',
    brandingName: 'XYZ Realty',
  },
];

const Accounts = () => {
  const { role } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const brandingFileInputRef = useRef<HTMLInputElement>(null);
  
  // State for accounts tab
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [accountFormOpen, setAccountFormOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  
  // State for accounts data with localStorage persistence
  const [accountsData, setAccountsData] = useState(() => {
    const savedAccounts = localStorage.getItem('accountsData');
    return savedAccounts ? JSON.parse(savedAccounts) : initialAccountsData;
  });
  
  // Save accounts data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('accountsData', JSON.stringify(accountsData));
  }, [accountsData]);
  
  // State for branding info tab
  const [brandingSearchTerm, setBrandingSearchTerm] = useState('');
  const [brandingFormOpen, setBrandingFormOpen] = useState(false);
  const [selectedBranding, setSelectedBranding] = useState<any>(null);
  const [showBrandingUploadOptions, setShowBrandingUploadOptions] = useState(false);
  const [brandingFormData, setBrandingFormData] = useState({
    name: '',
    companyName: '',
    phone: '',
    website: '',
    logo: 'https://via.placeholder.com/150',
  });

  // State for branding info data with localStorage persistence
  const [brandingInfoData, setBrandingInfoData] = useState(() => {
    const savedBranding = localStorage.getItem('brandingInfoData');
    return savedBranding ? JSON.parse(savedBranding) : initialBrandingInfoData;
  });

  // Save branding info data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('brandingInfoData', JSON.stringify(brandingInfoData));
  }, [brandingInfoData]);
  
  // State for client branding links tab
  const [linkSearchTerm, setLinkSearchTerm] = useState('');
  const [linkFormOpen, setLinkFormOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<any>(null);
  const [linkFormData, setLinkFormData] = useState({
    clientId: '',
    brandingId: '',
  });
  const [linksData, setLinksData] = useState(() => {
    const savedLinks = localStorage.getItem('clientBrandingLinks');
    return savedLinks ? JSON.parse(savedLinks) : clientBrandingLinks;
  });
  
  // Save links data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('clientBrandingLinks', JSON.stringify(linksData));
  }, [linksData]);
  
  // Filter accounts based on search term and active tab
  const filteredAccounts = accountsData.filter(account => {
    const matchesSearch = 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && account.type === activeTab;
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
  
  // State for account form data
  const [accountFormData, setAccountFormData] = useState({
    name: '',
    email: '',
    type: 'client',
    status: 'active',
    avatar: '',
  });
  
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
    if (selectedAccount) {
      // Update existing account
      const updatedAccountsData = accountsData.map(account => 
        account.id === selectedAccount.id 
          ? { 
              ...account, 
              name: accountFormData.name,
              email: accountFormData.email,
              type: accountFormData.type,
              status: accountFormData.status,
              avatar: accountFormData.avatar || account.avatar,
            } 
          : account
      );
      
      setAccountsData(updatedAccountsData);
      
      toast({
        title: 'Account Updated',
        description: `${accountFormData.name}'s account has been updated successfully.`,
      });
    } else {
      // Create new account
      const newAccount = {
        id: `${Date.now()}`,
        name: accountFormData.name,
        email: accountFormData.email,
        type: accountFormData.type,
        status: accountFormData.status,
        avatar: accountFormData.avatar || `https://ui.shadcn.com/avatars/0${Math.floor(Math.random() * 5) + 1}.png`,
      };
      
      setAccountsData([newAccount, ...accountsData]);
      
      toast({
        title: 'Account Created',
        description: `${accountFormData.name}'s account has been created successfully.`,
      });
    }
    
    resetAccountForm();
    setAccountFormOpen(false);
  };
  
  // Create or edit branding info
  const handleSubmitBranding = () => {
    if (selectedBranding) {
      // Update existing branding info
      const updatedBrandingData = brandingInfoData.map(branding => 
        branding.id === selectedBranding.id 
          ? { 
              ...branding, 
              name: brandingFormData.name,
              companyName: brandingFormData.companyName,
              phone: brandingFormData.phone,
              website: brandingFormData.website,
              logo: brandingFormData.logo,
            } 
          : branding
      );
      
      setBrandingInfoData(updatedBrandingData);
      
      toast({
        title: 'Branding Updated',
        description: `${brandingFormData.name}'s branding has been updated successfully.`,
      });
    } else {
      // Create new branding info
      const newBranding = {
        id: `${Date.now()}`,
        name: brandingFormData.name,
        companyName: brandingFormData.companyName,
        phone: brandingFormData.phone,
        website: brandingFormData.website,
        logo: brandingFormData.logo,
      };
      
      setBrandingInfoData([newBranding, ...brandingInfoData]);
      
      toast({
        title: 'Branding Created',
        description: `${brandingFormData.name}'s branding has been created successfully.`,
      });
    }
    
    resetBrandingForm();
    setBrandingFormOpen(false);
  };
  
  // Create or edit client branding link
  const handleSubmitLink = () => {
    // Get client and branding names
    const client = accountsData.find(a => a.id === linkFormData.clientId);
    const branding = brandingInfoData.find(b => b.id === linkFormData.brandingId);
    
    if (!client || !branding) {
      toast({
        title: 'Error',
        description: 'Please select both a client and branding information.',
        variant: 'destructive',
      });
      return;
    }
    
    if (selectedLink) {
      // Update existing link
      const updatedLinksData = linksData.map(link => 
        link.id === selectedLink.id 
          ? { 
              ...link, 
              clientId: linkFormData.clientId,
              clientName: client.name,
              brandingId: linkFormData.brandingId,
              brandingName: branding.name,
            } 
          : link
      );
      
      setLinksData(updatedLinksData);
      
      toast({
        title: 'Link Updated',
        description: `The link between ${client.name} and ${branding.name} has been updated.`,
      });
    } else {
      // Check if link already exists
      const linkExists = linksData.some(
        link => link.clientId === linkFormData.clientId && link.brandingId === linkFormData.brandingId
      );
      
      if (linkExists) {
        toast({
          title: 'Link Already Exists',
          description: `${client.name} is already linked to ${branding.name}.`,
          variant: 'destructive',
        });
        return;
      }
      
      // Create new link
      const newLink = {
        id: `${Date.now()}`,
        clientId: linkFormData.clientId,
        clientName: client.name,
        brandingId: linkFormData.brandingId,
        brandingName: branding.name,
      };
      
      setLinksData([newLink, ...linksData]);
      
      toast({
        title: 'Link Created',
        description: `${client.name} has been linked to ${branding.name}.`,
      });
    }
    
    resetLinkForm();
    setLinkFormOpen(false);
  };
  
  // Reset account form
  const resetAccountForm = () => {
    setAccountFormData({
      name: '',
      email: '',
      type: 'client',
      status: 'active',
      avatar: '',
    });
    setSelectedAccount(null);
    setShowUploadOptions(false);
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
    setShowBrandingUploadOptions(false);
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
      type: account.type,
      status: account.status,
      avatar: account.avatar,
    });
    setSelectedAccount(account);
    setShowUploadOptions(false);
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
    setShowBrandingUploadOptions(false);
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
    // Filter out the account with the specified id
    const updatedAccountsData = accountsData.filter(account => account.id !== id);
    setAccountsData(updatedAccountsData);
    
    // Also delete any links associated with this account
    const updatedLinksData = linksData.filter(link => link.clientId !== id);
    setLinksData(updatedLinksData);
    
    toast({
      title: 'Account Deleted',
      description: 'The account has been deleted successfully.',
    });
  };
  
  // Delete branding
  const handleDeleteBranding = (id: string) => {
    // Filter out the branding with the specified id
    const updatedBrandingData = brandingInfoData.filter(branding => branding.id !== id);
    setBrandingInfoData(updatedBrandingData);
    
    toast({
      title: 'Branding Deleted',
      description: 'The branding information has been deleted successfully.',
    });
  };
  
  // Delete link
  const handleDeleteLink = (id: string) => {
    // Filter out the link with the specified id
    const updatedLinksData = linksData.filter(link => link.id !== id);
    setLinksData(updatedLinksData);
    
    toast({
      title: 'Link Deleted',
      description: 'The client-branding link has been deleted successfully.',
    });
  };
  
  // Export data
  const handleExport = (type: 'print' | 'csv' | 'copy', dataType: 'accounts' | 'branding' | 'links') => {
    let data;
    let filename;
    
    switch (dataType) {
      case 'accounts':
        data = accountsData;
        filename = 'accounts';
        break;
      case 'branding':
        data = brandingInfoData;
        filename = 'branding_info';
        break;
      case 'links':
        data = linksData;
        filename = 'client_branding_links';
        break;
    }
    
    switch (type) {
      case 'print':
        toast({
          title: 'Print Initiated',
          description: `Preparing ${dataType} data for printing...`,
        });
        // In a real app, this would open a print dialog
        console.log('Print data:', data);
        break;
        
      case 'csv':
        toast({
          title: 'Export Initiated',
          description: `Exporting ${dataType} data as CSV...`,
        });
        // In a real app, this would generate and download a CSV file
        console.log('Export data as CSV:', data);
        break;
        
      case 'copy':
        // Convert data to JSON string
        const jsonStr = JSON.stringify(data, null, 2);
        
        // Copy to clipboard
        navigator.clipboard.writeText(jsonStr).then(() => {
          toast({
            title: 'Copied to Clipboard',
            description: `${dataType} data has been copied to clipboard.`,
          });
        }).catch(err => {
          console.error('Failed to copy:', err);
          toast({
            title: 'Copy Failed',
            description: 'Failed to copy data to clipboard.',
            variant: 'destructive',
          });
        });
        break;
    }
  };
  
  // Reset password
  const handleResetPassword = (account: any) => {
    toast({
      title: 'Password Reset Initiated',
      description: `A password reset link has been sent to ${account.email}.`,
    });
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name, file.type, file.size);
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an image file (JPEG, PNG, etc.)',
          variant: 'destructive',
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload an image smaller than 5MB',
          variant: 'destructive',
        });
        return;
      }
      
      const url = URL.createObjectURL(file);
      console.log("Created object URL:", url);
      setAccountFormData(prev => ({
        ...prev,
        avatar: url
      }));
      setShowUploadOptions(false);
      
      toast({
        title: 'File uploaded',
        description: `${file.name} has been uploaded successfully.`,
      });
    } else {
      console.log("No file selected");
    }
  };

  // Handle branding file upload
  const handleBrandingFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Branding file selected:", file.name, file.type, file.size);
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an image file (JPEG, PNG, etc.)',
          variant: 'destructive',
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload an image smaller than 5MB',
          variant: 'destructive',
        });
        return;
      }
      
      const url = URL.createObjectURL(file);
      console.log("Created object URL:", url);
      setBrandingFormData(prev => ({
        ...prev,
        logo: url
      }));
      setShowBrandingUploadOptions(false);
      
      toast({
        title: 'Logo uploaded',
        description: `${file.name} has been uploaded successfully.`,
      });
    } else {
      console.log("No file selected");
    }
  };

  // Handle external upload
  const handleExternalUpload = (source: 'google-drive' | 'dropbox') => {
    let serviceName = source === 'google-drive' ? 'Google Drive' : 'Dropbox';
    
    toast({
      title: `Connecting to ${serviceName}`,
      description: `Opening ${serviceName} file picker...`,
    });
    
    setTimeout(() => {
      const placeholderUrl = source === 'google-drive'
        ? 'https://ui.shadcn.com/avatars/02.png'
        : 'https://ui.shadcn.com/avatars/03.png';
      
      console.log("Image URL being set:", placeholderUrl);
      setAccountFormData(prev => ({
        ...prev,
        avatar: placeholderUrl
      }));
      setShowUploadOptions(false);
      
      toast({
        title: 'File uploaded',
        description: `Image from ${serviceName} has been uploaded successfully.`,
      });
    }, 1500);
  };

  // Handle branding external upload
  const handleBrandingExternalUpload = (source: 'google-drive' | 'dropbox') => {
    let serviceName = source === 'google-drive' ? 'Google Drive' : 'Dropbox';
    
    toast({
      title: `Connecting to ${serviceName}`,
      description: `Opening ${serviceName} file picker...`,
    });
    
    setTimeout(() => {
      const placeholderUrl = source === 'google-drive'
        ? 'https://ui.shadcn.com/avatars/02.png'
        : 'https://ui.shadcn.com/avatars/03.png';
      
      console.log("Branding image URL being set:", placeholderUrl);
      setBrandingFormData(prev => ({
        ...prev,
        logo: placeholderUrl
      }));
      setShowBrandingUploadOptions(false);
      
      toast({
        title: 'Logo uploaded',
        description: `Image from ${serviceName} has been uploaded successfully.`,
      });
    }, 1500);
  };
  
  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                Accounts
              </Badge>
              <h1 className="text-3xl font-bold">Account Management</h1>
              <p className="text-muted-foreground">
                Manage user accounts, branding information, and client relationships
              </p>
            </div>
            
            {['admin', 'superadmin'].includes(role) && (
              <Button className="gap-2" onClick={() => {
                resetAccountForm();
                setAccountFormOpen(true);
              }}>
                <UserPlusIcon className="h-4 w-4" />
                Add Account
              </Button>
            )}
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
                  <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                    <div className="relative flex-1">
                      <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search accounts..." 
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <FileIcon className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleExport('print', 'accounts')}>
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExport('csv', 'accounts')}>
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExport('copy', 'accounts')}>
                            <CopyIcon className="h-4 w-4 mr-2" />
                            Copy to Clipboard
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button 
                      variant={activeTab === 'all' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setActiveTab('all')}
                    >
                      <UsersIcon className="h-4 w-4 mr-2" />
                      All
                    </Button>
                    <Button 
                      variant={activeTab === 'admin' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setActiveTab('admin')}
                    >
                      <UserIcon className="h-4 w-4 mr-2" />
                      Admins
                    </Button>
                    <Button 
                      variant={activeTab === 'photographer' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setActiveTab('photographer')}
                    >
                      <CameraIcon className="h-4 w-4 mr-2" />
                      Photographers
                    </Button>
                    <Button 
                      variant={activeTab === 'client' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setActiveTab('client')}
                    >
                      <UserIcon className="h-4 w-4 mr-2" />
                      Clients
                    </Button>
                    <Button 
                      variant={activeTab === 'editor' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setActiveTab('editor')}
                    >
                      <EditIcon className="h-4 w-4 mr-2" />
                      Editors
                    </Button>
                  </div>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAccounts.length > 0 ? (
                          filteredAccounts.map((account) => (
                            <TableRow key={account.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={account.avatar} alt={account.name} />
                                    <AvatarFallback>{account.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  {account.name}
                                </div>
                              </TableCell>
                              <TableCell>{account.email}</TableCell>
                              <TableCell>
                                <Badge 
                                  className={
                                    account.type === 'admin' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                    account.type === 'photographer' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                    account.type === 'client' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                                    'bg-orange-500/10 text-orange-500 border-orange-500/20'
                                  }
                                >
                                  {account.type}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  className={account.status === 'active' 
                                    ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                    : 'bg-gray-500/10 text-gray-500 border-gray-500/20'}
                                >
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
                                    <DropdownMenuItem onClick={() => handleResetPassword(account)}>
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
                            <TableCell colSpan={5} className="text-center h-24">
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <UsersIcon className="h-8 w-8 mb-2 opacity-20" />
                                <p>No accounts found</p>
                                <p className="text-sm">Try adjusting your search or filters</p>
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
                    
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <FileIcon className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleExport('print', 'branding')}>
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExport('csv', 'branding')}>
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExport('copy', 'branding')}>
                            <CopyIcon className="h-4 w-4 mr-2" />
                            Copy to Clipboard
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    
                      <Button onClick={() => {
                        resetBrandingForm();
                        setBrandingFormOpen(true);
                      }}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Create Branding Info
                      </Button>
                    </div>
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
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={branding.logo} alt={branding.name} />
                                  <AvatarFallback>{branding.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                              </TableCell>
                              <TableCell className="font-medium">{branding.name}</TableCell>
                              <TableCell>{branding.companyName}</TableCell>
                              <TableCell>{branding.phone}</TableCell>
                              <TableCell>
                                <a href={branding.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                  {branding.website}
                                </a>
                              </TableCell>
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
                                <FileIcon className="h-8 w-8 mb-2 opacity-20" />
                                <p>No branding information found</p>
                                <p className="text-sm">Try adjusting your search</p>
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
            
            {/* Client Branding Links Tab */}
            <TabsContent value="links" className="space-y-4 pt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                    <div className="relative flex-1">
                      <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search links..." 
                        className="pl-9"
                        value={linkSearchTerm}
                        onChange={(e) => setLinkSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <FileIcon className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleExport('print', 'links')}>
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExport('csv', 'links')}>
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExport('copy', 'links')}>
                            <CopyIcon className="h-4 w-4 mr-2" />
                            Copy to Clipboard
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    
                      <Button onClick={() => {
                        resetLinkForm();
                        setLinkFormOpen(true);
                      }}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Create Link
                      </Button>
                    </div>
                  </div>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client</TableHead>
                          <TableHead>Branding</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {linksData.length > 0 ? (
                          linksData
                            .filter(link => 
                              link.clientName.toLowerCase().includes(linkSearchTerm.toLowerCase()) ||
                              link.brandingName.toLowerCase().includes(linkSearchTerm.toLowerCase())
                            )
                            .map((link) => (
                              <TableRow key={link.id}>
                                <TableCell className="font-medium">{link.clientName}</TableCell>
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
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleDeleteLink(link.id)} className="text-destructive">
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
                            <TableCell colSpan={3} className="text-center h-24">
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <FileIcon className="h-8 w-8 mb-2 opacity-20" />
                                <p>No client-branding links found</p>
                                <p className="text-sm">Create a new link to get started</p>
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
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Avatar className="h-24 w-24 cursor-pointer border-2 border-border" onClick={() => setShowUploadOptions(true)}>
                  {accountFormData.avatar ? (
                    <AvatarImage src={accountFormData.avatar} alt="Profile" />
                  ) : (
                    <AvatarFallback className="bg-secondary">
                      <CameraIcon className="h-8 w-8 text-muted-foreground" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <Button 
                  type="button"
                  size="sm" 
                  variant="outline" 
                  className="absolute bottom-0 right-0 h-8 w-8 p-0 rounded-full"
                  onClick={() => setShowUploadOptions(true)}
                >
                  <UploadIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {showUploadOptions && (
              <div className="bg-card border rounded-md p-3 relative">
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
                  onClick={() => setShowUploadOptions(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadIcon className="mr-2 h-4 w-4" />
                      Upload from device
                    </Button>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                    />
                  </div>
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleExternalUpload('google-drive')}
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/2295px-Google_Drive_icon_%282020%29.svg.png" 
                      alt="Google Drive" 
                      className="mr-2 h-4 w-4" 
                    />
                    Upload from Google Drive
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleExternalUpload('dropbox')}
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Dropbox_Icon.svg/2202px-Dropbox_Icon.svg.png" 
                      alt="Dropbox" 
                      className="mr-2 h-4 w-4" 
                    />
                    Upload from Dropbox
                  </Button>
                </div>
              </div>
            )}
            
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
              <label htmlFor="type" className="text-sm font-medium">
                Account Type
              </label>
              <Select
                value={accountFormData.type}
                onValueChange={handleAccountTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="photographer">Photographer</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="flex gap-4 mt-1">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="status-active"
                    name="status"
                    className="mr-2"
                    checked={accountFormData.status === 'active'}
                    onChange={() => setAccountFormData({...accountFormData, status: 'active'})}
                  />
                  <label htmlFor="status-active">Active</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="status-inactive"
                    name="status"
                    className="mr-2"
                    checked={accountFormData.status === 'inactive'}
                    onChange={() => setAccountFormData({...accountFormData, status: 'inactive'})}
                  />
                  <label htmlFor="status-inactive">Inactive</label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAccountFormOpen(false)}>
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
            <DialogTitle>{selectedBranding ? 'Edit Branding' : 'Create Branding Info'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Avatar className="h-24 w-24 cursor-pointer border-2 border-border" onClick={() => setShowBrandingUploadOptions(true)}>
                  {brandingFormData.logo ? (
                    <AvatarImage src={brandingFormData.logo} alt="Logo" />
                  ) : (
                    <AvatarFallback className="bg-secondary">
                      <CameraIcon className="h-8 w-8 text-muted-foreground" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <Button 
                  type="button"
                  size="sm" 
                  variant="outline" 
                  className="absolute bottom-0 right-0 h-8 w-8 p-0 rounded-full"
                  onClick={() => setShowBrandingUploadOptions(true)}
                >
                  <UploadIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {showBrandingUploadOptions && (
              <div className="bg-card border rounded-md p-3 relative">
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
                  onClick={() => setShowBrandingUploadOptions(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => brandingFileInputRef.current?.click()}
                    >
                      <UploadIcon className="mr-2 h-4 w-4" />
                      Upload from device
                    </Button>
                    <input 
                      type="file" 
                      ref={brandingFileInputRef}
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleBrandingFileUpload} 
                    />
                  </div>
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleBrandingExternalUpload('google-drive')}
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/2295px-Google_Drive_icon_%282020%29.svg.png" 
                      alt="Google Drive" 
                      className="mr-2 h-4 w-4" 
                    />
                    Upload from Google Drive
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleBrandingExternalUpload('dropbox')}
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Dropbox_Icon.svg/2202px-Dropbox_Icon.svg.png" 
                      alt="Dropbox" 
                      className="mr-2 h-4 w-4" 
                    />
                    Upload from Dropbox
                  </Button>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
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
                Phone
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
                Website
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
            <Button variant="outline" onClick={() => setBrandingFormOpen(false)}>
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
            <DialogTitle>{selectedLink ? 'Edit Link' : 'Create Client-Branding Link'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="clientId" className="text-sm font-medium">
                Client
              </label>
              <Select
                value={linkFormData.clientId}
                onValueChange={(value) => setLinkFormData({...linkFormData, clientId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {accountsData
                    .filter(account => account.type === 'client')
                    .map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="brandingId" className="text-sm font-medium">
                Branding
              </label>
              <Select
                value={linkFormData.brandingId}
                onValueChange={(value) => setLinkFormData({...linkFormData, brandingId: value})}
              >
                <SelectTrigger>
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
            <Button variant="outline" onClick={() => setLinkFormOpen(false)}>
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
