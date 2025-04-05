import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UploadCloud, X } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { useDropzone } from 'react-dropzone';
import { useToast } from "@/hooks/use-toast";
import { ShootData, SlideShowItem } from '@/types/shoots';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ensureDateString } from '@/utils/formatters';

const handleSlideShowArray = (slideshows: any[] | undefined): SlideShowItem[] => {
  if (!slideshows) return [];
  
  return slideshows.map(item => {
    if (typeof item === 'string') {
      return {
        id: Math.random().toString(36).substring(2, 15),
        title: 'Slideshow',
        url: item,
        visible: true
      };
    }
    return item as SlideShowItem;
  });
};

interface ShootMediaTabProps {
  shoot: ShootData | undefined;
  setShoot: React.Dispatch<React.SetStateAction<ShootData | undefined>>;
  isPhotographer?: boolean;
}

export function ShootMediaTab({ shoot, setShoot, isPhotographer }: ShootMediaTabProps) {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<string[]>(shoot?.media?.photos || []);
  const [videos, setVideos] = useState<string[]>(shoot?.media?.videos || []);
  const [floorplans, setFloorplans] = useState<string[]>(shoot?.media?.floorplans || []);
  const [slideshows, setSlideshows] = useState<SlideShowItem[]>(handleSlideShowArray(shoot?.media?.slideshows) || []);
  const [newSlideshowURL, setNewSlideshowURL] = useState('');
  const [newSlideshowTitle, setNewSlideshowTitle] = useState('');
  const [tourLinks, setTourLinks] = useState({
    branded: shoot?.tourLinks?.branded || '',
    mls: shoot?.tourLinks?.mls || '',
    genericMls: shoot?.tourLinks?.genericMls || ''
  });
  
  const onDropPhotos = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const newPhoto = reader.result as string;
        setPhotos(prevPhotos => [...prevPhotos, newPhoto]);
        setShoot(prevShoot => {
          if (!prevShoot) return prevShoot;
          return {
            ...prevShoot,
            media: {
              ...prevShoot.media,
              photos: [...(prevShoot.media?.photos || []), newPhoto]
            }
          };
        });
      };
      reader.readAsDataURL(file);
    });
  }, [setPhotos, setShoot]);
  
  const onDropVideos = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const newVideo = reader.result as string;
        setVideos(prevVideos => [...prevVideos, newVideo]);
        setShoot(prevShoot => {
          if (!prevShoot) return prevShoot;
          return {
            ...prevShoot,
            media: {
              ...prevShoot.media,
              videos: [...(prevShoot.media?.videos || []), newVideo]
            }
          };
        });
      };
      reader.readAsDataURL(file);
    });
  }, [setVideos, setShoot]);
  
  const onDropFloorplans = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const newFloorplan = reader.result as string;
        setFloorplans(prevFloorplans => [...prevFloorplans, newFloorplan]);
        setShoot(prevShoot => {
          if (!prevShoot) return prevShoot;
          return {
            ...prevShoot,
            media: {
              ...prevShoot.media,
              floorplans: [...(prevShoot.media?.floorplans || []), newFloorplan]
            }
          };
        });
      };
      reader.readAsDataURL(file);
    });
  }, [setFloorplans, setShoot]);
  
  const {
    getRootProps: getPhotosRootProps,
    getInputProps: getPhotosInputProps,
    isDragActive: isPhotosDragActive
  } = useDropzone({ onDrop: onDropPhotos, accept: 'image/*' });
  
  const {
    getRootProps: getVideosRootProps,
    getInputProps: getVideosInputProps,
    isDragActive: isVideosDragActive
  } = useDropzone({ onDrop: onDropVideos, accept: 'video/*' });
  
  const {
    getRootProps: getFloorplansRootProps,
    getInputProps: getFloorplansInputProps,
    isDragActive: isFloorplansDragActive
  } = useDropzone({ onDrop: onDropFloorplans, accept: 'image/*' });
  
  const handleRemovePhoto = (index: number) => {
    setPhotos(prevPhotos => {
      const newPhotos = [...prevPhotos];
      newPhotos.splice(index, 1);
      return newPhotos;
    });
    setShoot(prevShoot => {
      if (!prevShoot) return prevShoot;
      const newPhotos = [...(prevShoot.media?.photos || [])];
      newPhotos.splice(index, 1);
      return {
        ...prevShoot,
        media: {
          ...prevShoot.media,
          photos: newPhotos
        }
      };
    });
  };
  
  const handleRemoveVideo = (index: number) => {
    setVideos(prevVideos => {
      const newVideos = [...prevVideos];
      newVideos.splice(index, 1);
      return newVideos;
    });
    setShoot(prevShoot => {
      if (!prevShoot) return prevShoot;
      const newVideos = [...(prevShoot.media?.videos || [])];
      newVideos.splice(index, 1);
      return {
        ...prevShoot,
        media: {
          ...prevShoot.media,
          videos: newVideos
        }
      };
    });
  };
  
  const handleRemoveFloorplan = (index: number) => {
    setFloorplans(prevFloorplans => {
      const newFloorplans = [...prevFloorplans];
      newFloorplans.splice(index, 1);
      return newFloorplans;
    });
    setShoot(prevShoot => {
      if (!prevShoot) return prevShoot;
      const newFloorplans = [...(prevShoot.media?.floorplans || [])];
      newFloorplans.splice(index, 1);
      return {
        ...prevShoot,
        media: {
          ...prevShoot.media,
          floorplans: newFloorplans
        }
      };
    });
  };
  
  const handleAddSlideshow = (url: string, title: string) => {
    const newSlideshow: SlideShowItem = {
      id: uuidv4(),
      title,
      url,
      visible: true
    };
    
    setSlideshows(prevSlideshows => {
      const typedSlideshows = handleSlideShowArray(prevSlideshows);
      return [...typedSlideshows, newSlideshow];
    });
    
    setShoot(prevShoot => {
      if (!prevShoot) return prevShoot;
      
      return {
        ...prevShoot,
        media: {
          ...prevShoot.media,
          slideshows: handleSlideShowArray([
            ...(prevShoot.media?.slideshows || []),
            newSlideshow
          ])
        }
      };
    });
  };
  
  const handleRemoveSlideshow = (index: number) => {
    setSlideshows(prevSlideshows => {
      const newSlideshows = [...prevSlideshows];
      newSlideshows.splice(index, 1);
      return newSlideshows;
    });
    setShoot(prevShoot => {
      if (!prevShoot) return prevShoot;
      const newSlideshows = [...(prevShoot.media?.slideshows || [])];
      newSlideshows.splice(index, 1);
      return {
        ...prevShoot,
        media: {
          ...prevShoot.media,
          slideshows: newSlideshows
        }
      };
    });
  };
  
  const handleToggleSlideshowVisibility = (index: number) => {
    setSlideshows(prevSlideshows => {
      const newSlideshows = [...prevSlideshows];
      newSlideshows[index].visible = !newSlideshows[index].visible;
      return newSlideshows;
    });
    setShoot(prevShoot => {
      if (!prevShoot) return prevShoot;
      const newSlideshows = [...(prevShoot.media?.slideshows || [])];
      newSlideshows[index] = {
        ...newSlideshows[index],
        visible: !newSlideshows[index].visible
      };
      return {
        ...prevShoot,
        media: {
          ...prevShoot.media,
          slideshows: newSlideshows
        }
      };
    });
  };
  
  const handleTourLinkChange = (type: 'branded' | 'mls' | 'genericMls', value: string) => {
    setTourLinks(prevLinks => ({ ...prevLinks, [type]: value }));
    setShoot(prevShoot => {
      if (!prevShoot) return prevShoot;
      return {
        ...prevShoot,
        tourLinks: {
          ...prevShoot.tourLinks,
          [type]: value
        }
      };
    });
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
        </CardHeader>
        <CardContent>
          <div {...getPhotosRootProps()} className="relative border-2 border-dashed rounded-md p-6 cursor-pointer">
            <input {...getPhotosInputProps()} />
            {
              isPhotosDragActive ?
                <p className="text-center">Drop the photos here ...</p> :
                <div className="text-center">
                  <UploadCloud className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Drag 'n' drop some photos here, or click to select files</p>
                </div>
            }
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative">
                <img src={photo} alt={`Uploaded photo ${index}`} className="rounded-md object-cover aspect-square" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/50 hover:bg-background/80"
                  onClick={() => handleRemovePhoto(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <div {...getVideosRootProps()} className="relative border-2 border-dashed rounded-md p-6 cursor-pointer">
            <input {...getVideosInputProps()} />
            {
              isVideosDragActive ?
                <p className="text-center">Drop the videos here ...</p> :
                <div className="text-center">
                  <UploadCloud className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Drag 'n' drop some videos here, or click to select files</p>
                </div>
            }
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {videos.map((video, index) => (
              <div key={index} className="relative">
                <video src={video} className="rounded-md object-cover aspect-square" controls />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/50 hover:bg-background/80"
                  onClick={() => handleRemoveVideo(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Floorplans</CardTitle>
        </CardHeader>
        <CardContent>
          <div {...getFloorplansRootProps()} className="relative border-2 border-dashed rounded-md p-6 cursor-pointer">
            <input {...getFloorplansInputProps()} />
            {
              isFloorplansDragActive ?
                <p className="text-center">Drop the floorplans here ...</p> :
                <div className="text-center">
                  <UploadCloud className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Drag 'n' drop some floorplans here, or click to select files</p>
                </div>
            }
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {floorplans.map((floorplan, index) => (
              <div key={index} className="relative">
                <img src={floorplan} alt={`Uploaded floorplan ${index}`} className="rounded-md object-cover aspect-square" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/50 hover:bg-background/80"
                  onClick={() => handleRemoveFloorplan(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Slideshows</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Slideshow URL"
              value={newSlideshowURL}
              onChange={(e) => setNewSlideshowURL(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Slideshow Title"
              value={newSlideshowTitle}
              onChange={(e) => setNewSlideshowTitle(e.target.value)}
            />
            <Button onClick={() => {
              if (newSlideshowURL.trim() !== '') {
                handleAddSlideshow(newSlideshowURL, newSlideshowTitle || 'Slideshow');
                setNewSlideshowURL('');
                setNewSlideshowTitle('');
              } else {
                toast({
                  title: "Error",
                  description: "Please enter a slideshow URL.",
                  variant: "destructive"
                });
              }
            }}>
              Add Slideshow
            </Button>
          </div>
          
          <div className="space-y-2">
            {slideshows.map((slideshow, index) => (
              <div key={slideshow.id} className="flex items-center justify-between border rounded-md p-2">
                <div>
                  <a href={slideshow.url} target="_blank" rel="noopener noreferrer" className="underline">
                    {slideshow.title}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`slideshow-visible-${index}`} className="text-sm">
                    Visible
                  </Label>
                  <Switch
                    id={`slideshow-visible-${index}`}
                    checked={slideshow.visible}
                    onCheckedChange={() => handleToggleSlideshowVisibility(index)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSlideshow(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Tour Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="branded-tour-link">Branded Tour Link</Label>
            <Input
              type="text"
              id="branded-tour-link"
              value={tourLinks.branded}
              onChange={(e) => handleTourLinkChange('branded', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="mls-tour-link">MLS Tour Link</Label>
            <Input
              type="text"
              id="mls-tour-link"
              value={tourLinks.mls}
              onChange={(e) => handleTourLinkChange('mls', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="generic-mls-tour-link">Generic MLS Tour Link</Label>
            <Input
              type="text"
              id="generic-mls-tour-link"
              value={tourLinks.genericMls}
              onChange={(e) => handleTourLinkChange('genericMls', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
