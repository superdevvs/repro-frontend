
import React, { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Download, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SlideshowViewerProps {
  photos: string[];
  title: string;
  onDownload?: (photoUrl?: string) => void;
  currentIndex?: number;
  showControls?: boolean;
  showDownloadButton?: boolean;
}

export function SlideshowViewer({ 
  photos, 
  title, 
  onDownload, 
  currentIndex = 0,
  showControls = true,
  showDownloadButton = true
}: SlideshowViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(currentIndex);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const { toast } = useToast();
  
  // Safety check to ensure photos is an array
  const safePhotos = Array.isArray(photos) ? photos : [];
  
  // Set initial slide based on currentIndex prop
  useEffect(() => {
    if (api && currentIndex >= 0 && currentIndex < safePhotos.length) {
      api.scrollTo(currentIndex);
    }
  }, [api, currentIndex, safePhotos.length]);
  
  const handleDownload = (photoUrl?: string) => {
    if (onDownload) {
      onDownload(photoUrl || safePhotos[currentSlide]);
      return;
    }

    // Default download behavior - download current or specified photo
    const urlToDownload = photoUrl || safePhotos[currentSlide];
    if (!urlToDownload) return;
    
    toast({
      title: "Photo Download Started",
      description: `${title} photo is being downloaded`,
    });
    
    // Use the browser's download capability
    const downloadLink = document.createElement('a');
    downloadLink.href = urlToDownload;
    downloadLink.download = `${title.replace(/\s+/g, '_')}_photo.jpg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  
  const togglePlayback = () => {
    if (isPlaying) {
      // Stop the slideshow
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setIsPlaying(false);
    } else {
      // Start the slideshow
      const id = window.setInterval(() => {
        if (api) {
          api.scrollNext();
        }
      }, 3000); // Change slide every 3 seconds
      
      setIntervalId(id);
      setIsPlaying(true);
    }
  };
  
  // Update current slide when API changes
  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };
    
    api.on("select", onSelect);
    
    // Initial selection
    setCurrentSlide(api.selectedScrollSnap());

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);
  
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  // If there are no photos, show a placeholder
  if (safePhotos.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-muted rounded-md">
        <p className="text-muted-foreground">No photos available</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">{title}</h2>
        {showControls && (
          <div className="flex gap-2">
            <Button onClick={togglePlayback} variant="outline" size="sm">
              {isPlaying ? (
                <><Pause className="h-4 w-4 mr-2" />Pause</>
              ) : (
                <><Play className="h-4 w-4 mr-2" />Play</>
              )}
            </Button>
            {showDownloadButton && (
              <Button onClick={() => handleDownload()} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Current Photo
              </Button>
            )}
          </div>
        )}
      </div>
      
      <Carousel 
        className="w-full max-w-4xl mx-auto"
        setApi={setApi}
      >
        <CarouselContent>
          {safePhotos.map((photo, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <div className="overflow-hidden rounded-md relative group">
                  <img
                    src={photo}
                    alt={`Slide ${index + 1}`}
                    className="w-full object-cover aspect-video"
                  />
                  {showDownloadButton && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(photo);
                        }}
                        className="bg-white/80 hover:bg-white"
                      >
                        <Download className="h-4 w-4 mr-2" />Download
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 lg:-left-12" />
        <CarouselNext className="right-2 lg:-right-12" />
      </Carousel>
      
      <div className="text-center text-sm text-muted-foreground">
        {safePhotos.length} photos in slideshow • Slide {currentSlide + 1} of {safePhotos.length}
      </div>
    </div>
  );
}
