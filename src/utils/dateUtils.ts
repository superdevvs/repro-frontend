
import { format, parseISO, isEqual, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ensureDate, ensureDateString } from './formatters';

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

export type TimeRange = 'today' | 'week' | 'month' | 'all';

// Filter shoots by date range, such as today, this week, this month, or all
export function filterShootsByDateRange(shoots: any[], range: TimeRange) {
  const today = new Date();
  
  return shoots.filter(shoot => {
    const shootDate = ensureDate(shoot.scheduledDate);
    if (!shootDate) return false;
    
    switch (range) {
      case 'today':
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
      case 'all':
      default:
        return true;
    }
  });
}
