
/**
 * Utility file for ID handling and conversion across the application
 */

/**
 * Converts any ID type to string for consistent usage
 * Especially useful for API calls and comparisons
 * @param id string | number - The ID to stringify
 */
export const stringifyId = (id: string | number | undefined): string => {
  if (id === undefined) return '';
  return typeof id === 'number' ? String(id) : id;
};

/**
 * Ensures a value is a valid ID string
 * @param value any - Value to check
 */
export const ensureValidId = (value: any): string => {
  if (!value) return '';
  return stringifyId(value);
};
