
import { ShootData } from "@/types/shoots";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, parseISO, isValid, isSameDay } from "date-fns";
import { ensureDateString } from "./formatters";

export type TimeRange = 'day' | 'week' | 'month' | 'year' | 'all';

export const formatDate = (dateString: string | Date): string => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) return 'Invalid date';
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export const getDateRangeLabel = (range: TimeRange): string => {
  const today = new Date();
  
  switch (range) {
    case 'day':
      return `Today, ${format(today, 'MMM dd')}`;
    case 'week':
      return `This Week, ${format(startOfWeek(today), 'MMM dd')} - ${format(endOfWeek(today), 'MMM dd')}`;
    case 'month':
      return `This Month, ${format(today, 'MMMM yyyy')}`;
    case 'year':
      return `This Year, ${format(today, 'yyyy')}`;
    case 'all':
      return 'All Time';
    default:
      return '';
  }
};

export const getDateRangeForFilter = (range: TimeRange): { start: Date, end: Date } | null => {
  const today = new Date();
  
  switch (range) {
    case 'day':
      return {
        start: startOfDay(today),
        end: endOfDay(today),
      };
    case 'week':
      return {
        start: startOfWeek(today),
        end: endOfWeek(today),
      };
    case 'month':
      return {
        start: startOfMonth(today),
        end: endOfMonth(today),
      };
    case 'year':
      return {
        start: startOfYear(today),
        end: endOfYear(today),
      };
    case 'all':
      return null; // No date filtering for 'all'
    default:
      return null;
  }
};

export const filterShootsByDateRange = (shoots: ShootData[], range: TimeRange): ShootData[] => {
  const dateRange = getDateRangeForFilter(range);
  
  if (!dateRange) {
    return shoots; // Return all shoots if no date range
  }
  
  return shoots.filter(shoot => {
    const shootDate = new Date(ensureDateString(shoot.scheduledDate));
    return shootDate >= dateRange.start && shootDate <= dateRange.end;
  });
};

export const filterCompletedShootsByDateRange = (shoots: ShootData[], range: TimeRange): ShootData[] => {
  const dateRange = getDateRangeForFilter(range);
  
  if (!dateRange) {
    return shoots.filter(shoot => shoot.status === 'completed');
  }
  
  return shoots.filter(shoot => {
    const isCompleted = shoot.status === 'completed';
    if (!isCompleted) return false;
    
    // For completed shoots, use the completed date if available
    const dateToCheck = shoot.completedDate 
      ? new Date(shoot.completedDate)
      : new Date(ensureDateString(shoot.scheduledDate));
      
    return dateToCheck >= dateRange.start && dateToCheck <= dateRange.end;
  });
};

export const getMediaCountForShoots = (shoots: ShootData[]): { photos: number, videos: number, floorplans: number } => {
  return shoots.reduce((counts, shoot) => {
    if (shoot.media) {
      counts.photos += shoot.media.photos?.length || 0;
      counts.videos += shoot.media.videos?.length || 0;
      counts.floorplans += shoot.media.floorplans?.length || 0;
    }
    return counts;
  }, { photos: 0, videos: 0, floorplans: 0 });
};

// Add the missing utility functions needed by StatsCardGrid
export const getActiveShootsCount = (shoots: ShootData[]): number => {
  return shoots.filter(shoot => 
    shoot.status === 'scheduled' || 
    shoot.status === 'pending' || 
    shoot.status === 'booked'
  ).length;
};

export const getScheduledTodayShoots = (shoots: ShootData[]): ShootData[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return shoots.filter(shoot => {
    const shootDate = new Date(ensureDateString(shoot.scheduledDate));
    shootDate.setHours(0, 0, 0, 0);
    return isSameDay(shootDate, today) && shoot.status === 'scheduled';
  });
};

export const getTotalPaidAmount = (shoots: ShootData[]): number => {
  return shoots.reduce((total, shoot) => {
    return total + (shoot.payment?.totalPaid || 0);
  }, 0);
};

export const getEstimatedTaxAmount = (shoots: ShootData[]): number => {
  // Calculate 15% of total revenue as estimated tax
  return getTotalPaidAmount(shoots) * 0.15;
};

export const getUniqueClientsCount = (shoots: ShootData[]): number => {
  const uniqueClients = new Set();
  
  shoots.forEach(shoot => {
    if (shoot.client?.id) {
      uniqueClients.add(shoot.client.id.toString());
    } else if (shoot.client?.email) {
      uniqueClients.add(shoot.client.email);
    }
  });
  
  return uniqueClients.size;
};

export const getTotalMediaAssetsCount = (shoots: ShootData[]): number => {
  return shoots.reduce((total, shoot) => {
    if (!shoot.media) return total;
    
    const photosCount = shoot.media.photos?.length || 0;
    const videosCount = shoot.media.videos?.length || 0;
    const floorplansCount = shoot.media.floorplans?.length || 0;
    const slideshowsCount = shoot.media.slideshows?.length || 0;
    
    return total + photosCount + videosCount + floorplansCount + slideshowsCount;
  }, 0);
};

export const getCompletedShootsCount = (shoots: ShootData[]): number => {
  return shoots.filter(shoot => shoot.status === 'completed').length;
};
