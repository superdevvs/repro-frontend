
import React, { useEffect, useState } from 'react';
import { CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  CalendarIcon, 
  ClockIcon, 
  HomeIcon, 
  MapPinIcon, 
  UserIcon,
  CameraIcon,
  ImageIcon,
  CloudIcon,
  SunIcon,
  CloudSunIcon,
  CloudRainIcon,
  CloudSnowIcon
} from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { ShootData, MediaItem } from '@/types/shoots';
import { ensureDateString } from '@/utils/formatters';

interface WeatherInfo {
  temp: number;
  condition: string;
  icon: string;
  iconComponent: React.ReactNode;
}

interface LegacyShootCardProps {
  id?: string;
  address: string;
  date: string;
  time: string;
  photographer: {
    name: string;
    avatar: string;
  };
  client: {
    name: string;
  };
  status: 'scheduled' | 'completed' | 'pending' | 'hold' | 'booked';
  price: number;
  delay?: number;
}

interface NewShootCardProps {
  shoot: ShootData;
  showMedia?: boolean;
}

type ShootCardProps = (LegacyShootCardProps | NewShootCardProps) & {
  onClick?: () => void;
};

export function ShootCard(props: ShootCardProps) {
  const isNewProps = 'shoot' in props;
  
  const status = isNewProps ? props.shoot.status : props.status;
  const showMedia = isNewProps ? props.showMedia : false;
  const onClick = props.onClick;
  
  const statusColorMap = {
    'completed': 'bg-green-500',
    'scheduled': 'bg-blue-500',
    'pending': 'bg-amber-500',
    'hold': 'bg-purple-500',
    'booked': 'bg-indigo-500'
  };
  
  const formatDate = (dateString: string | Date): string => {
    try {
      const dateStr = ensureDateString(dateString);
      const date = parseISO(dateStr);
      return isValid(date) ? format(date, 'MMM dd, yyyy') : 'Invalid date';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };
  
  const formatTime = (timeString?: string) => {
    if (!timeString) return 'TBD';
    return timeString;
  };

  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  
  const getWeatherIcon = (condition: string) => {
    condition = condition.toLowerCase();
    if (condition.includes('sun') || condition.includes('clear')) {
      return <SunIcon className="h-4 w-4 text-amber-500" />;
    } else if (condition.includes('rain')) {
      return <CloudRainIcon className="h-4 w-4 text-blue-500" />;
    } else if (condition.includes('snow')) {
      return <CloudSnowIcon className="h-4 w-4 text-blue-200" />;
    } else if (condition.includes('cloud') && condition.includes('part')) {
      return <CloudSunIcon className="h-4 w-4 text-gray-500" />;
    } else {
      return <CloudIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  useEffect(() => {
    const getRandomWeather = () => {
      const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Snow'];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      const randomTemp = Math.floor(Math.random() * 40) + 50; // Random temp between 50-90°F
      
      return {
        temp: randomTemp,
        condition: randomCondition,
        icon: '🌤️',
        iconComponent: getWeatherIcon(randomCondition)
      };
    };
    
    setWeather(getRandomWeather());
  }, []);

  if (isNewProps) {
    const { shoot } = props;
    
    return (
      <div 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onClick}
      >
        {showMedia && shoot.media?.photos && shoot.media.photos.length > 0 && (
          <div className="relative h-40 w-full overflow-hidden">
            <img 
              src={shoot.media.photos[0].url}
              alt={shoot.media.photos[0].name || shoot.location.address || "Property"}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded text-xs font-medium">
              {shoot.media.photos.length} photos
            </div>
          </div>
        )}
        
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <Badge 
              variant="secondary" 
              className={`${statusColorMap[shoot.status]} text-white mb-2`}
            >
              {shoot.status.charAt(0).toUpperCase() + shoot.status.slice(1)}
            </Badge>
            
            {weather && (
              <div className="flex items-center text-xs text-muted-foreground bg-muted/50 p-1 rounded">
                {weather.iconComponent}
                <span className="ml-1">{weather.temp}°F</span>
              </div>
            )}
          </div>
          
          <CardTitle className="text-base line-clamp-1">
            <div className="flex items-start">
              <MapPinIcon className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0 text-muted-foreground" />
              <span>{shoot.location.fullAddress}</span>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 pt-2">
          <div className="flex items-center text-sm mb-2">
            <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="font-medium">{shoot.client.name}</span>
          </div>
          
          <div className="flex items-center text-sm mb-2">
            <CameraIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{shoot.photographer.name}</span>
          </div>
          
          <div className="flex items-center text-sm mb-2">
            <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{formatDate(shoot.scheduledDate)}</span>
          </div>
          
          {weather && (
            <div className="flex items-center text-sm">
              <CloudIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{weather.condition}</span>
            </div>
          )}
          
          {showMedia && !shoot.media?.photos && (
            <div className="mt-3 flex items-center text-sm text-muted-foreground">
              <ImageIcon className="h-4 w-4 mr-2" />
              <span>No media uploaded yet</span>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <div className="w-full">
            <Separator className="my-2" />
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <HomeIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{shoot.services.join(', ') || 'No services'}</span>
              </div>
              <span className="font-medium">
                {shoot.payment.totalQuote > 0 ? `$${shoot.payment.totalQuote.toFixed(2)}` : 'TBD'}
              </span>
            </div>
          </div>
        </CardFooter>
      </div>
    );
  }
  
  const { address, date, time, photographer, client, price } = props;
  
  return (
    <div 
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <Badge 
            variant="secondary" 
            className={`${statusColorMap[status]} text-white mb-2`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          
          {weather && (
            <div className="flex items-center text-xs text-muted-foreground bg-muted/50 p-1 rounded">
              {weather.iconComponent}
              <span className="ml-1">{weather.temp}°F</span>
            </div>
          )}
        </div>
        
        <CardTitle className="text-base line-clamp-1">
          <div className="flex items-start">
            <MapPinIcon className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0 text-muted-foreground" />
            <span>{address}</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <div className="flex items-center text-sm mb-2">
          <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="font-medium">{client.name}</span>
        </div>
        
        <div className="flex items-center text-sm mb-2">
          <CameraIcon className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{photographer.name}</span>
        </div>
        
        <div className="flex items-center text-sm mb-2">
          <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{formatDate(date)}</span>
        </div>
        
        {weather && (
          <div className="flex items-center text-sm">
            <CloudIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{weather.condition}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <div className="w-full">
          <Separator className="my-2" />
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <HomeIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Photography</span>
            </div>
            <span className="font-medium">
              {price > 0 ? `$${price.toFixed(2)}` : 'TBD'}
            </span>
          </div>
        </div>
      </CardFooter>
    </div>
  );
}
