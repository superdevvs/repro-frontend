
// import React, { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { UploadIcon, Image as ImageIcon, File, X, ExternalLink } from "lucide-react";
// import { ShootData } from '@/types/shoots';
// import { useIsMobile } from '@/hooks/use-mobile';

// interface MediaItem {
//   id: string;
//   type: 'image' | 'document';
//   url: string;
//   name: string;
//   uploadedBy?: string;
//   uploadDate?: string;
// }

// interface ShootMediaTabProps {
//   shoot: ShootData;
//   isPhotographer: boolean;
// }

// export function ShootMediaTab({ shoot, isPhotographer }: ShootMediaTabProps) {
//   const isMobile = useIsMobile();
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
  
//   // Mock media items for demonstration
//   const mockMedia: MediaItem[] = [
//     { id: '1', type: 'image', url: 'https://source.unsplash.com/random/800x600/?real,estate', name: 'Front View.jpg', uploadedBy: 'John Doe', uploadDate: '2023-06-15' },
//     { id: '2', type: 'image', url: 'https://source.unsplash.com/random/800x600/?house', name: 'Living Room.jpg', uploadedBy: 'John Doe', uploadDate: '2023-06-15' },
//     { id: '3', type: 'document', url: '#', name: 'Property Report.pdf', uploadedBy: 'John Doe', uploadDate: '2023-06-15' },
//     { id: '4', type: 'image', url: 'https://source.unsplash.com/random/800x600/?kitchen', name: 'Kitchen.jpg', uploadedBy: 'John Doe', uploadDate: '2023-06-15' },
//     { id: '5', type: 'image', url: 'https://source.unsplash.com/random/800x600/?bathroom', name: 'Bathroom.jpg', uploadedBy: 'John Doe', uploadDate: '2023-06-15' },
//   ];
  
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files[0]) {
//       setSelectedFile(event.target.files[0]);
//       // Reset progress
//       setUploadProgress(0);
//     }
//   };
  
//   const handleUpload = () => {
//     if (!selectedFile) return;
    
//     // Simulate upload progress
//     let progress = 0;
//     const interval = setInterval(() => {
//       progress += 10;
//       setUploadProgress(progress);
      
//       if (progress >= 100) {
//         clearInterval(interval);
//         // Reset file selection after complete
//         setTimeout(() => {
//           setSelectedFile(null);
//           setUploadProgress(0);
//         }, 1000);
//       }
//     }, 300);
//   };
  
//   const renderMediaItem = (item: MediaItem) => {
//     return (
//       <div key={item.id} className="border rounded-lg overflow-hidden flex flex-col bg-white">
//         <div className="aspect-video bg-gray-100 relative">
//           {item.type === 'image' ? (
//             <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center bg-blue-50">
//               <File className="h-12 w-12 text-blue-500" />
//             </div>
//           )}
//         </div>
//         <div className="p-3">
//           <div className="flex justify-between items-start">
//             <h4 className="text-sm font-medium truncate">{item.name}</h4>
//             <Button variant="ghost" size="icon" className="h-6 w-6">
//               <ExternalLink className="h-4 w-4" />
//             </Button>
//           </div>
//           <div className="text-xs text-muted-foreground mt-1">
//             {item.uploadDate ? `Uploaded on ${item.uploadDate}` : 'Recently uploaded'}
//           </div>
//         </div>
//       </div>
//     );
//   };
  
//   return (
//     <div>
//       {/* Upload Section - only show for photographers */}
//       {isPhotographer && (
//         <div className="mb-6 border rounded-lg p-4">
//           <h3 className="text-lg font-medium mb-4">Upload Media</h3>
          
//           <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4 items-center`}>
//             <div className={`${isMobile ? 'w-full' : 'w-3/4'} relative`}>
//               <input
//                 type="file"
//                 id="file-upload"
//                 className="sr-only"
//                 onChange={handleFileChange}
//               />
//               <label
//                 htmlFor="file-upload"
//                 className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 w-full"
//               >
//                 <div>
//                   <UploadIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
//                   <p className="text-sm">
//                     {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
//                   </p>
//                   <p className="text-xs text-gray-500 mt-1">
//                     JPG, PNG, PDF up to 10MB
//                   </p>
//                 </div>
//               </label>
              
//               {/* Upload Progress Bar */}
//               {uploadProgress > 0 && (
//                 <div className="mt-2">
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div
//                       className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                       style={{ width: `${uploadProgress}%` }}
//                     ></div>
//                   </div>
//                   <p className="text-xs text-right mt-1">{uploadProgress}% uploaded</p>
//                 </div>
//               )}
//             </div>
            
//             <div className={`${isMobile ? 'w-full' : 'w-1/4'} flex justify-center`}>
//               <Button
//                 onClick={handleUpload}
//                 disabled={!selectedFile}
//                 className="w-full"
//               >
//                 <UploadIcon className="mr-2 h-4 w-4" />
//                 Upload
//               </Button>
//             </div>
//           </div>
          
//           {selectedFile && (
//             <div className="mt-4 bg-blue-50 p-3 rounded-md flex justify-between items-center">
//               <div className="flex items-center">
//                 <File className="h-5 w-5 mr-2 text-blue-600" />
//                 <span className="text-sm truncate max-w-xs">{selectedFile.name}</span>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => setSelectedFile(null)}
//                 className="h-8 w-8"
//               >
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>
//           )}
//         </div>
//       )}
      
//       {/* Media Gallery */}
//       <div>
//         <h3 className="text-lg font-medium mb-4">Media Gallery</h3>
        
//         {mockMedia.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {mockMedia.map(renderMediaItem)}
//           </div>
//         ) : (
//           <div className="text-center py-12 border rounded-lg">
//             <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//             <h3 className="text-lg font-medium">No media yet</h3>
//             <p className="text-muted-foreground">
//               {isPhotographer ? 
//                 "Upload media files for this shoot" : 
//                 "The photographer hasn't uploaded any media yet"
//               }
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// import React, { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { UploadIcon, Image as ImageIcon, File, X, ExternalLink } from "lucide-react";
// import { ShootData } from '@/types/shoots';
// import { useIsMobile } from '@/hooks/use-mobile';

// interface MediaItem {
//   id: string;
//   type: 'image' | 'document';
//   url: string;
//   name: string;
//   uploadedBy?: string;
//   uploadDate?: string;
// }

// interface ShootMediaTabProps {
//   shoot: ShootData;
//   isPhotographer: boolean;
// }

// export function ShootMediaTab({ shoot, isPhotographer }: ShootMediaTabProps) {
//   const isMobile = useIsMobile();
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [uploadProgress, setUploadProgress] = useState(0);

//   // Convert real files from API to MediaItem[]
//   const realMedia: MediaItem[] = Array.isArray(shoot.files)
//     ? shoot.files.map((file) => ({
//         id: String(file.id),
//         type: file.fileType?.startsWith('image/') ? 'image' : 'document',
//         url: file.url,
//         name: file.filename,
//         uploadedBy: file.uploadedBy,
//         uploadDate: file.created_at ? new Date(file.created_at).toLocaleDateString() : undefined,
//       }))
//     : [];

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files[0]) {
//       setSelectedFile(event.target.files[0]);
//       setUploadProgress(0);
//     }
//   };

//   const handleUpload = () => {
//     if (!selectedFile) return;

//     // Simulate upload progress
//     let progress = 0;
//     const interval = setInterval(() => {
//       progress += 10;
//       setUploadProgress(progress);

//       if (progress >= 100) {
//         clearInterval(interval);
//         setTimeout(() => {
//           setSelectedFile(null);
//           setUploadProgress(0);
//         }, 1000);
//       }
//     }, 300);
//   };

//   const renderMediaItem = (item: MediaItem) => (
//     <div key={item.id} className="border rounded-lg overflow-hidden flex flex-col bg-white">
//       <div className="aspect-video bg-gray-100 relative">
//         {item.type === 'image' ? (
//           <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center bg-blue-50">
//             <File className="h-12 w-12 text-blue-500" />
//           </div>
//         )}
//       </div>
//       {/* <div className="p-3">
//         <div className="flex justify-between items-start">
//           <h4 className="text-sm font-medium truncate">{item.name}</h4>
//           <a href={item.url} target="_blank" rel="noopener noreferrer">
//             <Button variant="ghost" size="icon" className="h-6 w-6">
//               <ExternalLink className="h-4 w-4" />
//             </Button>
//           </a>
//         </div>
//         <div className="text-xs text-muted-foreground mt-1">
//           {item.uploadDate ? `Uploaded on ${item.uploadDate}` : 'Recently uploaded'}
//         </div>
//       </div> */}
//     </div>
//   );

//   return (
//     <div>
//       {/* Upload Section - only for photographers */}
//       {isPhotographer && (
//         <div className="mb-6 border rounded-lg p-4">
//           <h3 className="text-lg font-medium mb-4">Upload Media</h3>

//           <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4 items-center`}>
//             <div className={`${isMobile ? 'w-full' : 'w-3/4'} relative`}>
//               <input
//                 type="file"
//                 id="file-upload"
//                 className="sr-only"
//                 onChange={handleFileChange}
//               />
//               <label
//                 htmlFor="file-upload"
//                 className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 w-full"
//               >
//                 <div>
//                   <UploadIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
//                   <p className="text-sm">
//                     {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
//                   </p>
//                   <p className="text-xs text-gray-500 mt-1">JPG, PNG, PDF up to 10MB</p>
//                 </div>
//               </label>

//               {uploadProgress > 0 && (
//                 <div className="mt-2">
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div
//                       className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                       style={{ width: `${uploadProgress}%` }}
//                     ></div>
//                   </div>
//                   <p className="text-xs text-right mt-1">{uploadProgress}% uploaded</p>
//                 </div>
//               )}
//             </div>

//             <div className={`${isMobile ? 'w-full' : 'w-1/4'} flex justify-center`}>
//               <Button onClick={handleUpload} disabled={!selectedFile} className="w-full">
//                 <UploadIcon className="mr-2 h-4 w-4" />
//                 Upload
//               </Button>
//             </div>
//           </div>

//           {selectedFile && (
//             <div className="mt-4 bg-blue-50 p-3 rounded-md flex justify-between items-center">
//               <div className="flex items-center">
//                 <File className="h-5 w-5 mr-2 text-blue-600" />
//                 <span className="text-sm truncate max-w-xs">{selectedFile.name}</span>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => setSelectedFile(null)}
//                 className="h-8 w-8"
//               >
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Media Gallery */}
//       <div>
//         <h3 className="text-lg font-medium mb-4">Media Gallery</h3>

