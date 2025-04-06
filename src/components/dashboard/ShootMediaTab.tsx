
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ShootData, MediaItem } from '@/types/shoots';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ShootMediaTabProps {
  shoot: ShootData;
  isPhotographer?: boolean;
  setShoot?: (updatedShoot: ShootData) => void;
}

export function ShootMediaTab({ shoot, isPhotographer = false, setShoot }: ShootMediaTabProps) {
  // No media available
  if (!shoot.media) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No media available for this shoot
      </div>
    );
  }

  const hasPhotos = shoot.media.photos && shoot.media.photos.length > 0;
  const hasVideos = shoot.media.videos && shoot.media.videos.length > 0;
  const hasFloorplans = shoot.media.floorplans && shoot.media.floorplans.length > 0;
  const hasSlideshows = shoot.media.slideshows && shoot.media.slideshows.length > 0;
  const hasDocuments = shoot.media.documents && shoot.media.documents.length > 0;
  
  const hasAnyMedia = hasPhotos || hasVideos || hasFloorplans || hasSlideshows || hasDocuments;
  
  if (!hasAnyMedia) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No media available for this shoot
      </div>
    );
  }
  
  return (
    <Tabs defaultValue={hasPhotos ? "photos" : hasVideos ? "videos" : hasFloorplans ? "floorplans" : hasSlideshows ? "slideshows" : "documents"}>
      <TabsList className="mb-4">
        {hasPhotos && <TabsTrigger value="photos">Photos</TabsTrigger>}
        {hasVideos && <TabsTrigger value="videos">Videos</TabsTrigger>}
        {hasFloorplans && <TabsTrigger value="floorplans">Floor Plans</TabsTrigger>}
        {hasSlideshows && <TabsTrigger value="slideshows">Slideshows</TabsTrigger>}
        {hasDocuments && <TabsTrigger value="documents">Documents</TabsTrigger>}
      </TabsList>
      
      {hasPhotos && (
        <TabsContent value="photos">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {shoot.media.photos?.map((photo, index) => (
              <MediaCard key={photo.id || index} item={photo} />
            ))}
          </div>
        </TabsContent>
      )}
      
      {hasVideos && (
        <TabsContent value="videos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {shoot.media.videos?.map((video, index) => (
              <MediaCard key={video.id || index} item={video} isVideo />
            ))}
          </div>
        </TabsContent>
      )}
      
      {hasFloorplans && (
        <TabsContent value="floorplans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {shoot.media.floorplans?.map((floorplan, index) => (
              <MediaCard key={floorplan.id || index} item={floorplan} />
            ))}
          </div>
        </TabsContent>
      )}
      
      {hasSlideshows && (
        <TabsContent value="slideshows">
          <div className="grid grid-cols-1 gap-4 mt-2">
            {shoot.media.slideshows?.map((slideshow, index) => (
              <MediaCard key={slideshow.id || index} item={slideshow} />
            ))}
          </div>
        </TabsContent>
      )}
      
      {hasDocuments && (
        <TabsContent value="documents">
          <div className="grid grid-cols-1 gap-4 mt-2">
            {shoot.media.documents?.map((document, index) => (
              <MediaCard key={document.id || index} item={document} />
            ))}
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
}

interface MediaCardProps {
  item: MediaItem;
  isVideo?: boolean;
}

function MediaCard({ item, isVideo = false }: MediaCardProps) {
  const [loading, setLoading] = useState(true);
  
  const handleDownload = () => {
    window.open(item.url, '_blank');
  };
  
  return (
    <div className="relative group rounded-lg overflow-hidden border border-border bg-card">
      {isVideo ? (
        <video 
          src={item.url}
          className="w-full aspect-video object-cover"
          controls
        />
      ) : (
        <div className="aspect-square relative">
          <img 
            src={item.url} 
            alt={item.name || 'Media'} 
            className="w-full h-full object-cover"
            onLoad={() => setLoading(false)}
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="animate-pulse">Loading...</div>
            </div>
          )}
        </div>
      )}
      
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="text-white text-sm font-medium truncate">
          {item.name || 'Untitled'}
        </div>
        <Button 
          size="sm" 
          variant="secondary" 
          className="mt-1 w-full"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4 mr-1" />
          Download
        </Button>
      </div>
    </div>
  );
}
