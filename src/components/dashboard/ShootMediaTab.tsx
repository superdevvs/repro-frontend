
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, ImageIcon, Upload, Copy, QrCode, Eye, EyeOff, Edit, Image, Link2 } from "lucide-react";
import { ShootData } from '@/types/shoots';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FileUploader } from '@/components/media/FileUploader';
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from '@/components/auth/AuthProvider';

interface ShootMediaTabProps {
  shoot: ShootData;
  isPhotographer: boolean;
}

export function ShootMediaTab({ shoot, isPhotographer }: ShootMediaTabProps) {
  const { toast } = useToast();
  const { role } = useAuth();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [slideshowDialogOpen, setSlideshowDialogOpen] = useState(false);
  const [slideshowOrientation, setSlideshowOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [editSlideshowDialogOpen, setEditSlideshowDialogOpen] = useState(false);
  const [currentSlideshow, setCurrentSlideshow] = useState<{id: string, title: string, url: string, visible: boolean} | null>(null);
  
  const isAdmin = ['admin', 'superadmin'].includes(role);
  const isPaid = shoot.payment.totalPaid && shoot.payment.totalPaid >= shoot.payment.totalQuote;
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'h:mm a');
  };
  
  const handleUploadComplete = (files: File[]) => {
    setUploadDialogOpen(false);
    
    toast({
      title: 'Upload Complete',
      description: `Successfully uploaded ${files.length} files for shoot #${shoot.id}`,
    });
  };

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const handleCloseImageView = () => {
    setSelectedImage(null);
  };

  const handleSlideshowCreate = () => {
    // This would call the Ayrshare API in a real implementation
    toast({
      title: 'Slideshow Created',
      description: `Successfully created a ${slideshowOrientation} slideshow with ${selectedPhotos.length} photos`,
    });
    
    // Reset and close dialog
    setSelectedPhotos([]);
    setSlideshowDialogOpen(false);
  };

  const handlePhotoSelect = (photo: string) => {
    if (selectedPhotos.includes(photo)) {
      setSelectedPhotos(selectedPhotos.filter(p => p !== photo));
    } else {
      setSelectedPhotos([...selectedPhotos, photo]);
    }
  };

  const handleEditSlideshow = (slideshow: {id: string, title: string, url: string, visible: boolean}) => {
    setCurrentSlideshow(slideshow);
    setEditSlideshowDialogOpen(true);
  };

  const handleUpdateSlideshow = () => {
    if (!currentSlideshow) return;
    
    toast({
      title: 'Slideshow Updated',
      description: 'Slideshow title has been updated successfully',
    });
    
    setEditSlideshowDialogOpen(false);
  };

  const toggleSlideshowVisibility = (slideshowId: string, currentVisibility: boolean) => {
    toast({
      title: `Slideshow ${currentVisibility ? 'Hidden' : 'Visible'}`,
      description: `The slideshow is now ${currentVisibility ? 'hidden' : 'visible'}`,
    });
  };

  const downloadSlideshow = (url: string) => {
    // In a real implementation this would trigger a download
    toast({
      title: 'Downloading Slideshow',
      description: 'Your slideshow is being downloaded',
    });
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: 'Link Copied',
      description: 'The link has been copied to your clipboard',
    });
  };

  const downloadQRCode = (link: string) => {
    // This would generate and download a QR code for the link
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
              <p className="text-muted-foreground">Photographer: {shoot.photographer.name}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{formatDate(shoot.completedDate || shoot.scheduledDate)}</p>
              <p className="text-sm text-muted-foreground">{formatTime(shoot.completedDate || shoot.scheduledDate)}</p>
            </div>
          </div>
        )}
        
        <Tabs defaultValue="photos" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="tours">Tours & Slideshow</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="photos" className="space-y-4">
            {shoot.media?.photos && shoot.media.photos.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {shoot.media.photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden border cursor-pointer group" onClick={() => handleImageClick(photo)}>
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
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="h-8 w-8 text-white" />
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
                  <Button variant="outline" onClick={() => setSlideshowDialogOpen(true)}>
                    <Image className="h-4 w-4 mr-2" />
                    Create Slideshow
                  </Button>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ImageIcon className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Media Available</h3>
                <p className="text-muted-foreground mt-1 mb-4">
                  {shoot.status === 'completed' 
                    ? 'No media has been uploaded for this shoot yet.' 
                    : 'Media will be available after the shoot is completed.'}
                </p>
                {isPhotographer && shoot.status === 'completed' && (
                  <Button onClick={() => setUploadDialogOpen(true)}>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Upload Media
                  </Button>
                )}
              </div>
            )}
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
                    {shoot.tourLinks.branded && (
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium">Branded Tour</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[300px]">{shoot.tourLinks.branded}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => window.open(shoot.tourLinks?.branded)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => copyLink(shoot.tourLinks?.branded || '')}>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => downloadQRCode(shoot.tourLinks?.branded || '')}>
                            <QrCode className="h-4 w-4 mr-1" />
                            QR
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {shoot.tourLinks.mls && (
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium">MLS Tour</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[300px]">{shoot.tourLinks.mls}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => window.open(shoot.tourLinks?.mls)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => copyLink(shoot.tourLinks?.mls || '')}>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => downloadQRCode(shoot.tourLinks?.mls || '')}>
                            <QrCode className="h-4 w-4 mr-1" />
                            QR
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {shoot.tourLinks.genericMls && (
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium">Generic MLS Tour</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[300px]">{shoot.tourLinks.genericMls}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => window.open(shoot.tourLinks?.genericMls)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => copyLink(shoot.tourLinks?.genericMls || '')}>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => downloadQRCode(shoot.tourLinks?.genericMls || '')}>
                            <QrCode className="h-4 w-4 mr-1" />
                            QR
                          </Button>
                        </div>
                      </div>
                    )}
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
                {shoot.media?.slideshows && shoot.media.slideshows.length > 0 ? (
                  <div className="space-y-4">
                    {shoot.media.slideshows.map((slideshow) => (
                      <div key={slideshow.id} className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium">{slideshow.title}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[300px]">{slideshow.url}</p>
                        </div>
                        <div className="flex gap-2">
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
                ) : (
                  <p className="text-muted-foreground">No slideshows created yet for this property</p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => setSlideshowDialogOpen(true)}>
                  <Image className="h-4 w-4 mr-2" />
                  Create New Slideshow
                </Button>
              </CardFooter>
            </Card>
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
      
      {/* Upload Dialog */}
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
      
      {/* Image View Dialog */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={handleCloseImageView}>
          <DialogContent className="sm:max-w-[90vw] max-h-[90vh] p-0 overflow-hidden">
            <div className="relative w-full h-full" onClick={handleCloseImageView}>
              <img 
                src={selectedImage} 
                alt="Property full view" 
                className="object-contain w-full h-full max-h-[80vh]"
              />
              {!isPaid && (
                <div className="absolute inset-0 bg-white/30 flex items-center justify-center pointer-events-none">
                  <p className="text-primary/70 font-bold text-4xl rotate-[-30deg]">WATERMARK</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Slideshow Creation Dialog */}
      <Dialog open={slideshowDialogOpen} onOpenChange={setSlideshowDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Create Slideshow</DialogTitle>
            <DialogDescription>
              Create a slideshow from selected images for this property.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
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
              <h3 className="text-sm font-medium mb-2">Select Photos</h3>
              {shoot.media?.photos && shoot.media.photos.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[400px] overflow-y-auto p-1">
                  {shoot.media.photos.map((photo, index) => (
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
              ) : (
                <p className="text-muted-foreground">No photos available to create a slideshow</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setSlideshowDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSlideshowCreate}
              disabled={selectedPhotos.length === 0}
            >
              Create Slideshow
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit Slideshow Dialog */}
      <Dialog open={editSlideshowDialogOpen} onOpenChange={setEditSlideshowDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Slideshow</DialogTitle>
          </DialogHeader>
          
          {currentSlideshow && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="slideshowTitle">Slideshow Title</Label>
                <Input 
                  id="slideshowTitle" 
                  value={currentSlideshow.title}
                  onChange={(e) => setCurrentSlideshow({...currentSlideshow, title: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="slideshowUrl">Slideshow URL (Read Only)</Label>
                <Input 
                  id="slideshowUrl" 
                  value={currentSlideshow.url}
                  readOnly
                  disabled
                />
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
    </>
  );
}
