
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ShootData } from '@/types/shoots';
import { 
  ImageIcon, 
  VideoIcon, 
  FileIcon, 
  UploadIcon, 
  CheckIcon,
  Trash2Icon,
  PresentationIcon,
  Eye as ViewIcon,
  Download as DownloadIcon,
  Plus as PlusIcon,
} from 'lucide-react';
import { useShoots } from '@/context/ShootsContext';
import { useToast } from '@/hooks/use-toast';

type MediaType = 'images' | 'videos' | 'files' | 'slideshows';

interface ShootMediaTabProps {
  shoot: ShootData;
  isPhotographer: boolean;
}

// Demo images from Unsplash
const demoImages = [
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&q=80",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
];

export function ShootMediaTab({ shoot, isPhotographer }: ShootMediaTabProps) {
  const [activeTab, setActiveTab] = useState<MediaType>('images');
  const { updateShoot } = useShoots();
  const { toast } = useToast();
  
  const getMediaImages = (): string[] => {
    if (!shoot.media) return demoImages.slice(0, 3); // Return demo images if no media
    if (shoot.media.images && shoot.media.images.length > 0) {
      return shoot.media.images.map(img => img.url);
    }
    if (shoot.media.photos && shoot.media.photos.length > 0) {
      return shoot.media.photos;
    }
    return demoImages.slice(0, 3); // Return demo images as fallback
  };
  
  const getSlideshows = () => {
    return shoot.media?.slideshows || [
      { id: "demo-1", title: "Property Virtual Tour", url: demoImages[0] },
      { id: "demo-2", title: "Kitchen & Dining Highlights", url: demoImages[1] }
    ];
  };
  
  const handleMediaUpload = (type: MediaType) => {
    console.log(`Upload ${type} clicked`);
    // This would open a file picker in a real app
  };
  
  const handleApprove = (id: string, type: MediaType) => {
    console.log(`Approve ${type} with id ${id}`);
    // This would update the media status in a real app
  };
  
  const handleDelete = (id: string, type: MediaType) => {
    console.log(`Delete ${type} with id ${id}`);
    
    if (!shoot.media) return;
    
    let updatedMedia = {...shoot.media};
    
    switch(type) {
      case 'images':
        // If using the legacy 'photos' array
        if (updatedMedia.photos) {
          updatedMedia.photos = updatedMedia.photos.filter((_, index) => index !== parseInt(id));
        }
        // If using the newer 'images' array
        if (updatedMedia.images) {
          updatedMedia.images = updatedMedia.images.filter(img => img.id !== id);
        }
        break;
      case 'videos':
        if (updatedMedia.videos) {
          updatedMedia.videos = updatedMedia.videos.filter(video => video.id !== id);
        }
        break;
      case 'files':
        if (updatedMedia.files) {
          updatedMedia.files = updatedMedia.files.filter(file => file.id !== id);
        }
        break;
      case 'slideshows':
        if (updatedMedia.slideshows) {
          updatedMedia.slideshows = updatedMedia.slideshows.filter(slideshow => slideshow.id !== id);
        }
        break;
    }
    
    // Update the shoot with the modified media
    updateShoot(shoot.id, { media: updatedMedia });
    
    toast({
      title: "Media deleted",
      description: `The ${type === 'slideshows' ? 'slideshow' : type.slice(0, -1)} has been deleted.`,
    });
  };
  
  const handleViewSlideshow = (url: string) => {
    window.open(url, '_blank');
  };

  const handleDownloadSlideshow = (url: string, title: string) => {
    // Simulate download by opening the link as slideshow URLs might be direct file links
    const link = document.createElement('a');
    link.href = url;
    // Try to suggest the file name
    link.download = `${title.replace(/\s+/g, "_") || "slideshow"}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateSlideshow = () => {
    console.log("Create New Slideshow clicked");
    // Show form/dialog to create slideshow here in a real app
    // For now, just toast or log
    alert("New Slideshow creation coming soon!");
  };

  const hasMedia = (): boolean => {
    if (!shoot.media) return true; // Always return true with demo images
    
    const images = getMediaImages();
    const videos = shoot.media.videos || [];
    const files = shoot.media.files || [];
    const slideshows = getSlideshows();
    
    return images.length > 0 || videos.length > 0 || files.length > 0 || slideshows.length > 0;
  };
  
  const hasMediaType = (type: MediaType): boolean => {
    if (!shoot.media) {
      // With demo data, always return true for images and slideshows
      return type === 'images' || type === 'slideshows';
    }
    
    switch (type) {
      case 'images':
        return getMediaImages().length > 0;
      case 'videos':
        return (shoot.media.videos?.length || 0) > 0;
      case 'files':
        return (shoot.media.files?.length || 0) > 0;
      case 'slideshows':
        return getSlideshows().length > 0;
      default:
        return false;
    }
  };
  
  const EmptyState = ({ type, canUpload }: { type: MediaType, canUpload: boolean }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {type === 'images' && <ImageIcon className="h-16 w-16 text-muted-foreground/30 mb-4" />}
      {type === 'videos' && <VideoIcon className="h-16 w-16 text-muted-foreground/30 mb-4" />}
      {type === 'files' && <FileIcon className="h-16 w-16 text-muted-foreground/30 mb-4" />}
      {type === 'slideshows' && <PresentationIcon className="h-16 w-16 text-muted-foreground/30 mb-4" />}
      
      <h3 className="text-lg font-medium mb-2">No {type} available</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        {type === 'images' && "No images have been uploaded for this shoot yet."}
        {type === 'videos' && "No videos have been uploaded for this shoot yet."}
        {type === 'files' && "No files have been uploaded for this shoot yet."}
        {type === 'slideshows' && "No slideshows have been created for this shoot yet."}
      </p>
      
      {canUpload && (
        <Button onClick={() => handleMediaUpload(type)}>
          <UploadIcon className="h-4 w-4 mr-2" />
          Upload {type === 'images' ? 'Images' : type === 'videos' ? 'Videos' : type === 'files' ? 'Files' : 'Slideshows'}
        </Button>
      )}
    </div>
  );

  const shouldShowWatermark =
    shoot.status === "completed" &&
    (!shoot.payment.totalPaid || shoot.payment.totalPaid < shoot.payment.totalQuote);

  const WatermarkOverlay = () => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
      <span className="text-3xl md:text-4xl font-bold text-white/70 bg-black/30 rounded-lg px-8 py-2 rotate-[-25deg] tracking-wide" style={{letterSpacing: 2, userSelect: 'none'}}>
        REPro Co. Watermark
      </span>
    </div>
  );

  // Debug method to check why images aren't displaying
  const debugImageLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log("Image loaded:", event.currentTarget.src);
    if (event.currentTarget.naturalWidth === 0) {
      console.error("Image failed to load properly:", event.currentTarget.src);
    }
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as MediaType)}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="images" className="flex gap-2 items-center">
              <ImageIcon className="h-4 w-4" />
              <span>Images</span>
              {hasMediaType('images') && (
                <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded">
                  {getMediaImages().length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex gap-2 items-center">
              <VideoIcon className="h-4 w-4" />
              <span>Videos</span>
              {hasMediaType('videos') && (
                <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded">
                  {shoot.media?.videos?.length || 0}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="files" className="flex gap-2 items-center">
              <FileIcon className="h-4 w-4" />
              <span>Files</span>
              {hasMediaType('files') && (
                <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded">
                  {shoot.media?.files?.length || 0}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="slideshows" className="flex gap-2 items-center">
              <PresentationIcon className="h-4 w-4" />
              <span>Slideshows</span>
              {hasMediaType('slideshows') && (
                <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded">
                  {getSlideshows().length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          {isPhotographer && (
            <Button onClick={() => handleMediaUpload(activeTab)}>
              <UploadIcon className="h-4 w-4 mr-2" />
              Upload {activeTab === 'images' ? 'Images' : activeTab === 'videos' ? 'Videos' : activeTab === 'files' ? 'Files' : 'Slideshow'}
            </Button>
          )}
        </div>
        
        {/* Images Tab Content */}
        <TabsContent value="images" className="mt-0">
          {hasMediaType('images') ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {getMediaImages().map((imageUrl, index) => (
                <div key={index} className="group relative aspect-square rounded-md overflow-hidden border">
                  <img 
                    src={imageUrl} 
                    alt={`Property image ${index + 1}`}
                    className="h-full w-full object-cover"
                    onLoad={debugImageLoad}
                    onError={(e) => console.error("Image failed to load:", e.currentTarget.src)}
                  />
                  {shouldShowWatermark && <WatermarkOverlay />}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(`${index}`, 'images');
                      }}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(`${index}`, 'images');
                      }}
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState type="images" canUpload={isPhotographer} />
          )}
        </TabsContent>
        
        {/* Videos Tab Content */}
        <TabsContent value="videos" className="mt-0">
          {hasMediaType('videos') ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shoot.media?.videos?.map((video, index) => (
                <div key={video.id} className="group relative aspect-video rounded-md overflow-hidden border bg-muted">
                  {video.thumbnail ? (
                    <img 
                      src={video.thumbnail} 
                      alt={`Video thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                      onLoad={debugImageLoad}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <VideoIcon className="h-12 w-12 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(video.url, '_blank');
                      }}
                    >
                      Play
                    </Button>
                    {isPhotographer && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(video.id, 'videos');
                        }}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState type="videos" canUpload={isPhotographer} />
          )}
        </TabsContent>
        
        {/* Files Tab Content */}
        <TabsContent value="files" className="mt-0">
          {hasMediaType('files') ? (
            <div className="space-y-2">
              {shoot.media?.files?.map(file => (
                <div 
                  key={file.id}
                  className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileIcon className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {file.type} • {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      Download
                    </Button>
                    {isPhotographer && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(file.id, 'files')}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState type="files" canUpload={isPhotographer} />
          )}
        </TabsContent>
        
        {/* Slideshows Tab Content */}
        <TabsContent value="slideshows" className="mt-0">
          <div>
            {isPhotographer && (
              <Button variant="accent" className="mb-4" onClick={handleCreateSlideshow}>
                <PlusIcon className="h-4 w-4 mr-2" />
                New Slideshow
              </Button>
            )}
          </div>
          {hasMediaType('slideshows') ? (
            <div className="space-y-2">
              {getSlideshows().map(slideshow => (
                <div 
                  key={slideshow.id}
                  className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <PresentationIcon className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{slideshow.title}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewSlideshow(slideshow.url)}
                    >
                      <ViewIcon className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadSlideshow(slideshow.url, slideshow.title)}
                    >
                      <DownloadIcon className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    {isPhotographer && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(slideshow.id, 'slideshows')}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState type="slideshows" canUpload={isPhotographer} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
