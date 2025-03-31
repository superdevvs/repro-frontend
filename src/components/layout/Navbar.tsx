
import React, { useEffect, useState } from 'react';
import { BellIcon, SearchIcon, SunIcon, MoonIcon, PlusCircleIcon, CloudIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/AuthProvider';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';

interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
}

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Fetch current weather data for demo purposes
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // In a real app, this would use the user's location or a default location
        // This is a mock response for demo purposes
        setWeather({
          temp: 22, // Using Celsius
          condition: 'Partly Cloudy',
          icon: '⛅️'
        });
        
        // Actual API call would look like:
        // const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=auto:ip`);
        // const data = await res.json();
        // setWeather({
        //   temp: data.current.temp_c,
        //   condition: data.current.condition.text,
        //   icon: data.current.condition.icon
        // });
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      }
    };

    fetchWeather();
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <motion.div 
      className="w-full h-16 border-b border-border flex items-center justify-between px-4 bg-background/95 backdrop-blur-md"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex items-center gap-4">
        <Button 
          variant="default" 
          size="sm" 
          className="mr-2 flex items-center gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => navigate('/book-shoot')}
        >
          <PlusCircleIcon className="h-4 w-4" />
          <span className="hidden sm:inline">New Shoot</span>
        </Button>
      
        <div className="flex w-full max-w-sm items-center gap-1.5 relative">
          <SearchIcon className="h-4 w-4 text-muted-foreground absolute ml-3" />
          <Input 
            type="search" 
            placeholder="Search..." 
            className="pl-9 bg-secondary/50 border-none focus-visible:ring-primary/20"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Weather Info */}
        {weather && (
          <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
            <CloudIcon className="h-4 w-4" />
            <span>{weather.icon} {weather.temp}°C</span>
          </div>
        )}
        
        {/* Theme Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <BellIcon className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[300px]">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-auto">
              {Array.from({ length: 3 }).map((_, i) => (
                <DropdownMenuItem key={i} className="cursor-pointer py-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">New shoot booked</p>
                    <p className="text-xs text-muted-foreground">123 Main St, Anytown USA</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
