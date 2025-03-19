
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircleIcon, 
  ArrowUpIcon, 
  CheckCircleIcon, 
  FileIcon, 
  FolderIcon, 
  ImageIcon, 
  FilmIcon, 
  XIcon, 
  UploadCloudIcon 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  shootId?: string;
  onUploadComplete?: (files: File[]) => void;
  allowedFileTypes?: string[];
  className?: string;
}

export function FileUploader({
  shootId,
  onUploadComplete,
  allowedFileTypes = [
    'image/jpeg', 'image/png', 'image/tiff', 
    'video/mp4', 'video/quicktime',
    'application/zip', 'application/x-zip-compressed'
  ],
  className
}: FileUploaderProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadType, setUploadType] = useState<'raw' | 'edited'>('raw');
  const [notes, setNotes] = useState('');
  
  // File validation
  const validateFiles = (fileList: FileList | File[]) => {
    const validFiles: File[] = [];
    const invalidFiles: { file: File; reason: string }[] = [];
    
    Array.from(fileList).forEach(file => {
      // Check file type
      if (!allowedFileTypes.includes(file.type)) {
        invalidFiles.push({ file, reason: 'File type not supported' });
        return;
      }
      
      // Check file size (100MB max)
      if (file.size > 100 * 1024 * 1024) {
        invalidFiles.push({ file, reason: 'File exceeds 100MB size limit' });
        return;
      }
      
      validFiles.push(file);
    });
    
    // Show error for invalid files
    if (invalidFiles.length > 0) {
      toast({
        title: `${invalidFiles.length} file(s) couldn't be added`,
        description: invalidFiles.map(f => `${f.file.name}: ${f.reason}`).join(', '),
        variant: 'destructive',
      });
    }
    
    return validFiles;
  };
  
  // Handle file selection from input
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const validFiles = validateFiles(e.target.files);
    setFiles(prev => [...prev, ...validFiles]);
  };
  
  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    dropzoneRef.current?.classList.remove('border-primary', 'bg-primary/5');
    
    if (!e.dataTransfer.files?.length) return;
    
    const validFiles = validateFiles(e.dataTransfer.files);
    setFiles(prev => [...prev, ...validFiles]);
  };
  
  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dropzoneRef.current?.classList.add('border-primary', 'bg-primary/5');
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dropzoneRef.current?.classList.remove('border-primary', 'bg-primary/5');
  };
  
  // Remove file from list
  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Clear all files
  const handleClearFiles = () => {
    setFiles([]);
  };
  
  // Start upload process
  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: 'No files selected',
        description: 'Please select files to upload',
        variant: 'destructive',
      });
      return;
    }
    
    setUploading(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
    
    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      // Group files by type for the success message
      const imageFiles = files.filter(f => f.type.startsWith('image/')).length;
      const videoFiles = files.filter(f => f.type.startsWith('video/')).length;
      const zipFiles = files.filter(f => f.type.includes('zip')).length;
      
      // Call the onUploadComplete callback
      if (onUploadComplete) {
        onUploadComplete(files);
      }
      
      toast({
        title: 'Upload Complete',
        description: `Successfully uploaded ${files.length} files (${imageFiles} photos, ${videoFiles} videos, ${zipFiles} zip files)`,
      });
      
      // Reset the uploader
      setUploading(false);
      setProgress(0);
      setFiles([]);
      setNotes('');
    }, 4000);
  };
  
  // Get file type icon
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    } else if (file.type.startsWith('video/')) {
      return <FilmIcon className="h-5 w-5 text-purple-500" />;
    } else if (file.type.includes('zip')) {
      return <FolderIcon className="h-5 w-5 text-yellow-500" />;
    } else {
      return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <UploadCloudIcon className="h-5 w-5 text-primary" />
          <CardTitle>File Uploader</CardTitle>
        </div>
        
        {shootId && (
          <Badge variant="outline">
            Shoot #{shootId}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="p-4">
        <Tabs value={uploadType} onValueChange={(v: any) => setUploadType(v)} className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="raw">Raw/Unedited Files</TabsTrigger>
            <TabsTrigger value="edited">Edited/Final Files</TabsTrigger>
          </TabsList>
          <TabsContent value="raw" className="pt-4">
            <div className="text-sm text-muted-foreground mb-4">
              Upload RAW, unedited files for processing. Supported formats: JPG, PNG, TIFF, NEF, CR2, CR3, ARW, DNG (photos), MP4, MOV (videos), ZIP (iGuide).
            </div>
          </TabsContent>
          <TabsContent value="edited" className="pt-4">
            <div className="text-sm text-muted-foreground mb-4">
              Upload final, edited files ready for client delivery. Supported formats: JPG, PNG (photos), MP4 (videos), ZIP (packages).
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Dropzone */}
        <div
          ref={dropzoneRef}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            multiple
            hidden
          />
          
          <UploadCloudIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Drop files here or click to browse</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Upload up to 100 files at once (100MB max per file)
          </p>
          <Button variant="outline" className="mt-2" disabled={uploading}>
            <ArrowUpIcon className="h-4 w-4 mr-2" />
            Select Files
          </Button>
        </div>
        
        {/* Notes */}
        <div className="mt-4">
          <label htmlFor="notes" className="text-sm font-medium block mb-2">
            Upload Notes (optional)
          </label>
          <textarea
            id="notes"
            className="w-full min-h-[100px] p-3 rounded-md border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Add notes for the editor about these files..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={uploading}
          ></textarea>
        </div>
        
        {/* Selected files list */}
        {files.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Selected Files ({files.length})</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearFiles}
                disabled={uploading}
              >
                Clear All
              </Button>
            </div>
            
            <div className="max-h-64 overflow-y-auto rounded-md border border-border">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center overflow-hidden">
                    {getFileIcon(file)}
                    <div className="ml-3 overflow-hidden">
                      <p className="font-medium truncate" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => handleRemoveFile(index)}
                    disabled={uploading}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Upload progress */}
        {uploading && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Uploading {files.length} files...</p>
              <p className="text-sm">{progress}%</p>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {/* Action buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
          {!uploading && (
            <>
              <Button variant="outline" onClick={handleClearFiles} disabled={files.length === 0}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={files.length === 0}>
                <UploadCloudIcon className="h-4 w-4 mr-2" />
                Upload {files.length > 0 ? `(${files.length} files)` : ''}
              </Button>
            </>
          )}
          
          {uploading && (
            <Button variant="outline" disabled>
              Uploading...
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default FileUploader;
