import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, ImageIcon, Upload, Copy, QrCode, Eye, EyeOff, Edit, Image, Link2, Play, Pause } from "lucide-react";
import { ShootData, SlideShowItem } from '@/types/shoots';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FileUploader } from '@/components/media/FileUploader';
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO, isValid } from 'date-fns';
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from '@/components/auth/AuthProvider';
import { v4 as uuidv4 } from 'uuid';
import { useShoots } from '@/context/ShootsContext';
import { SlideshowViewer } from './SlideshowViewer';
import { VirtualTourSection } from '../tours/VirtualTourSection';
import { ensureDateString } from '@/utils/formatters';

const examplePhotos = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=1200&auto=format",
];

const sampleSlideshows: SlideShowItem[] = [
  {
    id: "slide-1",
    title: "Modern Interior Showcase",
    url: "https://example.com/slideshows/modern-interior-123",
    visible: true
  },
  {
    id: "slide-2",
    title: "Property Exterior Views",
    url: "https://example.com/slideshows/exterior-views-456",
    visible: false
  }
];

interface ShootMediaTabProps {
  shoot: ShootData;
  isPhotographer: boolean;
}

export function ShootMediaTab({ shoot, isPhotographer }: ShootMediaTabProps) {
  const { toast } = useToast();
  const { role } = useAuth();
  const { updateShoot } = useShoots();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [slideshowDialogOpen, setSlideshowDialogOpen] = useState(false);
  const [slideshowOrientation, setSlideshowOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [editSlideshowDialogOpen, setEditSlideshowDialogOpen] = useState(false);
  const [currentSlideshow, setCurrentSlideshow] = useState<SlideShowItem | null>(null);
  const [slideshowTitle, setSlideshowTitle] = useState("New Slideshow");
  const [viewSlideshowDialogOpen, setViewSlideshowDialogOpen] = useState(false);
  const [viewingSlideshowUrl, setViewingSlideshowUrl] = useState<string | null>(null);
  const [photoCarouselOpen, setPhotoCarouselOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [displaySlideshows, setDisplaySlideshows] = useState<SlideShowItem[]>(
    shoot.media?.slideshows || sampleSlideshows
  );
  
  const isAdmin = ['admin', 'superadmin'].includes(role);
  const isPaid = shoot.payment?.totalPaid && shoot.payment?.totalQuote && shoot.payment.totalPaid >= shoot.payment.totalQuote;

  const displayPhotos = shoot.media?.photos && shoot.media.photos.length > 0 
    ? shoot.media.photos 
    : examplePhotos;
  
  const formatDate = (dateString?: string | Date): string => {
    if (!dateString) return 'N/A';
    try {
      const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
      return isValid(date) ? format(date, 'MMMM d, yyyy') : 'Invalid date';
    } catch (error) {
      return 'N/A';
    }
  };

  const formatTime = (dateString?: string | Date): string => {
    if (!dateString) return '';
    try {
      const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
      return isValid(date) ? format(date, 'h:mm a') : '';
    } catch (error) {
      return '';
    }
  };
  
  const handleUploadComplete = (files: File[]) => {
    setUploadDialogOpen(false);
    
    toast({
      title: 'Upload Complete',
      description: `Successfully uploaded ${files.length} files for shoot #${shoot.id}`,
    });
  };

  const handleImageClick = (imageSrc: string) => {
    if (slideshowDialogOpen) {
      handlePhotoSelect(imageSrc);
      return;
    }
    
    const photoIndex = displayPhotos.findIndex(photo => photo === imageSrc);
    if (photoIndex !== -1) {
      setCurrentPhotoIndex(photoIndex);
      setPhotoCarouselOpen(true);
    } else {
      setSelectedImage(imageSrc);
    }
  };

  const handleCloseImageView = () => {
    setSelectedImage(null);
  };

  const handlePhotoDownload = (photoUrl?: string) => {
    if (!photoUrl) return;
    
    const fileName = photoUrl.split('/').pop() || 'photo.jpg';
    
    toast({
      title: "Photo Download Started",
      description: `Downloading ${fileName}`,
    });
    
    const downloadLink = document.createElement('a');
    downloadLink.href = photoUrl;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleSlideshowCreate = () => {
    if (selectedPhotos.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one photo for the slideshow',
        variant: 'destructive',
      });
      return;
    }
    
    const newSlideshow: SlideShowItem = {
      id: `slide-${uuidv4().slice(0, 8)}`,
      title: slideshowTitle || `${shoot.location.city} ${slideshowOrientation} Slideshow`,
      url: `https://example.com/slideshows/${shoot.id}-${uuidv4().slice(0, 6)}`,
      visible: true
    };
    
    setDisplaySlideshows(prevSlideshows => [...prevSlideshows]);
    
    const updatedSlideshows = shoot.media?.slideshows ? 
      [...shoot.media.slideshows, newSlideshow] : 
      [newSlideshow];
    
    updateShoot(shoot.id, {
      media: {
        ...shoot.media,
        slideshows: updatedSlideshows,
        photos: shoot.media?.photos || []
      }
    });
    
    toast({
      title: 'Slideshow Created',
      description: `Successfully created "${newSlideshow.title}" slideshow`,
    });
    
    setViewingSlideshowUrl(newSlideshow.url);
    setViewSlideshowDialogOpen(true);
    
    setSelectedPhotos([]);
    setSlideshowTitle("New Slideshow");
    setSlideshowDialogOpen(false);
  };

  const handlePhotoSelect = (photo: string) => {
    if (selectedPhotos.includes(photo)) {
      setSelectedPhotos(selectedPhotos.filter(p => p !== photo));
    } else {
      setSelectedPhotos([...selectedPhotos, photo]);
    }
  };

  const handleEditSlideshow = (slideshow: SlideShowItem) => {
    setCurrentSlideshow(slideshow);
    setEditSlideshowDialogOpen(true);
  };

  const handleUpdateSlideshow = () => {
    if (!currentSlideshow) return;
    
    setDisplaySlideshows(prevSlideshows => 
      prevSlideshows.map(s => s.id === currentSlideshow.id ? currentSlideshow : s)
    );
    
    const updatedSlideshows = shoot.media?.slideshows?.map(s => 
      s.id === currentSlideshow.id ? currentSlideshow : s
    ) || [];
    
    updateShoot(shoot.id, {
      media: {
        ...shoot.media,
        slideshows: updatedSlideshows,
        photos: shoot.media?.photos || []
      }
    });
    
    toast({
      title: 'Slideshow Updated',
      description: 'Slideshow title has been updated successfully',
    });
    
    setEditSlideshowDialogOpen(false);
  };

  const toggleSlideshowVisibility = (slideshowId: string, currentVisibility: boolean) => {
    setDisplaySlideshows(prevSlideshows => 
      prevSlideshows.map(s => s.id === slideshowId ? {...s, visible: !currentVisibility} : s)
    );
    
    const updatedSlideshows = shoot.media?.slideshows?.map(s => 
      s.id === slideshowId ? {...s, visible: !currentVisibility} : s
    ) || [];
    
    updateShoot(shoot.id, {
      media: {
        ...shoot.media,
        slideshows: updatedSlideshows,
        photos: shoot.media?.photos || []
      }
    });
    
    toast({
      title: `Slideshow ${currentVisibility ? 'Hidden' : 'Visible'}`,
      description: `The slideshow is now ${currentVisibility ? 'hidden' : 'visible'}`,
    });
  };

  const viewSlideshow = (url: string) => {
    const slideshow = displaySlideshows.find(s => s.url === url);
    if (slideshow) {
      setViewingSlideshowUrl(url);
      setViewSlideshowDialogOpen(true);
    }
  };

  const downloadSlideshow = (url: string) => {
    const slideshow = displaySlideshows.find(s => s.url === url);
    if (slideshow) {
      toast({
        title: "Slideshow Download Started",
        description: `${slideshow.title} is being downloaded`,
      });
      
      const link = document.createElement('a');
      link.href = displayPhotos[0];
      link.download = `${slideshow.title.replace(/\s+/g, '_')}_photo.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: 'Link Copied',
      description: 'The link has been copied to your clipboard',
    });
  };

  const downloadQRCode = (link: string) => {
    toast({
      title: 'QR Code Downloaded',
      description: 'QR code has been downloaded',
    });
  };
  
  return (
    <>
      <div className="space-y-6">
        {shoot.status === 'completed' && (
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">{shoot.location.fullAddress}</h2>
              <p className="text-muted-foreground">Photographer: {shoot.photographer?.name}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{formatDate(shoot.completedDate || shoot.scheduledDate)}</p>
              <p className="text-sm text-muted-foreground">{formatTime(shoot.completedDate || shoot.scheduledDate)}</p>
            </div>
          </div>
        )}
        
        <Tabs defaultValue="photos" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="tours">Tours & Slideshow</TabsTrigger>
            <TabsTrigger value="virtualTours">Virtual Tours</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="photos" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {displayPhotos.map((photo, index) => (
                <div 
                  key={index} 
                  className={`relative aspect-square rounded-md overflow-hidden border cursor-pointer group ${
                    selectedPhotos.includes(photo) && slideshowDialogOpen ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleImageClick(photo)}
                >
                  <img 
                    src={photo} 
                    alt={`Property photo ${index + 1}`} 
                    className="object-cover w-full h-full"
                  />
                  {!isPaid && (
                    <div className="absolute inset-0 bg-white/30 flex items-center justify-center pointer-events-none">
                      <p className="text-primary/70 font-bold text-2xl rotate-[-30deg]">WATERMARK</p>
                    </div>
                  )}
                  {selectedPhotos.includes(photo) && slideshowDialogOpen && (
                    <div className="absolute top-1 right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center text-white text-xs">
                      {selectedPhotos.indexOf(photo) + 1}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {slideshowDialogOpen ? (
                      <div className="text-white font-bold">
                        {selectedPhotos.includes(photo) ? 'Selected' : 'Select'}
                      </div>
                    ) : (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-white/80 hover:bg-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePhotoDownload(photo);
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-white/80 hover:bg-white"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap justify-end gap-2">
              {isPhotographer && (
                <Button variant="outline" onClick={() => setUploadDialogOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload More
                </Button>
              )}
              <Button variant="outline" onClick={() => {
                setSlideshowDialogOpen(true);
                setSelectedPhotos([]);
              }}>
                <Image className="h-4 w-4 mr-2" />
                Create Slideshow
              </Button>
              {selectedPhotos.length > 0 && (
                <Button onClick={() => {
                  const newSlideshow = {
                    id: `slide-${uuidv4().slice(0, 8)}`,
                    title: `Quick Slideshow (${selectedPhotos.length} photos)`,
                    url: `https://example.com/slideshows/${shoot.id}-${uuidv4().slice(0, 6)}`,
                    visible: true
                  };
                  
                  setDisplaySlideshows(prevSlideshows => [...prevSlideshows, newSlideshow]);
                  
                  const updatedSlideshows = shoot.media?.slideshows ? 
                    [...shoot.media.slideshows, newSlideshow] : 
                    [newSlideshow];
                  
                  updateShoot(shoot.id, {
                    media: {
                      ...shoot.media,
                      slideshows: updatedSlideshows,
                      photos: shoot.media?.photos || []
                    }
                  });
                  
                  toast({
                    title: 'Slideshow Created',
                    description: `Quick slideshow with ${selectedPhotos.length} photos created`,
                  });
                  
                  setViewingSlideshowUrl(newSlideshow.url);
                  setViewSlideshowDialogOpen(true);
                }}>
                  <Play className="h-4 w-4 mr-2" />
                  Create Quick Slideshow ({selectedPhotos.length})
                </Button>
              )}
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="services" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Shoot Services</h3>
              <Button size="sm">
                + Add Service
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {shoot.services.length > 0 ? (
                shoot.services.map((service, index) => (
                  <Badge key={index} variant="outline" className="text-sm py-1.5">
                    {service}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground">No services added yet</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="tours" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tour Links</CardTitle>
                <CardDescription>Access and share tour links for this property</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {shoot.tourLinks ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium">Branded Tour</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[300px]">https://tours.example.com/branded/123456</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => copyLink('https://tours.example.com/branded/123456')}>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => downloadQRCode('https://tours.example.com/branded/123456')}>
                          <QrCode className="h-4 w-4 mr-1" />
                          QR
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium">MLS Tour</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[300px]">https://tours.example.com/mls/123456</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => copyLink('https://tours.example.com/mls/123456')}>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => downloadQRCode('https://tours.example.com/mls/123456')}>
                          <QrCode className="h-4 w-4 mr-1" />
                          QR
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No tour links available for this property</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Additional Media</CardTitle>
                <CardDescription>Slideshows and other media files</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {displaySlideshows.map((slideshow) => (
                    <div key={slideshow.id} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <Play className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{slideshow.title}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[300px]">{slideshow.url}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => viewSlideshow(slideshow.url)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => downloadSlideshow(slideshow.url)}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditSlideshow(slideshow)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => toggleSlideshowVisibility(slideshow.id, slideshow.visible)}>
                          {slideshow.visible ? (
                            <><EyeOff className="h-4 w-4 mr-1" />Hide</>
                          ) : (
                            <><Eye className="h-4 w-4 mr-1" />Show</>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => setSlideshowDialogOpen(true)}>
                  <Image className="h-4 w-4 mr-2" />
                  Create New Slideshow
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="virtualTours" className="space-y-6">
            <VirtualTourSection propertyId={shoot.id.toString()} />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mlsImageWidth">MLS-Compatible Image Width</Label>
                    <Input id="mlsImageWidth" defaultValue="1200" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Calendar & Timezone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="googleCalendar" />
                  <Label htmlFor="googleCalendar">Add to Google Calendar</Label>
                </div>
                
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <select id="timezone" className="w-full border rounded-md p-2">
                    <option>Eastern Time (ET)</option>
                    <option>Central Time (CT)</option>
                    <option>Mountain Time (MT)</option>
                    <option>Pacific Time (PT)</option>
                  </select>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>File Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="customFilename" />
                  <Label htmlFor="customFilename">Use Custom File Names</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="ghostUser" />
                  <Label htmlFor="ghostUser">Enable Ghost User</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="hideProof" />
                  <Label htmlFor="hideProof">Hide Proof</Label>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Activity Logs</CardTitle>
                <CardDescription>All activities related to this shoot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-muted/40 rounded-md">
                    <p className="text-sm">Shoot scheduled</p>
                    <p className="text-xs text-muted-foreground">Feb 15, 2025 10:30 AM</p>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/40 rounded-md">
                    <p className="text-sm">Shoot reminder email sent</p>
                    <p className="text-xs text-muted-foreground">Feb 18, 2025 09:00 AM</p>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/40 rounded-md">
                    <p className="text-sm">Photos uploaded (25 images)</p>
                    <p className="text-xs text-muted-foreground">Feb 20, 2025 02:15 PM</p>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/40 rounded-md">
                    <p className="text-sm">Shoot finalized</p>
                    <p className="text-xs text-muted-foreground">Feb 21, 2025 11:45 AM</p>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/40 rounded-md">
                    <p className="text-sm">Payment received</p>
                    <p className="text-xs text-muted-foreground">Feb 22, 2025 03:30 PM</p>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/40 rounded-md">
                    <p className="text-sm">Invoice email sent</p>
                    <p className="text-xs text-muted-foreground">Feb 22, 2025 03:35 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {shoot.client && (
          <div className="mt-4 p-4 border rounded-md">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                {shoot.client.name.split(' ').map(n => n[0]).join('')}
              </div>
              
              <div className="space-y-1">
                <p className="font-medium">{shoot.client.name}</p>
                
                {shoot.client.company && (
                  <p className="text-sm text-muted-foreground">{shoot.client.company}</p>
                )}
                
                {shoot.client.phone && (
                  <p className="text-sm text-muted-foreground">{shoot.client.phone}</p>
                )}
                
                <p className="text-sm text-muted-foreground">{shoot.client.email}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap justify-between items-center gap-2 mt-4">
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Images
            </Button>
            <Button variant="outline" onClick={() => copyLink(`https://example.com/album/${shoot.id}`)}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Album Link
            </Button>
          </div>
          
          {!isAdmin && !isPaid && (
            <Button variant="default">
              Mark as Paid
            </Button>
          )}
        </div>
      </div>
      
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Upload Media for Shoot #{shoot.id}</DialogTitle>
            <DialogDescription>
              Upload photos, videos, or documents related to this property shoot.
            </DialogDescription>
          </DialogHeader>
          <FileUploader 
            shootId={shoot.id.toString()}
            onUploadComplete={handleUploadComplete}
            className="mt-4"
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={slideshowDialogOpen} onOpenChange={(open) => {
        setSlideshowDialogOpen(open);
        if (!open) setSelectedPhotos([]);
      }}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Create Slideshow</DialogTitle>
            <DialogDescription>
              Select photos and click on them to add to your slideshow. Selected photos will be highlighted.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="slideshowTitle">Slideshow Title</Label>
              <Input 
                id="slideshowTitle" 
                value={slideshowTitle}
                onChange={(e) => setSlideshowTitle(e.target.value)}
                placeholder="Enter slideshow title"
                className="mt-1"
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Select Orientation</h3>
              <RadioGroup 
                value={slideshowOrientation} 
                onValueChange={(value) => setSlideshowOrientation(value as 'portrait' | 'landscape')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="landscape" id="landscape" />
                  <Label htmlFor="landscape">Landscape</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="portrait" id="portrait" />
                  <Label htmlFor="portrait">Portrait</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Selected Photos ({selectedPhotos.length})</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[400px] overflow-y-auto p-1">
                {displayPhotos.map((photo, index) => (
                  <div 
                    key={index} 
                    className={`relative aspect-square rounded-md overflow-hidden border cursor-pointer ${
                      selectedPhotos.includes(photo) ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handlePhotoSelect(photo)}
                  >
                    <img 
                      src={photo} 
                      alt={`Property photo ${index + 1}`} 
                      className="object-cover w-full h-full"
                    />
                    {selectedPhotos.includes(photo) && (
                      <div className="absolute top-1 right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center text-white text-xs">
                        {selectedPhotos.indexOf(photo) + 1}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => {
              setSlideshowDialogOpen(false);
              setSelectedPhotos([]);
            }}>Cancel</Button>
            <Button 
              onClick={handleSlideshowCreate}
              disabled={selectedPhotos.length === 0}
            >
              Create & View Slideshow
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={editSlideshowDialogOpen} onOpenChange={setEditSlideshowDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Slideshow</DialogTitle>
            <DialogDescription>
              Update slideshow details and settings.
            </DialogDescription>
          </DialogHeader>
          
          {currentSlideshow && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editTitle">Slideshow Title</Label>
                <Input 
                  id="editTitle" 
                  value={currentSlideshow.title}
                  onChange={(e) => setCurrentSlideshow({...currentSlideshow, title: e.target.value})}
                  placeholder="Enter slideshow title"
                  className="mt-1"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="slideshowVisible" 
                  checked={currentSlideshow.visible}
                  onCheckedChange={(checked) => setCurrentSlideshow({...currentSlideshow, visible: checked as boolean})}
                />
                <Label htmlFor="slideshowVisible">Visible to client</Label>
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setEditSlideshowDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateSlideshow}>
              Update Slideshow
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={photoCarouselOpen} onOpenChange={setPhotoCarouselOpen}>
        <DialogContent className="sm:max-w-[900px] flex flex-col max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Photo Gallery</DialogTitle>
            <DialogDescription>
              Browse all photos in this gallery
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative flex-1 overflow-hidden my-4">
            <SlideshowViewer 
              photos={displayPhotos} 
              title={shoot.location.fullAddress || "Property Photos"}
              currentIndex={currentPhotoIndex}
              onDownload={handlePhotoDownload}
              showControls={true}
              showDownloadButton={true}
            />
          </div>
          
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setPhotoCarouselOpen(false)}>
              Close
            </Button>
            <Button onClick={() => handlePhotoDownload(displayPhotos[currentPhotoIndex])}>
              <Download className="h-4 w-4 mr-2" />
              Download Current Photo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={viewSlideshowDialogOpen} onOpenChange={setViewSlideshowDialogOpen}>
        <DialogContent className="sm:max-w-[900px] flex flex-col max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {displaySlideshows.find(s => s.url === viewingSlideshowUrl)?.title || 'Slideshow'}
            </DialogTitle>
            <DialogDescription>
              Viewing property slideshow
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative flex-1 overflow-hidden my-4">
            <SlideshowViewer 
              photos={displayPhotos} 
              title={displaySlideshows.find(s => s.url === viewingSlideshowUrl)?.title || 'Slideshow'}
              onDownload={handlePhotoDownload}
              showControls={true}
              showDownloadButton={true}
            />
          </div>
          
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setViewSlideshowDialogOpen(false)}>
              Close
            </Button>
            <Button variant="outline" onClick={() => copyLink(viewingSlideshowUrl || '')}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
