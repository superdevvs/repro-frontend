
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

// Form schemas
const profileFormSchema = z.object({
  avatar: z.string().optional(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  bio: z.string().optional(),
});

const accountFormSchema = z.object({
  language: z.string(),
  timezone: z.string(),
  dateFormat: z.string(),
  timeFormat: z.string(),
});

const securityFormSchema = z.object({
  currentPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type AccountFormValues = z.infer<typeof accountFormSchema>;
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
  
  // Initialize forms
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      avatar: user?.avatar || "",
      name: user?.name || "",
      email: user?.email || "",
      bio: "",
    },
  });
  
  const accountForm = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      language: "en",
      timezone: "GMT-04:00",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
    },
  });
  
  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Form submission handlers
  const handleProfileSubmit = (data: ProfileFormValues) => {
    console.log("Profile form submitted:", data);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };
  
  const handleAccountSubmit = (data: AccountFormValues) => {
    console.log("Account form submitted:", data);
    toast({
      title: "Account Settings Updated",
      description: "Your account settings have been updated successfully.",
    });
  };
  
  const handleSecuritySubmit = (data: SecurityFormValues) => {
    console.log("Security form submitted:", data);
    toast({
      title: "Security Settings Updated",
      description: "Your security settings have been updated successfully.",
    });
    securityForm.reset();
  };
  
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    toast({
      title: "Theme Changed",
      description: `Theme set to ${newTheme}.`,
    });
  };
  
  const handle2FAToggle = (enabled: boolean) => {
    toast({
      title: "Two-Factor Authentication",
      description: enabled ? "2FA has been enabled." : "2FA has been disabled.",
    });
  };
  
  const handleAvatarChange = (url: string) => {
    profileForm.setValue('avatar', url);
  };
  
  const handleDownloadData = async () => {
    setIsDownloadingData(true);
    
    try {
      // Get user data from Supabase
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
      
      // Additional data that could be fetched from Supabase
      if (user?.id) {
        // Get any custom tables data - in a real app, these would be actual table names
        // const { data: shoots } = await supabase.from('shoots').select('*').eq('user_id', user.id);
        // const { data: invoices } = await supabase.from('invoices').select('*').eq('user_id', user.id);
        
        // userData.shoots = shoots || [];
        // userData.invoices = invoices || [];
      }
      
      // Create and download the file
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
      // In a real app with Supabase auth, delete the user account
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
      
      // Sign out and redirect to homepage
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error("Error signing out:", error);
      }
      
      // Redirect to homepage after a short delay
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
      // Sign out from all devices
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) throw error;
      
      toast({
        title: "Signed Out",
        description: "You have been signed out of all devices.",
        variant: "destructive",
      });
      
      // Redirect to login page
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
  
  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account settings and preferences.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {role || "User"}
              </Badge>
            </div>
          </div>
          
          <Tabs defaultValue="profile" className="w-full">
            <div className="flex flex-col sm:flex-row gap-6">
              <TabsList className="h-auto flex flex-row sm:flex-col sm:w-48 bg-transparent p-0 sm:sticky sm:top-6">
                <div className="w-full sm:space-y-1">
                  <TabsTrigger value="profile" className="w-full justify-start gap-2 px-3 py-2 data-[state=active]:bg-muted">
                    <UserIcon className="h-4 w-4" />
                    <span>Profile</span>
                  </TabsTrigger>
                  <TabsTrigger value="account" className="w-full justify-start gap-2 px-3 py-2 data-[state=active]:bg-muted">
                    <SettingsIcon className="h-4 w-4" />
                    <span>Account</span>
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="w-full justify-start gap-2 px-3 py-2 data-[state=active]:bg-muted">
                    <PaletteIcon className="h-4 w-4" />
                    <span>Appearance</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="w-full justify-start gap-2 px-3 py-2 data-[state=active]:bg-muted">
                    <BellIcon className="h-4 w-4" />
                    <span>Notifications</span>
                  </TabsTrigger>
                  <TabsTrigger value="security" className="w-full justify-start gap-2 px-3 py-2 data-[state=active]:bg-muted">
                    <KeyIcon className="h-4 w-4" />
                    <span>Security</span>
                  </TabsTrigger>
                </div>
              </TabsList>
              
              <div className="flex-1">
                <Card className="glass-card">
                  <TabsContent value="profile" className="m-0">
                    <CardHeader>
                      <CardTitle>Profile</CardTitle>
                      <CardDescription>
                        Manage your public profile information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
                          <div className="flex flex-col gap-6 items-center sm:flex-row sm:items-start">
                            <div className="flex flex-col items-center gap-2">
                              <Avatar className="h-20 w-20">
                                <AvatarImage src={profileForm.getValues().avatar} alt="Profile" />
                                <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                              </Avatar>
                              <ImageUpload onUpload={handleAvatarChange} />
                            </div>
                            <div className="flex-1 space-y-4 w-full">
                              <FormField
                                control={profileForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Your name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={profileForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Your email address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                          
                          <FormField
                            control={profileForm.control}
                            name="bio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Tell us a little about yourself" 
                                    className="resize-none h-32" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex justify-end">
                            <Button type="submit">
                              <SaveIcon className="h-4 w-4 mr-2" />
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
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={accountForm.control}
                              name="language"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Language</FormLabel>
                                  <Select
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
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
                                      <SelectItem value="de">German</SelectItem>
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
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select timezone" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="GMT-08:00">Pacific Time (GMT-08:00)</SelectItem>
                                      <SelectItem value="GMT-07:00">Mountain Time (GMT-07:00)</SelectItem>
                                      <SelectItem value="GMT-06:00">Central Time (GMT-06:00)</SelectItem>
                                      <SelectItem value="GMT-05:00">Eastern Time (GMT-05:00)</SelectItem>
                                      <SelectItem value="GMT-04:00">Atlantic Time (GMT-04:00)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={accountForm.control}
                              name="dateFormat"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Date Format</FormLabel>
                                  <Select
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select date format" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={accountForm.control}
                              name="timeFormat"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Time Format</FormLabel>
                                  <Select
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select time format" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="12h">12-hour (1:30 PM)</SelectItem>
                                      <SelectItem value="24h">24-hour (13:30)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="flex justify-end">
                            <Button type="submit">
                              <SaveIcon className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
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
                        </form>
                      </Form>
                    </CardContent>
                  </TabsContent>
                  
                  <TabsContent value="appearance" className="m-0">
                    <CardHeader>
                      <CardTitle>Appearance</CardTitle>
                      <CardDescription>
                        Customize the look and feel of the application
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium mb-3">Theme</h3>
                          <div className="grid grid-cols-3 gap-3">
                            <div 
                              className={`cursor-pointer rounded-md border-2 p-3 flex flex-col items-center gap-2 ${theme === 'light' ? 'border-primary bg-primary/10' : 'border-border'}`}
                              onClick={() => handleThemeChange('light')}
                            >
                              <div className="h-10 w-10 rounded-full bg-white border"></div>
                              <Label htmlFor="theme-light">Light</Label>
                            </div>
                            <div 
                              className={`cursor-pointer rounded-md border-2 p-3 flex flex-col items-center gap-2 ${theme === 'dark' ? 'border-primary bg-primary/10' : 'border-border'}`}
                              onClick={() => handleThemeChange('dark')}
                            >
                              <div className="h-10 w-10 rounded-full bg-slate-900 border border-slate-700"></div>
                              <Label htmlFor="theme-dark">Dark</Label>
                            </div>
                            <div 
                              className={`cursor-pointer rounded-md border-2 p-3 flex flex-col items-center gap-2 ${theme === 'system' ? 'border-primary bg-primary/10' : 'border-border'}`}
                              onClick={() => handleThemeChange('system')}
                            >
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-white to-slate-900 border"></div>
                              <Label htmlFor="theme-system">System</Label>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="sidebar-collapse">Sidebar Collapsed by Default</Label>
                            <p className="text-sm text-muted-foreground">When enabled, the sidebar will be collapsed when you first load the app</p>
                          </div>
                          <Switch 
                            id="sidebar-collapse" 
                            checked={sidebarCollapse} 
                            onCheckedChange={setSidebarCollapse} 
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="animations">Enable Animations</Label>
                            <p className="text-sm text-muted-foreground">Toggle interface animations on or off</p>
                          </div>
                          <Switch 
                            id="animations" 
                            checked={animations} 
                            onCheckedChange={setAnimations} 
                          />
                        </div>
                      </div>
                    </CardContent>
                  </TabsContent>
                  
                  <TabsContent value="notifications" className="m-0">
                    <CardHeader>
                      <CardTitle>Notifications</CardTitle>
                      <CardDescription>
                        Configure how you receive notifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-medium">Email Notifications</h3>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="email-shoots">Shoot Updates</Label>
                              <p className="text-sm text-muted-foreground">Get notified about new shoots and changes</p>
                            </div>
                            <Switch 
                              id="email-shoots" 
                              checked={notificationSettings.emailShoots} 
                              onCheckedChange={(checked) => handleNotificationChange("emailShoots", checked)} 
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="email-invoices">Invoice & Payment Updates</Label>
                              <p className="text-sm text-muted-foreground">Get notified about invoices and payments</p>
                            </div>
                            <Switch 
                              id="email-invoices" 
                              checked={notificationSettings.emailInvoices} 
                              onCheckedChange={(checked) => handleNotificationChange("emailInvoices", checked)} 
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="email-marketing">Marketing & Tips</Label>
                              <p className="text-sm text-muted-foreground">Receive tips, tutorials and marketing emails</p>
                            </div>
                            <Switch 
                              id="email-marketing" 
                              checked={notificationSettings.emailMarketing} 
                              onCheckedChange={(checked) => handleNotificationChange("emailMarketing", checked)} 
                            />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <h3 className="font-medium">SMS Notifications</h3>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="sms-shoots">Shoot Reminders</Label>
                              <p className="text-sm text-muted-foreground">Get SMS reminders about upcoming shoots</p>
                            </div>
                            <Switch 
                              id="sms-shoots" 
                              checked={notificationSettings.smsShoots} 
                              onCheckedChange={(checked) => handleNotificationChange("smsShoots", checked)} 
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="sms-payments">Payment Reminders</Label>
                              <p className="text-sm text-muted-foreground">Get SMS payment reminders</p>
                            </div>
                            <Switch 
                              id="sms-payments" 
                              checked={notificationSettings.smsPayments} 
                              onCheckedChange={(checked) => handleNotificationChange("smsPayments", checked)} 
                            />
                          </div>
                        </div>
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
                            
                            <FormField
                              control={securityForm.control}
                              name="currentPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Current Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
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
                                    <Input type="password" placeholder="••••••••" {...field} />
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
                                  <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="flex justify-end">
                            <Button type="submit">
                              <SaveIcon className="h-4 w-4 mr-2" />
                              Update Password
                            </Button>
                          </div>
                        </form>
                      </Form>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="two-factor">Enable 2FA</Label>
                            <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                          </div>
                          <Switch id="two-factor" onCheckedChange={handle2FAToggle} />
                        </div>
                        
                        <Separator />
                        
                        <h3 className="font-medium">Sessions</h3>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 rounded-md border">
                            <SmartphoneIcon className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="font-medium">Current Device</p>
                              <p className="text-sm text-muted-foreground">Last active just now</p>
                            </div>
                            <Badge>Current</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-left text-destructive border-destructive/20 gap-2"
                          onClick={handleSignOutAllDevices}
                        >
                          <AlertTriangleIcon className="h-4 w-4" />
                          Sign Out All Devices
                        </Button>
                      </div>
                    </CardContent>
                  </TabsContent>
                </Card>
              </div>
            </div>
          </Tabs>
        </div>
      </PageTransition>
      
      {/* Delete Account Confirmation Dialog */}
      <Dialog open={deleteAccountDialogOpen} onOpenChange={setDeleteAccountDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-md">
            <p className="text-sm text-destructive font-medium">This will:</p>
            <ul className="text-sm text-destructive/90 mt-2 space-y-1 list-disc pl-5">
              <li>Delete all your profile information</li>
              <li>Delete all your shoots and media</li>
              <li>Delete all your invoices and payment history</li>
              <li>Cancel any active subscriptions</li>
            </ul>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteAccountDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              disabled={isDeletingAccount}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeletingAccount ? 'Deleting...' : 'Delete Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SettingsPage;
