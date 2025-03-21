
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageUpload } from "@/components/profile/ImageUpload"
import { 
  CameraIcon, 
  DownloadIcon, 
  SaveIcon, 
  TrashIcon, 
  MoonIcon, 
  SunIcon, 
  MonitorIcon,
  LayoutIcon,
  SlidersHorizontal,
  BellIcon,
  UserCircleIcon,
  KeyIcon,
  UserIcon,
  PanelLeftIcon
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { supabase } from '@/integrations/supabase/client';

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const accountFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const securityFormSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const SettingsPage = () => {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  const [sidebarCollapse, setSidebarCollapse] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapse');
    return saved ? saved === 'true' : true;
  });
  const [animations, setAnimations] = useState(() => {
    const saved = localStorage.getItem('animations');
    return saved ? saved === 'true' : true;
  });
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);
  const [isDownloadingData, setIsDownloadingData] = useState(false);
  
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const [profilePicture, setProfilePicture] = useState<string | null>(user?.avatar || null);

  const defaultUsername = user?.name?.toLowerCase().replace(/\s+/g, '.') || '';

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const accountForm = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      username: defaultUsername,
    },
  });

  const securityForm = useForm<z.infer<typeof securityFormSchema>>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      applyTheme(storedTheme);
    }
  }, []);

  const applyTheme = (selectedTheme: string) => {
    document.documentElement.classList.remove('dark', 'light');
    
    if (selectedTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.add(systemTheme);
    } else {
      document.documentElement.classList.add(selectedTheme);
    }
  };
  
  const handleProfileSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated.",
      });
      console.log('Profile settings saved:', values);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    }
  };

  const handleAccountSubmit = async (values: z.infer<typeof accountFormSchema>) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Account Updated",
        description: "Your account settings have been updated.",
      });
      console.log('Account settings saved:', values);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update account. Please try again.",
      });
    }
  };

  const handleSecuritySubmit = async (values: z.infer<typeof securityFormSchema>) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Security Updated",
        description: "Your security settings have been updated.",
      });
      console.log('Security settings saved:', values);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update security settings. Please try again.",
      });
    }
  };
  
  const handleAppearanceSubmit = () => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('sidebarCollapse', sidebarCollapse.toString());
    localStorage.setItem('animations', animations.toString());
    
    applyTheme(theme);
    
    document.documentElement.classList.toggle('reduce-motion', !animations);
    
    toast({
      title: "Appearance Updated",
      description: "Your appearance preferences have been saved.",
    });
    console.log('Appearance settings saved:', { theme, sidebarCollapse, animations });
  };
  
  const handleNotificationSubmit = () => {
    toast({
      title: "Notifications Updated",
      description: "Your notification preferences have been saved.",
    });
    console.log('Notification settings saved:', { isNotificationEnabled });
  };

  const handleAvatarChange = (url: string) => {
    setProfilePicture(url);
    toast({
      title: "Avatar Updated",
      description: "Your profile picture has been updated.",
    });
    console.log('Avatar URL:', url);
  };

  const handleDownloadData = async () => {
    setIsDownloadingData(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const userData = JSON.stringify({
        name: user?.name,
        email: user?.email,
        role: role,
        avatar: profilePicture,
      }, null, 2);
      
      const blob = new Blob([userData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'user-data.json';
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Complete",
        description: "Your data has been downloaded.",
      });
      console.log('Data download completed');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download data. Please try again.",
      });
    } finally {
      setIsDownloadingData(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
      });
      console.log('Account deletion completed');
      
      window.location.href = '/';
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete account. Please try again.",
      });
    } finally {
      setDeleteAccountDialogOpen(false);
    }
  };

  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);
  
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <SunIcon className="h-5 w-5 text-amber-500" />;
      case 'dark':
        return <MoonIcon className="h-5 w-5 text-indigo-400" />;
      case 'system':
        return <MonitorIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <SunIcon className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="container relative pb-10">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 space-y-4">
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="profile" orientation="vertical" className="w-full">
                  <TabsList className="flex flex-col items-stretch h-auto bg-transparent space-y-1 p-2">
                    <TabsTrigger value="profile" className="justify-start gap-2 py-2">
                      <UserCircleIcon className="h-4 w-4" />
                      <span>Profile</span>
                    </TabsTrigger>
                    <TabsTrigger value="account" className="justify-start gap-2 py-2">
                      <UserIcon className="h-4 w-4" />
                      <span>Account</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="justify-start gap-2 py-2">
                      <KeyIcon className="h-4 w-4" />
                      <span>Security</span>
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="justify-start gap-2 py-2">
                      <LayoutIcon className="h-4 w-4" />
                      <span>Appearance</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="justify-start gap-2 py-2">
                      <BellIcon className="h-4 w-4" />
                      <span>Notifications</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
              <CardFooter className="p-3 border-t flex flex-col items-start gap-3">
                <div className="flex items-center text-sm text-muted-foreground w-full">
                  <div className="flex items-center gap-2">
                    {getThemeIcon()}
                    <span className="capitalize">{theme} mode</span>
                  </div>
                </div>
                <div className="flex justify-between w-full gap-2">
                  <Button 
                    variant="outline" 
                    disabled={isDownloadingData} 
                    onClick={handleDownloadData}
                    size="sm"
                    className="w-full"
                  >
                    <DownloadIcon className="h-3.5 w-3.5 mr-2" />
                    Export Data
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="w-full">
                        <TrashIcon className="h-3.5 w-3.5 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account
                          and remove your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1">
            <Tabs defaultValue="profile" className="w-full h-full">
              {/* Profile Tab */}
              <TabsContent value="profile" className="mt-0 h-full">
                <Card className="glass-card h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCircleIcon className="h-5 w-5 text-primary" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal information and public profile.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                      <div className="flex flex-col items-center space-y-2">
                        <ImageUpload 
                          onChange={handleAvatarChange} 
                          initialImage={profilePicture || user?.avatar} 
                        />
                        <span className="text-sm text-muted-foreground">Profile Photo</span>
                      </div>
                      <div className="flex-1 w-full">
                        <Form {...profileForm}>
                          <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
                            <FormField
                              control={profileForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your Name" {...field} />
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
                                  <FormLabel>Email Address</FormLabel>
                                  <FormControl>
                                    <Input placeholder="your-email@example.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" className="gap-2">
                              <SaveIcon className="h-4 w-4" />
                              Save Changes
                            </Button>
                          </form>
                        </Form>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Account Tab */}
              <TabsContent value="account" className="mt-0 h-full">
                <Card className="glass-card h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserIcon className="h-5 w-5 text-primary" />
                      Account Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your account preferences and identity.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...accountForm}>
                      <form onSubmit={accountForm.handleSubmit(handleAccountSubmit)} className="space-y-4">
                        <FormField
                          control={accountForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <div className="flex items-center">
                                  <span className="text-muted-foreground mr-1">@</span>
                                  <Input placeholder="username" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="gap-2">
                          <SaveIcon className="h-4 w-4" />
                          Save Changes
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Security Tab */}
              <TabsContent value="security" className="mt-0 h-full">
                <Card className="glass-card h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <KeyIcon className="h-5 w-5 text-primary" />
                      Security
                    </CardTitle>
                    <CardDescription>
                      Manage your password and security settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...securityForm}>
                      <form onSubmit={securityForm.handleSubmit(handleSecuritySubmit)} className="space-y-4">
                        <FormField
                          control={securityForm.control}
                          name="password"
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
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="gap-2">
                          <SaveIcon className="h-4 w-4" />
                          Update Password
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Appearance Tab */}
              <TabsContent value="appearance" className="mt-0 h-full">
                <Card className="glass-card h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LayoutIcon className="h-5 w-5 text-primary" />
                      Appearance
                    </CardTitle>
                    <CardDescription>
                      Customize the look and feel of the dashboard.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="theme" className="text-base">Theme</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <div
                            className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer hover:bg-accent ${theme === 'light' ? 'border-primary' : 'border-accent'}`}
                            onClick={() => setTheme('light')}
                          >
                            <SunIcon className="h-6 w-6 mb-2 text-amber-500" />
                            <span className="text-sm font-medium">Light</span>
                          </div>
                          
                          <div
                            className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer hover:bg-accent ${theme === 'dark' ? 'border-primary' : 'border-accent'}`}
                            onClick={() => setTheme('dark')}
                          >
                            <MoonIcon className="h-6 w-6 mb-2 text-indigo-400" />
                            <span className="text-sm font-medium">Dark</span>
                          </div>
                          
                          <div
                            className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer hover:bg-accent ${theme === 'system' ? 'border-primary' : 'border-accent'}`}
                            onClick={() => setTheme('system')}
                          >
                            <MonitorIcon className="h-6 w-6 mb-2 text-gray-500" />
                            <span className="text-sm font-medium">System</span>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex flex-col space-y-2">
                        <Label className="text-base">Sidebar</Label>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="sidebar" className="text-sm font-normal">Auto Collapse</Label>
                            <p className="text-xs text-muted-foreground">
                              Automatically collapse sidebar on small screens
                            </p>
                          </div>
                          <Switch 
                            id="sidebar" 
                            checked={sidebarCollapse} 
                            onCheckedChange={(checked) => {
                              setSidebarCollapse(checked);
                            }} 
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex flex-col space-y-2">
                        <Label className="text-base">Animations</Label>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="animations" className="text-sm font-normal">Enable Animations</Label>
                            <p className="text-xs text-muted-foreground">
                              Toggle animations and transitions
                            </p>
                          </div>
                          <Switch 
                            id="animations" 
                            checked={animations} 
                            onCheckedChange={(checked) => {
                              setAnimations(checked);
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleAppearanceSubmit} className="gap-2">
                        <SaveIcon className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Notifications Tab */}
              <TabsContent value="notifications" className="mt-0 h-full">
                <Card className="glass-card h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BellIcon className="h-5 w-5 text-primary" />
                      Notifications
                    </CardTitle>
                    <CardDescription>
                      Manage how you receive notifications.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">
                              Push Notifications
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Receive notifications about important updates and events.
                            </p>
                          </div>
                          <Switch 
                            id="notifications" 
                            checked={isNotificationEnabled} 
                            onCheckedChange={setIsNotificationEnabled} 
                          />
                        </div>
                      </div>
                      
                      <Button onClick={handleNotificationSubmit} className="gap-2">
                        <SaveIcon className="h-4 w-4" />
                        Save Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
