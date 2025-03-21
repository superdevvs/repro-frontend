
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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";

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

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  const [animations, setAnimations] = useState(() => {
    const saved = localStorage.getItem('animations');
    return saved ? saved === 'true' : true;
  });
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);
  const [isDownloadingData, setIsDownloadingData] = useState(false);
  
  // Create a default username from the user's name
  const defaultUsername = user?.name ? user.name.toLowerCase().replace(/\s+/g, '.') : '';

  const profileForm = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const accountForm = useForm({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      username: defaultUsername,
    },
  });

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      applyTheme(storedTheme);
    }
  }, []);

  const applyTheme = (selectedTheme) => {
    document.documentElement.classList.remove('dark', 'light');
    
    if (selectedTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.add(systemTheme);
    } else {
      document.documentElement.classList.add(selectedTheme);
    }
  };
  
  const handleProfileSubmit = async (values) => {
    try {
      // Simulate API call
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

  const handleAccountSubmit = async (values) => {
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

  const handleAppearanceSubmit = () => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('animations', animations.toString());
    
    applyTheme(theme);
    
    document.documentElement.classList.toggle('reduce-motion', !animations);
    
    toast({
      title: "Appearance Updated",
      description: "Your appearance preferences have been saved.",
    });
    console.log('Appearance settings saved:', { theme, animations });
  };

  const handleDownloadData = async () => {
    setIsDownloadingData(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const userData = JSON.stringify({
        name: user?.name,
        email: user?.email,
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
  
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <div className="space-y-8">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
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
                          <Input placeholder="your-email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit">Save Profile</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {/* Account Section */}
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Manage your account settings
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
                          <Input placeholder="username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit">Save Account Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {/* Appearance Section */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme-options">Theme</Label>
                  <div className="flex space-x-2" id="theme-options">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      onClick={() => setTheme('light')}
                    >
                      Light
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      onClick={() => setTheme('dark')}
                    >
                      Dark
                    </Button>
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      onClick={() => setTheme('system')}
                    >
                      System
                    </Button>
                  </div>
                </div>
                
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
                
                <Button onClick={handleAppearanceSubmit}>Save Appearance</Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Data & Privacy Section */}
          <Card>
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
              <CardDescription>
                Manage your data and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                disabled={isDownloadingData} 
                onClick={handleDownloadData}
              >
                {isDownloadingData ? 'Downloading...' : 'Download Your Data'}
              </Button>
              
              <AlertDialog open={deleteAccountDialogOpen} onOpenChange={setDeleteAccountDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
