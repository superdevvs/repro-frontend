
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface SlideshowViewerProps {
  photos: string[];
  title: string;
}

export function SlideshowViewer({ photos, title }: SlideshowViewerProps) {
  return (
    <div className="w-full space-y-4">
      <h2 className="text-xl font-medium text-center">{title}</h2>
      
      <Carousel className="w-full max-w-4xl mx-auto">
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
        {photos.length} photos in slideshow
      </div>
    </div>
  );
}
