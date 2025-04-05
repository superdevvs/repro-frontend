
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Download, ExternalLink, Copy } from 'lucide-react';
import { toast } from "sonner";

interface Tour {
  type: string;
  url: string;
  thumbnailUrl?: string;
  title: string;
}

interface VirtualTourSectionProps {
  propertyId: string;
  tours?: Tour[];
}

export function VirtualTourSection({ propertyId, tours = [] }: VirtualTourSectionProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTour, setActiveTour] = useState<Tour | null>(null);
  
  const defaultTours: Tour[] = [
    {
      type: 'cubicasa',
      url: 'https://example.com/cubicasa',
      thumbnailUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format',
      title: 'Cubicasa Floor Plan'
    },
    {
      type: 'matterport',
      url: 'https://my.matterport.com/show/?m=zEWsxhZpGba',
      thumbnailUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1200&auto=format',
      title: 'Matterport 3D Tour'
    },
    {
      type: 'iguide',
      url: 'https://example.com/iguide',
      thumbnailUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format',
      title: 'iGUIDE Tour'
    }
  ];

  const displayTours = tours.length > 0 ? tours : defaultTours;
  
  const openFullscreen = (tour: Tour) => {
    setActiveTour(tour);
    setIsFullscreen(true);
  };
  
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <span className="mr-2">🖥️</span>
          Virtual Tour & Floorplans
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayTours.length > 0 ? (
          <Tabs defaultValue={displayTours[0].type} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger 
                value="cubicasa" 
                disabled={!displayTours.some(tour => tour.type === 'cubicasa')}
              >
                Cubicasa Floorplan
              </TabsTrigger>
              <TabsTrigger 
                value="matterport" 
                disabled={!displayTours.some(tour => tour.type === 'matterport')}
              >
                Matterport Tour
              </TabsTrigger>
              <TabsTrigger 
                value="iguide" 
                disabled={!displayTours.some(tour => tour.type === 'iguide')}
              >
                iGUIDE Tour
              </TabsTrigger>
            </TabsList>
            
            {displayTours.map(tour => (
              <TabsContent key={tour.type} value={tour.type} className="space-y-4">
                <div className="aspect-[16/9] w-full bg-muted overflow-hidden rounded">
                  {tour.type === 'matterport' ? (
                    <iframe 
                      src={tour.url}
                      className="w-full h-full"
                      title={tour.title}
                      allowFullScreen
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <img 
                        src={tour.thumbnailUrl} 
                        alt={tour.title} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Button onClick={() => openFullscreen(tour)}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Full Tour
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => openFullscreen(tour)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Full View
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => copyToClipboard(tour.url)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                  {tour.type === 'cubicasa' && (
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No virtual tours available for this property</p>
            <Button variant="outline" className="mt-4" asChild>
              <a href="/virtual-tours">Explore Virtual Tour Options</a>
            </Button>
          </div>
        )}
      </CardContent>
      
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{activeTour?.title}</DialogTitle>
            <DialogDescription>
              {activeTour?.type === 'cubicasa' ? 'Cubicasa Floor Plan' : 
               activeTour?.type === 'matterport' ? 'Matterport 3D Tour' : 
               'iGUIDE Tour'}
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-[16/9] w-full bg-muted overflow-hidden rounded">
            {activeTour?.type === 'matterport' ? (
              <iframe 
                src={activeTour?.url || ''}
                className="w-full h-full"
                title={activeTour?.title}
                allowFullScreen
              />
            ) : (
              <img 
                src={activeTour?.thumbnailUrl} 
                alt={activeTour?.title} 
                className="w-full h-full object-contain" 
              />
            )}
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setIsFullscreen(false)}>Close</Button>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => copyToClipboard(activeTour?.url || '')}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              {activeTour?.type === 'cubicasa' && (
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
