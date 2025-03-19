
import React from 'react';
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
  BellIcon, 
  CreditCardIcon, 
  GlobeIcon, 
  KeyIcon, 
  MailIcon, 
  PaletteIcon, 
  SaveIcon, 
  SettingsIcon, 
  SmartphoneIcon, 
  UserIcon 
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const SettingsPage = () => {
  const { user, role } = useAuth();
  
  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              Settings
            </Badge>
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          
          {/* Settings Content */}
          <Tabs defaultValue="profile" className="w-full">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Sidebar */}
              <div className="sm:w-[240px] flex-shrink-0">
                <Card className="glass-card sticky top-6">
                  <TabsList className="flex flex-col h-auto bg-transparent p-0">
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user?.avatar} alt={user?.name} />
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
              
              {/* Main Content */}
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
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="sm:w-[120px] flex-shrink-0 flex flex-col items-center gap-2">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={user?.avatar} alt={user?.name} />
                            <AvatarFallback className="text-xl">{user?.name?.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <Button variant="outline" size="sm">
                            Change
                          </Button>
                        </div>
                        
                        <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">First Name</Label>
                              <Input id="firstName" defaultValue={user?.name?.split(' ')[0]} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input id="lastName" defaultValue={user?.name?.split(' ')[1]} />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue="john.doe@example.com" />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" placeholder="Write a short bio..." />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-end">
                        <Button className="gap-2">
                          <SaveIcon className="h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
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
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input id="username" defaultValue="johndoe" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="language">Language</Label>
                          <Select defaultValue="en">
                            <SelectTrigger id="language">
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="timezone">Timezone</Label>
                          <Select defaultValue="est">
                            <SelectTrigger id="timezone">
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="est">Eastern Time (ET)</SelectItem>
                              <SelectItem value="cst">Central Time (CT)</SelectItem>
                              <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                              <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="font-medium mb-4">Account Management</h3>
                        <div className="space-y-4">
                          <Button variant="outline" className="w-full justify-start text-left text-muted-foreground">
                            Download Your Data
                          </Button>
                          <Button variant="outline" className="w-full justify-start text-left text-destructive border-destructive/20">
                            Delete Account
                          </Button>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-end">
                        <Button className="gap-2">
                          <SaveIcon className="h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
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
                          <Select defaultValue="light">
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
                          <Switch id="sidebar" defaultChecked />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="animations">Animations</Label>
                            <p className="text-sm text-muted-foreground">Enable animations and transitions</p>
                          </div>
                          <Switch id="animations" defaultChecked />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-end">
                        <Button className="gap-2">
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
                          <Switch id="email-shoots" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="email-invoices">Invoice & Payments</Label>
                            <p className="text-sm text-muted-foreground">Receive notifications about invoices and payments</p>
                          </div>
                          <Switch id="email-invoices" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="email-marketing">Marketing & Updates</Label>
                            <p className="text-sm text-muted-foreground">Receive marketing emails and platform updates</p>
                          </div>
                          <Switch id="email-marketing" />
                        </div>
                        
                        <Separator />
                        
                        <h3 className="font-medium">SMS Notifications</h3>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="sms-shoots">Shoot Reminders</Label>
                            <p className="text-sm text-muted-foreground">Receive SMS reminders about upcoming shoots</p>
                          </div>
                          <Switch id="sms-shoots" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="sms-payments">Payment Confirmations</Label>
                            <p className="text-sm text-muted-foreground">Receive SMS notifications for payment confirmations</p>
                          </div>
                          <Switch id="sms-payments" />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-end">
                        <Button className="gap-2">
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
                        <Button className="gap-2">
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
                      <div className="space-y-4">
                        <h3 className="font-medium">Change Password</h3>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input id="current-password" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input id="confirm-password" type="password" />
                          </div>
                          <Button className="w-full">Update Password</Button>
                        </div>
                        
                        <Separator />
                        
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="two-factor">Enable 2FA</Label>
                            <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                          </div>
                          <Switch id="two-factor" />
                        </div>
                        
                        <Separator />
                        
                        <h3 className="font-medium">Sessions</h3>
                        
                        <div className="space-y-3">
                          <div className="p-3 border rounded-md border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded bg-green-500/10 flex items-center justify-center text-green-500">
                                <GlobeIcon className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium">Chrome on Windows</p>
                                <p className="text-xs text-muted-foreground">
                                  <Badge variant="outline" className="mr-1 text-green-500 border-green-500/20 bg-green-500/10">Current</Badge>
                                  Last active: Now
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-3 border rounded-md border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                                <SmartphoneIcon className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium">Safari on iPhone</p>
                                <p className="text-xs text-muted-foreground">Last active: 2 hours ago</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">Revoke</Button>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <Button variant="outline" className="w-full justify-start text-left text-destructive border-destructive/20">
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
    </DashboardLayout>
  );
};

export default SettingsPage;
