
/**
 * Convert data to CSV and trigger download
 * @param data Array of objects to convert to CSV
 * @param filename Name of the file to download
 */
export const downloadCSV = (data: Record<string, any>[], filename: string) => {
  // Get headers from the first item
  const headers = Object.keys(data[0] || {});
  
  // Create CSV rows
  const csvRows = [
    // Headers row
    headers.join(','),
    
    // Data rows
    ...data.map(row => 
      headers.map(header => {
        // Handle values that need to be escaped
        let value = row[header] === null || row[header] === undefined ? '' : row[header];
        
        // If the value contains a comma, quote, or newline, wrap it in quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          // Escape any quotes within the value
          value = value.replace(/"/g, '""');
          // Wrap in quotes
          value = `"${value}"`;
        }
        
        return value;
      }).join(',')
    )
  ];
  
  // Join rows with newlines
  const csvString = csvRows.join('\n');
  
  // Create blob and download link
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Set up download
  if (navigator.hasOwnProperty('msSaveBlob')) {
    // IE 10+
    (navigator as any).msSaveBlob(blob, filename);
  } else {
    // Other browsers
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
