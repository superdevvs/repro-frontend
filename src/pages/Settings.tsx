import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { CameraIcon, DownloadIcon, SaveIcon, TrashIcon } from 'lucide-react';
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
  path: ["confirmPassword"], // path of error
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
  
  return (
    <div className="container relative pb-10">
      <div className="mx-auto w-full max-w-2xl lg:max-w-none">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-10">
              <Card>
                <CardHeader>
                  <CardTitle>Public profile</CardTitle>
                  <CardDescription>
                    Share a bit about yourself on your profile.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center justify-center">
                    <ImageUpload onChange={handleAvatarChange} initialImage={profilePicture || user?.avatar} />
                  </div>
                  <div className="grid gap-2">
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
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
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="your-email@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="gap-2">
                          <SaveIcon className="h-4 w-4" />
                          Save changes
                        </Button>
                      </form>
                    </Form>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account settings</CardTitle>
                <CardDescription>
                  Manage your account settings. Set your preferred username.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form {...accountForm}>
                  <form onSubmit={accountForm.handleSubmit(handleAccountSubmit)} className="space-y-4">
                    <FormField
                      control={accountForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="gap-2">
                      <SaveIcon className="h-4 w-4" />
                      Save changes
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form {...securityForm}>
                  <form onSubmit={securityForm.handleSubmit(handleSecuritySubmit)} className="space-y-4">
                    <FormField
                      control={securityForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Password" {...field} />
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
                            <Input type="password" placeholder="Confirm Password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="gap-2">
                      <SaveIcon className="h-4 w-4" />
                      Save changes
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
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
                  <Select value={theme} onValueChange={(value) => {
                    setTheme(value);
                    applyTheme(value);
                  }}>
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
                    onCheckedChange={(checked) => {
                      setSidebarCollapse(checked);
                      localStorage.setItem('sidebarCollapse', checked.toString());
                    }} 
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
                    onCheckedChange={(checked) => {
                      setAnimations(checked);
                      document.documentElement.classList.toggle('reduce-motion', !checked);
                      localStorage.setItem('animations', checked.toString());
                    }} 
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
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Customize your notification settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-md border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium leading-none">
                      Enable Notifications
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Allow us to send you notifications.
                    </p>
                  </div>
                  <Switch id="notifications" checked={isNotificationEnabled} onCheckedChange={setIsNotificationEnabled} />
                </div>
                <Button onClick={handleNotificationSubmit}>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <Separator className="my-4" />
        <div className="flex justify-between">
          <Button variant="outline" disabled={isDownloadingData} onClick={handleDownloadData} className="gap-2">
            {isDownloadingData ? (
              <>
                Downloading...
              </>
            ) : (
              <>
                <DownloadIcon className="h-4 w-4" />
                Download Data
              </>
            )}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <TrashIcon className="h-4 w-4" />
                Delete Account
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
      </div>
    </div>
  );
};

export default SettingsPage;
