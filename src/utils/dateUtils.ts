
import { startOfDay, startOfWeek, startOfMonth, startOfYear, endOfDay, endOfWeek, endOfMonth, endOfYear, isWithinInterval, isSameDay } from 'date-fns';

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

export { isSameDay };
