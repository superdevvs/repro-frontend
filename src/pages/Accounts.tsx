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
    phone: '(555) 123-4567',
    company: 'ABC Properties',
    type: 'photographer',
    shootsCount: 124,
    status: 'active',
    avatar: 'https://ui.shadcn.com/avatars/01.png',
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
    avatar: 'https://ui.shadcn.com/avatars/02.png',
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
    avatar: 'https://ui.shadcn.com/avatars/03.png',
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for accounts tab
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [accountFormOpen, setAccountFormOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [accountFormData, setAccountFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    type: 'client',
    password: '',
    confirmPassword: '',
    avatar: '',
  });
  
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
      (account.company && account.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
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
    
    if (selectedAccount) {
      // Update existing account
      const updatedAccountsData = accountsData.map(account => 
        account.id === selectedAccount.id 
          ? { 
              ...account, 
              name: accountFormData.name,
              email: accountFormData.email,
              phone: accountFormData.phone,
              company: accountFormData.company,
              type: accountFormData.type,
              avatar: accountFormData.avatar,
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
        phone: accountFormData.phone,
        company: accountFormData.company,
        type: accountFormData.type,
        shootsCount: 0,
        status: 'active',
        avatar: accountFormData.avatar,
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
      phone: account.phone || '',
      company: account.company || '',
      type: account.type,
      password: '',
      confirmPassword: '',
      avatar: account.avatar || '',
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
  
  // Export data - updated with actual functionality
  const handleExport = (format: 'print' | 'csv' | 'copy', dataType: 'accounts' | 'branding' | 'links' = 'accounts') => {
    let dataToExport: any[] = [];
    let fileName = '';
    
    // Determine which data to export based on the tab
    switch (dataType) {
      case 'accounts':
        dataToExport = filteredAccounts;
        fileName = 'accounts';
        break;
      case 'branding':
        dataToExport = filteredBrandingInfo;
        fileName = 'branding-info';
        break;
      case 'links':
        dataToExport = clientBrandingLinks;
        fileName = 'client-branding-links';
        break;
    }
    
    switch (format) {
      case 'print':
        // Open a new window with formatted data for printing
        const printWindow = window.open('', '_blank');
        
        if (printWindow) {
          // Create a table for printing
          let tableHTML = '<html><head><title>Print</title>';
          tableHTML += '<style>body { font-family: Arial, sans-serif; } table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; } th { background-color: #f2f2f2; }</style>';
          tableHTML += '</head><body>';
          
          if (dataType === 'accounts') {
            tableHTML += '<h1>Accounts</h1><table><tr><th>Name</th><th>Email</th><th>Phone</th><th>Company</th><th>Type</th><th>Status</th></tr>';
            dataToExport.forEach(account => {
              tableHTML += `<tr><td>${account.name}</td><td>${account.email}</td><td>${account.phone || ''}</td><td>${account.company || ''}</td><td>${account.type}</td><td>${account.status}</td></tr>`;
            });
          } else if (dataType === 'branding') {
            tableHTML += '<h1>Tour Branding Info</h1><table><tr><th>Name</th><th>Company Name</th><th>Phone</th><th>Website</th></tr>';
            dataToExport.forEach(branding => {
              tableHTML += `<tr><td>${branding.name}</td><td>${branding.companyName}</td><td>${branding.phone}</td><td>${branding.website}</td></tr>`;
            });
          } else {
            tableHTML += '<h1>Client Branding Links</h1><table><tr><th>Client</th><th>Client Company</th><th>Branding</th></tr>';
            dataToExport.forEach(link => {
              tableHTML += `<tr><td>${link.clientName}</td><td>${link.companyName}</td><td>${link.brandingName}</td></tr>`;
            });
          }
          
          tableHTML += '</table></body></html>';
          
          printWindow.document.open();
          printWindow.document.write(tableHTML);
          printWindow.document.close();
          
          // Print after the content is loaded
          printWindow.onload = function() {
            printWindow.print();
          };
        }
        
        toast({
          title: 'Print',
          description: 'Preparing document for printing...',
        });
        break;
        
      case 'csv':
        // Convert data to CSV format
        let csvContent = '';
        
        if (dataType === 'accounts') {
          csvContent = 'Name,Email,Phone,Company,Type,Status,Shoots\r\n';
          dataToExport.forEach(account => {
            const row = [
              `"${account.name}"`,
              `"${account.email}"`,
              `"${account.phone || ''}"`,
              `"${account.company || ''}"`,
              `"${account.type}"`,
              `"${account.status}"`,
              `"${account.shootsCount}"`
            ].join(',');
            csvContent += row + '\r\n';
          });
        } else if (dataType === 'branding') {
          csvContent = 'Name,Company Name,Phone,Website\r\n';
          dataToExport.forEach(branding => {
            const row = [
              `"${branding.name}"`,
              `"${branding.companyName}"`,
              `"${branding.phone}"`,
              `"${branding.website}"`
            ].join(',');
            csvContent += row + '\r\n';
          });
        } else {
          csvContent = 'Client,Client Company,Branding\r\n';
          dataToExport.forEach(link => {
            const row = [
              `"${link.clientName}"`,
              `"${link.companyName}"`,
              `"${link.brandingName}"`
            ].join(',');
            csvContent += row + '\r\n';
          });
        }
        
        // Create a download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${fileName}-${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: 'CSV Export',
          description: `Exporting data to ${fileName}.csv...`,
        });
        break;
        
      case 'copy':
        // Copy formatted data to clipboard
        let textToCopy = '';
        
        if (dataType === 'accounts') {
          textToCopy = 'Name\tEmail\tPhone\tCompany\tType\tStatus\tShoots\n';
          dataToExport.forEach(account => {
            textToCopy += `${account.name}\t${account.email}\t${account.phone || ''}\t${account.company || ''}\t${account.type}\t${account.status}\t${account.shootsCount}\n`;
          });
        } else if (dataType === 'branding') {
          textToCopy = 'Name\tCompany Name\tPhone\tWebsite\n';
          dataToExport.forEach(branding => {
            textToCopy += `${branding.name}\t${branding.companyName}\t${branding.phone}\t${branding.website}\n`;
          });
        } else {
          textToCopy = 'Client\tClient Company\tBranding\n';
          dataToExport.forEach(link => {
            textToCopy += `${link.clientName}\t${link.companyName}\t${link.brandingName}\n`;
          });
        }
        
        navigator.clipboard.writeText(textToCopy).then(() => {
          toast({
            title: 'Copied',
            description: 'Data copied to clipboard.',
          });
        }, (err) => {
          console.error('Could not copy text: ', err);
          toast({
            title: 'Error',
            description: 'Failed to copy data to clipboard.',
            variant: 'destructive',
          });
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
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    {account.avatar ? (
                                      <AvatarImage src={account.avatar} alt={account.name} />
                                    ) : (
                                      <AvatarFallback>
                                        {account.name.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    )}
                                  </Avatar>
                                  {account.name}
                                </div>
                              </TableCell>
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
                          <
