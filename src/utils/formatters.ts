
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
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
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
