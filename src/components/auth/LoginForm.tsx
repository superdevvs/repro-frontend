import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { UserData } from '@/types/auth';
import { useIsMobile } from '@/hooks/use-mobile';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  company: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('login');
  const isMobile = useIsMobile();
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      company: '',
    },
  });
  
  const sampleUsers = {
    client: {
      id: '1',
      name: 'John Client',
      email: 'client@example.com',
      role: 'client',
      company: 'Client Realty',
      phone: '555-1234',
      isActive: true,
    },
    admin: {
      id: '2',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      isActive: true,
    },
    photographer: {
      id: '3',
      name: 'Photo Grapher',
      email: 'photographer@example.com',
      role: 'photographer',
      isActive: true,
    },
    editor: {
      id: '4',
      name: 'Emma Editor',
      email: 'editor@example.com',
      role: 'editor',
      isActive: true,
    },
    superadmin: {
      id: '5',
      name: 'Super Admin',
      email: 'superadmin@example.com',
      role: 'superadmin',
      isActive: true,
    }
  };

  const handleLogin = (values: LoginFormValues) => {
    setIsLoading(true);
    
    setTimeout(() => {
      let userData: UserData | null = null;
      
      if (values.email === 'client@example.com') {
        userData = sampleUsers.client as UserData;
      } else if (values.email === 'admin@example.com') {
        userData = sampleUsers.admin as UserData;
      } else if (values.email === 'photographer@example.com') {
        userData = sampleUsers.photographer as UserData;
      } else if (values.email === 'editor@example.com') {
        userData = sampleUsers.editor as UserData;
      } else if (values.email === 'superadmin@example.com') {
        userData = sampleUsers.superadmin as UserData;
      }
      
      if (userData) {
        login(userData);
        toast({
          title: "Success",
          description: "You have successfully logged in!",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Try one of the sample emails.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleRegister = (values: RegisterFormValues) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const newUser: UserData = {
        id: `user-${Date.now()}`,
        name: values.name,
        email: values.email,
        role: 'client',
        company: values.company,
        isActive: true,
        metadata: {
          preferences: {
            theme: 'system',
            notifications: true,
            emailFrequency: 'weekly'
          }
        }
      };
      
      login(newUser);
      toast({
        title: "Account created",
        description: "You have successfully registered and logged in!",
      });
      navigate('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <motion.div 
      className={`w-full max-w-md mx-auto ${isMobile ? 'px-4' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="backdrop-blur-sm bg-background/80">
        <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
          <div className="mb-4 text-center">
            <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-1`}>
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {activeTab === 'login' 
                ? 'Sign in to access your account' 
                : 'Register to get started with our platform'}
            </p>
          </div>
          
          <div className="space-y-4">
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 w-full mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </Form>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-muted-foreground mb-2">Sample logins:</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    <Badge variant="outline" className="cursor-pointer" onClick={() => loginForm.setValue('email', 'client@example.com')}>
                      Client
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer" onClick={() => loginForm.setValue('email', 'admin@example.com')}>
                      Admin
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer" onClick={() => loginForm.setValue('email', 'photographer@example.com')}>
                      Photographer
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer" onClick={() => loginForm.setValue('email', 'editor@example.com')}>
                      Editor
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer" onClick={() => loginForm.setValue('email', 'superadmin@example.com')}>
                      SuperAdmin
                    </Badge>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Company" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
