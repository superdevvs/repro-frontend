
import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { EyeIcon, EyeOffIcon, KeyIcon, MailIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast({
        title: "Login successful",
        description: "Welcome to the Real Estate Media dashboard",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogins = [
    { email: 'admin@example.com', password: 'password', label: 'Admin' },
    { email: 'photographer@example.com', password: 'password', label: 'Photographer' },
    { email: 'client@example.com', password: 'password', label: 'Client' },
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
      <div className="mb-8 text-center">
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
      
      <div className="mt-6">
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
              className="text-xs h-8"
            >
              {demo.label}
            </Button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
