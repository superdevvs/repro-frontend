
import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Download, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SlideshowViewerProps {
  photos: string[];
  title: string;
  onDownload?: () => void;
}

export function SlideshowViewer({ photos, title, onDownload }: SlideshowViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const { toast } = useToast();
  
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }

    // Default download behavior - simulate video download
    toast({
      title: "Video Download Started",
      description: `${title} video is being downloaded`,
    });
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = photos[currentSlide]; // Download current slide as a fallback
    link.download = `${title.replace(/\s+/g, '_')}_video.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        setCurrentSlide((prevSlide) => {
          const nextSlide = (prevSlide + 1) % photos.length;
          return nextSlide;
        });
      }, 3000); // Change slide every 3 seconds
      
      setIntervalId(id);
      setIsPlaying(true);
    }
  };
  
  // Clean up interval on unmount
  React.useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">{title}</h2>
        <div className="flex gap-2">
          <Button onClick={togglePlayback} variant="outline" size="sm">
            {isPlaying ? (
              <><Pause className="h-4 w-4 mr-2" />Pause</>
            ) : (
              <><Play className="h-4 w-4 mr-2" />Play</>
            )}
          </Button>
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Video
          </Button>
        </div>
      </div>
      
      <Carousel 
        className="w-full max-w-4xl mx-auto"
        value={currentSlide}
        onValueChange={(value) => setCurrentSlide(value)}
      >
        <CarouselContent>
          {photos.map((photo, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <div className="overflow-hidden rounded-md">
                  <img
                    src={photo}
                    alt={`Slide ${index + 1}`}
                    className="w-full object-cover aspect-video"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 lg:-left-12" />
        <CarouselNext className="right-2 lg:-right-12" />
      </Carousel>
      
      <div className="text-center text-sm text-muted-foreground">
        {photos.length} photos in slideshow • Slide {currentSlide + 1} of {photos.length}
      </div>
    </div>
  );
}