//         {realMedia.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {realMedia.map(renderMediaItem)}
//           </div>
//         ) : (
//           <div className="text-center py-12 border rounded-lg">
//             <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//             <h3 className="text-lg font-medium">No media yet</h3>
//             <p className="text-muted-foreground">
//               {isPhotographer
//                 ? "Upload media files for this shoot"
//                 : "The photographer hasn't uploaded any media yet"}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

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

  // Download state
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 });

  // Convert real files from API to MediaItem[]
  const realMedia: MediaItem[] = Array.isArray((shoot as any).files)
    ? (shoot as any).files.map((file: any) => ({
        id: String(file.id),
        type: file.fileType?.startsWith('image/') ? 'image' : 'document',
        url: file.url,
        name: file.filename,
        uploadedBy: file.uploadedBy,
        uploadDate: file.created_at ? new Date(file.created_at).toLocaleDateString() : undefined,
      }))
    : [];

  const imageItems = realMedia.filter(m => m.type === 'image');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
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
        setTimeout(() => {
          setSelectedFile(null);
          setUploadProgress(0);
        }, 1000);
      }
    }, 300);
  };

  const renderMediaItem = (item: MediaItem) => (
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
      {/* metadata omitted to keep layout compact */}
    </div>
  );

  // Utility: download blob with suggested filename
  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // suggest filename
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000 * 5);
  };

  // Main: download all images (sequential fallback)
  const handleDownloadAll = async () => {
    if (downloading) return;
    if (imageItems.length === 0) {
      alert("No images available to download.");
      return;
    }

    setDownloading(true);
    setDownloadProgress({ done: 0, total: imageItems.length });

    try {
      // Attempt server-side zip first (optional). If backend supports endpoint, it should return a zip.
      // try {
      //   const zipResp = await fetch(`/api/shoots/${shoot.id}/download-all`, { method: 'GET' });
      //   if (zipResp.ok) {
      //     const contentType = zipResp.headers.get('content-type') || '';
      //     if (contentType.includes('zip') || contentType.includes('application/octet-stream')) {
      //       const blob = await zipResp.blob();
      //       downloadBlob(blob, `shoot-${shoot.id}-photos.zip`);
      //       setDownloadProgress({ done: imageItems.length, total: imageItems.length });
      //       setDownloading(false);
      //       return;
      //     }
      //     // otherwise fallback to client downloads
      //   }
      // } catch (err) {
      //   // ignore and fallback
      // }

      // Fallback: download images one by one (sequential)
      for (let i = 0; i < imageItems.length; i++) {
        const item = imageItems[i];
        try {
          const resp = await fetch(item.url);
          if (!resp.ok) {
            console.warn(`Failed to fetch ${item.url}: ${resp.status}`);
            setDownloadProgress(p => ({ done: p.done + 1, total: p.total }));
            continue;
          }
          const blob = await resp.blob();
          const suggestedName = item.name || `photo-${i + 1}.jpg`;
          downloadBlob(blob, suggestedName);
        } catch (err) {
          console.error("Download error for", item.url, err);
        } finally {
          setDownloadProgress(p => ({ done: p.done + 1, total: p.total }));
          // small delay so browser can handle many downloads smoothly
          // and UI gets a chance to update
          // eslint-disable-next-line no-await-in-loop
          await new Promise(r => setTimeout(r, 200));
        }
      }
    } catch (err) {
      console.error("Download all failed", err);
      alert("Failed to download all images.");
    } finally {
      setTimeout(() => {
        setDownloading(false);
        setDownloadProgress({ done: 0, total: 0 });
      }, 500);
    }
  };

  return (
    <div>
      {/* Upload Section - only for photographers */}
      {isPhotographer &&(
        <div className="mb-6 border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Upload Media</h3>

            {/* Download All button (available here too) */}
            <div>
              <Button onClick={handleDownloadAll} disabled={downloading || imageItems.length === 0}>
                {downloading ? `Downloading ${downloadProgress.done}/${downloadProgress.total}` : 'Download All'}
              </Button>
            </div>
          </div>

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
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG, PDF up to 10MB</p>
                </div>
              </label>

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
              <Button onClick={handleUpload} disabled={!selectedFile} className="w-full">
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Media Gallery</h3>

          {/* Download All for non-photographers too */}
          {!isPhotographer && (
            <div>
              <Button onClick={handleDownloadAll} disabled={downloading || imageItems.length === 0}>
                {downloading ? `Downloading ${downloadProgress.done}/${downloadProgress.total}` : 'Download All'}
              </Button>
            </div>
          )}
        </div>

        {realMedia.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {realMedia.map(renderMediaItem)}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">No media yet</h3>
            <p className="text-muted-foreground">
              {isPhotographer
                ? "Upload media files for this shoot"
                : "The photographer hasn't uploaded any media yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
