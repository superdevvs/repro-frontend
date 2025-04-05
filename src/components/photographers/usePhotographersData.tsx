
import { useState, useEffect } from 'react';
import { toStringId } from '@/utils/formatters';

export interface Photographer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  bio: string;
  rating: number;
  specialty: string[];
  availability: string[];
  completedShoots: number;
  upcomingShoots: number;
}

// Mock photographer data
const mockPhotographers: Photographer[] = [
  {
    id: "1",
    name: "David Smith",
    email: "david@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, New York, NY 10001",
    avatar: "/assets/avatar/photographer1.jpg",
    bio: "Professional photographer with 10+ years of experience in architectural and real estate photography.",
    rating: 4.8,
    specialty: ["Real Estate", "Architecture", "Interior"],
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    completedShoots: 357,
    upcomingShoots: 5
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "(555) 987-6543",
    address: "456 Oak Ave, Los Angeles, CA 90001",
    avatar: "/assets/avatar/photographer2.jpg",
    bio: "Specializing in luxury real estate photography and videography. Drone certified.",
    rating: 4.9,
    specialty: ["Luxury Estates", "Drone Photography", "Twilight Shots"],
    availability: ["Monday", "Wednesday", "Friday", "Saturday"],
    completedShoots: 215,
    upcomingShoots: 3
  }
];

export default function usePhotographersData() {
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll just use our mock data
        setPhotographers(mockPhotographers);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPhotographerById = (id: string | number): Photographer | undefined => {
    const stringId = toStringId(id);
    return photographers.find(photographer => photographer.id === stringId);
  };

  return {
    photographers,
    loading,
    error,
    getPhotographerById
  };
}
