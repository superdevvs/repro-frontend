
import { startOfDay, startOfWeek, startOfMonth, startOfYear, endOfDay, endOfWeek, endOfMonth, endOfYear, isWithinInterval, isSameDay, parseISO, format, differenceInDays } from 'date-fns';
import { ShootData } from '@/types/shoots';

export type TimeRange = 'today' | 'day' | 'week' | 'month' | 'year' | 'all';

export const getRangeStartEnd = (range: TimeRange): { start: Date; end: Date } => {
  const now = new Date();
  
  switch (range) {
    case 'day':
    case 'today':
      return { 
        start: startOfDay(now),
        end: endOfDay(now)
      };
    case 'week':
      return { 
        start: startOfWeek(now, { weekStartsOn: 0 }),
        end: endOfWeek(now, { weekStartsOn: 0 })
      };
    case 'month':
      return { 
        start: startOfMonth(now),
        end: endOfMonth(now)
      };
    case 'year':
      return { 
        start: startOfYear(now),
        end: endOfYear(now)
      };
    case 'all':
    default:
      return {
        start: new Date(0), // Beginning of time
        end: new Date(8640000000000000) // End of time according to JS
      };
  }
};

export const isDateInRange = (date: Date, range: TimeRange): boolean => {
  const { start, end } = getRangeStartEnd(range);
  return isWithinInterval(date, { start, end });
};

// Added formatDate function
export const formatDate = (date: string | Date | undefined): string => {
  if (!date) return 'N/A';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, 'MMMM d, yyyy');
  } catch (e) {
    return 'Invalid Date';
  }
};

// Added getDaysSince function
export const getDaysSince = (date: string | Date | undefined): number => {
  if (!date) return 0;
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return differenceInDays(new Date(), parsedDate);
  } catch (e) {
    return 0;
  }
};

// Filter shoots by date range
export const filterShootsByDateRange = (shoots: ShootData[], range: TimeRange): ShootData[] => {
  const { start, end } = getRangeStartEnd(range);
  return shoots.filter(shoot => {
    const shootDate = typeof shoot.scheduledDate === 'string' 
      ? parseISO(shoot.scheduledDate)
      : new Date(shoot.scheduledDate);
    
    return isWithinInterval(shootDate, { start, end });
  });
};

// Get active shoots count (scheduled or in progress)
export const getActiveShootsCount = (shoots: ShootData[]): number => {
  return shoots.filter(shoot => ['scheduled', 'in-progress'].includes(shoot.status)).length;
};

// Calculate total paid amount from all shoots
export const getTotalPaidAmount = (shoots: ShootData[]): number => {
  return shoots.reduce((total, shoot) => {
    return total + (shoot.payment?.totalPaid || 0);
  }, 0);
};

// Count unique clients
export const getUniqueClientsCount = (shoots: ShootData[]): number => {
  const uniqueClientIds = new Set(shoots.map(shoot => shoot.client.id));
  return uniqueClientIds.size;
};

// Count total media assets across all shoots
export const getTotalMediaAssetsCount = (shoots: ShootData[]): number => {
  return shoots.reduce((total, shoot) => {
    const photoCount = shoot.media?.photos?.length || 0;
    const videoCount = shoot.media?.videos?.length || 0;
    const floorplanCount = shoot.media?.floorplans?.length || 0;
    const slideshowCount = shoot.media?.slideshows?.length || 0;
    
    return total + photoCount + videoCount + floorplanCount + slideshowCount;
  }, 0);
};

// Get shoots scheduled for today
export const getScheduledTodayShoots = (shoots: ShootData[]): ShootData[] => {
  const today = new Date();
  return shoots.filter(shoot => {
    if (shoot.status !== 'scheduled') return false;
    
    const shootDate = typeof shoot.scheduledDate === 'string'
      ? parseISO(shoot.scheduledDate)
      : new Date(shoot.scheduledDate);
    
    return isSameDay(shootDate, today);
  });
};

export { isSameDay };
