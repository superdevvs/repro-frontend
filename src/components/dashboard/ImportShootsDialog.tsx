import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UploadIcon, FileTextIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
import { useShoots } from '@/context/ShootsContext';
import { v4 as uuidv4 } from 'uuid';
import { ShootData } from '@/types/shoots';
import { toast } from 'sonner';

interface ImportShootsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportShootsDialog({ isOpen, onClose }: ImportShootsDialogProps) {
  const { addShoot } = useShoots();
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetImport = () => {
    setFile(null);
    setImportResult(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setImportResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setImportResult(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const parseCSV = (text: string): string[][] => {
    // Split by newline first
    const rows = text.split(/\r?\n/).filter(row => row.trim() !== '');
    
    const result: string[][] = [];
    
    for (const row of rows) {
      // Custom CSV parsing to handle quotes and commas
      const cells: string[] = [];
      let currentCell = '';
      let inQuotes = false;
      
      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          cells.push(currentCell.trim());
          currentCell = '';
        } else if (char === '\t' && !inQuotes) {
          // Support for TSV format
          cells.push(currentCell.trim());
          currentCell = '';
        } else {
          currentCell += char;
        }
      }
      
      // Don't forget the last cell
      cells.push(currentCell.trim());
      result.push(cells);
    }
    
    return result;
  };

  const processImport = async () => {
    if (!file) return;
    
    setImporting(true);
    
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      
      if (rows.length < 2) {
        toast.error("Invalid file format. The file should contain headers and at least one data row.");
        setImporting(false);
        return;
      }
      
      const headers = rows[0];
      const successfulImports = [];
      const failedImports = [];
      
      // Create a mapping of header indices to their column names
      const headerMap: Record<string, number> = {};
      headers.forEach((header, index) => {
        headerMap[header.trim().toLowerCase()] = index;
      });
      
      // Process each data row
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length !== headers.length) {
          failedImports.push(i);
          continue;
        }
        
        try {
          const getValue = (columnName: string) => {
            const index = headerMap[columnName.toLowerCase()];
            return index !== undefined ? row[index] : '';
          };
          
          // Parse currency values
          const parseCurrency = (value: string): number => {
            const cleaned = value.replace(/[^0-9.]/g, '');
            return cleaned ? parseFloat(cleaned) : 0;
          };
          
          // Convert services from string to array
          const parseServices = (services: string): string[] => {
            if (!services) return [];
            return [services.trim()];
          };
          
          // Create new slot object
          const newShoot: ShootData = {
            id: uuidv4(),
            scheduledDate: getValue('scheduled') || new Date().toISOString(),
            completedDate: getValue('completed') || undefined,
            client: {
              id: uuidv4(),
              name: getValue('client') || 'Unknown Client',
              email: getValue('client email') || 'unknown@example.com',
              phone: getValue('client phone') || undefined,
              company: getValue('client company') || undefined,
              totalShoots: parseInt(getValue('total shoots')) || 1,
            },
            location: {
              address: getValue('address') || '',
              address2: getValue('address2') || undefined,
              city: getValue('city') || '',
              state: getValue('state') || '',
              zip: getValue('zip') || '',
              fullAddress: getValue('full address') || getValue('address') || '',
            },
            photographer: {
              id: uuidv4(),
              name: getValue('photographer') || 'Unassigned',
              email: 'photographer@example.com',
            },
            services: parseServices(getValue('services')),
            payment: {
              baseQuote: parseCurrency(getValue('base quote')),
              taxRate: parseCurrency(getValue('tax')),
              taxAmount: parseCurrency(getValue('tax amount')),
              totalQuote: parseCurrency(getValue('total quote')),
              totalPaid: parseCurrency(getValue('total paid')) || 0,
              lastPaymentDate: getValue('last payment date') || undefined,
              lastPaymentType: getValue('last payment type') || undefined,
            },
            tourPurchased: getValue('tour purchased') === 'Yes' || getValue('tour purchased') === 'TRUE',
            notes: {
              shootNotes: getValue('shoot notes') || undefined,
              photographerNotes: getValue('photographer notes') || undefined,
            },
            createdBy: getValue('user account created by') || undefined,
            status: getValue('completed') ? 'completed' : 'scheduled',
          };
          
          // Add the shoot to the context
          addShoot(newShoot);
          successfulImports.push(i);
        } catch (error) {
          console.error(`Error importing row ${i}:`, error);
          failedImports.push(i);
        }
      }
      
      setImportResult({
        success: successfulImports.length,
        failed: failedImports.length,
      });
      
      toast.success(`Successfully imported ${successfulImports.length} shoots`);
      if (failedImports.length > 0) {
        toast.error(`Failed to import ${failedImports.length} shoots`);
      }
    } catch (error) {
      console.error('Error reading file:', error);
      toast.error("Error reading file. Please make sure it's a valid CSV or text file.");
    } finally {
      setImporting(false);
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClose = () => {
    resetImport();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Shoots</DialogTitle>
          <DialogDescription>
            Upload a CSV file with your shoot data to import it into the system.
          </DialogDescription>
        </DialogHeader>
        
        <div 
          className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center ${file ? 'border-primary' : 'border-muted'}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            accept=".csv,.txt,.tsv" 
          />
          
          {!file && !importResult && (
            <div className="flex flex-col items-center gap-2">
              <FileTextIcon className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag and drop your file here, or click to browse
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={handleImportClick}
              >
                <UploadIcon className="h-4 w-4 mr-2" /> Select File
              </Button>
            </div>
          )}
          
          {file && !importResult && (
            <div className="flex flex-col items-center gap-2">
              <FileTextIcon className="h-10 w-10 text-primary" />
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          )}
          
          {importResult && (
            <div className="flex flex-col items-center gap-2">
              {importResult.success > 0 && (
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <p className="text-sm">Successfully imported {importResult.success} shoots</p>
                </div>
              )}
              
              {importResult.failed > 0 && (
                <div className="flex items-center gap-2">
                  <AlertCircleIcon className="h-5 w-5 text-destructive" />
                  <p className="text-sm">Failed to import {importResult.failed} shoots</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          {file && !importResult && (
            <Button onClick={resetImport} variant="outline" size="sm">
              Change File
            </Button>
          )}
          
          {importResult && (
            <Button onClick={resetImport} variant="outline" size="sm">
              Import Another File
            </Button>
          )}
          
          <div className="flex gap-2">
            <Button onClick={handleClose} variant="outline">
              Close
            </Button>
            
            {file && !importResult && (
              <Button onClick={processImport} disabled={importing}>
                {importing ? "Importing..." : "Import Shoots"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
