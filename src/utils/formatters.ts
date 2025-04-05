
import { format, parseISO, isValid } from 'date-fns';

/**
 * Converts a Date object or date string to a Date object
 * Returns null for invalid dates or non-date values
 */
export function ensureDate(date: string | Date | undefined): Date | null {
  if (!date) return null;
  
  if (date instanceof Date) {
    return isValid(date) ? date : null;
  }
  
  try {
    const parsedDate = parseISO(date);
    return isValid(parsedDate) ? parsedDate : null;
  } catch (e) {
    return null;
  }
}

/**
 * Converts a Date object or date string to a string in the specified format
 * Safe to use with potentially invalid inputs
 */
export function formatDateSafe(
  date: string | Date | undefined, 
  dateFormat: string = 'MMM d, yyyy'
): string {
  const validDate = ensureDate(date);
  if (!validDate) return 'N/A';
  
  return format(validDate, dateFormat);
}

/**
 * Ensures a date value is returned as a string
 */
export function ensureDateString(date: string | Date | undefined): string {
  if (!date) return '';
  
  if (typeof date === 'string') {
    return date;
  }
  
  if (date instanceof Date && isValid(date)) {
    return date.toISOString();
  }
  
  return '';
}

/**
 * Extracts time portion from a date object or string
 */
export function getTimeFromDate(date: string | Date | undefined): string {
  const validDate = ensureDate(date);
  if (!validDate) return '';
  
  return format(validDate, 'h:mm a');
}

/**
 * Converts any ID (string or number) to string format
 */
export function toStringId(id: string | number | undefined): string {
  if (id === undefined || id === null) return '';
  return id.toString();
}
