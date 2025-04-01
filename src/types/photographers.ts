
export interface PhotographerFromShoots {
  id: string;
  name: string;
  email: string; // Required field
  avatar?: string;
  location?: string;
  rating?: number | string; // Allow either number or string for rating
  shootsCompleted: number;
  specialties?: string[];
  status: 'available' | 'busy' | 'offline';
}
