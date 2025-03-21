import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageTransition } from '@/components/layout/PageTransition';
import { 
  AlertTriangleIcon,
  BellIcon, 
  CreditCardIcon, 
  Download,
  GlobeIcon, 
  KeyIcon, 
  MailIcon, 
  PaletteIcon, 
  SaveIcon, 
  SettingsIcon, 
  SmartphoneIcon, 
  Trash2,
  UserIcon 
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageUpload } from '@/components/profile/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

const profileFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const accountFormSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  language: z.string(),
  timezone: z.string(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

const securityFormSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SecurityFormValues = z.infer<typeof securityFormSchema>;

const SettingsPage = () => {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [theme, setTheme] = useState('light');
  const [sidebarCollapse, setSidebarCollapse] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);
  const [isDownloadingData, setIsDownloadingData] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailShoots: true,
    emailInvoices: true,
    emailMarketing: false,
    smsShoots: true,
    smsPayments: false
  });
  
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ')[1] || '',
      email: user?.email || '',
      phone: '',
      bio: '',
      avatar: user?.avatar || '',
    },
  });
  
  const accountForm = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      username: 'johndoe',
      language: 'en',
      timezone: 'est',
    },
  });
  
  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  
  useEffect(() => {
    if (user) {
      const nameParts = user.name.split(' ');
      profileForm.reset({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email,
        phone: profileForm.getValues('phone'),
        bio: profileForm.getValues('bio'),
        avatar: user.avatar || '',
      });
    }
  }, [user]);
  
  const handleProfileSubmit = (data: ProfileFormValues) => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
    console.log('Profile data submitted:', data);
  };
  
  const handleAccountSubmit = (data: AccountFormValues) => {
    toast({
      title: "Account Updated",
      description: "Your account settings have been saved successfully.",
    });
    console.log('Account data submitted:', data);
  };
  
  const handleSecuritySubmit = (data: SecurityFormValues) => {
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
    console.log('Security data submitted:', data);
    securityForm.reset({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };
  
  // Check the current theme on component mount
  useEffect(() => {
    // Detect current theme from document element class
    if (document.documentElement.classList.contains('dark')) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, []);
  
  // Apply theme change immediately when selection changes
  const handleThemeChange = (selectedTheme: string) => {
    setTheme(selectedTheme);
    
    // Apply theme immediately
    if (selectedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else if (selectedTheme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else if (selectedTheme === 'system') {
      // For system theme, check user's preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
      document.documentElement.classList.toggle('light', !prefersDark);
    }
  };
  
  const handleAppearanceSubmit = () => {
    toast({
      title: "Appearance Updated",
      description: "Your appearance preferences have been saved.",
    });
    console.log('Appearance settings saved:', { theme, sidebarCollapse, animations });
    
    // This ensures theme is applied when the form is saved as well
    handleThemeChange(theme);
    
    document.documentElement.classList.toggle('reduce-motion', !animations);
  };
  
  const handleNotificationsSubmit = () => {
    toast({
      title: "Notifications Updated",
      description: "Your notification preferences have been saved.",
    });
    console.log('Notification settings saved:', notificationSettings);
  };
  
  const handleAvatarChange = (url: string) => {
    profileForm.setValue('avatar', url);
  };
  
  const handleDownloadData = async () => {
    setIsDownloadingData(true);
    
    try {
      let userData: any = {
        profile: {
          name: user?.name,
          email: user?.email,
          avatar: user?.avatar,
          role: role
        },
        settings: {
          appearance: { theme, sidebarCollapse, animations },
          notifications: notificationSettings,
          account: accountForm.getValues()
        }
      };
      
      if (user?.id) {
        // Get any custom tables data - in a real app, these would be actual table names
        // const { data: shoots } = await supabase.from('shoots').select('*').eq('user_id', user.id);
        // const { data: invoices } = await supabase.from('invoices').select('*').eq('user_id', user.id);
        
        // userData.shoots = shoots || [];
        // userData.invoices = invoices || [];
      }
      
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `user_data_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Data Downloaded",
        description: "Your data has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error downloading user data:", error);
      toast({
        title: "Download Failed",
        description: "There was a problem downloading your data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDownloadingData(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    
    try {
      if (supabase.auth && user?.id) {
        // Delete user-related data first
        // await supabase.from('profiles').delete().eq('id', user.id);
        
        // Delete user account
        const { error } = await supabase.auth.admin.deleteUser(user.id);
        
        if (error) throw error;
      }
      
      setDeleteAccountDialogOpen(false);
      
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
        variant: "destructive",
      });
      
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error("Error signing out:", error);
      }
      
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error("Error deleting account:", error);
      
      toast({
        title: "Deletion Failed",
        description: "There was an error deleting your account. Please try again or contact support.",
        variant: "destructive",
      });
      
      setDeleteAccountDialogOpen(false);
    } finally {
      setIsDeletingAccount(false);
    }
  };
  
  const handleSignOutAllDevices = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) throw error;
      
      toast({
        title: "Signed Out",
        description: "You have been signed out of all devices.",
        variant: "destructive",
      });
      
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error("Error signing out from all devices:", error);
      
      toast({
        title: "Sign Out Failed",
        description: "There was an error signing out from all devices. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handle2FAToggle = (checked: boolean) => {
    if (checked) {
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been enabled.",
      });
    } else {
      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled.",
      });
    }
  };
  
  const handleRevokeSession = (deviceName: string) => {
    toast({
      title: "Session Revoked",
      description: `The session on ${deviceName} has been revoked.`,
    });
  };
  
  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6">
          <div>
            <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              Settings
            </Badge>
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          
          <Tabs defaultValue="profile" className="w-full">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="sm:w-[240px] flex-shrink-0">
                <Card className="glass-card sticky top-6">
                  <TabsList className="flex flex-col h-auto bg-transparent p-0">
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={profileForm.watch('avatar') || user?.avatar} alt={user?.name} />
                          <AvatarFallback>{user?.name?.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user?.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{role}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2 flex flex-col gap-1">
                      <TabsTrigger value="profile" className="w-full justify-start gap-2 px-3 h-10 data-[state=active]:bg-accent">
                        <UserIcon className="h-4 w-4" />
                        Profile
                      </TabsTrigger>
                      <TabsTrigger value="account" className="w-full justify-start gap-2 px-3 h-10 data-[state=active]:bg-accent">
                        <SettingsIcon className="h-4 w-4" />
                        Account
                      </TabsTrigger>
                      <TabsTrigger value="appearance" className="w-full justify-start gap-2 px-3 h-10 data-[state=active]:bg-accent">
                        <PaletteIcon className="h-4 w-4" />
                        Appearance
                      </TabsTrigger>
                      <TabsTrigger value="notifications" className="w-full justify-start gap-2 px-3 h-10 data-[state=active]:bg-accent">
                        <BellIcon className="h-4 w-4" />
                        Notifications
                      </TabsTrigger>
                      <TabsTrigger value="billing" className="w-full justify-start gap-2 px-3 h-10 data-[state=active]:bg-accent">
                        <CreditCardIcon className="h-4 w-4" />
                        Billing
                      </TabsTrigger>
                      <TabsTrigger value="security" className="w-full justify-start gap-2 px-3 h-10 data-[state=active]:bg-accent">
                        <KeyIcon className="h-4 w-4" />
                        Security
                      </TabsTrigger>
                    </div>
                  </TabsList>
                </Card>
              </div>
              
              <div className="flex-1">
                <Card className="glass-card">
                  <TabsContent value="profile" className="m-0">
                    <CardHeader>
                      <CardTitle>Profile</CardTitle>
                      <CardDescription>
                        Manage your profile information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
                          <div className="flex flex-col sm:flex-row gap-6">
                            <div className="sm:w-[120px] flex-shrink-0 flex flex-col items-center gap-2">
                              <ImageUpload 
                                onChange={handleAvatarChange} 
                                initialImage={profileForm.getValues('avatar')}
                              />
                            </div>
                            
                            <div className="flex-1 space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                  control={profileForm.control}
                                  name="firstName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>First Name</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={profileForm.control}
                                  name="lastName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Last Name</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <FormField
                                control={profileForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input {...field} type="email" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={profileForm.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                      <Input {...field} type="tel" placeholder="+1 (555) 123-4567" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={profileForm.control}
                                name="bio"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                      <Textarea {...field} placeholder="Write a short bio..." />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="flex justify-end">
                            <Button type="submit" className="gap-2">
                              <SaveIcon className="h-4 w-4" />
                              Save Changes
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </TabsContent>
                  
                  <TabsContent value="account" className="m-0">
                    <CardHeader>
                      <CardTitle>Account</CardTitle>
                      <CardDescription>
                        Manage your account settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Form {...accountForm}>
                        <form onSubmit={accountForm.handleSubmit(handleAccountSubmit)} className="space-y-6">
                          <div className="space-y-4">
                            <FormField
                              control={accountForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={accountForm.control}
                              name="language"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Language</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select language" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="en">English</SelectItem>
                                      <SelectItem value="es">Spanish</SelectItem>
                                      <SelectItem value="fr">French</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={accountForm.control}
                              name="timezone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Timezone</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select timezone" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="est">Eastern Time (ET)</SelectItem>
                                      <SelectItem value="cst">Central Time (CT)</SelectItem>
                                      <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                                      <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h3 className="font-medium mb-4">Account Management</h3>
                            <div className="space-y-4">
                              <Button 
                                variant="outline" 
                                className="w-full justify-start text-left text-muted-foreground gap-2" 
                                type="button"
                                onClick={handleDownloadData}
                                disabled={isDownloadingData}
                              >
                                <Download className="h-4 w-4" />
                                {isDownloadingData ? 'Preparing Download...' : 'Download Your Data'}
                              </Button>
                              <Button 
                                variant="outline" 
                                className="w-full justify-start text-left text-destructive border-destructive/20 gap-2" 
                                type="button"
                                onClick={() => setDeleteAccountDialogOpen(true)}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete Account
                              </Button>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="flex justify-end">
                            <Button type="submit" className="gap-2">
                              <SaveIcon className="h-4 w-4" />
                              Save Changes
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </TabsContent>
                  
                  <TabsContent value="appearance" className="m-0">
                    <CardHeader>
                      <CardTitle>Appearance</CardTitle>
                      <CardDescription>
                        Customize the look and feel of the dashboard
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="theme">Theme</Label>
                            <p className="text-sm text-muted-foreground">Select light or dark theme</p>
                          </div>
                          <Select value={theme} onValueChange={handleThemeChange}>
                            <SelectTrigger id="theme" className="w-[180px]">
                              <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="light">Light</SelectItem>
                              <SelectItem value="dark">Dark</SelectItem>
                              <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="sidebar">Sidebar</Label>
                            <p className="text-sm text-muted-foreground">Automatically collapse sidebar on small screens</p>
                          </div>
                          <Switch 
                            id="sidebar" 
                            checked={sidebarCollapse} 
                            onCheckedChange={setSidebarCollapse} 
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="animations">Animations</Label>
                            <p className="text-sm text-muted-foreground">Enable animations and transitions</p>
                          </div>
                          <Switch 
                            id="animations" 
                            checked={animations} 
                            onCheckedChange={setAnimations} 
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-end">
                        <Button className="gap-2" onClick={handleAppearanceSubmit}>
                          <SaveIcon className="h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    </CardContent>
                  </TabsContent>
                  
                  <TabsContent value="notifications" className="m-0">
                    <CardHeader>
                      <CardTitle>Notifications</CardTitle>
                      <CardDescription>
                        Manage your notification preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-medium">Email Notifications</h3>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="email-shoots">Shoot Updates</Label>
                            <p className="text-sm text-muted-foreground">Receive notifications about shoot updates</p>
                          </div>
                          <Switch 
                            id="email-shoots" 
                            checked={notificationSettings.emailShoots}
                            onCheckedChange={(checked) => setNotificationSettings({
                              ...notificationSettings,
                              emailShoots: checked
                            })}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="email-invoices">Invoice & Payments</Label>
                            <p className="text-sm text-muted-foreground">Receive notifications about invoices and payments</p>
                          </div>
                          <Switch 
                            id="email-invoices" 
                            checked={notificationSettings.emailInvoices}
                            onCheckedChange={(checked) => setNotificationSettings({
                              ...notificationSettings,
                              emailInvoices: checked
                            })}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="email-marketing">Marketing & Updates</Label>
                            <p className="text-sm text-muted-foreground">Receive marketing emails and platform updates</p>
                          </div>
                          <Switch 
                            id="email-marketing" 
                            checked={notificationSettings.emailMarketing}
                            onCheckedChange={(checked) => setNotificationSettings({
                              ...notificationSettings,
                              emailMarketing: checked
                            })}
                          />
                        </div>
                        
                        <Separator />
                        
                        <h3 className="font-medium">SMS Notifications</h3>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="sms-shoots">Shoot Reminders</Label>
                            <p className="text-sm text-muted-foreground">Receive SMS reminders about upcoming shoots</p>
                          </div>
                          <Switch 
                            id="sms-shoots" 
                            checked={notificationSettings.smsShoots}
                            onCheckedChange={(checked) => setNotificationSettings({
                              ...notificationSettings,
                              smsShoots: checked
                            })}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="sms-payments">Payment Confirmations</Label>
                            <p className="text-sm text-muted-foreground">Receive SMS notifications for payment confirmations</p>
                          </div>
                          <Switch 
                            id="sms-payments" 
                            checked={notificationSettings.smsPayments}
                            onCheckedChange={(checked) => setNotificationSettings({
                              ...notificationSettings,
                              smsPayments: checked
                            })}
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-end">
                        <Button className="gap-2" onClick={handleNotificationsSubmit}>
                          <SaveIcon className="h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    </CardContent>
                  </TabsContent>
                  
                  <TabsContent value="billing" className="m-0">
                    <CardHeader>
                      <CardTitle>Billing</CardTitle>
                      <CardDescription>
                        Manage your billing information and subscription
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-medium">Current Plan</h3>
                        
                        <Card className="bg-primary/5 border-primary/20">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <Badge>Premium</Badge>
                                <h3 className="font-medium text-lg mt-2">Premium Plan</h3>
                                <p className="text-sm text-muted-foreground">$49.99/month</p>
                              </div>
                              <Button variant="outline">Change Plan</Button>
                            </div>
                            <p className="text-sm mt-4">Your next billing date is <strong>June 15, 2023</strong></p>
                          </CardContent>
                        </Card>
                        
                        <Separator />
                        
                        <h3 className="font-medium">Payment Method</h3>
                        
                        <div className="p-4 border rounded-md border-border flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                              <CreditCardIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">•••• •••• •••• 4242</p>
                              <p className="text-sm text-muted-foreground">Expires 12/24</p>
                            </div>
                          </div>
                          <Button variant="outline">Update</Button>
                        </div>
                        
                        <Separator />
                        
                        <h3 className="font-medium">Billing Address</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="billing-name">Name</Label>
                            <Input id="billing-name" defaultValue="John Doe" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="billing-company">Company (Optional)</Label>
                            <Input id="billing-company" defaultValue="ABC Properties" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="billing-address">Address</Label>
                            <Input id="billing-address" defaultValue="123 Main Street" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="billing-city">City</Label>
                            <Input id="billing-city" defaultValue="Anytown" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="billing-state">State</Label>
                            <Input id="billing-state" defaultValue="MD" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="billing-zip">ZIP</Label>
                            <Input id="billing-zip" defaultValue="12345" />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-end">
                        <Button className="gap-2" onClick={() => {
                          toast({
                            title: "Billing Information Updated",
                            description: "Your billing information has been saved.",
                          });
                        }}>
                          <SaveIcon className="h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    </CardContent>
                  </TabsContent>
                  
                  <TabsContent value="security" className="m-0">
                    <CardHeader>
                      <CardTitle>Security</CardTitle>
                      <CardDescription>
                        Manage your security settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Form {...securityForm}>
                        <form onSubmit={securityForm.handleSubmit(handleSecuritySubmit)} className="space-y-6">
                          <div className="space-y-4">
                            <h3 className="font-medium">Change Password</h3>
                            
                            <div className="space-y-4">
                              <FormField
                                control={securityForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl>
                                      <Input {...field} type="password" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={securityForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                      <Input {...field} type="password" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={securityForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
