
import { format, parseISO, isEqual, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { ensureDate, ensureDateString } from './formatters';
import { ShootData } from '@/types/shoots';

// Compare if two dates are the same day, handling both Date objects and strings
export function isSameDay(date1: string | Date | undefined, date2: string | Date | undefined): boolean {
  if (!date1 || !date2) return false;
  
  const d1 = ensureDate(date1);
  const d2 = ensureDate(date2);
  
  if (!d1 || !d2) return false;
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export type TimeRange = 'today' | 'week' | 'month' | 'all' | 'day' | 'year';

// Filter shoots by date range, such as today, this week, this month, or all
export function filterShootsByDateRange(shoots: ShootData[], range: TimeRange) {
  const today = new Date();
  
  return shoots.filter(shoot => {
    const shootDate = ensureDate(shoot.scheduledDate);
    if (!shootDate) return false;
    
    switch (range) {
      case 'today':
      case 'day':
        return isSameDay(shootDate, today);
      case 'week': {
        const start = startOfWeek(today);
        const end = endOfWeek(today);
        return shootDate >= start && shootDate <= end;
      }
      case 'month': {
        const start = startOfMonth(today);
        const end = endOfMonth(today);
        return shootDate >= start && shootDate <= end;
      }
      case 'year': {
        const start = startOfYear(today);
        const end = endOfYear(today);
        return shootDate >= start && shootDate <= end;
      }
      case 'all':
      default:
        return true;
    }
  });
}

// Calculate the total amount paid across all shoots
export function getTotalPaidAmount(shoots: ShootData[]): number {
  return shoots.reduce((total, shoot) => {
    return total + (shoot.payment?.totalPaid || 0);
  }, 0);
}

// Get the count of active shoots (those with "scheduled" or "booked" status)
export function getActiveShootsCount(shoots: ShootData[]): number {
  return shoots.filter(shoot => 
    shoot.status === 'scheduled' || shoot.status === 'booked'
  ).length;
}

// Get shoots scheduled for today
export function getScheduledTodayShoots(shoots: ShootData[]): ShootData[] {
  const today = new Date();
  return shoots.filter(shoot => isSameDay(shoot.scheduledDate, today));
}

// Get count of unique clients
export function getUniqueClientsCount(shoots: ShootData[]): number {
  const clientIds = new Set(
    shoots.map(shoot => shoot.client?.id).filter(Boolean)
  );
  return clientIds.size;
}

// Get total count of media items (photos, videos, etc)
export function getTotalMediaAssetsCount(shoots: ShootData[]): number {
  let count = 0;
  shoots.forEach(shoot => {
    count += shoot.media?.photos?.length || 0;
    count += shoot.media?.videos?.length || 0;
    count += shoot.media?.floorplans?.length || 0;
    count += shoot.media?.documents?.length || 0;
  });
  return count;
}

// Calculate estimated tax amount (15% of total revenue)
export function getEstimatedTaxAmount(shoots: ShootData[]): number {
  const totalRevenue = getTotalPaidAmount(shoots);
  return totalRevenue * 0.15;
}

// Get count of completed shoots
export function getCompletedShootsCount(shoots: ShootData[]): number {
  return shoots.filter(shoot => shoot.status === 'completed').length;
}
