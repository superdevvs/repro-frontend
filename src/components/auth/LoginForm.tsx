
import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeIcon, EyeOffIcon, KeyIcon, MailIcon, ShieldIcon, UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function LoginForm() {
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  
  // Signup state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { login } = useAuth();
  const { toast: uiToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success("Login successful", {
        description: "Welcome to the Real Estate Media dashboard",
      });
    } catch (error) {
      toast.error("Login failed", {
        description: "Invalid email or password",
      });
      uiToast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (signupPassword !== confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Please make sure your passwords match",
      });
      return;
    }
    
    if (signupPassword.length < 6) {
      toast.error("Password too short", {
        description: "Password must be at least 6 characters long",
      });
      return;
    }
    
    toast.info("Registration is currently disabled", {
      description: "Please use one of the demo accounts to login",
    });
    
    // Clear form
    setSignupEmail('');
    setSignupPassword('');
    setConfirmPassword('');
    setName('');
    
    // Switch to login tab
    setActiveTab('login');
  };

  const demoLogins = [
    { email: 'admin@example.com', password: 'password', label: 'Admin', icon: <ShieldIcon className="h-3 w-3 mr-1" /> },
    { email: 'photographer@example.com', password: 'password', label: 'Photographer', icon: <CameraIcon className="h-3 w-3 mr-1" /> },
    { email: 'client@example.com', password: 'password', label: 'Client', icon: <UserIcon className="h-3 w-3 mr-1" /> },
  ];

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md p-8 glass-card rounded-2xl"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">Enter your credentials to access the dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground/70" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <KeyIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground/70" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 
                    <EyeOffIcon className="h-4 w-4 text-muted-foreground/70" /> : 
                    <EyeIcon className="h-4 w-4 text-muted-foreground/70" />
                  }
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          
          <div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or try a demo account</span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-2">
              {demoLogins.map((demo) => (
                <Button
                  key={demo.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin(demo.email, demo.password)}
                  className="text-xs h-8 flex items-center"
                >
                  {demo.icon}
                  {demo.label}
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="signup" className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Create Account</h2>
            <p className="text-muted-foreground">Sign up to get started with our platform</p>
          </div>
          
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name">Full Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground/70" />
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email address</Label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground/70" />
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <KeyIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground/70" />
                <Input
                  id="signup-password"
                  type={showSignupPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                >
                  {showSignupPassword ? 
                    <EyeOffIcon className="h-4 w-4 text-muted-foreground/70" /> : 
                    <EyeIcon className="h-4 w-4 text-muted-foreground/70" />
                  }
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <KeyIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground/70" />
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? 
                    <EyeOffIcon className="h-4 w-4 text-muted-foreground/70" /> : 
                    <EyeIcon className="h-4 w-4 text-muted-foreground/70" />
                  }
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

// Custom camera icon component
function CameraIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}
