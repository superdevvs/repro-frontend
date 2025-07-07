import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/auth';
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
import { AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';


const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  company: z.string().optional(),
  role: z.enum(['client', 'photographer', 'editor', 'admin'], {
    required_error: "Please select a role",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
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
      role: 'client',
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

  const clearErrors = () => {
    setLoginError(null);
  };

  // Example after login API response
const handleLogin = async (values: LoginFormValues) => {
  setIsLoading(true);
  clearErrors();

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, {
      email: values.email,
      password: values.password,
    });

    const { token, user } = response.data;

    // ✅ Save token to localStorage
    localStorage.setItem('authToken', token);

    // Optionally save user too
    localStorage.setItem('user', JSON.stringify(user));

    toast({
      title: 'Success',
      description: 'You have successfully logged in!',
    });

    login(user); // your auth context method
    navigate('/dashboard');
  } catch (error) {
    console.error("Login error:", error);
    setLoginError(error.response?.data?.message || 'Login failed.');
    toast({
      title: "Login Failed",
      description: error.response?.data?.message || "Invalid email or password.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};


  const handleRegister = async (values: RegisterFormValues) => {
    setIsLoading(true);
    clearErrors();
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, {
        name: values.name,
        username: values.name, // Ensure this exists in your form
        email: values.email,
        password: values.password, // Ensure this exists in your form
        password_confirmation: values.password , // Ensure this exists in your form
        phonenumber: '54112345678', // Optional, provide a default if not in form
        company_name: values.company,
        role: values.role,
        avatar: 'https://example.com/avatar.jpg', // Ensure this exists in your form
        bio: 'No bio provided' // Ensure this exists in your form
      });
  
      const user = response.data.user;
      const token = response.data.token;
  
      const newUser: UserData = {
        id: `user-${user.id}`,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company_name,
        isActive: user.account_status === 'active',
        metadata: {
          avatar: user.avatar,
          bio: user.bio,
          preferences: {
            theme: 'system',
            notifications: true,
            emailFrequency: 'weekly'
          }
        }
      };
  
      login(newUser); // Save user in your auth context/state
      localStorage.setItem('token', token); // Store token if needed for auth
      toast({
        title: "Account created",
        description: "You have successfully registered and logged in!",
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    clearErrors();
  }, [activeTab]);

  return (
    <motion.div 
      className={`w-full max-w-md mx-auto ${isMobile ? 'px-4 pb-8' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="backdrop-blur-sm bg-background/80 border border-border/50 shadow-lg">
        <CardContent className={`${isMobile ? 'p-5' : 'p-6'}`}>
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
                {loginError && (
                  <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle size={16} />
                    <span>{loginError}</span>
                  </div>
                )}
                
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
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" />
                          <span>Signing in...</span>
                        </div>
                      ) : "Sign In"}
                    </Button>
                  </form>
                </Form>
                
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
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    
                    <FormField
                      control={registerForm.control}
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


                    <FormField
                      control={registerForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Register as</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="client">Client</SelectItem>
                              <SelectItem value="photographer">Photographer</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                              {/* <SelectItem value="admin">Administrator</SelectItem> */}
                            </SelectContent>
                          </Select>
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
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" />
                          <span>Creating Account...</span>
                        </div>
                      ) : "Create Account"}
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
