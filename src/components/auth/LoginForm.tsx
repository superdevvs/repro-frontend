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
import { Eye, EyeOff } from 'lucide-react';


const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(1, "Full name is required"),
  company: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address"),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
  terms: z.boolean().optional(),
  role: z.enum(['client', 'photographer', 'editor', 'admin'], {
    required_error: "Please select a role",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loginShowPassword, setLoginShowPassword] = useState(false);


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
      company: '',
      phone: '',
      email: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      password: '',
      role: 'client',
      terms: false,
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
        email: values.email,
        password: values.password, // Ensure this exists in your form
        password_confirmation: values.password, // Ensure this exists in your form
        phone_number: '54112345678', // Optional, provide a default if not in form
        company_name: values.company,
        city: values.city,
        state: values.state,
        zip: values.zip,
        country: values.country,
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
        phone: user.phone_number,
        city: user.city,
        state: user.state,
        zip: user.zip,
        country: user.country,
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
    // <motion.div 
    //   className={`w-full max-w-md mx-auto ${isMobile ? 'px-4 pb-8' : ''}`}
    //   initial={{ opacity: 0, y: 10 }}
    //   animate={{ opacity: 1, y: 0 }}
    //   transition={{ duration: 0.3 }}
    // >
    //   <Card className="backdrop-blur-sm bg-background/80 border border-border/50 shadow-lg">
    //     <CardContent className={`${isMobile ? 'p-5' : 'p-6'}`}>
    //       <div className="mb-4 text-center">
    //         <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-1`}>
    //           {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
    //         </h1>
    //         <p className="text-sm text-muted-foreground">
    //           {activeTab === 'login' 
    //             ? 'Sign in to access your account' 
    //             : 'Register to get started with our platform'}
    //         </p>
    //       </div>

    //       <div className="space-y-4">
    //         <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
    //           <TabsList className="grid grid-cols-2 w-full mb-4">
    //             <TabsTrigger value="login">Login</TabsTrigger>
    //             <TabsTrigger value="register">Register</TabsTrigger>
    //           </TabsList>

    //           <TabsContent value="login">
    //             {loginError && (
    //               <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md flex items-center gap-2 text-sm text-destructive">
    //                 <AlertCircle size={16} />
    //                 <span>{loginError}</span>
    //               </div>
    //             )}

    //             <Form {...loginForm}>
    //               <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
    //                 <FormField
    //                   control={loginForm.control}
    //                   name="email"
    //                   render={({ field }) => (
    //                     <FormItem>
    //                       <FormLabel>Email</FormLabel>
    //                       <FormControl>
    //                         <Input placeholder="your@email.com" {...field} />
    //                       </FormControl>
    //                       <FormMessage />
    //                     </FormItem>
    //                   )}
    //                 />

    //                 <FormField
    //                   control={loginForm.control}
    //                   name="password"
    //                   render={({ field }) => (
    //                     <FormItem>
    //                       <FormLabel>Password</FormLabel>
    //                       <FormControl>
    //                         <Input type="password" placeholder="••••••••" {...field} />
    //                       </FormControl>
    //                       <FormMessage />
    //                     </FormItem>
    //                   )}
    //                 />

    //                 <Button 
    //                   type="submit" 
    //                   className="w-full"
    //                   disabled={isLoading}
    //                 >
    //                   {isLoading ? (
    //                     <div className="flex items-center gap-2">
    //                       <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" />
    //                       <span>Signing in...</span>
    //                     </div>
    //                   ) : "Sign In"}
    //                 </Button>
    //               </form>
    //             </Form>

    //           </TabsContent>

    //           <TabsContent value="register">
    //             <Form {...registerForm}>
    //               <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
    //                 <FormField
    //                   control={registerForm.control}
    //                   name="name"
    //                   render={({ field }) => (
    //                     <FormItem>
    //                       <FormLabel>Name</FormLabel>
    //                       <FormControl>
    //                         <Input placeholder="John Smith" {...field} />
    //                       </FormControl>
    //                       <FormMessage />
    //                     </FormItem>
    //                   )}
    //                 />

    //                 <FormField
    //                   control={registerForm.control}
    //                   name="email"
    //                   render={({ field }) => (
    //                     <FormItem>
    //                       <FormLabel>Email</FormLabel>
    //                       <FormControl>
    //                         <Input placeholder="your@email.com" {...field} />
    //                       </FormControl>
    //                       <FormMessage />
    //                     </FormItem>
    //                   )}
    //                 />

    //                 <FormField
    //                   control={registerForm.control}
    //                   name="password"
    //                   render={({ field }) => (
    //                     <FormItem>
    //                       <FormLabel>New Password</FormLabel>
    //                       <FormControl>
    //                         <Input type="password" placeholder="••••••••" {...field} />
    //                       </FormControl>
    //                       <FormMessage />
    //                     </FormItem>
    //                   )}
    //                 />


    //                 <FormField
    //                   control={registerForm.control}
    //                   name="confirmPassword"
    //                   render={({ field }) => (
    //                     <FormItem>
    //                       <FormLabel>Confirm Password</FormLabel>
    //                       <FormControl>
    //                         <Input type="password" placeholder="••••••••" {...field} />
    //                       </FormControl>
    //                       <FormMessage />
    //                     </FormItem>
    //                   )}
    //                 />


    //                 <FormField
    //                   control={registerForm.control}
    //                   name="role"
    //                   render={({ field }) => (
    //                     <FormItem>
    //                       <FormLabel>Register as</FormLabel>
    //                       <Select onValueChange={field.onChange} defaultValue={field.value}>
    //                         <FormControl>
    //                           <SelectTrigger>
    //                             <SelectValue placeholder="Select your role" />
    //                           </SelectTrigger>
    //                         </FormControl>
    //                         <SelectContent>
    //                           <SelectItem value="client">Client</SelectItem>
    //                           {/* <SelectItem value="photographer">Photographer</SelectItem>
    //                           <SelectItem value="editor">Editor</SelectItem> */}
    //                           {/* <SelectItem value="admin">Administrator</SelectItem> */}
    //                         </SelectContent>
    //                       </Select>
    //                       <FormMessage />
    //                     </FormItem>
    //                   )}
    //                 />

    //                 <FormField
    //                   control={registerForm.control}
    //                   name="company"
    //                   render={({ field }) => (
    //                     <FormItem>
    //                       <FormLabel>Company (Optional)</FormLabel>
    //                       <FormControl>
    //                         <Input placeholder="Your Company" {...field} />
    //                       </FormControl>
    //                       <FormMessage />
    //                     </FormItem>
    //                   )}
    //                 />

    //                 <Button 
    //                   type="submit" 
    //                   className="w-full"
    //                   disabled={isLoading}
    //                 >
    //                   {isLoading ? (
    //                     <div className="flex items-center gap-2">
    //                       <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" />
    //                       <span>Creating Account...</span>
    //                     </div>
    //                   ) : "Create Account"}
    //                 </Button>
    //               </form>
    //             </Form>
    //           </TabsContent>
    //         </Tabs>
    //       </div>
    //     </CardContent>
    //   </Card>
    // </motion.div>


    <motion.div
      className={`w-full max-w-md mx-auto ${isMobile ? 'px-4 pb-8' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className={`${isMobile ? 'p-0' : 'p-0'}`}>
          {/* Top header (logo + heading + subtext) */}
          <div className="text-center mb-8">
            <img src="/REPRO-HQ.png" alt="REPRO" className="h-10 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold">Log in to your dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Centralize shoots, assets, and approvals
            </p>
          </div>

          {/* Tabs styled like design 1 */}
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 w-full bg-transparent border-b border-border mb-4">
              <TabsTrigger
                value="login"
                className={`rounded-none border-b-2 ${activeTab === 'login'
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-muted-foreground'
                  }`}
              >
                Log In
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className={`rounded-none border-b-2 ${activeTab === 'register'
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-muted-foreground'
                  }`}
              >
                Register
              </TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login" className="space-y-6">
              {loginError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle size={16} />
                  <span>{loginError}</span>
                </div>
              )}

              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
                  {/* Email Field */}
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormControl>
                          <Input
                            placeholder="Email or username"
                            {...field}
                            className="
                  border-0 
                  border-b 
                  border-border 
                  rounded-none 
                  focus-visible:ring-0 
                  focus:border-primary 
                  text-base 
                  placeholder:text-muted-foreground
                "
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password Field */}
                  <FormField
  control={loginForm.control}
  name="password"
  render={({ field }) => (
    <FormItem className="relative">
      <FormControl>
        <Input
          type={loginShowPassword ? "text" : "password"}          // <-- use state here
          placeholder="Password"
          {...field}
          className="
            border-0 
            border-b 
            border-border 
            rounded-none 
            focus-visible:ring-0 
            focus:border-primary 
            text-base 
            placeholder:text-muted-foreground
            pr-10             /* space for the eye button */
          "
        />
      </FormControl>

      <button
        type="button"
        onClick={() => setLoginShowPassword((s) => !s)}
        aria-label={loginShowPassword ? "Hide password" : "Show password"}
        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-gray-50 dark:hover:bg-slate-800 transition"
      >
        {loginShowPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>

      <FormMessage />
    </FormItem>
  )}
/>


                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 rounded-full text-base font-semibold mt-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" />
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      'Log In'
                    )}
                  </Button>

                  {/* Register Redirect Text */}
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    No account yet?{' '}
                    <span
                      onClick={() => setActiveTab('register')}
                      className="text-primary font-medium cursor-pointer hover:underline"
                    >
                      Register now
                    </span>
                  </p>
                </form>
              </Form>
            </TabsContent>


            {/* Register Form */}
            <TabsContent value="register" className="space-y-6">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="relative">
                          <FormControl>
                            <Input
                              placeholder="Full Name"
                              {...field}
                              className="
                  border-0 
                  border-b 
                  border-border 
                  rounded-none 
                  focus-visible:ring-0 
                  focus:border-primary 
                  text-base 
                  placeholder:text-muted-foreground
                "
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem className="relative">
                          <FormControl>
                            <Input
                              placeholder="Company (Optional)"
                              {...field}
                              className="
                  border-0 
                  border-b 
                  border-border 
                  rounded-none 
                  focus-visible:ring-0 
                  focus:border-primary 
                  text-base 
                  placeholder:text-muted-foreground
                "
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={registerForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="relative">
                          <FormControl>
                            <Input
                              placeholder="+1 (555) 123-4567"
                              {...field}
                              className="
                  border-0 
                  border-b 
                  border-border 
                  rounded-none 
                  focus-visible:ring-0 
                  focus:border-primary 
                  text-base 
                  placeholder:text-muted-foreground
                "
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="relative">
                          <FormControl>
                            <Input
                              placeholder="you@company.com"
                              {...field}
                              className="
                  border-0 
                  border-b 
                  border-border 
                  rounded-none 
                  focus-visible:ring-0 
                  focus:border-primary 
                  text-base 
                  placeholder:text-muted-foreground
                "
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={registerForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="relative">
                          <FormControl>
                            <Input
                              placeholder="San Francisco"
                              {...field}
                              className="
                  border-0 
                  border-b 
                  border-border 
                  rounded-none 
                  focus-visible:ring-0 
                  focus:border-primary 
                  text-base 
                  placeholder:text-muted-foreground
                "
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem className="relative">
                          <FormControl>
                            <Input
                              placeholder="CA"
                              {...field}
                              className="
                  border-0 
                  border-b 
                  border-border 
                  rounded-none 
                  focus-visible:ring-0 
                  focus:border-primary 
                  text-base 
                  placeholder:text-muted-foreground
                "
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="zip"
                      render={({ field }) => (
                        <FormItem className="relative">
                          <FormControl>
                            <Input
                              placeholder="94107"
                              {...field}
                              className="
                  border-0 
                  border-b 
                  border-border 
                  rounded-none 
                  focus-visible:ring-0 
                  focus:border-primary 
                  text-base 
                  placeholder:text-muted-foreground
                "
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={registerForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormControl>
                          <Input
                            placeholder="United States"
                            {...field}
                            className="
                  border-0 
                  border-b 
                  border-border 
                  rounded-none 
                  focus-visible:ring-0 
                  focus:border-primary 
                  text-base 
                  placeholder:text-muted-foreground
                "
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-6">
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="relative">
                          <FormControl>
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Password"
                              {...field}
                              className="
                            pr-10
                  border-0 
                  border-b 
                  border-border 
                  rounded-none 
                  focus-visible:ring-0 
                  focus:border-primary 
                  text-base 
                  placeholder:text-muted-foreground
                "
                            />
                          </FormControl>
                          <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
                            aria-label="Toggle password visibility"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="relative">
                          <FormControl>
                            <Input
                              type={showConfirm ? 'text' : 'password'}
                              placeholder="Confirm Password"
                              {...field}
                              className="
                  border-0 
                  border-b 
                  border-border 
                  rounded-none 
                  focus-visible:ring-0 
                  focus:border-primary 
                  text-base 
                  placeholder:text-muted-foreground
                "
                            />
                          </FormControl>
                          <button
                            type="button"
                            onClick={() => setShowConfirm((s) => !s)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
                            aria-label="Toggle confirm password visibility"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <FormMessage />
                        </FormItem>
                      )}
                    /></div>
                  <FormField
                    control={registerForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Register as</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="client">Client</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Terms */}
                  <FormField
                    control={registerForm.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 pt-2">
                          <input
                            id="terms"
                            type="checkbox"
                            checked={field.value ?? false}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="h-4 w-4 rounded border border-border"
                          />
                          <label htmlFor="terms" className="text-sm text-muted-foreground select-none">
                            I agree to the Terms
                          </label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                  <Button type="submit" className="w-full h-12 rounded-full text-base font-semibold" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" />
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      'Register'
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div >

  );
}

