import { ShootData } from '@/types/shoots';

// Helper function to determine photographer status based on recent activity
export const determinePhotographerStatus = (photographerName: string, allShoots: ShootData[]): 'available' | 'busy' | 'offline' => {
  // Get current date
  const today = new Date();
  
  // Find recent and upcoming shoots for this photographer
  const recentShoots = allShoots.filter(shoot => 
    shoot.photographer.name === photographerName && 
    new Date(shoot.scheduledDate) <= today
  ).sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());
  
  const upcomingShoots = allShoots.filter(shoot =>
    shoot.photographer.name === photographerName &&
    new Date(shoot.scheduledDate) > today &&
    new Date(shoot.scheduledDate) < new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
  );
  
  // If no recent shoots in the last 30 days, consider offline
  if (recentShoots.length === 0 || 
      (recentShoots[0] && new Date(recentShoots[0].scheduledDate).getTime() < today.getTime() - 30 * 24 * 60 * 60 * 1000)) {
    return 'offline';
  }
  
  // If has upcoming shoots in the next 7 days, consider busy
  if (upcomingShoots.length > 0) {
    return 'busy';
  }
  
  // Otherwise available
  return 'available';
};

// Helper function to determine photographer specialties based on shoot services
export const determinePhotographerSpecialties = (photographerName: string, allShoots: ShootData[]): string[] => {
  // Get all services from shoots by this photographer
  const services = allShoots
    .filter(shoot => shoot.photographer.name === photographerName)
    .flatMap(shoot => shoot.services);
    
  // Count occurrences of each service
  const serviceCounts = services.reduce((acc, service) => {
    acc[service] = (acc[service] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Get top specialties (top 3 most frequent services)
  const topSpecialties = Object.entries(serviceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([service]) => service);
    
  // If no services found, return some default specialties
  if (topSpecialties.length === 0) {
    return ['Residential', 'Commercial', 'HDR'].sort(() => 0.5 - Math.random()).slice(0, 3);
  }
  
  return topSpecialties;
};

// Helper function to calculate photographer rating based on completed shoots
export const calculatePhotographerRating = (completedShoots: number): string => {
  // Base rating on number of completed shoots (simplified example)
  let baseRating = 3.5; // Start with a middle rating
  
  if (completedShoots > 20) {
    baseRating = 4.9;
  } else if (completedShoots > 10) {
    baseRating = 4.5;
  } else if (completedShoots > 5) {
    baseRating = 4.2;
  } else if (completedShoots > 0) {
    baseRating = 3.8;
  }
  
  // Add a small random variation
  const variation = (Math.random() * 0.4) - 0.2; // -0.2 to +0.2
  const finalRating = Math.min(5.0, Math.max(3.0, baseRating + variation));
  
  return finalRating.toFixed(1);
};
