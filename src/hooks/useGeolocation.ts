
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  loading: boolean;
  error: string | null;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export const useGeolocation = (options: GeolocationOptions = {}) => {
  const { toast } = useToast();
  const [geolocation, setGeolocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    address: null,
    city: null,
    state: null,
    zip: null,
    loading: false,
    error: null,
  });

  const getLocation = () => {
    if (!navigator.geolocation) {
      setGeolocation(prev => ({
        ...prev,
        error: "Geolocation is not supported by this browser.",
        loading: false,
      }));
      
      toast({
        title: "Location Unavailable",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
      
      return;
    }

    setGeolocation(prev => ({ ...prev, loading: true }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Use reverse geocoding to get address information
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch address data');
          }
          
          const data = await response.json();
          
          setGeolocation({
            latitude,
            longitude,
            address: data.principalSubdivision ? `${data.street || ''} ${data.housenumber || ''}`.trim() : null,
            city: data.city || data.locality || null,
            state: data.principalSubdivision || null,
            zip: data.postcode || null,
            loading: false,
            error: null,
          });
        } catch (error) {
          console.error('Error fetching location data:', error);
          setGeolocation(prev => ({
            ...prev,
            loading: false,
            error: "Failed to fetch address details.",
          }));
          
          toast({
            title: "Location Error",
            description: "Could not retrieve address details for your location.",
            variant: "destructive",
          });
        }
      },
      (error) => {
        let errorMessage = "Could not detect your location.";
        
        if (error.code === 1) {
          errorMessage = "Location permission denied. Please enable location access.";
        } else if (error.code === 2) {
          errorMessage = "Location unavailable. Please try again later.";
        } else if (error.code === 3) {
          errorMessage = "Location request timed out. Please try again.";
        }
        
        setGeolocation(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        
        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0, ...options }
    );
  };

  return { ...geolocation, getLocation };
};
