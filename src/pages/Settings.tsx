import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/profile/ImageUpload';
import { BrandingImageUpload } from '@/components/profile/BrandingImageUpload';
import { LinkPreviewSettings } from '@/components/settings/LinkPreviewSettings';

const Settings = () => {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [avatar, setAvatar] = React.useState(user?.avatar || '');
  const [brandLogo, setBrandLogo] = React.useState('');
  const [brandBanner, setBrandBanner] = React.useState('');
  const [bio, setBio] = React.useState(''); // Add a separate state for bio
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  };
  
  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Account Updated",
      description: "Your account settings have been saved.",
    });
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Branding Updated",
      description: "Your branding settings have been saved.",
    });
  };

  const handleAvatarChange = (url: string) => {
    setAvatar(url);
  };

  const handleLogoChange = (url: string) => {
    setBrandLogo(url);
  };

  const handleBannerChange = (url: string) => {
    setBrandBanner(url);
  };
  
  const isSuperAdmin = role === 'superadmin';
  
  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6">
          <div className="space-y-2">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              Settings
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              {isSuperAdmin && (
                <TabsTrigger value="admin">Admin</TabsTrigger>
              )}
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>
                    Update your profile information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                        <div>
                          <Avatar className="h-24 w-24 border-2 border-muted">
                            <AvatarImage src={avatar || user?.avatar} alt={user?.name} />
                            <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 w-full"
                              >
                                Change Avatar
                              </Button>
                            </SheetTrigger>
                            <SheetContent>
                              <SheetHeader>
                                <SheetTitle>Profile Picture</SheetTitle>
                                <SheetDescription>
                                  Upload a new profile picture
                                </SheetDescription>
                              </SheetHeader>
                              <div className="py-6">
                                <ImageUpload onChange={handleAvatarChange} initialImage={avatar || user?.avatar} />
                              </div>
                            </SheetContent>
                          </Sheet>
                        </div>
                        
                        <div className="flex-1 space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <label htmlFor="name" className="text-sm font-medium">
                                Full Name
                              </label>
                              <Input id="name" defaultValue={user?.name} />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="email" className="text-sm font-medium">
                                Email
                              </label>
                              <Input id="email" type="email" defaultValue={user?.email} />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor="bio" className="text-sm font-medium">
                              Bio
                            </label>
                            <Textarea
                              id="bio"
                              rows={4}
                              defaultValue={bio}
                              placeholder="Write a short bio about yourself"
                              onChange={(e) => setBio(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Account Tab */}
            <TabsContent value="account" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                  <CardDescription>
                    Update your account settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveAccount} className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label htmlFor="username" className="text-sm font-medium">
                            Username
                          </label>
                          <Input 
                            id="username" 
                            defaultValue={''} 
                            placeholder="your-username"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="timezone" className="text-sm font-medium">
                            Timezone
                          </label>
                          <select
                            id="timezone"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            defaultValue="America/New_York"
                          >
                            <option value="America/New_York">Eastern Time (ET)</option>
                            <option value="America/Chicago">Central Time (CT)</option>
                            <option value="America/Denver">Mountain Time (MT)</option>
                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                            <option value="America/Anchorage">Alaska Time (AKT)</option>
                            <option value="Pacific/Honolulu">Hawaii Time (HT)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="current-password" className="text-sm font-medium">
                          Current Password
                        </label>
                        <Input id="current-password" type="password" />
                      </div>
                      
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label htmlFor="new-password" className="text-sm font-medium">
                            New Password
                          </label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="confirm-password" className="text-sm font-medium">
                            Confirm Password
                          </label>
                          <Input id="confirm-password" type="password" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit">
                        Update Account
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Branding Tab */}
            <TabsContent value="branding" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Branding</CardTitle>
                  <CardDescription>
                    Upload your company logo and branding images
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveBranding} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Company Logo</h3>
                        <p className="text-sm text-muted-foreground">
                          This logo will appear on your invoices and client communications.
                        </p>
                        <BrandingImageUpload 
                          onChange={handleLogoChange} 
                          initialImage={brandLogo} 
                          aspectRatio="1/1"
                          maxWidth={200}
                          helperText="Recommended size: 200x200px (square)"
                        />
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Brand Banner</h3>
                        <p className="text-sm text-muted-foreground">
                          This banner will be used in client-facing materials.
                        </p>
                        <BrandingImageUpload 
                          onChange={handleBannerChange} 
                          initialImage={brandBanner}
                          aspectRatio="16/9"
                          maxWidth={600}
                          helperText="Recommended size: 1200x675px (16:9)"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="brand-colors" className="text-sm font-medium">
                          Brand Colors
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">Primary</span>
                            <Input type="color" defaultValue="#0070f3" className="h-10 p-1" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">Secondary</span>
                            <Input type="color" defaultValue="#f5f5f5" className="h-10 p-1" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">Accent</span>
                            <Input type="color" defaultValue="#ff4500" className="h-10 p-1" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">Text</span>
                            <Input type="color" defaultValue="#333333" className="h-10 p-1" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="tagline" className="text-sm font-medium">
                          Company Tagline
                        </label>
                        <Input 
                          id="tagline" 
                          placeholder="Your business tagline" 
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit">
                        Save Branding
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Billing</CardTitle>
                  <CardDescription>
                    Manage your billing information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <h4 className="font-medium">Payment Method</h4>
                        <p className="text-sm text-muted-foreground">Select your preferred payment method</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-muted-foreground rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <h4 className="font-medium">Subscription Plan</h4>
                        <p className="text-sm text-muted-foreground">Choose your subscription plan</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-muted-foreground rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how we contact you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">Get notified about new bookings and updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-muted-foreground rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <h4 className="font-medium">SMS Notifications</h4>
                        <p className="text-sm text-muted-foreground">Receive text messages for urgent updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-muted-foreground rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <h4 className="font-medium">Marketing Emails</h4>
                        <p className="text-sm text-muted-foreground">Receive special offers and updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-muted-foreground rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>Save Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Admin Tab - Only visible to superadmins */}
            {isSuperAdmin && (
              <TabsContent value="admin" className="space-y-4">
                <div className="grid grid-cols-1 gap-6">
                  <LinkPreviewSettings />
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default Settings;
