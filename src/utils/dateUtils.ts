
import { ShootData } from "@/types/shoots";
import { 
  format, 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear, 
  parseISO, 
  isValid, 
  isSameDay,
  isWithinInterval
} from "date-fns";
import { ensureDateString } from "./formatters";

export type TimeRange = 'day' | 'week' | 'month' | 'year' | 'all';

export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
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
      return null;
    default:
      return null;
  }
};

// Add the filterShootsByDateRange function
export const filterShootsByDateRange = (shoots: ShootData[], range: TimeRange): ShootData[] => {
  const dateRange = getDateRangeForFilter(range);
  
  if (!dateRange) return shoots; // Return all shoots for 'all' range
  
  return shoots.filter(shoot => {
    try {
      const shootDate = new Date(ensureDateString(shoot.scheduledDate));
      if (!isValid(shootDate)) return false;
      
      return isWithinInterval(shootDate, {
        start: dateRange.start,
        end: dateRange.end
      });
    } catch {
      return false;
    }
  });
};

// Add the missing functions for StatsCardGrid
export const getActiveShootsCount = (shoots: ShootData[]): number => {
  return shoots.filter(shoot => shoot.status === 'scheduled' || shoot.status === 'booked').length;
};

export const getTotalPaidAmount = (shoots: ShootData[]): number => {
  return shoots.reduce((total, shoot) => total + (shoot.payment?.totalPaid || 0), 0);
};

export const getUniqueClientsCount = (shoots: ShootData[]): number => {
  const uniqueClients = new Set(shoots.map(shoot => shoot.client.email));
  return uniqueClients.size;
};

export const getTotalMediaAssetsCount = (shoots: ShootData[]): number => {
  let count = 0;
  shoots.forEach(shoot => {
    if (shoot.media?.photos) count += shoot.media.photos.length;
    if (shoot.media?.videos) count += shoot.media.videos.length;
    if (shoot.media?.floorplans) count += shoot.media.floorplans.length;
  });
  return count;
};

export const getScheduledTodayShoots = (shoots: ShootData[]): ShootData[] => {
  const today = new Date();
  return shoots.filter(shoot => {
    try {
      const shootDate = new Date(ensureDateString(shoot.scheduledDate));
      return isSameDay(shootDate, today) && (shoot.status === 'scheduled' || shoot.status === 'booked');
    } catch {
      return false;
    }
  });
};

export const getEstimatedTaxAmount = (shoots: ShootData[]): number => {
  return shoots.reduce((total, shoot) => total + (shoot.payment?.taxAmount || 0), 0);
};

export const getCompletedShootsCount = (shoots: ShootData[]): number => {
  return shoots.filter(shoot => shoot.status === 'completed').length;
};
