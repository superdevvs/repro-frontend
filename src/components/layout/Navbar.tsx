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
  tempF: number;
  condition: string;
}

export function Navbar() {
  const { user, logout, role } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Allow client users to create new shoots
  const canBookShoot = ['admin', 'superadmin', 'client'].includes(role);

  // Fetch current weather using device location via Open-Meteo (no API key)
  useEffect(() => {
    let cancelled = false;

    const codeToText = (code: number) => {
      const map: Record<number, string> = {
        0: 'Clear', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Rime Fog', 51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle',
        56: 'Freezing Drizzle', 57: 'Freezing Drizzle', 61: 'Rain', 63: 'Rain', 65: 'Heavy Rain',
        66: 'Freezing Rain', 67: 'Freezing Rain', 71: 'Snow', 73: 'Snow', 75: 'Heavy Snow',
        77: 'Snow Grains', 80: 'Rain Showers', 81: 'Rain Showers', 82: 'Violent Showers',
        85: 'Snow Showers', 86: 'Snow Showers', 95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Hailstorm'
      };
      return map[code] || 'Weather';
    };

    const loadWeather = async (lat: number, lon: number) => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const cw = data.current_weather;
        if (cw && typeof cw.temperature === 'number') {
          setWeather({ tempF: cw.temperature, condition: codeToText(cw.weathercode) });
        }
      } catch {
        // Keep weather hidden on errors
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          loadWeather(latitude, longitude);
        },
        () => {
          // Fallback: NYC
          loadWeather(40.7128, -74.0060);
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 600000 }
      );
    } else {
      loadWeather(40.7128, -74.0060);
    }

    return () => { cancelled = true; };
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
        {canBookShoot && (
          <Button 
            variant="default" 
            size="sm" 
            className="mr-2 flex items-center gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => navigate('/book-shoot')}
          >
            <PlusCircleIcon className="h-4 w-4" />
            <span className="hidden sm:inline">New Shoot</span>
          </Button>
        )}
      
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
            <span>{weather.tempF}°F · {weather.condition}</span>
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
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
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

