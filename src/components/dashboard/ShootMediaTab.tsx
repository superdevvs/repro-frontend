
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { UploadIcon, Image as ImageIcon, File, X, ExternalLink } from "lucide-react";
import { ShootData } from '@/types/shoots';
import { useIsMobile } from '@/hooks/use-mobile';

interface MediaItem {
  id: string;
  type: 'image' | 'document';
  url: string;
  name: string;
  uploadedBy?: string;
  uploadDate?: string;
}

interface ShootMediaTabProps {
  shoot: ShootData;
  isPhotographer: boolean;
}

export function ShootMediaTab({ shoot, isPhotographer }: ShootMediaTabProps) {
  const isMobile = useIsMobile();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Mock media items for demonstration
  const mockMedia: MediaItem[] = [
    { id: '1', type: 'image', url: 'https://source.unsplash.com/random/800x600/?real,estate', name: 'Front View.jpg', uploadedBy: 'John Doe', uploadDate: '2023-06-15' },
    { id: '2', type: 'image', url: 'https://source.unsplash.com/random/800x600/?house', name: 'Living Room.jpg', uploadedBy: 'John Doe', uploadDate: '2023-06-15' },
    { id: '3', type: 'document', url: '#', name: 'Property Report.pdf', uploadedBy: 'John Doe', uploadDate: '2023-06-15' },
    { id: '4', type: 'image', url: 'https://source.unsplash.com/random/800x600/?kitchen', name: 'Kitchen.jpg', uploadedBy: 'John Doe', uploadDate: '2023-06-15' },
    { id: '5', type: 'image', url: 'https://source.unsplash.com/random/800x600/?bathroom', name: 'Bathroom.jpg', uploadedBy: 'John Doe', uploadDate: '2023-06-15' },
  ];
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      // Reset progress
      setUploadProgress(0);
    }
  };
  
  const handleUpload = () => {
    if (!selectedFile) return;
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        // Reset file selection after complete
        setTimeout(() => {
          setSelectedFile(null);
          setUploadProgress(0);
        }, 1000);
      }
    }, 300);
  };
  
  const renderMediaItem = (item: MediaItem) => {
    return (
      <div key={item.id} className="border rounded-lg overflow-hidden flex flex-col bg-white">
        <div className="aspect-video bg-gray-100 relative">
          {item.type === 'image' ? (
            <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-50">
              <File className="h-12 w-12 text-blue-500" />
            </div>
          )}
        </div>
        <div className="p-3">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-medium truncate">{item.name}</h4>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {item.uploadDate ? `Uploaded on ${item.uploadDate}` : 'Recently uploaded'}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      {/* Upload Section - only show for photographers */}
      {isPhotographer && (
        <div className="mb-6 border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Upload Media</h3>
          
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4 items-center`}>
            <div className={`${isMobile ? 'w-full' : 'w-3/4'} relative`}>
              <input
                type="file"
                id="file-upload"
                className="sr-only"
                onChange={handleFileChange}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 w-full"
              >
                <div>
                  <UploadIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm">
                    {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, PDF up to 10MB
                  </p>
                </div>
              </label>
              
              {/* Upload Progress Bar */}
              {uploadProgress > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-right mt-1">{uploadProgress}% uploaded</p>
                </div>
              )}
            </div>
            
            <div className={`${isMobile ? 'w-full' : 'w-1/4'} flex justify-center`}>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile}
                className="w-full"
              >
                <UploadIcon className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </div>
          </div>
          
          {selectedFile && (
            <div className="mt-4 bg-blue-50 p-3 rounded-md flex justify-between items-center">
              <div className="flex items-center">
                <File className="h-5 w-5 mr-2 text-blue-600" />
                <span className="text-sm truncate max-w-xs">{selectedFile.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedFile(null)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Media Gallery */}
      <div>
        <h3 className="text-lg font-medium mb-4">Media Gallery</h3>
        
        {mockMedia.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockMedia.map(renderMediaItem)}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">No media yet</h3>
            <p className="text-muted-foreground">
              {isPhotographer ? 
                "Upload media files for this shoot" : 
                "The photographer hasn't uploaded any media yet"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
