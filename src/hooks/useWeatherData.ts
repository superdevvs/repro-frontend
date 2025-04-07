
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface WeatherDataProps {
  date?: Date;
  city?: string;
  state?: string;
  zip?: string;
}

interface WeatherData {
  temperature: string;
  condition: string;
  distance: string | number;
}

export function useWeatherData({ date, city, state, zip }: WeatherDataProps): WeatherData {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: '75',
    condition: 'Partly Cloudy',
    distance: '5'
  });

  useEffect(() => {
    // This is a mock implementation - in a real application, you'd call a weather API
    // using the provided location and date parameters
    if (date && (city || zip)) {
      // Simulate API call with setTimeout
      const fetchWeather = setTimeout(() => {
        // Generate some realistic but random values for demo purposes
        const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        const randomTemp = Math.floor(Math.random() * 30) + 60; // 60-90°F
        const randomDistance = Math.floor(Math.random() * 10) + 1; // 1-10 km
        
        setWeatherData({
          temperature: randomTemp.toString(),
          condition: randomCondition,
          distance: randomDistance
        });
        
        console.log(`Weather data fetched for ${city || zip} on ${format(date, 'yyyy-MM-dd')}`);
      }, 500);
      
      return () => clearTimeout(fetchWeather);
    }
  }, [date, city, state, zip]);
  
  return weatherData;
}
