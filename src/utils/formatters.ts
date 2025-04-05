
import { format, parseISO, isValid } from 'date-fns';

/**
 * Safely formats a date string or Date object
 * @param dateInput string | Date - The date to format
 * @param formatStr string - The format string (date-fns format)
 * @returns string - The formatted date string or fallback text
 */
export function formatDateSafe(dateInput: string | Date | undefined, formatStr: string = 'MMM dd, yyyy'): string {
  if (!dateInput) return 'Not set';
  
  try {
    const dateStr = ensureDateString(dateInput);
    const date = parseISO(dateStr);
    return isValid(date) ? format(date, formatStr) : 'Invalid date';
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
}

/**
 * Ensures a date value is a string before parsing
 * @param dateInput string | Date - The date to format
 * @returns string - A string representation of the date
 */
export function ensureDateString(dateInput: string | Date | undefined): string {
  if (!dateInput) return '';
  return typeof dateInput === 'string' ? dateInput : dateInput.toISOString();
}

/**
 * Converts a mix type (string or number) to string
 * @param value string | number | undefined
 * @returns string
 */
export function toStringId(value: string | number | undefined): string {
  if (value === undefined) return '';
  return typeof value === 'number' ? String(value) : value;
}

/**
 * Format currency values
 * @param value number | undefined
 * @returns string - Formatted currency
 */
export function formatCurrency(value: number | undefined): string {
  if (value === undefined) return '$0.00';
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Safely converts dates for use in components that expect strings
 * For use with components that don't accept Date objects
 * @param value string | Date | undefined
 * @returns string - The string representation or empty string
 */
export function dateToString(value: string | Date | undefined): string {
  if (!value) return '';
  const dateStr = ensureDateString(value);
  return dateStr;
}

/**
 * Ensures a date-like value is a Date object
 * @param dateInput string | Date | undefined
 * @returns Date | null
 */
export function ensureDate(dateInput: string | Date | undefined): Date | null {
  if (!dateInput) return null;
  
  if (dateInput instanceof Date) {
    return dateInput;
  }
  
  try {
    const date = parseISO(dateInput);
    return isValid(date) ? date : null;
  } catch {
    return null;
  }
}

/**
 * Get timestamp from a date for comparison purposes
 * @param dateInput string | Date | undefined
 * @returns number
 */
export function getTimeFromDate(dateInput: string | Date | undefined): number {
  const date = ensureDate(dateInput);
  return date ? date.getTime() : 0;
}
