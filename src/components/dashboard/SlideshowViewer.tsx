
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";

interface SlideshowViewerProps {
  photos: string[];
  title: string;
  onDownload?: () => void;
}

export function SlideshowViewer({ photos, title, onDownload }: SlideshowViewerProps) {
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }

    // Default download behavior if no onDownload prop is provided
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [800, 600]
    });

    const downloadPdf = async () => {
      for (let i = 0; i < photos.length; i++) {
        if (i > 0) {
          doc.addPage();
        }
        
        try {
          // Add the current image to the PDF
          doc.setFontSize(16);
          doc.text(`${title} - Slide ${i + 1}`, 40, 40);
          
          // Create a temp image element to get dimensions
          const img = new Image();
          img.src = photos[i];
          
          await new Promise((resolve) => {
            img.onload = () => {
              // Calculate aspect ratio to fit within the PDF
              const imgWidth = img.width;
              const imgHeight = img.height;
              const pdfWidth = doc.internal.pageSize.getWidth() - 80;
              const pdfHeight = doc.internal.pageSize.getHeight() - 100;
              
              const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
              const width = imgWidth * ratio;
              const height = imgHeight * ratio;
              
              // Center the image
              const x = (doc.internal.pageSize.getWidth() - width) / 2;
              const y = 80;
              
              doc.addImage(photos[i], 'JPEG', x, y, width, height);
              resolve(null);
            };
          });
        } catch (error) {
          console.error(`Error adding image ${i} to PDF:`, error);
        }
      }
      
      // Download the PDF
      doc.save(`${title.replace(/\s+/g, '_')}_slideshow.pdf`);
    };
    
    downloadPdf();
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">{title}</h2>
        <Button onClick={handleDownload} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>
      
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
