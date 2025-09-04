
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
  Cloud,
  Sun,
  CloudSun,
  CloudRain,
  CloudSnow,
  Thermometer
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ShootData } from '@/types/shoots';
import { useWeatherData } from '@/hooks/useWeatherData';

interface WeatherInfo {
  temp: number;
  condition: string;
  icon: React.ReactNode;
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
  status: 'scheduled' | 'completed';
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
  // Check if using the new props structure
  const isNewProps = 'shoot' in props;
  
  // Setup all needed variables whether using new or legacy props
  const status = isNewProps ? props.shoot.status : props.status;
  const showMedia = isNewProps ? props.showMedia :false;
  const onClick = props.onClick;
  
  const statusColorMap = {
    'completed': 'bg-green-500',
    'scheduled': 'bg-blue-500',
    'pending': 'bg-amber-500',
    'hold': 'bg-purple-500',
    'booked': 'bg-indigo-500'
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  const formatTime = (timeString?: string) => {
    if (!timeString) return 'TBD';
    return timeString;
  };

  // Get weather data for the shoot location and date
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  
  const getWeatherIcon = (condition: string) => {
    condition = condition.toLowerCase();
    if (condition.includes('sun') || condition.includes('clear')) {
      return <Sun className="h-5 w-5 text-amber-500" />;
    } else if (condition.includes('rain')) {
      return <CloudRain className="h-5 w-5 text-blue-500" />;
    } else if (condition.includes('snow')) {
      return <CloudSnow className="h-5 w-5 text-blue-200" />;
    } else if (condition.includes('cloud') && (condition.includes('part') || condition.includes('partly'))) {
      return <CloudSun className="h-5 w-5 text-gray-500" />;
    } else {
      return <Cloud className="h-5 w-5 text-gray-500" />;
    }
  };

  useEffect(() => {
    // Mock weather API call
    // In a real app, you would fetch from a weather API using the shoot date and location
    const getRandomWeather = () => {
      const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Snow'];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      const randomTemp = Math.floor(Math.random() * 23) + 10; // Random temp between 50-90°F
      
      return {
        temp: randomTemp,
        condition: randomCondition,
        icon: getWeatherIcon(randomCondition)
      };
    };
    
    setWeather(getRandomWeather());
  }, []);

  // Helper function to get media images regardless of format
  const getMediaImages = (media?: ShootData['media']): string[] => {
    if (!media) return [];
    if (media.images && media.images.length > 0) {
      return media.images.map(img => img.url);
    }
    if (media.photos && media.photos.length > 0) {
      return media.photos;
    }
    return [];
  };


  

  // If using new props structure
  if (isNewProps) {
    const { shoot } = props;
    const mediaImages = getMediaImages(shoot.media);
    
    return (
      <div 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onClick}
      >
        {showMedia && mediaImages.length > 0 && (
          <div className="relative h-40 w-full overflow-hidden">
            <img 
              src={mediaImages[0]}
              alt={shoot.location.address}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded text-xs font-medium">
              {mediaImages.length} photos
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
              <div className="flex items-center gap-1.5 bg-muted/60 p-1.5 px-2 rounded-full">
                {weather.icon}
                <span className="font-medium text-sm">{weather.temp}°C</span>
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
            <span className="font-medium">{shoot.services}</span>
          </div>

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
            <span>{format(new Date(shoot.scheduledDate), "MMM dd, yyyy")}</span>
          </div>
          
          {weather && (
            <div className="flex items-center text-sm">
              <Thermometer className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{weather.condition}</span>
            </div>
          )}
          
          {showMedia && mediaImages.length === 0 && (
  <div className="mt-3 flex items-center text-sm text-muted-foreground">
    <ImageIcon className="h-4 w-4 mr-2" />
    <span>No media uploaded yet</span>
  </div>
)}

        </CardContent>
        
        {/* <CardFooter className="p-4 pt-0">
          <div className="w-full">
            <Separator className="my-2" />
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <HomeIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{shoot.service }</span>
              </div>
              <span className="font-medium">
                {shoot.total_quote}
              </span>
            </div>
          </div>
        </CardFooter> */}
      </div>
    );
  }
  
  // Using legacy props structure
  const { address, date, time, photographer, client, price} = props;
  // const mediaImages = getMediaImages(shoot.media);
  
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
            <div className="flex items-center gap-1.5 bg-muted/60 p-1.5 px-2 rounded-full">
              {weather.icon}
              <span className="font-medium text-sm">{weather.temp}°C</span>
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
            <Thermometer className="h-4 w-4 mr-2 text-muted-foreground" />
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
