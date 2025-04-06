
import { ShootData } from '@/types/shoots';

export const getPhotographerStats = (shoots: ShootData[], photographerId: string) => {
  // Filter shoots for a specific photographer
  const photographerShoots = shoots.filter(
    shoot => shoot.photographer && shoot.photographer.id === photographerId
  );

  // Calculate completed shoots
  const completedShoots = photographerShoots.filter(
    shoot => shoot.status === 'completed'
  );

  // Calculate scheduled shoots
  const scheduledShoots = photographerShoots.filter(
    shoot => shoot.status === 'scheduled'
  );

  // Calculate pending shoots
  const pendingShoots = photographerShoots.filter(
    shoot => shoot.status === 'pending'
  );

  // Calculate total earned
  const totalEarned = completedShoots.reduce((sum, shoot) => {
    return sum + (shoot.payment.totalPaid || 0);
  }, 0);

  // Calculate upcoming shoots (scheduled for future dates)
  const upcomingShoots = scheduledShoots.filter(shoot => {
    const shootDate = new Date(shoot.scheduledDate);
    const today = new Date();
    return shootDate > today;
  });

  // Calculate average shoot rating (placeholder - needs real rating data)
  const averageRating = 4.5; // Placeholder for now

  // Calculate service breakdown
  const serviceBreakdown = {};
  photographerShoots.forEach(shoot => {
    if (shoot.services) {
      shoot.services.forEach(service => {
        if (serviceBreakdown[service]) {
          serviceBreakdown[service] += 1;
        } else {
          serviceBreakdown[service] = 1;
        }
      });
    }
  });

  // Calculate efficiency (completed shoots / total assigned)
  const efficiency = photographerShoots.length > 0
    ? (completedShoots.length / photographerShoots.length) * 100
    : 0;

  return {
    totalShoots: photographerShoots.length,
    completedShoots: completedShoots.length,
    scheduledShoots: scheduledShoots.length,
    pendingShoots: pendingShoots.length,
    upcomingShoots: upcomingShoots.length,
    totalEarned,
    averageRating,
    serviceBreakdown,
    efficiency,
  };
};

export const sortPhotographersByPerformance = (shoots: ShootData[], photographers: any[]) => {
  return photographers.sort((a, b) => {
    const statsA = getPhotographerStats(shoots, a.id);
    const statsB = getPhotographerStats(shoots, b.id);
    
    // Sort by number of completed shoots
    return statsB.completedShoots - statsA.completedShoots;
  });
};
